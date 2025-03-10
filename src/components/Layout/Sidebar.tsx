import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, BookOpen, Calendar, FileText, Home, 
  UserCheck, Award, ClipboardList, LogOut, Menu, X,
  Code, Terminal // Added new icons
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { state, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminLinks = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/admin/dashboard' },
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Courses', icon: <BookOpen size={20} />, path: '/admin/courses' },
    { name: 'Events', icon: <Calendar size={20} />, path: '/admin/events' },
    { name: 'Reports', icon: <FileText size={20} />, path: '/admin/reports' },
    { name: 'Natural Language Query', icon: <Terminal size={20} />, path: '/admin/query' },
  ];

  const teacherLinks = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/teacher/dashboard' },
    { name: 'Attendance', icon: <UserCheck size={20} />, path: '/teacher/attendance' },
    { name: 'Marks', icon: <Award size={20} />, path: '/teacher/marks' },
    { name: 'Leave', icon: <ClipboardList size={20} />, path: '/teacher/leave' },
  ];

  const studentLinks = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/student/dashboard' },
    { name: 'Courses', icon: <BookOpen size={20} />, path: '/student/courses' },
    { name: 'Events', icon: <Calendar size={20} />, path: '/student/events' },
  ];

  let links;
  switch (state.user?.role) {
    case 'admin':
      links = adminLinks;
      break;
    case 'teacher':
      links = teacherLinks;
      break;
    case 'student':
      links = studentLinks;
      break;
    default:
      links = [];
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 z-20 m-4">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-10 bg-gray-800 bg-opacity-75" 
          onClick={toggleMobileMenu}
          aria-hidden="true"
        >
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-gray-800 p-4" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-white text-xl font-semibold">UMS</span>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col space-y-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150 ${
                    location.pathname === link.path
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={toggleMobileMenu}
                >
                  {link.icon}
                  <span className="ml-3">{link.name}</span>
                </Link>
              ))}

              <button
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
                className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
              >
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-screen bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-5">
                <span className="text-white text-xl font-semibold">University MS</span>
              </div>

              <nav className="flex-1 px-2 space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                      location.pathname === link.path
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {link.icon}
                    <span className="ml-3">{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex-shrink-0 flex bg-gray-700 p-4">
              <div className="flex items-center w-full">
                <div className="flex-1">
                  <div className="text-base font-medium text-white">{state.user?.name}</div>
                  <div className="text-sm font-medium text-gray-400 capitalize">{state.user?.role}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;