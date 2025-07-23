import React, { createContext, useContext } from 'react';

interface Professor {
    name: string;
    employeeCode: string;
    role: string;
    department: string;
    abbreviation?: string;
    _id?:string;
}

interface Subject {
    subject: {
        _id: string;
        subjectCode: string;
        subjectName: string;
        department: string;
        isElective: boolean;
    };
    branch: string;
    semester: string;
    section: string;
    location: string;
    course: string;
    session: string;
}

interface FacultyContextType {
    professors: Professor[];
    subjects: Subject[];
    setProfessors: (professors: Professor[]) => void;
    setSubjects: (subjects: Subject[]) => void;
}

export const FacultyContext = createContext<FacultyContextType>({
    professors: [],
    subjects: [],
    setProfessors: () => { },
    setSubjects: () => { },
});

export const useFacultyContext = () => useContext(FacultyContext);
