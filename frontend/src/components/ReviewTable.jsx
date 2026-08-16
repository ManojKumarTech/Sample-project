import React from 'react';
import { Star, MessageSquare, Filter, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { formatDate, formatScore, getSentimentBadgeClass } from '../utils/formatters';

export default function ReviewTable({
  reviews = [],
  total = 0,
  page = 1,
  pageSize = 20,
  totalPages = 1,
  sentimentFilter = '',
  ratingFilter = '',
  onPageChange,
  onSentimentFilterChange,
  onRatingFilterChange,
}) {
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#6366F1" />
            Customer Reviews & Sentiment Explorer
          </h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            Displaying {reviews.length} of {total.toLocaleString()} parsed and indexed reviews
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => onSentimentFilterChange(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.825rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Sentiments</option>
            <option value="POSITIVE">Positive Only</option>
            <option value="NEUTRAL">Neutral Only</option>
            <option value="NEGATIVE">Negative Only</option>
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => onRatingFilterChange(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.825rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Review List */}
      {reviews.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
          No reviews match the selected filter criteria.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {reviews.map((rev) => {
            const sentiment = rev.analysis?.sentiment || (rev.rating >= 4 ? 'POSITIVE' : (rev.rating <= 2 ? 'NEGATIVE' : 'NEUTRAL'));
            const score = rev.analysis?.sentiment_score;
            const badgeClass = getSentimentBadgeClass(sentiment);

            return (
              <div
                key={rev.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')}
              >
                {/* Review Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Stars */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          color="#F59E0B"
                          fill={s <= rev.rating ? '#F59E0B' : 'transparent'}
                        />
                      ))}
                    </div>

                    {/* Author & Version */}
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F1F5F9' }}>
                      {rev.author_name || 'Verified User'}
                    </span>
                    {rev.review_version && (
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                        v{rev.review_version}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {formatDate(rev.review_date)}
                    </span>
                    <span className={`badge ${badgeClass}`}>
                      {sentiment} {score !== undefined && score !== null ? `(${formatScore(score)})` : ''}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.55 }}>
                  {rev.review_text}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Page {page} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="btn btn-secondary btn-sm"
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="btn btn-secondary btn-sm"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
