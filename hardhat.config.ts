import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const config: HardhatUserConfig = {
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
      // url: `https://monad-testnet.blockvision.org/v1/${process.env.BLOCKVISION_API_KEY}`,
      url: `https://testnet-rpc.monad.xyz`,
      accounts: [process.env.PRIVATE_KEY!],
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

export default config;
