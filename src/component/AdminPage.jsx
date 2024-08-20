import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TestManagementPage from './TestManagementPage';


function AdminPage() {
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', password: '', userType: '' });
    const naviaget=useNavigate();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:2523/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleUpdateUser = (userId) => {
        const user = users.find(user => user._id === userId);
        setUpdatedUser({
            name: user.name,
            email: user.email,
            userType: user.userType 
        });
        setEditUserId(userId);
    };

    const handleSaveUpdate = async () => {
        if (window.confirm('Are you sure you want to update this user?')) {
            try {
                await axios.put(`http://localhost:2523/api/users/${editUserId}`, {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    userType: updatedUser.userType
                });
                setUsers(users.map(user =>
                    user._id === editUserId ? { ...user, ...updatedUser } : user
                ));
                setEditUserId(null);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };


    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:2523/api/users/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSetQuestions = () => {
        naviaget('/setquestion');
    };

    const handleViewResults = () => {
        console.log('Viewing user results');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Users</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b p-3 text-left">Name</th>
                            <th className="border-b p-3 text-left">Email</th>
                            <th className="border-b p-3 text-left">User Type</th>
                            <th className="border-b p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b">
                                <td className="p-3">
                                    {editUserId === user._id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={updatedUser.name}
                                            onChange={handleInputChange}
                                            className="w-full p-1 border rounded"
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td className="p-3">
                                    {editUserId === user._id ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={updatedUser.email}
                                            onChange={handleInputChange}
                                            className="w-full p-1 border rounded"
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="p-3">
                                    {editUserId === user._id ? (
                                        <select
                                            name="userType"
                                            value={updatedUser.userType}
                                            onChange={handleInputChange}
                                            className="w-full p-1 border rounded"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="User">User</option>
                                        </select>
                                    ) : (
                                        user.userType
                                    )}
                                </td>
                                <td className="p-3 flex space-x-2">
                                    {editUserId === user._id ? (
                                        <>
                                            <button
                                                onClick={handleSaveUpdate}
                                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-300"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditUserId(null)}
                                                className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 transition duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleUpdateUser(user._id)}
                                                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Test Management</h2>
                <TestManagementPage/>
                <button
                    onClick={handleSetQuestions}
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Set Test Questions
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">View User Results</h2>
                <button
                    onClick={handleViewResults}
                    className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
                >
                    View Results
                </button>
            </div>
        </div>
    );
}

export default AdminPage;
