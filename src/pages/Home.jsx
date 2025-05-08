import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-text">
          <h1>Find and Claim Local Jobs Instantly</h1>
          <p>Your next opportunity could be right around the corner. Discover short-term and part-time jobs near you, fast.</p>
          <div className="hero-buttons">
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            <Link to="/post-job" className="btn btn-outline">Post a Job</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/job-map.png" alt="Job Map" />
        </div>
      </section>

      <section className="features-section">
        <h2>Why Use Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Location-Based Matching</h3>
            <p>Jobs are tailored to your area to minimize travel and increase efficiency.</p>
          </div>
          <div className="feature-card">
            <h3>Instant Job Claiming</h3>
            <p>Claim jobs in real-time — no waiting, no duplicates, just results.</p>
          </div>
          <div className="feature-card">
            <h3>Simple & Fast Posting</h3>
            <p>Employers post jobs with ease and get instant responses.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
