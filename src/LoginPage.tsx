import React, { useState, useEffect } from 'react';
import keycloak from './keycloak';
import './LoginPage.css'; // Styling for this page

const LoginPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState('');

  const handleLogin = async () => {
    try {
      const authenticated = await keycloak.init({ onLoad: 'login-required' });
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setJwtToken(keycloak.token);
      }
    } catch (error) {
      console.error('Error during Keycloak initialization:', error);
    }
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  useEffect(() => {
    const tokenRefreshInterval = setInterval(() => {
      if (keycloak.token && keycloak.isTokenExpired()) {
        keycloak.updateToken(30).catch(() => keycloak.logout());
      }
    }, 10000); // Refresh token every 10 seconds
    return () => clearInterval(tokenRefreshInterval);
  }, []);

  return (
    <div className="login-page">
      <h1>React + Keycloak Integration</h1>
      {!isAuthenticated ? (
        <button className="login-btn" onClick={handleLogin}>
          Log In with Keycloak
        </button>
      ) : (
        <div>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
          <div className="jwt-display">
            <h2>Your JWT Token</h2>
            <pre>{jwtToken}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;