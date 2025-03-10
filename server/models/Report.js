import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['attendance', 'marks', 'event'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateRange: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  filters: {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    eventType: String
  },
  data: {
    totalCount: Number,
    averageAttendance: Number,
    averageMarks: Number,
    participantCount: Number,
    details: [{
      _id: false,
      studentName: String,
      courseName: String,
      present: Number,
      absent: Number,
      late: Number,
      total: Number,
      percentage: Number,
      marks: [Number],
      average: Number,
      eventName: String,
      type: String,
      date: Date,
      participants: [{
        type: String
      }]
    }]
  }
}, { timestamps: true });

// Index for faster queries
reportSchema.index({ type: 1, createdAt: -1 });
reportSchema.index({ 'filters.courseId': 1 });
reportSchema.index({ generatedBy: 1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;