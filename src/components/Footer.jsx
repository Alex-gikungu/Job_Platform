import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscriptionStatus('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setSubscriptionStatus(''), 3000);
    } else {
      setSubscriptionStatus('Please enter a valid email.');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">JobConnect</h2>
          <p className="text-sm leading-relaxed">
            Connecting job seekers and employers in Kiambu County with local, temporary, and part-time opportunities.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/jobs" className="hover:text-blue-400 transition">Browse Jobs</a></li>
            <li><a href="/post-job" className="hover:text-blue-400 transition">Post a Job</a></li>
            <li><a href="/about" className="hover:text-blue-400 transition">About Us</a></li>
            <li><a href="/faq" className="hover:text-blue-400 transition">FAQ</a></li>
            <li><a href="/contact" className="hover:text-blue-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <MapPin size={18} /><span>Kiambu Road, Nairobi</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={18} /><span>+254 700 765 876</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={18} /><span>support@jobconnect.co.ke</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
          <p className="text-sm mb-4">Get the latest jobs in your inbox.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
            <input
              type="email"
              className="px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition"
            >
              Subscribe
            </button>
            {subscriptionStatus && (
              <p className={`text-sm ${subscriptionStatus.includes('Thank') ? 'text-green-400' : 'text-red-400'}`}>
                {subscriptionStatus}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Social + Bottom */}
      <div className="border-t border-gray-700 pt-8 text-sm text-center">
        <div className="mb-4 flex justify-center space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition" aria-label="Facebook">
            <Facebook size={22} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition" aria-label="Twitter">
            <Twitter size={22} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition" aria-label="Instagram">
            <Instagram size={22} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="GitHub">
            <Github size={22} />
          </a>
        </div>
        <p>© 2025 JobConnect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
