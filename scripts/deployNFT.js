const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  const NFT = await hre.ethers.getContractFactory('NFT');

  const nft = await NFT.deploy();
  await nft.waitForDeployment();

  console.log('NFT contract deployed to:', await nft.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
