import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OrganizationDashboard from './pages/OrganizationDashboard';
import AppDashboard from './pages/AppDashboard';
import Reviews from './pages/Reviews';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/organizations/:id" element={<OrganizationDashboard />} />
          <Route path="/apps/:id" element={<AppDashboard />} />
          <Route path="/apps/:id/reviews" element={<Reviews />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer style={{
        padding: '24px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(9, 13, 22, 0.95)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
      }}>
        <div className="container">
          App Review Intelligence Platform • Cross-Store Mobile Discovery & NLP Sentiment Engine
        </div>
      </footer>
    </div>
  );
}
