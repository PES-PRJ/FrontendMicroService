import React from "react";
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Helper component to render the colored status pill
const StatusPill = ({ status }) => {
    const isActive = status === "Active";
    return (
        <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
        >
            {status}
        </span>
    );
};

const UserManagement = () => {
    // Mock data based on your screenshot
    const users = [
        {
            name: "Zimba",
            email: "zimba123@gmail.com",
            role: "Employee",
            status: "Active",
        },
        {
            name: "Lhaki Yangden",
            email: "lhakiscoutyangden2004@gmail.com",
            role: "Employee",
            status: "Pending",
        },
        {
            name: "Lungten Wangmo",
            email: "luwang314@gmail.com",
            role: "Asset Manager",
            status: "Active",
        },
        {
            name: "Sonam Wangmo",
            email: "SonamWang@gmail.com",
            role: "Employee",
            status: "Active",
        },
        {
            name: "Pema Seldyen",
            email: "psyelden123@gmail.com",
            role: "Employee",
            status: "Active",
        },
        {
            name: "Yangka Pem",
            email: "pemyangka@gmail.com",
            role: "Employee",
            status: "Active",
        },
        {
            name: "Shendrup Palden",
            email: "shelly760@gmail.com",
            role: "Employee",
            status: "Active",
        },
        {
            name: "Jigdrel Chonie Wangmo",
            email: "jigs27684@gmail.com",
            role: "Employee",
            status: "Active",
        },
        {
            name: "Sherab Choden",
            email: "shecho23@gmail.com",
            role: "Employee",
            status: "Active",
        },
    ];

    return (
        <div className="flex-1 bg-[#f0ebff] p-8 min-h-screen font-sans">
            {/* Page Header */}
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Hello Admin,</h1>

            {/* Main Table and Content Wrapper */}
            <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[500px] flex flex-col">
                {/* Top Controls: Search and Add Button */}
                <div className="flex items-center justify-between mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search the users"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-purple-200"
                        />
                    </div>
                    <button className="bg-[#6a89b5] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#5a78a3] transition-colors">
                        Add Users
                    </button>
                </div>

                {/* User Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100">
                                <th className="pb-4 px-2">Name</th>
                                <th className="pb-4 px-2">Email</th>
                                <th className="pb-4 px-2">Role</th>
                                <th className="pb-4 px-2">Status</th>
                                <th className="pb-4 px-2">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            {users.map((user, idx) => (
                                <tr
                                    key={idx}
                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-5 px-2 font-bold text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="py-5 px-2">{user.email}</td>
                                    <td className="py-5 px-2">{user.role}</td>
                                    <td className="py-5 px-2">
                                        <StatusPill status={user.status} />
                                    </td>
                                    <td className="py-5 px-2">
                                        <div className="flex items-center gap-3">
                                            <button className="text-gray-400 hover:text-blue-500 transition-colors">
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer info & Pagination */}
                <div className="mt-6 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>Showing 1-09 of 78</span>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-500">
                            <ChevronLeftIcon className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-500">
                            <ChevronRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
