import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import RecordingPage from './components/RecordingPage';
import AdminPage from './components/AdminPage';
import LoginPage from './components/LoginPage';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in (simple localStorage check)
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken === 'eblessings-admin-2024') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (password) => {
    if (password === 'parents2024') {
      localStorage.setItem('adminToken', 'eblessings-admin-2024');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <AppContainer>
        <div className="loading">Loading...</div>
      </AppContainer>
    );
  }

  return (
    <Router>
      <AppContainer>
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <MainContent>
          <div className="container">
            <Routes>
              <Route path="/" element={<RecordingPage />} />
              <Route 
                path="/admin" 
                element={
                  isAuthenticated ? (
                    <AdminPage />
                  ) : (
                    <LoginPage onLogin={handleLogin} />
                  )
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App; 