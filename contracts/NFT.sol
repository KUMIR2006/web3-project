// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC1155, Ownable {
    string public constant name = "Affiliate Voyagers";
    string public symbol = "AFFILIATE";

    enum Rarity { COMMON, MYTHICAL, LEGENDARY }

    struct NFTType {
        uint256 id;
        string nameNft;
        Rarity rarity;
        string uri;
    }

    struct UpgradeRequest {
        uint256 timestamp;
        bool isCreated;
    }

    mapping(address => mapping(uint256 => UpgradeRequest)) public upgradeRequests;

    NFTType[] public nftTypes;
    mapping(uint256 => uint256[]) public rarityToTokenIds;
    mapping(address => uint256) public lastMintTime;
    mapping(uint256 => string) private _tokenNames;

    event NFTMinted(address indexed user, uint256 tokenId, Rarity rarity);
    event UpgradeStarted(address indexed user, uint256 rarity);
    event UpgradeCompleted(address indexed user, uint256 tokenId, uint256 newRarity);

    constructor() ERC1155("ipfs://bafybeigvhkzlbjfup3ne63pxgxrstwrmvvvkj2uvqts7smdaidi4ss3doy/{id}.json") Ownable(msg.sender) {
        _addNftType(Rarity.COMMON, "Common Voyager");
        _addNftType(Rarity.COMMON, "Common Voyager");
        _addNftType(Rarity.COMMON, "Common Voyager");
        _addNftType(Rarity.MYTHICAL, "Mythical Voyager");
        _addNftType(Rarity.MYTHICAL, "Mythical Voyager");
        _addNftType(Rarity.LEGENDARY, "Legendary Voyager");
    }


    function tokenName(uint256 tokenId) public view returns (string memory) {
        return _tokenNames[tokenId];
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "COMMON";
        if (value == 1) return "MYTHICAL";
        return "LEGENDARY";
    }

    function _addNftType(Rarity rarity, string memory nameNft) private {
        uint256 id = nftTypes.length;
        nftTypes.push(NFTType(id, nameNft, rarity, ""));
        rarityToTokenIds[uint256(rarity)].push(id);
        _tokenNames[id] = nameNft;
    }

    function mintDaily() external {
        require(block.timestamp >= lastMintTime[msg.sender] + 23 hours, "Can mint once per day");

        Rarity rarity = _getRandomRarity();

        uint256[] memory availableIds = rarityToTokenIds[uint256(rarity)];
        require(availableIds.length > 0, "No NFTs available");

        uint256 randomIndex = _random(availableIds.length);
        uint256 tokenId = availableIds[randomIndex];
       
        _mint(msg.sender, tokenId, 1, "");
        lastMintTime[msg.sender] = block.timestamp;

        emit NFTMinted(msg.sender, tokenId, rarity);
    }

    function startUpgrade(uint256 currentRarity) external {
        require(currentRarity < uint(Rarity.LEGENDARY), "Max rarity reached");
        require(!upgradeRequests[msg.sender][currentRarity].isCreated, "Already upgrading this rarity");

        // Сжигаем 3 NFT
        uint256[] memory tokenIds = rarityToTokenIds[currentRarity];
        uint256 burned;
        for (uint i = 0; i < tokenIds.length && burned < 3; i++) {
            uint256 bal = balanceOf(msg.sender, tokenIds[i]);
            if (bal == 0) continue;

            uint256 toBurn = (3 - burned) > bal ? bal : (3 - burned);
            _burn(msg.sender, tokenIds[i], toBurn);
            burned += toBurn;
        }
        require(burned == 3, "Insufficient NFTs burned");

        // Сохраняем запрос
        upgradeRequests[msg.sender][currentRarity] = UpgradeRequest({
            timestamp: block.timestamp,
            isCreated: true
        });

        emit UpgradeStarted(msg.sender, currentRarity);
    }

    function finishUpgrade(uint256 currentRarity) external {
        require(currentRarity < uint(Rarity.LEGENDARY), "No further upgrade possible");

        UpgradeRequest storage request = upgradeRequests[msg.sender][currentRarity];
        require(request.isCreated, "Upgrade already completed");

        uint256 nextRarity = currentRarity + 1;
        uint256[] memory nextRarityIds = rarityToTokenIds[nextRarity];
        require(nextRarityIds.length > 0, "No NFTs in next tier");

        uint256 randomIndex = uint256(keccak256(abi.encodePacked(
            block.prevrandao,
            msg.sender,
            block.timestamp,
            currentRarity
        ))) % nextRarityIds.length;

        _mint(msg.sender, nextRarityIds[randomIndex], 1, "");
        request.isCreated = false;

        emit UpgradeCompleted(msg.sender, newTokenId, nextRarity);
    }

    function min(uint a, uint b) private pure returns (uint) {
        return a < b ? a : b;
    }

    function _getRandomRarity() private view returns (Rarity) {
        uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 100;
        if (rand < 70) return Rarity.COMMON;
        if (rand < 95) return Rarity.MYTHICAL;
        return Rarity.LEGENDARY;
    }

    function _random(uint256 max) private view returns (uint256) {
        require(max > 0, "Max cannot be zero");
        uint256 seed = uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        return seed % max;
    }

    function getTokenIdsByRarity(Rarity rarity) external view returns (uint256[] memory) {
        return rarityToTokenIds[uint256(rarity)];
    }
}
