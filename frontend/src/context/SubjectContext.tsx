import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDepartmentWiseSubjects } from '../api/services/Admin/Subject';
import { DepartmentWiseSubjectEntry } from '../api/services/Admin/Subject.types';

interface SubjectContextType {
  departmentWiseSubjects: DepartmentWiseSubjectEntry[];
  loading: boolean;
  error: Error | null;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export const SubjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departmentWiseSubjects, setDepartmentWiseSubjects] = useState<DepartmentWiseSubjectEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const subjects = await getDepartmentWiseSubjects();
        setDepartmentWiseSubjects(subjects);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch department wise subjects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <SubjectContext.Provider value={{ departmentWiseSubjects, loading, error }}>
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = (): SubjectContextType => {
  const context = useContext(SubjectContext);
  if (context === undefined) {
    throw new Error('useSubjects must be used within a SubjectProvider');
  }
  return context;
};
