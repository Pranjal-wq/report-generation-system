import React from 'react';

interface StudentDetailsProps {
    name: string;
    scholarNumber: string;
    course: string;
    department: string;
    branch: string;
    section: string;
    year: string | number;
}

function Details({
    name,
    scholarNumber,
    course,
    department,
    branch,
    section,
    year,
}: StudentDetailsProps) {
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><strong>Name:</strong> {name}</div>
                <div><strong>Scholar Number:</strong> {scholarNumber}</div>
                <div><strong>Course:</strong> {course}</div>
                <div><strong>Department:</strong> {department}</div>
                {course === "M.tech" && (
                    <div><strong>Branch:</strong> {branch}</div>
                )}
                <div><strong>Section:</strong> {section}</div>
                <div className="sm:col-span-2"><strong>Year:</strong> {year}</div>
            </div>
        </div>
    );
}

export default Details;