import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Grid, Cpu, Zap, Globe, BarChart, Hexagon, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import Marketplace from './pages/Marketplace';
import Orchestrate from './pages/Orchestrate';
import LiveFeed from './pages/LiveFeed';
import DeployAgent from './pages/DeployAgent';
import Analytics from './pages/Analytics';
import AgentProfile from './pages/AgentProfile';

const App = () => {
  const location = useLocation();

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <Hexagon size={20} color="black" fill="black" />
          </div>
          <span className="logo-text">AGENT.MESH</span>
        </div>

        <div className="nav-links">
          <NavLink to="/" icon={<Grid size={18} />} label="MARKETPLACE" active={location.pathname === '/'} />
          <NavLink to="/orchestrate" icon={<Cpu size={18} />} label="ORCHESTRATE" active={location.pathname === '/orchestrate'} />
          <NavLink to="/live" icon={<Zap size={18} />} label="LIVE PROTOCOL" active={location.pathname === '/live'} />
          <NavLink to="/deploy" icon={<Globe size={18} />} label="DEPLOY NODE" active={location.pathname === '/deploy'} />
          <NavLink to="/analytics" icon={<BarChart size={18} />} label="MESH ANALYTICS" active={location.pathname === '/analytics'} />
        </div>

        <div style={{marginTop: 'auto'}}>
          <div className="card-solid" style={{padding: '20px', backgroundColor: 'rgba(0, 242, 255, 0.02)', borderStyle: 'dashed'}}>
            <div className="status-indicator">
              <div className="dot"></div>
              <span>NETWORK ONLINE</span>
            </div>
            <p style={{fontFamily: 'var(--font-mono)', fontSize: '10px', marginTop: '12px', color: 'var(--text-secondary)'}}>
              BLOCK: 5,042,002<br/>
              LATENCY: 12ms
            </p>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ width: '100%' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Marketplace />} />
              <Route path="/orchestrate" element={<Orchestrate />} />
              <Route path="/live" element={<LiveFeed />} />
              <Route path="/deploy" element={<DeployAgent />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/agent/:id" element={<AgentProfile />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const NavLink = ({ to, icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link to={to} className={`nav-item ${active ? 'active' : ''}`}>
    {icon}
    <span style={{fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px'}}>{label}</span>
  </Link>
);

export default App;
