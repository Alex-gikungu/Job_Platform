import React, { useState, useEffect } from 'react';
import {
  MapPin, User, Briefcase, DollarSign,
  CreditCard, Clock, Wrench, Bookmark
} from 'lucide-react';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState(null); 
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);

  const [selectedJob, setSelectedJob] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [savedJobs, setSavedJobs] = useState(
    JSON.parse(localStorage.getItem('savedJobs') || '[]')
  );
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const BASE_URL = 'http://127.0.0.1:5000';
  const token = localStorage.getItem('token');

  const buildParams = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (typeFilter !== 'All') params.append('type', typeFilter);
    if (locationFilter.trim()) params.append('location', locationFilter.trim());
    if (priceFilter) params.append('min_price', priceFilter);
    if (sortOption) params.append('sort', sortOption);
    if (page) params.append('page', page);
    if (perPage) params.append('per_page', perPage);
    return params.toString();
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = buildParams();
      const res = await fetch(`${BASE_URL}/api/jobs?${query}`, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} — ${text}`);
      }

      const data = await res.json();

      const jobsArray = Array.isArray(data) ? data : (data.jobs || []);
      setJobs(jobsArray);

      if (!Array.isArray(data) && data.meta) {
        setMeta(data.meta);
      } else {
        setMeta(null);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (jobId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/${jobId}/comments`, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setComments(data.comments || data || []);
    } catch (err) {
      console.error('Error loading comments:', err);
      setComments([]);
    }
  };

  useEffect(() => {

    fetchJobs();
    
  }, [search, typeFilter, locationFilter, priceFilter, sortOption, page]);

  const claimJob = async (jobId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/${jobId}/claim`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || 'Failed to claim job');
      }
      fetchJobs();
    } catch (err) {
      alert(err.message);
    }
  };

  const viewJob = async (jobId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/${jobId}`, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const job = data.job || data; 
      setSelectedJob(job);
      fetchComments(jobId);
    } catch (err) {
      console.error('Failed to load job details', err);
      alert('Failed to load job details');
    }
  };

  const postComment = async () => {
    if (!comment.trim() || !selectedJob) return;
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/${selectedJob.id}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment, parent_id: null })
      });
      if (!res.ok) throw new Error((await res.json()).msg || 'Failed to post comment');
      setComment('');
      fetchComments(selectedJob.id);
    } catch (err) {
      alert(err.message || 'Error posting comment');
    }
  };

  const postReply = async (commentId) => {
    if (!replyText.trim() || !selectedJob) return;
    try {
      const res = await fetch(`${BASE_URL}/api/jobs/${selectedJob.id}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment: replyText, parent_id: commentId })
      });
      if (!res.ok) throw new Error((await res.json()).msg || 'Failed to post reply');
      setReplyText('');
      setReplyingTo(null);
      fetchComments(selectedJob.id);
    } catch (err) {
      alert(err.message || 'Error posting reply');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId));
      } else {
        console.error("Failed to delete comment");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const toggleSaveJob = (jobId) => {
    const updated = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];
    localStorage.setItem('savedJobs', JSON.stringify(updated));
    setSavedJobs(updated);
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return ts;
    }
  };

  const goToNext = () => {
    if (meta && page < meta.pages) setPage(prev => prev + 1);
  };
  const goToPrev = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 space-y-16">
      <h2 className="text-4xl font-bold text-center mb-8">Available Jobs</h2>

      <div className="max-w-6xl mx-auto space-y-6">
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full py-3 px-6 focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select
            className="bg-gray-800 text-white py-3 px-4 rounded-md"
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All Types</option>
            <option value="Professional">Professional</option>
            <option value="Skilled">Skilled</option>
            <option value="Non-Skilled">Non-Skilled</option>
          </select>

          <input
            type="text"
            placeholder="Location"
            className="bg-gray-800 text-white py-3 px-4 rounded-md"
            value={locationFilter}
            onChange={e => { setLocationFilter(e.target.value); setPage(1); }}
          />
          <input
            type="number"
            placeholder="Min Price"
            className="bg-gray-800 text-white py-3 px-4 rounded-md"
            value={priceFilter}
            onChange={e => { setPriceFilter(e.target.value); setPage(1); }}
          />
          <select
            className="bg-gray-800 text-white py-3 px-4 rounded-md"
            value={sortOption}
            onChange={e => { setSortOption(e.target.value); setPage(1); }}
          >
            <option value="">Sort By</option>
            <option value="priceHigh">Price ↑</option>
            <option value="priceLow">Price ↓</option>
            <option value="recent">Newest</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading && (
          <p className="text-center text-gray-400 mb-4">Loading jobs…</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map(job => (
              <div
                key={job.id}
                className="bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-blue-600/40 transition relative"
              >
                <button
                  onClick={() => toggleSaveJob(job.id)}
                  className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-500"
                >
                  <Bookmark size={20} className={savedJobs.includes(job.id) ? 'fill-current' : ''} />
                </button>

                <div className="absolute top-4 right-12 bg-blue-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100">
                  {job.category}
                </div>

                <h3 className="text-2xl font-semibold text-blue-400 mb-2 flex items-center">
                  <Briefcase size={20} className="mr-2" />
                  {job.title}
                </h3>
                <p className="text-sm text-gray-300 flex items-center">
                  <User size={16} className="mr-1" />
                  {job.posted_by}
                </p>
                <p className="text-sm text-gray-400 flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {job.location}
                </p>
                <p className="text-sm text-gray-400 flex items-center">
                  <DollarSign size={16} className="mr-1" />
                  KES {job.price}
                </p>
                <p className="text-sm text-gray-400 flex items-center">
                  <Clock size={16} className="mr-1" />
                  {job.time_frame}
                </p>

                <div className="flex justify-between mt-4">
                  <button
  onClick={() => !job.claimed && claimJob(job.id)} 
  disabled={job.claimed}
  className={`px-4 py-2 rounded font-semibold ${
    job.claimed 
      ? 'bg-gray-500 cursor-not-allowed' 
      : 'bg-green-500 hover:bg-green-600'
  } text-white`}
>
  {job.claimed ? 'Claimed' : 'Claim'}
</button>

                  <button
                    onClick={() => viewJob(job.id)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">
              {!loading ? 'No jobs found.' : null}
            </div>
          )}
        </div>

        {meta && (
          <div className="flex items-center justify-between mt-6 text-gray-300">
            <div>
              Page {meta.page} of {meta.pages} — {meta.total} jobs
            </div>
            <div className="flex gap-3">
              <button
                onClick={goToPrev}
                disabled={meta.page <= 1}
                className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={goToNext}
                disabled={meta.page >= meta.pages}
                className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-8 rounded-lg max-w-3xl w-full space-y-4 overflow-y-auto max-h-[90vh]">
            <h3 className="text-3xl font-bold text-blue-400">
              {selectedJob.title}
            </h3>
            <p><User className="inline mr-2" />Posted by: {selectedJob.posted_by}</p>
            <p><Briefcase className="inline mr-2" />Type: {selectedJob.type}</p>
            <p><DollarSign className="inline mr-2" />KES {selectedJob.price}</p>
            <p><CreditCard className="inline mr-2" />Payment: {selectedJob.payment_method}</p>
            <p><MapPin className="inline mr-2" />Location: {selectedJob.location}</p>
            <p><Clock className="inline mr-2" />{selectedJob.time_frame}</p>
            <p className="text-gray-300"><strong>Description:</strong> {selectedJob.description}</p>
            <p><Wrench className="inline mr-2" />Required Tools: {selectedJob.required_tools}</p>

            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-2">Comments</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                {Array.isArray(comments) && comments.length > 0 ? comments.map((c, i) => (
                  <div key={c.id ?? i} className="bg-gray-800 p-3 rounded">
                    <p className="text-sm text-blue-300 flex justify-between items-center">
                      <span><strong>{c.user}</strong> • {formatDate(c.timestamp || c.created_at)}</span>
                    </p>

                    <p className="text-gray-200 mt-1">{c.text || c.comment}</p>

                    {Array.isArray(c.replies) && c.replies.map((r, idx) => (
                      <div key={r.id ?? idx} className="ml-4 mt-2 border-l-2 border-blue-600 pl-3 bg-gray-700 p-2 rounded">
                        <p className="text-xs text-green-300">
                          <strong>{r.user}</strong> • {formatDate(r.timestamp || r.created_at)}
                        </p>
                        <p className="text-gray-100">{r.text || r.comment}</p>
                      </div>
                    ))}

                    <div className="mt-2 flex gap-4 items-center">
                      {selectedJob.posted_by === localStorage.getItem('username') && (
                        <button
                          onClick={() => setReplyingTo(c.id)}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          Reply
                        </button>
                      )}

                      {c.user === localStorage.getItem('username') && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    {replyingTo === c.id && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          className="flex-1 bg-gray-800 rounded px-3 py-1 text-white text-sm"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        />
                        <button
                          onClick={() => postReply(c.id)}
                          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white text-sm"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                )) : (
                  <p className="text-gray-400">No comments yet.</p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 bg-gray-800 rounded px-4 py-2 text-white"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
                <button
                  onClick={postComment}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
                >
                  Comment
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedJob(null)}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListings;
