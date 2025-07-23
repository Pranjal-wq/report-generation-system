import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import { useAuth } from './hooks/useAuth';
import Dashboard from './pages/Director/dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import Landing from './pages/Landing';
import QuickHelp from './pages/shared/QuickHelp';
import "react-toastify/dist/ReactToastify.css";
import { Dashboard as FacultyDashboard } from './pages/Faculty/dashboard/Dashboard';
import { useEffect, useState } from 'react';
import { Dashboard as HODDashboard } from './pages/HOD/dashboard/Dashboard';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/dashboard/Dashboard';
import ServicesLayout from './pages/Admin/services/ServicesLayout';
import DepartmentService from './pages/Admin/services/DepartmentService';
import CourseService from './pages/Admin/services/CourseService';
import SessionService from './pages/Admin/services/SessionService';
import BranchService from './pages/Admin/services/BranchService';
import SemesterService from './pages/Admin/services/SemesterService';
import ConfigService from './pages/Admin/services/ConfigService';
import StudentService from './pages/Admin/services/StudentService';
import ReportsPage from './pages/Admin/reports/ReportsPage';
import UsersPage from './pages/Admin/users/UsersPage';
import SettingsPage from './pages/Admin/settings/SettingsPage';
import ApprovalsPage from './pages/admin/approvals/ApprovalsPage';
import FacultyService from './pages/Admin/services/FacultyService';
import SubjectService from './pages/Admin/services/SubjectService'; // Added
import TimeTableService from "./pages/Admin/services/TimeTableService"; // Added for Timetable
import { SubjectProvider } from './context/SubjectContext';

// The Protected Route component is used to restrict access to certain routes based on the user's role
// It takes the allowedRoles prop which is an array of roles that are allowed to access the route
// If the user is not authenticated, they are redirected to the login page

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

function App() {
  const [toastPosition, setToastPosition] = useState(
    window.innerWidth < 768 ? "bottom-center" : "top-right"
  );

  useEffect(() => {
    const handleResize = () => {
      setToastPosition(window.innerWidth < 768 ? "bottom-center" : "top-right");
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SubjectProvider>
      <ToastContainer
        position={toastPosition as any}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Landing />} />

          <Route path="/" element={<Layout />}>
            {/* Faculty Routes */}
            <Route
              path="faculty/dashboard"
              element={
                <ProtectedRoute allowedRoles={['FACULTY']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />

            {/* HOD Routes */}
            <Route
              path="hod/dashboard"
              element={
                <ProtectedRoute allowedRoles={['HOD_CSE']}>
                  <HODDashboard />
                </ProtectedRoute>
              }
            />

            {/* Director Routes */}
            <Route
              path="director/dashboard"
              element={
                <ProtectedRoute allowedRoles={['DIRECTOR']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* QuickHelp Routes */}
            <Route
              path="hod/QuickHelp"
              element={
                <ProtectedRoute allowedRoles={['HOD']}>
                  <QuickHelp />
                </ProtectedRoute>
              }
            />
            <Route
              path="faculty/QuickHelp"
              element={
                <ProtectedRoute allowedRoles={['FACULTY']}>
                  <QuickHelp />
                </ProtectedRoute>
              }
            />
            <Route
              path="director/QuickHelp"
              element={
                <ProtectedRoute allowedRoles={['DIRECTOR']}>
                  <QuickHelp />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Services Routes */}            
            <Route path="services">
              <Route index element={<ServicesLayout />} />
              <Route path="department" element={<DepartmentService />} />
              <Route path="course" element={<CourseService />} />
              <Route path="session" element={<SessionService />} />
              <Route path="branch" element={<BranchService />} />
              <Route path="semester" element={<SemesterService />} />
              <Route path="config" element={<ConfigService />} />
              <Route path="student" element={<StudentService />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="faculty" element={<FacultyService />} />
              <Route path="subject" element={<SubjectService />} /> {/* Added */}
              <Route path="timetable" element={<TimeTableService />} /> {/* Added for Timetable */}
            </Route>

            {/* Settings Route */}
            <Route path="settings" element={<SettingsPage />} />

            {/* Approvals Route */}
            <Route path="approvals" element={<ApprovalsPage />} />

            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SubjectProvider>
  );
}

export default App;