// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20("Affiliate", "AFFILIATE"), Ownable(msg.sender) {
    
    function mintHundred() public{
        _mint(msg.sender, 100 * 10**18);
    }

    function mintForOwner(uint amount) public onlyOwner{
        _mint(msg.sender, amount * 10**18);
    }

    function burn(uint amount) public {
        _burn(msg.sender, amount * 10**18);
    }
}