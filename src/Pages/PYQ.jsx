import React, { useEffect, useReducer, useMemo } from 'react';
import { motion } from 'framer-motion';
import PdfViewer from '../Components/core/PdfViewer';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

// Centralized state logic with a reducer function
const initialState = {
  collegeData: [],
  filters: {
    college: 'select',
    course: 'select',
    semester: 'select',
    docType: 'pyq'
  },
  searchParams: null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, collegeData: action.payload, loading: false };
    case 'SET_FILTER': {
      const { name, value } = action.payload;
      const newFilters = { ...state.filters, [name]: value };
      // Reset dependent filters when a parent filter changes
      if (name === 'college') {
        newFilters.course = 'select';
        newFilters.semester = 'select';
      }
      if (name === 'course') {
        newFilters.semester = 'select';
      }
      return { ...state, filters: newFilters, searchParams: null };
    }
    case 'SET_SEARCH_PARAMS':
      return { ...state, searchParams: state.filters };
    case 'RESET':
      return { ...state, filters: initialState.filters, searchParams: null };
    default:
      throw new Error();
  }
}

// Reusable animation variants
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

function PYQ() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { collegeData, filters, searchParams, loading } = state;

  // Fetch data once on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, 'colleges/'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          dispatch({ type: 'SET_DATA', payload: dataList });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch({ type: 'SET_DATA', payload: [] }); // Set empty data on error
      }
    };
    fetchData();
  }, []);

  // Use `useMemo` to efficiently calculate available courses
  const availableCourses = useMemo(() => {
    if (filters.college === 'select') return [];
    const selectedCollege = collegeData.find(c => c.id === filters.college);
    if (!selectedCollege?.courses) return [];
    return Object.keys(selectedCollege.courses).map(key => ({
      id: key,
      ...selectedCollege.courses[key]
    }));
  }, [filters.college, collegeData]);

  // Use `useMemo` to efficiently calculate available semesters
  const availableSemesters = useMemo(() => {
    if (filters.course === 'select' || !availableCourses.length) return [];
    const selectedCourseData = collegeData
      .find(c => c.id === filters.college)
      ?.courses[filters.course];
      
    if (!selectedCourseData?.sem) return [];
    return Object.keys(selectedCourseData.sem).map(key => ({
      id: key,
      ...selectedCourseData.sem[key]
    }));
  }, [filters.college, filters.course, collegeData]);


  const handleSearch = () => {
    if (Object.values(filters).some(value => value === 'select')) {
      alert("Please select an option for all filters.");
      return;
    }
    dispatch({ type: 'SET_SEARCH_PARAMS' });
  };
  
  
  return (
    <div id='pyq' className="min-h-screen p-5 bg-gray-900 text-gray-300 flex flex-col items-center">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="text-center w-full px-4 relative overflow-hidden mb-10"
      >
        <motion.h1
          variants={fadeIn}
          className="text-5xl font-bold text-center mt-10 font-serif tracking-wider mb-4"
        >
          <span className="text-orange-500 text-6xl">P</span>revious{' '}
          <span className="text-orange-500 text-6xl">Y</span>ear{' '}
          <span className="text-orange-500 text-6xl">Q</span>uestions
        </motion.h1>
        <div className='border-b border-orange-400 max-w-3xl mx-auto'></div>
        <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mt-4">
          Explore our extensive collection of Previous Year Questions to aid your exam preparation.
        </motion.p>
      </motion.section>

      <div id="filter" className="w-full max-w-4xl p-4 bg-gray-800 rounded-lg shadow-md mb-8">
        <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex flex-col justify-center">
            <select name="college" value={filters.college} onChange={e => dispatch({ type: 'SET_FILTER', payload: e.target })} disabled={loading} className="bg-gray-700 text-white p-4 m-2 rounded-4xl disabled:opacity-50">
              <option value="select" disabled>Select College</option>
              {collegeData.map((college) => <option key={college.id} value={college.id}>{college.collegeName}</option>)}
            </select>

            <select name="course" value={filters.course} onChange={e => dispatch({ type: 'SET_FILTER', payload: e.target })} disabled={!availableCourses.length} className="bg-gray-700 text-white p-4 m-2 rounded-4xl disabled:opacity-50">
              <option value="select" disabled>Select Course</option>
              {availableCourses.map((course) => <option key={course.id} value={course.id}>{course.courseName}</option>)}
            </select>

            <select name="semester" value={filters.semester} onChange={e => dispatch({ type: 'SET_FILTER', payload: e.target })} disabled={!availableSemesters.length} className="bg-gray-700 text-white p-4 m-2 rounded-4xl disabled:opacity-50">
              <option value="select" disabled>Select Semester</option>
              {availableSemesters.map((sem) => <option key={sem.id} value={sem.id}>{sem.semName}</option>)}
            </select>
        </div>
        <div className='flex gap-4 justify-center mt-4'>
            <button className="bg-gray-600 text-white p-2 rounded hover:bg-gray-500" onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
            <button className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600" onClick={handleSearch}>Search</button>
        </div>
      </div>
        
      <div className="w-full max-w-4xl">
          {searchParams && (
              <PdfViewer 
                  college={searchParams.college}
                  course={searchParams.course} 
                  semester={searchParams.semester} 
                  docType={searchParams.docType} 
              />
          )}
      </div>
    </div>
  );
}

export default PYQ;