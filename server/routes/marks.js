import express from 'express';
import Mark from '../models/Mark.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import { auth, isTeacher } from '../middleware/auth.js';

const router = express.Router();

// Get marks by course and type
router.get('/course/:courseId', auth, isTeacher, async (req, res) => {
  try {
    const { type, title } = req.query;
    
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
    if (type) {
      query.type = type;
    }
    if (title) {
      query.title = title;
    }

    // Get marks
    const marks = await Mark.find(query)
      .populate({
        path: 'student',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate({
        path: 'submittedBy',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ date: -1 });
    
    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload marks (teachers only)
router.post('/', auth, isTeacher, async (req, res) => {
  try {
    const { courseId, studentId, type, title, score, totalScore } = req.body;

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

    // Check if marks already exist for this student, course, type, and title
    const existingMark = await Mark.findOne({
      course: courseId,
      student: studentId,
      type,
      title
    });

    if (existingMark) {
      // Update existing marks
      existingMark.score = score;
      existingMark.totalScore = totalScore;
      existingMark.submittedBy = teacher._id;
      existingMark.date = new Date();
      
      await existingMark.save();
      
      return res.json(existingMark);
    }

    // Create new marks
    const mark = new Mark({
      course: courseId,
      student: studentId,
      type,
      title,
      score,
      totalScore,
      submittedBy: teacher._id
    });

    await mark.save();
    
    res.status(201).json(mark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update marks (teachers only)
router.put('/:id', auth, isTeacher, async (req, res) => {
  try {
    const { score, totalScore } = req.body;

    // Find marks
    const mark = await Mark.findById(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: 'Marks not found' });
    }

    // Get teacher
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Check if teacher teaches this course
    if (req.user.role === 'teacher' && !teacher.courses.includes(mark.course)) {
      return res.status(403).json({ message: 'You do not teach this course' });
    }

    // Update marks
    if (score !== undefined) mark.score = score;
    if (totalScore !== undefined) mark.totalScore = totalScore;
    mark.submittedBy = teacher._id;
    mark.date = new Date();
    
    await mark.save();
    
    res.json(mark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student marks
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { courseId, type } = req.query;
    
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
    if (type) {
      query.type = type;
    }

    // Get marks
    const marks = await Mark.find(query)
      .populate('course')
      .populate({
        path: 'submittedBy',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ date: -1 });
    
    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get marks statistics for a course
router.get('/statistics/course/:courseId', auth, isTeacher, async (req, res) => {
  try {
    const { type, title } = req.query;
    
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
    if (type) {
      query.type = type;
    }
    if (title) {
      query.title = title;
    }

    // Get marks
    const marks = await Mark.find(query);
    
    // Calculate statistics
    const totalStudents = marks.length;
    const totalScore = marks.reduce((sum, mark) => sum + mark.score, 0);
    const averageScore = totalStudents > 0 ? totalScore / totalStudents : 0;
    
    const highestScore = marks.length > 0 ? Math.max(...marks.map(mark => mark.score)) : 0;
    const lowestScore = marks.length > 0 ? Math.min(...marks.map(mark => mark.score)) : 0;
    
    // Calculate grade distribution
    const gradeDistribution = {
      A: 0, // 90-100%
      B: 0, // 80-89%
      C: 0, // 70-79%
      D: 0, // 60-69%
      F: 0  // Below 60%
    };

    marks.forEach(mark => {
      const percentage = (mark.score / mark.totalScore) * 100;
      
      if (percentage >= 90) {
        gradeDistribution.A++;
      } else if (percentage >= 80) {
        gradeDistribution.B++;
      } else if (percentage >= 70) {
        gradeDistribution.C++;
      } else if (percentage >= 60) {
        gradeDistribution.D++;
      } else {
        gradeDistribution.F++;
      }
    });

    res.json({
      totalStudents,
      averageScore,
      highestScore,
      lowestScore,
      gradeDistribution
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get marks statistics for a student
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

    // Get marks
    const marks = await Mark.find(query).populate('course');
    
    // Group marks by course
    const courseMarks = {};
    
    marks.forEach(mark => {
      const courseId = mark.course._id.toString();
      
      if (!courseMarks[courseId]) {
        courseMarks[courseId] = {
          courseName: mark.course.name,
          courseCode: mark.course.code,
          marks: [],
          totalScore: 0,
          totalMaxScore: 0
        };
      }
      
      courseMarks[courseId].marks.push(mark);
      courseMarks[courseId].totalScore += mark.score;
      courseMarks[courseId].totalMaxScore += mark.totalScore;
    });

    // Calculate GPA and percentages
    const courseStats = Object.values(courseMarks).map(course => {
      const percentage = course.totalMaxScore > 0 
        ? (course.totalScore / course.totalMaxScore) * 100 
        : 0;
      
      let grade;
      let gradePoint;
      
      if (percentage >= 90) {
        grade = 'A';
        gradePoint = 4.0;
      } else if (percentage >= 80) {
        grade = 'B';
        gradePoint = 3.0;
      } else if (percentage >= 70) {
        grade = 'C';
        gradePoint = 2.0;
      } else if (percentage >= 60) {
        grade = 'D';
        gradePoint = 1.0;
      } else {
        grade = 'F';
        gradePoint = 0.0;
      }
      
      return {
        courseName: course.courseName,
        courseCode: course.courseCode,
        percentage,
        grade,
        gradePoint
      };
    });

    // Calculate overall GPA
    const totalGradePoints = courseStats.reduce((sum, course) => sum + course.gradePoint, 0);
    const gpa = courseStats.length > 0 ? totalGradePoints / courseStats.length : 0;

    res.json({
      courseStats,
      gpa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;