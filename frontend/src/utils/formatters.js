export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

export function formatDate(dateString) {
  if (!dateString) return 'Recent';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatScore(score) {
  if (score === null || score === undefined) return '0.0';
  const prefix = score > 0 ? '+' : '';
  return `${prefix}${Number(score).toFixed(2)}`;
}

export function getSentimentBadgeClass(sentiment) {
  if (!sentiment) return 'badge-neutral';
  const upper = sentiment.toUpperCase();
  if (upper === 'POSITIVE') return 'badge-positive';
  if (upper === 'NEGATIVE') return 'badge-negative';
  return 'badge-neutral';
}
