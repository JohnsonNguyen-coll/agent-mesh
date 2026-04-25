import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Zap, Shield, Cpu, Globe, ArrowRight } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container" style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000000 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Background Animation Elements */}
      <div className="bg-glow" style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0, 242, 255, 0.05) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: 0
      }} />

      {/* Navigation Header */}
      <nav style={{
        width: '100%',
        maxWidth: '1200px',
        padding: '30px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'
          }}>
            <Hexagon size={18} color="black" fill="black" />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '20px',
            letterSpacing: '-1px'
          }}>AGENT.MESH</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => navigate('/whitepaper')} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '12px' }}>
            DOCS
          </button>
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
              const ready = mounted;
              const connected = ready && account && chain;
              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button onClick={openConnectModal} className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }}>
                          CONNECT WALLET
                        </button>
                      );
                    }
                    if (chain.unsupported) {
                      return (
                        <button onClick={openChainModal} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                          WRONG NETWORK
                        </button>
                      );
                    }
                    return (
                      <button onClick={openAccountModal} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '12px', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>
                        {account.displayName}
                      </button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

      </nav>


      {/* Hero Section */}
      <main style={{
        maxWidth: '1200px',
        width: '100%',
        padding: '100px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        zIndex: 10
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            backgroundColor: 'rgba(0, 242, 255, 0.05)',
            border: '1px solid rgba(0, 242, 255, 0.2)',
            borderRadius: '100px',
            marginBottom: '30px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-primary)',
            letterSpacing: '1px'
          }}>
            <span className="dot" style={{ width: '8px', height: '8px' }}></span>
            V1.0 PROTOCOL IS LIVE
          </div>
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            lineHeight: 0.9,
            marginBottom: '30px',
            background: 'linear-gradient(to bottom, #fff 40%, #666 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            NEURAL FABRIC<br />
            FOR AI AGENTS
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto 50px',
            lineHeight: 1.6
          }}>
            AgentMesh is the decentralized orchestration layer for the next generation of autonomous intelligence. 
            Deploy, scale, and monetize AI nodes in a high-performance neural mesh.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/marketplace')}
              className="btn-primary" 
              style={{ padding: '18px 40px', fontSize: '16px' }}
            >
              LAUNCH CONSOLE <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/whitepaper')}
              className="btn-secondary" 
              style={{ padding: '18px 40px', fontSize: '16px' }}
            >
              READ WHITEPAPER
            </button>
          </div>

        </motion.div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '150px',
          width: '100%'
        }}>
          <FeatureCard 
            icon={<Cpu size={32} color="var(--accent-primary)" />}
            title="High Performance"
            description="Ultra-low latency execution nodes optimized for heavy LLM workloads and autonomous reasoning."
          />
          <FeatureCard 
            icon={<Shield size={32} color="var(--accent-primary)" />}
            title="Secure Trustless"
            description="Cryptographically secured agent-to-agent communication via the AgentMesh reputation engine."
          />
          <FeatureCard 
            icon={<Globe size={32} color="var(--accent-primary)" />}
            title="Elastic Scaling"
            description="Automatically scale your AI workforce across a global network of decentralized compute providers."
          />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        width: '100%',
        borderTop: '1px solid var(--border-color)',
        padding: '50px 20px',
        marginTop: '100px',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            © 2026 AGENTMESH PROTOCOL. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '30px' }}>
            {['TWITTER', 'DISCORD', 'GITHUB'].map(link => (
              <a key={link} href="#" style={{ 
                color: 'var(--text-secondary)', 
                textDecoration: 'none', 
                fontSize: '12px', 
                fontFamily: 'var(--font-mono)',
                letterSpacing: '1px'
              }}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="card-solid" 
    style={{ textAlign: 'left', padding: '40px' }}
  >
    <div style={{ marginBottom: '25px' }}>{icon}</div>
    <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '15px' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{description}</p>
  </motion.div>
);

export default LandingPage;
