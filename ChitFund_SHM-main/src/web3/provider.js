import { NETWORK } from './config.js';
import { ethers } from 'ethers';

export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  if (!NETWORK.rpcUrl) throw new Error('Missing NETWORK.rpcUrl in src/web3/config.js');
  return new ethers.JsonRpcProvider(NETWORK.rpcUrl, NETWORK.chainId);
}

export async function ensureNetwork() {
  if (typeof window === 'undefined' || !window.ethereum) return;
  const targetChainIdHex = '0x' + Number(NETWORK.chainId).toString(16);
  try {
    const current = await window.ethereum.request({ method: 'eth_chainId' });
    if (current?.toLowerCase() === targetChainIdHex.toLowerCase()) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainIdHex }]
      });
    } catch (switchErr) {
      // If the chain is not added, add it
      if (switchErr?.code === 4902 || (switchErr?.data && switchErr.data.originalError?.code === 4902)) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: targetChainIdHex,
            chainName: 'Shardeum',
            rpcUrls: [NETWORK.rpcUrl],
          }]
        });
      } else {
        throw switchErr;
      }
    }
  } catch (e) {
    // ignore, user can switch manually
  }
}

export async function getSigner() {
  const provider = getProvider();
  if (provider.send) {
    await provider.send('eth_requestAccounts', []);
  }
  return await provider.getSigner();
} 