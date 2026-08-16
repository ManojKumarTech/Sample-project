import React from 'react';
import { Apple, Smartphone, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { formatNumber, formatScore } from '../utils/formatters';

export default function PlatformComparison({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '2px' }}>
            Cross-Platform Intelligence (iOS vs Android)
          </h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            Direct parity comparison between Apple App Store and Google Play Store feedback
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: '16px' }}>
        {items.map((item, index) => {
          const isApple = item.platform === 'APPLE';
          return (
            <div key={index} style={{
              background: isApple ? 'rgba(255, 255, 255, 0.03)' : 'rgba(16, 185, 129, 0.04)',
              border: `1px solid ${isApple ? 'rgba(255, 255, 255, 0.12)' : 'rgba(16, 185, 129, 0.25)'}`,
              borderRadius: '12px',
              padding: '18px',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isApple ? <Apple size={20} color="#FFFFFF" /> : <Smartphone size={20} color="#34D399" />}
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {isApple ? 'Apple App Store (iOS)' : 'Google Play (Android)'}
                  </span>
                </div>
                <div className={`badge ${isApple ? 'badge-apple' : 'badge-google'}`}>
                  {isApple ? 'iOS' : 'Android'}
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>RATING</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Star size={14} fill="#F59E0B" />
                    {item.rating ? item.rating.toFixed(1) : 'N/A'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>REVIEWS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {formatNumber(item.review_count)}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>SENTIMENT</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: item.sentiment_score >= 0 ? '#10B981' : '#EF4444' }}>
                    {formatScore(item.sentiment_score)}
                  </div>
                </div>
              </div>

              {/* Sentiment percentages */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>Positive: {item.positive_pct}%</span>
                  <span style={{ color: '#EF4444', fontWeight: 600 }}>Negative: {item.negative_pct}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', display: 'flex', overflow: 'hidden' }}>
                  <div style={{ width: `${item.positive_pct}%`, background: '#10B981' }} />
                  <div style={{ width: `${item.neutral_pct}%`, background: '#F59E0B' }} />
                  <div style={{ width: `${item.negative_pct}%`, background: '#EF4444' }} />
                </div>
              </div>

              {/* Top Complaints */}
              {item.top_negative_themes && item.top_negative_themes.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '6px' }}>
                    Primary Complaints:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {item.top_negative_themes.map((t, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.725rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#F87171',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
