/**
 * Format a date or timestamp into a readable string
 * @param {Date|Object} timestamp
 * @returns {string}
 */
export function formatDate(timestamp) {
  if (!timestamp) return "Unknown date";

  try {
    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (e) {
    return "Invalid date";
  }
}

/**
 * Get CSS class for sentiment based on score
 * @param {Object} sentiment
 * @returns {string} CSS class name
 */
export function getSentimentClass(sentiment) {
  if (!sentiment) return "neutral";

  const score = sentiment.score || 0;
  if (score > 0.2) return "positive";
  if (score < -0.2) return "negative";
  return "neutral";
}

/**
 * Get sentiment text label based on score
 * @param {Object} sentiment
 * @returns {string}
 */
export function getSentimentText(sentiment) {
  if (!sentiment) return "Neutral";

  const score = sentiment.score || 0;
  if (score > 0.2) return "Positive";
  if (score < -0.2) return "Negative";
  return "Neutral";
}
