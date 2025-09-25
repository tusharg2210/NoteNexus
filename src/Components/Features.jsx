import React from 'react';
import { motion } from 'framer-motion';

// Reusable animation variants for Framer Motion
const fadeIn = {
    hidden: { opacity: 1, y: 20 },
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

const ValueCard = ({ icon, title, children }) => (
    <motion.div variants={fadeIn} className="bg-gray-800 p-6 mt-4 rounded-lg border border-gray-700 hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
        <div className="text-orange-500 mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{children}</p>
    </motion.div>
);

function Features() {
    return (
        <>
            <div id="features" className='bg-gray-900 border-t border-gray-800 text-white min-h-screen'>
                {/* Our Values Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerContainer}
                    className="py-16 bg-gray-900/50 px-6"
                >
                    <div className="container mx-auto"><div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.2),rgba(255,255,255,0))]"></div>

                        <motion.h2 variants={fadeIn} className="text-6xl font-bold text-center mb-10 border-b-1 p-4 border-orange-500  transition-transform">Our Core <span className="text-orange-500">Values</span></motion.h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <ValueCard
                                icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>}
                                title="Community-Driven"
                            >
                                Built by students, for students. We thrive on collaboration and shared knowledge.
                            </ValueCard>
                            <ValueCard
                                icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>}
                                title="Innovation"
                            >
                                Leveraging AI and modern technology to create smart, intuitive learning tools.
                            </ValueCard>
                            <ValueCard
                                icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v.01" />
                                </svg>}
                                title="Accessibility"
                            >
                                Breaking down barriers to ensure every student has access to the resources they need to succeed.
                            </ValueCard>
                        </div>
                    </div>
                </motion.section>
            </div>

        </>

    );
}


export default Features;