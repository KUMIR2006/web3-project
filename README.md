# Web3 Project — Affiliate NFT Mint & Upgrade dApp

A simple decentralized application (dApp) built with **Solidity**, **Hardhat**, and **Vite + React frontend**, demonstrating minting, upgrading, and interacting with an **ERC-1155 smart contract** using rarity-based NFT logic.

---

## 🔥 Mechanics

This dApp implements the following logic:

### 1. $Affiliate Token (ERC-20)

- Users must **mint** a `$Affiliate` token (ERC-20).
- The token is **burned** to access NFT functionality (one-time action per user).

### 2. NFT Minting (ERC-1155)

- Once per day, users can mint a random NFT.
- Rarity is randomly assigned based on chance:
  - 🟠 **Common** — 70%
  - 🔵 **Mythical** — 25%
  - 🟣 **Legendary** — 5%

### 3. NFT Upgrading

NFTs can be upgraded through **burning 3 NFTs of the same lower rarity** to get a new one of a higher tier.  
The upgrade works in **2 steps**:

- 🔥 **Burn Phase**: 3 NFTs of the same rarity are burned permanently.
- ✨ **Mint Phase**: 1 new NFT is minted, of a higher rarity, randomly selected from the next tier.

| From     | To        | Burn Requirement |
| -------- | --------- | ---------------- |
| Common   | Mythical  | 3 Common NFTs    |
| Mythical | Legendary | 3 Mythical NFTs  |

Each upgrade also returns a **random NFT** from the higher tier.

### 4. NFT Tracker

- The dApp includes an on-chain **tracker of the number of NFTs owned per rarity**.

---

## 🔧 Tech Stack

- **Smart Contracts**: Solidity (ERC-20 + ERC-1155)
- **Framework**: Hardhat
- **Frontend**: Vite + React
- **Wallet Support**: Reown
- **Network**: Monad Testnet

---

## 👤 Author

**Kurbanov Mirzobek**  
[GitHub: @KUMIR2006](https://github.com/KUMIR2006)  
Telegram: [@creaiser](https://t.me/creaiser)
