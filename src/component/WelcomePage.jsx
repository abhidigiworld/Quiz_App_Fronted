import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center text-center">
      {/* Logo */}
      <div className="mb-2">
        <img
          src="https://png.pngtree.com/png-vector/20230503/ourmid/pngtree-quiz-time-bubble-speech-banner-vector-design-png-image_7078139.png"
          alt="Logo"
          className="mx-auto mix-blend-*"
        />
      </div>

      {/* Welcome Text */}
      <h1 className="text-4xl text-blue-300 font-bold mb-2">Welcome</h1>
      <p className="text-blue-200 mb-8">Are you ready for a great experience?</p>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/signup')}
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 flex items-center space-x-2"
        >
          <span>Sign Up</span>
          <span>→</span>
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 flex items-center space-x-2"
        >
          <span>Log In</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
