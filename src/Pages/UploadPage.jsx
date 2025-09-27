import React from 'react';
import useDatabase from '../hooks/useDatabase';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../Components/core/FileUpload';

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
    </div>
);

function UploadPage() {
    const { user } = useAuth();
    const { database, loading } = useDatabase();

    if (loading) {
        return <LoadingSpinner />;
    }
    
    // Convert colleges object to the array format the component expects
    const collegeDataArray = database?.colleges ? 
        Object.keys(database.colleges).map(key => ({ id: key, ...database.colleges[key] })) 
        : [];

    return (
        <FileUpload currentUser={user} collegeData={collegeDataArray} />
    );
}

export default UploadPage;
