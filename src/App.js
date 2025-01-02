import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/UserDashboard';
import Welcome from './components/Welcome.js';
import AcknowledgementPage from './components/AcknowledgementPage.js';

const PrivateRoute =({ element: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? <Component {...rest} />:<Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
        <Route path="/acknowledgementpage" element={<AcknowledgementPage />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
