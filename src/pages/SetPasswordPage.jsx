import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LogoImg from '../assets/Logo.png';

const SetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const token = searchParams.get("token");

    // Validation Logic
    const validatePassword = (pass) => {
        const minLength = pass.length >= 8;
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

        if (!minLength) return "Password must be at least 8 characters long.";
        if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
        if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
        if (!hasNumber) return "Password must contain at least one number.";
        if (!hasSpecialChar) return "Password must contain at least one special character.";
        
        return null;
    };

    const handleSetPassword = async (e) => {
        e.preventDefault();

        // 1. Check if passwords match
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        // 2. Run complexity validation
        const validationError = validatePassword(password);
        if (validationError) {
            return toast.error(validationError);
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8765/api/auth/set-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (response.ok) {
                toast.success("Password set successfully! You can now log in.");
                navigate("/");
            } else {
                const errorMsg = await response.text();
                toast.error(errorMsg || "The link has expired or is invalid.");
            }
        } catch (error) {
            toast.error("Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
                <div className="flex justify-center mb-6">
                    <img src={LogoImg} alt="Logo" className="h-16 object-contain" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 text-center">Set Your Password</h2>
                <p className="mt-2 text-sm text-gray-500 text-center mb-6">
                    Create a secure password. Use 8+ characters with uppercase, numbers, and symbols.
                </p>
                
                <form onSubmit={handleSetPassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#6a89b5] text-white py-3 rounded-lg font-semibold hover:bg-[#5a78a3] transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Activate Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPasswordPage;