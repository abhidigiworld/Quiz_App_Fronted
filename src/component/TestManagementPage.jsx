import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestManagementPage() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get('http://localhost:2523/api/tests');
                setTests(response.data);
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };

        fetchTests();
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Test Management</h2>
           {/* Display the list of tests */}
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="border-b-2 border-gray-200 p-3 text-gray-700">Test Name</th>
                        <th className="border-b-2 border-gray-200 p-3 text-gray-700">Expiry Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    {tests.map(test => (
                        <tr key={test._id}>
                            <td className="border-b border-gray-200 p-3">{test.testName}</td>
                            <td className="border-b border-gray-200 p-3">
                                {new Date(test.expiryTime).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TestManagementPage;
