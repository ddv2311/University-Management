import express from 'express';
import { getStudentDashboard, getStudentCourses } from '../services/studentService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get student dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const result = await getStudentDashboard(req.user.id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    console.error('Error in student dashboard route:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get student courses
router.get('/courses', authenticateToken, async (req, res) => {
  try {
    const result = await getStudentCourses(req.user.id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    console.error('Error in student courses route:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router; 