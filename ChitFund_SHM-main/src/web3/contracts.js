import { ethers } from 'ethers';
import { getProvider, getSigner } from './provider.js';
import { ADDRESSES } from './config.js';
import ChitFundFactoryAbi from '../abis/ChitFundFactory.json';
import ChitGroupAbi from '../abis/ChitGroup.json';

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

function getContract(address, abi, signerOrProvider) {
  return new ethers.Contract(address, abi, signerOrProvider);
}

export function getFactory(readonly = true) {
  const p = readonly ? getProvider() : undefined;
  const signerOrProvider = readonly ? p : undefined;
  return getContract(ADDRESSES.ChitFundFactory, ChitFundFactoryAbi, signerOrProvider ?? p);
}

export function getGroup(address, readonly = true) {
  const provider = getProvider();
  return getContract(address, ChitGroupAbi, provider);
}

export async function readGroupBasics(address) {
  const group = getGroup(address, true);
  const [cfg, currentCycle, phase] = await Promise.all([
    group.cfg(),
    group.currentCycle(),
    group.currentPhase(),
  ]);
  return { cfg, currentCycle: Number(currentCycle), phase: Number(phase) };
}

export async function createGroup(cfg) {
  if (!ADDRESSES.ChitFundFactory || !ethers.isAddress(ADDRESSES.ChitFundFactory)) {
    throw new Error('Invalid ChitFundFactory address in src/web3/config.js');
  }
  const signer = await getSigner();
  const factory = new ethers.Contract(ADDRESSES.ChitFundFactory, ChitFundFactoryAbi, signer);
  const organizer = await signer.getAddress();
  const cfgWithOrganizer = { ...cfg, organizer };
  const tx = await factory.createChitGroup(cfgWithOrganizer);
  const receipt = await tx.wait();
  const ev = receipt.logs
    .map(l => {
      try { return factory.interface.parseLog(l); } catch { return null; }
    })
    .find(e => e && e.name === 'GroupCreated');
  return ev ? ev.args.group : null;
}

export async function listGroups() {
  const factory = getFactory(true);
  return await factory.getActiveGroups();
}

export async function joinGroup(groupAddress, valueWei = '0') {
  const signer = await getSigner();
  const group = new ethers.Contract(groupAddress, ChitGroupAbi, signer);
  const tx = await group.joinGroup({ value: valueWei });
  return await tx.wait();
}

export function computeCommitHash(amount, saltHex) {
  return ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(['uint256','bytes32'], [amount, saltHex]));
}

export async function commitBid(groupAddress, amount, saltHex) {
  const signer = await getSigner();
  const group = new ethers.Contract(groupAddress, ChitGroupAbi, signer);
  const hash = computeCommitHash(amount, saltHex);
  const tx = await group.commitBid(hash);
  return await tx.wait();
}

export async function revealBid(groupAddress, amount, saltHex) {
  const signer = await getSigner();
  const group = new ethers.Contract(groupAddress, ChitGroupAbi, signer);
  const tx = await group.revealBid(amount, saltHex);
  return await tx.wait();
}

export async function contribute(groupAddress, amountWei, isNative = true) {
  const signer = await getSigner();
  const group = new ethers.Contract(groupAddress, ChitGroupAbi, signer);
  const overrides = isNative ? { value: amountWei } : {};
  const tx = await group.makeContribution(amountWei, overrides);
  return await tx.wait();
}

export async function openCycle(groupAddress, cycle) {
  const signer = await getSigner();
  const group = new ethers.Contract(groupAddress, ChitGroupAbi, signer);
  const tx = await group.openCycle(cycle);
  return await tx.wait();
}

export async function finalizeBidding(groupAddress) {
  const signer = await getSigner();
  const group = new ethers.Contract(groupAddress, ChitGroupAbi, signer);
  const tx = await group.finalizeBidding();
  return await tx.wait();
}

export async function distributeFunds(groupAddress) {
  const signer = await getSigner();
  const group = new ethers.Contract(groupAddress, ChitGroupAbi, signer);
  const tx = await group.distributeFunds();
  return await tx.wait();
}

export function getErc20(address, readonly = true) {
  const provider = getProvider();
  return new ethers.Contract(address, ERC20_ABI, readonly ? provider : provider);
}

export async function erc20Allowance(token, owner, spender) {
  const c = getErc20(token, true);
  return await c.allowance(owner, spender);
}

export async function erc20Approve(token, spender, amount) {
  const signer = await getSigner();
  const c = new ethers.Contract(token, ERC20_ABI, signer);
  const tx = await c.approve(spender, amount);
  return await tx.wait();
} 