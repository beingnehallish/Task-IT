import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
    </Routes>
  </BrowserRouter>
);

export default App;
