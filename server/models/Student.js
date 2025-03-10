import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, { timestamps: true });

studentSchema.pre('find', function() {
  console.log('Student find query:', this.getQuery());
});

// Add text indexes for natural language search
studentSchema.index({ 
  enrollmentNumber: 'text',
  department: 'text',
  name: 'text',
  email: 'text' 
});


const Student = mongoose.model('Student', studentSchema);

export default Student;