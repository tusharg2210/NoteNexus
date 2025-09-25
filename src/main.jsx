import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Import BrowserRouter
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';

// It's also good practice to ensure Firebase is initialized here
// import './firebase.js'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap your components with BrowserRouter */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);