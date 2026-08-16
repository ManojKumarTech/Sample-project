import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, RefreshCw, ExternalLink, ArrowRight, Smartphone, Apple } from 'lucide-react';
import { formatNumber, formatScore } from '../utils/formatters';
import { api } from '../services/api';

export default function AppCard({ app, onSyncSuccess }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  const handleSync = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsSyncing(true);
      const res = await api.syncApp(app.id, 50);
      setSyncMessage(res.message);
      if (onSyncSuccess) {
        onSyncSuccess(app.id);
      }
      setTimeout(() => setSyncMessage(null), 3000);
    } catch (err) {
      setSyncMessage('Sync failed');
      setTimeout(() => setSyncMessage(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const isApple = app.platform === 'APPLE';

  return (
    <div className="glass-card" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Details */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {app.icon_url ? (
              <img
                src={app.icon_url}
                alt={app.name}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  objectFit: 'cover',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              />
            ) : (
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #4338CA, #6D28D9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}>
                {app.name.charAt(0)}
              </div>
            )}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2px', color: '#FFFFFF' }}>
                {app.name}
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {app.developer_name || 'Verified Publisher'}
              </div>
            </div>
          </div>

          {/* Platform Badge */}
          <div className={`badge ${isApple ? 'badge-apple' : 'badge-google'}`}>
            {isApple ? <Apple size={12} /> : <Smartphone size={12} />}
            {isApple ? 'iOS' : 'Android'}
          </div>
        </div>

        {/* Rating & Volume Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          padding: '12px 14px',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '10px',
          marginBottom: '16px',
        }}>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              Store Rating
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
                {app.current_rating ? app.current_rating.toFixed(1) : 'N/A'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/ 5.0</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              Reviews Indexed
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2px', color: '#FFFFFF' }}>
              {formatNumber(app.review_count || 0)}
            </div>
          </div>
        </div>

        {syncMessage && (
          <div style={{
            padding: '6px 12px',
            borderRadius: '6px',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            fontSize: '0.75rem',
            color: '#A5B4FC',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            {syncMessage}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className="btn btn-secondary btn-sm"
          title="Incrementally synchronize reviews from store"
        >
          <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing...' : 'Sync Reviews'}
        </button>

        <Link
          to={`/apps/${app.id}`}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 14px' }}
        >
          <span>App Intelligence</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
