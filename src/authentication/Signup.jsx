import { useState } from 'react';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Check } from 'lucide-react';
import { API_URL } from '../../api.js';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
export default function SignupForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate first name
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        // Validate last name
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        // Validate email
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = 'Password must contain lowercase, uppercase, and numbers';
        }

        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Validate terms agreement
        if (!agreeToTerms) {
            newErrors.terms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);

            // Simulate API call

            const name = formData.firstName + ' ' + formData.lastName;
            const email = formData.email;
            const password = formData.password;
            const role = 'admin';
            const body = { name, email, password, role };
            try {
                const response = await axios.post(`${API_URL}/signup-charcha`, body);
                console.log(response);

                if (response.status === 201) {
                    localStorage.setItem('isLoggedInClaimsEngineUser', 'true');
                    localStorage.setItem('claimsEngineUser', JSON.stringify(formData.email));
                    navigate('/home');
                }
                else {
                    setIsLoading(false);
                }
            }
            catch (error) {
                setIsLoading(false);
                console.error('Signup failed:', error);
            }




        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
                    <p className="mt-2 text-gray-600">Sign up to get started</p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                First name
                            </label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="John"
                                />
                            </div>
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Last name
                            </label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="Doe"
                                />
                            </div>
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

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
                                value={formData.email}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                                onClick={() => togglePasswordVisibility('password')}
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
                        <div className="mt-2 space-y-1 text-xs text-gray-500">
                            <p className={formData.password.length >= 8 ? 'text-green-500' : ''}>
                                {formData.password.length >= 8 ? (
                                    <Check className="inline w-3 h-3 mr-1" />
                                ) : null}
                                At least 8 characters
                            </p>
                            <p className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>
                                {/[A-Z]/.test(formData.password) ? (
                                    <Check className="inline w-3 h-3 mr-1" />
                                ) : null}
                                At least one uppercase letter
                            </p>
                            <p className={/[0-9]/.test(formData.password) ? 'text-green-500' : ''}>
                                {/[0-9]/.test(formData.password) ? (
                                    <Check className="inline w-3 h-3 mr-1" />
                                ) : null}
                                At least one number
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm password
                        </label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-10 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                                onClick={() => togglePasswordVisibility('confirm')}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={() => setAgreeToTerms(!agreeToTerms)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700">
                                I agree to the{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-500">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-500">
                                    Privacy Policy
                                </a>
                            </label>
                            {errors.terms && (
                                <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <svg className="w-5 h-5 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <UserPlus className="w-5 h-5 mr-2" />
                            )}
                            Create account
                        </button>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Admin Account or Poliy Adjuster Login?{' '}
                        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </a>
                    </p>
                </div>


            </div>

        </div>
    );
}