import React from 'react';
import { BookOpen, Clock, MapPin, GraduationCap, CalendarDays } from 'lucide-react';

export default function Timetable({ timeTable, dayNames }: any) {
    if (!timeTable) return null;
    return (
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center space-x-2">
                    <CalendarDays className="w-6 h-6 text-white" />
                    <h3 className="text-2xl font-bold text-white">Weekly Schedule</h3>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {Object.entries(timeTable).map(([day, sessions]: any) => (
                    sessions.length > 0 && (
                        <div key={day} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h4 className="text-lg font-semibold text-gray-800">{dayNames[day]}</h4>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {sessions.map((item: any, idx: number) => (
                                    <div key={idx} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <BookOpen className="w-4 h-4 text-blue-600" />
                                                <span className="font-medium text-gray-900">{item.subject.subjectName}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span>{item.timing}</span>
                                            </div>
                                           
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <GraduationCap className="w-4 h-4 text-gray-400" />
                                                <span>{item.branch}{item.section}- Semester {item.semester}</span>
                                            </div>
                                            
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
