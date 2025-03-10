// import express from 'express';
// import Attendance from '../models/Attendance.js';
// import Mark from '../models/Mark.js';
// import Event from '../models/Event.js';
// import Course from '../models/Course.js';
// import Student from '../models/Student.js';
// import Teacher from '../models/Teacher.js';
// import User from '../models/User.js';
// import { auth, isAdmin, isTeacher } from '../middleware/auth.js';

// const router = express.Router();

// // Generate attendance report
// router.get('/attendance', auth, isTeacher, async (req, res) => {
//   try {
//     const { courseId, startDate, endDate } = req.query;
    
//     // Validate course if provided
//     if (courseId) {
//       const course = await Course.findById(courseId);
//       if (!course) {
//         return res.status(404).json({ message: 'Course not found' });
//       }

//       // If teacher is not admin, check if they teach this course
//       if (req.user.role === 'teacher') {
//         const teacher = await Teacher.findOne({ userId: req.user._id });
//         if (!teacher || !teacher.courses.includes(course._id)) {
//           return res.status(403).json({ message: 'You do not teach this course' });
//         }
//       }
//     }

//     // Build query
//     const query = {};
//     if (courseId) {
//       query.course = courseId;
//     }
    
//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) {
//         query.date.$gte = new Date(startDate);
//       }
//       if (endDate) {
//         query.date.$lte = new Date(endDate);
//       }
//     }

//     // Get attendance records
//     const attendanceRecords = await Attendance.find(query)
//       .populate({
//         path: 'course',
//         select: 'name code'
//       })
//       .populate({
//         path: 'student',
//         populate: {
//           path: 'userId',
//           select: 'name email'
//         }
//       })
//       .sort({ date: -1 });
    
//     // Group by course and student
//     const groupedData = {};
    
//     attendanceRecords.forEach(record => {
//       const courseId = record.course._id.toString();
//       const studentId = record.student._id.toString();
      
//       if (!groupedData[courseId]) {
//         groupedData[courseId] = {
//           courseName: record.course.name,
//           courseCode: record.course.code,
//           students: {}
//         };
//       }
      
//       if (!groupedData[courseId].students[studentId]) {
//         groupedData[courseId].students[studentId] = {
//           studentName: record.student.userId.name,
//           studentEmail: record.student.userId.email,
//           records: [],
//           stats: {
//             present: 0,
//             absent: 0,
//             late: 0,
//             total: 0
//           }
//         };
//       }
      
//       groupedData[courseId].students[studentId].records.push({
//         date: record.date,
//         status: record.status
//       });
      
//       groupedData[courseId].students[studentId].stats[record.status]++;
//       groupedData[courseId].students[studentId].stats.total++;
//     });

//     // Calculate attendance percentages
//     Object.keys(groupedData).forEach(courseId => {
//       Object.keys(groupedData[courseId].students).forEach(studentId => {
//         const stats = groupedData[courseId].students[studentId].stats;
//         stats.presentPercentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
//         stats.absentPercentage = stats.total > 0 ? (stats.absent / stats.total) * 100 : 0;
//         stats.latePercentage = stats.total > 0 ? (stats.late / stats.total) * 100 : 0;
//       });
//     });

//     res.json({
//       reportType: 'Attendance Report',
//       generatedAt: new Date(),
//       filters: {
//         courseId,
//         startDate,
//         endDate
//       },
//       data: groupedData
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Generate performance report
// router.get('/performance', auth, isTeacher, async (req, res) => {
//   try {
//     const { courseId, type, studentId } = req.query;
    
//     // Validate course if provided
//     if (courseId) {
//       const course = await Course.findById(courseId);
//       if (!course) {
//         return res.status(404).json({ message: 'Course not found' });
//       }

//       // If teacher is not admin, check if they teach this course
//       if (req.user.role === 'teacher') {
//         const teacher = await Teacher.findOne({ userId: req.user._id });
//         if (!teacher || !teacher.courses.includes(course._id)) {
//           return res.status(403).json({ message: 'You do not teach this course' });
//         }
//       }
//     }

//     // Validate student if provided
//     if (studentId) {
//       const student = await Student.findById(studentId);
//       if (!student) {
//         return res.status(404).json({ message: 'Student not found' });
//       }
//     }

//     // Build query
//     const query = {};
//     if (courseId) {
//       query.course = courseId;
//     }
//     if (type) {
//       query.type = type;
//     }
//     if (studentId) {
//       query.student = studentId;
//     }

//     // Get marks
//     const marks = await Mark.find(query)
//       .populate({
//         path: 'course',
//         select: 'name code'
//       })
//       .populate({
//         path: 'student',
//         populate: {
//           path: 'userId',
//           select: 'name email'
//         }
//       })
//       .sort({ date: -1 });
    
//     // Group by course, student, and assessment type
//     const groupedData = {};
    
//     marks.forEach(mark => {
//       const courseId = mark.course._id.toString();
//       const studentId = mark.student._id.toString();
      
