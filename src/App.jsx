import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Context ---
import { AuthProvider, useAuth } from './context/AuthContext';

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
    const { user, loading } = useAuth(); // Assuming useAuth provides a loading state

    // If auth state is still loading, you might want to show a spinner
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // If user is not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
  
  return (
    <AuthProvider>
      <Router>
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

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <ScrollToTopButton />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

