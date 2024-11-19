import React, { useState, useEffect } from 'react';
import keycloak from './keycloak';
import './LoginPage.css';

const LoginPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState('');

  // Initialize Keycloak and handle login
  const handleLogin = async () => {
    try {
      const authenticated = await keycloak.init({
        onLoad: 'login-required',
      });
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setJwtToken(keycloak.token);
      }
    } catch (error) {
      console.error('Error during Keycloak initialization:', error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    keycloak.logout();
  };

  // Automatically update the token in the UI whenever it gets refreshed
  useEffect(() => {
    if (isAuthenticated) {
      const updateToken = () => {
        keycloak.updateToken(30).then((refreshed) => {
          if (refreshed) {
            console.log('Token refreshed:', keycloak.token);
            setJwtToken(keycloak.token); // Update the state with the new token
          }
        }).catch((err) => {
          console.error('Failed to refresh token:', err);
          keycloak.logout();
        });
      };

      // Set an interval to check and update the token
      const intervalId = setInterval(updateToken, 10000); // Every 10 seconds
      return () => clearInterval(intervalId); // Cleanup on component unmount
    }
  }, [isAuthenticated]);

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