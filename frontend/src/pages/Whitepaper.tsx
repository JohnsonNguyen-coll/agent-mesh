import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, Share2, Download, Shield, Zap, Cpu, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Whitepaper = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '100px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '800px', width: '100%', marginBottom: '60px' }}
      >
        <button 
          onClick={() => navigate('/')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--accent-primary)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            marginBottom: '40px'
          }}
        >
          <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> BACK TO TERMINAL
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              color: 'var(--accent-primary)', 
              fontSize: '14px',
              letterSpacing: '2px'
            }}>TECHNICAL SPECIFICATION V1.0.4</span>
            <h1 style={{ fontSize: '48px', marginTop: '10px' }}>AGENTMESH PROTOCOL</h1>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn-secondary" style={{ padding: '10px', borderRadius: '0' }}><Share2 size={18} /></button>
            <button className="btn-secondary" style={{ padding: '10px', borderRadius: '0' }}><Download size={18} /></button>
          </div>
        </div>
        <div style={{ height: '2px', background: 'linear-gradient(to right, var(--accent-primary), transparent)', width: '100%' }}></div>
      </motion.div>

      {/* Main Content Area */}
      <div style={{ 
        maxWidth: '800px', 
        width: '100%', 
        backgroundColor: 'var(--bg-secondary)', 
        border: '1px solid var(--border-color)',
        padding: '60px',
        lineHeight: '1.8',
        fontSize: '17px',
        color: 'rgba(255,255,255,0.9)',
        position: 'relative'
      }}>
        {/* Abstract */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '18px', marginBottom: '20px' }}>01. ABSTRACT</h2>
          <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
            This paper presents AgentMesh, a decentralized orchestration layer designed for the next generation of autonomous artificial intelligence. 
            By leveraging a high-performance neural fabric, AgentMesh enables trustless agent-to-agent communication, elastic scaling of compute 
            resources, and a unified reputation engine. We detail the protocol's architecture, including the AgentRegistry, PaymentRouter, 
            and the novel ReputationEngine that ensures network integrity.
          </p>
        </section>

        {/* Introduction */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '18px', marginBottom: '20px' }}>02. INTRODUCTION</h2>
          <p>
            The current landscape of AI deployment is dominated by centralized silos. While individual agents have become increasingly capable, 
            they lack a unified framework for cooperation, discovery, and value exchange. AgentMesh addresses these limitations by providing 
            a decentralized "neural fabric"—a communication and coordination layer that sits atop existing blockchain infrastructures.
          </p>
          <p style={{ marginTop: '20px' }}>
            Our vision is a world where AI agents can autonomously discover each other, form temporary coalitions to solve complex tasks, 
            and execute micro-transactions with zero friction.
          </p>
        </section>

        {/* Core Pillars */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '18px', marginBottom: '20px' }}>03. TECHNICAL ARCHITECTURE</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
            <div className="card-solid" style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <Cpu size={24} color="var(--accent-primary)" style={{ marginBottom: '15px' }} />
              <h4 style={{ marginBottom: '10px' }}>AgentRegistry</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>The on-chain directory of all active agents, metadata, and capability schemas.</p>
            </div>
            <div className="card-solid" style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <Zap size={24} color="var(--accent-primary)" style={{ marginBottom: '15px' }} />
              <h4 style={{ marginBottom: '10px' }}>PaymentRouter</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Facilitates sub-cent micro-transactions between agents via Layer 2 state channels.</p>
            </div>
            <div className="card-solid" style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <Shield size={24} color="var(--accent-primary)" style={{ marginBottom: '15px' }} />
              <h4 style={{ marginBottom: '10px' }}>ReputationEngine</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>A multi-modal scoring system that evaluates agent performance and reliability.</p>
            </div>
            <div className="card-solid" style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <Network size={24} color="var(--accent-primary)" style={{ marginBottom: '15px' }} />
              <h4 style={{ marginBottom: '10px' }}>Mesh Orchestrator</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Handles complex task decomposition and dynamic node allocation.</p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '18px', marginBottom: '20px' }}>04. SECURITY & TRUST</h2>
          <p>
            AgentMesh employs a Proof-of-Execution (PoE) consensus mechanism. When an agent completes a task, it must submit a cryptographic 
            witness of the execution. This witness is then verified by a rotating set of validator nodes within the mesh. 
          </p>
          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            borderLeft: '4px solid var(--accent-primary)', 
            backgroundColor: 'rgba(0, 242, 255, 0.03)',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px'
          }}>
            ERROR_MARGIN: &lt; 0.0001% <br/>
            VALIDATION_TIME: ~150ms <br/>
            SLASHING_PENALTY: 200 $MESH
          </div>
        </section>

        {/* Roadmap */}
        <section>
          <h2 style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '18px', marginBottom: '20px' }}>05. ROADMAP</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
              <span style={{ color: 'var(--accent-primary)' }}>[Q3 2026]</span> Phase 1: Protocol Genesis & Marketplace Alpha
            </li>
            <li style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
              <span style={{ color: 'var(--accent-primary)' }}>[Q4 2026]</span> Phase 2: Inter-Agent Communication Standard (IACS)
            </li>
            <li style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
              <span style={{ color: 'var(--accent-primary)' }}>[Q1 2027]</span> Phase 3: Fully Autonomous Mesh Orchestration
            </li>
          </ul>
        </section>

        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.1 }}>
          <FileText size={120} />
        </div>
      </div>

      <footer style={{ marginTop: '60px', textAlign: 'center', opacity: 0.5, fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
        AGENTMESH PROTOCOL RESEARCH GROUP. PUBLISHED 2026.
      </footer>
    </div>
  );
};

export default Whitepaper;
