// import express from 'express';
// import Course from '../models/Course.js';
// import Teacher from '../models/Teacher.js';
// import Student from '../models/Student.js';
// import { auth, isAdmin, isTeacher } from '../middleware/auth.js';

// const router = express.Router();

// // Get all courses
// router.get('/', auth, async (req, res) => {
//   try {
//     const courses = await Course.find()
//       .populate({
//         path: 'teacher',
//         populate: {
//           path: 'userId',
//           select: 'name email'
//         }
//       })
//       .populate({
//         path: 'students',
//         populate: {
//           path: 'userId',
//           select: 'name email'
//         }
//       });
    
//     res.json(courses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get course by ID
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id)
//       .populate({
//         path: 'teacher',
//         populate: {
//           path: 'userId',
//           select: 'name email'
//         }
//       })
//       .populate({
//         path: 'students',
//         populate: {
//           path: 'userId',
//           select: 'name email'
//         }
//       });
    
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
    
//     res.json(course);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Create a new course (admin only)
// router.post('/', auth, isAdmin, async (req, res) => {
//   try {
//     const { name, code, description, credits, teacherId, semester, department } = req.body;

//     // Check if course code already exists
//     const existingCourse = await Course.findOne({ code });
//     if (existingCourse) {
//       return res.status(400).json({ message: 'Course with this code already exists' });
//     }

//     // Create new course
//     const course = new Course({
//       name,
//       code,
//       description,
//       credits,
//       semester,
//       department
//     });

//     // Assign teacher if provided
//     if (teacherId) {
//       const teacher = await Teacher.findById(teacherId);
//       if (!teacher) {
//         return res.status(404).json({ message: 'Teacher not found' });
//       }
      
//       course.teacher = teacherId;
      
//       // Add course to teacher's courses
//       teacher.courses.push(course._id);
//       await teacher.save();
//     }

//     await course.save();
    
//     res.status(201).json(course);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update course (admin only)
// router.put('/:id', auth, isAdmin, async (req, res) => {
//   try {
//     const { name, description, credits, teacherId, semester, department } = req.body;

//     // Find course
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Update course fields
//     if (name) course.name = name;
//     if (description) course.description = description;
//     if (credits) course.credits = credits;
//     if (semester) course.semester = semester;
//     if (department) course.department = department;

//     // Update teacher if provided
//     if (teacherId && (!course.teacher || course.teacher.toString() !== teacherId)) {
//       // Remove course from previous teacher's courses
//       if (course.teacher) {
//         const previousTeacher = await Teacher.findById(course.teacher);
//         if (previousTeacher) {
//           previousTeacher.courses = previousTeacher.courses.filter(
//             c => c.toString() !== course._id.toString()
//           );
//           await previousTeacher.save();
//         }
//       }

//       // Add course to new teacher's courses
//       const newTeacher = await Teacher.findById(teacherId);
//       if (!newTeacher) {
//         return res.status(404).json({ message: 'Teacher not found' });
//       }
      
//       course.teacher = teacherId;
//       newTeacher.courses.push(course._id);
//       await newTeacher.save();
//     }

//     await course.save();
    
//     res.json(course);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete course (admin only)
// router.delete('/:id', auth, isAdmin, async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
    
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Remove course from teacher's courses
//     if (course.teacher) {
//       const teacher = await Teacher.findById(course.teacher);
//       if (teacher) {
//         teacher.courses = teacher.courses.filter(
//           c => c.toString() !== course._id.toString()
//         );
//         await teacher.save();
//       }
//     }

//     // Remove course from students' courses
//     for (const studentId of course.students) {
//       const student = await Student.findById(studentId);
//       if (student) {
//         student.courses = student.courses.filter(
//           c => c.toString() !== course._id.toString()
//         );
//         await student.save();
//       }
//     }

//     // Delete course
//     await Course.findByIdAndDelete(req.params.id);

//     res.json({ message: 'Course deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Assign teacher to course (admin only)
// router.post('/:id/assign-teacher', auth, isAdmin, async (req, res) => {
//   try {
//     const { teacherId } = req.body;

