import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Activity, Layers, Search, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 0',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
          }}>
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #FFFFFF, #CBD5E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              App Intelligence
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Review & Sentiment Engine
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: location.pathname === '/' ? '#FFFFFF' : 'var(--text-muted)',
              background: location.pathname === '/' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              border: location.pathname === '/' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <Search size={16} />
            Discover
          </Link>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--sentiment-pos)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sentiment-pos)', display: 'inline-block' }}></span>
            API Online
          </div>
        </div>
      </div>
    </nav>
  );
}
