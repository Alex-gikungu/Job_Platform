import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin } from 'lucide-react';
import '../styles/footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate newsletter subscription (replace with actual API call)
      setSubscriptionStatus('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setSubscriptionStatus(''), 3000);
    } else {
      setSubscriptionStatus('Please enter a valid email.');
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2 className="footer-logo">JobConnect</h2>
          <p className="footer-description">
            Connecting job seekers and employers in Kiambu County with local, temporary, and part-time opportunities.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-links">
          <h4 className="footer-section-title">Quick Links</h4>
          <ul>
            <li><a href="/jobs">Browse Jobs</a></li>
            <li><a href="/post-job">Post a Job</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-contact">
          <h4 className="footer-section-title">Contact Us</h4>
          <ul>
            <li>
              <MapPin size={20} />
              <span>Kiambu Road, Nairobi, Kenya</span>
            </li>
            <li>
              <Phone size={20} />
              <span>+254 700 123 456</span>
            </li>
            <li>
              <Mail size={20} />
              <span>support@jobconnect.co.ke</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription Section */}
        <div className="footer-newsletter">
          <h4 className="footer-section-title">Stay Updated</h4>
          <p className="newsletter-description">
            Subscribe to get the latest job opportunities in your inbox.
          </p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
          {subscriptionStatus && (
            <p className={`subscription-status ${subscriptionStatus.includes('Thank') ? 'success' : 'error'}`}>
              {subscriptionStatus}
            </p>
          )}
        </div>
      </div>

      {/* Social Media Section */}
      <div className="footer-social">
        <h4 className="footer-section-title">Follow Us</h4>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram size={24} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={24} />
          </a>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="footer-bottom">
        <p>© 2025 JobConnect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;