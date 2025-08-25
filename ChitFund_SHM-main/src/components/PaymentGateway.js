import React, { useState, useEffect } from 'react';
import { listGroups, readGroupBasics, contribute, erc20Allowance, erc20Approve } from '../web3/contracts.js';
import { ethers } from 'ethers';

const PaymentGateway = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [basics, setBasics] = useState(null); // { cfg, currentCycle, phase }
  const [amountWei, setAmountWei] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const ZERO = '0x0000000000000000000000000000000000000000';

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const addrs = await listGroups();
        if (mounted) setGroups(addrs);
      } catch (e) {
        setError(e?.message || 'Failed to load groups');
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchBasics() {
      if (!selectedGroup) { setBasics(null); return; }
      try {
        const b = await readGroupBasics(selectedGroup);
        if (mounted) {
          setBasics(b);
          setAmountWei(b?.cfg?.contributionAmount?.toString?.() || '');
        }
      } catch (e) {
        setError(e?.message || 'Failed to read group config');
        setBasics(null);
      }
    }
    fetchBasics();
    return () => { mounted = false; };
  }, [selectedGroup]);

  const isNative = basics && (basics.cfg.currency === ZERO);
  const tokenAddress = basics && basics.cfg.currency;

  const ensureApprovalIfRequired = async () => {
    if (!basics || isNative) return true;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const owner = await signer.getAddress();
      const allowance = await erc20Allowance(tokenAddress, owner, selectedGroup);
      if (allowance && allowance >= amountWei) return true;
      setStatus('Approving token...');
      await erc20Approve(tokenAddress, selectedGroup, amountWei);
      return true;
    } catch (e) {
      setError(e?.shortMessage || e?.message || 'Approval failed');
      return false;
    }
  };

  const handleContribute = async () => {
    if (!selectedGroup || !amountWei) return;
    setStatus(''); setError('');
    try {
      if (!(await ensureApprovalIfRequired())) return;
      setStatus('Submitting contribution...');
      await contribute(selectedGroup, amountWei, isNative);
      setStatus('Contribution submitted');
    } catch (e) {
      setError(e?.shortMessage || e?.message || 'Contribution failed');
      setStatus('');
    }
  };

  const formattedContribution = basics ? (() => {
    try { return `${ethers.formatEther(basics.cfg.contributionAmount)} ETH`; } catch { return `${basics.cfg.contributionAmount} wei`; }
  })() : '-';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Payment Gateway</h1>
        <p>Make your contribution to the selected chit group</p>
      </div>

        <div className="component-card">
          <div className="component-header">
          <h2>Select Group</h2>
          </div>
          <div className="component-body">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select className="form-input" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} style={{ minWidth: '360px' }}>
              <option value="">-- Select a group address --</option>
              {groups.map(addr => (
                <option key={addr} value={addr}>{addr}</option>
              ))}
            </select>
            {basics && (
              <div style={{ display: 'flex', gap: '15px', color: '#718096' }}>
                <span>Currency: <strong>{isNative ? 'Native' : tokenAddress}</strong></span>
                <span>Contribution: <strong>{formattedContribution}</strong></span>
                <span>Cycle: <strong>{basics.currentCycle}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="component-card">
        <div className="component-header">
          <h2>Contribute</h2>
        </div>
        <div className="component-body">
          {basics ? (
            <>
              <div className="form-group">
                <label className="form-label">Amount ({isNative ? 'wei (value sent)' : 'wei (token amount)'})</label>
                <input className="form-input" type="number" value={amountWei} onChange={(e) => setAmountWei(e.target.value)} />
              </div>
              <div style={{ marginTop: '12px' }}>
                <button className="btn btn-primary" onClick={handleContribute} disabled={!selectedGroup || !amountWei}>Submit Contribution</button>
              </div>
            </>
          ) : (
            <div style={{ color: '#718096' }}>Select a group to see contribution details.</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        {status && <div style={{ color: '#2f855a' }}>{status}</div>}
        {error && <div style={{ color: '#c53030' }}>{error}</div>}
      </div>
    </div>
  );
};

export default PaymentGateway;
