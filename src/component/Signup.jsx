import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post('https://backend-quiz-app-qpdg.onrender.com/signup', {
        name,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        alert("SignUp successful");
        navigate('/login');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Error during signup:', err);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign Up</h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-500 font-semibold underline"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>

    </>
  );
};

export default Signup;
