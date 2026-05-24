import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import LogoImg from '../assets/Logo.png';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loginPayload = { email, password };

        try {
            const response = await fetch("http://localhost:8765/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginPayload),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token; // Extracted from AuthController's Map.of("token", token)

                // Store token for future authenticated requests
                localStorage.setItem("token", token);

                // Decode token to find role
                const decoded = jwtDecode(token);
                const role = decoded.role; // Ensure your JwtUtils puts role name in "role" claim

                toast.success(`Welcome back, ${role}!`);

                // Role-based redirection
                if (role === "ADMIN") {
                    navigate("/dashboard");
                } else if (role === "EMPLOYEE") {
                    navigate("/employee-dashboard");
                } else if (role === "ASSETMANAGER") {
                    navigate("/manager-dashboard");
                } else {
                    navigate("/");
                }
            } else {
                toast.error("Invalid email or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Connect error: Is the API Gateway running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6">
            <div className="flex w-full max-w-5xl flex-col items-center md:flex-row md:justify-around">
                <div className="mb-12 flex w-full justify-center md:mb-0 md:w-1/2">
                    <img src={LogoImg} alt="AMS Logo" className="w-64 md:w-80 lg:w-96 object-contain" />
                </div>

                <div className="w-full max-w-md md:w-1/2">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Login</h1>
                        <p className="mt-2 text-sm text-gray-500">Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your Email"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative mt-1">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="********"
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                                >
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-[#6a89b5] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5a78a3] transition-colors disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>

                        <div className="text-right">
                            <button
                                type="button"
                                className="text-sm font-medium text-gray-600 hover:underline"
                                onClick={() => toast("Contact Admin to reset password", { icon: 'ℹ️' })}
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