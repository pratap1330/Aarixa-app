export const API_CONFIG = {
  BASE_URL: 'https://prod.wealthspaze.com',
// BASE_URL: 'http://43.224.137.63:9085',
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};