//     // Find course
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Find teacher
//     const teacher = await Teacher.findById(teacherId);
//     if (!teacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }

//     // Remove course from previous teacher's courses
//     if (course.teacher) {
//       const previousTeacher = await Teacher.findById(course.teacher);
//       if (previousTeacher) {
//         previousTeacher.courses = previousTeacher.courses.filter(
//           c => c.toString() !== course._id.toString()
//         );
//         await previousTeacher.save();
//       }
//     }

//     // Assign new teacher
//     course.teacher = teacherId;
//     await course.save();

//     // Add course to teacher's courses
//     if (!teacher.courses.includes(course._id)) {
//       teacher.courses.push(course._id);
//       await teacher.save();
//     }

//     res.json({ message: 'Teacher assigned successfully', course });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Enroll student in course (admin and teachers)
// router.post('/:id/enroll-student', auth, isTeacher, async (req, res) => {
//   try {
//     const { studentId } = req.body;

//     // Find course
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Find student
//     const student = await Student.findById(studentId);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Check if student is already enrolled
//     if (course.students.includes(studentId)) {
//       return res.status(400).json({ message: 'Student already enrolled in this course' });
//     }

//     // Enroll student
//     course.students.push(studentId);
//     await course.save();

//     // Add course to student's courses
//     if (!student.courses.includes(course._id)) {
//       student.courses.push(course._id);
//       await student.save();
//     }

//     res.json({ message: 'Student enrolled successfully', course });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Remove student from course (admin and teachers)
// router.post('/:id/remove-student', auth, isTeacher, async (req, res) => {
//   try {
//     const { studentId } = req.body;

//     // Find course
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Find student
//     const student = await Student.findById(studentId);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Check if student is enrolled
//     if (!course.students.includes(studentId)) {
//       return res.status(400).json({ message: 'Student not enrolled in this course' });
//     }

//     // Remove student from course
//     course.students = course.students.filter(
//       s => s.toString() !== studentId.toString()
//     );
//     await course.save();

//     // Remove course from student's courses
//     student.courses = student.courses.filter(
//       c => c.toString() !== course._id.toString()
//     );
//     await student.save();

//     res.json({ message: 'Student removed successfully', course });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get courses by teacher
// router.get('/teacher/:teacherId', auth, async (req, res) => {
//   try {
//     const courses = await Course.find({ teacher: req.params.teacherId })
//       .populate({
//         path: 'students',
//         populate: {
//           path: 'userId',
//           select: 'name email'
//         }
//       });
    
//     res.json(courses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get courses by student
// router.get('/student/:studentId', auth, async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.studentId);
    
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     const courses = await Course.find({ _id: { $in: student.courses } })
//       .populate({
//         path: 'teacher',
//         populate: {
//           path: 'userId',
//           select: 'name email'
//         }
//       });
    
//     res.json(courses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;
import express from 'express';
import { auth } from '../middleware/auth.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

const router = express.Router();

// Get all teachers (for course creation)
router.get('/teachers', auth, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('name email _id')
      .sort({ name: 1 });
    
    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: 'No teachers found' });
    }
    
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Error fetching teachers' });
  }
});

// Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Create course
router.post('/', auth, async (req, res) => {
  try {
    const { 
      name, 
      code, 
      description, 
      credits, 
      department, 
      semester, 
      capacity, 
      teacher 
    } = req.body;

    // Validate required fields
    if (!name || !code || !description || !teacher) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code: code.toUpperCase() });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    // Verify teacher exists and is actually a teacher
    const teacherUser = await User.findById(teacher);
    if (!teacherUser || teacherUser.role !== 'teacher') {
      return res.status(400).json({ message: 'Invalid teacher selected' });
    }

    // Create new course
    const course = new Course({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      credits: Number(credits) || 3,
      department,
      semester: Number(semester) || 1,
      capacity: Number(capacity) || 30,
      teacher,
      status: 'active'
    });

    await course.save();
    
    // Return populated course data
    const populatedCourse = await Course.findById(course._id)
      .populate('teacher', 'name email');
    
    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating course' });
  }
});

// Delete course
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await Course.findByIdAndDelete(id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
});

export default router;