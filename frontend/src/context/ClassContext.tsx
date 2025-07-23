import React, { createContext, useContext } from 'react';

interface Session {
    batch: string;
    sections: string[];
}

interface Branches {
    sessions: Session[]; // Updated to reflect the new structure
    branch: string;
}

interface ClassContextType {
    branches: Branches[];
    setBranches: (branches: Branches[]) => void;
}

export const ClassContext = createContext<ClassContextType>({
    branches: [],
    setBranches: () => { },
});

export const useClassContext = () => useContext(ClassContext);
