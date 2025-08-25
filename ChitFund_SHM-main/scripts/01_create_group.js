import 'dotenv/config';
import hre from 'hardhat';

async function main() {
  const factoryAddr = process.env.FACTORY_ADDR;
  if (!factoryAddr) throw new Error('Set FACTORY_ADDR in .env');

  const [signer] = await hre.ethers.getSigners();
  const factory = await hre.ethers.getContractAt('ChitFundFactory', factoryAddr);

  const now = Math.floor(Date.now() / 1000);
  const cfg = {
    organizer: signer.address,
    currency: process.env.CURRENCY_ADDR || hre.ethers.ZeroAddress,
    contributionAmount: BigInt(process.env.CONTRIB || '1000000000000000000'),
    membersMax: Number(process.env.MEMBERS_MAX || 20),
    durationPeriods: Number(process.env.DURATION || 20),
    startTime: Number(process.env.START_TIME || (now + 3600)),
    organizerFeeBps: Number(process.env.FEE_BPS || 500),
    securityDeposit: BigInt(process.env.SEC_DEPOSIT || '0'),
    biddingCommitDuration: Number(process.env.COMMIT_SEC || 1800),
    biddingRevealDuration: Number(process.env.REVEAL_SEC || 1800),
    periodDuration: Number(process.env.PERIOD_SEC || (30 * 24 * 3600))
  };

  const tx = await factory.createChitGroup(cfg);
  const receipt = await tx.wait();
  const ev = receipt.logs
    .map(l => { try { return factory.interface.parseLog(l); } catch { return null; }})
    .find(e => e && e.name === 'GroupCreated');
  console.log('GroupCreated at:', ev ? ev.args.group : 'n/a');
}

main().catch((e)=>{
  console.error(e);
  process.exitCode = 1;
}); 