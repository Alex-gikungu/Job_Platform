import React, { useEffect, useState } from 'react';
import {
  Megaphone,
  Trash2,
  Bell,
  CheckCircle
} from 'lucide-react';

const BASE_URL = 'http://127.0.0.1:5000';
const token    = localStorage.getItem('token');

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useState('');

  // fetch from backend
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/notifications`, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      alert('Could not load notifications.');
    }
  };

  // mark a notification read
  const markAsRead = async (id) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error(err);
      alert('Failed to mark as read');
    }
  };

  // delete locally
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // subscribe action
  const handleSubscribe = () => {
    if (!email) {
      return alert('Please enter your email.');
    }
    alert(`✅ Subscribed ${email} to job alerts!`);
    setEmail('');
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 space-y-12">
      {/* Header */}
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center flex-1">
          📢 Notifications & Announcements
        </h2>
        <div className="relative">
          <Bell className="text-white" size={28} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Notification Feed */}
      <section className="max-w-4xl mx-auto space-y-6">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-400">No notifications.</div>
        ) : (
          notifications.map(({ id, title, type, message, date, read }) => (
            <div
              key={id}
              className={`relative bg-gray-900 rounded-lg p-6 shadow-md border-l-4 ${
                type === 'event' ? 'border-green-500' :
                type === 'alert' ? 'border-yellow-400' :
                type === 'highlight' ? 'border-blue-500' :
                'border-gray-500'
              }`}
            >
              <div className="absolute top-3 right-3 flex gap-2">
                {!read && (
                  <button
                    onClick={() => markAsRead(id)}
                    title="Mark as read"
                    className="text-green-400 hover:text-green-300 transition"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(id)}
                  title="Delete"
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className={`text-lg font-semibold ${read ? 'text-gray-300' : 'text-white'}`}>
                {title}
              </h3>
              <p className="text-sm text-gray-400">{new Date(date).toLocaleString()}</p>
              <p className="text-sm mt-2 text-gray-300">{message}</p>

              {!read && (
                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold bg-red-600 text-white rounded-full">
                  Unread
                </span>
              )}
            </div>
          ))
        )}
      </section>

      {/* Subscription Box */}
      <section className="max-w-xl mx-auto text-center bg-blue-600 bg-opacity-80 p-6 rounded-xl shadow-lg space-y-4">
        <Megaphone size={28} className="mx-auto text-white" />
        <h3 className="text-xl font-semibold text-white">Get Alerts First</h3>
        <p className="text-sm text-gray-200">
          Enter your email and never miss an update on events, jobs, or changes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full sm:w-2/3 px-4 py-2 bg-gray-800 text-white placeholder-gray-400 rounded focus:ring-2 focus:ring-white"
          />
          <button
            onClick={handleSubscribe}
            className="bg-black hover:bg-gray-900 px-5 py-2 rounded text-white font-semibold transition"
          >
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default Notifications;
