import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useDatabase from '../middleware/useDatabase';
import ResourceViewer from '../Components/common/ResourceView';
import { useAuth } from '../context/AuthContext';

// --- Icons ---
const BackIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
);

// --- Animation Variants ---
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FolderView = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const { database, loading } = useDatabase();
    const { user } = useAuth();

    const bookmarkedItemIds = useMemo(() => {
        if (!user || !database?.users?.[user.uid]?.bookmarks) return [];
        return Object.keys(database.users[user.uid].bookmarks);
    }, [database, user]);

    const folderData = useMemo(() => {
        if (!database || !folderId) return null;

        const findFolder = (db) => {
            for (const collegeKey in db.colleges) {
                const college = db.colleges[collegeKey];
                for (const courseKey in college.courses) {
                    const course = college.courses[courseKey];
                    for (const semKey in course.sem) {
                        const semester = course.sem[semKey];
                        for (const docTypeKey in semester.docs) {
                            const docType = semester.docs[docTypeKey];
                            if (docType[folderId]) {
                                return {
                                    folder: docType[folderId],
                                    path: `colleges/${collegeKey}/courses/${courseKey}/sem/${semKey}/docs/${docTypeKey}/${folderId}`
                                };
                            }
                        }
                    }
                }
            }
            return null;
        };

        return findFolder(database);
    }, [database, folderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 p-8 text-white text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
            </div>
        );
    }

    if (!folderData || !folderData.folder.files) {
        return (
            <div className="min-h-screen bg-gray-900 p-8 text-white text-center flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Folder Not Found</h1>
                <p className="text-gray-400">The folder you are trying to access does not exist or is empty.</p>
                <button onClick={() => navigate(-1)} className="mt-8 inline-flex items-center bg-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700">
                    <BackIcon />
                    Go Back
                </button>
            </div>
        );
    }
    
    // ✅ FIX: Each file now inherits the `uploadedAt` timestamp from its parent folder.
    // This ensures the date is always available and displayed correctly.
    const files = Object.keys(folderData.folder.files).map(key => ({
        id: key,
        ...folderData.folder.files[key],
        type: 'file', // Explicitly set the type for the viewer
        uploadedAt: folderData.folder.uploadedAt, // Inherit timestamp from parent
        originalPath: `${folderData.path}/files/${key}`
    }));

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-white">
            <motion.div
                className="max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.button
                    onClick={() => navigate(-1)}
                    className="mb-8 inline-flex items-center text-gray-400 hover:text-white transition-colors"
                    variants={fadeIn}
                >
                    <BackIcon />
                    Back to Resources
                </motion.button>
                <motion.h1 variants={fadeIn} className="text-4xl font-bold mb-2">{folderData.folder.docName}</motion.h1>
                <motion.p variants={fadeIn} className="text-gray-400 mb-8">Contains {files.length} documents.</motion.p>
                
                <ResourceViewer items={files} bookmarkedItemIds={bookmarkedItemIds} />

            </motion.div>
        </div>
    );
};

export default FolderView;