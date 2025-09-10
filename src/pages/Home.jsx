import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/home.css";

const Home = () => {
  return (
    <div className="relative min-h-screen text-white bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/1247934977/vector/applying-for-job-online-concept-vector-of-multiple-people-applying-for-work-position-giving.jpg?s=612x612&w=0&k=20&c=nSL_MHh4UN01-3eNIlo4L-Wr1ooT2t_1bxTjqzLiT3M=')] bg-cover bg-center opacity-20 z-0"></div>

      <section className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-4xl sm:text-6xl font-bold animate-pulse">Find and Claim Local Jobs Instantly</h1>
        <p className="mt-4 text-lg max-w-xl animate-fade-in">Your next opportunity could be right around the corner.</p>
        <div className="mt-8 flex space-x-4 animate-fade-in">
          <Link to="/jobs" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow">Browse Jobs</Link>
          <Link to="/post-job" className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded shadow">Post a Job</Link>
        </div>
      </section>
      

      <section className="relative z-10 py-24 px-6 bg-gray-900 bg-opacity-70">
        <h2 className="text-3xl font-bold text-center mb-12">Why Use Our Platform?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Location-Based Matching</h3>
            <p>Jobs are tailored to your area to minimize travel and increase efficiency.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Instant Job Claiming</h3>
            <p>Claim jobs in real-time — no waiting, no duplicates, just results.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Simple & Fast Posting</h3>
            <p>Employers post jobs with ease and get instant responses.</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6 bg-black bg-opacity-80">
        <h2 className="text-3xl font-bold text-center mb-12">Explore Job Categories</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg text-center shadow-md">Delivery & Courier</div>
          <div className="bg-gray-900 p-6 rounded-lg text-center shadow-md">Cleaning & Maintenance</div>
          <div className="bg-gray-900 p-6 rounded-lg text-center shadow-md">Event Staffing</div>
          <div className="bg-gray-900 p-6 rounded-lg text-center shadow-md">Remote Assistance</div>
          <div className="bg-gray-900 p-6 rounded-lg text-center shadow-md">Gardening & Outdoor</div>
          <div className="bg-gray-900 p-6 rounded-lg text-center shadow-md">Retail & Sales</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
