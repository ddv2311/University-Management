import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import eventRoutes from './routes/events.js';
import courseRoutes from './routes/courses.js';
import reportRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import nlQueryRoutes from './routes/naturalQueries.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: join(__dirname, '.env') });

// Verify essential environment variables
const requiredEnvVars = ['MONGODB_URI', 'GEMINI_API_KEY', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`${envVar} is not defined in environment variables`);
    process.exit(1);
  }
}

// Initialize Gemini
global.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  autoIndex: true,
  maxPoolSize: 10
};

// Connect to MongoDB with retry mechanism
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('Connected to MongoDB');
    console.log('Database URI:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//')); // Log URI without credentials
    console.log('Database Name:', mongoose.connection.db.databaseName);
    
    // Verify database setup
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // List all students in database
    const Student = mongoose.model('Student');
    const studentCount = await Student.countDocuments();
    console.log(`Total students in database: ${studentCount}`);
    
    // Get a sample of students to verify data
    const sampleStudents = await Student.find().limit(2).lean();
    console.log('Sample students:', JSON.stringify(sampleStudents, null, 2));

    // Create indexes if they don't exist
    await Student.syncIndexes();
    console.log('Student indexes synced');

  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Preload models
const loadModels = async () => {
  try {
    await Promise.all([
      import('./models/Student.js'),
      import('./models/User.js'),
      import('./models/Course.js')
    ]);
    console.log('Models registered:', mongoose.modelNames());
  } catch (error) {
    console.error('Error loading models:', error);
    process.exit(1);
  }
};

// MongoDB event handlers
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectWithRetry();
});

mongoose.connection.on('connected', async () => {
  console.log('MongoDB connected successfully');
  await loadModels();
  console.log('Connected to database:', mongoose.connection.db.databaseName);
});

// Initialize database connection
connectWithRetry();

// Debug routes
app.get('/api/debug/db', async (req, res) => {
  try {
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      models: mongoose.modelNames(),
      collections: await mongoose.connection.db.listCollections().toArray()
    };
    res.json(dbStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/debug/students', async (req, res) => {
  try {
    const Student = mongoose.model('Student');
    const students = await Student.find()
      .populate('userId', 'name email')
      .populate('courses', 'name code')
      .lean();
    res.json({
      count: students.length,
      students: students
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/nl-query', nlQueryRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running',
    status: 'ok',
    environment: process.env.NODE_ENV,
    dbConnected: mongoose.connection.readyState === 1
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack
    })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  try {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

// Signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('Uncaught Exception');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('Unhandled Rejection');
});

export default app;