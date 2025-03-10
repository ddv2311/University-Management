import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const menuItems = [
    {
      title: 'Manage Users',
      icon: 'users',
      link: '/admin/users',
      description: 'Manage students and teachers'
    },
    {
      title: 'Manage Courses',
      icon: 'book',
      link: '/admin/courses',
      description: 'Create and manage courses'
    },
    {
      title: 'Create Event',
      icon: 'calendar',
      link: '/admin/events',
      description: 'Create and manage events'
    },
    {
      title: 'Generate Report',
      icon: 'document',
      link: '/admin/reports',
      description: 'Generate system reports'
    },
    {
      title: 'Natural Language Query',
      icon: 'code',
      link: '/admin/query',
      description: 'Query database using natural language'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              {item.icon === 'users' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              {item.icon === 'book' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
              {item.icon === 'calendar' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {item.icon === 'document' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {item.icon === 'code' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              )}
              <h5 className="text-xl font-bold tracking-tight text-gray-900">
                {item.title}
              </h5>
            </div>
            <p className="mt-2 text-gray-700">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;