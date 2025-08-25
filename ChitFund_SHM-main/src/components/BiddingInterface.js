import React, { useState, useEffect, useMemo, useRef } from 'react';
import { listGroups, getGroup, readGroupBasics, commitBid, revealBid, computeCommitHash } from '../web3/contracts.js';
import { getProvider } from '../web3/provider.js';
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

  // Live bidding state
  const [biddingAddress, setBiddingAddress] = useState('');
  const [winner, setWinner] = useState('');
  const [winningAmount, setWinningAmount] = useState('');
  const [reveals, setReveals] = useState([]); // { bidder, amount, at }

  // Local persistent history per (group, cycle)
  const historyKey = useMemo(() => {
    if (!selectedGroup) return '';
    const cycle = basics?.currentCycle ?? 0;
    return `bidding_history_${selectedGroup}_${cycle}`;
  }, [selectedGroup, basics]);

  const loadHistory = () => {
    try {
      if (!historyKey) return [];
      const raw = localStorage.getItem(historyKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const saveHistory = (items) => {
    try { if (historyKey) localStorage.setItem(historyKey, JSON.stringify(items)); } catch {}
  };

  const sortByAmountDesc = (items) =>
    items.slice().sort((a, b) => parseInt(b.amount || 0, 10) - parseInt(a.amount || 0, 10));

  // Remove time-sequenced demo bids so they don't appear pre-selection
  const sanitizeInitial = (items) => items.filter(e => !['35','33','32'].includes(String(e?.amount)));

  const seedDummyHistory = () => {
    const base = Date.now();
    const mk = (user, amount, offsetMin) => ({ bidder: user, amount: String(parseInt(amount, 10)), at: base - offsetMin * 60 * 1000 });
    const samples = sortByAmountDesc([
      mk('User001', 50, 15),
      mk('User002', 47, 13),
      mk('User003', 41, 11),
    ]);
    saveHistory(samples);
    return samples;
  };

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

  // Discover and subscribe to the cycle's bidding contract
  useEffect(() => {
    let unsub = () => {};
    async function wire() {
      try {
        setBiddingAddress(''); setWinner(''); setWinningAmount(''); setReveals([]);
        if (!selectedGroup || !basics) return;
        const group = getGroup(selectedGroup, true);
        const addr = await group.cycleBidding(basics.currentCycle);
        if (addr && ethers.isAddress(addr) && addr !== ethers.ZeroAddress) {
          setBiddingAddress(addr);
          const provider = getProvider();
          const bsAbi = [
            'event BidCommitted(address indexed bidder)',
            'event BidRevealed(address indexed bidder, uint256 amount)',
            'event WinnerSelected(address indexed winner, uint256 amount)',
            'function winner() view returns (address)',
            'function winningAmount() view returns (uint256)'
          ];
          const bs = new ethers.Contract(addr, bsAbi, provider);
          // Load current state
          try {
            const w = await bs.winner();
            const wa = await bs.winningAmount();
            setWinner(w);
            setWinningAmount(wa.toString());
          } catch {}

          // Initialize history from storage
          {
            const existingRaw = loadHistory();
            const existing = sortByAmountDesc(sanitizeInitial(existingRaw));
            if (existing.length === 0) {
              const seeded = seedDummyHistory();
              setReveals(seeded);
              saveHistory(seeded);
            } else {
              setReveals(existing);
              saveHistory(existing);
            }
          }
          // Subscribe to events
          const onReveal = (bidder, amount) => {
            setReveals(prev => {
              const next = [{ bidder, amount: amount.toString(), at: Date.now() }, ...prev].slice(0, 200);
              saveHistory(next);
              return next;
            });
            // optimistic update
            try { setWinningAmount((cur) => {
              const curBn = cur ? ethers.toBigInt(cur) : undefined;
              const amt = ethers.toBigInt(amount);
              if (!winner || (curBn !== undefined && amt < curBn)) {
                setWinner(bidder);
                return amt.toString();
              }
              return cur;
            }); } catch {}
          };
          const onWinner = (w, amt) => {
            setWinner(w);
            setWinningAmount(amt.toString());
          };
          bs.on('BidRevealed', onReveal);
          bs.on('WinnerSelected', onWinner);
          unsub = () => {
            bs.off('BidRevealed', onReveal);
            bs.off('WinnerSelected', onWinner);
          };
        }
      } catch (e) {
        // ignore wiring errors
      }
    }
    wire();
    return () => { try { unsub(); } catch {} };
  }, [selectedGroup, basics]);

  // Keep history in sync if storage changes (multi-tab/demo updates)
  useEffect(() => {
    if (!historyKey) return;
    const onStorage = (e) => { if (e.key === historyKey) setReveals(loadHistory()); };
    window.addEventListener('storage', onStorage);
    // Seed if empty on selection
    const existingRaw = loadHistory();
    const cleaned = sanitizeInitial(existingRaw);
    const needsSeed = cleaned.length === 0 || cleaned[0]?.amount !== '50' || cleaned[1]?.amount !== '47' || cleaned[2]?.amount !== '41';
    if (needsSeed) {
      const seeded = seedDummyHistory();
      setReveals(seeded);
      saveHistory(seeded);
    } else {
      setReveals(cleaned);
      saveHistory(cleaned);
    }
    const t = setInterval(() => setReveals(loadHistory()), 2000);
    return () => { window.removeEventListener('storage', onStorage); clearInterval(t); };
  }, [historyKey]);

  const formatTokens = (val) => String(parseInt(val, 10));

  const shortAddr = (a) => a && a.length > 10 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a || '-';

  // Schedule demo bids after selecting a group
  const delayedTimerRef = useRef(null); // 35 tokens at 10s
  const delayedTimerRef2 = useRef(null); // 33 tokens at 15s
  const delayedTimerRef3 = useRef(null); // your bid at 22s
  const delayedTimerRef4 = useRef(null); // mark win at 30s
  useEffect(() => {
    if (delayedTimerRef.current) { clearTimeout(delayedTimerRef.current); delayedTimerRef.current = null; }
    if (delayedTimerRef2.current) { clearTimeout(delayedTimerRef2.current); delayedTimerRef2.current = null; }
    if (delayedTimerRef3.current) { clearTimeout(delayedTimerRef3.current); delayedTimerRef3.current = null; }
    if (delayedTimerRef4.current) { clearTimeout(delayedTimerRef4.current); delayedTimerRef4.current = null; }
    if (!selectedGroup) return;
    delayedTimerRef.current = setTimeout(() => {
      try {
        const existing = loadHistory();
        const has35 = existing.some(e => String(e?.amount) === '35');
        if (!has35) {
          const entry = { bidder: 'You', amount: '35', at: Date.now() };
          const next = sortByAmountDesc([entry, ...existing]).slice(0, 200);
          saveHistory(next);
          setReveals(next);
        }
      } catch {}
    }, 10_000);
    delayedTimerRef2.current = setTimeout(() => {
      try {
        const existing = loadHistory();
        const has33 = existing.some(e => String(e?.amount) === '33');
        if (!has33) {
          const entry = { bidder: 'User004', amount: '33', at: Date.now() };
          const next = sortByAmountDesc([entry, ...existing]).slice(0, 200);
          saveHistory(next);
          setReveals(next);
        }
      } catch {}
    }, 15_000);
    delayedTimerRef3.current = setTimeout(() => {
      try {
        const existing = loadHistory();
        const has32 = existing.some(e => String(e?.amount) === '32');
        if (!has32) {
          const entry = { bidder: 'You', amount: '32', at: Date.now() };
          const next = sortByAmountDesc([entry, ...existing]).slice(0, 200);
          saveHistory(next);
          setReveals(next);
        }
      } catch {}
    }, 22_000);
    delayedTimerRef4.current = setTimeout(() => {
      try {
        const existing = loadHistory();
        // mark the smallest 'You' bid (32) as won
        const next = existing.map(e => {
          if (String(e.amount) === '32' && String(e.bidder) === 'You') {
            return { ...e, won: true };
          }
          return e;
        });
        saveHistory(next);
        setReveals(next);
      } catch {}
    }, 30_000);
    return () => { 
      if (delayedTimerRef.current) { clearTimeout(delayedTimerRef.current); delayedTimerRef.current = null; }
      if (delayedTimerRef2.current) { clearTimeout(delayedTimerRef2.current); delayedTimerRef2.current = null; }
      if (delayedTimerRef3.current) { clearTimeout(delayedTimerRef3.current); delayedTimerRef3.current = null; }
      if (delayedTimerRef4.current) { clearTimeout(delayedTimerRef4.current); delayedTimerRef4.current = null; }
    };
  }, [selectedGroup, historyKey]);

  const windows = computeWindows();
  const now = nowSec;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bidding Interface</h1>
        <p>Commit and reveal your bids for the current cycle</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
        <div>
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

      {/* Live status */}
      {biddingAddress && (
        <div className="component-card">
          <div className="component-header">
            <h2>Live Bidding Status</h2>
          </div>
          <div className="component-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Bidding Contract</div>
                <div style={{ fontWeight: '600' }}>{biddingAddress}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Current Winner</div>
                <div style={{ fontWeight: '600' }}>{winner || '-'}</div>
                <div style={{ fontSize: '12px', color: '#718096' }}>Winning Amount</div>
                <div style={{ fontWeight: '600' }}>{winningAmount || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div>
          <div className="component-card" style={{ position: 'sticky', top: '100px' }}>
            <div className="component-header">
              <h2>Bidding History</h2>
            </div>
            <div className="component-body">
              {!selectedGroup ? (
                <div style={{ color: '#718096' }}>Select a group to view history.</div>
              ) : reveals.length === 0 ? (
                <div style={{ color: '#718096' }}>No reveals yet.</div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {reveals.map((r, idx) => (
                    <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', backgroundColor: r.won ? '#e6ffed' : 'white' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '16px' }}>{shortAddr(r.bidder)}</div>
                        <div style={{ color: '#718096', fontSize: '14px' }}>{r.at ? new Date(r.at).toLocaleTimeString() : ''}{r.won ? ' • Bid Won' : ''}</div>
                      </div>
                      <div style={{ color: '#e53e3e', fontWeight: 700, fontSize: '20px' }}>{formatTokens(r.amount)} tokens</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingInterface;
