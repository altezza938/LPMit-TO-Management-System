import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Shield, Key, CheckCircle, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
    const { state, updateCredentials } = useAppContext();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState(state.credentials?.username || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Verify current password
        if (currentPassword !== state.credentials?.passwordHash) {
            setError('Current password is incorrect.');
            return;
        }

        // Validate new credentials
        if (!newUsername.trim()) {
            setError('Username cannot be empty.');
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        const passwordToSave = newPassword || state.credentials.passwordHash;

        updateCredentials({
            username: newUsername.trim(),
            passwordHash: passwordToSave
        });

        setSuccess('Security settings updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your application configuration and security preferences.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-5 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Security & Authentication</h2>
                            <p className="text-sm text-gray-500">Update your login credentials here. Your data is saved locally.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">

                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border border-red-200">
                                <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border border-emerald-200">
                                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
                                {success}
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-xs mb-4">Verification Needed</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password *</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest text-xs mb-4">New Credentials</h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password <span className="text-gray-400 font-normal">(Leave blank to keep current)</span></label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>

                            {newPassword && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        required={!!newPassword}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={!currentPassword}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Key className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
