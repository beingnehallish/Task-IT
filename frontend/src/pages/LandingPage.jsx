import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 style={{ color: 'aliceblue' }}>TASK-IT</h1>
      <button className="btn-primary" onClick={() => navigate('/login')}>
        Get Started
      </button>
      
      <p style={{ color: 'aliceblue' }}>● Task Allocation Meets Collaboration ●</p>
    </div>
  );
};

export default LandingPage;
