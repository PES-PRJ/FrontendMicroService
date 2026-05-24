import React, { useState, useEffect } from "react";
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const DownloadReports = () => {
    const [assets, setAssets] = useState([]);
    const [usersLookup, setUsersLookup] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    // Fetch assets and users concurrently for clean data synthesis
    useEffect(() => {
        const fetchReportDependencies = async () => {
            try {
                setLoading(true);
                const [assetsResponse, usersResponse] = await Promise.all([
                    fetch("http://localhost:8765/api/assets", {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch("http://localhost:8765/api/users", {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                if (assetsResponse.ok && usersResponse.ok) {
                    const assetsData = await assetsResponse.json();
                    const usersData = await usersResponse.json();

                    // Convert users into a searchable map container
                    const lookup = {};
                    usersData.forEach(u => {
                        if (u.email) lookup[u.email.toLowerCase()] = u.name;
                    });

                    setUsersLookup(lookup);
                    setAssets(assetsData);
                } else {
                    toast.error("Failed to fetch reports directory parameters.");
                }
            } catch (error) {
                console.error("Asset report processing error:", error);
                toast.error("Network infrastructure unavailable.");
            } finally {
                setLoading(false);
            }
        };

        fetchReportDependencies();
    }, [token]);

    // Live filtering tracking validation
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

    // Excel formatting logic
    const handleExportToExcel = () => {
        if (filteredAssets.length === 0) {
            toast.error("No active dataset entries match criteria.");
            return;
        }

        // Structure clean table rows for Excel injection
        const formattedRows = filteredAssets.map((asset) => {
            const emailKey = asset.assignedTo;
            return {
                "Serial No.": asset.serialNo || "N/A",
                "Asset Name": asset.name || "N/A",
                "Location": asset.location || "N/A",
                "Category": asset.category || "N/A",
                "Assigned Employee Name": emailKey ? (usersLookup[emailKey.toLowerCase()] || "Unknown") : "Unassigned",
                "Employee Email Identifier": emailKey || "Unassigned"
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Asset Log Directory");

        // Set layout formatting column padding rules
        worksheet["!cols"] = [
            { wch: 16 }, // Serial No
            { wch: 24 }, // Asset Name
            { wch: 20 }, // Location
            { wch: 20 }, // Category
            { wch: 26 }, // Assigned Employee Name
            { wch: 34 }  // Employee Email Identifier
        ];

        XLSX.writeFile(workbook, "Asset_Allocation_Report.xlsx");
        toast.success("Excel spreadsheet compiled successfully.");
    };

    return (
        <div className="flex-1 bg-[#f0ebff] p-8 min-h-screen font-sans">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Download Reports</h1>

            <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[600px] flex flex-col">
                {/* Top Controls Row */}
                <div className="flex items-center justify-between mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-purple-200 text-gray-700"
                        />
                    </div>
                    <button 
                        onClick={handleExportToExcel}
                        className="bg-[#6a89b5] text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#5a78a3] flex items-center gap-2 transition-colors active:scale-[0.98]"
                    >
                        Download Report
                    </button>
                </div>

                {/* Table Layout Wrapper Container */}
                <div className="overflow-x-auto flex-1">
                    {loading ? (
                        <p className="text-gray-400 text-sm p-4 animate-pulse">Synchronizing inventory system logs...</p>
                    ) : filteredAssets.length === 0 ? (
                        <p className="text-gray-400 text-sm italic p-4">No records matched your search filters.</p>
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
                                    const emailKey = asset.assignedTo;
                                    const humanName = emailKey ? (usersLookup[emailKey.toLowerCase()] || "Loading user...") : "Unassigned";

                                    return (
                                        <tr key={asset.id || idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-5 px-2 font-bold text-gray-800">
                                                {asset.serialNo}
                                            </td>
                                            <td className="py-5 px-2 text-gray-600">{asset.name}</td>
                                            <td className="py-5 px-2 text-gray-600">{asset.location}</td>
                                            <td className="py-5 px-2 text-gray-600">{asset.category}</td>
                                            <td className="py-5 px-2">
                                                <div className="font-bold text-gray-800">{humanName}</div>
                                                {emailKey && <div className="text-[11px] text-gray-400 font-normal">{emailKey}</div>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Meta UI Footer Layout */}
                <div className="mt-6 flex items-center justify-between text-xs text-gray-500 font-medium uppercase">
                    <span>Showing {filteredAssets.length} of {assets.length} Assets</span>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-50">
                            <ChevronLeftIcon className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-50">
                            <ChevronRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadReports;