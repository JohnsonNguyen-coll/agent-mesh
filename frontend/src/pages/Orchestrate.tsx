import React from 'react';
import { Plus, ArrowDown, Save, Play, Trash2, Cpu, Loader2, Terminal, Settings, Layers } from 'lucide-react';
import { getAgents } from '../utils/blockchain';
import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACTS, PAYMENT_ROUTER_ABI } from '../contracts/config';
import { parseUnits } from 'viem';

const Orchestrate = () => {
  const [agents, setAgents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [pipeline, setPipeline] = React.useState<any[]>([]);
  const { writeContractAsync } = useWriteContract();
  const { isConnected, address } = useAccount();

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
    setPipeline(prev => [...prev, { ...agent, pipelineId: Date.now() }]);
  };

  const removeFromPipeline = (pid: number) => {
    setPipeline(prev => prev.filter(a => a.pipelineId !== pid));
  };

  const handleSave = () => {
    const serialized = JSON.stringify(pipeline, (k, v) => typeof v === 'bigint' ? v.toString() : v);
    localStorage.setItem('agentmesh_pipeline', serialized);
    alert('PIPELINE_CONFIG_SAVED');
  };

  const handleDeployPipeline = async () => {
    if (!isConnected) return alert('CONNECT_WALLET_REQUIRED');
    if (pipeline.length === 0) return alert('EMPTY_PIPELINE');

    const confirmed = confirm(`INITIALIZE_AUTONOMOUS_EXECUTION_SEQUENCE?`);
    if (!confirmed) return;

    for (const node of pipeline) {
      try {
        const priceStr = node.price.split(' ')[0];
        await writeContractAsync({
          address: CONTRACTS.PAYMENT_ROUTER as `0x${string}`,
          abi: PAYMENT_ROUTER_ABI,
          functionName: 'routePayment',
          args: [
            BigInt(node.id),
            '0x',
            parseUnits(priceStr, 6),
            0n,
            CONTRACTS.AGENT_REGISTRY,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            0n,
            BigInt(Math.floor(Date.now() / 1000) + 3600),
            '0x' + Math.random().toString(16).slice(2).padStart(64, '0'),
            27,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ],
        } as any);
      } catch (e) {
        alert(`EXECUTION_FAILED_AT_NODE_${node.id}`);
        break;
      }
    }
  };

  return (
    <div className="animate-fade">
      <header style={{marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <div style={{fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-primary)', marginBottom: '8px', letterSpacing: '2px'}}>PROTOCOL // SYSTEM_ORCHESTRATION</div>
          <h1>Mesh Orchestrator</h1>
          <p className="subtitle">Sequence nodes into an autonomous operational pipeline.</p>
        </div>
        <div style={{display: 'flex', gap: '15px'}}>
          <button className="btn-secondary" onClick={handleSave}>SAVE_CONFIG</button>
          <button className="btn-primary" onClick={handleDeployPipeline} disabled={pipeline.length === 0}>
            <Play size={18} fill="black" /> DEPLOY_SEQUENCE
          </button>
        </div>
      </header>

      <div className="grid-cols-2" style={{gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'stretch'}}>
        <div className="card-solid" style={{minHeight: '700px', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.4)', borderStyle: 'double', padding: '0'}}>
          <div style={{padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <Terminal size={18} color="var(--accent-primary)" />
              <h3 style={{marginBottom: 0, fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'white'}}>SEQUENCE_CANVAS</h3>
            </div>
            <div style={{fontSize: '10px', color: 'var(--success)', fontFamily: 'var(--font-mono)'}}>[ STATUS: ONLINE ]</div>
          </div>

          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'center', padding: '60px', overflowY: 'auto'}}>
            {pipeline.length === 0 ? (
              <div style={{textAlign: 'center', marginTop: '150px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)'}}>
                <div style={{width: 60, height: 60, border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
                  <Plus size={24} />
                </div>
                <p style={{fontSize: '11px'}}>ADD_NODE_TO_BEGIN</p>
              </div>
            ) : (
              pipeline.map((node, index) => (
                <React.Fragment key={node.pipelineId}>
                  <div className="card-solid animate-fade" style={{
                    width: '180px', 
                    padding: '16px', 
                    border: '1px solid var(--accent-primary)',
                    backgroundColor: 'var(--bg-tertiary)',
                    position: 'relative'
                  }}>
                    <div style={{fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-primary)', marginBottom: '8px'}}>STEP_0{index + 1}</div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'}}>
                      <Layers size={16} color="var(--accent-primary)" />
                      <strong style={{fontSize: '14px', color: 'white', letterSpacing: '0.5px'}}>{node.name.toUpperCase()}</strong>
                    </div>
                    <div style={{fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-tertiary)'}}>{node.price}</div>
                    <button 
                      onClick={() => removeFromPipeline(node.pipelineId)}
                      style={{position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer'}}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {index < pipeline.length - 1 && (
                    <div style={{height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)'}}>
                      <ArrowDown size={24} />
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        <div className="card-solid" style={{display: 'flex', flexDirection: 'column', padding: '0'}}>
          <div style={{padding: '24px', borderBottom: '1px solid var(--border-color)'}}>
            <h3 style={{marginBottom: 0, fontFamily: 'var(--font-mono)', fontSize: '15px'}}>NODE_REPOSITORY</h3>
          </div>
          
          <div style={{padding: '20px'}}>
            <div style={{position: 'relative'}}>
              <Settings size={14} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)'}} />
              <input 
                type="text" 
                placeholder="SEARCH_REPOSITORY..." 
                style={{width: '100%', padding: '10px 10px 10px 36px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: 'white', fontFamily: 'var(--font-mono)', fontSize: '11px', outline: 'none'}} 
              />
            </div>
          </div>
          
          <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px 20px'}}>
            {loading ? (
              <div style={{textAlign: 'center', padding: '60px'}}><Loader2 className="animate-spin" /></div>
            ) : (
              agents.map(agent => (
                <div key={agent.id} className="card-solid" style={{padding: '14px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.03)'}} onClick={() => addToPipeline(agent)}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontWeight: 700, fontSize: '14px', color: 'white'}}>{agent.name}</div>
                      <div style={{fontSize: '11px', color: 'var(--accent-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '2px'}}>{agent.price}</div>
                    </div>
                    <Plus size={16} color="var(--accent-primary)" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orchestrate;
