import React, { useMemo } from 'react';

function FieldSelector({ colleges, filters, onFilterChange, disabled }) {

    const collegeList = useMemo(() => {
        return colleges ? Object.keys(colleges).map(key => ({ id: key, ...colleges[key] })) : [];
    }, [colleges]);

    const availableCourses = useMemo(() => {
        if (!colleges || !filters.college || filters.college === 'select') return [];
        const selectedCollege = colleges[filters.college];
        return selectedCollege?.courses ? Object.keys(selectedCollege.courses).map(key => ({ id: key, ...selectedCollege.courses[key] })) : [];
    }, [filters.college, colleges]);

    const availableSemesters = useMemo(() => {
        if (!colleges || !filters.course || filters.course === 'select') return [];
        const selectedCollege = colleges[filters.college];
        const selectedCourse = selectedCollege?.courses?.[filters.course];
        return selectedCourse?.sem ? Object.keys(selectedCourse.sem).map(key => ({ id: key, ...selectedCourse.sem[key] })) : [];
    }, [filters.course, filters.college, colleges]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
                <label htmlFor="college" className="sr-only">Select College</label>
                <select id="college" name="college" value={filters.college} onChange={onFilterChange} disabled={disabled} className="bg-gray-700 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70">
                    <option value="select" disabled>Select College</option>
                    {collegeList.map(college => <option key={college.id} value={college.id}>{college.collegeName}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="course" className="sr-only">Select Course</label>
                <select id="course" name="course" value={filters.course} onChange={onFilterChange} disabled={disabled || !availableCourses.length} className="bg-gray-700 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50">
                    <option value="select" disabled>Select Course</option>
                    {availableCourses.map(course => <option key={course.id} value={course.id}>{course.courseName}</option>)}
                </select>
            </div>
            <div>
                 <label htmlFor="semester" className="sr-only">Select Semester</label>
                <select id="semester" name="semester" value={filters.semester} onChange={onFilterChange} disabled={disabled || !availableSemesters.length} className="bg-gray-700 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50">
                    <option value="select" disabled>Select Semester</option>
                    {availableSemesters.map(sem => <option key={sem.id} value={sem.id}>{sem.semName}</option>)}
                </select>
            </div>
        </div>
    );
}

export default FieldSelector;
