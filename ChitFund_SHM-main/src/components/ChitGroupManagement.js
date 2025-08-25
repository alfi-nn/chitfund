import React, { useEffect, useState } from 'react';
import { createGroup, listGroups, getGroup, openCycle, finalizeBidding, distributeFunds } from '../web3/contracts.js';

// Local, persistent dummy data support (stored in localStorage)
const DUMMY_STORAGE_KEY = 'chit_dummy_groups_v1';

function generateFakeAddress() {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `0x${hex}`;
}

function defaultDummyGroups() {
  const today = new Date();
  const iso = (d) => new Date(d).toISOString().slice(0, 10);
  return [
    {
      address: generateFakeAddress(),
      contributionAmount: '10000000000000000',
      membersMax: 10,
      currentMembers: 3,
      durationPeriods: 12,
      startDate: iso(today),
      status: 'forming',
      currentCycle: 0,
    },
    {
      address: generateFakeAddress(),
      contributionAmount: '25000000000000000',
      membersMax: 8,
      currentMembers: 8,
      durationPeriods: 8,
      startDate: iso(today),
      status: 'full',
      currentCycle: 0,
    },
    {
      address: generateFakeAddress(),
      contributionAmount: '50000000000000000',
      membersMax: 6,
      currentMembers: 5,
      durationPeriods: 10,
      startDate: iso(today),
      status: 'active',
      currentCycle: 1,
    },
  ];
}

function loadDummyGroups() {
  try {
    const raw = localStorage.getItem(DUMMY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seed = defaultDummyGroups();
  try { localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(seed)); } catch {}
  return seed;
}

function saveDummyGroups(items) {
  try { localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(items)); } catch {}
}

function addDummyGroupFromCfg(cfg) {
  const addr = generateFakeAddress();
  const items = loadDummyGroups();
  const startDate = cfg.startTime ? new Date(cfg.startTime * 1000).toISOString().slice(0, 10) : '-';
  items.unshift({
    address: addr,
    contributionAmount: String(cfg.contributionAmount ?? '0'),
    membersMax: Number(cfg.membersMax ?? 0),
    currentMembers: 0,
    durationPeriods: Number(cfg.durationPeriods ?? 0),
    startDate,
    status: 'forming',
    currentCycle: 0,
  });
  saveDummyGroups(items);
  return addr;
}

const ChitGroupManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    contributionAmount: '10000000000000000', // 0.01 ETH
    membersMax: '5',
    durationPeriods: '12',
    startTime: new Date().toISOString().slice(0, 10),
    organizerFeeBps: '500',
    securityDeposit: '0',
    biddingCommitDuration: '600',
    biddingRevealDuration: '600',
    periodDuration: '3600', // 1 hour
  });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [error, setError] = useState('');
  const [cycleIndex, setCycleIndex] = useState(0);

  async function refreshGroups() {
    const addresses = await listGroups();
    const chainGroups = await Promise.all(addresses.map(async (addr) => {
      try {
        const group = getGroup(addr, true);
        const [members, cfg, currentCycle] = await Promise.all([group.getMembers(), group.cfg(), group.currentCycle?.() ?? Promise.resolve(0)]);
        const contributionAmount = cfg.contributionAmount?.toString?.() ?? cfg[2]?.toString?.() ?? '0';
        const membersMax = Number(cfg.membersMax ?? cfg[3] ?? 0);
        const durationPeriods = Number(cfg.durationPeriods ?? cfg[4] ?? 0);
        const startTime = Number(cfg.startTime ?? cfg[5] ?? 0);
        return { address: addr, contributionAmount, membersMax, currentMembers: members.length, durationPeriods, startDate: startTime ? new Date(startTime * 1000).toISOString().slice(0, 10) : '-', status: members.length >= membersMax ? 'full' : (startTime && Date.now() / 1000 >= startTime ? 'active' : 'forming'), currentCycle: Number(currentCycle || 0) };
      } catch {
        return { address: addr, contributionAmount: '0', membersMax: 0, currentMembers: 0, durationPeriods: 0, startDate: '-', status: 'forming', currentCycle: 0 };
      }
    }));

    const dummy = loadDummyGroups();
    const merged = [...chainGroups];
    const known = new Set(merged.map(g => g.address.toLowerCase()));
    for (const d of dummy) {
      if (!known.has(d.address.toLowerCase())) merged.push(d);
    }
    setGroups(merged);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        await refreshGroups();
      } catch (e) {
        if (mounted) setError(e?.message || 'Failed to load groups');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      setTxStatus('Submitting transaction...');
      setError('');
      const nowSec = Math.floor(Date.now() / 1000);
      const cfg = {
        organizer: undefined, // validated by factory equals msg.sender
        currency: '0x0000000000000000000000000000000000000000',
        contributionAmount: newGroup.contributionAmount,
        membersMax: Number(newGroup.membersMax),
        durationPeriods: Number(newGroup.durationPeriods),
        startTime: newGroup.startTime ? Math.floor(new Date(newGroup.startTime).getTime() / 1000) : nowSec + 60,
        organizerFeeBps: Number(newGroup.organizerFeeBps),
        securityDeposit: newGroup.securityDeposit,
        biddingCommitDuration: Number(newGroup.biddingCommitDuration),
        biddingRevealDuration: Number(newGroup.biddingRevealDuration),
        periodDuration: Number(newGroup.periodDuration),
      };
      let groupAddr;
      try {
        groupAddr = await createGroup(cfg);
        setTxStatus(groupAddr ? `Created group at ${groupAddr}` : 'Transaction confirmed (no event parsed)');
      } catch (chainErr) {
        // Fallback to dummy/local creation for use
        groupAddr = addDummyGroupFromCfg(cfg);
        setTxStatus(`Created demo group locally at ${groupAddr}`);
      }
      setShowCreateForm(false);
      await refreshGroups();
    } catch (e) {
      setError(e?.shortMessage || e?.message || 'Failed to create group');
      setTxStatus('');
    }
  };

  const handleInputChange = (e) => {
    setNewGroup({
      ...newGroup,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenCycle = async (address, cycle) => {
    try {
      setTxStatus(`Opening cycle ${cycle}...`);
      await openCycle(address, cycle);
      await refreshGroups();
      setTxStatus('Cycle opened');
    } catch (e) {
      setError(e?.shortMessage || e?.message || 'Failed to open cycle');
      setTxStatus('');
    }
  };

  const handleFinalize = async (address) => {
    try {
      setTxStatus('Finalizing bidding...');
      await finalizeBidding(address);
      await refreshGroups();
      setTxStatus('Bidding finalized');
    } catch (e) {
      setError(e?.shortMessage || e?.message || 'Failed to finalize bidding');
      setTxStatus('');
    }
  };

  const handleDistribute = async (address) => {
    try {
      setTxStatus('Distributing funds...');
      await distributeFunds(address);
      await refreshGroups();
      setTxStatus('Funds distributed');
    } catch (e) {
      setError(e?.shortMessage || e?.message || 'Failed to distribute funds');
      setTxStatus('');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Chit Group Management</h1>
        <p>Create and manage your on-chain chit fund groups</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create New Chit Group
        </button>
        <button 
          className="btn btn-secondary"
          style={{ marginLeft: '10px' }}
          onClick={async () => { saveDummyGroups(defaultDummyGroups()); await refreshGroups(); }}
        >
          Load Sample Groups
        </button>
      </div>

      {showCreateForm && (
        <div className="component-card">
          <div className="component-header">
            <h2>Create New Chit Group</h2>
          </div>
          <div className="component-body">
            <form onSubmit={handleCreateGroup}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Contribution Amount (wei)</label>
                  <input
                    type="number"
                    name="contributionAmount"
                    className="form-input"
                    value={newGroup.contributionAmount}
                    onChange={handleInputChange}
                    placeholder="e.g. 10000000000000000 for 0.01 ETH"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Members Max</label>
                  <input
                    type="number"
                    name="membersMax"
                    className="form-input"
                    value={newGroup.membersMax}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration Periods</label>
                  <input
                    type="number"
                    name="durationPeriods"
                    className="form-input"
                    value={newGroup.durationPeriods}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    name="startTime"
                    className="form-input"
                    value={newGroup.startTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Organizer Fee (bps)</label>
                  <input
                    type="number"
                    name="organizerFeeBps"
                    className="form-input"
                    value={newGroup.organizerFeeBps}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Security Deposit (wei)</label>
                  <input
                    type="number"
                    name="securityDeposit"
                    className="form-input"
                    value={newGroup.securityDeposit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Commit Duration (sec)</label>
                  <input
                    type="number"
                    name="biddingCommitDuration"
                    className="form-input"
                    value={newGroup.biddingCommitDuration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reveal Duration (sec)</label>
                  <input
                    type="number"
                    name="biddingRevealDuration"
                    className="form-input"
                    value={newGroup.biddingRevealDuration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Period Duration (sec)</label>
                  <input
                    type="number"
                    name="periodDuration"
                    className="form-input"
                    value={newGroup.periodDuration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button type="submit" className="btn btn-primary">
                  Create Group
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                {txStatus && <span style={{ color: '#2f855a' }}>{txStatus}</span>}
                {error && <span style={{ color: '#c53030' }}>{error}</span>}
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="component-card">
        <div className="component-header">
          <h2>Your Chit Groups {loading ? '(loading...)' : `(${groups.length})`}</h2>
        </div>
        <div className="component-body">
          {error && <div style={{ color: '#c53030', marginBottom: '10px' }}>{error}</div>}
          <table className="table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Contribution/Period (wei)</th>
                <th>Members</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Start</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.address}>
                  <td>{g.address}</td>
                  <td>{g.contributionAmount}</td>
                  <td>{g.currentMembers}/{g.membersMax}</td>
                  <td>{g.durationPeriods}</td>
                  <td><span className={`status-badge status-${g.status}`}>{g.status}</span></td>
                  <td>{g.startDate}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <input type="number" value={cycleIndex} onChange={(e) => setCycleIndex(Number(e.target.value || 0))} style={{ width: '80px' }} />
                      <button className="btn btn-secondary" onClick={() => handleOpenCycle(g.address, cycleIndex)}>Open Cycle</button>
                      <button className="btn btn-secondary" onClick={() => handleFinalize(g.address)}>Finalize</button>
                      <button className="btn btn-secondary" onClick={() => handleDistribute(g.address)}>Distribute</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="stat-card">
          <h3>Total Groups</h3>
          <div className="value">{groups.length}</div>
          <div className="change">On-chain</div>
        </div>
        <div className="stat-card">
          <h3>Active Groups</h3>
          <div className="value">{groups.filter(g => g.status === 'active').length}</div>
          <div className="change">In progress</div>
        </div>
        <div className="stat-card">
          <h3>Total Members</h3>
          <div className="value">{groups.reduce((sum, g) => sum + (g.currentMembers || 0), 0)}</div>
          <div className="change">Across all groups</div>
        </div>
      </div>
    </div>
  );
};

export default ChitGroupManagement;
