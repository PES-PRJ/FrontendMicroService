import React, { useState, useEffect } from "react";
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// Database key to User-Facing label mapping dictionary
const ROLE_LABELS = {
    EMPLOYEE: "Employee",
    ASSETMANAGER: "Asset Manager"
};

const StatusPill = ({ password }) => {
    const isActive = password !== null && password !== "";
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {isActive ? "Active" : "Pending"}
        </span>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null); 
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "EMPLOYEE" });

    const API_URL = "http://localhost:8765/api/users";
    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
        try {
            const response = await fetch(API_URL, { headers: { "Authorization": `Bearer ${token}` } });
            if (response.ok) setUsers(await response.json());
        } catch (error) { toast.error("Failed to load users"); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingUser ? "PUT" : "POST";
        const url = editingUser ? `${API_URL}/${editingUser.id}` : API_URL;

        const payload = {
            name: formData.name,
            email: formData.email,
            role: { name: formData.role } 
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success(editingUser ? "Role & info updated!" : "Invitation sent!");
                setIsModalOpen(false);
                fetchUsers();
            } else { toast.error("Update failed. Verify API connection."); }
        } catch (error) { toast.error("Network error"); }
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/${deleteConfirmId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success("User deleted");
                setDeleteConfirmId(null);
                fetchUsers();
            }
        } catch (error) { toast.error("Delete failed"); }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 bg-[#f0ebff] p-8 min-h-screen font-sans text-gray-800">
            <h1 className="text-2xl font-bold mb-6">Staff Management</h1>

            <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[500px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search staff..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-200"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => { setEditingUser(null); setFormData({name:"", email:"", role:"EMPLOYEE"}); setIsModalOpen(true); }}
                        className="bg-[#6a89b5] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#5a78a3] transition-all"
                    >
                        Add New Staff
                    </button>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="text-sm font-bold text-gray-500 uppercase border-b border-gray-100">
                            <th className="pb-4 px-2">Name</th>
                            <th className="pb-4 px-2">Email</th>
                            <th className="pb-4 px-2">Role</th>
                            <th className="pb-4 px-2">Status</th>
                            <th className="pb-4 px-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-5 px-2 font-bold">{user.name}</td>
                                <td className="py-5 px-2 text-gray-600">{user.email}</td>
                                {/* Updated role rendering using the map dictionary lookup */}
                                <td className="py-5 px-2 font-medium">
                                    {ROLE_LABELS[user.role?.name] || user.role?.name || "N/A"}
                                </td>
                                <td className="py-5 px-2">
                                    <StatusPill password={user.password} />
                                </td>
                                <td className="py-5 px-2 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button onClick={() => { setEditingUser(user); setFormData({name: user.name, email: user.email, role: user.role.name}); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => setDeleteConfirmId(user.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD/EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-bold mb-6">{editingUser ? "Edit Profile" : "Invite Staff"}</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text" placeholder="Full Name" required 
                                className="w-full border rounded-lg p-3 outline-none focus:border-blue-500 transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <input 
                                type="email" placeholder="Email Address" required
                                className="w-full border rounded-lg p-3 outline-none focus:border-blue-500 transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            <select 
                                className="w-full border rounded-lg p-3 outline-none focus:border-blue-500 transition-all cursor-pointer"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="EMPLOYEE">Employee</option>
                                <option value="ASSETMANAGER">Asset Manager</option>
                            </select>
                            <button type="submit" className="w-full bg-[#6a89b5] text-white py-3.5 rounded-lg font-bold shadow-lg hover:bg-[#5a78a3] active:scale-[0.98] transition-all">
                                {editingUser ? "Save Changes" : "Send Email Invitation"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Delete User?</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            This action cannot be undone. All data associated with this user will be removed.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button 
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;