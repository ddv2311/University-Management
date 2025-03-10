import express from 'express';
import Event from '../models/Event.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .populate('participants', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Create a new event (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, date, time, location, type } = req.body;

    // Validate required fields
    if (!title || !description || !date || !time || !location || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new event
    const event = new Event({
      title: title.trim(),
      description: description.trim(),
      date: new Date(date),
      time: time,
      location: location.trim(),
      type,
      organizer: req.user._id, // Set current admin as organizer
      status: 'upcoming'
    });

    await event.save();

    // Return populated event
    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email')
      .populate('participants', 'name email');
    
    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Update event (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, date, time, location, type, status } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update fields if provided
    if (title) event.title = title.trim();
    if (description) event.description = description.trim();
    if (date) event.date = new Date(date);
    if (time) event.time = time;
    if (location) event.location = location.trim();
    if (type) event.type = type;
    if (status) event.status = status;

    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email')
      .populate('participants', 'name email');
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating event' });
  }
});

// Delete event (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is upcoming
    if (event.status !== 'upcoming') {
      return res.status(400).json({ message: 'Cannot register for this event' });
    }

    // Check if already registered
    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.participants.push(req.user._id);
    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email')
      .populate('participants', 'name email');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Error registering for event' });
  }
});

// Get upcoming events
router.get('/filter/upcoming', auth, async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() },
      status: 'upcoming'
    })
    .populate('organizer', 'name email')
    .populate('participants', 'name email')
    .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ message: 'Error fetching upcoming events' });
  }
});

export default router;