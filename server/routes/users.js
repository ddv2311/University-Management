// import express from 'express';
// import User from '../models/User.js';
// import Student from '../models/Student.js';
// import Teacher from '../models/Teacher.js';
// import { auth, isAdmin } from '../middleware/auth.js';

// const router = express.Router();

// // Get all users (admin only)
// router.get('/', auth, isAdmin, async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get user by ID
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if requesting user is admin or the user themselves
//     if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Create a new user (admin only)
// router.post('/', auth, isAdmin, async (req, res) => {
//   try {
//     const { name, email, password, role, profileData } = req.body;

//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create new user
//     user = new User({
//       name,
//       email,
//       password,
//       role
//     });

//     await user.save();

//     // If role is student or teacher, create corresponding profile
//     if (role === 'student' && profileData) {
//       const student = new Student({
//         userId: user._id,
//         enrollmentNumber: profileData.enrollmentNumber,
//         department: profileData.department,
//         semester: profileData.semester,
//         courses: profileData.courses || []
//       });
//       await student.save();
//     } else if (role === 'teacher' && profileData) {
//       const teacher = new Teacher({
//         userId: user._id,
//         employeeId: profileData.employeeId,
//         department: profileData.department,
//         designation: profileData.designation,
//         courses: profileData.courses || []
//       });
//       await teacher.save();
//     }

//     res.status(201).json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update user
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const { name, email, role, profileData } = req.body;

//     // Check if requesting user is admin or the user themselves
//     if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Find user
//     let user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update user fields
//     if (name) user.name = name;
//     if (email) user.email = email;
    
//     // Only admin can change role
//     if (role && req.user.role === 'admin') {
//       user.role = role;
//     }

//     await user.save();

//     // Update profile data if provided
//     if (profileData) {
//       if (user.role === 'student') {
//         let student = await Student.findOne({ userId: user._id });
        
//         if (student) {
//           if (profileData.enrollmentNumber) student.enrollmentNumber = profileData.enrollmentNumber;
//           if (profileData.department) student.department = profileData.department;
//           if (profileData.semester) student.semester = profileData.semester;
//           if (profileData.courses) student.courses = profileData.courses;
          
//           await student.save();
//         }
//       } else if (user.role === 'teacher') {
//         let teacher = await Teacher.findOne({ userId: user._id });
        
//         if (teacher) {
//           if (profileData.employeeId) teacher.employeeId = profileData.employeeId;
//           if (profileData.department) teacher.department = profileData.department;
//           if (profileData.designation) teacher.designation = profileData.designation;
//           if (profileData.courses) teacher.courses = profileData.courses;
          
//           await teacher.save();
//         }
//       }
//     }

//     res.json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete user (admin only)
// router.delete('/:id', auth, isAdmin, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Delete associated profile
//     if (user.role === 'student') {
//       await Student.findOneAndDelete({ userId: user._id });
//     } else if (user.role === 'teacher') {
//       await Teacher.findOneAndDelete({ userId: user._id });
//     }

//     // Delete user
//     await User.findByIdAndDelete(req.params.id);

//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get all students (admin and teachers)
// router.get('/role/students', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const students = await Student.find()
//       .populate({
//         path: 'userId',
//         select: 'name email'
//       })
//       .populate('courses');
    
//     res.json(students);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get all teachers (admin only)
// router.get('/role/teachers', auth, isAdmin, async (req, res) => {
//   try {
//     const teachers = await Teacher.find()
//       .populate({
//         path: 'userId',
//         select: 'name email'
//       })
//       .populate('courses');
    
//     res.json(teachers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;




import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get all users
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all teachers
router.get('/teachers', auth, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password')
      .sort({ name: 1 });
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Error fetching teachers' });
  }
});

// Update user
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting own account or another admin
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    if (user.role === 'admin' && req.user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete another admin' });
    }

    // Use findByIdAndDelete instead of remove()
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

export default router;