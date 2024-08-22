import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-gray-900 flex flex-col items-center justify-center text-center">
  {/* Overlay to adjust gradient and gray background */}
  <div className="absolute inset-0 bg-gray-900 opacity-60 z-0"></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center">
    {/* Logo */}
    <div className="mb-4">
      <img
        src="https://png.pngtree.com/png-vector/20230503/ourmid/pngtree-quiz-time-bubble-speech-banner-vector-design-png-image_7078139.png"
        alt="Logo"
        className="mx-auto w-24 h-24 animate-bounce"
      />
    </div>

    {/* Welcome Text */}
    <h1 className="text-5xl text-gray-100 font-extrabold mb-4">Welcome</h1>
    <p className="text-gray-300 mb-8 text-lg">Are you ready for a great experience?</p>

    {/* Buttons */}
    <div className="flex space-x-4">
      <button
        onClick={() => navigate('/signup')}
        className="bg-gradient-to-r from-purple-600 to-purple-400 text-white py-2 px-6 rounded-full hover:from-purple-500 hover:to-purple-300 flex items-center space-x-2 transition duration-300"
      >
        <span>Sign Up</span>
        <span>→</span>
      </button>
      <button
        onClick={() => navigate('/login')}
        className="bg-gradient-to-r from-purple-600 to-purple-400 text-white py-2 px-6 rounded-full hover:from-purple-500 hover:to-purple-300 flex items-center space-x-2 transition duration-300"
      >
        <span>Log In</span>
        <span>→</span>
      </button>
    </div>
  </div>
</div>


    </>
  );
};

export default WelcomePage;
