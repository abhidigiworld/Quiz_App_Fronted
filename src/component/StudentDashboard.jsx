import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 

function StudentDashboard() {
    const [attemptedTests, setAttemptedTests] = useState([]);
    const [expiredTests, setExpiredTests] = useState([]);
    const [allTests, setAllTests] = useState([]);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get('https://backend-quiz-app-qpdg.onrender.com/api/student-testss', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
    
                // Store the attempted tests in state
                const attemptedTestsData = response.data.map(test => ({
                    id: test.testId,
                    name: test.testName,
                    score: test.score
                }));
                setAttemptedTests(attemptedTestsData);
    
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };
    
        fetchTests();
    }, []);
    
      useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get('https://backend-quiz-app-qpdg.onrender.com/api/student-tests', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                const tests = response.data;
                const now = new Date();
                setAllTests(tests);
                // Filter expired tests
                const expired = tests.filter(testItem => new Date(testItem.expiryTime) < now);
                setExpiredTests(expired);

                const unattemptedTests = tests.filter(testItem => !attemptedTests.includes(testItem.testName));
                setAllTests(unattemptedTests);
                console.log(unattemptedTests);
                
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };

        fetchTests();
    }, []);

    useEffect(() => {
        // Decode the token to get user information
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.name); 
            console.log(decodedToken);
            
        }
    }, []);

    const handleTestClick = (testId) => {
        navigate(`/test/${testId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <>
            <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
                <div className="bg-gray-800 w-full max-w-4xl p-8 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-100">Welcome, {userName}</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Attempted Tests Section */}
                    <div className="bg-gray-700 shadow-md rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Attempted Tests</h2>
                        {attemptedTests.length > 0 ? (
                            <ul className="space-y-3">
                                {attemptedTests.map(test => (
                                    <li key={test.name} className="border-b border-gray-600 pb-2 mb-2">
                                        <span className="text-gray-100 pr-2">{test.name}</span>
                                        <span className="text-gray-100"> Score :{test.score}</span>
                                        <span className="ml-4 text-sm text-green-400">Attempted</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No tests attempted yet.</p>
                        )}
                    </div>

                    {/* Expired Tests Section */}
                    <div className="bg-gray-700 shadow-md rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Expired Tests</h2>
                        {expiredTests.length > 0 ? (
                            <ul className="space-y-3">
                                {expiredTests.map(test => (
                                    <li key={test._id} className="border-b border-gray-600 pb-2 mb-2">
                                        <span className="text-gray-100">{test.testName}</span>
                                        <span className="ml-4 text-sm text-red-400">Expired</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No expired tests.</p>
                        )}
                    </div>

                    {/* All Tests */}
                    <div className="bg-gray-700 shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-100 mb-4">All Tests</h2>
                        {allTests.length > 0 ? (
                            <ul className="space-y-3">
                                {allTests.map((testItem) => {
                                    const isExpired = new Date(testItem.expiryTime) < new Date();
                                    return (
                                        <li
                                            key={testItem._id}
                                            className={`border-b border-gray-600 pb-2 mb-2 ${!isExpired ? 'cursor-pointer hover:bg-gray-600' : ''}`}
                                            onClick={!isExpired ? () => handleTestClick(testItem._id) : undefined}
                                        >
                                            <span className="text-gray-100">{testItem.testName}</span>
                                            {isExpired && (
                                                <span className="ml-4 text-sm text-red-400">Expired</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No tests available.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentDashboard;
