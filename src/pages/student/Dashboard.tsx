import React from 'react';
import { BookOpen, Calendar, Award, Clock, UserCheck } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = [
    { name: 'Enrolled Courses', value: '6', icon: <BookOpen className="h-6 w-6 text-blue-600" /> },
    { name: 'Attendance Rate', value: '89%', icon: <UserCheck className="h-6 w-6 text-green-600" /> },
    { name: 'GPA', value: '3.7', icon: <Award className="h-6 w-6 text-yellow-600" /> },
    { name: 'Upcoming Events', value: '3', icon: <Calendar className="h-6 w-6 text-purple-600" /> },
  ];

  const upcomingClasses = [
    { id: 1, course: 'Introduction to Computer Science', time: '10:00 AM - 11:30 AM', room: 'Room 101', teacher: 'Dr. Smith' },
    { id: 2, course: 'Calculus II', time: '1:00 PM - 2:30 PM', room: 'Room 203', teacher: 'Prof. Johnson' },
    { id: 3, course: 'Physics Lab', time: '3:00 PM - 4:30 PM', room: 'Lab 3', teacher: 'Dr. Williams' },
  ];

  const recentGrades = [
    { id: 1, course: 'Introduction to Computer Science', assignment: 'Midterm Exam', grade: '92/100', date: '2 days ago' },
    { id: 2, course: 'Calculus II', assignment: 'Problem Set 5', grade: '85/100', date: '1 week ago' },
    { id: 3, course: 'Physics Lab', assignment: 'Lab Report 3', grade: '90/100', date: '1 week ago' },
    { id: 4, course: 'English Composition', assignment: 'Essay 2', grade: '88/100', date: '2 weeks ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Student Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your academic progress and schedule</p>
      </div>

      {/* Stats */}
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">{stat.icon}</div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Classes and Recent Grades */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Classes */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Today's Classes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{cls.course}</h4>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{cls.time}</span>
                      <span className="mx-2">&middot;</span>
                      <span>{cls.room}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      <span>Instructor: {cls.teacher}</span>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View full schedule &rarr;
            </a>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Grades</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{grade.course}</h4>
                    <div className="mt-1 text-sm text-gray-500">
                      <span>{grade.assignment}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>{grade.date}</span>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {grade.grade}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all grades &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Assignments</h3>
          </div>
          <div className="px-6 py-5">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Course
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Assignment
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Due Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Introduction to Computer Science
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Programming Assignment 3
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            May 15, 2025
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Calculus II
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Problem Set 6
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            May 18, 2025
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Physics Lab
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Lab Report 4
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            May 20, 2025
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Not Started
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;