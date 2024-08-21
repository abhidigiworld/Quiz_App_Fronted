import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function TestResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { score } = location.state;
    useEffect(
        () => {
            setTimeout(
                () => {
                    navigate('/student');
                },
                10000

            )
        },
        [score]
    )
    return (
        <>
            <div className="p-6 bg-gradient-to-b from-gray-700 to-gray-900 min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 quicksand-uniqueName">Test Results</h1>
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-4 quicksand-uniqueName">Your Score</h2>
                    <p className="text-gray-900 text-5xl font-bold mb-6 quicksand-uniqueName">{score}</p>
                    <p className="text-gray-700 text-lg quicksand-uniqueName">
                        You will receive your score via email shortly.
                    </p>
                </div>
            </div>
        </>
    );
}

export default TestResultPage;
