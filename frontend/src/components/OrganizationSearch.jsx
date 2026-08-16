import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

const POPULAR_ORGANIZATIONS = [
  'Meta',
  'Spotify',
  'Google',
  'Microsoft',
  'Netflix',
  'Uber',
  'Airbnb',
  'ByteDance',
];

export default function OrganizationSearch({ onSearch, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && !isLoading) {
      onSearch(searchTerm.trim());
    }
  };

  const handleChipClick = (org) => {
    setSearchTerm(org);
    onSearch(org);
  };

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit} style={{ position: 'relative', marginBottom: '20px' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '8px 10px 8px 20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.15)',
          transition: 'all 0.2s ease',
        }}>
          <Search size={22} color="var(--text-muted)" style={{ marginRight: '14px', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Enter an organization name (e.g. Meta, Spotify, Google, Netflix)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
            id="organization-search-input"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: '1.05rem',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button
            type="submit"
            disabled={!searchTerm.trim() || isLoading}
            className="btn btn-primary"
            id="organization-search-button"
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              opacity: !searchTerm.trim() || isLoading ? 0.6 : 1,
              cursor: !searchTerm.trim() || isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <span>Analyze</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      {/* Suggested Quick Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Suggested:
        </span>
        {POPULAR_ORGANIZATIONS.map((org) => (
          <button
            key={org}
            type="button"
            onClick={() => handleChipClick(org)}
            disabled={isLoading}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              padding: '5px 14px',
              color: 'var(--text-muted)',
              fontSize: '0.825rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            {org}
          </button>
        ))}
      </div>
    </div>
  );
}
