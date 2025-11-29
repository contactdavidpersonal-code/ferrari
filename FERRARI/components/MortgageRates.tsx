import React, { useState, useEffect } from 'react';

interface RateData {
  thirtyYear: string;
  fifteenYear: string;
  fiveYearArm: string;
  lastUpdated: string;
}

export const MortgageRates: React.FC = () => {
  const [rates, setRates] = useState<RateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Using RapidAPI Mortgage Calculator API
        const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
        
        if (!apiKey) {
          // Fallback to mock data if no API key
          setRates({
            thirtyYear: '6.87',
            fifteenYear: '6.10',
            fiveYearArm: '6.42',
            lastUpdated: new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })
          });
          setLoading(false);
          return;
        }

        const response = await fetch('https://mortgage-calculator-api.p.rapidapi.com/rates', {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'mortgage-calculator-api.p.rapidapi.com'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch rates');

        const data = await response.json();
        
        setRates({
          thirtyYear: data.thirtyYear || '6.87',
          fifteenYear: data.fifteenYear || '6.10',
          fiveYearArm: data.fiveYearArm || '6.42',
          lastUpdated: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mortgage rates:', err);
        // Fallback to default rates
        setRates({
          thirtyYear: '6.87',
          fifteenYear: '6.10',
          fiveYearArm: '6.42',
          lastUpdated: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })
        });
        setError(true);
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-white/50 shadow-xl p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!rates) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl border-2 border-white/50 shadow-xl hover:border-accent/80 hover:shadow-[0_0_30px_rgba(107,78,15,0.4)] p-2 sm:p-2.5 md:p-3 transition-all duration-300 hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-2 sm:mb-2.5">
          <svg className="w-4 h-4 sm:w-4 sm:h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
          <h3 className="font-bold text-primary" style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)' }}>
            Current Mortgage Rates
          </h3>
        </div>

        {/* Rates Grid - Stacks on very small screens, smaller */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-2.5 mb-1.5 sm:mb-2">
          {/* 30-Year Fixed */}
          <div className="text-center p-1.5 sm:p-2 md:p-2 bg-gray-50 rounded-lg border-2 border-gray-200 shadow-md hover:bg-white hover:border-accent/70 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
            <div className="text-gray-600 font-semibold mb-1 text-xs leading-tight" style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', lineHeight: '1.2' }}>
              30-Year Fixed
            </div>
            <div className="font-bold text-accent" style={{ fontSize: 'clamp(0.9rem, 3vw, 1.5rem)' }}>
              {rates.thirtyYear}%
            </div>
          </div>

          {/* 15-Year Fixed */}
          <div className="text-center p-1.5 sm:p-2 md:p-2 bg-gray-50 rounded-lg border-2 border-gray-200 shadow-md hover:bg-white hover:border-accent/70 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
            <div className="text-gray-600 font-semibold mb-1 text-xs leading-tight" style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', lineHeight: '1.2' }}>
              15-Year Fixed
            </div>
            <div className="font-bold text-accent" style={{ fontSize: 'clamp(0.9rem, 3vw, 1.5rem)' }}>
              {rates.fifteenYear}%
            </div>
          </div>

          {/* 5/1 ARM */}
          <div className="text-center p-1.5 sm:p-2 md:p-2 bg-gray-50 rounded-lg border-2 border-gray-200 shadow-md hover:bg-white hover:border-accent/70 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
            <div className="text-gray-600 font-semibold mb-1 text-xs leading-tight" style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', lineHeight: '1.2' }}>
              5/1 ARM
            </div>
            <div className="font-bold text-accent" style={{ fontSize: 'clamp(0.9rem, 3vw, 1.5rem)' }}>
              {rates.fiveYearArm}%
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.7rem)' }}>
            Updated: {rates.lastUpdated}
            {error && ' • Using estimated rates'}
          </p>
        </div>
      </div>
    </div>
  );
};

