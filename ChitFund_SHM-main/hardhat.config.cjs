require('dotenv').config();
require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-chai-matchers');

const { RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
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
  }
}; 