//       if (!groupedData[courseId]) {
//         groupedData[courseId] = {
//           courseName: mark.course.name,
//           courseCode: mark.course.code,
//           students: {}
//         };
//       }
      
//       if (!groupedData[courseId].students[studentId]) {
//         groupedData[courseId].students[studentId] = {
//           studentName: mark.student.userId.name,
//           studentEmail: mark.student.userId.email,
//           assessments: {},
//           totalScore: 0,
//           totalMaxScore: 0
//         };
//       }
      
//       if (!groupedData[courseId].students[studentId].assessments[mark.type]) {
//         groupedData[courseId].students[studentId].assessments[mark.type] = [];
//       }
      
//       groupedData[courseId].students[studentId].assessments[mark.type].push({
//         title: mark.title,
//         score: mark.score,
//         totalScore: mark.totalScore,
//         date: mark.date,
//         percentage: (mark.score / mark.totalScore) * 100
//       });
      
//       groupedData[courseId].students[studentId].totalScore += mark.score;
//       groupedData[courseId].students[studentId].totalMaxScore += mark.totalScore;
//     });

//     // Calculate overall percentages and grades
//     Object.keys(groupedData).forEach(courseId => {
//       Object.keys(groupedData[courseId].students).forEach(studentId => {
//         const student = groupedData[courseId].students[studentId];
//         student.overallPercentage = student.totalMaxScore > 0 
//           ? (student.totalScore / student.totalMaxScore) * 100 
//           : 0;
        
//         // Assign grade
//         if (student.overallPercentage >= 90) {
//           student.grade = 'A';
//         } else if (student.overallPercentage >= 80) {
//           student.grade = 'B';
//         } else if (student.overallPercentage >= 70) {
//           student.grade = 'C';
//         } else if (student.overallPercentage >= 60) {
//           student.grade = 'D';
//         } else {
//           student.grade = 'F';
//         }
//       });
//     });

//     res.json({
//       reportType: 'Performance Report',
//       generatedAt: new Date(),
//       filters: {
//         courseId,
//         type,
//         studentId
//       },
//       data: groupedData
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Generate event participation report
// router.get('/events', auth, isAdmin, async (req, res) => {
//   try {
//     const { eventId, startDate, endDate, type } = req.query;
    
//     // Build query
//     const query = {};
    
//     if (eventId) {
//       query._id = eventId;
//     }
    
//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) {
//         query.date.$gte = new Date(startDate);
//       }
//       if (endDate) {
//         query.date.$lte = new Date(endDate);
//       }
//     }
    
//     if (type) {
//       query.type = type;
//     }

//     // Get events
//     const events = await Event.find(query)
//       .populate({
//         path: 'participants',
//         select: 'name email role'
//       })
//       .sort({ date: -1 });
    
//     // Process event data
//     const eventsData = events.map(event => {
//       // Count participants by role
//       const participantsByRole = {
//         admin: 0,
//         teacher: 0,
//         student: 0,
//         guest: 0
//       };
      
//       event.participants.forEach(participant => {
//         participantsByRole[participant.role]++;
//       });
      
//       return {
//         id: event._id,
//         title: event.title,
//         description: event.description,
//         date: event.date,
//         location: event.location,
//         type: event.type,
//         organizer: event.organizer,
//         totalParticipants: event.participants.length,
//         participantsByRole,
//         participants: event.participants.map(p => ({
//           id: p._id,
//           name: p.name,
//           email: p.email,
//           role: p.role
//         }))
//       };
//     });

//     // Calculate overall statistics
//     const totalEvents = eventsData.length;
//     const totalParticipants = eventsData.reduce((sum, event) => sum + event.totalParticipants, 0);
//     const averageParticipantsPerEvent = totalEvents > 0 ? totalParticipants / totalEvents : 0;
    
//     // Count events by type
//     const eventsByType = {};
//     eventsData.forEach(event => {
//       if (!eventsByType[event.type]) {
//         eventsByType[event.type] = 0;
//       }
//       eventsByType[event.type]++;
//     });

//     res.json({
//       reportType: 'Event Participation Report',
//       generatedAt: new Date(),
//       filters: {
//         eventId,
//         startDate,
//         endDate,
//         type
//       },
//       statistics: {
//         totalEvents,
//         totalParticipants,
//         averageParticipantsPerEvent,
//         eventsByType
//       },
//       events: eventsData
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Generate system overview report (admin only)
// router.get('/system-overview', auth, isAdmin, async (req, res) => {
//   try {
//     // Count users by role
//     const userCounts = {
//       total: await User.countDocuments(),
//       admin: await User.countDocuments({ role: 'admin' }),
//       teacher: await User.countDocuments({ role: 'teacher' }),
//       student: await User.countDocuments({ role: 'student' }),
//       guest: await User.countDocuments({ role: 'guest' })
//     };

//     // Count courses
//     const coursesCount = await Course.countDocuments();
    
