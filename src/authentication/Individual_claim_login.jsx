import { useState } from 'react';
import { Eye, EyeOff, LogIn, Mail, Lock, UserPlus } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../../api';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [emailExists, setEmailExists] = useState(null);
    const [step, setStep] = useState('email'); // 'email' or 'password'
    const navigate = useNavigate();

    const validateEmail = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        if (validateEmail()) {
            setIsVerifyingEmail(true);

            try {
                // Check if the email exists in the system
                const response = await axios.post(`${API_URL}/email-check`, { email });
                const data = response.data;
                console.log(data);
                if (data.message === 'Email exists') {
                    setEmailExists(true);
                    setStep('password');
                    toast.success('Email found. Please enter your password.');
                } else {
                    setEmailExists(false);
                    toast.info('Email not found. Please create a new password.');
                }

                // Move to the password step regardless of whether email exists

            } catch (error) {
                setEmailExists(false);
                setStep('create-password');
                toast.error('Email not found. Please create a new password.');
            } finally {
                setIsVerifyingEmail(false);
            }
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (validatePassword()) {
            setIsLoading(true);

            try {
                if (emailExists) {
                    // Login path - email exists
                    const response = await axios.post(`${API_URL}/login-check`, {
                        email,
                        password
                    });

                    const data = response.data;
                    if (data.message === 'Login successful') {
                        localStorage.setItem('isLoggedInClaimsEngineUser', true);
                        // token for the admin right now is false
                        localStorage.setItem('xxaabbxxttokenrightadsssdsdmkzzddd', false);
                        localStorage.setItem('claimsEngineUserWholeData', JSON.stringify(data.user));
                        localStorage.setItem('claimsEngineUser', data.user.email);
                        toast.success('Login successful');
                        navigate('/');
                        window.location.reload();
                    } else {
                        throw new Error('Invalid credentials');
                    }
                } else {
                    // Create account path - email doesn't exist
                    const response = await axios.post(`${API_URL}/create-id-and-password`, {
                        email,
                        password
                    });

                    const data = response.data;
                    if (data.message === 'User created successfully') {
                        toast.success('Account created successfully! You can now log in.');
                        // Automatically log them in
                        localStorage.setItem('isLoggedInClaimsEngineUser', true);
                        localStorage.setItem('claimsEngineUserWholeData', JSON.stringify(data.user));
                        localStorage.setItem('claimsEngineUser', data.user.email);
                        navigate('/');
                        window.location.reload();
                    } else {
                        throw new Error('Failed to create account');
                    }
                }
            } catch (error) {
                console.error('Operation failed:', error);
                toast.error(emailExists ? 'Invalid email or password' : 'Failed to create account');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setStep('email');
        setEmailExists(null);
        setErrors({});
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
                    <p className="mt-2 text-gray-600">
                        {step === 'email'
                            ? 'Enter your email to continue'
                            : emailExists
                                ? 'Enter your password to sign in'
                                : 'Create a password for your new account'}
                    </p>
                </div>

                {step === 'email' ? (
                    <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isVerifyingEmail}
                                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isVerifyingEmail ? (
                                    <svg className="w-5 h-5 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <Mail className="w-5 h-5 mr-2" />
                                )}
                                Continue
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-700 flex items-center">
                                    <Mail className="w-4 h-4 mr-1 text-gray-500" />
                                    <span>{email}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                    Change
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                {emailExists ? 'Password' : 'Create Password'}
                            </label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete={emailExists ? 'current-password' : 'new-password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {emailExists && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <svg className="w-5 h-5 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : emailExists ? (
                                    <LogIn className="w-5 h-5 mr-2" />
                                ) : (
                                    <UserPlus className="w-5 h-5 mr-2" />
                                )}
                                {emailExists ? 'Sign in' : 'Create account'}
                            </button>
                        </div>
                    </form>
                )}


            </div>
            <Toaster />
        </div>
    );
}