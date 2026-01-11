/**
 * Formats a Date object into a human-readable string.
 * Shows relative time for recent dates and absolute time for older ones.
 *
 * @param date - The date to format
 * @returns A human-readable date string
 */
export function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // For very recent times (within 1 hour), show relative time
  if (diffMins < 1) {
    return 'just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  // For dates within the current year, show "Jan 11, 5:05 PM"
  const isCurrentYear = date.getFullYear() === now.getFullYear();
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  if (isCurrentYear && diffDays < 7) {
    // Within last week: "Jan 11, 5:05 PM"
    const datePart = date.toLocaleDateString('en-US', dateOptions);
    const timePart = date.toLocaleTimeString('en-US', timeOptions);
    return `${datePart}, ${timePart}`;
  }

  if (isCurrentYear) {
    // Same year but older: "Jan 11"
    return date.toLocaleDateString('en-US', dateOptions);
  }

  // Different year: "Jan 11, 2025"
  return date.toLocaleDateString('en-US', {
    ...dateOptions,
    year: 'numeric',
  });
}

/**
 * Formats an ISO timestamp string into a human-readable string.
 *
 * @param isoString - The ISO timestamp string
 * @returns A human-readable date string
 */
export function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    return formatDate(date);
  } catch {
    return isoString;
  }
}