//     // Count events
//     const eventsCount = {
//       total: await Event.countDocuments(),
//       upcoming: await Event.countDocuments({ date: { $gte: new Date() } }),
//       past: await Event.countDocuments({ date: { $lt: new Date() } })
//     };
    
//     // Count attendance records
//     const attendanceCount = await Attendance.countDocuments();
    
//     // Count marks records
//     const marksCount = await Mark.countDocuments();
    
//     // Count leave requests
//     const leaveCount = {
//       total: await Leave.countDocuments(),
//       pending: await Leave.countDocuments({ status: 'pending' }),
//       approved: await Leave.countDocuments({ status: 'approved' }),
//       rejected: await Leave.countDocuments({ status: 'rejected' })
//     };

//     // Get recent activities
//     const recentUsers = await User.find()
//       .select('name email role createdAt')
//       .sort({ createdAt: -1 })
//       .limit(5);
    
//     const recentEvents = await Event.find()
//       .select('title type date location')
//       .sort({ createdAt: -1 })
//       .limit(5);

//     res.json({
//       reportType: 'System Overview Report',
//       generatedAt: new Date(),
//       statistics: {
//         users: userCounts,
//         courses: coursesCount,
//         events: eventsCount,
//         attendance: attendanceCount,
//         marks: marksCount,
//         leaves: leaveCount
//       },
//       recentActivity: {
//         users: recentUsers,
//         events: recentEvents
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;




import express from 'express';
import { auth, isAdmin } from '../middleware/auth.js';
import Attendance from '../models/Attendance.js';
import Mark from '../models/Mark.js';
import Event from '../models/Event.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import Report from '../models/Report.js';

const router = express.Router();

// Get all reports
router.get('/', auth, async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate attendance report
router.post('/generate/attendance', auth, async (req, res) => {
  try {
    const { startDate, endDate, courseId } = req.body;
    
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (courseId) {
      query.course = courseId;
    }

    const attendances = await Attendance.find(query)
      .populate('student', 'name')
      .populate('course', 'name');

    const data = {
      totalCount: attendances.length,
      averageAttendance: 0,
      details: []
    };

    // Calculate statistics
    const presentCount = attendances.filter(a => a.status === 'present').length;
    data.averageAttendance = (presentCount / attendances.length) * 100 || 0;

    // Group by student
    const groupedByStudent = {};
    attendances.forEach(attendance => {
      if (!groupedByStudent[attendance.student._id]) {
        groupedByStudent[attendance.student._id] = {
          studentName: attendance.student.name,
          courseName: attendance.course.name,
          present: 0,
          absent: 0,
          total: 0
        };
      }
      groupedByStudent[attendance.student._id][attendance.status]++;
      groupedByStudent[attendance.student._id].total++;
    });

    data.details = Object.values(groupedByStudent);

    const report = {
      type: 'attendance',
      title: 'Attendance Report',
      createdAt: new Date().toISOString(),
      data
    };

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate marks report
router.post('/generate/marks', auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    const query = courseId ? { course: courseId } : {};
    const marks = await Mark.find(query)
      .populate('student', 'name')
      .populate('course', 'name');

    const data = {
      totalCount: marks.length,
      averageMarks: 0,
      details: []
    };

    // Calculate average marks
    const totalMarks = marks.reduce((sum, mark) => sum + mark.score, 0);
    data.averageMarks = totalMarks / marks.length || 0;

    // Group by student
    const groupedByStudent = {};
    marks.forEach(mark => {
      if (!groupedByStudent[mark.student._id]) {
        groupedByStudent[mark.student._id] = {
          studentName: mark.student.name,
          courseName: mark.course.name,
          marks: [],
          average: 0
        };
      }
      groupedByStudent[mark.student._id].marks.push(mark.score);
      const sum = groupedByStudent[mark.student._id].marks.reduce((a, b) => a + b, 0);
      groupedByStudent[mark.student._id].average = sum / groupedByStudent[mark.student._id].marks.length;
    });

    data.details = Object.values(groupedByStudent);

    const report = {
      type: 'marks',
      title: 'Marks Report',
      createdAt: new Date().toISOString(),
      data
    };

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate event report
router.post('/generate/event', auth, async (req, res) => {
  try {
    const { startDate, endDate, eventType } = req.body;

    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (eventType) {
      query.type = eventType;
    }

    const events = await Event.find(query)
      .populate('participants', 'name');

    const data = {
      totalCount: events.length,
      participantCount: 0,
      details: []
    };

    // Calculate statistics
    events.forEach(event => {
      data.participantCount += event.participants.length;
      data.details.push({
        eventName: event.title,
        type: event.type,
        date: event.date,
        participantCount: event.participants.length,
        participants: event.participants.map(p => p.name)
      });
    });

    const report = {
      type: 'event',
      title: 'Event Participation Report',
      createdAt: new Date().toISOString(),
      data
    };

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete report
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;