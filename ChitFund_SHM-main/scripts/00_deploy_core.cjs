const hre = require('hardhat');
require('dotenv').config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deployer:', deployer.address);

  const deployOverrides = { gasLimit: 8000000 };

  const Rep = await hre.ethers.getContractFactory('ReputationSystem');
  const rep = await Rep.deploy(deployOverrides);
  await rep.waitForDeployment();
  console.log('ReputationSystem:', await rep.getAddress());

  const Factory = await hre.ethers.getContractFactory('ChitFundFactory');
  const factory = await Factory.deploy(deployOverrides);
  await factory.waitForDeployment();
  console.log('ChitFundFactory:', await factory.getAddress());

  const tx = await factory.setReputationSystem(await rep.getAddress());
  await tx.wait();
  console.log('Reputation wired');
}

main().catch((e)=>{
  console.error(e);
  process.exitCode = 1;
}); 