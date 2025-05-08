import React, { useState } from 'react';
import { MapPin, User, Briefcase, DollarSign, CreditCard, Clock, Users, Wrench } from 'lucide-react';
import '../styles/joblisting.css';

const jobsData = [
  {
    id: 1,
    postedBy: 'John Mwangi',
    title: 'House Painting',
    type: 'Skilled',
    price: '2500',
    payment: 'Mpesa',
    location: 'Kasarani, Nairobi',
    mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=36.9099%2C-1.2250%2C36.9120%2C-1.2230&layer=mapnik',
    claimed: false,
    qualifications: 'Experience in painting, knowledge of paint types, and surface preparation.',
    ageRange: '18-45',
    timeFrame: '3 days (May 10 - May 12, 2025)',
    category: 'Home Improvement',
    requiredTools: 'Paint brushes, rollers, ladders',
    contact: 'john.mwangi@example.com',
  },
  {
    id: 2,
    postedBy: 'Mary Wanjiru',
    title: 'Web Developer',
    type: 'Professional',
    price: '15000',
    payment: 'Both',
    location: 'Westlands, Nairobi',
    mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=36.8020%2C-1.2630%2C36.8045%2C-1.2615&layer=mapnik',
    claimed: false,
    qualifications: 'Proficiency in HTML, CSS, JavaScript, and React. Portfolio required.',
    ageRange: '22-35',
    timeFrame: '1 week (May 10 - May 17, 2025)',
    category: 'Technology',
    requiredTools: 'Laptop with development environment',
    contact: 'mary.wanjiru@example.com',
  },
];

const JobListings = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || job.type === filter;
    return matchesSearch && matchesFilter;
  });

  const toggleClaim = (id) => {
    const index = jobsData.findIndex((job) => job.id === id);
    jobsData[index].claimed = !jobsData[index].claimed;
    setSearch(search + ' ');
  };

  const openModal = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="job-container">
      <h2 className="job-heading">Available Jobs</h2>

      {/* Search and Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search job..."
          className="search-input"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-buttons">
          {['All', 'Professional', 'Skilled', 'Non-Skilled'].map((cat) => (
            <button
              key={cat}
              className={`filter-button ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="tip-text">
        Browse through jobs and claim those that match your skills and location.
      </p>

      {/* Job Cards */}
      <div className="job-grid">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-meta">
              <User size={16} />
              <span>Posted by: {job.postedBy}</span>
            </div>

            <h3 className="job-title">
              <Briefcase size={20} />
              {job.title}
            </h3>

            <div className="job-type">
              <span>{job.type}</span>
            </div>

            <div className="job-price">
              <DollarSign size={16} />
              <span>KES {job.price}</span>
            </div>

            <div className="job-payment">
              <CreditCard size={16} />
              <span>Payment: {job.payment}</span>
            </div>

            <div className="job-location">
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>

            <iframe
              src={job.mapUrl}
              className="job-map"
              title={`Map for ${job.title}`}
              allowFullScreen
              loading="lazy"
            ></iframe>

            <button onClick={() => openModal(job)} className="read-more-button">
              Read More
            </button>

            <button
              onClick={() => toggleClaim(job.id)}
              className={`claim-button ${job.claimed ? 'claimed' : 'unclaimed'}`}
            >
              {job.claimed ? 'Unclaim Job' : 'Claim Job'}
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Job Details */}
      {selectedJob && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="modal-title">{selectedJob.title}</h3>
            <div className="modal-details">
              <div className="modal-item">
                <User size={16} />
                <span>Posted by: {selectedJob.postedBy}</span>
              </div>
              <div className="modal-item">
                <Briefcase size={16} />
                <span>Type: {selectedJob.type}</span>
              </div>
              <div className="modal-item">
                <DollarSign size={16} />
                <span>Price: KES {selectedJob.price}</span>
              </div>
              <div className="modal-item">
                <CreditCard size={16} />
                <span>Payment: {selectedJob.payment}</span>
              </div>
              <div className="modal-item">
                <MapPin size={16} />
                <span>Location: {selectedJob.location}</span>
              </div>
              <div className="modal-item">
                <Users size={16} />
                <span>Age Range: {selectedJob.ageRange}</span>
              </div>
              <div className="modal-item">
                <Clock size={16} />
                <span>Time Frame: {selectedJob.timeFrame}</span>
              </div>
              <div className="modal-item">
                <Briefcase size={16} />
                <span>Category: {selectedJob.category}</span>
              </div>
              <div className="modal-qualifications">
                <span className="modal-label">Qualifications:</span>
                <p>{selectedJob.qualifications}</p>
              </div>
              <div className="modal-item">
                <Wrench size={16} />
                <span>Required Tools: {selectedJob.requiredTools}</span>
              </div>
              <div className="modal-item">
                <span>Contact: {selectedJob.contact}</span>
              </div>
            </div>
            <button onClick={closeModal} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListings;