import React, { useState, useEffect } from 'react';
import { updateUserAttributes, updatePassword, fetchUserAttributes } from 'aws-amplify/auth';

const UserInfoPopup = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userAttributes = await fetchUserAttributes();
                if (userAttributes) {
                    setUsername(userAttributes.name || 'Unknown');
                    setEmail(userAttributes.email || 'No email available');
                } else {
                    setError('User details are not available');
                }
            } catch (error) {
                setError('Error fetching user information: ' + error.message);
            }
        };

        fetchUserInfo();
    }, []);

    const handleUpdateEmail = async () => {
        try {
            const user = await updateUserAttributes(user, { email: newEmail });
            setMessage('Email updated successfully');
            setEmail(newEmail);
            setIsEditingEmail(false);
        } catch (error) {
            setError('Error updating email: ' + error.message);
        }
    };

    const handleUpdateUsername = async () => {
        try {
            await updateUserAttributes({
                userAttributes: {
                    name: newUsername,
                },
            });
            setMessage('Username updated successfully');
            setUsername(newUsername);
            setIsEditingUsername(false);
        } catch (error) {
            setError('Error updating username: ' + error.message);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            await updatePassword({ oldPassword, newPassword });
            setMessage('Password updated successfully');
            setOldPassword('');
            setNewPassword('');
        } catch (error) {
            setError('Error updating password: ' + error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-[#111111] rounded-lg p-6 w-full max-w-md text-white">
                <button
                    onClick={onClose}
                    className="text-white float-right text-2xl mb-4 focus:outline-none hover:text-gray-300 transition-colors duration-200"
                >
                    ×
                </button>
                <h2 className="text-2xl font-semibold mb-4">User Information</h2>
                {error && <p className="text-red-500">{error}</p>}
                {message && <p className="text-green-500">{message}</p>}

                <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                    {isEditingEmail ? (
                        <>
                            <input
                                className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                                type="email"
                                placeholder="New Email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <button
                                onClick={handleUpdateEmail}
                                className="w-full mb-2 text-center px-4 py-4 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-[#0a174a] focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Save Email
                            </button>
                            <button
                                onClick={() => setIsEditingEmail(false)}
                                className="w-full px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-lg">{email}</p>
                            <button
                                onClick={() => {
                                    setNewEmail(email);
                                    setIsEditingEmail(true);
                                }}
                                className="w-full mt-6 text-center px-4 py-4 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-[#0a174a] focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Edit Email
                            </button>
                        </>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Username</label>
                    {isEditingUsername ? (
                        <>
                            <input
                                className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                                type="text"
                                placeholder="New Username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                            <button
                                onClick={handleUpdateUsername}
                                className="w-full mb-2 text-center px-4 py-4 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-[#0a174a] focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Save Username
                            </button>
                            <button
                                onClick={() => setIsEditingUsername(false)}
                                className="w-full px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-lg">{username}</p>
                            <button
                                onClick={() => {
                                    setNewUsername(username);
                                    setIsEditingUsername(true);
                                }}
                                className="w-full mt-6 text-center px-4 py-4 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-[#0a174a] focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Edit Username
                            </button>
                        </>
                    )}
                </div>
                <div>
                    <h1 className='mt-8 mb-3 text-xl'>Update Password</h1>
                    {/* Old Password Input */}
                    <div>
                        <input
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                            type="password"
                            placeholder="Current Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    {/* New Password Input */}
                    <div className="mb-4">
                        <input
                            className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 bg-black text-white mb-4"
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleUpdatePassword}
                        className="w-full text-center px-4 py-4 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-[#0a174a] focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserInfoPopup;
