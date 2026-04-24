import React from 'react';
import { BarChart3, TrendingUp, Users, Activity, PieChart, Shield, Terminal, Zap, Globe } from 'lucide-react';
import { publicClient } from '../utils/blockchain';
import { CONTRACTS, AGENT_REGISTRY_ABI, PAYMENT_ROUTER_ABI } from '../contracts/config';

const Analytics = () => {
  const [stats, setStats] = React.useState({
    totalAgents: 0,
    totalTasks: 0,
    meshHealth: 'OPTIMAL',
    totalValue: '0.00'
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const count = await (publicClient as any).readContract({
          address: CONTRACTS.AGENT_REGISTRY as `0x${string}`,
          abi: AGENT_REGISTRY_ABI,
          functionName: 'agentCount',
        });
        setStats(prev => ({ ...prev, totalAgents: Number(count) }));
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade">
      <header style={{marginBottom: '60px'}}>
        <div style={{fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-primary)', marginBottom: '8px', letterSpacing: '2px'}}>PROTOCOL // MONITORING</div>
        <h1>Mesh Analytics</h1>
        <p className="subtitle">Real-time performance and health metrics of the AgentMesh protocol.</p>
      </header>

      <div className="grid-cols-3" style={{marginBottom: '40px'}}>
        <StatCard label="ACTIVE_NODES" value={stats.totalAgents.toString()} icon={<Globe size={20} />} color="var(--accent-primary)" />
        <StatCard label="TASKS_PROCESSED" value="1,248" icon={<Activity size={20} />} color="var(--accent-tertiary)" />
        <StatCard label="MESH_STABILITY" value="99.9%" icon={<Shield size={20} />} color="var(--success)" />
      </div>

      <div className="grid-cols-2" style={{gridTemplateColumns: '1.5fr 1fr'}}>
        <div className="card-solid">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
            <h3 style={{fontFamily: 'var(--font-mono)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              <Zap size={18} color="var(--accent-primary)" /> THROUGHPUT_LOGS
            </h3>
            <div style={{fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)'}}>[ FREQUENCY: 1.2HZ ]</div>
          </div>
          
          <div style={{height: '300px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)'}}>
            {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55].map((h, i) => (
              <div key={i} style={{flex: 1, backgroundColor: i === 8 ? 'var(--accent-secondary)' : 'var(--accent-primary)', height: `${h}%`, opacity: 0.8}}></div>
            ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)'}}>
            <span>00:00:00</span>
            <span>TIMELINE (UTC)</span>
            <span>PRESENT</span>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
          <div className="card-solid" style={{borderLeft: '4px solid var(--accent-secondary)'}}>
            <h3 style={{fontSize: '14px', marginBottom: '20px'}}>SYSTEM_ALERTS</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <AlertItem message="Node #42 re-synced successfully" time="2m ago" />
              <AlertItem message="New payment router deployment detected" time="15m ago" />
              <AlertItem message="Mesh latency spike resolved" time="1h ago" />
            </div>
          </div>

          <div className="card-solid" style={{backgroundColor: 'rgba(204, 255, 0, 0.02)', borderStyle: 'dotted'}}>
            <h3 style={{fontSize: '14px', color: 'var(--accent-tertiary)'}}>ECONOMIC_DATA</h3>
            <div style={{marginTop: '20px'}}>
              <p style={{fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)'}}>TOTAL_VALUE_ESCROWED</p>
              <p style={{fontSize: '32px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-mono)'}}>$12,450.00 <span style={{fontSize: '14px', color: 'var(--text-secondary)'}}>USDC</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }: any) => (
  <div className="card-solid" style={{borderTop: `4px solid ${color}`}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
      <span style={{fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800}}>{label}</span>
      <div style={{color: color}}>{icon}</div>
    </div>
    <div style={{fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-mono)'}}>{value}</div>
  </div>
);

const AlertItem = ({ message, time }: any) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
    <span style={{fontSize: '13px', color: 'var(--text-secondary)'}}>{message}</span>
    <span style={{fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)'}}>{time}</span>
  </div>
);

export default Analytics;
