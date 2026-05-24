import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import EmpSidebar from "../../components/EmpSidebar"; 

const EmployeeDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form States
    const [selectedAssetSerial, setSelectedAssetSerial] = useState("");
    const [issueType, setIssueType] = useState("HARDWARE_MALFUNCTION");
    const [issueDescription, setIssueDescription] = useState("");
    
    // Real API Data States
    const [myAssets, setMyAssets] = useState([]);
    const [myTickets, setMyTickets] = useState([]);
    
    // UI Status States
    const [assetsLoading, setAssetsLoading] = useState(true);
    const [ticketsLoading, setTicketsLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");

    // Read only the secure token from local storage
    const token = localStorage.getItem("token");

    // Fetch live backend data on component initialization
    useEffect(() => {
        if (!token) {
            setError("Authentication context missing. Please log in again.");
            setAssetsLoading(false);
            setTicketsLoading(false);
            return;
        }

        fetchMyAssets();
        fetchMyTickets();
    }, []);

    // FETCH: Get real assets assigned to this employee (Identification handled by backend JWT)
    const fetchMyAssets = async () => {
        try {
            setAssetsLoading(true);
            const response = await fetch("http://localhost:8765/api/assets/my-assets", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Could not retrieve your allocated asset registry.");
            const data = await response.json();
            
            setMyAssets(data);
            
            // Auto-select the first asset code in the layout dropdown selection if data exists
            if (data.length > 0) {
                setSelectedAssetSerial(data[0].serialNo || data[0].assetSerialNo || data[0].sn);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setAssetsLoading(false);
        }
    };

    // FETCH: Get real maintenance logs (Identification handled by backend JWT)
    const fetchMyTickets = async () => {
        try {
            setTicketsLoading(true);
            const response = await fetch("http://localhost:8765/api/maintenance/my-tickets", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Failed to load your maintenance tickets.");
            const data = await response.json();
            setMyTickets(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setTicketsLoading(false);
        }
    };

    // POST: Create ticket resource downstream
    const handleSubmitTicket = async () => {
        if (!selectedAssetSerial) {
            alert("Please select an active asset to report an issue against.");
            return;
        }
        if (!issueDescription.trim()) {
            alert("Please provide a description of the problem symptoms.");
            return;
        }

        setSubmitLoading(true);
        
        // Note: reportedByEmail is omitted here because your backend context parser 
        // will identify the logging user via the Principal context setup.
        const payload = {
            assetSerialNo: selectedAssetSerial,
            issueType: issueType,
            description: issueDescription,
        };

        try {
            const response = await fetch("http://localhost:8765/api/maintenance/tickets", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Could not save ticket record. Verify resource permissions.");

            // Reset modal data context & refresh history tables
            setIssueDescription("");
            setIsModalOpen(false);
            fetchMyTickets();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            REPORTED: "bg-amber-100 text-amber-800",
            IN_PROGRESS: "bg-blue-100 text-blue-800",
            RESOLVED: "bg-emerald-100 text-emerald-800",
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-800"}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex min-h-screen font-sans">
            <EmpSidebar />

            <main className="flex-1 bg-[#f0ebff] p-10 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm border border-red-100">
                            <strong>System Error:</strong> {error}
                        </div>
                    )}

                    {/* Section 1: Dynamic Asset Inventory */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">My Allocated Assets</h2>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                disabled={myAssets.length === 0}
                                className="bg-[#6a89b5] disabled:bg-gray-300 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm hover:bg-[#5a78a3] transition-colors"
                            >
                                Report issues
                            </button>
                        </div>

                        {assetsLoading ? (
                            <p className="text-gray-400 text-sm animate-pulse">Querying server for assigned devices...</p>
                        ) : myAssets.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">No company hardware resources currently checked out to your account name.</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[11px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-50">
                                        <th className="text-left pb-4 px-2">Serial No.</th>
                                        <th className="text-left pb-4 px-2">NAME</th>
                                        <th className="text-left pb-4 px-2">CATEGORY</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {myAssets.map((asset, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 last:border-0">
                                            <td className="py-4 px-2 font-bold text-gray-700">{asset.serialNo || asset.assetSerialNo || asset.sn}</td>
                                            <td className="py-4 px-2 text-gray-500">{asset.name || asset.assetName}</td>
                                            <td className="py-4 px-2 text-gray-500">{asset.category || asset.cat}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Section 2: Real-time Ticket History Status Tracker */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm min-h-[250px]">
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-6">Track Filed Claims</h2>
                        
                        {ticketsLoading ? (
                            <p className="text-gray-400 text-sm animate-pulse">Loading database tickets...</p>
                        ) : myTickets.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">No active maintenance claims logged.</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[11px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-50">
                                        <th className="text-left pb-4 px-2">Ticket ID</th>
                                        <th className="text-left pb-4 px-2">Asset SN</th>
                                        <th className="text-left pb-4 px-2">Issue Type</th>
                                        <th className="text-left pb-4 px-2">Description</th>
                                        <th className="text-left pb-4 px-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {myTickets.map((ticket) => (
                                        <tr key={ticket.id} className="border-b border-gray-50 last:border-0">
                                            <td className="py-4 px-2 font-bold text-gray-700">#00{ticket.id}</td>
                                            <td className="py-4 px-2 text-gray-600 font-medium">{ticket.assetSerialNo}</td>
                                            <td className="py-4 px-2 text-xs text-gray-500 uppercase">{ticket.issueType ? ticket.issueType.replace(/_/g, ' ') : ""}</td>
                                            <td className="py-4 px-2 text-gray-500 max-w-xs truncate">{ticket.description}</td>
                                            <td className="py-4 px-2">{getStatusBadge(ticket.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Report Issue Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            <div className="space-y-5">
                                <h3 className="text-base font-bold text-gray-800">Log Maintenance Ticket</h3>
                                
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                                        Select Broken Asset
                                    </label>
                                    <select
                                        value={selectedAssetSerial}
                                        onChange={(e) => setSelectedAssetSerial(e.target.value)}
                                        className="w-full bg-[#f4f6f9] border-none rounded-lg p-4 text-sm outline-none focus:ring-1 focus:ring-[#6a89b5] text-gray-700"
                                    >
                                        {myAssets.map((asset) => {
                                            const serial = asset.serialNo || asset.assetSerialNo || asset.sn;
                                            const name = asset.name || asset.assetName;
                                            return (
                                                <option key={serial} value={serial}>
                                                    {name} ({serial})
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                                        Issue Classification
                                    </label>
                                    <select
                                        value={issueType}
                                        onChange={(e) => setIssueType(e.target.value)}
                                        className="w-full bg-[#f4f6f9] border-none rounded-lg p-4 text-sm outline-none focus:ring-1 focus:ring-[#6a89b5] text-gray-700"
                                    >
                                        <option value="HARDWARE_MALFUNCTION">Hardware Malfunction</option>
                                        <option value="WEAR_AND_TEAR">Wear & Tear</option>
                                        <option value="UPGRADE_REQUEST">Upgrade Request</option>
                                        <option value="SOFTWARE_CRASH">Software Crash</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                                        Detailed Symptoms
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={issueDescription}
                                        onChange={(e) => setIssueDescription(e.target.value)}
                                        placeholder="Describe what's wrong with the device..."
                                        className="w-full bg-[#f4f6f9] border-none rounded-lg p-4 text-sm outline-none focus:ring-1 focus:ring-[#6a89b5] resize-none text-gray-800"
                                    />
                                </div>

                                <div className="flex justify-center pt-2">
                                    <button
                                        onClick={handleSubmitTicket}
                                        disabled={submitLoading}
                                        className="bg-[#839dbf] hover:bg-[#6a89b5] disabled:bg-gray-400 text-white font-bold py-3 px-12 rounded-xl transition-colors shadow-md w-full"
                                    >
                                        {submitLoading ? "Submitting..." : "Submit Claim"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default EmployeeDashboard;