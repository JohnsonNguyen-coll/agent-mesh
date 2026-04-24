import React from 'react';
import { Rocket, Info, AlertTriangle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACTS, AGENT_REGISTRY_ABI } from '../contracts/config';
import { parseUnits } from 'viem';

const DeployAgent = () => {
  const { isConnected, address } = useAccount();
  const { writeContract, data: hash, isPending, isSuccess, error: writeError } = useWriteContract();

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: '0.01',
    endpoint: 'http://',
    payoutAddress: ''
  });

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return alert('Please connect your wallet first');
    
    (writeContract as any)({
      address: CONTRACTS.AGENT_REGISTRY as `0x${string}`,
      abi: AGENT_REGISTRY_ABI,
      functionName: 'registerAgent',
      args: [
        formData.name,
        formData.description,
        BigInt(parseUnits(formData.price, 6)),
        formData.endpoint,
        (formData.payoutAddress || address) as `0x${string}`
      ],
      gas: 1000000n,
    });
  };

  return (
    <div className="animate-fade" style={{maxWidth: '800px'}}>
      <header style={{marginBottom: '48px'}}>
        <h1>Deploy New Agent</h1>
        <p className="subtitle">Register your AI agent to the mesh and start earning USDC.</p>
      </header>

      <div className="grid-cols-2" style={{gridTemplateColumns: '1.5fr 1fr', alignItems: 'start'}}>
        <form onSubmit={handleDeploy} className="card-solid" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div className="form-group">
            <label style={{display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px'}}>Agent Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. DataAnalyzer Pro"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              style={inputStyle}
            />
          </div>

          <div className="form-group">
            <label style={{display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px'}}>Service Description</label>
            <textarea 
              required
              placeholder="Describe what your agent does..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{...inputStyle, height: '100px', resize: 'none'}}
            />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label style={{display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px'}}>Price (USDC)</label>
              <input 
                type="number" 
                step="0.001"
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={{display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px'}}>Endpoint URL</label>
              <input 
                type="url" 
                required
                value={formData.endpoint}
                onChange={e => setFormData({...formData, endpoint: e.target.value})}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px'}}>Payout Address (Optional)</label>
            <input 
              type="text" 
              placeholder={address || '0x...'}
              value={formData.payoutAddress}
              onChange={e => setFormData({...formData, payoutAddress: e.target.value})}
              style={inputStyle}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isPending} style={{justifyContent: 'center', padding: '16px'}}>
            {isPending ? <Loader2 className="animate-spin" /> : <Rocket size={20} />}
            {isPending ? 'Deploying...' : 'Initialize Deployment'}
          </button>

          {isSuccess && (
            <div style={{padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '4px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '12px'}}>
              <CheckCircle2 size={20} />
              <div>
                <p style={{fontWeight: 700}}>Deployment Successful!</p>
                <p style={{fontSize: '12px'}}>TX: {hash?.slice(0,20)}...</p>
              </div>
            </div>
          )}

          {writeError && (
            <div style={{padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '4px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '12px'}}>
              <AlertTriangle size={20} />
              <p style={{fontSize: '12px', fontWeight: 600}}>{writeError.message.slice(0, 100)}...</p>
            </div>
          )}
        </form>

        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div className="card-solid" style={{backgroundColor: 'var(--bg-tertiary)', border: 'none'}}>
            <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)'}}>
              <Info size={18} /> Requirements
            </h4>
            <ul style={{fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <li>Your agent must have a public REST endpoint.</li>
              <li>Gas fees are paid in ETH/ARC.</li>
              <li>Agent description is stored on-chain.</li>
            </ul>
          </div>

          <div className="card-solid" style={{border: '1px solid var(--accent-primary)'}}>
            <h4 style={{color: 'var(--accent-primary)'}}>USDC Integration</h4>
            <p style={{fontSize: '13px', marginTop: '12px', color: 'var(--text-secondary)'}}>
              All payments are handled via EIP-3009 authorizations. Ensure your worker can verify result hashes to claim rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: 'var(--bg-tertiary)',
  border: '1px solid var(--border-color)',
  borderRadius: '4px',
  color: 'white',
  fontSize: '14px',
  outline: 'none'
};

export default DeployAgent;
