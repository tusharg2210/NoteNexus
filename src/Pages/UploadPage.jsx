import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { ref, get } from 'firebase/database';
import FileUpload from '../Components/core/FileUpload';

function UploadPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [collegeData, setCollegeData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Auth listener
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        // Data fetcher
        const fetchData = async () => {
            const snapshot = await get(ref(db, 'colleges/'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const dataList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setCollegeData(dataList);
            }
            setLoading(false);
        };

        fetchData();
        return () => unsubscribeAuth(); // Cleanup
    }, []);

    if (loading) return <p className="text-white text-center">Loading...</p>;
    
    if (!currentUser) return <p className="text-white text-center">Please sign in to upload documents.</p>;

    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
             <FileUpload currentUser={currentUser} collegeData={collegeData} />
        </div>
    );
}

export default UploadPage;