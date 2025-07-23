import React from 'react';
import { UserCircle } from 'lucide-react';

interface StudentDetails {
    scholarNumber: string;
    StudentName: string;
    branch: string;
    section: string;
    batch: string;
}

export function StudentInfo({ details }: { details: StudentDetails }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="flex-shrink-0">
                    <UserCircle className="h-20 w-20 sm:h-16 sm:w-16 text-indigo-600" />
                </div>
                <div className="flex-1 w-full text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{details.StudentName}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Scholar Number</p>
                            <p className="text-base font-semibold text-gray-900">{details.scholarNumber}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Batch</p>
                            <p className="text-base font-semibold text-gray-900">{details.batch}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Branch</p>
                            <p className="text-base font-semibold text-gray-900">{details.branch}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Section</p>
                            <p className="text-base font-semibold text-gray-900">{details.section}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}