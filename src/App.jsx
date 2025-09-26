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
import TeamPage from './Pages/Team';
import Features from './Pages/Features';
import TermsOfServicePage from './Pages/Terms';
import PrivacyPolicyPage from './Pages/Privacy';
import FolderView from './Pages/FolderView';
import BookmarksPage from './Pages/BookmarksPage'; // Import the page

// A wrapper to protect routes that require authentication
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div></div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/resource" element={<Resource />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pyq" element={<PYQ />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          
          {/* --- Protected Routes --- */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/folder/:folderId" element={<ProtectedRoute><FolderView /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}

export default App;
