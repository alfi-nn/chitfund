import React, { useEffect, useState } from 'react';
import { listGroups, getGroup, joinGroup } from '../web3/contracts.js';
import { ethers } from 'ethers';
import { getProvider } from '../web3/provider.js';

const GroupDiscovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAmount, setFilterAmount] = useState('all');
  const [filterDuration, setFilterDuration] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const provider = getProvider();
        let addresses = await listGroups();
        addresses = (addresses || []).filter((addr) => typeof addr === 'string' && addr.length > 0 && ethers.isAddress(addr));
        // Filter to addresses that actually have contract code
        const codeResults = await Promise.all(addresses.map(async (addr) => ({ addr, code: await provider.getCode(addr) })));
        const validAddrs = codeResults.filter(({ code }) => code && code !== '0x').map(({ addr }) => addr);
        const details = await Promise.all(
          validAddrs.map(async (addr) => {
            try {
              const group = getGroup(addr, true);
              const [members, cfg] = await Promise.all([
                group.getMembers(),
                group.cfg(),
              ]);
              const contributionAmount = cfg.contributionAmount?.toString?.() ?? cfg[2]?.toString?.() ?? '0';
              const membersMax = Number(cfg.membersMax ?? cfg[3] ?? 0);
              const durationPeriods = Number(cfg.durationPeriods ?? cfg[4] ?? 0);
              const startTime = Number(cfg.startTime ?? cfg[5] ?? 0);
              const securityDeposit = cfg.securityDeposit?.toString?.() ?? cfg[8]?.toString?.() ?? '0';
              const currency = cfg.currency ?? cfg[1] ?? '0x0000000000000000000000000000000000000000';
              return {
                address: addr,
                name: `Chit Group ${addr.slice(0, 6)}…${addr.slice(-4)}`,
                amountWei: contributionAmount,
                membersMax,
                currentMembers: members.length,
                duration: durationPeriods,
                startDate: startTime ? new Date(startTime * 1000).toISOString().slice(0, 10) : '-',
                status: (membersMax > 0 && members.length >= membersMax) ? 'full' : (startTime && Date.now() / 1000 >= startTime ? 'active' : 'forming'),
                securityDepositWei: securityDeposit,
                currency,
              };
            } catch (e) {
              return null;
            }
          })
        );
        const cleaned = details.filter(Boolean);
        if (mounted) setGroups(cleaned);
      } catch (e) {
        if (mounted) setError(e?.message || 'Failed to load groups');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const amountRanges = [
    { value: 'all', label: 'All Amounts' },
    { value: '0-0.1', label: '≤ 0.1 ETH (approx)' },
    { value: '0.1-1', label: '0.1 - 1 ETH' },
    { value: '1+', label: '≥ 1 ETH' }
  ];

  const durationRanges = [
    { value: 'all', label: 'All Durations' },
    { value: '0-12', label: '0-12 periods' },
    { value: '12-24', label: '12-24 periods' },
    { value: '24+', label: '24+ periods' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'forming', label: 'Forming' },
    { value: 'active', label: 'Active' },
    { value: 'full', label: 'Full' }
  ];

  function formatEth(weiStr) {
    try {
      return `${ethers.formatEther(weiStr)} ETH`;
    } catch {
      return `${weiStr} wei`;
    }
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.address.toLowerCase().includes(searchTerm.toLowerCase());

    let amountEth = 0;
    try { amountEth = parseFloat(ethers.formatEther(group.amountWei || '0')); } catch { amountEth = 0; }
    const matchesAmount = filterAmount === 'all' ||
      (filterAmount === '0-0.1' && amountEth <= 0.1) ||
      (filterAmount === '0.1-1' && amountEth > 0.1 && amountEth <= 1) ||
      (filterAmount === '1+' && amountEth > 1);

    const matchesDuration = filterDuration === 'all' ||
      (filterDuration === '0-12' && group.duration <= 12) ||
      (filterDuration === '12-24' && group.duration > 12 && group.duration <= 24) ||
      (filterDuration === '24+' && group.duration > 24);

    const matchesStatus = filterStatus === 'all' || group.status === filterStatus;

    return matchesSearch && matchesAmount && matchesDuration && matchesStatus;
  });

  const handleJoinGroup = async (group) => {
    try {
      const isNative = !group.currency || group.currency === '0x0000000000000000000000000000000000000000';
      const valueWei = isNative ? group.securityDepositWei : '0';
      await joinGroup(group.address, valueWei);
      alert('Joined group successfully');
    } catch (e) {
      alert(e?.shortMessage || e?.message || 'Failed to join group');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'forming':
        return 'status-pending';
      case 'active':
        return 'status-active';
      case 'full':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Group Discovery</h1>
        <p>Browse and join available chit fund groups deployed on-chain</p>
      </div>

      <div className="component-card">
        <div className="component-header">
          <h2>Search & Filters</h2>
        </div>
        <div className="component-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name or address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contribution/Period</label>
              <select 
                className="form-input"
                value={filterAmount}
                onChange={(e) => setFilterAmount(e.target.value)}
              >
                {amountRanges.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <select 
                className="form-input"
                value={filterDuration}
                onChange={(e) => setFilterDuration(e.target.value)}
              >
                {durationRanges.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="component-card">
        <div className="component-header">
          <h2>Available Groups {loading ? '(loading...)' : `(${filteredGroups.length})`}</h2>
        </div>
        <div className="component-body">
          {error && (
            <div style={{ color: '#c53030', marginBottom: '10px' }}>{error}</div>
          )}
          {!loading && filteredGroups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#718096' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <h3>No groups found</h3>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {filteredGroups.map((group) => (
                <div
                  key={group.address}
                  style={{
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600' }}>
                            {group.name}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px', color: '#718096' }}>
                            <span>{group.address}</span>
                            <span>•</span>
                            <span className={`status-badge ${getStatusColor(group.status)}`}>{group.status}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Contribution/Period</div>
                          <div style={{ fontWeight: '600', fontSize: '16px' }}>{formatEth(group.amountWei)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Members</div>
                          <div style={{ fontWeight: '600', fontSize: '16px' }}>{group.currentMembers}/{group.membersMax}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Duration (periods)</div>
                          <div style={{ fontWeight: '600', fontSize: '16px' }}>{group.duration}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Start Date</div>
                          <div style={{ fontWeight: '600', fontSize: '16px' }}>{group.startDate}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                      {group.status !== 'full' ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleJoinGroup(group)}
                          style={{ minWidth: '120px' }}
                        >
                          Join Group
                        </button>
                      ) : group.status === 'active' ? (
                        <button className="btn btn-secondary" style={{ minWidth: '120px' }} disabled>
                          Group Active
                        </button>
                      ) : (
                        <button className="btn btn-secondary" style={{ minWidth: '120px' }} disabled>
                          Group Full
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="stat-card">
          <h3>Total Groups</h3>
          <div className="value">{groups.length}</div>
          <div className="change">On-chain</div>
        </div>
        <div className="stat-card">
          <h3>Forming Groups</h3>
          <div className="value">{groups.filter(g => g.status === 'forming').length}</div>
          <div className="change">Accepting members</div>
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

export default GroupDiscovery;
