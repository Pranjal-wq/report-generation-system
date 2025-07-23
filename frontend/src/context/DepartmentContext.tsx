import React, { createContext, useContext } from 'react';

interface DepartmentContextType {
    departments: any[];
}

export const DepartmentContext = createContext<DepartmentContextType>({ departments: [] });

export const useDepartments = () => useContext(DepartmentContext);
