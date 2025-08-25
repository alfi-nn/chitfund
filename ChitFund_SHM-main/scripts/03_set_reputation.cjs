const hre = require('hardhat');
require('dotenv').config();

async function main() {
  const factoryAddr = process.env.FACTORY_ADDR;
  const repAddr = process.env.REPUTATION_ADDR;
  if (!factoryAddr || !repAddr) throw new Error('Set FACTORY_ADDR and REPUTATION_ADDR');

  const factory = await hre.ethers.getContractAt('ChitFundFactory', factoryAddr);
  const tx = await factory.setReputationSystem(repAddr);
  await tx.wait();
  console.log('Reputation set:', repAddr);
}

main().catch((e)=>{
  console.error(e);
  process.exitCode = 1;
}); 