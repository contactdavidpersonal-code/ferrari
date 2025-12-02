import { useEffect, useState } from 'react';

export interface RateData {
  thirtyYear: string;
  fifteenYear: string;
  fiveYearArm: string;
  lastUpdated: string;
}

interface MortgageRateState {
  rates: RateData | null;
  loading: boolean;
  error: boolean;
}

const buildFallbackRates = (): RateData => ({
  thirtyYear: '6.87',
  fifteenYear: '6.10',
  fiveYearArm: '6.42',
  lastUpdated: new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
});

export const useMortgageRates = (): MortgageRateState => {
  const [rates, setRates] = useState<RateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      try {
        const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;

        if (!apiKey) {
          if (isMounted) {
            setRates(buildFallbackRates());
            setLoading(false);
          }
          return;
        }

        const response = await fetch('https://mortgage-calculator-api.p.rapidapi.com/rates', {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'mortgage-calculator-api.p.rapidapi.com',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch rates');
        }

        const data = await response.json();
        const nextRates: RateData = {
          thirtyYear: data.thirtyYear || '6.87',
          fifteenYear: data.fifteenYear || '6.10',
          fiveYearArm: data.fiveYearArm || '6.42',
          lastUpdated: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        };

        if (isMounted) {
          setRates(nextRates);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching mortgage rates:', err);
        if (isMounted) {
          setRates(buildFallbackRates());
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, []);

  return { rates, loading, error };
};

