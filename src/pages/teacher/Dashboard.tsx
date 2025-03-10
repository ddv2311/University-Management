import React from 'react';
import { Users, BookOpen, Calendar, ClipboardList, UserCheck } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = [
    { name: 'My Courses', value: '5', icon: <BookOpen className="h-6 w-6 text-blue-600" /> },
    { name: 'Total Students', value: '187', icon: <Users className="h-6 w-6 text-indigo-600" /> },
    { name: 'Attendance Rate', value: '92%', icon: <UserCheck className="h-6 w-6 text-green-600" /> },
    { name: 'Pending Tasks', value: '8', icon: <ClipboardList className="h-6 w-6 text-yellow-600" /> },
  ];

  const upcomingClasses = [
    { id: 1, course: 'Introduction to Computer Science', time: '10:00 AM - 11:30 AM', room: 'Room 101', students: 42 },
    { id: 2, course: 'Data Structures and Algorithms', time: '1:00 PM - 2:30 PM', room: 'Room 203', students: 38 },
    { id: 3, course: 'Database Management Systems', time: '3:00 PM - 4:30 PM', room: 'Lab 3', students: 35 },
  ];

  const pendingTasks = [
    { id: 1, task: 'Grade midterm exams', course: 'Introduction to Computer Science', deadline: 'Tomorrow' },
    { id: 2, task: 'Update course materials', course: 'Data Structures and Algorithms', deadline: 'In 2 days' },
    { id: 3, task: 'Submit attendance report', course: 'Database Management Systems', deadline: 'In 3 days' },
    { id: 4, task: 'Prepare quiz questions', course: 'Introduction to Computer Science', deadline: 'In 5 days' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Teacher Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your courses, students, and tasks</p>
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

      {/* Today's Classes and Tasks */}
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
                      <span>{cls.time}</span>
                      <span className="mx-2">&middot;</span>
                      <span>{cls.room}</span>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {cls.students} students
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex">
                  <button className="mr-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Take Attendance
                  </button>
                  <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all classes &rarr;
            </a>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pending Tasks</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {pendingTasks.map((task) => (
              <li key={task.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id={`task-${task.id}`}
                      name={`task-${task.id}`}
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`task-${task.id}`} className="ml-3 block">
                      <span className="text-sm font-medium text-gray-900">{task.task}</span>
                      <span className="text-sm text-gray-500 block">{task.course}</span>
                    </label>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Due {task.deadline}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-gray-200">
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all tasks &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="bg-white p-6 rounded-lg shadow flex flex-col items-center hover:bg-gray-50">
            <UserCheck className="h-8 w-8 text-indigo-600" />
            <span className="mt-2 text-sm font-medium text-gray-900">Take Attendance</span>
          </button>
          <button className="bg-white p-6 rounded-lg shadow flex flex-col items-center hover:bg-gray-50">
            <ClipboardList className="h-8 w-8 text-indigo-600" />
            <span className="mt-2 text-sm font-medium text-gray-900">Upload Marks</span>
          </button>
          <button className="bg-white p-6 rounded-lg shadow flex flex-col items-center hover:bg-gray-50">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <span className="mt-2 text-sm font-medium text-gray-900">Schedule Class</span>
          </button>
          <button className="bg-white p-6 rounded-lg shadow flex flex-col items-center hover:bg-gray-50">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="mt-2 text-sm font-medium text-gray-900">Course Materials</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;