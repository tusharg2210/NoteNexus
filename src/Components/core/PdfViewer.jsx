import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, set, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { motion } from 'framer-motion';
import { db } from '/src/firebase';

// Simple SVG Icon for a document
const DocumentIcon = () => (
  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);

// A simple "skeleton" card for the loading state
const SkeletonCard = () => (
    <div className="bg-gray-800 p-5 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
);

// Illustrative icon for the empty state
const SearchNotFoundIcon = () => (
    <svg className="w-24 h-24 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <motion.path 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
      />
      <motion.path 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8, ease: "easeInOut" }}
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M14.25 7.75l-6.5 6.5" 
      />
    </svg>
);


function PdfViewer({ college, course, semester, docType }) {
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [bookmarkedPdfs, setBookmarkedPdfs] = useState([]); // Stores IDs of bookmarked PDFs

    // --- Authentication Listener ---
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // --- PDF Data Fetcher ---
    useEffect(() => {
        setLoading(true);
        const dbPath = `colleges/${college}/courses/${course}/sem/${semester}/docs/${docType}`;
        const dbRef = ref(db, dbPath);

        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const pdfList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                pdfList.sort((a, b) => b.uploadedAt - a.uploadedAt);
                setPdfs(pdfList);
            } else {
                setPdfs([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [college, course, semester, docType]);
    
    // --- Bookmark Data Fetcher ---
    useEffect(() => {
        if (currentUser) {
            const bookmarksPath = `users/${currentUser.uid}/bookmarks`;
            const bookmarksRef = ref(db, bookmarksPath);
            const unsubscribe = onValue(bookmarksRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setBookmarkedPdfs(Object.keys(data)); // Store an array of bookmarked PDF IDs
                } else {
                    setBookmarkedPdfs([]);
                }
            });
            return () => unsubscribe();
        } else {
            setBookmarkedPdfs([]); // Clear bookmarks if user logs out
        }
    }, [currentUser]);


    // --- Function to handle bookmarking a PDF ---
    const handleBookmark = async (pdf) => {
        if (!currentUser) {
            alert("Please log in to bookmark documents.");
            return;
        }

        const bookmarkPath = `users/${currentUser.uid}/bookmarks/${pdf.id}`;
        const isBookmarked = bookmarkedPdfs.includes(pdf.id);

        try {
            if (isBookmarked) {
                // If already bookmarked, remove it
                await remove(ref(db, bookmarkPath));
            } else {
                // If not bookmarked, add it with some basic info
                await set(ref(db, bookmarkPath), {
                    docName: pdf.docName,
                    downloadURL: pdf.downloadURL,
                    originalPath: `colleges/${college}/courses/${course}/sem/${semester}/docs/${docType}/${pdf.id}`
                });
                alert("Document bookmarked! You can view it in your profile.");
            }
        } catch (error) {
            console.error("Failed to update bookmark:", error);
            alert("Could not update bookmark. See console for details.");
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Date unknown';
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {pdfs.length === 1 ? (
                // This is the distinct "Empty State" section
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center w-full col-span-1 md:col-span-2 lg:col-span-3 py-16 px-6 bg-gray-800/50 rounded-lg mt-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-700"
                >
                    <SearchNotFoundIcon />
                    <h3 className="text-2xl font-bold text-white mt-4 mb-2">No Documents Found</h3>
                    <p className="text-gray-400 mb-6 max-w-sm">
                        We couldn't find any documents for this selection. Why not be the first to upload one?
                    </p>
                    <Link
                        to="/upload" // Make sure this route matches your upload page
                        className="bg-orange-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-orange-700 transition-colors duration-300 transform hover:scale-105"
                    >
                        Upload a Document
                    </Link>
                </motion.div>
            ) : (
                pdfs.slice(0, -1).map(pdf => {
                    const isBookmarked = bookmarkedPdfs.includes(pdf.id);
                    return (
                        <div key={pdf.id} className="bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col justify-between transition-transform duration-300 hover:scale-105">
                            <div>
                                <div className="flex items-start gap-4 mb-3">
                                    <DocumentIcon />
                                    <h3 className="text-lg font-bold text-white flex-1">{pdf.docName}</h3>
                                </div>
                                <p className="text-sm text-gray-400 mb-1">
                                    File: <span className="font-mono text-xs">{pdf.fileName}</span>
                                </p>
                                <p className="text-sm text-gray-400">
                                    Uploaded on: {formatDate(pdf.uploadedAt)}
                                </p>
                            </div>
                            <div className="mt-5 flex items-center gap-3">
                                <a 
                                    href={pdf.downloadURL} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center bg-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 transition-colors duration-300"
                                >
                                    View
                                </a>
                                <button
                                    onClick={() => handleBookmark(pdf)}
                                    className={`p-2 rounded-md transition-colors duration-200 ${isBookmarked ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                                    title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-heart-fill transition-transform duration-200 ${isBookmarked ? 'scale-110' : ''}`} viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default React.memo(PdfViewer);

