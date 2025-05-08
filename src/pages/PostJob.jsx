import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  MapPin,
  CreditCard,
  Type,
  FileText,
} from 'lucide-react';
import "../styles/postjob.css";

const PostJob = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    type: 'Professional',
    price: '',
    payment: 'Mpesa',
    location: '',
    description: '',
    qualifications: {
      degree: false,
      experience: false,
      ageRange: false,
      certification: false,
      physicalAbility: false,
    }
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm(prevState => ({
      ...prevState,
      qualifications: {
        ...prevState.qualifications,
        [name]: checked,
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Job Posted:', form);
    alert('Job successfully posted!');
  };

  return (
    <div className="post-job-container">
      <h2 className="heading">Post a Job</h2>
      <form onSubmit={handleSubmit} className="form">
        {/* Full Name */}
        <div className="input-group">
          <User size={18} />
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Email */}
        <div className="input-group">
          <Mail size={18} />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Phone */}
        <div className="input-group">
          <Phone size={18} />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Job Title */}
        <div className="input-group">
          <Briefcase size={18} />
          <input
            name="title"
            type="text"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Job Type */}
        <div className="input-group">
          <Type size={18} />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Professional">Professional</option>
            <option value="Skilled">Skilled</option>
            <option value="Non-Skilled">Non-Skilled</option>
          </select>
        </div>

        {/* Qualifications Section based on Job Type */}
        {form.type === 'Professional' && (
          <div className="qualifications-section">
            <h3>Qualifications (Professional)</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="degree"
                  checked={form.qualifications.degree}
                  onChange={handleCheckboxChange}
                />
                Degree
              </label>
              <label>
                <input
                  type="checkbox"
                  name="experience"
                  checked={form.qualifications.experience}
                  onChange={handleCheckboxChange}
                />
                Years of Experience
              </label>
              <label>
                <input
                  type="checkbox"
                  name="ageRange"
                  checked={form.qualifications.ageRange}
                  onChange={handleCheckboxChange}
                />
                Age Range
              </label>
            </div>
          </div>
        )}

        {form.type === 'Skilled' && (
          <div className="qualifications-section">
            <h3>Qualifications (Skilled)</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="certification"
                  checked={form.qualifications.certification}
                  onChange={handleCheckboxChange}
                />
                Certification
              </label>
              <label>
                <input
                  type="checkbox"
                  name="experience"
                  checked={form.qualifications.experience}
                  onChange={handleCheckboxChange}
                />
                Years of Experience
              </label>
              <label>
                <input
                  type="checkbox"
                  name="physicalAbility"
                  checked={form.qualifications.physicalAbility}
                  onChange={handleCheckboxChange}
                />
                Physical Ability
              </label>
            </div>
          </div>
        )}

        {form.type === 'Non-Skilled' && (
          <div className="qualifications-section">
            <h3>Qualifications (Non-Skilled)</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="physicalAbility"
                  checked={form.qualifications.physicalAbility}
                  onChange={handleCheckboxChange}
                />
                Physical Ability
              </label>
              <label>
                <input
                  type="checkbox"
                  name="ageRange"
                  checked={form.qualifications.ageRange}
                  onChange={handleCheckboxChange}
                />
                Age Range
              </label>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="input-group">
          <DollarSign size={18} />
          <input
            name="price"
            type="number"
            placeholder="Offered Price (KES)"
            value={form.price}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Payment Method */}
        <div className="input-group">
          <CreditCard size={18} />
          <select
            name="payment"
            value={form.payment}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Mpesa">Mpesa</option>
            <option value="Cash on Hand">Cash on Hand</option>
            <option value="Both">Both</option>
          </select>
        </div>

        {/* Location */}
        <div className="input-group">
          <MapPin size={18} />
          <input
            name="location"
            type="text"
            placeholder="Location (e.g., Umoja, Nairobi)"
            value={form.location}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Description */}
        <div className="input-group description">
          <FileText size={18} />
          <textarea
            name="description"
            placeholder="Optional Job Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="input-field"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;
