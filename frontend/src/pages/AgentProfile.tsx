import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Terminal, Cpu, Copy, Star } from 'lucide-react';
import { getAgentDetails } from '../utils/blockchain';
import { PAYMENT_ROUTER_ABI } from '../contracts/config';

const AgentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDetails = async () => {
      if (id) {
        const data = await getAgentDetails(id);
        setAgent(data);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  const handleViewConfig = () => {
    const configStr = JSON.stringify({
      id,
      name: agent.name,
      endpoint: agent.endpoint,
      price: agent.price,
      owner: agent.owner,
      payout: agent.payoutAddress,
      active: agent.active
    }, null, 2);
    alert(`NODE_CONFIGURATION_QUERY_RESULT:\n\n${configStr}`);
  };

  const handleCopyABI = () => {
    const abiSnippet = JSON.stringify(PAYMENT_ROUTER_ABI.find(x => x.name === 'routePayment'), null, 2);
    navigator.clipboard.writeText(abiSnippet);
    alert('ROUTING_PROTOCOL_ABI_COPIED');
  };

  if (loading) return <div style={{padding: '100px', textAlign: 'center', color: 'var(--accent-primary)'}}><Terminal className="animate-spin" /> SCANNING_NODE...</div>;
  if (!agent) return <div style={{padding: '100px', textAlign: 'center'}}>NODE_NOT_FOUND</div>;

  return (
    <div className="animate-fade">
      <div 
        onClick={() => navigate(-1)} 
        style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '40px', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer'}}
      >
        <ArrowLeft size={14} /> RETURN_TO_MESH
      </div>
      
      <div className="grid-cols-2" style={{gridTemplateColumns: '1.5fr 1fr', alignItems: 'start'}}>
        <div>
          <div className="card-solid" style={{marginBottom: '30px', borderLeft: '4px solid var(--accent-primary)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
              <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                <div style={{width: 64, height: 64, backgroundColor: 'rgba(0, 242, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-primary)'}}>
                  <Cpu size={32} color="var(--accent-primary)" />
                </div>
                <div>
                  <h1 style={{fontSize: '36px', marginBottom: '5px'}}>{agent.name}</h1>
                  <div className="status-indicator">
                    <div className="dot"></div>
                    <span>NODE_STATUS: ACTIVE</span>
                  </div>
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <p style={{fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)'}}>REPUTATION_SCORE</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: 800, color: 'var(--accent-tertiary)'}}>
                  <Star size={20} fill="var(--accent-tertiary)" color="var(--accent-tertiary)" />
                  {agent.reputation.toFixed(1)}
                </div>
              </div>
            </div>

            <p style={{fontSize: '18px', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '40px'}}>
              {agent.description}
            </p>

            <div style={{display: 'flex', gap: '15px'}}>
              <Link to="/orchestrate" className="btn-primary" style={{textDecoration: 'none'}}>HIRE_NODE</Link>
              <button className="btn-secondary" onClick={handleViewConfig}>VIEW_RAW_CONFIG</button>
            </div>
          </div>

          <div className="card-solid">
            <h3 style={{fontFamily: 'var(--font-mono)', fontSize: '16px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px'}}>
              <Terminal size={18} color="var(--accent-primary)" /> INTEGRATION_PROTOCOL
            </h3>
            <div style={{backgroundColor: 'rgba(0,0,0,0.3)', padding: '25px', border: '1px solid var(--border-color)', position: 'relative'}}>
              <p style={{fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-tertiary)', marginBottom: '15px'}}>// PaymentRouter.routePayment(agentId, taskData, ...)</p>
              <p style={{fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px'}}>Use the standard routing ABI to initialize an escrowed task for this node.</p>
              <button className="btn-secondary" style={{fontSize: '11px', padding: '10px 20px'}} onClick={handleCopyABI}>
                <Copy size={12} /> COPY_ROUTING_ABI
              </button>
            </div>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
          <div className="card-solid">
            <h3 style={{fontSize: '16px', marginBottom: '25px'}}>NODE_PARAMETERS</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <ParamRow label="ESCROW_PRICE" value={`${agent.price}`} highlight />
              <ParamRow label="ENDPOINT_URL" value={agent.endpoint} />
              <ParamRow label="PAYOUT_ADDR" value={agent.payoutAddress.slice(0,12) + '...'} />
              <ParamRow label="OWNER_ADDR" value={agent.owner.slice(0,12) + '...'} />
            </div>
          </div>

          <div className="card-solid" style={{backgroundColor: 'rgba(255, 0, 85, 0.02)', borderStyle: 'dashed'}}>
            <h3 style={{fontSize: '14px', color: 'var(--accent-secondary)'}}>PROTOCOL_NOTICE</h3>
            <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '15px'}}>
              All node interactions are logged on-chain. Malicious behavior will result in reputation slashing by the Mesh Governance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ParamRow = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
  <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid var(--border-color)'}}>
    <span style={{fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)'}}>{label}</span>
    <span style={{fontFamily: 'var(--font-mono)', fontSize: '13px', color: highlight ? 'var(--accent-tertiary)' : 'var(--text-primary)', fontWeight: highlight ? 700 : 400}}>{value}</span>
  </div>
);

export default AgentProfile;
