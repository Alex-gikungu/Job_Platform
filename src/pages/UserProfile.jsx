import React, { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, UploadCloud, Star, MapPin, Info, X
} from 'lucide-react';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cvName, setCvName] = useState('');
  const token = localStorage.getItem('token');

  // Refs for file inputs
  const imageRef = useRef();
  const cvRef = useRef();

  // Load profile on mount
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/profile', {
      method: 'GET',
      headers: { 
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setImagePreview(data.profile_image);
        setCvName(data.cv_file?.split('/').pop() || '');
      })
      .catch(err => {
        console.error(err);
        alert('Please log in again.');
        window.location.href = '/login';
      });
  }, [token]);

  if (!profile) return null;

  const stars = Math.min(5, Math.floor(profile.jobs_claimed / 2));

  // Update text fields
  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  const saveProfile = () => {
    fetch('http://127.0.0.1:5000/api/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        gender: profile.gender,
        bio: profile.bio,
        preferences: profile.preferences
      })
    })
      .then(res => {
        if (res.ok) {
          alert('Profile saved');
        } else {
          throw new Error();
        }
      })
      .catch(() => alert('Save failed'));
  };

  const deleteAccount = () => {
    if (!window.confirm('Delete account?')) return;
    fetch('http://127.0.0.1:5000/api/profile', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (res.ok) {
          localStorage.clear();
          window.location.href = '/';
        } else {
          alert('Delete failed');
        }
      });
  };

  // Upload profile image
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append('image', file);

    fetch('http://127.0.0.1:5000/api/profile/upload-image', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Authorization': token },
      body: fd
    })
      .then(res => res.json())
      .then(data => setImagePreview(data.profile_image))
      .catch(() => alert('Image upload failed'));
  };

  // Upload CV
  const handleCvUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    setCvName(file.name);
    const fd = new FormData();
    fd.append('cv', file);

    fetch('http://127.0.0.1:5000/api/profile/upload-cv', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Authorization': token },
      body: fd
    })
      .then(res => res.json())
      .then(data => setCvName(data.cv_file.split('/').pop()))
      .catch(() => alert('CV upload failed'));
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-12 animate-pulse text-blue-400 transition-all duration-700">
  👋 Welcome back, {profile.name || 'User'}!
</h2>

      <div className="max-w-4xl mx-auto space-y-12">

        {/* Personal Details */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md space-y-6">
          <h3 className="text-xl font-semibold text-blue-400">👤 Personal Details</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">

            <div className="relative">
              <img
                src={imagePreview || '/default-avatar.png'}
                alt="Profile"
                className="w-28 h-28 rounded-full border border-gray-700 object-cover"
              />
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
              {imagePreview && (
                <button
                  onClick={() => {
                    setImagePreview(null);
                    imageRef.current.value = null;
                  }}
                  className="absolute top-0 right-0 bg-red-600 rounded-full p-1 text-xs"
                >
                  <X size={14} />
                </button>
              )}
              <p className="text-xs text-gray-400 mt-2 text-center">Click to change</p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['name', 'Full Name', User],
                ['email', 'Email Address', Mail],
                ['phone', 'Phone Number', Phone],
                ['location', 'Location', MapPin],
                ['gender', 'Gender', Info],
              ].map(([key, label, Icon]) => (
                <div key={key} className="flex items-center bg-gray-800 rounded px-3 py-2">
                  <Icon size={16} className="mr-2 text-gray-400" />
                  <input
                    name={key}
                    value={profile[key] || ''}
                    placeholder={label}
                    onChange={handleChange}
                    className="bg-transparent w-full text-white outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">🧾 Short Bio:</label>
            <textarea
              name="bio"
              value={profile.bio || ''}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 text-white p-3 rounded outline-none resize-none"
            />
          </div>

          <div className="flex space-x-4">
            <button onClick={saveProfile} className="bg-blue-600 px-4 py-2 rounded">
              Save
            </button>
            <button onClick={deleteAccount} className="bg-red-600 px-4 py-2 rounded">
              Delete Account
            </button>
          </div>
        </div>

        {/* CV Upload */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md space-y-2">
          <h3 className="text-xl font-semibold text-blue-400">📄 CV Upload</h3>
          <div className="flex items-center gap-4">
            <UploadCloud size={24} />
            <input
              ref={cvRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCvUpload}
              className="text-white"
            />
          </div>
          {cvName && <p className="text-sm text-gray-300">Uploaded: {cvName}</p>}
        </div>

        {/* Rating & Activity */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md space-y-2">
          <h3 className="text-xl font-semibold text-blue-400">⭐ Profile Rating</h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < stars ? 'text-yellow-400' : 'text-gray-600'}
              />
            ))}
          </div>
          <p className="text-sm text-gray-300">
            {profile.jobs_claimed > 0
              ? `${profile.jobs_claimed} jobs claimed & completed. Keep going!`
              : `No completed jobs yet. Claim a job to build your rating.`}
          </p>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
