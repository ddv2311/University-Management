// import React from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const MainLayout: React.FC = () => {
//   const { isAuthenticated, user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (!isAuthenticated || !user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <div className="flex-shrink-0 flex items-center">
//                 <span className="text-xl font-bold">University Management</span>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <span className="mr-4">Welcome, {user.name}</span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default MainLayout;


import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/admin/users', name: 'Manage Users', icon: '👥' },
    { path: '/admin/courses', name: 'Manage Courses', icon: '📚' },
    { path: '/admin/events', name: 'Create Events', icon: '📅' },
    { path: '/admin/reports', name: 'Generate Reports', icon: '📈' },
    { path: '/admin/query', name: 'Natural Language Query', icon: '🤖' }, // Added new menu item

  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 ${
                  location.pathname === item.path ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full px-4 py-2 text-sm text-red-600 rounded-md border border-red-300 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`p-2 rounded-md bg-white shadow-lg ${isSidebarOpen ? 'hidden' : ''}`}
        >
          ☰
        </button>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'md:ml-64' : ''
      }`}>
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto">
            {/* Page content will be rendered here */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;