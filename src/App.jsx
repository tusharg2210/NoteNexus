import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Context ---
import { useAuth } from './context/AuthContext';

// --- Common Components ---
import Header from './Components/common/Header';
import Footer from './Components/common/Footer';
import ScrollToTopButton from './Components/scrollToTop';

// --- Pages ---
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutUs';
import LoginPage from './Pages/Login';
import ProfilePage from './Pages/Profile';
import Resource from './Pages/Resource';
import UploadPage from './Pages/UploadPage';
import PYQ from './Pages/PYQ';
import TeamPage from './Components/Team';
import Features from './Components/Features';
import TermsOfServicePage from './Pages/Terms';
import PrivacyPolicyPage from './Pages/Privacy';

// A wrapper to protect routes that require authentication
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        // If user is not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/resource" element={<Resource />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pyq" element={<PYQ />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          
          <Route
              path="/profile"
              element={
                  <ProtectedRoute>
                      <ProfilePage />
                  </ProtectedRoute>
              } 
          />

          {/* This is a catch-all route for 404 pages */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}

export default App;