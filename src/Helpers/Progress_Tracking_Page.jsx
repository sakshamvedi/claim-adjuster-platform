import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, ThumbsUp, Calendar, Phone, Mail, User, MapPin, FileText, CheckCheck } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../api.js';

function Progress_Tracking_Page() {
    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        async function getClaimsById() {
            try {
                const id = window.location.pathname.split('/').pop();
                const response = await axios.get(`${API_URL}/getclaims/${id}`);
                setClaim(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching claim data:", error);
                setLoading(false);
            }
        }
        getClaimsById();
    }, []);

    const getStatusStep = (status) => {
        const steps = ['submitted', 'assigned', 'in_progress', 'resolved'];
        return steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-yellow-600';
            case 'low': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'submitted': return <Clock className="w-5 h-5 text-green-500" />;
            case 'assigned': return <User className="w-5 h-5 text-purple-500" />;
            case 'in_progress': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'resolved': return <CheckCheck className="w-5 h-5 text-green-500" />;
            default: return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const renderTab = () => {
        if (!claim) return null;

        if (activeTab === 'overview') {
            return (
                <div className="bg-white rounded-lg p-2">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Claim Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all bg-white">
                            <h3 className="text-lg font-medium mb-4 text-gray-800">Claim Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <FileText className="w-5 h-5 mr-3 text-green-500 mt-1" />
                                    <div>
                                        <span className="font-medium text-gray-700 block">Description</span>
                                        <span className="text-gray-600">{claim.description}</span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Calendar className="w-5 h-5 mr-3 text-green-500 mt-1" />
                                    <div>
                                        <span className="font-medium text-gray-700 block">Created</span>
                                        <span className="text-gray-600">{formatDate(claim.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Calendar className="w-5 h-5 mr-3 text-green-500 mt-1" />
                                    <div>
                                        <span className="font-medium text-gray-700 block">Updated</span>
                                        <span className="text-gray-600">{formatDate(claim.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all bg-white">
                            <h3 className="text-lg font-medium mb-4 text-gray-800">Assignment Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <User className="w-5 h-5 mr-3 text-green-500 mt-1" />
                                    <div>
                                        <span className="font-medium text-gray-700 block">Accepted By</span>
                                        <span className="text-green-600">{claim.assignedTo || 'Not assigned'}</span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <User className="w-5 h-5 mr-3 text-green-500 mt-1" />
                                    <div>
                                        <span className="font-medium text-gray-700 block">Public Adjuster Mail</span>
                                        <span className="text-green-600">{claim.assignedUnder || 'Not assigned'}</span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <AlertTriangle className="w-5 h-5 mr-3 text-green-500 mt-1" />
                                    <div>
                                        <span className="font-medium text-gray-700 block">Priority</span>
                                        <span className={`capitalize font-medium ${getPriorityColor(claim.priority)}`}>
                                            {claim.priority}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="mr-3 mt-1">{getStatusIcon(claim.status)}</div>
                                    <div>
                                        <span className="font-medium text-gray-700 block">Status</span>
                                        <span className="capitalize">{claim.status.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (activeTab === 'contact') {
            return (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <User className="w-5 h-5 mr-2 text-gray-500" />
                            <span className=" ">Name:</span>
                            <span className="ml-2">{claim.name}</span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-gray-500" />
                            <span className=" ">Email:</span>
                            <span className="ml-2">{claim.email}</span>
                        </div>
                        <div className="flex items-center">
                            <Phone className="w-5 h-5 mr-2 text-gray-500" />
                            <span className=" ">Phone:</span>
                            <span className="ml-2">{claim.phone}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                            <span className=" ">Address:</span>
                            <span className="ml-2">{claim.address}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                            <span className=" ">Zipcode:</span>
                            <span className="ml-2">{claim.zipcode}</span>
                        </div>
                    </div>
                </div>
            );
        } else if (activeTab === 'timeline') {
            return (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Claim Timeline</h2>
                    <div className="py-2">
                        <div className="relative">
                            {/* Timeline vertical line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-100 to-green-500 rounded-full"></div>

                            {/* Submitted */}
                            <div className="relative pl-10 pb-10">
                                <div className="absolute left-[-10px] w-[20px] h-[20px] rounded-full bg-green-500 border-4 border-green-100 shadow-md flex items-center justify-center z-10">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">Claim Submitted</h3>
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-3 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {formatDate(claim.createdAt)}
                                    </div>
                                    <p className="text-gray-700">
                                        Claim was submitted by <span className="font-medium">{claim.name}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Accepted */}
                            <div className={`relative pl-10 pb-10 ${claim.status === 'submitted' ? 'opacity-60' : ''}`}>
                                <div className={`absolute left-[-10px] w-[20px] h-[20px] rounded-full ${claim.status !== 'submitted' ? 'bg-green-500 border-4 border-green-100 shadow-md' : 'bg-gray-300 border-4 border-gray-100'} flex items-center justify-center z-10`}>
                                    <User className={`w-3 h-3 ${claim.status !== 'submitted' ? 'text-white' : 'text-gray-400'}`} />
                                </div>
                                <div className={`bg-white rounded-xl border ${claim.status !== 'submitted' ? 'border-gray-100' : 'border-gray-200'} p-5 shadow-sm ${claim.status !== 'submitted' ? 'hover:shadow-md' : ''} transition-all`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">Claim Accepted</h3>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${claim.status !== 'submitted' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {claim.status !== 'submitted' ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-3 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {claim.status !== 'submitted' ? formatDate(claim.updatedAt) : 'Awaiting acceptance'}
                                    </div>
                                    <p className="text-gray-700">
                                        {claim.status !== 'submitted' ?
                                            <>Assigned to <span className="font-medium text-green-700">{claim.assignedTo}</span></> :
                                            'Waiting for claim to be accepted by an adjuster'}
                                    </p>
                                </div>
                            </div>

                            {/* Assigned to Adjuster */}
                            <div className={`relative pl-10 pb-10 ${claim.assignedUnder === null ? 'opacity-60' : ''}`}>
                                <div className={`absolute left-[-10px] w-[20px] h-[20px] rounded-full ${claim.assignedUnder !== null ? 'bg-green-500 border-4 border-green-100 shadow-md' : 'bg-gray-300 border-4 border-gray-100'} flex items-center justify-center z-10`}>
                                    <User className={`w-3 h-3 ${claim.assignedUnder !== null ? 'text-white' : 'text-gray-400'}`} />
                                </div>
                                <div className={`bg-white rounded-xl border ${claim.assignedUnder !== null ? 'border-gray-100' : 'border-gray-200'} p-5 shadow-sm ${claim.assignedUnder !== null ? 'hover:shadow-md' : ''} transition-all`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">Assigned to Adjuster</h3>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${claim.assignedUnder !== null ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {claim.assignedUnder !== null ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-3 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {claim.assignedUnder !== null ? formatDate(claim.updatedAt) : 'Awaiting assignment'}
                                    </div>
                                    <p className="text-gray-700">
                                        {claim.assignedUnder !== null ?
                                            <>Public adjuster <span className="font-medium text-green-700">{claim.assignedUnder}</span> is working on this claim</> :
                                            'Waiting for claim to be assigned to a public adjuster'}
                                    </p>
                                </div>
                            </div>

                            {/* In Progress */}
                            <div className={`relative pl-10 pb-10 ${claim.status !== 'in_progress' && claim.status !== 'resolved' ? 'opacity-60' : ''}`}>
                                <div className={`absolute left-[-10px] w-[20px] h-[20px] rounded-full ${claim.status === 'in_progress' || claim.status === 'resolved' ? 'bg-green-500 border-4 border-green-100 shadow-md' : 'bg-gray-300 border-4 border-gray-100'} flex items-center justify-center z-10`}>
                                    <AlertTriangle className={`w-3 h-3 ${claim.status === 'in_progress' || claim.status === 'resolved' ? 'text-white' : 'text-gray-400'}`} />
                                </div>
                                <div className={`bg-white rounded-xl border ${claim.status === 'in_progress' || claim.status === 'resolved' ? 'border-gray-100' : 'border-gray-200'} p-5 shadow-sm ${claim.status === 'in_progress' || claim.status === 'resolved' ? 'hover:shadow-md' : ''} transition-all`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">In Progress</h3>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${claim.status === 'in_progress' ? 'bg-orange-50 text-orange-700' : claim.status === 'resolved' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {claim.status === 'in_progress' ? 'Active' : claim.status === 'resolved' ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-3 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {claim.status === 'in_progress' || claim.status === 'resolved' ? formatDate(claim.updatedAt) : 'Not started yet'}
                                    </div>
                                    <p className="text-gray-700">
                                        {claim.status === 'in_progress' || claim.status === 'resolved' ?
                                            'Adjuster is actively processing and investigating this claim' :
                                            'Waiting to begin claim investigation and processing'}
                                    </p>
                                </div>
                            </div>

                            {/* Resolved */}
                            <div className={`relative pl-10 ${claim.status !== 'resolved' ? 'opacity-60' : ''}`}>
                                <div className={`absolute left-[-10px] w-[20px] h-[20px] rounded-full ${claim.status === 'resolved' ? 'bg-green-500 border-4 border-green-100 shadow-md' : 'bg-gray-300 border-4 border-gray-100'} flex items-center justify-center z-10`}>
                                    <CheckCheck className={`w-3 h-3 ${claim.status === 'resolved' ? 'text-white' : 'text-gray-400'}`} />
                                </div>
                                <div className={`bg-white rounded-xl border ${claim.status === 'resolved' ? 'border-gray-100' : 'border-gray-200'} p-5 shadow-sm ${claim.status === 'resolved' ? 'hover:shadow-md' : ''} transition-all`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">Resolved</h3>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${claim.status === 'resolved' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {claim.status === 'resolved' ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-3 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {claim.status === 'resolved' ? formatDate(claim.updatedAt) : 'Not resolved yet'}
                                    </div>
                                    <p className="text-gray-700">
                                        {claim.status === 'resolved' ?
                                            'This claim has been fully resolved and closed' :
                                            'Waiting for final resolution of this claim'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 border-opacity-50"></div>
                </div>
            ) : (
                <div className="p-5 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
                    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8 transition-all hover:shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Claim #{claim?.id.substring(0, 8)}</h1>
                                <p className="text-gray-600 mt-1">{claim?.description}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <div className={`flex items-center rounded-full px-4 py-2 ${claim?.status === 'resolved' ? 'bg-green-50 text-green-700' :
                                    claim?.status === 'in_progress' ? 'bg-orange-50 text-orange-700' :
                                        claim?.status === 'assigned' ? 'bg-purple-50 text-purple-700' :
                                            ' bg-green-50 text-green-700'
                                    }`}>
                                    {getStatusIcon(claim?.status)}
                                    <span className="ml-2 font-medium capitalize">{claim?.status.replace('_', ' ')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-10">
                            <div className="relative">
                                <div className="overflow-hidden h-3 mb-6 flex rounded-full bg-gray-100">
                                    <div
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                        style={{ width: `${(getStatusStep(claim?.status) + 1) * 25}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <div className={`${getStatusStep(claim?.status) >= 0 ? 'text-green-600' : 'text-gray-500'}`}>Submitted</div>
                                    <div className={`${getStatusStep(claim?.status) >= 1 ? 'text-green-600' : 'text-gray-500'}`}>Assigned</div>
                                    <div className={`${getStatusStep(claim?.status) >= 2 ? 'text-green-600' : 'text-gray-500'}`}>In Progress</div>
                                    <div className={`${getStatusStep(claim?.status) >= 3 ? 'text-green-600' : 'text-gray-500'}`}>Resolved</div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex border-b">
                                <button
                                    className={`py-3 px-6 font-medium transition-all duration-200 ${activeTab === 'overview' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    className={`py-3 px-6 font-medium transition-all duration-200 ${activeTab === 'contact' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('contact')}
                                >
                                    Contact Info
                                </button>
                                <button
                                    className={`py-3 px-6 font-medium transition-all duration-200 ${activeTab === 'timeline' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('timeline')}
                                >
                                    Timeline
                                </button>
                            </div>
                        </div>

                        {renderTab()}
                    </div>
                </div>
            )}
        </>
    );
}

export default Progress_Tracking_Page;