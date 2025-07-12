import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      alert(res.data.message);
      if (role === 'employee') navigate('/employee-dashboard');
      else navigate('/supervisor-dashboard');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h2>Login as {role}</h2>
        <div className="toggle-container">
          <button className={`btn-toggle ${role === 'employee' ? 'active' : ''}`} onClick={() => setRole('employee')}>Employee</button>
          <button className={`btn-toggle ${role === 'supervisor' ? 'active' : ''}`} onClick={() => setRole('supervisor')}>Supervisor</button>
        </div>
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-primary" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
