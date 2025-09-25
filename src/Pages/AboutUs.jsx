import React from 'react';
import { motion } from 'framer-motion';

// Reusable animation variants for Framer Motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};


const AboutPage = () => {
  return (
    
    <div id='about' className="bg-gray-900 text-white min-h-screen">
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="text-center py-20 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.2),rgba(255,255,255,0))]"></div>
        <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-extrabold mb-4">
          About Note<span className="text-orange-500">Nexus</span>
        </motion.h1>
        <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          We believe that quality education materials should be accessible to everyone. We're on a mission to centralize university resources and empower students on their academic journey.
        </motion.p>
      </motion.section>

      {/* Our Mission Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
        className="py-16 px-6 container mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeIn}>
            <h2 className="text-3xl font-bold mb-4 text-orange-500">Our Mission</h2>
            <p className="text-gray-400 mb-4">
              Navigating university can be tough. Finding past year questions (PYQs), notes, and reliable solutions is often a scattered and frustrating process. NoteNexus was born from this exact challenge.
            </p>
            <p className="text-gray-400">
              Our goal is to create a single, powerful platform where students can find everything they need. From a comprehensive library of PYQs to AI-powered solutions and a collaborative sharing space, we're building the ultimate academic toolkit.
            </p>
          </motion.div>
          <motion.div variants={fadeIn} className="flex justify-center">
             <svg className="w-64 h-64 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
            </svg>
          </motion.div>
        </div>
      </motion.section>

      
    </div>
  );
};

export default AboutPage;

