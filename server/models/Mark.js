import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  type: {
    type: String,
    enum: ['assignment', 'quiz', 'midterm', 'final'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
}, { timestamps: true });

// Compound index to ensure a student can only have one mark record per course per type per title
markSchema.index({ course: 1, student: 1, type: 1, title: 1 }, { unique: true });

const Mark = mongoose.model('Mark', markSchema);

export default Mark;