import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
    const [attemptedTests, setAttemptedTests] = useState([]);
    const [expiredTests, setExpiredTests] = useState([]);
    const [allTests, setAllTests] = useState([]);
    const navigate=useNavigate();
    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get('http://localhost:2523/api/student-tests');
                const tests = response.data;
                const now = new Date();
                

                setAllTests(tests);

                // Filter attempted tests
                const attempted = tests.filter(test => test.isAttempted);
                setAttemptedTests(attempted);

                // Filter expired tests
                const expired = tests.filter(testItem => new Date(testItem.expiryTime) < now);
                setExpiredTests(expired);
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };

        fetchTests();
    }, []);

    const handleTestClick = (testId) => {
        navigate(`/test/${testId}`);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>

            {/* Attempted Tests Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Attempted Tests</h2>
                {attemptedTests.length > 0 ? (
                    <ul className="space-y-3">
                        {attemptedTests.map(test => (
                            <li key={test._id} className="border-b border-gray-200 pb-2 mb-2">
                                <span className="text-gray-800">{test.testName}</span>
                                <span className="ml-4 text-sm text-green-600">Attempted</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No tests attempted yet.</p>
                )}
            </div>

            {/* Expired Tests Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Expired Tests</h2>
                {expiredTests.length > 0 ? (
                    <ul className="space-y-3">
                        {expiredTests.map(test => (
                            <li key={test._id} className="border-b border-gray-200 pb-2 mb-2">
                                <span className="text-gray-800">{test.testName}</span>
                                <span className="ml-4 text-sm text-red-600">Expired</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No expired tests.</p>
                )}
            </div>

            {/* All Tests */}
            <div className="bg-white shadow-md rounded-lg p-6 mt-5">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Tests</h2>
                {allTests.length > 0 ? (
                    <ul className="space-y-3">
                        {allTests.map((testItem) => {
                            const isExpired = new Date(testItem.expiryTime) < new Date();
                            return (
                                <li
                                    key={testItem._id}
                                    className={`border-b border-gray-200 pb-2 mb-2 ${!isExpired ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                    onClick={!isExpired ? () => handleTestClick(testItem._id) : undefined}
                                >
                                    <span className="text-gray-800">{testItem.testName}</span>
                                    {isExpired && (
                                        <span className="ml-4 text-sm text-red-600">Expired</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-600">No tests available.</p>
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;
