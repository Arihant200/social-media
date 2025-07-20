// src/auth/Register.jsx
import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', {
  username: form.username,
  password: form.password,
});
      navigate('/login');
    } catch (err) {
      alert(err.response.data.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-xl mb-4 text-center font-bold">Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
        />
        <button className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">Register</button>
      </form>
    </div>
  );
};

export default Register;
