import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
// Import the specific Employee Sidebar
import EmpSidebar from "../../components/EmpSidebar"; 

const EmployeeDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState("Laptop");
    const [issueDescription, setIssueDescription] = useState("Battery issue and it overheats very fast");

    const myAssets = [
        { sn: "SN67890", name: "Dell Laptop", cat: "Electronics" },
        { sn: "SN54321", name: "Office Chair", cat: "Furniture" },
        { sn: "SN98765", name: "Wooden Desk", cat: "Furniture" },
        { sn: "SN11223", name: "HP Printer", cat: "Electronics" },
    ];

    return (
        <div className="flex min-h-screen font-sans">
            
            {/* Using the Employee-specific Sidebar here */}
            <EmpSidebar />

            {/* Main Content Area */}
            <main className="flex-1 bg-[#f0ebff] p-10 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-xl font-semibold text-gray-800">Hello Zimba,</h1>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-sm min-h-[500px]">
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#6a89b5] text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm hover:bg-[#5a78a3] transition-colors"
                            >
                                Report issues
                            </button>
                        </div>

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
                                        <td className="py-6 px-2 font-bold text-gray-700">{asset.sn}</td>
                                        <td className="py-6 px-2 text-gray-500">{asset.name}</td>
                                        <td className="py-6 px-2 text-gray-500">{asset.cat}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                                        Select Asset Name
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedAsset}
                                        onChange={(e) => setSelectedAsset(e.target.value)}
                                        className="w-full bg-[#f4f6f9] border-none rounded-lg p-4 text-sm outline-none focus:ring-1 focus:ring-[#6a89b5]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                                        Issue Description
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={issueDescription}
                                        onChange={(e) => setIssueDescription(e.target.value)}
                                        className="w-full bg-[#f4f6f9] border-none rounded-lg p-4 text-sm outline-none focus:ring-1 focus:ring-[#6a89b5] resize-none font-bold text-gray-800"
                                    />
                                </div>

                                <div className="flex justify-center pt-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-[#839dbf] hover:bg-[#6a89b5] text-white font-bold py-3 px-12 rounded-xl transition-colors shadow-md"
                                    >
                                        Submit
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