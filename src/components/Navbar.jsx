import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/navbar.css"; // Make sure the file is correctly named

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Jobs ', path: '/jobs' },
  { name: 'Post a Job', path: '/post-job' },
  { name: 'Login', path: '/login' },
  { name: 'Sign Up', path: '/signup' },
 
];

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">JobLink</Link>
        </div>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link to={link.path} className="nav-item">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
