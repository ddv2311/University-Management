import mongoose from 'mongoose';

export async function getStudentDashboard(userId) {
  try {
    const Student = mongoose.model('Student');
    const Course = mongoose.model('Course');

    // Get student details with populated courses
    const student = await Student.findOne({ userId })
      .populate('userId', 'name email')
      .populate({
        path: 'courses',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      })
      .lean();

    if (!student) {
      throw new Error('Student not found');
    }

    // Calculate stats
    const stats = {
      enrolledCourses: student.courses.length,
      cgpa: student.cgpa || 0,
      attendanceRate: await calculateAttendanceRate(student._id),
      upcomingEvents: await getUpcomingEvents(student._id)
    };

    // Get today's classes
    const today = new Date();
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
    
    const todaysClasses = student.courses
      .filter(course => course.schedule?.some(schedule => schedule.day === dayOfWeek))
      .map(course => ({
        id: course._id,
        course: course.name,
        code: course.code,
        time: course.schedule.find(s => s.day === dayOfWeek)?.startTime + ' - ' + 
              course.schedule.find(s => s.day === dayOfWeek)?.endTime,
        room: course.room || 'TBA',
        teacher: course.teacher?.name || 'TBA'
      }))
      .sort((a, b) => {
        const timeA = a.time.split(' - ')[0];
        const timeB = b.time.split(' - ')[0];
        return timeA.localeCompare(timeB);
      });

    // Get recent grades
    const recentGrades = await getRecentGrades(student._id);

    // Get upcoming assignments
    const upcomingAssignments = await getUpcomingAssignments(student._id);

    return {
      success: true,
      data: {
        student: {
          name: student.userId.name,
          email: student.userId.email,
          enrollmentNumber: student.enrollmentNumber,
          department: student.department,
          semester: student.semester
        },
        stats,
        todaysClasses,
        recentGrades,
        upcomingAssignments
      }
    };

  } catch (error) {
    console.error('Error in getStudentDashboard:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function calculateAttendanceRate(studentId) {
  try {
    const Attendance = mongoose.model('Attendance');
    
    const attendance = await Attendance.find({ student: studentId });
    if (!attendance.length) return 0;

    const present = attendance.filter(a => a.status === 'present').length;
    return Math.round((present / attendance.length) * 100);
  } catch (error) {
    console.error('Error calculating attendance rate:', error);
    return 0;
  }
}

async function getUpcomingEvents(studentId) {
  try {
    const Event = mongoose.model('Event');
    const now = new Date();
    
    const events = await Event.find({
      date: { $gte: now },
      $or: [
        { type: 'all' },
        { participants: studentId }
      ]
    })
    .sort({ date: 1 })
    .limit(5)
    .lean();

    return events.length;
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    return 0;
  }
}

async function getRecentGrades(studentId) {
  try {
    const Mark = mongoose.model('Mark');
    
    const recentGrades = await Mark.find({ student: studentId })
      .populate('course', 'name')
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    return recentGrades.map(grade => ({
      id: grade._id,
      course: grade.course.name,
      assignment: grade.type,
      grade: `${grade.score}/${grade.totalScore}`,
      date: formatDate(grade.createdAt)
    }));
  } catch (error) {
    console.error('Error getting recent grades:', error);
    return [];
  }
}

async function getUpcomingAssignments(studentId) {
  try {
    const Student = mongoose.model('Student');
    const student = await Student.findById(studentId).populate('courses').lean();
    
    if (!student) return [];

    const now = new Date();
    const assignments = [];

    for (const course of student.courses) {
      if (course.assignments) {
        const courseAssignments = course.assignments
          .filter(assignment => new Date(assignment.dueDate) > now)
          .map(assignment => ({
            course: course.name,
            assignment: assignment.title,
            dueDate: formatDate(assignment.dueDate),
            status: getAssignmentStatus(assignment)
          }));
        assignments.push(...courseAssignments);
      }
    }

    return assignments
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  } catch (error) {
    console.error('Error getting upcoming assignments:', error);
    return [];
  }
}

function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function getAssignmentStatus(assignment) {
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  
  if (assignment.submitted) return 'Submitted';
  if (now > dueDate) return 'Overdue';
  if (now > new Date(dueDate - 24 * 60 * 60 * 1000)) return 'Due Soon';
  return 'Pending';
}

export async function getStudentCourses(userId) {
  try {
    const Student = mongoose.model('Student');
    
    const student = await Student.findOne({ userId })
      .populate({
        path: 'courses',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      })
      .lean();

    if (!student) {
      throw new Error('Student not found');
    }

    const courses = student.courses.map(course => ({
      id: course._id,
      code: course.code,
      name: course.name,
      description: course.description,
      credits: course.credits,
      teacher: {
        name: course.teacher?.name || 'TBA',
        email: course.teacher?.email
      },
      schedule: course.schedule || [],
      assignments: (course.assignments || []).map(assignment => ({
        ...assignment,
        status: getAssignmentStatus(assignment)
      }))
    }));

    return {
      success: true,
      data: courses
    };

  } catch (error) {
    console.error('Error in getStudentCourses:', error);
    return {
      success: false,
      error: error.message
    };
  }
} 