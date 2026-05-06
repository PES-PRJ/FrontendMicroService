import React from "react";
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const DownloadReports = () => {
    // Mock data matching your screenshot
    const reportData = [
        {
            sn: "SN67890",
            name: "Dell Laptop",
            loc: "Office 101",
            cat: "Electronics",
            user: "Zimba",
            email: "zimba123@gmail.com",
        },
        {
            sn: "SN54321",
            name: "Office Chair",
            loc: "Office 104",
            cat: "Furniture",
            user: "Lhaki Yangden",
            email: "lhakiscoutyangden2004@gmail.com",
        },
        {
            sn: "SN98765",
            name: "Wooden Desk",
            loc: "Office 101",
            cat: "Furniture",
            user: "Zimba",
            email: "zimba123@gmail.com",
        },
        {
            sn: "SN11223",
            name: "HP Printer",
            loc: "Office 101",
            cat: "Electronics",
            user: "Zimba",
            email: "zimba123@gmail.com",
        },
        {
            sn: "SN12378",
            name: "Air Conditioner",
            loc: "HR Office",
            cat: "Appliance",
            user: "Jigdrel Chonie Wangmo",
            email: "jigs1234@gmail.com",
        },
        {
            sn: "SN12378",
            name: "Wooden Desk",
            loc: "HR Office",
            cat: "Furniture",
            user: "Jigdrel Chonie Wangmo",
            email: "jigs1234@gmail.com",
        },
        {
            sn: "SN12378",
            name: "Office Chair",
            loc: "HR Office",
            cat: "Furniture",
            user: "Jigdrel Chonie Wangmo",
            email: "jigs1234@gmail.com",
        },
        {
            sn: "SN12378",
            name: "MACbook",
            loc: "HR Office",
            cat: "Electronics",
            user: "Jigdrel Chonie Wangmo",
            email: "jigs1234@gmail.com",
        },
        {
            sn: "SN12378",
            name: "Projector",
            loc: "Office 201",
            cat: "Electronics",
            user: "Pema Syelden",
            email: "psyelden@gmail.com",
        },
    ];

    return (
        <div className="flex-1 bg-[#f0ebff] p-8 min-h-screen font-sans">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Hello Admin,</h1>

            <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[600px] flex flex-col">
                {/* Top Controls */}
                <div className="flex items-center justify-between mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search assets"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-purple-200"
                        />
                    </div>
                    <button className="bg-[#6a89b5] text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#5a78a3] flex items-center gap-2 transition-colors">
                        Download
                    </button>
                </div>

                {/* Reports Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100">
                                <th className="pb-4 px-2">Serial No.</th>
                                <th className="pb-4 px-2">NAME</th>
                                <th className="pb-4 px-2">Location</th>
                                <th className="pb-4 px-2">CATEGORY</th>
                                <th className="pb-4 px-2">Assigned to</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            {reportData.map((item, idx) => (
                                <tr
                                    key={idx}
                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-4 px-2 font-bold text-gray-900">
                                        {item.sn}
                                    </td>
                                    <td className="py-4 px-2">{item.name}</td>
                                    <td className="py-4 px-2">{item.loc}</td>
                                    <td className="py-4 px-2">{item.cat}</td>
                                    <td className="py-4 px-2">
                                        <div className="font-semibold text-gray-800">
                                            {item.user}
                                        </div>
                                        <div className="text-[11px] text-gray-400">
                                            {item.email}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between text-xs text-gray-500 font-medium uppercase">
                    <span>Showing 1-09 of 78</span>
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
