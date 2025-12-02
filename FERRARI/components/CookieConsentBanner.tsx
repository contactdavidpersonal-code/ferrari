import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookiePreferences';

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: '',
};

const CookieConsentBanner: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsMounted(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CookiePreferences;
        setPreferences(parsed);
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }

    const handleOpenPreferences = () => {
      setManageMode(true);
      setShowBanner(true);
    };

    window.addEventListener('open-cookie-preferences', handleOpenPreferences);
    return () => window.removeEventListener('open-cookie-preferences', handleOpenPreferences);
  }, []);

  const persistPreferences = (prefs: CookiePreferences) => {
    if (typeof window === 'undefined') return;
    const value = { ...prefs, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setPreferences(value);
  };

  const handleAcceptAll = () => {
    persistPreferences({ necessary: true, analytics: true, marketing: true, updatedAt: '' });
    setShowBanner(false);
    setManageMode(false);
  };

  const handleRejectNonEssential = () => {
    persistPreferences({ necessary: true, analytics: false, marketing: false, updatedAt: '' });
    setShowBanner(false);
    setManageMode(false);
  };

  const handleSaveCustom = () => {
    persistPreferences(preferences);
    setShowBanner(false);
    setManageMode(false);
  };

  if (!isMounted || !showBanner) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-charcoal/10 max-w-4xl mx-auto p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:block text-3xl">🍪</div>
          <div className="space-y-3 text-sm text-charcoal">
            <h2 className="font-semibold text-lg">Your Privacy & Cookie Preferences</h2>
            <p>
              We use cookies and similar technologies to run the site, analyze engagement, and personalize your experience.
              You can update your choices anytime by selecting “Cookie Preferences” in the footer.
            </p>

            {manageMode ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Necessary Cookies</p>
                    <p className="text-xs text-gray-500">Required for security and basic site features.</p>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">Always on</span>
                </label>
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics Cookies</p>
                    <p className="text-xs text-gray-500">Help us understand site traffic and improve services.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))}
                  />
                </label>
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing / Lead Attribution</p>
                    <p className="text-xs text-gray-500">Used to measure campaigns and personalize outreach.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, marketing: e.target.checked }))}
                  />
                </label>
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Read the full <a href="/cookies" className="underline text-primary">Cookie Policy</a> or{' '}
                <button
                  type="button"
                  onClick={() => setManageMode(true)}
                  className="underline text-primary"
                >
                  manage preferences
                </button>
                .
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              {manageMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary/90"
                  >
                    Save choices
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectNonEssential}
                    className="bg-gray-200 text-charcoal px-4 py-2 rounded-md font-semibold hover:bg-gray-300"
                  >
                    Reject non-essential
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary/90"
                  >
                    Accept all cookies
                  </button>
                  <button
                    type="button"
                    onClick={() => setManageMode(true)}
                    className="bg-gray-200 text-charcoal px-4 py-2 rounded-md font-semibold hover:bg-gray-300"
                  >
                    Manage preferences
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectNonEssential}
                    className="text-primary underline font-semibold"
                  >
                    Reject non-essential
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;

