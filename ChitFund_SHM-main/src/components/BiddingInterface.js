import React, { useState, useEffect } from 'react';
import { listGroups, getGroup, readGroupBasics, commitBid, revealBid, computeCommitHash } from '../web3/contracts.js';
import { ethers } from 'ethers';

const BiddingInterface = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [basics, setBasics] = useState(null); // { cfg, currentCycle, phase }
  const [commitAmount, setCommitAmount] = useState('');
  const [saltHex, setSaltHex] = useState('');
  const [commitHash, setCommitHash] = useState('');
  const [revealAmount, setRevealAmount] = useState('');
  const [revealSalt, setRevealSalt] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [nowSec, setNowSec] = useState(Math.floor(Date.now() / 1000));

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
    const t = setInterval(() => setNowSec(Math.floor(Date.now() / 1000)), 1000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchBasics() {
      if (!selectedGroup) { setBasics(null); return; }
      try {
        const b = await readGroupBasics(selectedGroup);
        if (mounted) setBasics(b);
      } catch (e) {
        setError(e?.message || 'Failed to read group basics');
        setBasics(null);
      }
    }
    fetchBasics();
    const t = setInterval(fetchBasics, 10_000);
    return () => { mounted = false; clearInterval(t); };
  }, [selectedGroup]);

  useEffect(() => {
    if (!commitAmount || !saltHex) { setCommitHash(''); return; }
    try {
      const hash = computeCommitHash(commitAmount, saltHex);
      setCommitHash(hash);
    } catch { setCommitHash(''); }
  }, [commitAmount, saltHex]);

  const generateSalt = () => {
    const bytes = ethers.randomBytes(32);
    const hex = ethers.hexlify(bytes);
    setSaltHex(hex);
    setRevealSalt(hex);
  };

  const phaseLabel = (p) => p === 0 ? 'Commit' : p === 1 ? 'Reveal' : p === 2 ? 'Finalized' : 'Unknown';

  const computeWindows = () => {
    if (!basics) return null;
    const cfg = basics.cfg;
    const cycleStart = Number(cfg.startTime) + basics.currentCycle * Number(cfg.periodDuration);
    const commitEnd = cycleStart + Number(cfg.biddingCommitDuration);
    const revealEnd = commitEnd + Number(cfg.biddingRevealDuration);
    return { cycleStart, commitEnd, revealEnd };
  };

  const handleCommit = async () => {
    if (!selectedGroup) return;
    try {
      setStatus('Submitting commit...'); setError('');
      await commitBid(selectedGroup, commitAmount, saltHex);
      setStatus('Commit submitted');
    } catch (e) {
      setError(e?.shortMessage || e?.message || 'Commit failed'); setStatus('');
    }
  };

  const handleReveal = async () => {
    if (!selectedGroup) return;
    try {
      setStatus('Submitting reveal...'); setError('');
      await revealBid(selectedGroup, revealAmount, revealSalt);
      setStatus('Reveal submitted');
    } catch (e) {
      setError(e?.shortMessage || e?.message || 'Reveal failed'); setStatus('');
    }
  };

  const windows = computeWindows();
  const now = nowSec;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bidding Interface</h1>
        <p>Commit and reveal your bids for the current cycle</p>
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
                <span>Cycle: <strong>{basics.currentCycle}</strong></span>
                <span>Phase: <strong>{phaseLabel(basics.phase)}</strong></span>
                {windows && (
                  <>
                    <span>Commit ends: <strong>{new Date(windows.commitEnd * 1000).toLocaleString()}</strong></span>
                    <span>Reveal ends: <strong>{new Date(windows.revealEnd * 1000).toLocaleString()}</strong></span>
                    <span>Now: <strong>{new Date(now * 1000).toLocaleTimeString()}</strong></span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Commit */}
      <div className="component-card">
        <div className="component-header">
          <h2>Commit Bid</h2>
        </div>
        <div className="component-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Amount (uint256)</label>
              <input className="form-input" type="number" value={commitAmount} onChange={(e) => setCommitAmount(e.target.value)} placeholder="e.g. 100" />
            </div>
            <div className="form-group">
              <label className="form-label">Salt (bytes32 hex)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="form-input" type="text" value={saltHex} onChange={(e) => setSaltHex(e.target.value)} placeholder="0x...32 bytes" />
                <button className="btn btn-secondary" onClick={generateSalt}>Random</button>
              </div>
            </div>
          </div>
          {commitHash && (
            <div style={{ marginTop: '10px', color: '#718096' }}>Commit hash: <code>{commitHash}</code></div>
          )}
          <div style={{ marginTop: '12px' }}>
            <button className="btn btn-primary" onClick={handleCommit} disabled={!selectedGroup || !commitAmount || !saltHex}>Submit Commit</button>
          </div>
        </div>
      </div>

      {/* Reveal */}
      <div className="component-card">
        <div className="component-header">
          <h2>Reveal Bid</h2>
        </div>
        <div className="component-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Amount (uint256)</label>
              <input className="form-input" type="number" value={revealAmount} onChange={(e) => setRevealAmount(e.target.value)} placeholder="Must match commit" />
            </div>
            <div className="form-group">
              <label className="form-label">Salt (bytes32 hex)</label>
              <input className="form-input" type="text" value={revealSalt} onChange={(e) => setRevealSalt(e.target.value)} placeholder="Must match commit" />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <button className="btn btn-primary" onClick={handleReveal} disabled={!selectedGroup || !revealAmount || !revealSalt}>Submit Reveal</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        {status && <div style={{ color: '#2f855a' }}>{status}</div>}
        {error && <div style={{ color: '#c53030' }}>{error}</div>}
      </div>
    </div>
  );
};

export default BiddingInterface;
