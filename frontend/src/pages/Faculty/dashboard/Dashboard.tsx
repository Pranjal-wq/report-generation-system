import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { getEmpCode } from '../../../api/services/faculty/Faculty';
import { getFacultyDetails, getFacultyAttendance } from '../../../api/services/director/director';
import { getTimetable, getClassReport } from '../../../api/services/faculty/Faculty';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSubjectsByProfessor } from '../../../api/services/Common';
import InputSection from '../../../components/faculty/InputSection';
import FacultyReport from '../../../components/Reports/faculty/FacultyReport';
import { Clock, MapPin, GraduationCap, BookOpen, CalendarDays, Mail, Phone, Building, UserCircle, Loader2, Calendar, FileText, Archive, Download } from 'lucide-react';
import Timetable from '../../../components/faculty/timetable';
import ClassReport from '../../../components/faculty/ClassReport';
import { exportToPDF } from '../../../Utils/ExportPDF';

interface Subject {
  _id: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  isElective: boolean;
}

interface TimeTableSession {
  subject: Subject;
  branch: string;
  semester: string;
  timing: string;
  section: string;
  location: string;
  course: string;
  session: string;
}

interface TimeTable {
  [key: string]: TimeTableSession[];
}

export function Dashboard() {
  const [name, setName] = useState('');
  const [empCode, setEmpCode] = useState<String>('');
  const [empDetails, setEmpDetails] = useState<any>({});
  const [subjects, setSubjects] = useState<any>([]);
  const [isTimetableFetched, setIsTimetableFetched] = useState(false);
  const [isFacultyReportFetched, setIsFacultyReportFetched] = useState(false);
  const [isClassReportFetched, setIsClassReportFetched] = useState(false);
  const [facultyReportData, setFacultyReportData] = useState<any>([]);
  const [reportStartDate, setReportStartDate] = useState(null);
  const [reportEndDate, setReportEndDate] = useState<string>(new Date().toISOString());
  const [timeTable, setTimeTable] = useState<TimeTable | null>(null);
  const [classReportData, setClassReportData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('timetable');
  const [isTimetableLoading, setIsTimetableLoading] = useState(false);
  const [isFacultyReportLoading, setIsFacultyReportLoading] = useState(false);
  const [isClassReportLoading, setIsClassReportLoading] = useState(false);

  const dayNames = useMemo(() => ({
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday',
    '7': 'Sunday'
  }), []);

  useEffect(() => {
    const fetchData = async () => {
      let userData = localStorage.getItem('user');
      let empName = userData ? decodeURIComponent(JSON.parse(userData).name) : null;
      if (empName) {
        setName(empName);
        let employeeCode = await getEmpCode(empName);
        setEmpCode(employeeCode);
        let details = await getFacultyDetails(employeeCode);
        setEmpDetails(details);
        let subjects = await getSubjectsByProfessor(employeeCode as string);
        setSubjects(subjects);
      } else {
        toast.error('Name not found', {
          position: window.innerWidth < 768 ? "bottom-center" : "top-center",
          toastId: 'NameNotFoundError'
        });
      }
    };

    // Retrieve persisted timetable
    const storedTimeTable = localStorage.getItem('timeTable');
    if (storedTimeTable) {
      setTimeTable(JSON.parse(storedTimeTable));
      setIsTimetableFetched(true);
    }

    // Retrieve persisted faculty report
    const storedFacultyReport = localStorage.getItem('facultyReportData');
    if (storedFacultyReport) {
      setFacultyReportData(JSON.parse(storedFacultyReport));
      setIsFacultyReportFetched(true);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (timeTable) {
      localStorage.setItem('timeTable', JSON.stringify(timeTable));
    }
  }, [timeTable]);

  useEffect(() => {
    if (facultyReportData) {
      localStorage.setItem('facultyReportData', JSON.stringify(facultyReportData));
    }
  }, [facultyReportData]);

  const handleTabClick = useCallback((id: string) => {
    setActiveTab(id);
  }, [setActiveTab]);

  const TabButton = React.memo(({ id, label, icon: Icon }) => (
    <button
      onClick={() => handleTabClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === id
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  ));

  const renderActiveContent = () => {
    if (activeTab === 'timetable') {
      if (isTimetableLoading) {
        return (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        );
      }
      return isTimetableFetched && timeTable ? (
        <div className="bg-white rounded-xl shadow-[8px_0_15px_rgba(0,0,255,0.3)] w-full h-auto">
          <div className="relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => exportToPDF('timetable-container', `${name}-timetable.pdf`)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
            <div id="timetable-container" className="w-full">
              <Timetable timeTable={timeTable} dayNames={dayNames} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[8px_0_15px_rgba(0,0,255,0.3)] p-6 text-center text-gray-500">
          Please submit to view your timetable
        </div>
      );
    }
    if (activeTab === 'faculty-report') {
      if (isFacultyReportLoading) {
        return (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        );
      }
      return isFacultyReportFetched && facultyReportData ? (
        <div className="bg-white rounded-xl shadow-[8px_0_15px_rgba(0,0,255,0.3)] overflow-hidden">
          <div className="relative">
            {/* <div className="absolute top-4 right-4">
             
            </div> */}
            <div id="faculty-report-container">
              <FacultyReport
                data={facultyReportData.data}
                professorName={facultyReportData.professorName}
                startDate={facultyReportData.startDate}
                endDate={facultyReportData.endDate}
                employeeCode={facultyReportData.employeeCode}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[8px_0_15px_rgba(0,0,255,0.3)] p-6 text-center text-gray-500">
          Please submit to view your faculty report
        </div>
      );
    }
    if (activeTab === 'class-report') {
      if (isClassReportLoading) {
        return (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        );
      }
      return isClassReportFetched && classReportData ? (
        <div className="bg-white rounded-xl shadow-[8px_0_15px_rgba(0,0,255,0.3)] overflow-hidden">
          <div className="relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => exportToPDF('class-report-container', `${name}-class-report.pdf`)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
            <div id="class-report-container">
              <ClassReport data={classReportData} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[8px_0_15px_rgba(0,0,255,0.3)] p-6 text-center text-gray-500">
          Please submit to view class report
        </div>
      );
    }
    return null;
  };

  const handleInputSectionTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleTimetableSubmit = useCallback(async (empCode) => {
    setIsTimetableLoading(true);
    try {
      const response = await getTimetable(empCode as string);
      setTimeTable(response?.TimeTable || response);
      setIsTimetableFetched(true);
      setActiveTab('timetable');
    } catch (error) {
      console.error("Error fetching timetable:", error);
      setIsTimetableFetched(false);
      toast.error('Error fetching timetable', {
        position: window.innerWidth < 768 ? "bottom-center" : "top-center",
        toastId: 'TimetableError'
      });
    } finally {
      setIsTimetableLoading(false);
    }
  }, []);

  const handleSelfReportSubmit = useCallback(async (formData) => {
    setIsFacultyReportLoading(true);
    try {
      const attendance = await getFacultyAttendance(
        empCode as string,
        formData.startDate ?? null,
        formData.endDate ?? new Date(),
        formData.subjectId
      );
      const effectiveEndDate = new Date(
        formData.endDate && formData.endDate !== '' ? formData.endDate : undefined
      ).toISOString();
      setReportStartDate(formData.startDate);
      setReportEndDate(effectiveEndDate);
      setFacultyReportData({
        data: attendance.data,
        professorName: name,
        startDate: formData.startDate ?? null,
        endDate: effectiveEndDate,
        employeeCode: empCode as string
      });
      setIsFacultyReportFetched(true);
      setActiveTab('faculty-report');
    } catch (error) {
      setIsFacultyReportFetched(false);
      toast.error('Error fetching attendance data', {
        position: window.innerWidth < 768 ? "bottom-center" : "top-center",
        toastId: 'AttendanceError'
      });
      console.error(error);
    } finally {
      setIsFacultyReportLoading(false);
    }
  }, [empCode, name]);

  const handleClassSubmit = useCallback(async (data) => {
    setIsClassReportLoading(true);
    try {
      const reportData = await getClassReport(
        empCode as string,
        data.subjectId,
        data.branch,
        data.section
      );
      setClassReportData(reportData);
      setIsClassReportFetched(true);
      setActiveTab('class-report');
    } catch (error) {
      setIsClassReportFetched(false);
      console.error("Error fetching class report:", error);
      toast.error('Error fetching class report', {
        position: window.innerWidth < 768 ? "bottom-center" : "top-center",
        toastId: 'ClassReportError'
      });
    } finally {
      setIsClassReportLoading(false);
    }
  }, [empCode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Faculty Profile Card */}
        <div className="bg-white rounded-xl shadow-[8px_0_15px_rgba(0,0,255,0.3)] overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-full">
                <UserCircle className="h-16 w-16 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{name}</h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Faculty ID: {empCode}
                </p>
              </div>
            </div>
          </div>
          {/* <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>{empDetails.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="h-5 w-5 text-blue-600" />
              <span>{empDetails.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Building className="h-5 w-5 text-blue-600" />
              <span>{empDetails.department || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>{subjects.length} Subjects</span>
            </div>
          </div> */}
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-[8px_0_15px_rgba(0,0,255,0.3)] p-6 mb-8">
          <InputSection
            empCode={empCode}
            onTabChange={handleInputSectionTabChange}
            onTimetableSubmit={handleTimetableSubmit}
            onSelfReportSubmit={handleSelfReportSubmit}
            onClassSubmit={handleClassSubmit}
          />
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {renderActiveContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;