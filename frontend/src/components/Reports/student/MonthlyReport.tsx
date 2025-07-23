import React from 'react';
import { BarChart, Calendar, GraduationCap } from 'lucide-react';

function formatMonth(monthStr: string) {
  const date = new Date(monthStr + "-01");
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function getAttendanceColor(percentage: number) {
  if (percentage >= 90) return 'bg-green-100 text-green-800';
  if (percentage >= 75) return 'bg-blue-100 text-blue-800';
  return 'bg-red-100 text-red-800';
}

type AttendanceRecord = {
  totalSessions: number;
  presentCount: number;
  subjectName: string;
  subjectId: string;
  branch: string;
  semester: string;
  section: string;
  scholarNo: string;
  month: string;
  attendancePercentage: number;
  subjectCode: string;
  facultyName: string;
  facultyCode: string;
};

interface MonthlyAttendanceReportProps {
  data: AttendanceRecord[];
}

function SubjectCodeCell({ code, name }: { code: string; name: string }) {
  return (
    <div className="group relative inline-block">
      <span className="font-medium">{code}</span>
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block min-w-[200px] z-10">
        <div className="relative">
          <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 transform transition-all duration-200 ease-out scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100">
            {name}
            <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
              <div className="border-8 border-transparent border-r-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacultyCell({ code, name }: { code: string; name: string }) {
  return (
    <div className="group relative inline-block">
      <span className="font-medium">{code}</span>
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block min-w-[200px] z-10">
        <div className="relative">
          <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 transform transition-all duration-200 ease-out scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100">
            {name}
            <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
              <div className="border-8 border-transparent border-r-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthlyAttendanceReport({ data }: MonthlyAttendanceReportProps) {
  const groupedByMonth = data.reduce((acc, curr) => {
    const month = curr.month;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(curr);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Monthly Attendance Report
          </h1>

        </div>

        {Object.entries(groupedByMonth)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([month, subjects]) => (
            <div key={month} className="mb-6 sm:mb-8 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {formatMonth(month)}
                  </h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Faculty
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Attedance Filled
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Present
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subjects.map((subject) => (
                        <tr key={subject.subjectId} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            <SubjectCodeCell code={subject.subjectCode} name={subject.subjectName} />
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            <FacultyCell code={subject.facultyCode} name={subject.facultyName} />
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {subject.totalSessions}
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {subject.presentCount}
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-4 sm:leading-5 font-semibold rounded-full ${getAttendanceColor(subject.attendancePercentage)}`}>
                              {subject.attendancePercentage.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}

        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-100 mr-1.5 sm:mr-2"></span>
            <span>≥ 90%</span>
          </div>
          <div className="flex items-center">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-100 mr-1.5 sm:mr-2"></span>
            <span>75-89%</span>
          </div>
          <div className="flex items-center">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-100 mr-1.5 sm:mr-2"></span>
            <span>{"< 75%"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyAttendanceReport;