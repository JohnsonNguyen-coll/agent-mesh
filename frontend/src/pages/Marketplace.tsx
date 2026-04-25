import React from 'react';
import { Search, Filter, Shield, Cpu, ArrowUpRight, Loader2, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAgents } from '../utils/blockchain';

const Marketplace = () => {
  const [agents, setAgents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 6;

  React.useEffect(() => {
    const fetchAgents = async () => {
      const data = await getAgents();
      setAgents(data);
      setLoading(false);
    };
    fetchAgents();
  }, []);

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.id.toString().includes(searchQuery)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAgents.length / pageSize);
  const paginatedAgents = filteredAgents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  if (loading) {
    return (
      <div style={{display:'flex', justifyContent:'center', padding:'100px'}}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <header style={{marginBottom: '60px', position: 'relative'}}>
        <div style={{position: 'absolute', top: -20, left: 0, width: 40, height: 2, backgroundColor: 'var(--accent-primary)'}}></div>
        <h1 style={{color: 'white'}}>Agent Protocol <span style={{color: 'var(--accent-primary)'}}>01</span></h1>
        <p className="subtitle">Interface with autonomous compute nodes across the decentralized mesh.</p>
        
        <div style={{display: 'flex', gap: '20px', marginTop: '32px'}}>
          <div style={{flex: 1, position: 'relative'}}>
            <Search style={{position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)'}} size={20} />
            <input 
              type="text" 
              placeholder="QUERY MESH BY NAME, ID OR CAPABILITY..." 
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: '100%', 
                padding: '18px 18px 18px 56px', 
                backgroundColor: 'var(--bg-secondary)', 
                border: '1px solid var(--border-color)',
                color: 'white',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '1px',
                outline: 'none'
              }}
            />
          </div>
          <button 
            className="btn-secondary" 
            onClick={() => setSearchQuery('')}
            style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '0 30px'}}
          >
            <Filter size={18} /> RESET_FILTERS
          </button>
        </div>
      </header>

      <div className="grid-cols-3">
        {paginatedAgents.length === 0 ? (
          <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '100px', border: '1px dashed var(--border-color)'}}>
            <p style={{color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)'}}>NO_NODES_FOUND_ON_CHAIN</p>
            <Link to="/deploy" className="btn-primary" style={{marginTop: '30px'}}>INITIALIZE_NEW_NODE</Link>
          </div>
        ) : (
          paginatedAgents.map((agent) => (
            <Link to={`/agent/${agent.id}`} key={agent.id} style={{textDecoration: 'none', color: 'inherit', display: 'flex'}}>
              <div className="card-solid" style={{
                flex: 1,
                display: 'flex', 
                flexDirection: 'column',
                minHeight: '340px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                  <div style={{width: 50, height: 50, backgroundColor: 'rgba(0, 242, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-primary)'}}>
                    <Cpu size={26} color="var(--accent-primary)" />
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="status-indicator">
                      <div className="dot"></div>
                      <span>ONLINE</span>
                    </div>
                    <p style={{fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px'}}>NODE_ID: {agent.id}</p>
                  </div>
                </div>
                
                <div style={{height: '54px', marginBottom: '10px', display: 'flex', alignItems: 'flex-start', overflow: 'hidden'}}>
                  <h3 style={{
                    fontSize: '16px', 
                    fontWeight: 800, 
                    lineHeight: '1.3',
                    wordBreak: 'break-all',
                    margin: 0,
                    color: 'white',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {agent.name}
                  </h3>
                </div>
                
                <p style={{
                  color: 'var(--text-secondary)', 
                  fontSize: '13px', 
                  marginBottom: '20px', 
                  height: '40px', 
                  overflow: 'hidden', 
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {agent.description}
                </p>

                <div style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingTop: '20px', 
                  borderTop: '1px solid var(--border-color)',
                  marginTop: 'auto'
                }}>
                  <div>
                    <p style={{fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800}}>ESCROW_REWARD</p>
                    <p style={{fontWeight: 800, fontSize: '18px', color: 'var(--accent-tertiary)', fontFamily: 'var(--font-mono)'}}>{agent.price.replace(' USDC', '')}<span style={{fontSize: '12px', color: 'var(--text-secondary)'}}> USDC</span></p>
                  </div>
                  <div style={{width: 32, height: 32, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <ArrowUpRight size={18} color="var(--text-secondary)" />
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div style={{position: 'absolute', bottom: 10, left: 10, width: 4, height: 4, backgroundColor: 'var(--accent-secondary)'}}></div>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '48px'}}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="btn-secondary"
            style={{padding: '8px 16px'}}
          >
            PREV
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: currentPage === i + 1 ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: currentPage === i + 1 ? 'black' : 'white',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {i + 1}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="btn-secondary"
            style={{padding: '8px 16px'}}
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
