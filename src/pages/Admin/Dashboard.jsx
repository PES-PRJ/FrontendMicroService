import React, { useState, useEffect } from "react";
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value }) => (
    <div className="bg-[#6a89b5] text-white rounded-xl p-6 flex flex-col items-center justify-center w-full shadow-sm">
        <p className="text-[10px] font-bold opacity-90 uppercase tracking-widest text-center">
            {title}
        </p>
        <h2 className="text-4xl font-bold mt-1">{value}</h2>
    </div>
);

const Dashboard = () => {
    // Dynamic Data States
    const [assets, setAssets] = useState([]);
    const [usersLookup, setUsersLookup] = useState({}); // Stores email -> name key-value pairs
    const [stats, setStats] = useState({
        totalAssets: 0,
        assetManagers: 0,
        employees: 0,
        totalUsers: 0
    });
    
    // UI Interaction States
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                // Concurrent fetches to asset and user endpoints across the gateway
                const [usersResponse, assetsResponse] = await Promise.all([
                    fetch("http://localhost:8765/api/users", {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch("http://localhost:8765/api/assets", { 
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                if (!usersResponse.ok || !assetsResponse.ok) {
                    throw new Error("Failed to synchronize administrative dashboard data parameters.");
                }

                const usersData = await usersResponse.json();
                const assetsData = await assetsResponse.json();

                // Create a fast-lookup dictionary for runtime email matching
                // Assuming user objects have properties: .email and .name
                const lookup = {};
                usersData.forEach(u => {
                    if (u.email) lookup[u.email.toLowerCase()] = u.name;
                });
                setUsersLookup(lookup);

                // Calculate user partitions from roles
                const managersCount = usersData.filter(u => u.role?.name === "ASSETMANAGER").length;
                const employeesCount = usersData.filter(u => u.role?.name === "EMPLOYEE").length;
                const overallUsersCount = usersData.length;

                setAssets(assetsData);
                setStats({
                    totalAssets: assetsData.length,
                    assetManagers: managersCount,
                    employees: employeesCount,
                    totalUsers: overallUsersCount
                });
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    // Live search tracking filter evaluation logic including dynamic user name resolution
    const filteredAssets = assets.filter((asset) => {
        const searchLower = searchTerm.toLowerCase();
        const resolvedName = asset.assignedTo ? (usersLookup[asset.assignedTo.toLowerCase()] || "") : "";
        
        return (
            (asset.serialNo && asset.serialNo.toLowerCase().includes(searchLower)) ||
            (asset.name && asset.name.toLowerCase().includes(searchLower)) ||
            (asset.location && asset.location.toLowerCase().includes(searchLower)) ||
            (asset.category && asset.category.toLowerCase().includes(searchLower)) ||
            (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchLower)) ||
            resolvedName.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="flex-1 bg-[#f0ebff] p-8 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm border border-red-100 font-sans">
                    <strong>Gateway Diagnostic Notification:</strong> {error}
                </div>
            )}

            {/* Stats Cards Row */}
            <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Assets" value={loading ? "..." : stats.totalAssets} />
                    <StatCard title="Asset Managers" value={loading ? "..." : stats.assetManagers} />
                    <StatCard title="Employees" value={loading ? "..." : stats.employees} />
                    <StatCard title="Total Users" value={loading ? "..." : stats.totalUsers} />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="relative mb-6 max-w-xs">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border-none rounded-lg text-sm outline-none focus:ring-1 focus:ring-purple-200 text-gray-700"
                    />
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <p className="text-gray-400 text-sm p-4 animate-pulse">Synchronizing directory entries...</p>
                    ) : filteredAssets.length === 0 ? (
                        <p className="text-gray-400 text-sm italic p-4">No tracking asset records matched parameters.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[11px] font-bold text-gray-400 uppercase border-b border-gray-100">
                                    <th className="pb-4 px-2">Serial No.</th>
                                    <th className="pb-4 px-2">NAME</th>
                                    <th className="pb-4 px-2">Location</th>
                                    <th className="pb-4 px-2">CATEGORY</th>
                                    <th className="pb-4 px-2">Assigned to</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredAssets.map((asset, idx) => {
                                    const userEmail = asset.assignedTo;
                                    const fullName = userEmail ? (usersLookup[userEmail.toLowerCase()] || "Loading user...") : "Unassigned";

                                    return (
                                        <tr key={asset.id || idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-5 px-2 font-bold text-gray-800">
                                                {asset.serialNo}
                                            </td>
                                            <td className="py-5 px-2 text-gray-600">{asset.name}</td>
                                            <td className="py-5 px-2 text-gray-600">{asset.location}</td>
                                            <td className="py-5 px-2 text-gray-600">{asset.category}</td>
                                            <td className="py-5 px-2">
                                                <div className="font-bold text-gray-800">{fullName}</div>
                                                {userEmail && <div className="text-[11px] text-gray-400 font-normal">{userEmail}</div>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer info & Pagination */}
                <div className="mt-6 flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase">
                    <span>Showing {filteredAssets.length} of {assets.length} Assets</span>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded border border-gray-100 hover:bg-gray-50">
                            <ChevronLeftIcon className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded border border-gray-100 hover:bg-gray-50">
                            <ChevronRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;