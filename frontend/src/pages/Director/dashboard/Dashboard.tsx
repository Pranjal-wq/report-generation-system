import React, { useState, useEffect } from 'react';
import InputSection from '../../../components/director/InputSection';
import StudentReport from '../../../components/Reports/student/StudentReport';
import FacultyReport from '../../../components/Reports/faculty/FacultyReport';
import ClassReport from '../../../components/Reports/class/ClassReport';
import { getStudentDetails } from '../../../api/services/Student/Student';
import { getDepartments, getBranches } from '../../../api/services/director/director';
import { DepartmentContext } from '../../../context/DepartmentContext';
import { FacultyContext } from '../../../context/FacultyContext';
import { ClassContext } from '../../../context/ClassContext';
import { ToastProvider } from '../../../context/ToastContext';
import { Loader2 } from 'lucide-react';

interface Branch {
  session: [String];
  branch: String;
}

function Dashboard() {
  const [showStudentReport, setShowStudentReport] = useState(false);
  const [showFacultyReport, setShowFacultyReport] = useState(false);
  const [showClassReport, setShowClassReport] = useState(false);
  const [scholarNumber, setScholarNumber] = useState('');
  const [semester, setSemester] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [facultyReportData, setFacultyReportData] = useState(null);
  const [classReportData, setClassReportData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const handleUserTypeSelected = (type: string | null) => {
    if (type === 'faculty') {
      setShowStudentReport(false);
      setShowClassReport(false);
    }
    if (type === 'student') {
      setShowFacultyReport(false);
      setShowClassReport(false);
    }
    if (type === 'class') {
      setShowStudentReport(false);
      setShowFacultyReport(false);
    }
  };

  const handleFacultyReportLoadStart = () => {
    setFacultyReportData(null);
    setShowFacultyReport(false);
  };

  const handleClassReportLoadStart = () => {
    setClassReportData(null);
    setShowClassReport(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptData = await getDepartments();
        setDepartments(deptData);
        const branchData = await getBranches();
        setBranches(branchData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <ToastProvider>
      <DepartmentContext.Provider value={{ departments }}>
        <FacultyContext.Provider value={{ professors, subjects, setProfessors, setSubjects }}>
          <ClassContext.Provider value={{ branches, setBranches }}>
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col space-y-8">
                  {/* Input Section */}
                  <InputSection
                    onSubmit={async (enteredScholarNumber, enteredSemester) => {
                      setScholarNumber(enteredScholarNumber);
                      setSemester(enteredSemester);
                      setIsLoadingReport(true);
                      try {
                        const details = await getStudentDetails(enteredScholarNumber, enteredSemester);
                        setStudentDetails(details[0]);
                        setShowStudentReport(true);
                        setShowFacultyReport(false);
                        setShowClassReport(false);
                      } catch (error) {
                        console.error('Error fetching student details:', error);
                      } finally {
                        setIsLoadingReport(false);
                      }
                    }}
                    onFacultyReport={(reportData) => {
                      setFacultyReportData(reportData);
                      setShowFacultyReport(true);
                      setShowStudentReport(false);
                      setShowClassReport(false);
                    }}
                    onClassReport={(reportData) => {
                      setClassReportData(reportData);
                      setShowClassReport(true);
                      setShowStudentReport(false);
                      setShowFacultyReport(false);
                    }}
                    onUserTypeSelected={handleUserTypeSelected}
                    onFacultyReportLoadStart={handleFacultyReportLoadStart}
                    onClassReportLoadStart={handleClassReportLoadStart}
                  />

                  {/* Loading State */}
                  {isLoadingReport && (
                    <div className="flex justify-center items-center p-12">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                      <span className="ml-3 text-lg font-medium text-blue-600">Loading report data...</span>
                    </div>
                  )}

                  {/* Report Section */}
                  {!isLoadingReport && showStudentReport && (
                    <StudentReport
                      scholarNumber={scholarNumber}
                      studentDetails={studentDetails}
                    />
                  )}
                  {!isLoadingReport && showFacultyReport && facultyReportData && (
                    <FacultyReport
                      data={facultyReportData.data}
                      professorName={facultyReportData.professorName}
                      startDate={facultyReportData.startDate}
                      endDate={facultyReportData.endDate}
                      employeeCode={facultyReportData.employeeCode} // Updated prop name
                    />
                  )}
                  {!isLoadingReport && showClassReport && classReportData && (
                    <ClassReport data={classReportData} />
                  )}
                </div>
              </div>
            </div>
          </ClassContext.Provider>
        </FacultyContext.Provider>
      </DepartmentContext.Provider>
    </ToastProvider>
  );
}

export default Dashboard;
