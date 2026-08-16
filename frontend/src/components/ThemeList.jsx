import React from 'react';
import { AlertTriangle, ThumbsUp, Layers, CheckCircle } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export default function ThemeList({ positiveThemes = [], negativeThemes = [] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Top Positive Themes */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ThumbsUp size={18} color="#10B981" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Top Praise & Strengths</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Core features driving positive reviews</p>
          </div>
        </div>

        {positiveThemes.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No positive theme patterns detected yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {positiveThemes.map((theme, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '10px',
                padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E2E8F0' }}>
                    {theme.theme_name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {formatNumber(theme.review_count)} reviews
                    </span>
                    <span className="badge badge-positive" style={{ fontSize: '0.7rem' }}>
                      {theme.percentage}%
                    </span>
                  </div>
                </div>

                <div style={{
                  height: '6px',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(theme.percentage, 100)}%`,
                    background: '#10B981',
                    borderRadius: '3px',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Negative Themes */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <AlertTriangle size={18} color="#EF4444" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Critical Friction & Issues</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Primary topics causing negative sentiment</p>
          </div>
        </div>

        {negativeThemes.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No recurring negative issues identified yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {negativeThemes.map((theme, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px',
                padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E2E8F0' }}>
                    {theme.theme_name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {formatNumber(theme.review_count)} reviews
                    </span>
                    <span className="badge badge-negative" style={{ fontSize: '0.7rem' }}>
                      {theme.percentage}%
                    </span>
                  </div>
                </div>

                <div style={{
                  height: '6px',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(theme.percentage, 100)}%`,
                    background: '#EF4444',
                    borderRadius: '3px',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
