import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Star, MessageSquare } from 'lucide-react';
import ReviewTable from '../components/ReviewTable';
import LoadingState from '../components/LoadingState';
import { api } from '../services/api';

export default function Reviews() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [reviewData, setReviewData] = useState({ items: [], total: 0, page: 1, total_pages: 1 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchReviews = async (p = page, s = sentimentFilter, r = ratingFilter) => {
    try {
      setLoading(true);
      const [appData, revData] = await Promise.all([
        api.getApp(id),
        api.getReviews(id, {
          page: p,
          page_size: pageSize,
          sentiment: s || null,
          min_rating: r ? parseInt(r) : null,
          max_rating: r ? parseInt(r) : null,
        }),
      ]);
      setApp(appData.app);
      setReviewData(revData);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1, sentimentFilter, ratingFilter);
  }, [id, sentimentFilter, ratingFilter]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchReviews(newPage, sentimentFilter, ratingFilter);
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await api.syncApp(id, 50);
      await fetchReviews(1, sentimentFilter, ratingFilter);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading && !app) {
    return <LoadingState message="Loading review repository and sentiment classifications..." />;
  }

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            to={`/apps/${id}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={14} /> Back to App Intelligence Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {app?.icon_url && (
              <img src={app.icon_url} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
            )}
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                {app?.name} — Review Explorer
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                {app?.platform === 'APPLE' ? 'Apple App Store' : 'Google Play Store'} • Total Indexed: {reviewData.total.toLocaleString()} reviews
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="btn btn-secondary"
          >
            <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Synchronizing...' : 'Sync Reviews'}
          </button>
        </div>

        {/* Review Table */}
        <ReviewTable
          reviews={reviewData.items}
          total={reviewData.total}
          page={reviewData.page}
          pageSize={pageSize}
          totalPages={reviewData.total_pages}
          sentimentFilter={sentimentFilter}
          ratingFilter={ratingFilter}
          onPageChange={handlePageChange}
          onSentimentFilterChange={(s) => {
            setSentimentFilter(s);
            setPage(1);
          }}
          onRatingFilterChange={(r) => {
            setRatingFilter(r);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
