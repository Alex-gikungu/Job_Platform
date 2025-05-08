// src/pages/Login.jsx
import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import '../styles/login.css'; // Adjust the path based on your structure

const Login = () => {
  const [role, setRole] = useState('job-hunter');

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>

      <div className="role-switcher">
        <button
          className={`role-button ${role === 'job-hunter' ? 'active' : ''}`}
          onClick={() => setRole('job-hunter')}
        >
          Job Hunter
        </button>
        <button
          className={`role-button ${role === 'job-provider' ? 'active' : ''}`}
          onClick={() => setRole('job-provider')}
        >
          Job Provider
        </button>
        <button
          className={`role-button ${role === 'admin' ? 'active' : ''}`}
          onClick={() => setRole('admin')}
        >
          Admin
        </button>
      </div>

      <form className="login-form">
        {role === 'admin' ? (
          <div className="input-group">
            <User />
            <input type="text" placeholder="Admin Username" required />
          </div>
        ) : (
          <div className="input-group">
            <Mail />
            <input type="email" placeholder="Email Address" required />
          </div>
        )}

        <div className="input-group">
          <Lock />
          <input type="password" placeholder="Password" required />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        {(role === 'job-hunter' || role === 'job-provider') && (
          <button type="button" className="google-login-btn">
            <FcGoogle size={22} />
            Continue with Google
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
