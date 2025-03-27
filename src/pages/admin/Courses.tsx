// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';

// interface Course {
//   _id: string;
//   name: string;
//   code: string;
//   description: string;
//   teacher: {
//     _id: string;
//     name: string;
//   };
// }

// interface Teacher {
//   _id: string;
//   name: string;
//   email: string;
// }

// const Courses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     description: '',
//     teacher: ''
//   });

//   useEffect(() => {
//     fetchCourses();
//     fetchTeachers();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/courses', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if (!response.ok) throw new Error('Failed to fetch courses');
//       const data = await response.json();
//       setCourses(data);
//     } catch (err) {
//       setError('Error fetching courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTeachers = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/users/teachers', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if (!response.ok) throw new Error('Failed to fetch teachers');
//       const data = await response.json();
//       setTeachers(data);
//     } catch (err) {
//       setError('Error fetching teachers');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/courses', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(formData)
//       });
      
//       if (!response.ok) throw new Error('Failed to create course');
      
//       const newCourse = await response.json();
//       setCourses([...courses, newCourse]);
//       setFormData({ name: '', code: '', description: '', teacher: '' });
//     } catch (err) {
//       setError('Error creating course');
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-2xl font-bold mb-6">Course Management</h2>

//       {/* Create Course Form */}
//       <form onSubmit={handleSubmit} className="mb-8 bg-white shadow rounded-lg p-6">
//         <div className="grid grid-cols-1 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Course Name</label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={e => setFormData({...formData, name: e.target.value})}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Course Code</label>
//             <input
//               type="text"
//               value={formData.code}
//               onChange={e => setFormData({...formData, code: e.target.value})}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Description</label>
//             <textarea
//               value={formData.description}
//               onChange={e => setFormData({...formData, description: e.target.value})}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               rows={3}
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Assign Teacher</label>
//             <select
//               value={formData.teacher}
//               onChange={e => setFormData({...formData, teacher: e.target.value})}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               required
//             >
//               <option value="">Select a teacher</option>
//               {teachers.map(teacher => (
//                 <option key={teacher._id} value={teacher._id}>
//                   {teacher.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Create Course
//           </button>
//         </div>
//       </form>

//       {/* Courses List */}
//       <div className="bg-white shadow overflow-hidden sm:rounded-md">
//         <ul className="divide-y divide-gray-200">
//           {courses.map(course => (
//             <li key={course._id} className="px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
//                   <p className="text-sm text-gray-500">Code: {course.code}</p>
//                   <p className="text-sm text-gray-500">Teacher: {course.teacher.name}</p>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Courses;







import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  department: string;
  semester: number;
  capacity: number;
  status: 'active' | 'inactive' | 'archived';
  teacher: {
    _id: string;
    name: string;
    email: string;
  };
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: 3,
    department: '',
    semester: 1,
    capacity: 30,
    teacher: '',
    status: 'active' as const,
    schedule: [{
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30'
    }]
  });

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering'
  ];

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching courses';
      setError(message);
      showAlert('error', message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      console.log('Fetching teachers...'); // Debug log
      const response = await fetch('http://localhost:5000/api/courses/teachers', { // Changed to courses/teachers
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      console.log('Teachers response data:', data); // Debug log
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch teachers');
      }
      
      if (!Array.isArray(data)) {
        console.error('Invalid teachers data received:', data);
        throw new Error('Invalid teachers data received');
      }
  
      setTeachers(data);
      console.log('Teachers state updated:', data); // Debug log
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching teachers';
      console.error('Teachers fetch error:', err); // Debug log
      setError(message);
      showAlert('error', message);
    }
  };
// Update handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (!formData.teacher) {
      showAlert('error', 'Please select a teacher');
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.code || !formData.description || !formData.department) {
      showAlert('error', 'Please fill in all required fields');
      return;
    }

    const courseData = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim(),
      credits: Number(formData.credits),
      department: formData.department,
      semester: Number(formData.semester),
      capacity: Number(formData.capacity),
      teacher: formData.teacher, // This should be the teacher's ID
      status: 'active' // Hardcode status for now
    };

    console.log('Sending course data:', courseData);

    const response = await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(courseData)
    });

    const responseData = await response.json();
    console.log('Server response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create course');
    }

    // Update courses list with new course
    setCourses(prevCourses => [...prevCourses, responseData]);

    // Reset form
    setFormData({
      name: '',
      code: '',
      description: '',
      credits: 3,
      department: '',
      semester: 1,
      capacity: 30,
      teacher: '',
      status: 'active',
      schedule: [{
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30'
      }]
    });

    showAlert('success', 'Course created successfully');
  } catch (err) {
    console.error('Error details:', err);
    const message = err instanceof Error ? err.message : 'Error creating course';
    setError(message);
    showAlert('error', message);
  }
};

  const deleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete course');
      }

      setCourses(courses.filter(course => course._id !== courseId));
      showAlert('success', 'Course deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting course';
      setError(message);
      showAlert('error', message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Course Management</h2>

      {alert && (
        <div className={`mb-4 p-4 rounded-md ${
          alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              pattern="[A-Z]{2,4}\d{3,4}"
              placeholder="e.g., CS101"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              required
              minLength={10}
              maxLength={1000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Credits</label>
            <input
              type="number"
              value={formData.credits}
              onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min={1}
              max={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={formData.department}
              onChange={e => setFormData({...formData, department: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Semester</label>
            <input
              type="number"
              value={formData.semester}
              onChange={e => setFormData({...formData, semester: parseInt(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min={1}
              max={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min={1}
              max={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assign Teacher</label>
            <select
              value={formData.teacher}
              onChange={e => setFormData({...formData, teacher: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a teacher</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Course
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">

          {courses.length > 0 ? (
  courses.map(course => (
    <tr key={course._id} className="hover:bg-gray-50 transition duration-200">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{course.name}</div>
        <div className="text-sm text-gray-500">Code: {course.code}</div>
        <div className="text-sm text-gray-500">Credits: {course.credits}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{course.department}</div>
        <div className="text-sm text-gray-500">Semester {course.semester}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{course.teacher?.name || 'N/A'}</div>
        <div className="text-sm text-gray-500">{course.teacher?.email || 'N/A'}</div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
            ${course.status === 'active' ? 'bg-green-100 text-green-800' : 
              course.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}`}
        >
          {course.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-medium">
        <button
          onClick={() => handleDelete(course._id)}
          className="text-red-600 hover:text-red-900"
          aria-label={`Delete ${course.name}`}
        >
          Delete
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
      No courses available.
    </td>
  </tr>
)}




          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;