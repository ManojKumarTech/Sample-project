import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers,
  Star,
  MessageSquare,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ArrowLeft,
  Smartphone,
  Apple,
  RefreshCw,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import AppCard from '../components/AppCard';
import SentimentSummary from '../components/SentimentSummary';
import SentimentChart from '../components/SentimentChart';
import ThemeList from '../components/ThemeList';
import LoadingState from '../components/LoadingState';
import { formatNumber, formatScore } from '../utils/formatters';
import { api } from '../services/api';

export default function OrganizationDashboard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashData, appsData] = await Promise.all([
        api.getOrganizationDashboard(id),
        api.getOrganizationApps(id),
      ]);
      setData(dashData);
      setApps(appsData);
      setError(null);
    } catch (err) {
      console.error('Error loading org dashboard:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load organization dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [id]);

  const handleSyncAll = async () => {
    if (!apps || apps.length === 0) return;
    try {
      setSyncingAll(true);
      for (const app of apps) {
        await api.syncApp(app.id, 25);
      }
      await loadDashboard();
    } catch (err) {
      console.error('Error syncing all apps:', err);
    } finally {
      setSyncingAll(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading organization intelligence and computing cross-platform metrics..." />;
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h3 style={{ color: '#EF4444', marginBottom: '12px' }}>Dashboard Error</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error}</p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Return to Search
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container">
        {/* Back Link & Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
              <ArrowLeft size={14} /> Back to Search
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
                {data.organization_name}
              </h1>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '6px 14px', fontSize: '0.8rem' }}>
                {data.total_apps} Apps Discovered
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncAll}
            disabled={syncingAll}
            className="btn btn-secondary"
          >
            <RefreshCw size={15} className={syncingAll ? 'animate-spin' : ''} />
            {syncingAll ? 'Syncing All Apps...' : 'Sync All Reviews'}
          </button>
        </div>

        {/* Executive Overview Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>TOTAL APPS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: '#FFFFFF' }}>{data.total_apps}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Apple iOS & Google Play</div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>TOTAL REVIEWS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: '#FFFFFF' }}>{formatNumber(data.total_reviews)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Ingested & Analyzed</div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>AVG STORE RATING</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={22} fill="#F59E0B" />
              {data.average_rating ? data.average_rating.toFixed(1) : 'N/A'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Across all stores</div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>SENTIMENT SCORE</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: data.sentiment_score >= 0 ? '#10B981' : '#EF4444' }}>
              {formatScore(data.sentiment_score)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>NLP Compound Valence</div>
          </div>
        </div>

        {/* Actionable AI Insights Section */}
        {data.insights && data.insights.length > 0 && (
          <div className="glass-card" style={{ padding: '26px', marginBottom: '28px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Lightbulb size={20} color="#818CF8" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Executive Actionable Insights</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Rule-based AI synthesis detecting anomalies, cross-platform disparity, and high-impact areas</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {data.insights.map((ins, idx) => {
                const isHigh = ins.severity === 'HIGH';
                const isPos = ins.severity === 'POSITIVE';
                const borderColor = isHigh ? 'rgba(239, 68, 68, 0.3)' : isPos ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)';
                const iconColor = isHigh ? '#EF4444' : isPos ? '#10B981' : '#818CF8';

                return (
                  <div key={idx} style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <AlertCircle size={16} color={iconColor} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>{ins.title}</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '10px', lineHeight: 1.45 }}>
                      {ins.description}
                    </p>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#93C5FD',
                      background: 'rgba(59, 130, 246, 0.1)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}>
                      <strong>Action:</strong> {ins.recommendation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Global Sentiment Health Gauge */}
        <div style={{ marginBottom: '28px' }}>
          <SentimentSummary
            positivePct={data.positive_pct}
            neutralPct={data.neutral_pct}
            negativePct={data.negative_pct}
            sentimentScore={data.sentiment_score}
            totalReviews={data.total_reviews}
          />
        </div>

        {/* Discovered Applications Grid */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Discovered Applications ({apps.length})
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {apps.map((app) => (
              <AppCard key={app.id} app={app} onSyncSuccess={loadDashboard} />
            ))}
          </div>
        </div>

        {/* Cross-App Comparison Matrix */}
        {data.apps_comparison && data.apps_comparison.length > 0 && (
          <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Cross-Application Comparison Matrix
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '20px' }}>
              Comparative breakdown across all mobile titles owned by {data.organization_name}
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-dim)' }}>
                    <th style={{ padding: '12px 16px' }}>Application</th>
                    <th style={{ padding: '12px 16px' }}>Platform</th>
                    <th style={{ padding: '12px 16px' }}>Rating</th>
                    <th style={{ padding: '12px 16px' }}>Reviews</th>
                    <th style={{ padding: '12px 16px' }}>Positive %</th>
                    <th style={{ padding: '12px 16px' }}>Negative %</th>
                    <th style={{ padding: '12px 16px' }}>Sentiment</th>
                    <th style={{ padding: '12px 16px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.apps_comparison.map((row) => (
                    <tr
                      key={row.app_id}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.15s ease' }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#FFFFFF' }}>
                        <Link to={`/apps/${row.app_id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFFFFF' }}>
                          {row.icon_url ? (
                            <img src={row.icon_url} alt="" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                          ) : null}
                          {row.name}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${row.platform === 'APPLE' ? 'badge-apple' : 'badge-google'}`}>
                          {row.platform === 'APPLE' ? 'iOS' : 'Android'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#F59E0B', fontWeight: 700 }}>
                        ★ {row.rating ? row.rating.toFixed(1) : 'N/A'}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {formatNumber(row.review_count)}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#10B981', fontWeight: 600 }}>
                        {row.positive_pct}%
                      </td>
                      <td style={{ padding: '14px 16px', color: '#EF4444', fontWeight: 600 }}>
                        {row.negative_pct}%
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: row.sentiment_score >= 0 ? '#10B981' : '#EF4444' }}>
                        {formatScore(row.sentiment_score)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Link to={`/apps/${row.app_id}`} className="btn btn-outline btn-sm">
                          Deep Dive <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Global Themes & Trends Grid */}
        <div style={{ marginBottom: '28px' }}>
          <ThemeList
            positiveThemes={data.top_positive_themes}
            negativeThemes={data.top_negative_themes}
          />
        </div>

        <div>
          <SentimentChart trends={data.trends} />
        </div>
      </div>
    </div>
  );
}
