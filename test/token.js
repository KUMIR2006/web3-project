require('dotenv').config();
const hre = require('hardhat');
const ethers = hre.ethers;
const TokenArtifact = require('../artifacts/contracts/Token.sol/Token.json');

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY not found in .env');
  }

  const provider = ethers.provider;

  const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const user = new ethers.Wallet(process.env.PRIVATE_KEY2, provider);

  const contractAddress = '0xBC2C66457cb9DaE27377028dBAf4053F84499c45';

  const token = new ethers.Contract(contractAddress, TokenArtifact.abi, owner);

  console.log('\n1. Проверка mintHundred() user');
  await token.connect(user).mintHundred();
  console.log('Баланс пользователя:', await token.balanceOf(user.address));

  console.log('\n2. Проверка mintHundred() owner');
  await token.connect(owner).mintHundred();
  console.log('Баланс пользователя:', await token.balanceOf(owner.address));

  console.log('\n3. Проверка mintForOwner()');
  await token.connect(owner).mintForOwner(1000);
  console.log('Баланс владельца:', await token.balanceOf(owner.address));

  console.log('\n4. Проверка burn() user');
  await token.connect(user).burn(75);
  console.log('Баланс пользователя после сжигания:', await token.balanceOf(user.address));

  console.log('\n5. Проверка защиты mintForOwner()');
  try {
    await token.connect(user).mintForOwner(100);
    console.log('ОШИБКА: не-владелец смог вызвать mintForOwner');
  } catch {
    console.log('УСПЕХ: mintForOwner защищен');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
