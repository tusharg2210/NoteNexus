import React from 'react';
import { useAuth } from '../context/AuthContext';
import useDatabase from '../hooks/useDatabase';
import { motion } from 'framer-motion';
import ResourceViewer from '../Components/common/ResourceView';

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
    </div>
);

const BookmarksPage = () => {
    const { user } = useAuth();
    const { database, loading } = useDatabase();

    const bookmarks = user && database?.users?.[user.uid]?.bookmarks
    ? Object.keys(database.users[user.uid].bookmarks).map(key => ({
        id: key,
        ...database.users[user.uid].bookmarks[key]
    }))
    : [];

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold mb-6 text-orange-500">My Bookmarks</h1>
                
                <ResourceViewer items={bookmarks} isBookmarksPage={true} />

            </motion.div>
        </div>
    );
};

export default BookmarksPage;