import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode} from 'jwt-decode'; // Import jwt-decode

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', password: '', userType: '' });
    const [tests, setTests] = useState([]);
    const [userName, setUserName] = useState(''); // State to hold the user's name
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch users and tests data
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:2523/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchTests = async () => {
            try {
                const response = await axios.get('http://localhost:2523/api/tests');
                setTests(response.data);
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };

        fetchUsers();
        fetchTests();
    }, []);

    useEffect(() => {
        // Decode the token to get user information
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.name || 'Admin'); // Set user's name or default to 'Admin'
        }
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
        navigate('/setquestion');
    };

    const handleViewResults = () => {
        console.log('Viewing user results');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Clear JWT token from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Welcome, Master {userName}</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">All Users</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b border-gray-600 p-3 text-left text-white">Name</th>
                                <th className="border-b border-gray-600 p-3 text-left text-white">Email</th>
                                <th className="border-b border-gray-600 p-3 text-left text-white">User Type</th>
                                <th className="border-b border-gray-600 p-3 text-left text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b border-gray-600">
                                    <td className="p-3 text-white">
                                        {editUserId === user._id ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={updatedUser.name}
                                                onChange={handleInputChange}
                                                className="w-full p-1 border border-gray-600 rounded bg-gray-700 text-white"
                                            />
                                        ) : (
                                            user.name
                                        )}
                                    </td>
                                    <td className="p-3 text-white">
                                        {editUserId === user._id ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={updatedUser.email}
                                                onChange={handleInputChange}
                                                className="w-full p-1 border border-gray-600 rounded bg-gray-700 text-white"
                                            />
                                        ) : (
                                            user.email
                                        )}
                                    </td>
                                    <td className="p-3 text-white">
                                        {editUserId === user._id ? (
                                            <select
                                                name="userType"
                                                value={updatedUser.userType}
                                                onChange={handleInputChange}
                                                className="w-full p-1 border border-gray-600 rounded bg-gray-700 text-white"
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
                                                    className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-purple-700 transition duration-300"
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

                <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 text-right">
                    <h2 className="text-2xl font-semibold text-white mb-4">Test Management</h2>
                    <button
                        onClick={handleSetQuestions}
                        className="bg-purple-600 text-white py-2 px-3 rounded hover:bg-purple-700 transition duration-300"
                    >
                        Set New MCQ Test
                    </button>
                </div>

                <div className="bg-gray-800 shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">View User Results</h2>
                    <button
                        onClick={handleViewResults}
                        className="bg-purple-600 text-white py-2 px-3 rounded hover:bg-purple-700 transition duration-300"
                    >
                        View Results
                    </button>
                </div>
            </div>
        </>
    );
}

export default AdminPage;
