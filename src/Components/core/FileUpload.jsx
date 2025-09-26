import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { db } from '../../firebase';
import { ref as dbRef, push, set, serverTimestamp, onValue, get, update } from "firebase/database";
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Animation Variants ---
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Reusable Checkmark Icon for Success Messages
const CheckIcon = () => (
    <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
);


function FileUpload({ currentUser, collegeData }) {
    const [formData, setFormData] = useState({ college: 'select', course: 'select', semester: 'select', docType: 'pyq', folderName: '', existingFolderId: 'new' });
    const [files, setFiles] = useState(null);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [existingFolders, setExistingFolders] = useState([]);
    const [individualFileNames, setIndividualFileNames] = useState({});
    const [createFolderForNew, setCreateFolderForNew] = useState(true); // State for the new checkbox

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

    useEffect(() => {
        const { college, course, semester, docType } = formData;
        if (college !== 'select' && course !== 'select' && semester !== 'select' && docType) {
            const dbPath = `colleges/${college}/courses/${course}/sem/${semester}/docs/${docType}`;
            const foldersRef = dbRef(db, dbPath);
            
            const unsubscribe = onValue(foldersRef, (snapshot) => {
                const folders = [];
                if (snapshot.exists()) {
                    snapshot.forEach(childSnapshot => {
                        const data = childSnapshot.val();
                        if (data.type === 'folder') {
                            folders.push({ id: childSnapshot.key, ...data });
                        }
                    });
                }
                setExistingFolders(folders);
            });
            return () => unsubscribe();
        } else {
            setExistingFolders([]);
        }
    }, [formData.college, formData.course, formData.semester, formData.docType]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (['college', 'course', 'semester', 'docType'].includes(name)) newState.existingFolderId = 'new';
            if (name === 'college') { newState.course = 'select'; newState.semester = 'select'; }
            if (name === 'course') newState.semester = 'select';
            return newState;
        });
    }, []);
    
    const handleIndividualNameChange = (index, name) => {
        setIndividualFileNames(prev => ({ ...prev, [index]: name }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) {
            setFiles(null);
            setIndividualFileNames({});
            return;
        }

        const MAX_FILE_SIZE_MB = 10;
        const maxFileSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
        for (const file of selectedFiles) {
            if (file.size > maxFileSizeInBytes) {
                setStatus({ message: `File "${file.name}" exceeds ${MAX_FILE_SIZE_MB} MB limit.`, type: 'error' });
                e.target.value = null;
                setFiles(null);
                return;
            }
        }
        
        setFiles(selectedFiles);
        setIndividualFileNames({});
        setStatus({ message: '', type: '' });
        setCreateFolderForNew(true); // Default to folder creation for multiple files
    };
    
    const uploadFile = (file, onProgress) => {
        return new Promise((resolve, reject) => {
            const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
            
            const xhr = new XMLHttpRequest();
            const formDataCloud = new FormData();
            formDataCloud.append('file', file);
            formDataCloud.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            xhr.open('POST', url, true);
            
            if (onProgress) xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress((e.loaded / e.total) * 100); };

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        resolve({ fileName: file.name, downloadURL: response.secure_url });
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            reject(new Error(error.error.message || 'Upload failed.'));
                        } catch {
                            reject(new Error('An unknown upload error occurred.'));
                        }
                    }
                }
            };
            xhr.send(formDataCloud);
        });
    };
    
    const handleUpload = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some(v => v === 'select') || !files) {
            setStatus({ message: 'Please complete all fields and select a file.', type: 'error' }); return;
        }

        const allNamesProvided = Array.from(files).every((file, index) => individualFileNames[index]);
        if (!allNamesProvided) {
            setStatus({ message: "Please provide a name for every selected file.", type: 'error' }); return;
        }
        
        setIsUploading(true);
        setStatus({ message: 'Uploading...', type: 'uploading' });
        setUploadProgress(0);

        const { college, course, semester, docType, folderName, existingFolderId } = formData;
        const dbPath = `colleges/${college}/courses/${course}/sem/${semester}/docs/${docType}`;

        try {
            const uploadPromises = Array.from(files).map(async (file, index) => {
                const onProgress = files.length === 1 ? setUploadProgress : null;
                const uploadedData = await uploadFile(file, onProgress);
                return { docName: individualFileNames[index], ...uploadedData };
            });
            const newlyUploadedFiles = await Promise.all(uploadPromises);

            // --- Case 1: Add to an EXISTING folder ---
            if (existingFolderId !== 'new') {
                const folderPath = `${dbPath}/${existingFolderId}`;
                const folderRef = dbRef(db, folderPath);
                const currentFolderSnapshot = await get(folderRef);
                const currentFolderData = currentFolderSnapshot.val();
                
                const updatedFiles = { ...(currentFolderData.files || {}) };
                newlyUploadedFiles.forEach(fileData => {
                    updatedFiles[push(dbRef(db)).key] = fileData;
                });
                
                const newTotalFiles = Object.keys(updatedFiles).length;
                await update(folderRef, {
                    files: updatedFiles,
                    docName: `${currentFolderData.docName.split('(')[0].trim()} (${newTotalFiles} files)`
                });
                setStatus({ message: 'Files added successfully!', type: 'success' });
            } 
            // --- Case 2: Create a NEW entry/entries ---
            else {
                // Create a new FOLDER
                if (files.length > 1 && createFolderForNew) {
                    if (!folderName) { throw new Error("Please provide a name for the new folder."); }
                    const filesForDb = {};
                    newlyUploadedFiles.forEach(fileData => {
                        filesForDb[push(dbRef(db)).key] = fileData;
                    });
                    
                    await set(push(dbRef(db, dbPath)), {
                        type: 'folder', docName: `${folderName} (${files.length} files)`, files: filesForDb,
                        uploadedAt: serverTimestamp(), uploaderId: currentUser.uid, uploaderEmail: currentUser.email
                    });
                    setStatus({ message: 'Folder created successfully!', type: 'success' });
                } 
                // Upload files INDIVIDUALLY
                else {
                    const individualUploadPromises = newlyUploadedFiles.map(fileData => 
                        set(push(dbRef(db, dbPath)), {
                            type: 'file', ...fileData,
                            uploadedAt: serverTimestamp(),
                            uploaderId: currentUser.uid, 
                            uploaderEmail: currentUser.email
                        })
                    );
                    await Promise.all(individualUploadPromises);
                    setStatus({ message: `${files.length} file(s) uploaded successfully!`, type: 'success' });
                }
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setStatus({ message: error.message, type: 'error' });
        } finally {
            setTimeout(() => {
                setIsUploading(false);
                setStatus({ message: '', type: '' });
                setFiles(null);
                setIndividualFileNames({});
                if (document.getElementById('file-upload')) document.getElementById('file-upload').value = null;
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen p-5 bg-gray-900 text-gray-300 flex flex-col items-center">
            
            <motion.section>
                <motion.h1 variants={fadeIn} className="text-5xl font-bold text-center mt-10 font-serif tracking-wider mb-4">
                    <span className="text-orange-500 text-6xl">C</span>ontribute a <span className="text-orange-500 text-6xl">D</span>ocument
                </motion.h1>
                <div className='border-b border-orange-400 max-w-3xl mx-auto'></div>
                <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mt-4 text-center">
                    Help build our collection. Upload a single file or multiple files to create or update a folder.
                </motion.p>
            </motion.section>

            <motion.div 
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="w-full max-w-4xl mt-10"
            >
                <form onSubmit={handleUpload} className="bg-gray-800 p-12 rounded-4xl shadow-xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* --- Primary Dropdowns --- */}
                        <div>
                            <label htmlFor="college" className="sr-only">Select College</label>
                            <select id="college" name="college" value={formData.college} onChange={handleInputChange} disabled={isUploading} className="bg-gray-700 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70">
                                <option value="select" disabled>Select College</option>
                                {collegeData.map(college => <option key={college.id} value={college.id}>{college.collegeName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="course" className="sr-only">Select Course</label>
                            <select id="course" name="course" value={formData.course} onChange={handleInputChange} disabled={isUploading || !availableCourses.length} className="bg-gray-700 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50">
                                <option value="select" disabled>Select Course</option>
                                {availableCourses.map(course => <option key={course.id} value={course.id}>{course.courseName}</option>)}
                            </select>
                        </div>
                        <div>
                             <label htmlFor="semester" className="sr-only">Select Semester</label>
                            <select id="semester" name="semester" value={formData.semester} onChange={handleInputChange} disabled={isUploading || !availableSemesters.length} className="bg-gray-700 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50">
                                <option value="select" disabled>Select Semester</option>
                                {availableSemesters.map(sem => <option key={sem.id} value={sem.id}>{sem.semName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="docType" className="sr-only">Select Document Type</label>
                            <select id="docType" name="docType" value={formData.docType} onChange={handleInputChange} disabled={isUploading} className="bg-gray-700 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70">
                                <option value="pyq">Previous Year Question</option>
                                <option value="notes">Notes</option>
                                <option value="books">Book</option>
                                <option value="labs">Lab Manual</option>
                            </select>
                        </div>

                        {/* --- File Input --- */}
                        <div className="md:col-span-2">
                            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-400 mb-2">Select File(s)</label>
                            <input id="file-upload" name="file-upload" type="file" required multiple onChange={handleFileChange} disabled={isUploading}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer disabled:opacity-70"/>
                            {files && <p className="text-xs text-gray-400 mt-2">Selected: {files.length} file(s)</p>}
                        </div>

                        {/* --- Conditional and Mandatory Naming Inputs --- */}
                        <div className="md:col-span-2 space-y-4">
                            {/* "Add to Folder" Dropdown */}
                            <div>
                                <label htmlFor="existingFolderId" className="sr-only">Add to existing folder</label>
                                <select id="existingFolderId" name="existingFolderId" value={formData.existingFolderId} onChange={handleInputChange} disabled={isUploading || existingFolders.length === 0}
                                    className="bg-gray-700 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50">
                                    <option value="new">Create New Entry / Folder</option>
                                    {existingFolders.map(folder => <option key={folder.id} value={folder.id}>Add to: {folder.docName}</option>)}
                                </select>
                            </div>

                            {/* "Create Folder" Checkbox */}
                            {files && files.length > 1 && formData.existingFolderId === 'new' && (
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-400">If the files belong to the same subject, then create a folder for it.</p>
                                    <div className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg">
                                        <input id="createFolderCheck" name="createFolderCheck" type="checkbox" checked={createFolderForNew} onChange={() => setCreateFolderForNew(!createFolderForNew)} className="h-5 w-5 rounded text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-800" />
                                        <label htmlFor="createFolderCheck" className="text-sm font-medium text-gray-300">Create a new folder for these files</label>
                                    </div>
                                </div>
                            )}

                            {/* Folder Name Input (only for new folders) */}
                            {files && files.length > 1 && formData.existingFolderId === 'new' && createFolderForNew && (
                                <div>
                                    <label htmlFor="folderName" className="sr-only">New Folder Name</label>
                                    <input id="folderName" name="folderName" type="text" value={formData.folderName} onChange={handleInputChange} required
                                    placeholder="New Folder Name" disabled={isUploading}
                                    className="bg-gray-700 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70" />
                                </div>
                            )}

                            {/* Individual File Name Inputs */}
                            {files && (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-400">Please provide a proper name for each entry.</p>
                                    <div className="space-y-3 max-h-48 overflow-y-auto">
                                        {Array.from(files).map((file, index) => (
                                            <div key={index} className='m-1'>
                                                <label htmlFor={`file-name-${index}`} className="block text-xs font-medium text-gray-400 mb-1 truncate">{file.name}</label>
                                                <input id={`file-name-${index}`} name={`file-name-${index}`} type="text" value={individualFileNames[index] || ''} onChange={(e) => handleIndividualNameChange(index, e.target.value)} required
                                                placeholder={`Display Name for File ${index + 1}`} disabled={isUploading}
                                                className="bg-gray-700 text-white px-4 py-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Progress Bar and Button Section --- */}
                    <div className="pt-2 space-y-4">
                        <AnimatePresence>
                            {isUploading && files?.length === 1 && (
                                <motion.div key="progress-bar-container" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full">
                                    <div className="bg-gray-700 rounded-full h-2 w-full"><motion.div className="bg-orange-500 h-2 rounded-full" initial={{ width: '0%' }} animate={{ width: `${uploadProgress}%` }} /></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <button type="submit" disabled={isUploading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center">
                            {isUploading ? `Uploading... ${Math.round(uploadProgress) || ''}%` : 'Upload'}
                        </button>
                    </div>

                    {/* --- Status Message Section --- */}
                    <AnimatePresence>
                        {status.message && (status.type === 'success' || status.type === 'error') && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className={`text-center p-3 rounded-lg text-white font-semibold flex items-center justify-center ${status.type === 'error' ? 'bg-red-500/80' : 'bg-green-500/80'}`}>
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