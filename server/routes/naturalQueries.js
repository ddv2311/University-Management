import express from 'express';
import { auth } from '../middleware/auth.js';
import { queryStudents } from '../services/studentQueryService.js';

const router = express.Router();

router.post('/execute', auth, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Query required',
        message: 'Please provide a search query'
      });
    }

    const result = await queryStudents(query);

    if (!result?.success || !Array.isArray(result.data)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid query result',
        message: 'Failed to retrieve student data'
      });
    }

    // Transform the result data for the frontend grid
    const columns = [
      { field: 'enrollmentNumber', headerName: 'Enrollment No' },
      { field: 'department', headerName: 'Department' },
      { field: 'semester', headerName: 'Semester' },
      { field: 'name', headerName: 'Name' },
      { field: 'email', headerName: 'Email' },
      { field: 'cgpa', headerName: 'CGPA' },
      { field: 'courses', headerName: 'Courses' }
    ];

    // Format the response to match what the frontend expects
    const response = {
      success: true,
      columns: columns,
      rows: result.data.map(student => ({
        enrollmentNumber: student.enrollmentNumber || '-',
        department: student.department || '-',
        semester: student.semester || '-',
        name: student.name || '-',
        email: student.email || '-',
        cgpa: student.cgpa || '-',
        courses: student.courses || '-'
      })),
      message: `Found ${result.data.length} student(s)`
    };

    // Debug logging
    console.log('Query:', query);
    console.log('Result count:', result.data.length);
    console.log('First row sample:', result.data[0] || 'No results');

    res.json(response);

  } catch (error) {
    console.error('Query execution failed:', error);
    res.status(500).json({
      success: false,
      error: 'Query execution failed',
      message: error.message || 'An unexpected error occurred while processing the query'
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Natural language query service is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message
    });
  }
});

export default router;