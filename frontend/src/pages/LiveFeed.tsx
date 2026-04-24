import React from 'react';
import { Activity, TrendingUp, DollarSign, Repeat, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicClient } from '../utils/blockchain';
import { CONTRACTS, PAYMENT_ROUTER_ABI } from '../contracts/config';
import { formatUnits } from 'viem';

const LiveFeed = () => {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock > 9000n ? currentBlock - 9000n : 0n;

        const logs = await publicClient.getContractEvents({
          address: CONTRACTS.PAYMENT_ROUTER as `0x${string}`,
          abi: PAYMENT_ROUTER_ABI,
          eventName: 'TaskRouted',
          fromBlock: fromBlock
        });

        const formatted = logs.map(log => ({
          id: log.transactionHash,
          agentId: log.args.agentId?.toString(),
          payer: log.args.payer,
          amount: formatUnits(log.args.reward || 0n, 6),
          type: 'TaskRouted',
          time: 'RECENT'
        })).reverse().slice(0, 15);

        setEvents(formatted);
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
      setLoading(false);
    };

    fetchRecentEvents();

    const unwatch = publicClient.watchContractEvent({
      address: CONTRACTS.PAYMENT_ROUTER as `0x${string}`,
      abi: PAYMENT_ROUTER_ABI,
      eventName: 'TaskRouted',
      onLogs: (logs) => {
        const newEvents = logs.map(log => ({
          id: log.transactionHash,
          agentId: log.args.agentId?.toString(),
          payer: log.args.payer,
          amount: formatUnits(log.args.reward || 0n, 6),
          type: 'TaskRouted',
          time: 'JUST NOW'
        }));
        setEvents(prev => [...newEvents, ...prev].slice(0, 15));
      }
    });

    return () => unwatch();
  }, []);

  return (
    <div className="animate-fade">
      <header style={{marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
            <div style={{width: 8, height: 8, backgroundColor: 'var(--success)', borderRadius: '50%'}}></div>
            <span style={{fontSize: '12px', fontWeight: 800, color: 'var(--success)', letterSpacing: '1px'}}>LIVE NETWORK FEED</span>
          </div>
          <h1>Mesh Activity</h1>
        </div>
        <div style={{display: 'flex', gap: '16px'}}>
          <div className="card-solid" style={{padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
            <Activity size={16} color="var(--accent-primary)" />
            <span style={{fontSize: '13px', fontWeight: 700}}>Arc Chain Active</span>
          </div>
        </div>
      </header>

      <div className="grid-cols-2" style={{gridTemplateColumns: '1.6fr 1fr'}}>
        <div className="card-solid" style={{padding: '0', overflow: 'hidden'}}>
          <div style={{padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3 style={{marginBottom: 0}}>Latest Transactions</h3>
            <span style={{fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800}}>AUTO-UPDATING</span>
          </div>
          
          <div style={{height: '600px', overflowY: 'auto'}}>
            {loading ? (
              <div style={{display:'flex', justifyContent:'center', padding:'100px'}}><Loader2 className="animate-spin" /></div>
            ) : events.length === 0 ? (
              <div style={{padding: '48px', textAlign: 'center', color: 'var(--text-muted)'}}>Scanning mesh for activity...</div>
            ) : (
              <AnimatePresence initial={false}>
                {events.map((event) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      padding: '20px 24px',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, 
                      backgroundColor: 'var(--bg-tertiary)', 
                      borderRadius: '4px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)'
                    }}>
                      <TrendingUp size={18} color="var(--accent-primary)" />
                    </div>
                    
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px'}}>
                        <span style={{fontWeight: 800, fontSize: '14px', color: 'var(--accent-primary)'}}>Agent #{event.agentId}</span>
                        <ArrowRight size={12} color="var(--text-muted)" />
                        <span style={{fontWeight: 700, fontSize: '14px'}}>{event.payer.slice(0,6)}...{event.payer.slice(-4)}</span>
                      </div>
                      <span style={{fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)'}}>{event.time}</span>
                    </div>

                    <div style={{textAlign: 'right'}}>
                      <div style={{fontWeight: 800, fontSize: '16px', color: 'var(--success)'}}>+{event.amount} USDC</div>
                      <div style={{fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase'}}>Task Routed</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div className="card-solid">
            <h3>Network Health</h3>
            <div style={{marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)'}}>
                <span style={{fontSize: '13px', color: 'var(--text-secondary)'}}>Status</span>
                <span style={{fontSize: '13px', fontWeight: 700, color: 'var(--success)'}}>Operational</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)'}}>
                <span style={{fontSize: '13px', color: 'var(--text-secondary)'}}>Protocol</span>
                <span style={{fontSize: '13px', fontWeight: 700}}>AgentMesh v1.0</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{fontSize: '13px', color: 'var(--text-secondary)'}}>Region</span>
                <span style={{fontSize: '13px', fontWeight: 700}}>Arc Testnet</span>
              </div>
            </div>
          </div>

          <div className="card-solid" style={{backgroundColor: 'var(--accent-primary)', border: 'none'}}>
            <h3 style={{color: 'white', marginBottom: '8px'}}>System Monitor</h3>
            <p style={{fontSize: '13px', color: 'rgba(255,255,255,0.8)'}}>Watching PaymentRouter events for high-throughput AI orchestrations.</p>
            <div style={{marginTop: '20px', height: '120px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', backgroundColor: 'rgba(255,255,255,0.1)'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
