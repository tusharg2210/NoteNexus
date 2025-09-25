import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Icon for the Google Button ---
const GoogleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.638 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

// --- Animation Variants for Framer Motion (same as profile page) ---
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.2
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Login = () => {
  const { user, signInWithGoogle } = useAuth();

  // If user is already logged in, redirect them to the home page
  if (user) {
    return <Navigate to="/" />;
  }

  const handleGoogleSignIn = () => {
    signInWithGoogle().catch(error => {
      // You could show an error message to the user here
      console.error("Failed to start Google sign-in process", error);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.15),rgba(255,255,255,0))]"></div>
      
      <motion.div
        className="relative z-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white mb-2 font-serif">
          Welcome Back
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 mb-8">
          Sign in to access your resources.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <motion.button
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
          >
              <GoogleIcon />
              Sign in with Google
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
