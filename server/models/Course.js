import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    minlength: [3, 'Course name must be at least 3 characters long'],
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{2,4}\d{3,4}$/, 'Please enter a valid course code (e.g., CS101, MATH201)']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    max: [6, 'Credits cannot exceed 6']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher assignment is required'],
    validate: {
      validator: async function(v) {
        const User = mongoose.model('User');
        const teacher = await User.findById(v);
        return teacher && teacher.role === 'teacher';
      },
      message: 'Invalid teacher assignment'
    }
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function(v) {
        const User = mongoose.model('User');
        const student = await User.findById(v);
        return student && student.role === 'student';
      },
      message: 'Invalid student assignment'
    }
  }],
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    enum: {
      values: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering'],
      message: '{VALUE} is not a valid department'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  capacity: {
    type: Number,
    required: [true, 'Course capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [100, 'Capacity cannot exceed 100'],
    default: 30
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)']
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)']
    }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if course is full
courseSchema.virtual('isFull').get(function() {
  return (this.students || []).length >= this.capacity;
});


// Index for efficient querying
courseSchema.index({ code: 1 }, { unique: true });
courseSchema.index({ department: 1, semester: 1 });
courseSchema.index({ teacher: 1 });

// Pre-save middleware to ensure end time is after start time
courseSchema.pre('save', function(next) {
  if (this.schedule && this.schedule.length > 0) {
    for (const session of this.schedule) {
      if (session.startTime >= session.endTime) {
        next(new Error('End time must be after start time'));
        return;
      }
    }
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;