import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

// Import models
import '../models/User.js';
import '../models/Student.js';
import '../models/Course.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const testStudents = [
  {
    enrollmentNumber: '2023CS001',
    department: 'Computer Science',
    semester: 4,
    cgpa: 8.5,
    userId: null,
    courses: []
  },
  {
    enrollmentNumber: '2023PH001',
    department: 'Physics',
    semester: 3,
    cgpa: 7.8,
    userId: null,
    courses: []
  },
  {
    enrollmentNumber: '2023MA001',
    department: 'Mathematics',
    semester: 4,
    cgpa: 9.2,
    userId: null,
    courses: []
  },
  {
    enrollmentNumber: '2023CS002',
    department: 'Computer Science',
    semester: 6,
    cgpa: 9.5,
    userId: null,
    courses: []
  },
  {
    enrollmentNumber: '2023CS003',
    department: 'Computer Science',
    semester: 2,
    cgpa: 7.2,
    userId: null,
    courses: []
  },
  {
    enrollmentNumber: '2023EE001',
    department: 'Electrical Engineering',
    semester: 4,
    cgpa: 8.1,
    userId: null,
    courses: []
  },
  {
    enrollmentNumber: '2023ME001',
    department: 'Mechanical Engineering',
    semester: 5,
    cgpa: 8.7,
    userId: null,
    courses: []
  },
  {
    enrollmentNumber: '2023CE001',
    department: 'Civil Engineering',
    semester: 3,
    cgpa: 7.9,
    userId: null,
    courses: []
  },
  // Adding new students
  {
    enrollmentNumber: '2023CS004',
    department: 'Computer Science',
    semester: 7,
    cgpa: 8.9,
    userId: null,
    courses: [],
    name: 'Devraj',
    email: 'devraj@gmail.com'
  },
  {
    enrollmentNumber: '2023CS005',
    department: 'Computer Science',
    semester: 6,
    cgpa: 8.7,
    userId: null,
    courses: [],
    name: 'Danish',
    email: 'danish@gmail.com'
  },
  {
    enrollmentNumber: '2023CS006',
    department: 'Computer Science',
    semester: 8,
    cgpa: 9.1,
    userId: null,
    courses: [],
    name: 'Darshit',
    email: 'darshit@gmail.com'
  }
];

const testCourses = [
  {
    name: 'Data Structures and Algorithms',
    code: 'CS301',
    department: 'Computer Science',
    semester: 3,
    credits: 4,
    description: 'Comprehensive study of data structures, algorithms, and their applications in solving complex computational problems.',
    capacity: 40,
    status: 'active',
    students: [],
    schedule: [
      {
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30'
      },
      {
        day: 'Wednesday',
        startTime: '09:00',
        endTime: '10:30'
      }
    ]
  },
  {
    name: 'Quantum Physics',
    code: 'PH401',
    department: 'Physics',
    semester: 4,
    credits: 4,
    description: 'Advanced study of quantum mechanics and its applications in modern physics.',
    capacity: 35,
    status: 'active',
    students: [],
    schedule: [
      {
        day: 'Tuesday',
        startTime: '11:00',
        endTime: '12:30'
      },
      {
        day: 'Thursday',
        startTime: '11:00',
        endTime: '12:30'
      }
    ]
  },
  {
    name: 'Advanced Calculus',
    code: 'MATH301',
    department: 'Mathematics',
    semester: 3,
    credits: 4,
    description: 'In-depth study of calculus concepts including limits, derivatives, and integrals.',
    capacity: 45,
    status: 'active',
    students: [],
    schedule: [
      {
        day: 'Monday',
        startTime: '14:00',
        endTime: '15:30'
      },
      {
        day: 'Friday',
        startTime: '14:00',
        endTime: '15:30'
      }
    ]
  },
  {
    name: 'Database Management Systems',
    code: 'CS302',
    department: 'Computer Science',
    semester: 4,
    credits: 4,
    description: 'Study of database design, implementation, and management.',
    capacity: 40,
    status: 'active',
    students: [],
    schedule: [
      {
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '10:30'
      },
      {
        day: 'Thursday',
        startTime: '09:00',
        endTime: '10:30'
      }
    ]
  }
];

