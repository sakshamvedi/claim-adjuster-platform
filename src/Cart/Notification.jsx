import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../api';

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [claimsData, setClaimsData] = useState({});
    const [loading, setLoading] = useState(true);

    // Get user data from localStorage
    const claimsUser = localStorage.getItem('claimsEngineUserWholeData');
    const parsedUser = claimsUser ? JSON.parse(claimsUser) : null;

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            if (!parsedUser || !parsedUser._id) {
                console.error("User data not available");
                setLoading(false);
                return;
            }

            const userId = parsedUser._id;
            const response = await axios.get(`${API_URL}/get-notifications/${userId}`);

            setNotifications(response.data);
            console.log(response.data);
            const notificationFiltered = response.data.filter(notification => notification.status == "pending");
            console.log(notificationFiltered);
            setNotifications(notificationFiltered);

            // Fetch details for each claim
            const claimsDetailsObj = {};
            for (const notification of response.data) {
                if (notification.claimId) {
                    try {
                        const claimResponse = await axios.get(`${API_URL}/getclaims/${notification.claimId}`);
                        claimsDetailsObj[notification.claimId] = claimResponse.data;
                    } catch (err) {
                        console.error(`Failed to fetch claim ${notification.claimId}:`, err);
                    }
                }
            }

            setClaimsData(claimsDetailsObj);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setLoading(false);
        }
    };

    const handleAccept = async (notificationId, claimId) => {
        try {
            // API call to accept the claim
            setLoading(true);
            await axios.put(`${API_URL}/update-notification/${notificationId}`, {
                status: 'approved'
            });

            // Mark notification as read
            await axios.put(`${API_URL}/update-claim-status/${claimId}`, {
                status: 'assigned'
            });

            const body = {
                "email": claimsData[claimId].email,
                "name": claimsData[claimId].name,
                "assignedTo": claimsData[claimId].assignedTo,
                "claimNumber": claimsData[claimId]._id,
                "claimDescription": claimsData[claimId].description,
            }

            await axios.post(`${API_URL}/send-mail`, body);
            console.log(body);

            // Refresh notifications
            setLoading(false);
            fetchNotifications();
        } catch (error) {

            console.error("Error accepting claim:", error);
        }
    };

    const handleDiscard = async (notificationId, claimId) => {
        try {
            setLoading(true);
            await axios.put(`${API_URL}/update-notification/${notificationId}`, {
                status: 'declined'
            });

            await axios.put(`${API_URL}/update-claim-status/${claimId}`, {
                status: 'new'
            });

            // Refresh notifications
            setLoading(false);
            fetchNotifications();
        } catch (error) {
            console.error("Error discarding claim:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>

            {notifications.length === 0 ? (
                <div className="text-gray-500 text-center py-10">No notifications found</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                        <thead className="bg-gray-100">
                            <tr>

                                <th className="py-3 px-4 text-left font-medium text-gray-600">Claim Details</th>
                                <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
                                <th className="py-3 px-4 text-left font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {notifications.map((notification) => {
                                const claim = claimsData[notification.claimId];

                                return (
                                    <tr key={notification._id} className="hover:bg-gray-50">

                                        <td className="py-3 px-4">
                                            {claim ? (
                                                <div className="space-y-1">
                                                    <div><span className="font-medium">Name:</span> {claim.name}</div>
                                                    <div><span className="font-medium">Address:</span> {claim.address}</div>
                                                    <div><span className="font-medium">Zipcode:</span> {claim.zipcode}</div>
                                                    <div><span className="font-medium">Description:</span> {claim.description}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Loading claim details...</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {claim && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${claim.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                                                    claim.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {claim.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleAccept(notification._id, notification.claimId)}
                                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleDiscard(notification._id, notification.claimId)}
                                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                                >
                                                    Discard
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Notification;