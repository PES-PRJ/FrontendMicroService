import React from "react";
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
    const assets = [
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
            loc: "Office 101",
            cat: "Appliance",
            user: "Jigdrel Chonie Wangmo",
            email: "jigs1234@gmail.com",
        },
    ];

    return (
        <div className="flex-1 bg-[#f0ebff] p-8 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Hello Admin,</h1>

            {/* Stats Cards Row */}
            <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Assets" value="120" />
                    <StatCard title="Asset Managers" value="3" />
                    <StatCard title="Employees" value="24" />
                    <StatCard title="Total Users" value="27" />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="relative mb-6 max-w-xs">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search assets"
                        className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border-none rounded-lg text-sm outline-none focus:ring-1 focus:ring-purple-200"
                    />
                </div>

                <div className="overflow-x-auto">
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
                            {assets.map((asset, idx) => (
                                <tr key={idx} className="border-b border-gray-50 last:border-0">
                                    <td className="py-5 px-2 font-bold text-gray-800">
                                        {asset.sn}
                                    </td>
                                    <td className="py-5 px-2 text-gray-600">{asset.name}</td>
                                    <td className="py-5 px-2 text-gray-600">{asset.loc}</td>
                                    <td className="py-5 px-2 text-gray-600">{asset.cat}</td>
                                    <td className="py-5 px-2">
                                        <div className="font-bold text-gray-800">{asset.user}</div>
                                        <div className="text-[11px] text-gray-400">
                                            {asset.email}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer info & Pagination */}
                <div className="mt-6 flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase">
                    <span>Showing 1-05 of 78</span>
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
