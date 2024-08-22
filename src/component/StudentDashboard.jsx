import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function StudentDashboard() {
    const [attemptedTests, setAttemptedTests] = useState([]);
    const [expiredTests, setExpiredTests] = useState([]);
    const [allTests, setAllTests] = useState([]);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                // Fetch attempted tests
                const attemptedResponse = await axios.get('https://backend-quiz-app-qpdg.onrender.com/api/student-testss', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                // Store the attempted tests in state
                const attemptedTestsData = attemptedResponse.data.map(test => ({
                    id: test.testId,
                    name: test.testName,
                    score: test.score
                }));
                setAttemptedTests(attemptedTestsData);

                // Fetch all tests
                const allTestsResponse = await axios.get('https://backend-quiz-app-qpdg.onrender.com/api/student-tests', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                const tests = allTestsResponse.data;
                const now = new Date();
                setAllTests(tests);

                // Filter expired tests
                const expired = tests.filter(testItem => new Date(testItem.expiryTime) < now);
                setExpiredTests(expired);

                // Filter unattempted tests
                const unattemptedTests = tests.filter(testItem =>
                    !attemptedTestsData.some(attemptedTest => attemptedTest.name === testItem.testName)
                );
                setAllTests(unattemptedTests);

            } catch (error) {
                console.error('Error fetching tests:', error);
            } finally {
                setLoading(false); 
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
        <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
            <div className="bg-gray-800 w-full max-w-4xl p-8 rounded-lg shadow-lg animate-fadeIn">
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
                <div className="bg-gray-700 shadow-md rounded-lg p-6 mb-6 animate-slideIn">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4">Attempted Tests</h2>
                    {loading ? (
                        <Skeleton count={3} height={40} className='animate-pulse' />
                    ) : (
                        attemptedTests.length > 0 ? (
                            <div className="overflow-x-auto scroll-smooth">
                                <table className="w-full table-auto text-left text-gray-100">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="p-4">Test Name</th>
                                            <th className="p-4">Score</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attemptedTests.map((test) => (
                                            <tr key={test.name} className="border-b border-gray-600">
                                                <td className="p-4">{test.name}</td>
                                                <td className="p-4">{test.score}</td>
                                                <td className="p-4 text-green-400">Attempted</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-400">No tests attempted yet.</p>
                        )
                    )}
                </div>

                {/* Expired Tests Section */}
                <div className="bg-gray-700 shadow-md rounded-lg p-6 mb-6 animate-slideIn">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4">Expired Tests</h2>
                    {loading ? (
                        <Skeleton count={3} height={40} className='animate-pulse' />
                    ) : (
                        expiredTests.length > 0 ? (
                            <div className="overflow-x-auto scroll-smooth">
                                <table className="w-full table-auto text-left text-gray-100">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="p-4">Test Name</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expiredTests.map((test) => (
                                            <tr key={test._id} className="border-b border-gray-600">
                                                <td className="p-4">{test.testName}</td>
                                                <td className="p-4 text-red-400">Expired</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-400">No expired tests.</p>
                        )
                    )}
                </div>

                {/* Unattempted Tests Section */}
                <div className="bg-gray-700 shadow-md rounded-lg p-6 animate-slideIn">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4">Unattempted Tests</h2>
                    {loading ? (
                        <Skeleton count={3} height={40}  className='animate-pulse'/>
                    ) : (
                        allTests.length > 0 ? (
                            <div className="overflow-x-auto scroll-smooth">
                                <table className="w-full table-auto text-left text-gray-100">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="p-4">Test Name</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allTests.map((testItem) => {
                                            const isExpired = new Date(testItem.expiryTime) < new Date();
                                            return (
                                                <tr
                                                    key={testItem._id}
                                                    className={`border-b border-gray-600 ${!isExpired ? 'cursor-pointer hover:bg-gray-600' : ''}`}
                                                    onClick={!isExpired ? () => handleTestClick(testItem._id) : undefined}
                                                >
                                                    <td className="p-4">{testItem.testName}</td>
                                                    <td className="p-4">
                                                        {isExpired ? (
                                                            <span className="text-red-400">Expired</span>
                                                        ) : (
                                                            <span className="text-green-400">Available</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-400 animate-pulse'">No tests available.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
