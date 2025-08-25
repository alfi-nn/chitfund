import 'dotenv/config';
import hre from 'hardhat';

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deployer:', deployer.address);

  const fee = await hre.ethers.provider.getFeeData();
  const overrides = {
    gasLimit: 15_000_000,
    maxFeePerGas: fee.maxFeePerGas ?? undefined,
    maxPriorityFeePerGas: fee.maxPriorityFeePerGas ?? undefined,
  };

  const Rep = await hre.ethers.getContractFactory('ReputationSystem');
  const rep = await Rep.deploy(overrides);
  await rep.waitForDeployment();
  console.log('ReputationSystem:', await rep.getAddress());

  const Factory = await hre.ethers.getContractFactory('ChitFundFactory');
  const factory = await Factory.deploy(overrides);
  await factory.waitForDeployment();
  console.log('ChitFundFactory:', await factory.getAddress());

  const tx = await factory.setReputationSystem(await rep.getAddress(), overrides);
  await tx.wait();
  console.log('Reputation wired');
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
}); 