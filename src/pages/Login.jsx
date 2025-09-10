import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [role, setRole] = useState('job-hunter');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { label: 'Job Hunter', key: 'job-hunter' },
    { label: 'Job Provider', key: 'job-provider' },
    { label: 'Admin', key: 'admin' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiRole =
      role === 'job-hunter'
        ? 'seeker'
        : role === 'job-provider'
        ? 'employer'
        : 'admin';

    try {
      const res = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identifier,
          username: identifier,
          password,
          role: apiRole,
        }),
      });

      const payload = await res.json();

      if (res.ok) {
        localStorage.setItem('token', payload.token);
        localStorage.setItem('role', apiRole);
        localStorage.setItem('username', payload.username || identifier);

        // Navigate and refresh
        if (apiRole === 'seeker') {
          navigate('/jobs');
        } else if (apiRole === 'employer') {
          navigate('/employerdashboard');
        } else {
          navigate('/admindashboard');
        }

        // Slight delay before reload for smoother UX
        setTimeout(() => window.location.reload(), 100);
      } else {
        alert(payload.msg || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative text-white flex items-center justify-center px-6">
      <div
        style={{ opacity: 0.2 }}
        className="absolute inset-0 bg-[url('https://imgs.search.brave.com/XHE3MEkGU8I8yQ0Encr2CiUO_R1MzjtPrZROmGtcjLo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/am9icy5pZS9qb2It/dGFsay93cC1jb250/ZW50L3VwbG9hZHMv/cmV0YWlsLWhlYWRl/ci1qb2JzLmllXy0x/LmpwZz9pbT1SZXNp/emU9KDcyMCk')] bg-cover bg-center z-0"
      ></div>

      <div className="relative z-10 w-full max-w-md bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-2xl animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>

        <div className="flex justify-between mb-6">
          {roles.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setRole(key)}
              type="button"
              className={`flex-1 text-sm py-2 mx-1 rounded transition duration-300 ${
                role === key
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            {role === 'admin' ? (
              <User className="absolute left-3 top-3 text-gray-400" />
            ) : (
              <Mail className="absolute left-3 top-3 text-gray-400" />
            )}
            <input
              type={role === 'admin' ? 'text' : 'email'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={role === 'admin' ? 'Admin Username' : 'Email Address'}
              required
              className="w-full bg-gray-800 text-white placeholder-gray-400 py-2 pl-10 pr-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-gray-800 text-white placeholder-gray-400 py-2 pl-10 pr-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>

          {role !== 'admin' && (
            <button
              type="button"
              className="w-full mt-2 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded flex items-center justify-center space-x-2 transition"
            >
              <FcGoogle size={22} />
              <span>Continue with Google</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
