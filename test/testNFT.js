require('dotenv').config();
const hre = require('hardhat');
const { expect } = require('chai');
const { ethers } = hre;

async function main() {
  const provider = ethers.provider;
  const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const NFTArtifact = require('../artifacts/contracts/NFT.sol/NFT.json');
  const TokenArtifact = require('../artifacts/contracts/Token.sol/Token.json');

  const nft = new ethers.Contract(process.env.NFT_CONTRACT, NFTArtifact.abi, owner);
  const token = new ethers.Contract(process.env.TOKEN_CONTRACT, TokenArtifact.abi, owner);

  console.log('\n1️⃣ Минтим 1 NFT...');
  try {
    const tx = await nft.connect(owner).mintDaily();
    await tx.wait();
  } catch {
    console.log('Can mint once per day');
  }

  await getUserNFTs(owner.address, nft);

  console.log('\n2️⃣ Тестируем startUpgrade...');
  await testStartUpgrade(nft, owner);

  console.log('\n3️⃣ Тестируем finishUpgrade...');
  await testFinishUpgrade(nft, owner);

  console.log('\n4️⃣ Проверка URI...');
  await testTokenURI(nft);

  console.log('\n5️⃣ Проверка getTokenIdsByRarity...');
  await testGetTokenIdsByRarity(nft);

  console.log('\n✅ Все тесты прошли успешно!');
}

async function getUserNFTs(userAddress, nft) {
  const ids = [0, 1, 2, 3, 4, 5];
  let total = 0;
  for (const id of ids) {
    const bal = await nft.balanceOf(userAddress, id);
    total += Number(bal);
    if (bal > 0) console.log(`→ tokenId ${id}: ${bal}`);
  }
  console.log(`Всего NFT: ${total}`);
}

async function testStartUpgrade(nft, user) {
  const commonIds = await nft.getTokenIdsByRarity(1); // COMMON = 0
  let totalBefore = 0;
  for (let id of commonIds) {
    totalBefore += Number(await nft.balanceOf(user.address, id));
  }
  console.log('→ Всего COMMON до сжигания:', totalBefore);

  const tx = await nft.connect(user).startUpgrade(1); // 0 = COMMON
  await tx.wait();

  let totalAfter = 0;
  for (let id of commonIds) {
    totalAfter += Number(await nft.balanceOf(user.address, id));
  }
  console.log('→ Всего COMMON после сжигания:', totalAfter);

  expect(totalAfter).to.equal(totalBefore - 3);
}

async function testFinishUpgrade(nft, user) {
  const mythicalIds = await nft.getTokenIdsByRarity(2); // MYTHICAL = 1
  let totalBefore = 0;
  for (let id of mythicalIds) {
    totalBefore += Number(await nft.balanceOf(user.address, id));
  }
  console.log('→ Всего MYTHICAL до апгрейда:', totalBefore);

  const tx = await nft.connect(user).finishUpgrade(1); // 0 = upgrading from COMMON → MYTHICAL
  await tx.wait();

  let totalAfter = 0;
  for (let id of mythicalIds) {
    totalAfter += Number(await nft.balanceOf(user.address, id));
  }
  console.log('→ Всего MYTHICAL после апгрейда:', totalAfter);

  expect(totalAfter).to.equal(totalBefore + 1);
}

async function testTokenURI(nft) {
  const uri = await nft.uri(0);
  console.log('→ URI для tokenId 0:', uri);
  expect(uri).to.be.a('string').and.not.empty;
}

async function testGetTokenIdsByRarity(nft) {
  const common = await nft.getTokenIdsByRarity(0);
  const mythical = await nft.getTokenIdsByRarity(1);
  const legendary = await nft.getTokenIdsByRarity(2);

  console.log(
    '→ Common:',
    common.map((id) => id.toString()),
  );
  console.log(
    '→ Mythical:',
    mythical.map((id) => id.toString()),
  );
  console.log(
    '→ Legendary:',
    legendary.map((id) => id.toString()),
  );

  expect(common.length).to.equal(3);
  expect(mythical.length).to.equal(2);
  expect(legendary.length).to.equal(1);
}

main().catch((err) => {
  console.error('❌ Ошибка:', err);
  process.exit(1);
});
