import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { ref, update } from 'firebase/database';

// --- Icons ---
const DocumentIcon = () => ( <svg className="w-8 h-8 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> );
const FolderIcon = () => ( <svg className="w-8 h-8 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> );
const AddBookmarkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/></svg>);
const RemoveBookmarkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>);

function ResourceViewer({ items = [], baseDbPath, isBookmarksPage = false }) {
    const { user } = useAuth();

    const handleBookmarkClick = async (clickedItem) => {
        if (!user) return alert("Please log in to bookmark.");

        const isCurrentlyBookmarked = isBookmarksPage || (clickedItem.bookmarkedBy && clickedItem.bookmarkedBy[user.uid]);
        const itemSourcePath = clickedItem.originalPath || `${baseDbPath}/${clickedItem.id}`;
        
        if (!itemSourcePath && !baseDbPath) {
            console.error("Cannot perform bookmark action: Path is missing.");
            return;
        }

        const bookmarkPathForUser = `users/${user.uid}/bookmarks/${clickedItem.id}`;
        const flagPathOnSource = `${itemSourcePath}/bookmarkedBy/${user.uid}`;
        const updates = {};

        if (isCurrentlyBookmarked) {
            updates[bookmarkPathForUser] = null;
            updates[flagPathOnSource] = null;
        } else {
            const { bookmarkedBy, ...bookmarkData } = clickedItem;
            bookmarkData.originalPath = itemSourcePath;
            updates[bookmarkPathForUser] = bookmarkData;
            updates[flagPathOnSource] = true;
        }

        try {
            await update(ref(db), updates);
        } catch (error) {
            console.error("Failed to sync bookmark:", error);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Date not available';
        return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (items.length === 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 px-6 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
                <h3 className="text-2xl font-bold text-white">No Items Found</h3>
                <p className="text-gray-400 mt-2">There are no items to display here.</p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => {
                const isBookmarked = isBookmarksPage || (user && item.bookmarkedBy && item.bookmarkedBy[user.uid]);
                
                const bookmarkButton = (
                    <button
                        onClick={() => handleBookmarkClick(item)}
                        className={`py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors duration-200 ${
                            isBookmarked
                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                    >
                        {isBookmarked ? <RemoveBookmarkIcon /> : <AddBookmarkIcon />}
                    </button>
                );

                if (item.type === 'folder') {
                    return (
                        <div key={item.id} className="bg-gray-800 rounded-lg p-5 flex flex-col justify-between hover:scale-105 transition-transform">
                            <div>
                                <div className="flex items-start gap-4 mb-3">
                                    <FolderIcon />
                                    <h3 className="text-lg font-bold text-white break-words">{item.docName}</h3>
                                </div>
                                <p className="text-sm text-gray-400">Uploaded: {formatDate(item.uploadedAt)}</p>
                            </div>
                            <div className="mt-5 flex items-center gap-3">
                                <Link to={`/folder/${item.id}`} className="flex-1 text-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">
                                    Open Folder
                                </Link>
                                {bookmarkButton}
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-5 flex flex-col justify-between hover:scale-105 transition-transform">
                        <div>
                            <div className="flex items-start gap-4 mb-3">
                                <DocumentIcon />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-white break-words">{item.docName || item.fileName}</h3>
                                    {item.fileName && <p className="text-xs text-gray-400 font-mono break-words">{item.fileName}</p>}
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">Uploaded: {formatDate(item.uploadedAt)}</p>
                        </div>
                        <div className="mt-5 flex items-center gap-3">
                            <a href={item.downloadURL} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700">
                                View
                            </a>
                            {bookmarkButton}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ResourceViewer;