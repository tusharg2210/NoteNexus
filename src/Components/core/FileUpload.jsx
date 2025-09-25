import React, { useState, useMemo, useCallback } from 'react';
import { db } from '../../firebase';
import { ref as dbRef, push, set, serverTimestamp } from "firebase/database";
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Animation Variants ---
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

// Reusable Checkmark Icon for Success Messages
const CheckIcon = () => (
    <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
);


function FileUpload({ currentUser, collegeData }) {
    const [formData, setFormData] = useState({ college: 'select', course: 'select', semester: 'select', docType: 'pyq', docName: '' });
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // State to track progress

    const availableCourses = useMemo(() => {
        if (!collegeData || formData.college === 'select') return [];
        const selectedCollege = collegeData.find(c => c.id === formData.college);
        return Object.keys(selectedCollege?.courses || {}).map(key => ({ id: key, ...selectedCollege.courses[key] }));
    }, [formData.college, collegeData]);

    const availableSemesters = useMemo(() => {
        if (!availableCourses.length || formData.course === 'select') return [];
        const selectedCollege = collegeData.find(c => c.id === formData.college);
        const selectedCourse = selectedCollege?.courses?.[formData.course];
        return Object.keys(selectedCourse?.sem || {}).map(key => ({ id: key, ...selectedCourse.sem[key] }));
    }, [formData.course, formData.college, collegeData]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'college') {
                newState.course = 'select';
                newState.semester = 'select';
            }
            if (name === 'course') {
                newState.semester = 'select';
            }
            return newState;
        });
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const MAX_FILE_SIZE_MB = 10;
        const maxFileSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
        if (selectedFile.size > maxFileSizeInBytes) {
            setStatus({ message: `File is too large. Max size is ${MAX_FILE_SIZE_MB} MB.`, type: 'error' });
            e.target.value = null;
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setStatus({ message: '', type: '' });
    };
    
    const handleUpload = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some(v => v === 'select' || v === '') || !file) {
            setStatus({ message: 'Please fill all fields and select a file.', type: 'error' });
            return;
        }

        setIsUploading(true);
        setStatus({ message: 'Uploading...', type: 'uploading' }); // New status type
        setUploadProgress(0);

        const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        
        const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
        const xhr = new XMLHttpRequest();
        const formDataCloud = new FormData();

        formDataCloud.append('file', file);
        formDataCloud.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        xhr.open('POST', url, true);
        
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                const progress = (e.loaded / e.total) * 100;
                setUploadProgress(progress);
            }
        };

        xhr.onreadystatechange = async function() {
            if (xhr.readyState === 4) { 
                if (xhr.status === 200) { 
                    const response = JSON.parse(xhr.responseText);
                    const downloadURL = response.secure_url;

                    const { college, course, semester, docType, docName } = formData;
                    const dbPath = `colleges/${college}/courses/${course}/sem/${semester}/docs/${docType}`;
                    await set(push(dbRef(db, dbPath)), {
                        docName, fileName: file.name, downloadURL, uploadedAt: serverTimestamp(),
                        uploaderId: currentUser.uid, uploaderEmail: currentUser.email
                    });

                    setStatus({ message: 'Upload complete!', type: 'success' });
                } else {
                    const error = JSON.parse(xhr.responseText);
                    setStatus({ message: error.error.message || 'Upload failed.', type: 'error' });
                }

                setTimeout(() => {
                    setIsUploading(false);
                    setStatus({ message: '', type: '' });
                }, 2000);
            }
        };

        xhr.send(formDataCloud);
    };

    return (
        <div className="min-h-screen w-full p-5 bg-gray-900 text-gray-300 flex flex-col items-center">
            
            <motion.section 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="text-center w-full max-w-full px-4 relative overflow-hidden mb-10"
            >
                <motion.h1
                    variants={fadeIn}
                    className="text-5xl font-bold text-center mt-10 font-serif tracking-wider mb-4"
                >
                    <span className="text-orange-500 text-6xl">C</span>ontribute a{' '}
                    <span className="text-orange-500 text-6xl">D</span>ocument
                </motion.h1>
                <div className='border-b border-orange-400 max-w-3xl mx-auto'></div>
                <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mt-4">
                    Help build our collection by uploading study materials for your peers.
                </motion.p>
            </motion.section>

            <motion.div 
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="w-full max-w-4xl"
            >
                <form onSubmit={handleUpload} className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <select name="college" value={formData.college} onChange={handleInputChange} disabled={isUploading} className="bg-gray-700 text-white p-4 rounded-4xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70">
                            <option value="select" disabled>Select College</option>
                            {collegeData.map(college => <option key={college.id} value={college.id}>{college.collegeName}</option>)}
                        </select>
                        <select name="course" value={formData.course} onChange={handleInputChange} disabled={isUploading || !availableCourses.length} className="bg-gray-700 text-white p-4 rounded-4xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50">
                            <option value="select" disabled>Select Course</option>
                            {availableCourses.map(course => <option key={course.id} value={course.id}>{course.courseName}</option>)}
                        </select>
                        <select name="semester" value={formData.semester} onChange={handleInputChange} disabled={isUploading || !availableSemesters.length} className="bg-gray-700 text-white p-4 rounded-4xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50">
                            <option value="select" disabled>Select Semester</option>
                            {availableSemesters.map(sem => <option key={sem.id} value={sem.id}>{sem.semName}</option>)}
                        </select>
                        <select name="docType" value={formData.docType} onChange={handleInputChange} disabled={isUploading} 
                        className="bg-gray-700 text-white p-4 rounded-4xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70">
                            <option value="pyq">Previous Year Question</option>
                            <option value="notes">Notes</option>
                            <option value="books">Book</option>
                            <option value="labs">Lab Manual</option>
                        </select>

                        <div className="md:col-span-2">
                             <input type="text" name="docName" value={formData.docName} onChange={handleInputChange} required placeholder="Document Name (e.g., Mid Term 2024)" disabled={isUploading}
                             className="bg-gray-700 text-white p-4 rounded-4xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-400 mb-2">Select File (PDF, DOCX, PPTX, etc.)</label>
                        <input id="file-upload" type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" onChange={handleFileChange} disabled={isUploading}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer disabled:opacity-70"/>
                        {file && <p className="text-xs text-gray-400 mt-2">Selected: {file.name}</p>}
                    </div>

                    {/* Progress Bar and Button Section */}
                    <div className="pt-2 space-y-4">
                        <AnimatePresence>
                            {isUploading && status.type === 'uploading' && (
                                <motion.div
                                    key="progress-bar-container"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="w-full"
                                >
                                    <div className="bg-gray-700 rounded-full h-2 w-full">
                                        <motion.div
                                            className="bg-orange-500 h-2 rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            transition={{ duration: 0.5, ease: "linear" }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
                        >
                            {isUploading ? 'Uploading...' : 'Upload Document'}
                        </button>
                    </div>

                    <AnimatePresence>
                        {status.message && (status.type === 'success' || status.type === 'error') && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={`text-center p-3 rounded-md text-white font-semibold flex items-center justify-center ${status.type === 'error' ? 'bg-red-500/80' : 'bg-green-500/80'}`}
                            >
                                {status.type === 'success' && <CheckIcon />}
                                {status.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    );
}

export default FileUpload;

