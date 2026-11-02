import { defaultPortfolioSettings, PortfolioSettings } from '@/types/portfolio';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchPortfolioSettings = async (): Promise<PortfolioSettings> => {
  try {
    const res = await fetch(`${API_URL}/api/portfolio`, { cache: 'no-store' });
    const payload = await res.json();

    if (!res.ok) {
      return defaultPortfolioSettings;
    }

    return payload?.data || defaultPortfolioSettings;
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return defaultPortfolioSettings;
  }
};

export const savePortfolioSettings = async (settings: PortfolioSettings) => {
  const res = await fetch(`${API_URL}/api/portfolio`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload?.message || 'Failed to save portfolio settings');
  }

  return payload?.data || settings;
};
