import React, { useState, useEffect } from 'react';
import { API_URL } from '../../api';
function Team() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        role: 'Claims Adjuster',
        status: 'Active'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch team data on component mount
    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = () => {
        setIsLoading(true);
        setError(null);

        try {
            const claimsUser = localStorage.getItem('claimsEngineUser');
            if (!claimsUser) {
                throw new Error('User data not found in local storage');
            }

            const parsedUser = JSON.parse(claimsUser);
            const adminEmail = parsedUser;

            fetch(`${API_URL}/teamData?adminEmail=${encodeURIComponent(adminEmail)}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`API error: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    setTeamMembers(data.team || []);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching team:', err);
                    setError('Failed to load team data. Please try again.');
                    setIsLoading(false);
                });
        } catch (err) {
            console.error('Error preparing request:', err);
            setError('Failed to prepare request. Please check your login status.');
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMember({ ...newMember, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const claimsUser = localStorage.getItem('claimsEngineUser');
            if (!claimsUser) {
                throw new Error('User data not found in local storage');
            }

            const parsedUser = JSON.parse(claimsUser);
            const adminEmail = parsedUser;

            // Structure the request body according to backend expectations
            const requestBody = {
                adminEmail: adminEmail,
                memberData: {
                    ...newMember,
                    id: Date.now() // Adding a temporary ID for new members
                }
            };

            // Send POST request to add/update team member
            fetch(`${API_URL}/team`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`API error: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    // Update team members with the returned team array
                    setTeamMembers(data.team);

                    // Reset form
                    setNewMember({
                        name: '',
                        email: '',
                        role: 'Claims Adjuster',
                        status: 'Active'
                    });
                    setShowForm(false);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Error adding/updating team member:', err);
                    setError('Failed to add/update team member. Please try again.');
                    setIsLoading(false);
                });
        } catch (err) {
            console.error('Error preparing request:', err);
            setError('Failed to prepare request. Please check your login status.');
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setNewMember({
            name: '',
            email: '',
            role: 'Claims Adjuster',
            status: 'Active'
        });
    };

    // Function to handle member deletion
    const handleDelete = (memberId) => {
        if (window.confirm('Are you sure you want to delete this team member?')) {
            setIsLoading(true);

            try {
                const claimsUser = localStorage.getItem('claimsEngineUser');
                if (!claimsUser) {
                    throw new Error('User data not found in local storage');
                }

                const parsedUser = JSON.parse(claimsUser);
                const adminEmail = parsedUser.email;

                fetch(`https://claims-engine-backend-1.onrender.com/api/teamData?id=${memberId}&adminEmail=${encodeURIComponent(adminEmail)}`, {
                    method: 'DELETE',
                })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`API error: ${res.status}`);
                        }
                        return res.json();
                    })
                    .then(data => {
                        fetchTeamData();
                        setIsLoading(false);
                    })
                    .catch(err => {
                        console.error('Error deleting team member:', err);
                        setError('Failed to delete team member. Please try again.');
                        setIsLoading(false);
                    });
            } catch (err) {
                console.error('Error preparing delete request:', err);
                setError('Failed to prepare delete request. Please check your login status.');
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Team Management</h1>
                <p className="text-gray-600 mt-1">Manage your team members and assign roles</p>
            </div>

            {/* Error display */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            )}

            {/* Team Members List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                        onClick={() => setShowForm(true)}
                        disabled={isLoading}
                    >
                        <i className="fas fa-plus"></i> Add Team Member
                    </button>
                </div>

                {showForm && (
                    <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                                <h3 className="font-medium">Add New Team Member</h3>
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={newMember.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter full name"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={newMember.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter email address"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        id="role"
                                        name="role"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={newMember.role}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    >
                                        <option value="Claims Adjuster">Claims Adjuster</option>
                                        <option value="Administrator">Administrator</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Support">Support</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={newMember.status}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {isLoading && !showForm ? (
                    <div className="flex justify-center py-8">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {teamMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-500">
                                            No team members found
                                        </td>
                                    </tr>
                                ) : (
                                    teamMembers.map((member) => (
                                        <tr key={member.id}>
                                            <td className="py-3 px-4 text-sm">{member.name}</td>
                                            <td className="py-3 px-4 text-sm">{member.email}</td>
                                            <td className="py-3 px-4 text-sm">{member.role}</td>
                                            <td className="py-3 px-4 text-sm">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${member.status === 'Active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : member.status === 'Inactive'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {member.status}
                                                </span>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {teamMembers.length > 0 && (
                    <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
                        <span>Showing 1 to {teamMembers.length} of {teamMembers.length} results</span>
                        <div className="flex gap-2">
                            <button disabled className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-400">
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center border border-blue-600 rounded bg-blue-600 text-white">
                                1
                            </button>
                            <button disabled className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-400">
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Team;