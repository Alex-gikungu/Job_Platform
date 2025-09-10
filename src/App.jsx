import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import JobListings from './pages/JobListings';
import PostJob from './pages/PostJob';
import Footer from './components/Footer';
import About from './pages/About';
import Chatbot from './components/Chatbot';
import UserProfile from './pages/UserProfile';
import EmployerDashboard from './pages/EmployerDashboard';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import ReportPage from './pages/ReportPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/jobs" element={<JobListings />} />
  <Route path="/post-job" element={<PostJob />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signUp" element={<SignUp />} />
  <Route path="/about" element={<About />} />
  <Route path="/profile" element={<UserProfile />} />
  <Route path="/employerdashboard" element={<EmployerDashboard />} />
  <Route path="/notifications" element={<Notifications />} />
  <Route path="/admindashboard" element={<AdminDashboard />} /> 
  <Route path="/report" element={<ReportPage />} />

</Routes>

      </div>

      <Chatbot />
      <Footer />
    </Router>
  );
};

export default App;
