export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'guest';
  profilePicture?: string;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  teacher?: Teacher;
  students?: Student[];
  semester: number;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  _id: string;
  userId: User;
  enrollmentNumber: string;
  department: string;
  semester: number;
  courses: Course[];
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  _id: string;
  userId: User;
  employeeId: string;
  department: string;
  designation: string;
  courses: Course[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'workshop' | 'seminar' | 'cultural' | 'other';
  organizer: string;
  participants: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  _id: string;
  course: Course;
  student: Student;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface Mark {
  _id: string;
  course: Course;
  student: Student;
  type: 'assignment' | 'quiz' | 'midterm' | 'final';
  title: string;
  score: number;
  totalScore: number;
  date: string;
  submittedBy: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface Leave {
  _id: string;
  user: User;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: User;
  approvalDate?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AttendanceStats {
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  presentPercentage: number;
  absentPercentage: number;
  latePercentage: number;
}

export interface MarksStats {
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
}

export interface StudentMarksStats {
  courseStats: {
    courseName: string;
    courseCode: string;
    percentage: number;
    grade: string;
    gradePoint: number;
  }[];
  gpa: number;
}

export interface SystemOverviewStats {
  users: {
    total: number;
    admin: number;
    teacher: number;
    student: number;
    guest: number;
  };
  courses: number;
  events: {
    total: number;
    upcoming: number;
    past: number;
  };
  attendance: number;
  marks: number;
  leaves: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface RecentActivity {
  users: User[];
  events: Event[];
}

export interface AttendanceReport {
  reportType: string;
  generatedAt: string;
  filters: {
    courseId?: string;
    startDate?: string;
    endDate?: string;
  };
  data: {
    [courseId: string]: {
      courseName: string;
      courseCode: string;
      students: {
        [studentId: string]: {
          studentName: string;
          studentEmail: string;
          records: {
            date: string;
            status: 'present' | 'absent' | 'late';
          }[];
          stats: {
            present: number;
            absent: number;
            late: number;
            total: number;
            presentPercentage: number;
            absentPercentage: number;
            latePercentage: number;
          };
        };
      };
    };
  };
}

export interface PerformanceReport {
  reportType: string;
  generatedAt: string;
  filters: {
    courseId?: string;
    type?: string;
    studentId?: string;
  };
  data: {
    [courseId: string]: {
      courseName: string;
      courseCode: string;
      students: {
        [studentId: string]: {
          studentName: string;
          studentEmail: string;
          assessments: {
            [type: string]: {
              title: string;
              score: number;
              totalScore: number;
              date: string;
              percentage: number;
            }[];
          };
          totalScore: number;
          totalMaxScore: number;
          overallPercentage: number;
          grade: string;
        };
      };
    };
  };
}

export interface EventParticipationReport {
  reportType: string;
  generatedAt: string;
  filters: {
    eventId?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
  };
  statistics: {
    totalEvents: number;
    totalParticipants: number;
    averageParticipantsPerEvent: number;
    eventsByType: {
      [type: string]: number;
    };
  };
  events: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    type: string;
    organizer: string;
    totalParticipants: number;
    participantsByRole: {
      admin: number;
      teacher: number;
      student: number;
      guest: number;
    };
    participants: {
      id: string;
      name: string;
      email: string;
      role: string;
    }[];
  }[];
}

export interface SystemOverviewReport {
  reportType: string;
  generatedAt: string;
  statistics: SystemOverviewStats;
  recentActivity: RecentActivity;
}