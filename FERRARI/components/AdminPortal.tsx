import React, { useState, useEffect } from 'react';
import { AgentLogin } from './AgentLogin';
import { PropertyManagement } from './PropertyManagement';

export const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('agentAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  const handleLogout = () => {
    localStorage.removeItem('agentAuthenticated');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F7F1EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '3px solid #F7F1EB', 
            borderTop: '3px solid #552448', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#555555' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AgentLogin onLogin={handleLogin} />;
  }

  return <PropertyManagement onLogout={handleLogout} />;
};
