import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { ExpRealty } from './components/ExpRealty';
import { Footer } from './components/Footer';
import { TabbedContent } from './components/TabbedContent';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import CookiePolicy from './components/CookiePolicy';
import Accessibility from './components/Accessibility';
import FairHousing from './components/FairHousing';
import DMCA from './components/DMCA';
import AIChatAgent from './components/AIChatAgent';
import CookieConsentBanner from './components/CookieConsentBanner';
import { AdminPortal } from './components/AdminPortal';
import { FEATURED_LISTINGS, INVESTOR_LISTINGS } from './constants';
import { Listing } from './types';

function App() {
  // Initialize template properties if none exist
  useEffect(() => {
    const savedProperties = localStorage.getItem('managedProperties');
    if (!savedProperties) {
      const allTemplateProperties: Listing[] = [...FEATURED_LISTINGS, ...INVESTOR_LISTINGS];
      localStorage.setItem('managedProperties', JSON.stringify(allTemplateProperties));
      console.log('Initialized template properties:', allTemplateProperties.length);
    } else {
      const parsedProperties = JSON.parse(savedProperties);
      console.log('Loaded existing properties:', parsedProperties.length);
    }
  }, []);

  // Check if we're on the admin page
  const isAdminPage = typeof window !== 'undefined' && window.location.pathname === '/nms-admin';
  
  if (isAdminPage) {
    return <AdminPortal />;
  }

  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  const renderContent = () => {
    switch (path) {
      case '/privacy':
        return <Privacy />;
      case '/terms':
        return <Terms />;
      case '/cookies':
        return <CookiePolicy />;
      case '/accessibility':
        return <Accessibility />;
      case '/fair-housing':
        return <FairHousing />;
      case '/dmca':
        return <DMCA />;
      default:
        return (
          <>
            <TabbedContent />
            <ExpRealty />
          </>
        );
    }
  };

  return (
    <div className="bg-white">
      <Header />
      <main>
        {renderContent()}
      </main>
      <Footer />
      <AIChatAgent />
      <CookieConsentBanner />
    </div>
  );
}

export default App;