import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const allLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Jobs', path: '/jobs' },
  { name: 'Employerdashboard', path: '/employerdashboard', role: ['employer', 'admin'] },
  { name: 'Admin Dashboard', path: '/admindashboard', role: ['admin'] },
  { name: 'Report', path: '/report', role: ['admin'] },
  { name: 'Post a Job', path: '/post-job', role: ['employer', 'admin'] },
  { name: 'Profile', path: '/profile', auth: true },
  { name: 'Notifications', path: '/notifications', auth: true },
  { name: 'Login', path: '/login', guest: true },
  { name: 'Sign Up', path: '/signup', guest: true },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const onStorage = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Filter visible links based on login and role
  const linksToShow = allLinks.filter(link => {
    if (isLoggedIn && link.guest) return false;
    if (!isLoggedIn && link.auth) return false;
    if (link.role && (!role || !link.role.includes(role))) return false;
    return true;
  });

  return (
    <nav className="fixed top-0 w-full z-50 bg-black bg-opacity-80 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-white tracking-wide hover:scale-105 transition">
          <Link to="/">JobLink</Link>
        </div>

        <ul className="flex space-x-6">
          {linksToShow.map(link => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:text-blue-400 hover:scale-105
                  ${location.pathname === link.path
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-300'}`}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-red-500 transition duration-300"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
