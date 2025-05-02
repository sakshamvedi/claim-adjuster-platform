import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo and Brand Name */}
                    <div className="flex items-center space-x-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8"
                        >
                            <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5zm3 3h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 6h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
                        </svg>
                        <h1 className="text-xl font-bold">Claims Platform</h1>
                    </div>

                    {/* Navigation Tabs */}
                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <Link
                                    to="/"
                                    className={`py-2 px-1 border-b-2 ${activeTab === 'home'
                                        ? 'border-white font-medium'
                                        : 'border-transparent hover:border-white/50'
                                        }`}
                                    onClick={() => setActiveTab('home')}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/team"
                                    className={`py-2 px-1 border-b-2 ${activeTab === 'team'
                                        ? 'border-white font-medium'
                                        : 'border-transparent hover:border-white/50'
                                        }`}
                                    onClick={() => setActiveTab('team')}
                                >
                                    My Team
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* User Profile Section */}
                    <div className="flex items-center space-x-3">
                        <span className="hidden md:inline">Welcome, Admin</span>
                        <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                            <span className="text-sm font-medium">A</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;