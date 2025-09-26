import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import useDatabase from '../middleware/useDatabase';
import FieldSelector from '../Components/common/FieldSelector';
import ResourceViewer from '../Components/common/ResourceView';
import { useAuth } from '../context/AuthContext';

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

function Resource() {
    // 1. Get all data, loading state, and the current user
    const { database, loading } = useDatabase();
    const { user } = useAuth();
    
    // 2. Manage local state for filters and search triggers
    const [filters, setFilters] = useState({ college: 'select', course: 'select', semester: 'select', docType: 'select' });
    const [searchParams, setSearchParams] = useState(null);
    const [isPersonalized, setIsPersonalized] = useState(false);

    // Effect to pre-fill filters from user profile
    useEffect(() => {
        if (user && database?.users?.[user.uid]?.profile) {
            const userProfile = database.users[user.uid].profile;
            // ✅ FIX: Removed the `baseDbPath` definition from here. It doesn't belong in this scope.
            if (userProfile.college && userProfile.course && userProfile.semester) {
                setFilters({
                    college: userProfile.college,
                    course: userProfile.course,
                    semester: userProfile.semester,
                    docType: 'select'
                });
                setIsPersonalized(true);
            }
        }
    // ✅ FIX: Removed `baseDbPath` from the dependency array.
    }, [user, database]);


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };
            if (name === 'college') { newFilters.course = 'select'; newFilters.semester = 'select'; newFilters.docType = 'select'; }
            if (name === 'course') { newFilters.semester = 'select'; newFilters.docType = 'select'; }
            if (name === 'semester') { newFilters.docType = 'select'; }
            return newFilters;
        });
        setSearchParams(null);
        setIsPersonalized(false);
    };
    
    const handleSearch = () => {
        if (Object.values(filters).some(value => value === 'select')) {
            alert("Please select an option for all filters.");
            return;
        }
        setSearchParams(filters);
    };

    // Memoize the calculation of items to display based on filters
    const itemsToDisplay = useMemo(() => {
        if (!searchParams || !database) return [];
        const { college, course, semester, docType } = searchParams;

        const docs = database.colleges?.[college]?.courses?.[course]?.sem?.[semester]?.docs?.[docType] || {};
        
        const itemList = Object.keys(docs)
          .filter(key => key !== 'docName') // Filter out the placeholder key
          .map(key => ({
            id: key, 
            ...docs[key],
            originalPath: `colleges/${college}/courses/${course}/sem/${semester}/docs/${docType}/${key}`
        }));

        return itemList.sort((a, b) => b.uploadedAt - a.uploadedAt);
    }, [searchParams, database]);

    // ✅ FIX: Define `baseDbPath` in the main component scope, based on the current search.
    const baseDbPath = searchParams
        ? `colleges/${searchParams.college}/courses/${searchParams.course}/sem/${searchParams.semester}/docs/${searchParams.docType}`
        : null;

    return (
        <div id='resource' className="min-h-screen p-5 bg-gray-900 text-gray-300 flex flex-col items-center">
            <motion.section
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="text-center w-full px-4 relative overflow-hidden mb-10"
            >
                <motion.h1 variants={fadeIn} className="text-5xl font-bold text-center mt-10 font-serif tracking-wider mb-4">
                    <span className="text-orange-500 text-6xl">S</span>tudy <span className="text-orange-500 text-6xl">M</span>aterials
                </motion.h1>
                <div className='border-b border-orange-400 max-w-3xl mx-auto'></div>
                <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mt-4">
                    Explore our extensive collection of Study Materials to aid your exam preparation.
                </motion.p>
            </motion.section>

            <div id="filter" className="w-full max-w-4xl p-4 bg-gray-800 rounded-lg shadow-md mb-8">
                <FieldSelector
                    colleges={database?.colleges}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    loading={loading}
                />
                
                <div className="mt-4">
                     <label htmlFor="docType" className="sr-only">Select Document Type</label>
                    <select id="docType" name="docType" value={filters.docType} onChange={handleFilterChange} disabled={loading || filters.semester === 'select'} className="bg-gray-700 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50">
                        <option value="select" disabled>Select Document Type</option>
                        <option value="pyq">PYQs</option>
                        <option value="notes">Notes</option>
                        <option value="books">Books</option>
                        <option value="labs">Lab Manuals</option>
                    </select>
                </div>

                <div className='flex gap-4 justify-center mt-6'>
                    <button className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-500" onClick={() => { setFilters({ college: 'select', course: 'select', semester: 'select', docType: 'select' }); setSearchParams(null); setIsPersonalized(false); }}>Reset</button>
                    <button className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600" onClick={handleSearch}>Search</button>
                </div>
                
                {isPersonalized && (
                    <div className="mt-4 border-t border-gray-700 pt-4">
                        <button onClick={handleSearch} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                           Show My Resources
                        </button>
                    </div>
                )}
            </div>
            
            <div className="w-full max-w-4xl">
                {searchParams && <ResourceViewer items={itemsToDisplay} baseDbPath={baseDbPath} />}
            </div>
        </div>
    );
}

export default Resource;