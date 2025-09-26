import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import useDatabase from '../middleware/useDatabase';
import FieldSelector from '../Components/common/FieldSelector';
import ResourceViewer from '../Components/common/ResourceView';

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }};
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } }};

function PYQ() {
    const { database, loading } = useDatabase();
    const [filters, setFilters] = useState({ college: 'select', course: 'select', semester: 'select' });
    const [searchParams, setSearchParams] = useState(null);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };
            if (name === 'college') { newFilters.course = 'select'; newFilters.semester = 'select'; }
            if (name === 'course') newFilters.semester = 'select';
            return newFilters;
        });
        setSearchParams(null); // Reset search on filter change
    };

    const handleSearch = () => {
        if (Object.values(filters).some(value => value === 'select')) {
            alert("Please complete all selections.");
            return;
        }
        setSearchParams(filters);
    };
    
    const itemsToDisplay = useMemo(() => {
        if (!searchParams || !database) return [];
        const { college, course, semester } = searchParams;
        const docs = database.colleges?.[college]?.courses?.[course]?.sem?.[semester]?.docs?.pyq || {};
        const itemList = Object.keys(docs).map(key => ({ 
            id: key, 
            ...docs[key],
            originalPath: `colleges/${college}/courses/${course}/sem/${semester}/docs/pyq/${key}`
        }));
        return itemList.sort((a, b) => b.uploadedAt - a.uploadedAt);
    }, [searchParams, database]);

    return (
        <div className="min-h-screen p-5 bg-gray-900 text-gray-300 flex flex-col items-center">
            <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="text-center w-full px-4 mb-10">
                <motion.h1 variants={fadeIn} className="text-5xl font-bold text-center mt-10 font-serif">
                    <span className="text-orange-500 text-6xl">P</span>revious <span className="text-orange-500 text-6xl">Y</span>ear <span className="text-orange-500 text-6xl">Q</span>uestions
                </motion.h1>
                <div className='border-b border-orange-400 max-w-3xl mx-auto my-4'></div>
                <motion.p variants={fadeIn} className="text-lg text-gray-300 max-w-4xl mx-auto">
                    Explore our collection of PYQs to aid your exam preparation.
                </motion.p>
            </motion.section>

            <div className="w-full max-w-4xl p-4 bg-gray-800 rounded-lg shadow-md mb-8">
                <FieldSelector
                    colleges={database?.colleges}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    loading={loading}
                />
                <div className='flex gap-4 justify-center mt-4'>
                    <button className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500" onClick={() => { setFilters({ college: 'select', course: 'select', semester: 'select' }); setSearchParams(null); }}>Reset</button>
                    <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600" onClick={handleSearch}>Search</button>
                </div>
            </div>
            
            <div className="w-full max-w-4xl">
                {searchParams && <ResourceViewer items={itemsToDisplay} />}
            </div>
        </div>
    );
}

export default PYQ;
