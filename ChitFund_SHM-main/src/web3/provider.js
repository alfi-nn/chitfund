import { NETWORK } from './config.js';
import { ethers } from 'ethers';

export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  if (!NETWORK.rpcUrl) throw new Error('Missing NETWORK.rpcUrl in src/web3/config.js');
  return new ethers.JsonRpcProvider(NETWORK.rpcUrl, NETWORK.chainId);
}

export async function getSigner() {
  const provider = getProvider();
  if (provider.send) {
    await provider.send('eth_requestAccounts', []);
  }
  return await provider.getSigner();
} 