import React from 'react';

interface Course {
    _id?: string;
    name: string;
    type?: string;
    duration?: number;
}

interface CourseSelectorProps {
    courses: Course[];
    selectedCourse: string;
    setSelectedCourse: (courseName: string) => void;
    loading: boolean;
    disabled: boolean;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
    courses,
    selectedCourse,
    setSelectedCourse,
    loading,
    disabled
}) => {
    return (
        <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2" htmlFor="course">
                Course
            </label>
            <select
                id="course"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={loading || disabled || courses.length === 0}
            >
                <option value="">Select Course</option>
                {courses.map((course) => (
                    <option key={course._id || course.name} value={course.name}>
                        {course.name}
                    </option>
                ))}
            </select>
            {loading && (
                <div className="flex justify-center items-center h-4 sm:h-6 mt-1">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-700"></div>
                </div>
            )}
        </div>
    );
};

export default CourseSelector;