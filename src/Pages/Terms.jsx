import React from 'react';
import { motion } from 'framer-motion';
import { Link as RouterLink} from 'react-router-dom';

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

function Terms() {
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
                <motion.h1 variants={itemVariants} className="text-4xl font-bold text-white text-center mb-2 font-serif">Terms of Service</motion.h1>
                <motion.p variants={itemVariants} className="text-gray-400 text-center mb-8">Last Updated: September 25, 2025</motion.p>

                <div className="space-y-6 text-left max-h-[60vh] overflow-y-auto pr-4">
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">1. Acceptance of Terms</h2>
                        <p>By accessing or using the NoteNexus application ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.</p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">2. User-Generated Content</h2>
                        <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.</p>
                        <p className="mt-2">You represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to be infringing on a copyright.</p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">3. Prohibited Conduct</h2>
                        <p>You agree not to use the Service to upload, post, email, or otherwise transmit any Content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy.</p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">4. Termination</h2>
                        <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">5. Governing Law</h2>
                        <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-orange-500 mb-2">6. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us at: <a href="mailto:tushargnita@gmail.com" className="text-orange-400 hover:underline">tushargnita@gmail.com</a>.</p>
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

export default Terms;
