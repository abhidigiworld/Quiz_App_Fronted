import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestManagementPage() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get('https://backend-quiz-app-qpdg.onrender.com/api/tests');
                setTests(response.data);
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };

        fetchTests();
    }, []);

    const handleDeleteTest = async (testId) => {
        if (window.confirm('Are you sure you want to delete this test?')) {
            try {
                await axios.delete(`https://backend-quiz-app-qpdg.onrender.com/api/tests/${testId}`);
                setTests(tests.filter(test => test._id !== testId));
            } catch (error) {
                console.error('Error deleting test:', error);
            }
        }
    };

    return (
        <>
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 text-left">
                <h2 className="text-2xl font-semibold text-white mb-4">Manage Tests</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b border-gray-600 p-3 text-left text-white">Test Name</th>
                            <th className="border-b border-gray-600 p-3 text-left text-white">Expiry Date & Time</th>
                            <th className="border-b border-gray-600 p-3 text-left text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map(test => (
                            <tr key={test._id} className="border-b border-gray-600">
                                <td className="p-3 text-white">{test.testName}</td>
                                <td className="p-3 text-white">{new Date(test.expiryTime).toLocaleString()}</td>
                                <td className="p-3 flex space-x-2">
                                    <button
                                        onClick={() => handleDeleteTest(test._id)}
                                        className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-purple-700 transition duration-300"
                                    >
                                        Delete Test
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default TestManagementPage;
