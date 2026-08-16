import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Apple,
  Smartphone,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import SentimentSummary from '../components/SentimentSummary';
import SentimentChart from '../components/SentimentChart';
import ThemeList from '../components/ThemeList';
import PlatformComparison from '../components/PlatformComparison';
import LoadingState from '../components/LoadingState';
import { formatNumber, formatScore, formatDate, getSentimentBadgeClass } from '../utils/formatters';
import { api } from '../services/api';

export default function AppDashboard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);
  const [error, setError] = useState(null);

  const loadAppData = async () => {
    try {
      setLoading(true);
      const appDash = await api.getApp(id);
      setData(appDash);
      setError(null);
    } catch (err) {
      console.error('Error loading app details:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load app dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppData();
  }, [id]);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const res = await api.syncApp(id, 60);
      setSyncNotice(res.message);
      await loadAppData();
      setTimeout(() => setSyncNotice(null), 4000);
    } catch (err) {
      setSyncNotice('Sync failed.');
      setTimeout(() => setSyncNotice(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading app sentiment metrics and compiling theme models..." />;
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h3 style={{ color: '#EF4444', marginBottom: '12px' }}>Application Error</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error}</p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Return to Search
        </Link>
      </div>
    );
  }

  const app = data.app;
  const metrics = data.metrics;
  const isApple = app.platform === 'APPLE';

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container">
        {/* Back link */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            to={`/organizations/${app.organization_id}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={14} /> Back to Organization Dashboard
          </Link>
        </div>

        {/* App Hero Header */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {app.icon_url ? (
                <img
                  src={app.icon_url}
                  alt={app.name}
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '18px',
                    objectFit: 'cover',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                />
              ) : (
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #4338CA, #6D28D9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '2rem',
                  fontWeight: 700,
                }}>
                  {app.name.charAt(0)}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{app.name}</h1>
                  <span className={`badge ${isApple ? 'badge-apple' : 'badge-google'}`}>
                    {isApple ? <Apple size={13} /> : <Smartphone size={13} />}
                    {isApple ? 'Apple iOS' : 'Google Play'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                  <span>Publisher: <strong style={{ color: '#E2E8F0' }}>{app.developer_name || 'Verified'}</strong></span>
                  {app.store_url && (
                    <a
                      href={app.store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#818CF8', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Store Listing <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Sync & Explorer Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={handleSync}
                disabled={isSyncing}
                className="btn btn-secondary"
              >
                <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Synchronizing...' : 'Sync Reviews'}
              </button>

              <Link to={`/apps/${app.id}/reviews`} className="btn btn-primary">
                <MessageSquare size={15} />
                <span>Review Explorer</span>
              </Link>
            </div>
          </div>

          {syncNotice && (
            <div style={{
              marginTop: '16px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#A5B4FC',
              fontSize: '0.85rem',
            }}>
              {syncNotice}
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>STORE RATING</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={22} fill="#F59E0B" />
              {metrics.average_rating ? metrics.average_rating.toFixed(1) : (app.current_rating ? app.current_rating.toFixed(1) : 'N/A')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Indexed average</div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>REVIEWS ANALYZED</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: '#FFFFFF' }}>
              {formatNumber(metrics.review_count)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Total parsed reviews</div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>SENTIMENT SCORE</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: metrics.sentiment_score >= 0 ? '#10B981' : '#EF4444' }}>
              {formatScore(metrics.sentiment_score)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Compound polarity</div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>POSITIVE RATIO</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: '#10B981' }}>
              {metrics.positive_pct}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Positive customer feedback</div>
          </div>
        </div>

        {/* Actionable Insights */}
        {data.insights && data.insights.length > 0 && (
          <div className="glass-card" style={{ padding: '24px', marginBottom: '28px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Lightbulb size={18} color="#818CF8" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Actionable App Insights</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {data.insights.map((ins, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <AlertCircle size={15} color={ins.severity === 'HIGH' ? '#EF4444' : '#10B981'} />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>{ins.title}</h4>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#CBD5E1', marginBottom: '8px' }}>
                    {ins.description}
                  </p>
                  <div style={{ fontSize: '0.775rem', color: '#93C5FD' }}>
                    <strong>Action:</strong> {ins.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-Platform Comparison Parity */}
        {data.platform_comparison && data.platform_comparison.length > 1 && (
          <div style={{ marginBottom: '28px' }}>
            <PlatformComparison items={data.platform_comparison} />
          </div>
        )}

        {/* Sentiment Health Breakdown */}
        <div style={{ marginBottom: '28px' }}>
          <SentimentSummary
            positivePct={metrics.positive_pct}
            neutralPct={metrics.neutral_pct}
            negativePct={metrics.negative_pct}
            sentimentScore={metrics.sentiment_score}
            totalReviews={metrics.review_count}
          />
        </div>

        {/* Recurring Positive & Negative Themes */}
        <div style={{ marginBottom: '28px' }}>
          <ThemeList
            positiveThemes={data.top_positive_themes}
            negativeThemes={data.top_negative_themes}
          />
        </div>

        {/* Historical Timeline Trends */}
        <div style={{ marginBottom: '28px' }}>
          <SentimentChart trends={data.trends} />
        </div>

        {/* Recent Reviews Preview */}
        {data.recent_reviews && data.recent_reviews.length > 0 && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '2px' }}>
                  Recent Customer Feedback
                </h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  Latest verified reviews analyzed with sentiment polarity
                </p>
              </div>

              <Link to={`/apps/${app.id}/reviews`} className="btn btn-outline btn-sm">
                <span>View All Reviews</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.recent_reviews.slice(0, 5).map((rev) => {
                const sentiment = rev.analysis?.sentiment || (rev.rating >= 4 ? 'POSITIVE' : (rev.rating <= 2 ? 'NEGATIVE' : 'NEUTRAL'));
                const score = rev.analysis?.sentiment_score;

                return (
                  <div key={rev.id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={13} color="#F59E0B" fill={s <= rev.rating ? '#F59E0B' : 'transparent'} />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>{rev.author_name || 'User'}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{formatDate(rev.review_date)}</span>
                        <span className={`badge ${getSentimentBadgeClass(sentiment)}`}>
                          {sentiment} {score !== undefined && score !== null ? `(${formatScore(score)})` : ''}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#CBD5E1', lineHeight: 1.5 }}>{rev.review_text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
