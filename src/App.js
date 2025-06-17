import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './unAuth/HomePage';
import SignPage from './unAuth/SignPage';
import Dashboard from './Auth/Dashboard';
import { AuthProvider, useAuth } from './AuthContext';
import './firebase';

const Analytics = ({ measurementId }) => {
  useEffect(() => {
    if (!measurementId) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', measurementId, { send_page_view: false });

    return () => {
      document.head.removeChild(script);
    };
  }, [measurementId]);

  return null;
};

const REACT_APP_GA4_MEASUREMENT_ID = process.env.REACT_APP_GA4_MEASUREMENT_ID;

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Analytics measurementId={REACT_APP_GA4_MEASUREMENT_ID} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
