const hre = require('hardhat');
const ethers = hre.ethers;

async function main() {
  const [signer] = await hre.ethers.getSigners();

  const Token = await ethers.getContractFactory('Token', signer);
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log(await token.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
