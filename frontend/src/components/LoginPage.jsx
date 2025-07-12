import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Login as {role}</h2>
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 rounded-l ${role === 'employee' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setRole('employee')}
        >
          Employee
        </button>
        <button
          className={`px-4 py-2 rounded-r ${role === 'supervisor' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setRole('supervisor')}
        >
          Supervisor
        </button>
      </div>
      <input
        type="email"
        placeholder="Email"
        className="mb-2 px-4 py-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="mb-4 px-4 py-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-green-500 px-6 py-2 rounded text-white">Login</button>
    </div>
  );
};

export default LoginPage;
