import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Grid, Cpu, Zap, Globe, BarChart, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import LandingPage from './pages/LandingPage';
import Marketplace from './pages/Marketplace';
import Orchestrate from './pages/Orchestrate';
import LiveFeed from './pages/LiveFeed';
import DeployAgent from './pages/DeployAgent';
import Analytics from './pages/Analytics';
import AgentProfile from './pages/AgentProfile';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <Link to="/" className="logo-section" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">
            <Hexagon size={20} color="black" fill="black" />
          </div>
          <span className="logo-text">AGENT.MESH</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/marketplace" icon={<Grid size={18} />} label="MARKETPLACE" active={location.pathname === '/marketplace'} />
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
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/marketplace" element={<DashboardLayout><Marketplace /></DashboardLayout>} />
      <Route path="/orchestrate" element={<DashboardLayout><Orchestrate /></DashboardLayout>} />
      <Route path="/live" element={<DashboardLayout><LiveFeed /></DashboardLayout>} />
      <Route path="/deploy" element={<DashboardLayout><DeployAgent /></DashboardLayout>} />
      <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
      <Route path="/agent/:id" element={<DashboardLayout><AgentProfile /></DashboardLayout>} />
      {/* Fallback to marketplace if authenticated or landing if not - for now just redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const NavLink = ({ to, icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link to={to} className={`nav-item ${active ? 'active' : ''}`}>
    {icon}
    <span style={{fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px'}}>{label}</span>
  </Link>
);

export default App;

