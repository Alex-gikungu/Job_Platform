import React, { useState } from 'react';
import {
  User, Mail, Phone, Briefcase, DollarSign, MapPin,
  CreditCard, Type, FileText
} from 'lucide-react';

const PostJob = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    type: 'Professional',
    category: '',
    time_frame: '',
    required_tools: '',
    price: '',
    payment: 'Mpesa',
    location: '',
    description: '',
    agree: false,
    ageGap: '',
    qualifications: {
      degree: false,
      experience: false,
      certification: false,
      physicalAbility: false
    }
  });

  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'agree') {
      setForm({ ...form, agree: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm(prev => ({
      ...prev,
      qualifications: { ...prev.qualifications, [name]: checked }
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.agree) {
    alert('Please confirm terms before posting.');
    return;
  }

  const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
  if (!token) {
    alert('You must be logged in to post a job.');
    return;
  }

  const payload = {
    title: form.title,
    description: form.description,
    type: form.type,
    category: form.category || form.type,
    price: form.price,
    location: form.location,
    payment_method: form.payment,
    time_frame: form.time_frame || '1 week',
    required_tools: form.required_tools || '',
  };

  try {
    const res = await fetch('http://127.0.0.1:5000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // attach token
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Job successfully posted!');
      console.log(data);
    } else {
      alert(data.msg || 'Failed to post job.');
    }
  } catch (err) {
    console.error('Job post error:', err);
    alert('An error occurred. Try again.');
  }
};


  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-10">Post a Job</h2>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-semibold text-blue-400">Personal Information</h3>
            {[['name', 'Full Name', User], ['email', 'Email Address', Mail], ['phone', 'Phone Number', Phone]].map(([name, placeholder, Icon]) => (
              <div key={name} className="flex items-center bg-gray-800 rounded-md px-4 py-2 max-w-md">
                <Icon size={20} className="text-gray-400 mr-3" />
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  placeholder={placeholder}
                  className="bg-transparent w-full placeholder-gray-400 text-white outline-none"
                />
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-semibold text-blue-400">Job Requirements</h3>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center bg-gray-800 rounded-md px-4 py-2">
                <Briefcase size={20} className="text-gray-400 mr-3" />
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Job Title"
                  className="bg-transparent w-full placeholder-gray-400 text-white outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-800 rounded-md px-4 py-2">
                <Type size={20} className="text-gray-400 mr-3" />
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="bg-transparent w-full text-white outline-none"
                >
                  <option value="Professional">Professional</option>
                  <option value="Skilled">Skilled</option>
                  <option value="Non-Skilled">Non-Skilled</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center bg-gray-800 rounded-md px-4 py-2">
                <Type size={20} className="text-gray-400 mr-3" />
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Category (optional)"
                  className="bg-transparent w-full placeholder-gray-400 text-white outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-800 rounded-md px-4 py-2">
                <Type size={20} className="text-gray-400 mr-3" />
                <input
                  name="time_frame"
                  value={form.time_frame}
                  onChange={handleChange}
                  placeholder="Time Frame (e.g., 3 days)"
                  className="bg-transparent w-full placeholder-gray-400 text-white outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center bg-gray-800 rounded-md px-4 py-2">
                <DollarSign size={20} className="text-gray-400 mr-3" />
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="Offered Price (KES)"
                  className="bg-transparent w-full placeholder-gray-400 text-white outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-800 rounded-md px-4 py-2">
                <CreditCard size={20} className="text-gray-400 mr-3" />
                <select
                  name="payment"
                  value={form.payment}
                  onChange={handleChange}
                  className="bg-transparent w-full text-white outline-none"
                >
                  <option value="Mpesa">Mpesa</option>
                  <option value="Cash on Hand">Cash on Hand</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center bg-gray-800 rounded-md px-4 py-2">
                <MapPin size={20} className="text-gray-400 mr-3" />
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="Location (e.g., Umoja, Nairobi)"
                  className="bg-transparent w-full placeholder-gray-400 text-white outline-none"
                />
              </div>

              <div className="flex items-center bg-gray-800 rounded-md px-4 py-2">
                <Type size={20} className="text-gray-400 mr-3" />
                <select
                  name="ageGap"
                  value={form.ageGap}
                  onChange={handleChange}
                  className="bg-transparent w-full text-white outline-none"
                >
                  <option value="">Select Age Gap</option>
                  <option value="18-25">18-25</option>
                  <option value="25-40">25-40</option>
                  <option value="40+">40+</option>
                </select>
              </div>
            </div>

            <div className="flex items-center bg-gray-800 rounded-md px-4 py-2">
              <Type size={20} className="text-gray-400 mr-3" />
              <input
                name="required_tools"
                value={form.required_tools}
                onChange={handleChange}
                placeholder="Required Tools (optional)"
                className="bg-transparent w-full placeholder-gray-400 text-white outline-none"
              />
            </div>

            <div className="flex items-start bg-gray-800 rounded-md px-4 py-2">
              <FileText size={20} className="text-gray-400 mt-1 mr-3" />
              <textarea
                name="description"
                placeholder="Job Description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="bg-transparent w-full placeholder-gray-400 text-white outline-none resize-none"
              ></textarea>
            </div>

            <div className="bg-gray-800 rounded-md p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Qualifications</h4>
              {Object.keys(form.qualifications).map(key => (
                <label key={key} className="block text-sm text-gray-300 cursor-pointer hover:text-blue-400 transition">
                  <input
                    type="checkbox"
                    name={key}
                    checked={form.qualifications[key]}
                    onChange={handleCheckboxChange}
                    className="mr-2 accent-blue-500"
                  />
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-semibold text-blue-400">Confirmation & Terms</h3>
            <div className="bg-gray-800 rounded-md p-4 text-sm text-gray-300">
              <p><strong>Name:</strong> {form.name}</p>
              <p><strong>Email:</strong> {form.email}</p>
              <p><strong>Phone:</strong> {form.phone}</p>
              <p><strong>Title:</strong> {form.title}</p>
              <p><strong>Type:</strong> {form.type}</p>
              <p><strong>Category:</strong> {form.category}</p>
              <p><strong>Time Frame:</strong> {form.time_frame}</p>
              <p><strong>Required Tools:</strong> {form.required_tools}</p>
              <p><strong>Price:</strong> {form.price}</p>
              <p><strong>Location:</strong> {form.location}</p>
              <p><strong>Description:</strong> {form.description}</p>
            </div>

            <label className="text-sm text-gray-300">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="mr-2 accent-blue-500"
              />
              I confirm all details are accurate and agree to platform posting terms.
            </label>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Post Job
            </button>
          </div>
        )}

        <div className="flex justify-between pt-8 max-w-2xl mx-auto">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition"
            >
              Back
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostJob;
