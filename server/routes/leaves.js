import express from 'express';
import Leave from '../models/Leave.js';
import User from '../models/User.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all leaves (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    // Query parameters
    const query = {};
    if (status) {
      query.status = status;
    }

    // Get leaves
    const leaves = await Leave.find(query)
      .populate({
        path: 'user',
        select: 'name email role'
      })
      .populate({
        path: 'approvedBy',
        select: 'name email role'
      })
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leave by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email role'
      })
      .populate({
        path: 'approvedBy',
        select: 'name email role'
      });
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // Check if requesting user is admin or the user who requested the leave
    if (req.user.role !== 'admin' && leave.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request leave
router.post('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    // Create new leave request
    const leave = new Leave({
      user: req.user._id,
      startDate,
      endDate,
      reason,
      status: 'pending'
    });

    await leave.save();
    
    res.status(201).json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update leave status (admin only)
router.put('/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status, comments } = req.body;

    // Find leave
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // Update leave status
    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.approvalDate = new Date();
    
    if (comments) {
      leave.comments = comments;
    }

    await leave.save();
    
    res.json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaves for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Check if requesting user is admin or the user themselves
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get leaves
    const leaves = await Leave.find({ user: req.params.userId })
      .populate({
        path: 'approvedBy',
        select: 'name email role'
      })
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel leave request
router.delete('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // Check if requesting user is the user who requested the leave
    if (leave.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if leave is already approved or rejected
    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel leave that is already approved or rejected' });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.json({ message: 'Leave request cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending leaves count (admin only)
router.get('/count/pending', auth, isAdmin, async (req, res) => {
  try {
    const count = await Leave.countDocuments({ status: 'pending' });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;