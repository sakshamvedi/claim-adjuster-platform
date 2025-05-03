import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock, FileText, AlertCircle, PhoneCall, Mail, MapPin, Users } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../../api.js';
import { Toaster, toast } from 'react-hot-toast';


function Claim() {
    const location = useLocation();
    const navigate = useNavigate();
    const claimData = location.state;
    const [team, setTeam] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTeamMember, setSelectedTeamMember] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch team data and current user
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

            const parsedUser = claimsUser;
            setCurrentUser(parsedUser);
            const adminEmail = parsedUser;

            fetch(`${API_URL}/teamData?adminEmail=${encodeURIComponent(adminEmail)}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`API error: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    console.log(data);
                    setTeam(data.team || []);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.log('Error fetching team:', err);
                    setTeam([]);
                    setError('Failed to load team data. Please try again.');
                    setIsLoading(false);
                });
        } catch (err) {
            console.error('Error preparing request:', err);
            setError('Failed to prepare request. Please check your login status.');
            setIsLoading(false);
        }
    };

    const assignTeamMember = async () => {


        try {
            const assignedPerson = team.find(t => t._id === selectedTeamMember);

            if (!assignedPerson) {
                console.error('Team member not found');
                return;
            }

            await axios.post(`${API_URL}/assign-to-user`, {
                "claimId": claimData.id,
                "assignedUnder": assignedPerson.email
            });

            // Update local state
            const updatedClaimData = {
                ...claimData,
                assignedTo: assignedPerson.name
            };

            // Close modal and update UI
            setShowAssignModal(false);
            // Update the location state with new claim data
            toast.success('Claim assigned to team member successfully');
            navigate(location.pathname, { state: updatedClaimData, replace: true });

        } catch (err) {
            console.error('Error assigning team member:', err);
            toast.error('Error assigning team member');
        }
    };

    // If no claim data was passed, show a message and provide a way to go back
    if (!claimData) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                No claim data found. Please select a claim from the dashboard.
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    // Status badge styles based on the current status
    const getStatusStyles = () => {
        switch ((claimData.status || '').toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'in review':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Add this JSX for the team assignment modal
    const AssignmentModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Assign Claim to Team Member</h3>
                <select
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={selectedTeamMember}
                    onChange={(e) => setSelectedTeamMember(e.target.value)}
                >
                    <option value="">Select a team member</option>
                    {team.map(member => (
                        <option key={member._id} value={member._id}>
                            {member.name}
                        </option>
                    ))}
                </select>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded-md"
                        onClick={() => setShowAssignModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={assignTeamMember}
                        disabled={!selectedTeamMember}
                    >
                        Assign
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back button */}
            <button
                onClick={() => navigate('/')}
                className="mb-6 flex items-center text-blue-500 hover:text-blue-600"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </button>

            {/* Claim header */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Claim #{claimData.id}
                    </h1>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyles()}`}>
                        {claimData.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">
                            {new Date(claimData.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Priority:</span>
                        <span className="font-medium">{claimData.priority || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Claimant details */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Claimant Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 mt-0.5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium">{claimData.name}</p>
                        </div>
                    </div>

                    {claimData.phone && (
                        <div className="flex items-start gap-2">
                            <PhoneCall className="h-5 w-5 mt-0.5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-medium">{claimData.phone}</p>
                            </div>
                        </div>
                    )}

                    {claimData.email && (
                        <div className="flex items-start gap-2">
                            <Mail className="h-5 w-5 mt-0.5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium">{claimData.email}</p>
                            </div>
                        </div>
                    )}

                    {claimData.address && (
                        <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 mt-0.5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-600">Address</p>
                                <p className="font-medium">
                                    {claimData.address}{claimData.zip ? `, ${claimData.zip}` : ''}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Claim description */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Claim Description</h2>
                <p className="text-gray-700">
                    {claimData.description || 'No description provided.'}
                </p>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="flex flex-wrap gap-3">

                    <button
                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors flex items-center gap-1"
                        onClick={() => setShowAssignModal(true)}
                    >
                        <Users className="h-4 w-4" />
                        Assign to Team Member
                    </button>
                </div>
            </div>

            {/* Display assigned person if available */}
            {claimData.assignedTo && (
                <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignment</h2>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-600">Assigned to:</span>
                        <span className="font-medium">{claimData.assignedTo}</span>
                    </div>
                </div>
            )}

            {/* Render modal when needed */}
            {showAssignModal && <AssignmentModal />}

            <Toaster />

        </div>
    )
}

export default Claim