async function seedStudents() {
  let connection;
  try {
    console.log('Connecting to MongoDB...');
    connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');

    const User = mongoose.model('User');
    const Student = mongoose.model('Student');
    const Course = mongoose.model('Course');

    // Check for existing test data
    const existingTeacher = await User.findOne({ email: 'teacher@test.com' });
    let teacher;

    if (existingTeacher) {
      console.log('Test teacher already exists, using existing teacher');
      teacher = existingTeacher;
    } else {
      // Create test teacher
      const hashedPassword = await bcrypt.hash('Test@123', 10);
      teacher = await User.create({
        name: 'Dr. John Smith',
        email: 'teacher@test.com',
        password: hashedPassword,
        role: 'teacher'
      });
      console.log('Created new test teacher');
    }

    // Create or update courses
    const createdCourses = [];
    for (const courseData of testCourses) {
      let course = await Course.findOne({ code: courseData.code });
      
      if (!course) {
        course = await Course.create({
          ...courseData,
          teacher: teacher._id,
          students: []
        });
        console.log(`Created new course: ${course.code}`);
      } else {
        console.log(`Course ${course.code} already exists, skipping`);
      }
      createdCourses.push(course);
    }

    // Create or update students
    for (const studentData of testStudents) {
      // Check if student already exists
      let student = await Student.findOne({ 
        enrollmentNumber: studentData.enrollmentNumber 
      });
      
      if (!student) {
        // Check if user exists
        let user = await User.findOne({ 
          email: studentData.email || `${studentData.enrollmentNumber.toLowerCase()}@test.com`
        });

        if (!user) {
          // Create user
          const hashedPassword = await bcrypt.hash('Test@123', 10);
          user = await User.create({
            name: studentData.name || `Test ${studentData.department} Student`,
            email: studentData.email || `${studentData.enrollmentNumber.toLowerCase()}@test.com`,
            password: hashedPassword,
            role: 'student'
          });
          console.log(`Created new user for ${studentData.enrollmentNumber}`);
        }

        // Find courses for this student's department
        const departmentCourses = createdCourses
          .filter(course => course.department === studentData.department)
          .map(course => course._id);

        // Create student
        student = await Student.create({
          ...studentData,
          userId: user._id,
          courses: departmentCourses
        });
        console.log(`Created new student ${studentData.enrollmentNumber}`);

        // Update courses with student
        await Course.updateMany(
          { _id: { $in: departmentCourses } },
          { $addToSet: { students: user._id } }
        );
        console.log(`Updated courses for student ${studentData.enrollmentNumber}`);
      } else {
        // Update existing student with CGPA if not present
        if (!student.cgpa && studentData.cgpa) {
          await Student.updateOne(
            { _id: student._id },
            { $set: { cgpa: studentData.cgpa } }
          );
          console.log(`Updated CGPA for student ${studentData.enrollmentNumber}`);
        }
      }
    }

    // Print database status
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalUsers = await User.countDocuments();
    
    console.log('\nDatabase Status:');
    console.log(`Total students: ${totalStudents}`);
    console.log(`Total courses: ${totalCourses}`);
    console.log(`Total users: ${totalUsers}`);

    // Show sample data
    const sampleStudent = await Student.findOne()
      .populate('userId', 'name email')
      .populate({
        path: 'courses',
        select: 'name code department semester credits schedule students',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      });
    
    if (sampleStudent) {
      console.log('\nSample student:', JSON.stringify(sampleStudent, null, 2));
    }
    
    console.log('\nSeeding completed successfully');

  } catch (error) {
    console.error('Seeding failed:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

seedStudents();