/**
 * API utility functions for handling basePath in client-side fetches
 */

/**
 * Get the basePath for API calls - handles both dev and production
 *
 * In Next.js with basePath configured, client-side fetches need to use
 * the correct path prefix. This function detects if we're running under
 * a basePath and returns the appropriate prefix.
 *
 * @returns The basePath (e.g., '/dsq') or empty string if not applicable
 */
export const getApiBasePath = (): string => {
  // In browser, check if we're served from a basePath
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    // If we're on /dsq/*, use /dsq as base path for API
    if (pathname.startsWith('/dsq')) {
      return '/dsq';
    }
  }
  // Fallback: no basePath (works in dev without basePath)
  return '';
};

/**
 * Build a full API URL with the correct basePath
 *
 * @param endpoint - The API endpoint path (e.g., '/api/tickets')
 * @returns The full URL with basePath prefix if needed
 */
export const buildApiUrl = (endpoint: string): string => {
  const basePath = getApiBasePath();
  return `${basePath}${endpoint}`;
};
