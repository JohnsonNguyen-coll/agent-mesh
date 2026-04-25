import React from 'react';
import { Plus, ArrowRight, ArrowLeft, ArrowDown, Play, Trash2, Cpu, Loader2, Terminal, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getAgents } from '../utils/blockchain';
import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACTS, PAYMENT_ROUTER_ABI } from '../contracts/config';
import { parseUnits } from 'viem';

let _uid = 0;
const uid = () => { _uid += 1; return _uid; };

const AGENT_COLS_EVEN = [1, 3, 5];
const AGENT_COLS_ODD = [5, 3, 1];
const ARROW_COLS_EVEN = [2, 4];
const ARROW_COLS_ODD = [4, 2];

const Orchestrate = () => {
  const [agents, setAgents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [pipeline, setPipeline] = React.useState<any[]>([]);
  const { writeContractAsync } = useWriteContract();
  const { isConnected } = useAccount();

  // Modal State
  const [modal, setModal] = React.useState<{
    isOpen: boolean,
    title: string,
    message: string,
    type: 'confirm' | 'info',
    onConfirm?: () => void
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  React.useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
        const saved = localStorage.getItem('agentmesh_pipeline');
        if (saved) setPipeline(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const addToPipeline = (agent: any) => {
    setPipeline(prev => [...prev, {
      id: agent.id,
      name: agent.name,
      price: agent.price,
      pipelineId: uid(),
    }]);
  };

  const removeFromPipeline = (pid: number) => {
    setPipeline(prev => prev.filter(a => a.pipelineId !== pid));
  };

  const handleSave = () => {
    localStorage.setItem('agentmesh_pipeline', JSON.stringify(pipeline));
    setModal({
      isOpen: true,
      title: 'SYSTEM_SYNC_SUCCESS',
      message: 'The execution grid state has been successfully locked into local storage.',
      type: 'info'
    });
  };

  const executeSequence = async () => {
    setModal({ ...modal, isOpen: false });
    for (const agent of pipeline) {
      try {
        const priceStr = agent.price.split(' ')[0];
        await writeContractAsync({
          address: CONTRACTS.PAYMENT_ROUTER as `0x${string}`,
          abi: PAYMENT_ROUTER_ABI,
          functionName: 'routePayment',
          args: [
            BigInt(agent.id), '0x', parseUnits(priceStr, 6), 0n,
            CONTRACTS.AGENT_REGISTRY,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            0n, BigInt(Math.floor(Date.now() / 1000) + 3600),
            '0x' + Math.random().toString(16).slice(2).padStart(64, '0'),
            27,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          ],
        } as any);
      } catch {
        setModal({
          isOpen: true,
          title: 'EXECUTION_ERROR',
          message: `Strategic failure at Node ID: ${agent.id}. Sequence terminated.`,
          type: 'info'
        });
        break;
      }
    }
  };

  const handleDeployPipeline = () => {
    if (!isConnected) {
      return setModal({
        isOpen: true,
        title: 'CONNECTION_REQUIRED',
        message: 'Wallet connection is mandatory for on-chain execution.',
        type: 'info'
      });
    }
    if (pipeline.length === 0) {
      return setModal({
        isOpen: true,
        title: 'EMPTY_PIPELINE',
        message: 'No nodes detected in the Execution Grid. Add agents to proceed.',
        type: 'info'
      });
    }

    setModal({
      isOpen: true,
      title: 'INITIATE_SEQUENCE',
      message: 'Confirm activation of the autonomous execution sequence for the selected neural mesh?',
      type: 'confirm',
      onConfirm: executeSequence
    });
  };

  const rows: any[][] = [];
  for (let i = 0; i < pipeline.length; i += 3) {
    rows.push(pipeline.slice(i, i + 3));
  }

  const AgentCard = ({ node, stepNumber }: { node: any; stepNumber: number }) => (
    <div style={{ position: 'relative' }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 800,
        color: 'white', display: 'flex', alignItems: 'center',
        gap: '6px', marginBottom: '10px', textShadow: '0 0 5px rgba(0, 242, 255, 0.8)'
      }}>
        <div style={{ width: 12, height: 2, backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)' }} />
        NODE_{String(stepNumber).padStart(2, '0')}
      </div>
      <div className="card-solid" style={{
        padding: '24px', border: '1px solid rgba(0, 242, 255, 0.5)',
        borderBottom: '4px solid var(--accent-primary)',
        backgroundColor: '#0d0d0f', textAlign: 'center', position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
      }}>
        <Cpu size={22} color="var(--accent-primary)" style={{ marginBottom: '12px', filter: 'drop-shadow(0 0 5px var(--accent-primary))' }} />
        <strong style={{ fontSize: '15px', color: 'white', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
          {node.name.toUpperCase()}
        </strong>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00f2ff', fontWeight: 800 }}>
          {node.price}
        </div>
        <button
          onClick={() => removeFromPipeline(node.pipelineId)}
          style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );

  const renderRow = (row: any[], rowIndex: number) => {
    const isOdd = rowIndex % 2 === 1;
    const agentCols = isOdd ? AGENT_COLS_ODD : AGENT_COLS_EVEN;
    const arrowCols = isOdd ? ARROW_COLS_ODD : ARROW_COLS_EVEN;
    const baseStep = rowIndex * 3;
    const endCol = agentCols[row.length - 1];

    const slots: Record<number, React.ReactNode> = {};

    row.forEach((node, i) => {
      slots[agentCols[i]] = (
        <AgentCard key={`agent-${node.pipelineId}`} node={node} stepNumber={baseStep + i + 1} />
      );
      if (i < row.length - 1) {
        slots[arrowCols[i]] = (
          <div key={`arrow-${rowIndex}-${i}`} style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '22px',
          }}>
            {isOdd
              ? <ArrowLeft size={24} color="var(--accent-primary)" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 10px var(--accent-primary))' }} />
              : <ArrowRight size={24} color="var(--accent-primary)" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 10px var(--accent-primary))' }} />
            }
          </div>
        );
      }
    });

    return (
      <React.Fragment key={`row-${rowIndex}`}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 40px 1fr 40px 1fr',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          {[1, 2, 3, 4, 5].map(col => (
            <div key={col} style={{ gridColumn: col, visibility: slots[col] ? 'visible' : 'hidden' }}>
              {slots[col] ?? <div style={{ height: '120px' }} />}
            </div>
          ))}
        </div>

        {rowIndex < rows.length - 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 40px 1fr 40px 1fr',
            margin: '10px 0 30px',
          }}>
            {[1, 2, 3, 4, 5].map(col => (
              <div key={col} style={{ gridColumn: col, display: 'flex', justifyContent: 'center', visibility: col === endCol ? 'visible' : 'hidden' }}>
                {col === endCol && <ArrowDown size={32} color="var(--accent-primary)" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 10px var(--accent-primary))' }} />}
              </div>
            ))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="animate-fade">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .canvas-scanline {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(to bottom, transparent, rgba(0, 242, 255, 0.1) 50%, transparent);
          height: 120px;
          width: 100%;
          pointer-events: none;
          animation: scanline 6s linear infinite;
          z-index: 1;
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
      `}</style>

      {/* Custom Orchestration Modal */}
      {modal.isOpen && (
        <div className="modal-overlay" onClick={() => setModal({ ...modal, isOpen: false })}>
          <div className="card-solid animate-fade-in" style={{ width: '450px', padding: 0, overflow: 'hidden', border: '1px solid var(--accent-primary)', boxShadow: '0 0 50px rgba(0, 242, 255, 0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0, 242, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {modal.type === 'confirm' ? <AlertTriangle color="var(--accent-primary)" size={18} /> : <CheckCircle2 color="var(--accent-primary)" size={18} />}
                <h3 style={{ marginBottom: 0, fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'white' }}>{modal.title}</h3>
              </div>
              <button onClick={() => setModal({ ...modal, isOpen: false })} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px' }}>{modal.message}</p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                {modal.type === 'confirm' ? (
                  <>
                    <button className="btn-secondary" style={{ padding: '10px 30px' }} onClick={() => setModal({ ...modal, isOpen: false })}>ABORT</button>
                    <button className="btn-primary" style={{ padding: '10px 30px' }} onClick={modal.onConfirm}>PROCEED</button>
                  </>
                ) : (
                  <button className="btn-primary" style={{ padding: '10px 40px' }} onClick={() => setModal({ ...modal, isOpen: false })}>ACKNOWLEDGE</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-primary)', marginBottom: '8px', letterSpacing: '2px' }}>
            CORE // AGENT_ORCHESTRATION_MESH
          </div>
          <h1>Neural Mesh Orchestrator</h1>
          <p className="subtitle" style={{ color: '#aaa' }}>Synchronizing autonomous agent clusters for cross-chain execution.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-secondary" onClick={handleSave}>SAVE_FLOW</button>
          <button className="btn-primary" onClick={handleDeployPipeline} disabled={pipeline.length === 0}>
            <Play size={18} fill="black" /> ACTIVATE_SEQUENCE
          </button>
        </div>
      </header>

      <div className="grid-cols-2" style={{ gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'stretch' }}>
        <div className="card-solid" style={{
          minHeight: '800px', display: 'flex', flexDirection: 'column',
          backgroundColor: '#050507', 
          backgroundImage: 'radial-gradient(rgba(0, 242, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          border: '2px solid var(--border-color)', 
          padding: 0,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="canvas-scanline" />

          <div style={{
            padding: '24px', borderBottom: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', gap: '12px',
            backgroundColor: 'rgba(0,242,255,0.06)',
            position: 'relative', zIndex: 2
          }}>
            <Terminal size={18} color="var(--accent-primary)" />
            <h3 style={{ marginBottom: 0, fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'white' }}>
              EXECUTION_GRID
            </h3>
          </div>

          <div style={{ flex: 1, padding: '60px 40px', overflowY: 'auto', position: 'relative', zIndex: 2 }}>
            {rows.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '200px', color: '#555', fontFamily: 'var(--font-mono)' }}>
                <div style={{
                  width: 60, height: 60, border: '1px dashed #333',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                }}>
                  <Plus size={24} />
                </div>
                <p style={{ fontSize: '11px' }}>INITIALIZE_SEQUENCE_FLOW</p>
              </div>
            ) : (
              rows.map((row, rowIndex) => renderRow(row, rowIndex))
            )}
          </div>
        </div>

        <div className="card-solid" style={{ display: 'flex', flexDirection: 'column', padding: 0, backgroundColor: '#0d0d0f' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
            <h3 style={{ marginBottom: 0, fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'white' }}>AGENT_REGISTRY</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
            {loading
              ? <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="animate-spin" color="var(--accent-primary)" /></div>
              : agents.map(agent => (
                <div
                  key={agent.id}
                  className="card-solid"
                  style={{ padding: '16px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                  onClick={() => addToPipeline(agent)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>{agent.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{agent.price}</div>
                    </div>
                    <Plus size={16} color="var(--accent-primary)" />
                  </div>
                </div>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  );
};

export default Orchestrate;