import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import JobListings from './pages/JobListings';
import PostJob from './pages/PostJob';
import Footer from './components/Footer';

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
         
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
