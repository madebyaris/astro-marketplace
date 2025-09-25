// Utility functions for tracking affiliate link clicks

export interface AffiliateClickData {
  productId: number;
  marketplace: string;
  targetUrl: string;
  userAgent?: string;
  referrer?: string;
}

/**
 * Track affiliate link click and redirect to target URL
 */
export async function trackAffiliateClick(data: AffiliateClickData): Promise<void> {
  try {
    // Track the click asynchronously
    const trackingData = {
      ...data,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    };

    // Send tracking request (don't wait for response to avoid delays)
    fetch('/api/affiliate/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trackingData)
    }).catch(error => {
      console.error('Failed to track affiliate click:', error);
    });

    // Redirect to target URL
    window.open(data.targetUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Error in affiliate click tracking:', error);
    // Still redirect even if tracking fails
    window.open(data.targetUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Create a tracked affiliate link handler
 */
export function createAffiliateClickHandler(
  productId: number,
  marketplace: string,
  targetUrl: string
) {
  return (event: Event) => {
    event.preventDefault();
    trackAffiliateClick({
      productId,
      marketplace,
      targetUrl
    });
  };
}

/**
 * Add affiliate tracking to existing links
 */
export function addAffiliateTracking(
  element: HTMLElement,
  productId: number,
  marketplace: string,
  targetUrl: string
) {
  element.addEventListener('click', createAffiliateClickHandler(productId, marketplace, targetUrl));
}

/**
 * Format affiliate link statistics for display
 */
export function formatClickCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}

/**
 * Get click rate percentage
 */
export function calculateClickRate(clicks: number, views: number): number {
  if (views === 0) return 0;
  return Math.round((clicks / views) * 100 * 100) / 100; // Round to 2 decimal places
}

