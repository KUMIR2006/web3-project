// hardhat.config.cjs
require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.20',
};
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const config = {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 60000,
      },
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
        count: 20,
        accountsBalance: '10000000000000000000000',
      },
      allowUnlimitedContractSize: false,
      blockGasLimit: 30000000,
    },
    'monad-testnet': {
      url: `https://testnet-rpc.monad.xyz`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 10143, // Chain ID Monad Testnet
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 40000,
  },
};

module.exports = config;
