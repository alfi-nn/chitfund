import 'dotenv/config';
import hre from 'hardhat';

async function main() {
  const factoryAddr = process.env.FACTORY_ADDR;
  if (!factoryAddr) throw new Error('Set FACTORY_ADDR in .env');

  const factory = await hre.ethers.getContractAt('ChitFundFactory', factoryAddr);

  const [signer] = await hre.ethers.getSigners();
  const settings = {
    minMembers: Number(process.env.MIN_MEMBERS || 5),
    maxMembers: Number(process.env.MAX_MEMBERS || 100),
    minContribution: BigInt(process.env.MIN_CONTRIB || '1'),
    maxOrganizerFeeBps: Number(process.env.MAX_FEE_BPS || 1000),
    feeTreasury: process.env.FEE_TREASURY || signer.address,
  };

  const tx = await factory.setGlobalSettings(settings);
  await tx.wait();
  console.log('Settings updated');
}

main().catch((e)=>{
  console.error(e);
  process.exitCode = 1;
}); 