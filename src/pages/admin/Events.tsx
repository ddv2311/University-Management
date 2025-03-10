import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'seminar' | 'cultural' | 'other';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: {
    _id: string;
    name: string;
    email: string;
  };
  participants: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

interface FilterOptions {
  type: string;
  status: string;
}


const getEventStatus = (eventDate: string, eventTime: string): Event['status'] => {
  const [hours, minutes] = eventTime.split(':').map(Number);
  const eventDateTime = new Date(eventDate);
  eventDateTime.setHours(hours, minutes);
  
  const now = new Date();
  const endTime = new Date(eventDateTime);
  endTime.setHours(endTime.getHours() + 2); // Assuming events last 2 hours

  if (eventDateTime > now) {
    return 'upcoming';
  } else if (now >= eventDateTime && now <= endTime) {
    return 'ongoing';
  } else {
    return 'completed';
  }
};


const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    status: 'all'
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'workshop' as const
  });

  const eventTypes = ['workshop', 'seminar', 'cultural', 'other'];

  useEffect(() => {
    fetchEvents();
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setEvents(prevEvents => 
        prevEvents.map(event => ({
          ...event,
          status: getEventStatus(event.date, event.time)
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
      }

      const eventsWithUpdatedStatus = data.map((event: Event) => ({
        ...event,
        status: getEventStatus(event.date, event.time)
      }));

      setEvents(eventsWithUpdatedStatus);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching events';
      setError(message);
      showAlert('error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete event');
      }

      setEvents(prev => prev.filter(event => event._id !== eventId));
      showAlert('success', 'Event deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting event';
      showAlert('error', message);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register for event');
      }

      setEvents(prev => prev.map(event => 
        event._id === eventId ? data : event
      ));
      showAlert('success', 'Registered for event successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error registering for event';
      showAlert('error', message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!formData.title || !formData.description || !formData.date || 
          !formData.time || !formData.location || !formData.type) {
        showAlert('error', 'All fields are required');
        return;
      }

      const status = getEventStatus(formData.date, formData.time);
      const eventData = {
        ...formData,
        status
      };

      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
      }

      setEvents(prev => [data, ...prev]);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'workshop'
      });
      showAlert('success', 'Event created successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating event';
      showAlert('error', message);
    }
  };

  const getFilteredEvents = () => {
    return events.filter(event => {
      if (filters.type !== 'all' && event.type !== filters.type) return false;
      if (filters.status !== 'all' && event.status !== filters.status) return false;
      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Events Management</h2>

      {alert && (
        <div className={`mb-4 p-4 rounded-md ${
          alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {alert.message}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={filters.type}
          onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Types</option>
          {eventTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Event Form */}
      {user?.role === 'admin' && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as Event['type']})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                {eventTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Event
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredEvents().map(event => {
          const currentStatus = getEventStatus(event.date, event.time);
          return (
            <div key={event._id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Time: {event.time}</p>
                <p>Location: {event.location}</p>
                <p>Type: {event.type}</p>
                <p>Status: <span className={`font-semibold ${
                  currentStatus === 'upcoming' ? 'text-green-600' :
                  currentStatus === 'ongoing' ? 'text-blue-600' :
                  currentStatus === 'completed' ? 'text-gray-600' :
                  'text-red-600'
                }`}>{currentStatus}</span></p>
                <p>Organizer: {event.organizer.name}</p>
                <p>Participants: {event.participants.length}</p>
              </div>
              <div className="flex gap-2">
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                )}
                {user && currentStatus === 'upcoming' && 
                 !event.participants.some(p => p._id === user._id) && (
                  <button
                    onClick={() => handleRegister(event._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Events;