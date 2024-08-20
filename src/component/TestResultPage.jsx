import React from 'react';
import { useLocation } from 'react-router-dom';

function TestResultPage() {
    const location = useLocation();
    const { score } = location.state; 

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Test Results</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Score</h2>
                <p className="text-gray-800 text-4xl">{score}</p>
            </div>
        </div>
    );
}

export default TestResultPage;
