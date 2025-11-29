import React, { useState } from 'react';

interface AgentLoginProps {
  onLogin: (isAuthenticated: boolean) => void;
}

export const AgentLogin: React.FC<AgentLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'NMSadmin' && password === '1223') {
      localStorage.setItem('agentAuthenticated', 'true');
      onLogin(true);
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F1EB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '32px', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontFamily: 'Playfair Display, serif', fontWeight: 'bold', color: '#552448', marginBottom: '8px' }}>
            Agent Portal
          </h1>
          <p style={{ color: '#555555' }}>
            NMS Property Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label htmlFor="username" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333333', marginBottom: '8px' }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
              required
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333333', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
              required
            />
          </div>

          {error && (
            <div style={{ color: '#DC2626', fontSize: '14px', textAlign: 'center', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '6px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{ width: '100%', backgroundColor: '#552448', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#6B7280' }}>
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};
