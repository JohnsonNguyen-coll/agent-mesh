import React from 'react';
import { Activity, Shield, Zap, AlertCircle, Database, Server, Terminal, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWatchContractEvent } from 'wagmi';
import { CONTRACTS, PAYMENT_ROUTER_ABI } from '../contracts/config';

const LiveFeed = () => {
  const [events, setEvents] = React.useState<any[]>([]);
  const [lastTx, setLastTx] = React.useState<{ hash: string, value: string } | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const EXPLORER_URL = "https://testnet.arcscan.app/tx/";

  // FIXED: Changed 'PaymentRouted' to 'TaskRouted' as per Contract ABI
  useWatchContractEvent({
    address: CONTRACTS.PAYMENT_ROUTER as `0x${string}`,
    abi: PAYMENT_ROUTER_ABI,
    eventName: 'TaskRouted', // CORRECT EVENT NAME
    onLogs(logs) {
      const newEvents = logs.map(log => {
        const hash = log.transactionHash;
        setLastTx({ hash, value: "0.01 USDC" });
        localStorage.setItem('agentmesh_last_tx', JSON.stringify({ hash, value: "0.01 USDC" }));
        
        return {
          id: hash,
          type: 'PAYMENT',
          message: `TaskRouted: Node sequence triggered (Hash: ${hash.slice(0, 10)}...)`,
          status: 'success',
          time: new Date().toLocaleTimeString()
        };
      });
      setEvents(prev => [...newEvents, ...prev]);
    },
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('agentmesh_last_tx');
    if (saved) setLastTx(JSON.parse(saved));

    const initialEvents = [
      { id: 'init1', type: 'SYSTEM', message: 'Syncing with Arc Testnet PaymentRouter...', status: 'info', time: 'READY' },
    ];
    setEvents(initialEvents);
  }, []);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const currentEvents = events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-primary)', marginBottom: '8px', letterSpacing: '2px' }}>SYSTEM // REAL_TIME_MONITOR</div>
        <h1>Live Execution Feed</h1>
        <p className="subtitle" style={{ color: '#aaa' }}>Synchronizing with Arc Testnet Task Orchestration events.</p>
      </header>

      <div className="grid-cols-2" style={{ gridTemplateColumns: '1fr 340px', gap: '30px' }}>
        {/* Main Feed */}
        <div className="card-solid" style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid var(--border-color)', padding: '0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(0, 242, 255, 0.05)' }}>
            <Terminal size={18} color="var(--accent-primary)" />
            <h3 style={{ marginBottom: 0, fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'white' }}>ON_CHAIN_ACTIVITY</h3>
          </div>
          
          <div style={{ padding: '20px', flex: 1, minHeight: '400px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentEvents.map(event => (
                <div key={event.id} style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: `3px solid var(--accent-primary)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#666' }}>[{event.time}]</span>
                    <span style={{ fontSize: '13px', color: 'white' }}>{event.message}</span>
                  </div>
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', backgroundColor: 'rgba(0,242,255,0.1)', padding: '2px 6px' }}>
                    {event.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '15px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: '#666', fontFamily: 'var(--font-mono)' }}>PAGE {currentPage} / {totalPages || 1}</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ background: 'none', border: '1px solid #333', color: 'white', cursor: 'pointer', padding: '4px' }}><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ background: 'none', border: '1px solid #333', color: 'white', cursor: 'pointer', padding: '4px' }}><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card-solid" style={{ backgroundColor: 'var(--accent-primary)', padding: '24px', color: 'black' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ marginBottom: 0, fontSize: '18px', fontWeight: 900, color: 'black' }}>System Monitor</h3>
              <Shield size={24} fill="black" stroke="black" />
            </div>
            <p style={{ fontSize: '13px', fontWeight: 700, lineHeight: '1.5', color: 'black' }}>
              Watching Task Orchestration events on Arc Testnet. Status: LISTENING.
            </p>
          </div>

          <div className="card-solid" style={{ backgroundColor: 'var(--accent-primary)', padding: '24px', color: 'black' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: 0, fontSize: '16px', fontWeight: 900, color: 'black' }}>LATEST_TRANSACTION</h3>
              <Activity size={18} stroke="black" />
            </div>
            
            {lastTx ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <a href={`${EXPLORER_URL}${lastTx.hash}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '15px', backgroundColor: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(0,0,0,0.6)', marginBottom: '5px' }}>TX_HASH (ARC_SCAN)</div>
                    <div style={{ fontSize: '12px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'black', wordBreak: 'break-all', textDecoration: 'underline' }}>
                      {lastTx.hash}
                    </div>
                  </div>
                </a>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(0,0,0,0.6)' }}>VALUE</div><div style={{ fontSize: '16px', fontWeight: 900 }}>{lastTx.value}</div></div>
                  <div style={{ textAlign: 'right' }}><div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(0,0,0,0.6)' }}>STATUS</div><div style={{ fontSize: '11px', fontWeight: 900 }}>CONFIRMED</div></div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(0,0,0,0.5)', fontSize: '12px', fontWeight: 900 }}>
                WAITING_FOR_CHAIN_EVENT...
              </div>
            )}
          </div>

          <div className="card-solid" style={{ padding: '20px', border: '1px solid var(--border-color)', backgroundColor: '#0a0a0c' }}>
            <h4 style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '15px', color: 'white' }}>NODE_TELEMETRY</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={14} color="#444" />
              <div style={{ fontSize: '12px', color: 'white' }}>Relayer_US_East: <span style={{ color: 'var(--accent-primary)' }}>99.9%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
