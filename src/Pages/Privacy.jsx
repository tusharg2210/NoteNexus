import React from 'react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

// --- Animation Variants for Framer Motion ---
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function Privacy() {
    return (
        <>
        
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.15),rgba(255,255,255,0))]"></div>
            
            <motion.div 
                className="relative z-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-3xl text-gray-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 variants={itemVariants} className="text-4xl font-bold text-white text-center mb-2 font-serif">Privacy Policy</motion.h1>
                <motion.p variants={itemVariants} className="text-gray-400 text-center mb-8">Last Updated: September 25, 2025</motion.p>

                <div className="space-y-6 text-left max-h-[60vh] overflow-y-auto pr-4">
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">1. Introduction</h2>
                        <p>Welcome to NoteNexus. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">2. Information We Collect</h2>
                        <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
                        <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-gray-400">
                            <li><strong>Personal Data:</strong> When you register using Google Sign-In, we collect personal information, such as your name, email address, and profile picture, as provided by your Google account.</li>
                            <li><strong>User-Generated Content:</strong> We collect the files (PDFs, documents, etc.) and associated metadata (document name, college, course, semester) that you voluntarily upload to our service.</li>
                            <li><strong>Usage Data:</strong> We may automatically collect information about your device and how you interact with our service, such as your IP address and browsing history on our site.</li>
                        </ul>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">3. How We Use Your Information</h2>
                        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
                        <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-gray-400">
                            <li>Create and manage your account.</li>
                            <li>Display your uploaded content to other users.</li>
                            <li>Enable user-to-user communication (e.g., bookmarks).</li>
                            <li>Monitor and analyze usage and trends to improve your experience.</li>
                            <li>Protect our application from misuse and ensure security.</li>
                        </ul>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">4. Data Security</h2>
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">5. Contact Us</h2>
                        <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:tushargnita@gmail.com" className="text-orange-400 hover:underline">tushargnita@gmail.com</a>.</p>
                    </motion.div>
                </div>
                 <motion.div variants={itemVariants} className="text-center mt-8">
                    <RouterLink to="/" className="text-orange-400 hover:text-orange-300 transition-colors">← Back to Home</RouterLink>
                </motion.div>
            </motion.div>
        </div>
        </>
    );
};

export default Privacy;
