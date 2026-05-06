import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import LogoImg from '../assets/Logo.png'; // Make sure to replace this with the actual path to your logo image

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    // Placeholder for form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login attempted");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6">
            <div className="flex w-full max-w-5xl flex-col items-center md:flex-row md:justify-around">
                {/* Left Side: Logo */}
                <div className="mb-12 flex w-full justify-center md:mb-0 md:w-1/2">
                    {/* Replace this src with your actual logo file path */}
                    <img
                        src={LogoImg}
                        alt="AMS Logo"
                        className="w-64 md:w-80 lg:w-96 object-contain"
                    />
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full max-w-md md:w-1/2">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Login</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="Enter your Email"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="********"
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Log In Button */}
                        <button
                            type="submit"
                            className="w-full rounded-md bg-[#6a89b5] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5a78a3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                        >
                            Log In
                        </button>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <button
                                type="button"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline focus:outline-none"
                                onClick={() => console.log("Forgot password clicked")}
                            >
                                Forgot password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
