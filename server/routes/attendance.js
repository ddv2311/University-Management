import express from 'express';
import Attendance from '../models/Attendance.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import { auth, isTeacher } from '../middleware/auth.js';

const router = express.Router();

// Get attendance by course and date
router.get('/course/:courseId', auth, isTeacher, async (req, res) => {
  try {
    const { date } = req.query;
    
    // Validate course exists
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If teacher is not admin, check if they teach this course
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      if (!teacher || !teacher.courses.includes(course._id)) {
        return res.status(403).json({ message: 'You do not teach this course' });
      }
    }

    // Query parameters
    const query = { course: req.params.courseId };
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.date = { $gte: startDate, $lte: endDate };
    }

    // Get attendance records
    const attendance = await Attendance.find(query)
      .populate({
        path: 'student',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate({
        path: 'markedBy',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark attendance (teachers only)
router.post('/', auth, isTeacher, async (req, res) => {
  try {
    const { courseId, studentId, date, status } = req.body;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Validate student exists and is enrolled in the course
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student not enrolled in this course' });
    }

    // Get teacher
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Check if teacher teaches this course
    if (req.user.role === 'teacher' && !teacher.courses.includes(courseId)) {
      return res.status(403).json({ message: 'You do not teach this course' });
    }

    // Check if attendance already marked for this date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    
    const existingAttendance = await Attendance.findOne({
      course: courseId,
      student: studentId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.markedBy = teacher._id;
      await existingAttendance.save();
      
      return res.json(existingAttendance);
    }

    // Create new attendance record
    const attendance = new Attendance({
      course: courseId,
      student: studentId,
      date: attendanceDate,
      status,
      markedBy: teacher._id
    });

    await attendance.save();
    
    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update attendance (teachers only)
router.put('/:id', auth, isTeacher, async (req, res) => {
  try {
    const { status } = req.body;

    // Find attendance record
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Get teacher
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Check if teacher teaches this course
    if (req.user.role === 'teacher' && !teacher.courses.includes(attendance.course)) {
      return res.status(403).json({ message: 'You do not teach this course' });
    }

    // Update attendance
    attendance.status = status;
    attendance.markedBy = teacher._id;
    
    await attendance.save();
    
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student attendance
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { courseId } = req.query;
    
    // Validate student exists
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if requesting user is admin, teacher, or the student themselves
    if (req.user.role === 'student' && student.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Query parameters
    const query = { student: req.params.studentId };
    if (courseId) {
      query.course = courseId;
    }

    // Get attendance records
    const attendance = await Attendance.find(query)
      .populate('course')
      .populate({
        path: 'markedBy',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance statistics for a course
router.get('/statistics/course/:courseId', auth, isTeacher, async (req, res) => {
  try {
    // Validate course exists
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If teacher is not admin, check if they teach this course
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      if (!teacher || !teacher.courses.includes(course._id)) {
        return res.status(403).json({ message: 'You do not teach this course' });
      }
    }

    // Get all attendance records for this course
    const attendanceRecords = await Attendance.find({ course: req.params.courseId });
    
    // Calculate statistics
    const totalRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
    const absentCount = attendanceRecords.filter(record => record.status === 'absent').length;
    const lateCount = attendanceRecords.filter(record => record.status === 'late').length;
    
    const presentPercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
    const absentPercentage = totalRecords > 0 ? (absentCount / totalRecords) * 100 : 0;
    const latePercentage = totalRecords > 0 ? (lateCount / totalRecords) * 100 : 0;

    res.json({
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      presentPercentage,
      absentPercentage,
      latePercentage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance statistics for a student
router.get('/statistics/student/:studentId', auth, async (req, res) => {
  try {
    const { courseId } = req.query;
    
    // Validate student exists
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if requesting user is admin, teacher, or the student themselves
    if (req.user.role === 'student' && student.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Query parameters
    const query = { student: req.params.studentId };
    if (courseId) {
      query.course = courseId;
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(query);
    
    // Calculate statistics
    const totalRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
    const absentCount = attendanceRecords.filter(record => record.status === 'absent').length;
    const lateCount = attendanceRecords.filter(record => record.status === 'late').length;
    
    const presentPercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
    const absentPercentage = totalRecords > 0 ? (absentCount / totalRecords) * 100 : 0;
    const latePercentage = totalRecords > 0 ? (lateCount / totalRecords) * 100 : 0;

    res.json({
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      presentPercentage,
      absentPercentage,
      latePercentage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;