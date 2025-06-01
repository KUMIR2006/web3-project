import React, { useState, useEffect } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContract,
  useBlockNumber,
} from 'wagmi';

import { readContract } from '@wagmi/core';
import { config } from '../config';

import PixelCard from '../blocks/Components/PixelCard/PixelCard';
import Arrow from './Arrow';
import UpgradeCard from './UpgradeCard';
import CurrentCart from './CurrentCards';

// Update this with your deployed contract address
const NFT_CONTRACT_ADDRESS = '0x04Df2332aC00089a3638ADbdFa1617d23Cf7777B';

// Updated ABI for your NFT contract
const NFT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'needed', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'enum NFT.Rarity', name: 'rarity', type: 'uint8' },
    ],
    name: 'NFTMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'rarity', type: 'uint256' },
    ],
    name: 'UpgradeStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'newRarity', type: 'uint256' },
    ],
    name: 'UpgradeCompleted',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'currentRarity', type: 'uint256' }],
    name: 'finishUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'enum NFT.Rarity', name: 'rarity', type: 'uint8' }],
    name: 'getTokenIdsByRarity',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'lastMintTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintDaily',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'currentRarity', type: 'uint256' }],
    name: 'startUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'upgradeRequests',
    outputs: [
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
      { internalType: 'bool', name: 'isCreated', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Type definitions
interface NFT {
  tokenId: number;
  balance: number;
  rarity: number;
}

interface Activity {
  type: 'mint' | 'upgrade_start' | 'upgrade_complete';
  message: string;
  timestamp: number;
  rarity: number;
}

type UserNFTCollection = {
  common: { tokenId: number; balance: number }[];
  mythical: { tokenId: number; balance: number }[];
  legendary: { tokenId: number; balance: number }[];
};

const Nft = () => {
  const { isConnected, address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // State for user's NFT collection
  const [userNFTs, setUserNFTs] = useState<UserNFTCollection>({
    common: [],
    mythical: [],
    legendary: [],
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [upgradingCommon, setUpgradingCommon] = useState<boolean>(false);
  const [upgradingMythical, setUpgradingMythical] = useState<boolean>(false);
  const [mintCooldown, setMintCooldown] = useState<number>(0);

  // Contract interactions
  const {
    writeContract,
    isPending: isMinting,
    isSuccess: isConfirmed,
    data: mintTxHash,
  } = useWriteContract();
  const { writeContract: upgradeContract, isPending: isUpgrading } = useWriteContract();

  // Transaction receipts
  const { isLoading: isMintConfirming, isSuccess: isMintConfirmed } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  // Read last mint time for cooldown
  const { data: lastMintTime, refetch } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'lastMintTime',
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  // Get token IDs by rarity
  const { data: commonTokenIds } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'getTokenIdsByRarity',
    args: [0], // COMMON
  });

  const { data: mythicalTokenIds } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'getTokenIdsByRarity',
    args: [1], // MYTHICAL
  });

  const { data: legendaryTokenIds } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'getTokenIdsByRarity',
    args: [2], // LEGENDARY
  });

  // Watch for upgrade started
  const fetchUpgradeData = async () => {
    if (!address) return;

    try {
      const [common, mythical] = await Promise.all([
        readContract(config, {
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_ABI,
          functionName: 'upgradeRequests',
          args: [address, BigInt(0)],
        }),
        readContract(config, {
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_ABI,
          functionName: 'upgradeRequests',
          args: [address, BigInt(1)],
        }),
      ]);

      setUpgradingCommon(common[1]); // например, startedAt
      setUpgradingMythical(mythical[1]);

      console.log('Common:', common[1]);
      console.log('Mythical:', mythical[1]);
    } catch (error) {
      console.error('Ошибка при получении upgradeRequests:', error);
    }
  };

  // Fetch user's NFT balances
  const fetchUserNFTs = async () => {
    if (!address || !commonTokenIds || !mythicalTokenIds || !legendaryTokenIds) return;

    try {
      const commonIds = Array.isArray(commonTokenIds) ? commonTokenIds : [];
      const mythicalIds = Array.isArray(mythicalTokenIds) ? mythicalTokenIds : [];
      const legendaryIds = Array.isArray(legendaryTokenIds) ? legendaryTokenIds : [];

      const allTokenIds = [...commonIds, ...mythicalIds, ...legendaryIds];

      const balances = await Promise.all(
        allTokenIds.map(async (tokenId) => {
          const id = typeof tokenId === 'bigint' ? Number(tokenId) : tokenId;

          const balance = await readContract(config, {
            address: NFT_CONTRACT_ADDRESS,
            abi: NFT_ABI,
            functionName: 'balanceOf',
            args: [address, BigInt(id)],
          });

          return {
            tokenId: id,
            balance: Number(balance),
            rarity: id < 3 ? 0 : id < 5 ? 1 : 2,
          };
        }),
      );

      const categorized: UserNFTCollection = {
        common: balances
          .filter((nft) => nft.rarity === 0)
          .map((nft) => ({
            tokenId: nft.tokenId,
            balance: nft.balance,
          })),
        mythical: balances
          .filter((nft) => nft.rarity === 1)
          .map((nft) => ({
            tokenId: nft.tokenId,
            balance: nft.balance,
          })),
        legendary: balances
          .filter((nft) => nft.rarity === 2)
          .map((nft) => ({
            tokenId: nft.tokenId,
            balance: nft.balance,
          })),
      };

      setUserNFTs(categorized);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  // Handle minting
  const handleMint = async () => {
    if (!isConnected) return alert('Connect wallet first');
    if (mintCooldown > 0) return alert('Mint cooldown active');

    try {
      await writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mintDaily',
      });
      setMintCooldown(1);
    } catch (error) {
      console.error('Mint failed:', error);
      alert('Mint failed. Please try again.');
    }
  };

  // Handle upgrade start
  const handleStartUpgrade = async (rarity: number) => {
    if (!isConnected) return alert('Connect wallet first');

    const requiredCount = 3;
    const availableCount =
      rarity === 0
        ? userNFTs.common.reduce((sum, nft) => sum + nft.balance, 0)
        : userNFTs.mythical.reduce((sum, nft) => sum + nft.balance, 0);

    if (availableCount < requiredCount) {
      return alert(`You need ${requiredCount} NFTs to upgrade. You have ${availableCount}.`);
    }

    try {
      await upgradeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'startUpgrade',
        args: [BigInt(rarity)],
      });
    } catch (error) {
      console.error('Upgrade start failed:', error);
      alert('Upgrade failed. Please try again.');
    }
  };

  // Handle upgrade finish
  const handleFinishUpgrade = async (rarity: number) => {
    if (!isConnected) return alert('Connect wallet first');

    try {
      await upgradeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'finishUpgrade',
        args: [BigInt(rarity)],
      });
      fetchUpgradeData();
    } catch (error) {
      console.error('Upgrade finish failed:', error);
      alert('Upgrade completion failed. Please try again.');
    }
  };

  // Calculate mint cooldown
  useEffect(() => {
    if (lastMintTime && blockNumber) {
      const now = Math.floor(Date.now() / 1000);
      const cooldownEnd = Number(lastMintTime) + 23 * 60 * 60; // 23 hours
      const remaining = Math.max(0, cooldownEnd - now);
      setMintCooldown(remaining);
    }
  }, [lastMintTime, blockNumber]);

  // Format time remaining
  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Fetch NFTs on mount and address change
  useEffect(() => {
    if (address) {
      fetchUserNFTs();
      fetchUpgradeData();
    }
  }, [address, commonTokenIds, mythicalTokenIds, legendaryTokenIds, blockNumber]);

  return (
    <div className="flex flex-col justify-between self-center items-center min-w-180 min-h-190 h-23 bg-[#070907]/40 p-[40px] rounded-3xl text-sm md:text-lg">
      {/* Recent Activity Feed */}
      {recentActivity.length > 0 && (
        <div className="w-full mb-6 p-4 bg-[#0a0a0a]/60 rounded-xl">
          <h3 className="text-center text-lg mb-3">Recent Activity</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <div key={index} className="text-sm opacity-80">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    activity.type === 'mint'
                      ? 'bg-green-400'
                      : activity.type === 'upgrade_start'
                      ? 'bg-yellow-400'
                      : 'bg-purple-400'
                  }`}></span>
                {activity.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MINT AND UPGRADE NFT */}
      <div className="flex justify-center gap-[100px]">
        <div className="">
          <div className="text-center text-[22px]">Mint new NFT</div>
          <div className="flex h-[390px] items-center justify-center">
            <div
              className={`cursor-pointer max-h-[250px] max-w-[250px] ${
                mintCooldown > 0 || isMinting ? 'opacity-50' : ''
              }`}
              onClick={handleMint}>
              <PixelCard
                variant="pink"
                className="max-h-[250px] max-w-[250px]"
                colors="#94459b, #3346d6, #415C90"
                noFocus={true}
                border="#ffffff">
                <div className="absolute text-[30px] select-none font-semibold mix-blend-difference text-[rgb(166,166,166)] text-center">
                  {isMinting ? 'MINTING...' : mintCooldown > 0 ? 'COOLDOWN' : 'MINT NFT'}
                  {mintCooldown > 0 && (
                    <p className="text-[14px]">{formatTimeRemaining(mintCooldown)} remaining</p>
                  )}
                  {mintCooldown === 0 && <p className="text-[14px]">available every 24 hours</p>}
                </div>
              </PixelCard>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[20px]">
          <div className="text-center text-[22px]">
            <h1>Upgrade NFT</h1>
          </div>

          {/* Common to Mythical Upgrade */}
          <div>
            <div className="flex gap-[10px]">
              <UpgradeCard
                title="Burn 3 Common"
                count={userNFTs.common.reduce((sum, nft) => sum + nft.balance, 0)}
                borderColor="#a07b3b"
                colors="#ad7806, #a38c4c, #332910"
                textColor="#a07b3b"
                type="burn"
                onClick={() => handleStartUpgrade(0)}
                disabled={
                  userNFTs.common.reduce((sum, nft) => sum + nft.balance, 0) < 3 || upgradingCommon
                }
              />

              {upgradingCommon === false ? (
                <Arrow firstColor="#8c6b2f" secondColor="rgba(166,166,166,0.2)" upgrading={true} />
              ) : (
                <Arrow firstColor="rgba(166,166,166,0.2)" secondColor="#4f4f9e" upgrading={false} />
              )}

              <UpgradeCard
                title={upgradingCommon === true ? 'Click to Complete' : 'Get 1 Mythical'}
                borderColor="#4f4f9e"
                colors="#254196, #2f5fce, #7474e8"
                textColor="#4f4fad"
                type="get"
                onClick={() => handleFinishUpgrade(0)}
                animate={upgradingCommon === true}
                disabled={!upgradingCommon}
              />
            </div>
          </div>

          {/* Mythical to Legendary Upgrade */}
          <div>
            <div className="flex gap-[10px]">
              <UpgradeCard
                title="Burn 3 Mythical"
                count={userNFTs.mythical.reduce((sum, nft) => sum + nft.balance, 0)}
                borderColor="#4f4f9e"
                colors="#254196, #2f5fce, #7474e8"
                textColor="#4f4f9e"
                type="burn"
                onClick={() => handleStartUpgrade(1)}
                disabled={
                  userNFTs.mythical.reduce((sum, nft) => sum + nft.balance, 0) < 3 ||
                  upgradingMythical
                }
              />

              {upgradingMythical === false ? (
                <Arrow firstColor="#4f4f9e" secondColor="rgba(166,166,166,0.2)" upgrading={true} />
              ) : (
                <Arrow firstColor="rgba(166,166,166,0.2)" secondColor="#7f4484" upgrading={false} />
              )}

              <UpgradeCard
                title={upgradingMythical === true ? 'Click to Complete' : 'Get 1 Legendary'}
                borderColor="#94459b"
                colors="#94459b, #3346d6, #415C90"
                textColor="#7f4484"
                type="get"
                onClick={() => handleFinishUpgrade(1)}
                animate={upgradingMythical === true}
                disabled={!upgradingMythical}
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Collection Display */}
      <div className="w-full border-t-1">
        <div className="mt-[20px] text-center">Your collection</div>
        <div className="flex justify-between mt-[20px] overflow-x-auto gap-4">
          {/* Display user's actual NFTs */}
          {[...userNFTs.common, ...userNFTs.mythical, ...userNFTs.legendary]
            .slice(0, 6)
            .map((nft, index) => (
              <CurrentCart
                amount={nft.balance}
                id={index}
                color={index > 4 ? '#94459b' : index > 2 ? '#4f4f9e' : '#a07b3b'}
                alt="Affiliate Voyager"
                circleText={`x${nft.balance}`}
              />
            ))}

          {/* Show placeholder if no NFTs */}
          {userNFTs.common.length + userNFTs.mythical.length + userNFTs.legendary.length === 0 && (
            <div className="text-center text-gray-400 w-full py-8">
              No NFTs yet. Start by minting your first Voyager!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nft;
