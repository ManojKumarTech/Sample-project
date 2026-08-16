import React from 'react';
import { Smile, Meh, Frown, Sparkles, TrendingUp } from 'lucide-react';
import { formatScore } from '../utils/formatters';

export default function SentimentSummary({ positivePct = 0, neutralPct = 0, negativePct = 0, sentimentScore = 0.0, totalReviews = 0 }) {
  // Determine overall sentiment tag
  let overallSentiment = 'Neutral';
  let overallColor = '#F59E0B';
  if (sentimentScore >= 0.15) {
    overallSentiment = 'Positive';
    overallColor = '#10B981';
  } else if (sentimentScore <= -0.15) {
    overallSentiment = 'Negative';
    overallColor = '#EF4444';
  }

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2px' }}>
            Sentiment Health Score
          </h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.825rem' }}>
            Computed via VADER NLP polarity analysis across {totalReviews.toLocaleString()} customer reviews
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: `${overallColor}18`,
          border: `1px solid ${overallColor}40`,
          borderRadius: '9999px',
          color: overallColor,
          fontWeight: 700,
          fontSize: '0.85rem',
        }}>
          <Sparkles size={14} />
          {overallSentiment} ({formatScore(sentimentScore)})
        </div>
      </div>

      {/* Progress Bar Stack */}
      <div style={{
        height: '14px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '9999px',
        overflow: 'hidden',
        display: 'flex',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div
          title={`Positive: ${positivePct}%`}
          style={{
            width: `${positivePct}%`,
            background: 'linear-gradient(90deg, #10B981, #34D399)',
            transition: 'width 0.6s ease',
          }}
        />
        <div
          title={`Neutral: ${neutralPct}%`}
          style={{
            width: `${neutralPct}%`,
            background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
            transition: 'width 0.6s ease',
          }}
        />
        <div
          title={`Negative: ${negativePct}%`}
          style={{
            width: `${negativePct}%`,
            background: 'linear-gradient(90deg, #EF4444, #F87171)',
            transition: 'width 0.6s ease',
          }}
        />
      </div>

      {/* Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {/* Positive */}
        <div style={{
          padding: '16px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Smile size={22} color="#10B981" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6EE7B7', fontWeight: 600, textTransform: 'uppercase' }}>
              Positive
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>
              {positivePct}%
            </div>
          </div>
        </div>

        {/* Neutral */}
        <div style={{
          padding: '16px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Meh size={22} color="#F59E0B" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#FCD34D', fontWeight: 600, textTransform: 'uppercase' }}>
              Neutral
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>
              {neutralPct}%
            </div>
          </div>
        </div>

        {/* Negative */}
        <div style={{
          padding: '16px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Frown size={22} color="#EF4444" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#FCA5A5', fontWeight: 600, textTransform: 'uppercase' }}>
              Negative
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>
              {negativePct}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
