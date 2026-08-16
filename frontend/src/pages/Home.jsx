import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers, ShieldCheck, TrendingUp, ArrowRight, Zap, RefreshCw, BarChart3, Database } from 'lucide-react';
import OrganizationSearch from '../components/OrganizationSearch';
import LoadingState from '../components/LoadingState';
import { api } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchOrgName, setSearchOrgName] = useState('');
  const [recentOrgs, setRecentOrgs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Load previously analyzed organizations
    api.listOrganizations(0, 8)
      .then((data) => setRecentOrgs(data))
      .catch((err) => console.log('Error loading recent orgs:', err));
  }, []);

  const handleSearch = async (orgName) => {
    setSearchOrgName(orgName);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await api.discoverOrganization(orgName);
      // Wait slightly so user sees progress stage completion
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/organizations/${result.organization_id}`);
      }, 1200);
    } catch (err) {
      console.error('Discovery error:', err);
      setIsLoading(false);
      setErrorMessage(
        err.response?.data?.detail || err.message || 'Unable to discover applications for this organization.'
      );
    }
  };

  if (isLoading) {
    return <LoadingState query={searchOrgName} />;
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 48px' }}>
          {/* Super Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '9999px',
            color: '#818CF8',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '24px',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
          }}>
            <Sparkles size={16} />
            Autonomous Mobile App Intelligence & Sentiment Platform
          </div>

          <h1 style={{
            fontSize: '3.25rem',
            lineHeight: 1.15,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Turn Millions of App Store Reviews into Product Clarity
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '36px',
            maxWidth: '680px',
            margin: '0 auto 36px',
          }}>
            Enter any organization name to automatically discover their mobile apps across <strong>Apple App Store</strong> and <strong>Google Play Store</strong>, analyze customer sentiment, extract friction themes, and derive actionable engineering insights.
          </p>

          {/* Search Box */}
          <OrganizationSearch onSearch={handleSearch} isLoading={isLoading} />

          {errorMessage && (
            <div style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#FCA5A5',
              fontSize: '0.9rem',
              maxWidth: '600px',
              margin: '20px auto 0',
            }}>
              {errorMessage}
            </div>
          )}
        </div>

        {/* Previously Discovered Organizations */}
        {recentOrgs.length > 0 && (
          <div style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Previously Analyzed Organizations
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {recentOrgs.map((org) => (
                <div
                  key={org.id}
                  onClick={() => navigate(`/organizations/${org.id}`)}
                  className="glass-card"
                  style={{
                    padding: '18px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>{org.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>View Intelligence Dashboard</span>
                  </div>
                  <ArrowRight size={16} color="var(--accent-primary)" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Value Proposition Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <Zap size={22} color="#6366F1" />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Cross-Store Discovery</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Deterministic confidence matching links apps across Apple App Store and Google Play to a single parent organization.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <BarChart3 size={22} color="#10B981" />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>VADER Sentiment Intelligence</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Abstracted NLP sentiment pipeline evaluates valence, confidence score, and polar distributions for every review.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <ShieldCheck size={22} color="#F59E0B" />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Actionable Insights Engine</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Automated heuristics highlight platform disparity, login friction, crash anomalies, and strategic product recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
