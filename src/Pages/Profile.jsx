import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { ref, onValue } from "firebase/database";

// --- Icons ---
const SignOutIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);

const LoadingSpinner = () => (
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
);

const DocumentIcon = () => (
    <svg className="w-6 h-6 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);


// --- Animation Variants for Framer Motion ---
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
      staggerChildren: 0.1
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState([]); // State to hold bookmarks

    // ✅ Fetch bookmarks when the user object is available
    useEffect(() => {
        if (user) {
            const bookmarksRef = ref(db, `users/${user.uid}/bookmarks`);
            const unsubscribe = onValue(bookmarksRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Convert bookmarks object to an array
                    const bookmarksList = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    setBookmarks(bookmarksList);
                } else {
                    setBookmarks([]);
                }
            });
            // Cleanup listener on component unmount
            return () => unsubscribe();
        }
    }, [user]); // Re-run effect if the user changes

    const handleSignOut = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to sign out", error);
        }
    };

    // Helper function to format the 'Member Since' date
    const getMemberSince = () => {
        if (user?.metadata?.creationTime) {
            return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
            });
        }
        return 'N/A';
    };

    // Fallback for profile picture: displays user's initials
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Loading state while user data is being fetched
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
            
            <motion.div 
                className="relative z-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Profile Picture */}
                <motion.div variants={itemVariants} className="relative w-32 h-32 mx-auto mb-6">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-gray-700 shadow-lg" />
                    ) : (
                        <div className="w-full h-full rounded-full bg-orange-500 flex items-center justify-center text-4xl font-bold text-white border-4 border-gray-700 shadow-lg">
                            {getInitials(user.displayName)}
                        </div>
                    )}
                     <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800" title="Online"></div>
                </motion.div>
                
                {/* User Info */}
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white">{user.displayName || 'Anonymous User'}</motion.h2>
                <motion.p variants={itemVariants} className="text-gray-400 mt-1">{user.email}</motion.p>
                <motion.p variants={itemVariants} className="text-sm text-gray-500 mt-2">Member since {getMemberSince()}</motion.p>
                                
                <motion.div variants={itemVariants} className="my-6 border-t border-gray-700"></motion.div>

                {/* ✅ Bookmarks Section */}
                <motion.div variants={itemVariants} className="text-left">
                    <h3 className="font-bold text-lg text-white mb-3">My Bookmarks</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {bookmarks.length > 0 ? (
                            bookmarks.map(bookmark => (
                                <motion.a 
                                    key={bookmark.id}
                                    href={bookmark.downloadURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                    variants={itemVariants}
                                >
                                    <DocumentIcon />
                                    <span className="text-gray-300 text-sm truncate">{bookmark.docName}</span>
                                </motion.a>
                            ))
                        ) : (
                            <motion.p variants={itemVariants} className="text-gray-500 text-sm text-center py-4">No bookmarks yet.</motion.p>
                        )}
                    </div>
                </motion.div>

                {/* Sign Out Button */}
                <motion.div variants={itemVariants} className="mt-8">
                    <motion.button
                        onClick={handleSignOut}
                        className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <SignOutIcon />
                        Sign Out
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;

