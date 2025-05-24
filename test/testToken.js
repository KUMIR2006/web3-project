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

  const contractAddress = '0x389b332edd1099081f00257F18fFB35Fc10025A0';

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

  // console.log('\nЗапуск 100 mint операций с задержкой 300 мс...');
  // await runMintOperations(token, owner);
  // console.log('Все 100 mint операций завершены!');
}

async function runMintOperations(token, owner) {
  for (let i = 0; i < 1000; i++) {
    console.log(`\nMint операция #${i + 1}`);
    const tx = await token.connect(owner).mintForOwner(1000);
    await tx.wait();
    console.log('Баланс владельца:', await token.balanceOf(owner.address));

    if (i < 999) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
