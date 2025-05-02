import { useState, useEffect } from 'react';
import { Search, Filter, Clipboard, FileText, Clock, AlertCircle, CheckCircle, ArrowDownUp, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// API URL for claims data
const API_URL = 'https://claims-engine-backend-1.onrender.com/api';

// Status badge component
const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
        switch (status.toLowerCase()) {
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

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles()}`}>
            {status}
        </span>
    );
};

// Claim card component
const ClaimCard = ({ claim }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate('/claim', {
            state: {
                id: claim.id || claim._id,
                name: claim.name,
                phone: claim.phone,
                email: claim.email,
                address: claim.address,
                zip: claim.zip,
                status: claim.status,
                priority: claim.priority,
                description: claim.description,
                createdAt: claim.createdAt,
                updatedAt: claim.updatedAt
            }
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">#{claim.id || claim._id}</h3>
                <StatusBadge status={claim.status} />
            </div>
            <div className="mb-3">
                <p className="text-sm text-gray-700 truncate">{claim.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{new Date(claim.createdAt || claim.submittedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                    <FileText size={14} />
                    <span>Priority: {claim.priority || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1 col-span-2">
                    <AlertCircle size={14} />
                    <span>Name: {claim.name}</span>
                </div>

                {claim.phone && (
                    <div className="flex items-center gap-1 col-span-2">
                        <AlertCircle size={14} />
                        <span>Phone: {claim.phone}</span>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1 col-span-2">
                <button className="bg-blue-500 flex items-center gap-1 mt-[10px] cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={handleViewDetails}
                >
                    <span>View Details</span>
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default function Home() {
    const [claims, setClaims] = useState([]);
    const [claimsUser, setClaimsUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() => {
        // Get current user from localStorage
        const claimsUser = localStorage.getItem('claimsEngineUser');
        setClaimsUser(claimsUser.toString());
        const fetchClaims = async () => {
            try {
                setIsLoading(true);


                setCurrentUser(claimsUser.toString());
                console.log(claimsUser.toString());

                // Fetch claims data
                const response = await fetch(`${API_URL}/getclaims`);

                const dataClaims = await response.json();
                console.log(dataClaims);

                if (!response.ok) {
                    throw new Error("Failed to fetch claims");
                }

                // Filter claims assigned to current user (using the new data structure)
                const filterHisClaims = dataClaims.filter(claim =>
                    claim.assignedTo == claimsUser.substring(1, claimsUser.length - 1));
                console.log(filterHisClaims);

                setClaims(filterHisClaims);
                setError(null);
            } catch (err) {
                setError('Failed to fetch claims data. Please try again later.');
                console.error('Error fetching claims: ', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClaims();
    }, []);

    // Filter and sort claims based on user input
    const filteredClaims = claims
        .filter(claim => {
            // Apply search term filter
            const searchMatch =
                (claim.id || claim._id || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                (claim.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (claim.name || '').toLowerCase().includes(searchTerm.toLowerCase());

            // Apply status filter
            const statusMatch = statusFilter === 'all' || (claim.status || '').toLowerCase() === statusFilter.toLowerCase();

            return searchMatch && statusMatch;
        })
        .sort((a, b) => {
            // Apply sorting
            if (sortBy === 'date') {
                return sortDirection === 'asc'
                    ? new Date(a.createdAt || a.submittedDate) - new Date(b.createdAt || b.submittedDate)
                    : new Date(b.createdAt || b.submittedDate) - new Date(a.createdAt || a.submittedDate);
            } else if (sortBy === 'amount') {
                // If amount doesn't exist in new structure, fall back to priority
                const priorityMap = { low: 1, medium: 2, high: 3 };
                const aPriority = priorityMap[a.priority] || 0;
                const bPriority = priorityMap[b.priority] || 0;

                return sortDirection === 'asc'
                    ? aPriority - bPriority
                    : bPriority - aPriority;
            }
            return 0;
        });

    // Handle sort change
    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('desc');
        }
    };

    // Dashboard stats
    const totalClaims = claims.length;
    const pendingClaims = claims.filter(claim => claim.status && claim.status.toLowerCase() === 'pending').length;
    const assignedClaims = claims.filter(claim => claim.status && claim.status.toLowerCase() === 'assigned').length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Header with user info */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Claims Dashboard</h1>
                {currentUser && (
                    <p className="text-sm text-gray-600">
                        You are logged in as {claimsUser}
                    </p>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 mr-4">
                            <Clipboard className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Claims</p>
                            <p className="text-xl font-semibold">{totalClaims}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 mr-4">
                            <Clock className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending Claims</p>
                            <p className="text-xl font-semibold">{pendingClaims}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 mr-4">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Assigned Claims</p>
                            <p className="text-xl font-semibold">{assignedClaims}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2 text-sm"
                            placeholder="Search claims..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2 text-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="rejected">Rejected</option>
                            <option value="in review">In Review</option>
                        </select>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleSortChange('date')}
                            className={`flex items-center space-x-1 px-3 py-2 rounded text-sm ${sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            <Clock size={14} />
                            <span>Date</span>
                            {sortBy === 'date' && (
                                <ArrowDownUp size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                            )}
                        </button>

                        <button
                            onClick={() => handleSortChange('amount')}
                            className={`flex items-center space-x-1 px-3 py-2 rounded text-sm ${sortBy === 'amount' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            <span>Amount</span>
                            {sortBy === 'amount' && (
                                <ArrowDownUp size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Claims List */}
            {filteredClaims.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No claims found</h3>
                    <p className="text-gray-500">
                        {claims.length === 0
                            ? "You don't have any claims assigned to you yet."
                            : "No claims match your search criteria."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {filteredClaims.map((claim) => (
                        <ClaimCard key={claim.claimNumber} claim={claim} />
                    ))}
                </div>
            )}


        </div>
    );
}
