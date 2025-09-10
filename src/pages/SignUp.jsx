import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, User, MapPin, Briefcase } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState('job-seeker');
  const [location, setLocation] = useState('');
  const [geoStatus, setGeoStatus] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: '',
    company: '',
    postLimit: ''
  });
  const [loading, setLoading] = useState(false);

  // Attempt geolocation on mount
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
      },
      () => setGeoStatus('Unable to fetch location.')
    );
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Submit to Flask backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Passwords don't match");
    }

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: userType === 'job-seeker' ? 'seeker' : 'employer',
        })
      });

      if (res.status === 201) {
        alert('Signup successful! Redirecting to login...');
        navigate('/login');
      } else {
        const { msg } = await res.json();
        alert(msg || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative text-white flex items-center justify-center px-4 sm:px-8 py-12">

      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://img.freepik.com/premium-vector/flat-design-people-apply-job_108061-1460.jpg')] bg-cover bg-center opacity-25 z-0"></div>

      {/* SignUp Form */}
      <div className="relative z-10 w-full max-w-2xl bg-gray-900 bg-opacity-85 p-10 rounded-xl shadow-2xl animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Account</h1>

        {/* Role Selection */}
        <div className="flex justify-center space-x-4 mb-8">
          {['job-seeker','employer'].map(type => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              type="button"
              className={`px-5 py-2 rounded-full text-sm font-medium transition duration-300 ${
                userType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {type === 'job-seeker' ? 'Job Hunter' : 'Job Provider'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6">

          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              required
              className="w-full h-12 bg-gray-800 text-white pl-10 pr-4 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              required
              className="w-full h-12 bg-gray-800 text-white pl-10 pr-4 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Phone Number"
              required
              className="w-full h-12 bg-gray-800 text-white pl-10 pr-4 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Location (readonly or editable) */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              readOnly
              className="w-full h-12 bg-gray-700 text-gray-200 pl-10 pr-4 rounded-md"
            />
            {geoStatus && <p className="text-xs text-red-400 mt-1">{geoStatus}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              required
              className="w-full h-12 bg-gray-800 text-white pl-10 pr-4 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Confirm Password"
              required
              className="w-full h-12 bg-gray-800 text-white pl-10 pr-4 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
