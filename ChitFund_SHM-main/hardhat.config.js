import 'dotenv/config';
import '@nomicfoundation/hardhat-toolbox';

const { RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: false
    }
  },
  networks: {
    shardeum: {
      url: RPC_URL || '',
      chainId: Number(process.env.CHAIN_ID || 8082),
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || ''
  }
};

export default config; 