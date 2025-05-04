import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft, Lock } from 'lucide-react';

function NotAllowed() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="bg-red-100 rounded-full p-5">
                        <ShieldAlert className="h-16 w-16 text-red-600" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-extrabold text-gray-900">Access Denied</h1>
                    <p className="text-xl text-gray-500">
                        You don't have permission to access this page.
                    </p>
                    <p className="text-gray-600">
                        Please sign in with an authorized account or contact your administrator if you believe this is a mistake.
                    </p>
                </div>

                <div className="pt-6 space-y-4">
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Lock className="w-5 h-5 mr-2" />
                        Sign In
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center w-full px-4 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center w-full px-4 py-3 text-base font-medium text-gray-500 bg-transparent hover:text-gray-700 focus:outline-none"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotAllowed;