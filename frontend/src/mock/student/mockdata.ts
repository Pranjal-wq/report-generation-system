// Mock data generator for single student attendance system

const studentDetails = {
    scholarNo: "2311201101",
    studentName: "QASEEMA FATIMA RIZVI",
    course: "B-tech",
    branch: "CSE",
    semester: "III",
    section: "01",
    session: "2023-27"
  };
  
  // 1. Overall Attendance Data (Semester-wise for all subjects)
  const overallAttendanceData = {
    studentInfo: { ...studentDetails },
    semesterSummary: {
      totalClasses: 230, // updated total classes
      attendedClasses: 200,
      overallPercentage: 87.0,
      subjectsData: [
        {
          subjectId: "66963f0bb7cadc536c558204",
          subjectName: "Data Structures",
          subjectCode: "CS-301",
          professorName: "Dr. Amit Kumar",
          totalClasses: 50,
          attendedClasses: 47,
          percentage: 94.0
        },
        {
          subjectId: "66963f0bb7cadc536c558205",
          subjectName: "Database Management",
          subjectCode: "CS-302",
          professorName: "Dr. Priya Singh",
          totalClasses: 50,
          attendedClasses: 42,
          percentage: 84.0
        },
        {
          subjectId: "66963f0bb7cadc536c558206",
          subjectName: "Computer Networks",
          subjectCode: "CS-303",
          professorName: "Dr. Rajesh Verma",
          totalClasses: 50,
          attendedClasses: 47,
          percentage: 94.0
        },
        {
          subjectId: "66963f0bb7cadc536c558207",
          subjectName: "Operating Systems",
          subjectCode: "CS-304",
          professorName: "Dr. Sarah Wilson",
          totalClasses: 50,
          attendedClasses: 44,
          percentage: 88.0
        },
        {
          subjectId: "66963f0bb7cadc536c558208",
          subjectName: "Software Engineering",
          subjectCode: "CS-305",
          professorName: "Dr. Mark Allen",
          totalClasses: 30,
          attendedClasses: 28,
          percentage: 93.33
        },
        {
          subjectId: "66963f0bb7cadc536c558209",
          subjectName: "Artificial Intelligence",
          subjectCode: "CS-306",
          professorName: "Dr. Nina Gupta",
          totalClasses: 30,
          attendedClasses: 26,
          percentage: 86.67
        }
      ]
    }
  };
  
  // 2. Daily Attendance Report (Date range based)
  const dailyAttendanceData = {
    studentInfo: { ...studentDetails },
    dateRange: {
      startDate: "2024-07-22",
      endDate: "2024-07-27"
    },
    dailyRecords: [
      {
        date: "2024-07-22",
        dayOfWeek: "Monday",
        classes: [
          {
            subjectId: "66963f0bb7cadc536c558204",
            subjectName: "Data Structures",
            subjectCode: "CS-301",
            professorName: "Dr. Amit Kumar",
            timing: "10:00 AM - 11:00 AM",
            isPresent: "1",
            timeIn: "09:55 AM",
            remarks: "On time"
          },
          {
            subjectId: "66963f0bb7cadc536c558205",
            subjectName: "Database Management",
            subjectCode: "CS-302",
            professorName: "Dr. Priya Singh",
            timing: "11:00 AM - 12:00 PM",
            isPresent: "1",
            timeIn: "10:58 AM",
            remarks: "On time"
          },
          {
            subjectId: "66963f0bb7cadc536c558206",
            subjectName: "Computer Networks",
            subjectCode: "CS-303",
            professorName: "Dr. Rajesh Verma",
            timing: "2:00 PM - 3:00 PM",
            isPresent: "0",
            timeIn: null,
            remarks: "Medical leave"
          }
        ]
      },
      {
        date: "2024-07-23",
        dayOfWeek: "Tuesday",
        classes: [
          {
            subjectId: "66963f0bb7cadc536c558204",
            subjectName: "Data Structures",
            subjectCode: "CS-301",
            professorName: "Dr. Amit Kumar",
            timing: "10:00 AM - 11:00 AM",
            isPresent: "1",
            timeIn: "09:57 AM",
            remarks: "On time"
          },
          {
            subjectId: "66963f0bb7cadc536c558207",
            subjectName: "Operating Systems",
            subjectCode: "CS-304",
            professorName: "Dr. Sarah Wilson",
            timing: "11:00 AM - 12:00 PM",
            isPresent: "1",
            timeIn: "10:59 AM",
            remarks: "On time"
          }
        ]
      },
      {
        date: "2024-07-24",
        dayOfWeek: "Wednesday",
        classes: [
          {
            subjectId: "66963f0bb7cadc536c558204",
            subjectName: "Data Structures",
            subjectCode: "CS-301",
            professorName: "Dr. Amit Kumar",
            timing: "10:00 AM - 11:00 AM",
            isPresent: "1",
            timeIn: "10:05 AM",
            remarks: "Slightly late"
          },
          {
            subjectId: "66963f0bb7cadc536c558205",
            subjectName: "Database Management",
            subjectCode: "CS-302",
            professorName: "Dr. Priya Singh",
            timing: "11:00 AM - 12:00 PM",
            isPresent: "1",
            timeIn: "10:58 AM",
            remarks: "On time"
          },
          {
            subjectId: "66963f0bb7cadc536c558208",
            subjectName: "Software Engineering",
            subjectCode: "CS-305",
            professorName: "Dr. Mark Allen",
            timing: "1:00 PM - 2:00 PM",
            isPresent: "1",
            timeIn: "12:55 PM",
            remarks: "On time"
          },
          {
            subjectId: "66963f0bb7cadc536c558209",
            subjectName: "Artificial Intelligence",
            subjectCode: "CS-306",
            professorName: "Dr. Nina Gupta",
            timing: "2:00 PM - 3:00 PM",
            isPresent: "0",
            timeIn: null,
            remarks: "Absent"
          }
        ]
      },
      {
        date: "2024-07-25",
        dayOfWeek: "Thursday",
        classes: [
          {
            subjectId: "66963f0bb7cadc536c558206",
            subjectName: "Computer Networks",
            subjectCode: "CS-303",
            professorName: "Dr. Rajesh Verma",
            timing: "10:00 AM - 11:00 AM",
            isPresent: "1",
            timeIn: "09:59 AM",
            remarks: "On time"
          },
          {
            subjectId: "66963f0bb7cadc536c558207",
            subjectName: "Operating Systems",
            subjectCode: "CS-304",
            professorName: "Dr. Sarah Wilson",
            timing: "11:00 AM - 12:00 PM",
            isPresent: "1",
            timeIn: "11:00 AM",
            remarks: "On time"
          }
        ]
      },
      {
        date: "2024-07-26",
        dayOfWeek: "Friday",
        classes: [
          {
            subjectId: "66963f0bb7cadc536c558208",
            subjectName: "Software Engineering",
            subjectCode: "CS-305",
            professorName: "Dr. Mark Allen",
            timing: "9:00 AM - 10:00 AM",
            isPresent: "1",
            timeIn: "8:55 AM",
            remarks: "On time"
          },
          {
            subjectId: "66963f0bb7cadc536c558209",
            subjectName: "Artificial Intelligence",
            subjectCode: "CS-306",
            professorName: "Dr. Nina Gupta",
            timing: "10:00 AM - 11:00 AM",
            isPresent: "1",
            timeIn: "9:58 AM",
            remarks: "On time"
          }
        ]
      }
      // Additional days can be added here
    ]
  };
  
  // 3. Monthly Attendance Summary
  const monthlyAttendanceSummary = [
    {
        "totalSessions": 5,
        "presentCount": 4,
        "subjectName": "Network & System Securities (T)",
        "subjectId": "678ce483cd76735183ab8349",
        "branch": "CSE",
        "semester": "III",
        "section": "01",
        "scholarNo": "2211201152",
        "month": "2025-02",
        "attendancePercentage": 80,
        "subjectCode": "CSE323"
    },
    {
        "totalSessions": 9,
        "presentCount": 7,
        "subjectName": "Advanced Data Structures",
        "subjectId": "678dfa8ad5665f6a3eb3fa67",
        "branch": "CSE",
        "semester": "III",
        "section": "01",
        "scholarNo": "2211201152",
        "month": "2025-01",
        "attendancePercentage": 77.77777777777779,
        "subjectCode": "CSE357"
    },
    {
        "totalSessions": 3,
        "presentCount": 3,
        "subjectName": "Machine Learning",
        "subjectId": "678ce483cd76735183ab8347",
        "branch": "CSE",
        "semester": "III",
        "section": "01",
        "scholarNo": "2211201152",
        "month": "2025-01",
        "attendancePercentage": 100,
        "subjectCode": "CSE321"
    },
    {
        "totalSessions": 2,
        "presentCount": 2,
        "subjectName": "Advanced Data Structures",
        "subjectId": "678dfa8ad5665f6a3eb3fa67",
        "branch": "CSE",
        "semester": "III",
        "section": "01",
        "scholarNo": "2211201152",
        "month": "2025-02",
        "attendancePercentage": 100,
        "subjectCode": "CSE357"
    },
    {
        "totalSessions": 4,
        "presentCount": 4,
        "subjectName": "Machine Learning",
        "subjectId": "678ce483cd76735183ab8347",
        "branch": "CSE",
        "semester": "III",
        "section": "01",
        "scholarNo": "2211201152",
        "month": "2025-02",
        "attendancePercentage": 100,
        "subjectCode": "CSE321"
    },
    {
        "totalSessions": 9,
        "presentCount": 6,
        "subjectName": "Network & System Securities (T)",
        "subjectId": "678ce483cd76735183ab8349",
        "branch": "CSE",
        "semester": "III",
        "section": "01",
        "scholarNo": "2211201152",
        "month": "2025-01",
        "attendancePercentage": 66.66666666666666,
        "subjectCode": "CSE323"
    }
  ]
  
  
  // Export the mock data
  export const mockAttendanceData = {
    studentDetails,
    overall: overallAttendanceData,
    daily: dailyAttendanceData,
    monthly: monthlyAttendanceSummary
  };