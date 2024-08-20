import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('Invalid email address.');
      return;
    }

    setError('');

    try {
      const response = await axios.post('https://backend-quiz-app-qpdg.onrender.com/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        if (user.userType === 'Admin') {
          navigate('/admin');
        } else if (user.userType === 'User') {
          navigate('/student');
        } else {
          alert('Unidentified user detected');
          navigate('/login');
        }
      }
    } catch (err) {
      console.error('Error during login:', err);
      if (err.response && err.response.status === 400) {
        setError('Invalid email or passwords.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition duration-300"
            >
              Login
            </button>
          </form>
          <div className="mt-5 text-center">
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-500 font-semibold underline"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>

    </>
  );
};

export default Login;
