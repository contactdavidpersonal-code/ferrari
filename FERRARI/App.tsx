import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { ExpRealty } from './components/ExpRealty';
import { Footer } from './components/Footer';
import { TabbedContent } from './components/TabbedContent';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import AIChatAgent from './components/AIChatAgent';
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

  return (
    <div className="bg-white">
      <Header />
      <main>
        {/* Simple route-like render based on location pathname */}
        {typeof window !== 'undefined' && (window.location.pathname === '/privacy') ? (
          <Privacy />
        ) : typeof window !== 'undefined' && (window.location.pathname === '/terms') ? (
          <Terms />
        ) : (
          <>
            <TabbedContent />
            <ExpRealty />
          </>
        )}
      </main>
      <Footer />
      <AIChatAgent />
    </div>
  );
}

export default App;