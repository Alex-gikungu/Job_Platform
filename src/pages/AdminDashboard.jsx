import React, { useEffect, useState, useRef } from 'react';
import { Trash2, CheckCircle, XCircle, UserCheck, Briefcase, Download } from 'lucide-react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [jobStats, setJobStats] = useState({ posted: 0, approved: 0, declined: 0 });

  const BASE_URL = 'http://127.0.0.1:5000';
  const token = localStorage.getItem('token');
  const reportRef = useRef(null);

  useEffect(() => {
    fetchUsers();
    fetchPendingJobs();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingJobs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/pending-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPendingJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/job-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const stats = await res.json();
      setJobStats(stats || {});
    } catch (err) {
      console.error(err);
    }
  };

  const exportToPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('admin-report.pdf');
  };

  const deleteUser = async (id) => {
    if (!confirm('Remove this user?')) return;
    try {
      await fetch(`${BASE_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const approveJob = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/admin/jobs/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingJobs(pendingJobs.filter((j) => j.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const declineJob = async (id) => {
    if (!confirm('Decline and delete this job?')) return;
    try {
      await fetch(`${BASE_URL}/api/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingJobs(pendingJobs.filter((j) => j.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = {
    labels: ['Posted', 'Approved', 'Declined'],
    datasets: [
      {
        label: 'Job Trend',
        data: [jobStats.posted, jobStats.approved, jobStats.declined],
        backgroundColor: ['#3b82f6', '#22c55e', '#ef4444'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 space-y-16">
      <h2 className="text-4xl font-bold text-center text-blue-500">Admin Dashboard</h2>

      <section ref={reportRef} className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-lg shadow space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-blue-400">Job Posting Trends</h3>
          <button
            onClick={exportToPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
          >
            <Download size={18} /> Download PDF
          </button>
        </div>
        <Bar data={chartData} />
      </section>

      <section className="max-w-6xl mx-auto space-y-4">
        <h3 className="text-2xl font-semibold text-blue-400 mb-2">Registered Users</h3>
        {users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center shadow">
              <div className="space-y-1">
                <p className="text-white font-semibold flex items-center gap-2">
                  <UserCheck size={20} /> {user.name}
                </p>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                className="text-red-500 hover:text-red-400"
                title="Remove user"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </section>

      <section className="max-w-6xl mx-auto space-y-4">
        <h3 className="text-2xl font-semibold text-blue-400 mb-2">Pending Job Approvals</h3>
        {pendingJobs.length === 0 ? (
          <p className="text-gray-400">No jobs pending approval.</p>
        ) : (
          pendingJobs.map((job) => (
            <div key={job.id} className="bg-gray-900 p-4 rounded-lg shadow space-y-2">
              <h4 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase size={20} /> {job.title}
              </h4>
              <p className="text-sm text-gray-300">{job.description}</p>
              <p className="text-sm text-gray-400">Posted by ID: {job.posted_by}</p>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => approveJob(job.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded flex items-center gap-1 text-sm"
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  onClick={() => declineJob(job.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded flex items-center gap-1 text-sm"
                >
                  <XCircle size={16} /> Decline
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
