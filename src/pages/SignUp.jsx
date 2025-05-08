// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { Mail, Phone, Lock, User, MapPin, Briefcase } from 'lucide-react';
import '../styles/signup.css'; // Make sure this path is correct based on your folder structure

const SignUp = () => {
  const [userType, setUserType] = useState('job-seeker');

  return (
    <div className="signup-container">
      <h1 className="signup-title">Create Your Account</h1>

      <div className="user-type-buttons">
        <button
          onClick={() => setUserType('job-seeker')}
          className={`user-type-button ${userType === 'job-seeker' ? 'active' : ''}`}
        >
          Job Hunter
        </button>
        <button
          onClick={() => setUserType('employer')}
          className={`user-type-button ${userType === 'employer' ? 'active' : ''}`}
        >
          Job Provider
        </button>
      </div>

      <form className="signup-form">
        <div className="input-group">
          <User />
          <input type="text" placeholder="Full Name" required />
        </div>

        <div className="input-group">
          <Mail />
          <input type="email" placeholder="Email Address" required />
        </div>

        <div className="input-group">
          <Phone />
          <input type="tel" placeholder="Phone Number" required />
        </div>

        <div className="input-group">
          <MapPin />
          <input type="text" placeholder="Location (e.g., Nairobi)" required />
        </div>

        {userType === 'job-seeker' ? (
          <div className="input-group">
            <Briefcase />
            <select required>
              <option value="">Select Job Category</option>
              <option value="professional">Professional</option>
              <option value="skilled">Skilled</option>
              <option value="non-skilled">Non-Skilled</option>
            </select>
          </div>
        ) : (
          <>
            <div className="input-group">
              <Briefcase />
              <select required>
                <option value="">Type of Jobs Offering</option>
                <option value="professional">Professional</option>
                <option value="skilled">Skilled</option>
                <option value="non-skilled">Non-Skilled</option>
              </select>
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Company Name / Organization (Optional)"
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Job Posting Limit (e.g., 5 per day)"
              />
            </div>
          </>
        )}

        <div className="input-group">
          <Lock />
          <input type="password" placeholder="Password" required />
        </div>

        <div className="input-group">
          <Lock />
          <input type="password" placeholder="Confirm Password" required />
        </div>

        <button type="submit" className="signup-btn">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUp;
