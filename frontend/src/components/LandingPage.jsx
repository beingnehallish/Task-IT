import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-5xl font-bold mb-8">TASK-IT</h1>
      <button
        onClick={() => navigate('/login')}
        className="bg-blue-500 px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
