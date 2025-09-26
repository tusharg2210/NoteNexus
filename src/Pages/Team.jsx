import React from 'react';
import { motion } from 'framer-motion';
import useDatabase from '../middleware/useDatabase'; // Import the hook

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

const TeamMemberCard = ({ name, batch, branch, college, imgUrl, githubURL, linkedinURL }) => (
  <motion.div variants={fadeIn} className="bg-gray-800/50 rounded-2xl p-6 text-center shadow-lg hover:bg-gray-800/80 hover:shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-2">
    <img src={imgUrl} alt={name} className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-gray-700 shadow-lg hover:border-orange-500 transition-colors" />
    <h3 className="text-xl font-bold text-white mt-4 font-serif hover:text-orange-500">{name}</h3>
    {branch && <p className="text-gray-400 text-sm font-mono hover:text-orange-500">{branch}</p>}
    {college && batch && <p className="text-gray-400 text-sm hover:text-orange-500">{college}' {batch}</p>}

    <div className="mt-4 flex justify-center items-center space-x-4">
      {githubURL && (
        <a href={githubURL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
          <svg className="w-8 h-8" fill='currentColor' viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path>
          </svg>
        </a>
      )}
      {linkedinURL && (
        <a href={linkedinURL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
          <svg className="w-8 h-8" fill='currentColor' viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
      )}
    </div>
  </motion.div>
);

function Team() {
  const { database, loading } = useDatabase(); // Use the hook to get data and loading state

  const admins = database?.admin ? Object.keys(database.admin).map(key => ({
      id: key,
      ...database.admin[key]
  })) : [];

  return (
    <>
    <div id="team" className="bg-gray-900 border-t border-gray-800 text-white min-h-screen">
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-20 px-6 container mx-auto"
      >

        <h2 className="text-6xl font-bold text-center mb-10 border-b-1 p-4 border-orange-500  transition-transform">Meet the <span className="text-orange-500">Team</span></h2>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-12 w-12 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {admins.map((admin) => (
              <TeamMemberCard
                key={admin.id}
                name={admin.adminName}
                batch={admin.adminBatch}
                branch={admin.adminBranch}
                college={admin.adminCollege}
                imgUrl={admin.adminIMGURL}
                githubURL={admin.adminGithubURL}
                linkedinURL={admin.adminLinkedInURL}
              />
            ))}
          </div>
        )}
      </motion.section>
    </div>
    </>
  );
}

export default Team;