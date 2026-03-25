const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const fallbackApiBaseUrl = `http://${window.location.hostname}:5000`;

export const API_BASE_URL = configuredApiBaseUrl || fallbackApiBaseUrl;

export const apiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
