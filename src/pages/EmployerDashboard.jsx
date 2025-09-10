import React, { useState, useEffect } from 'react';
import { Briefcase, Eye, Pencil, Trash2, User } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const BASE_URL = 'http://127.0.0.1:5000';

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/employer/jobs`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to load jobs');
        const data = await res.json();
        setJobs(data.jobs || data);
      } catch (err) {
        console.error(err);
        alert('Could not fetch posted jobs.');
      }
    };

    const fetchInteractions = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/employer/interactions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to load activity');
        const data = await res.json();
        setInteractions(data.activity || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
    fetchInteractions();
  }, []);

  const totalPosted = jobs.length;
  const totalClaimed = jobs.filter(j => j.claimed).length;
  const totalCompleted = jobs.filter(j => j.completed).length;
  const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0);

  const claimData = {
    labels: ['Posted', 'Claimed', 'Completed'],
    datasets: [{
      label: 'Job Progress',
      data: [totalPosted, totalClaimed, totalCompleted],
      backgroundColor: ['#2563eb', '#10b981', '#facc15'],
    }],
  };

  const applicantData = {
    labels: jobs.map(j => j.title),
    datasets: [{
      label: 'Applicants',
      data: jobs.map(j => j.applicants || 0),
      backgroundColor: ['#6366f1', '#3b82f6'],
    }],
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 space-y-16">
      <h2 className="text-4xl font-bold text-center animate-fade-in">Employer Dashboard</h2>

      <section className="max-w-5xl mx-auto space-y-6">
        <h3 className="text-2xl font-semibold text-blue-400 mb-4">Analytics Overview</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-4 rounded-lg shadow-md">
            <Bar data={claimData} options={{ responsive: true }} />
          </div>
          <div className="bg-gray-900 p-4 rounded-lg shadow-md">
            <Doughnut data={applicantData} />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto space-y-4">
        <h3 className="text-2xl font-semibold text-blue-400 mb-4">Your Posted Jobs</h3>
        {jobs.map(job => (
          <div key={job.id} className="bg-gray-900 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold flex gap-2 items-center">
                <Briefcase size={20} /> {job.title}
              </h4>
              <div className="flex gap-2 text-sm text-gray-400">
                <Eye size={18} /> {job.views || 0} views
              </div>
            </div>
            <p className="text-sm text-gray-400">Posted on: {job.date || '—'}</p>
            <p className="text-sm text-gray-300">
              Status: {job.completed ? 'Completed' : job.claimed ? '🛠 Claimed' : 'Open'}
            </p>
            <p className="text-sm text-gray-300">Applicants: {job.applicants || 0}</p>
            <div className="flex gap-4 mt-3">
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white flex items-center gap-1 text-sm">
                <Pencil size={16} /> Edit
              </button>
              <button className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white flex items-center gap-1 text-sm">
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto space-y-4">
        <h3 className="text-2xl font-semibold text-blue-400 mb-4">Recent Applicant Activity</h3>
        {interactions.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent activity.</p>
        ) : (
          interactions.map((item, i) => (
            <div key={i} className="bg-gray-900 p-4 rounded flex items-center gap-4">
              <User size={24} className="text-gray-400" />
              <div>
                <p className="text-gray-300 text-sm">
                  <span className="text-white font-semibold">{item.name}</span> {item.action}.
                </p>
                <p className="text-xs text-gray-500">on {item.date}</p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default EmployerDashboard;
