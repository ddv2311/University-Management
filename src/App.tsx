import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Events from './pages/admin/Events';
import Users from './pages/admin/Users';
import Courses from './pages/admin/Courses';
import Reports from './pages/admin/Reports';
import TextToSQL from './pages/admin/TextToSQL';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import AttendanceManagement from './pages/teacher/AttendanceManagement';
import MarksManagement from './pages/teacher/MarksManagement';
import LeaveManagement from './pages/teacher/LeaveManagement';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentEvents from './pages/student/Events';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="courses" element={<Courses />} />
            <Route path="events" element={<Events />} />
            <Route path="reports" element={<Reports />} />
            <Route path="query" element={<TextToSQL />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="marks" element={<MarksManagement />} />
            <Route path="leave" element={<LeaveManagement />} />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="events" element={<StudentEvents />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;