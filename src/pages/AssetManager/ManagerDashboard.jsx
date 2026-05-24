import React, { useState, useEffect } from "react";
import { XMarkIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ChevronDownIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import ManagerSidebar from "../../components/ManagerSidebar";

const ManagerDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // NEW: State variables to control the custom Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assetIdToDelete, setAssetIdToDelete] = useState(null);
  
  const [currentAsset, setCurrentAsset] = useState({
    id: null,
    serialNo: "",
    name: "",
    location: "",
    category: "Laptop",
    assignedTo: ""
  });

  const BASE_URL = "http://localhost:8765/api/assets";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    };
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch(BASE_URL, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      } else if (response.status === 403) {
        toast.error("Access Forbidden: Invalid Asset Manager Token.");
      } else {
        toast.error("Failed to load assets from server.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Network error: Server may be down.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleEditClick = (asset) => {
    setCurrentAsset({
      id: asset.id,
      serialNo: asset.serialNo,
      name: asset.name,
      location: asset.location,
      category: asset.category,
      assignedTo: asset.assignedTo || ""
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setCurrentAsset({
      id: null,
      serialNo: `AST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      location: "",
      category: "Laptop",
      assignedTo: ""
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAsset.serialNo || !currentAsset.name || !currentAsset.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const url = isEditMode ? `${BASE_URL}/${currentAsset.id}` : BASE_URL;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          serialNo: currentAsset.serialNo,
          name: currentAsset.name,
          location: currentAsset.location,
          category: currentAsset.category,
          assignedTo: currentAsset.assignedTo || null
        }),
      });

      if (response.ok) {
        toast.success(isEditMode ? "Asset updated successfully!" : "Asset added successfully!");
        setIsModalOpen(false);
        fetchAssets();
      } else {
        const errorData = await response.text();
        toast.error(errorData || "Operation failed.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to sync structural state change.");
    }
  };

  // NEW: Triggers the Delete confirmation UI step instead of browser native alert
  const openDeleteConfirmation = (id) => {
    setAssetIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // NEW: Processes the backend deletion request after user clicks confirm inside the modal
  const handleConfirmDelete = async () => {
    if (!assetIdToDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/${assetIdToDelete}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success("Asset wiped out successfully.");
        fetchAssets();
      } else {
        toast.error("Failed to delete the asset.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Network connection loss handling resource deletion.");
    } finally {
      // Clean up modal states
      setIsDeleteModalOpen(false);
      setAssetIdToDelete(null);
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen font-sans bg-[#f0ebff]">
      <ManagerSidebar />

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-800 mb-8">Asset Manager Workspace</h1>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-72">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search assets..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f4f6f9] border-none rounded-lg text-sm outline-none" 
                />
              </div>
              <button onClick={handleAddClick} className="bg-[#6a89b5] text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm hover:bg-[#5a78a3]">
                ADD ASSET
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-sm text-gray-500 font-medium">Loading network state data variables...</div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-400">No assets found in target registry database.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-black text-gray-400 uppercase border-b border-gray-50">
                    <th className="pb-4 px-2">Serial No.</th>
                    <th className="pb-4 px-2">NAME</th>
                    <th className="pb-4 px-2">Location</th>
                    <th className="pb-4 px-2">CATEGORY</th>
                    <th className="pb-4 px-2">Assigned User (Email)</th>
                    <th className="pb-4 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-5 px-2 font-bold text-gray-700">{asset.serialNo}</td>
                      <td className="py-5 px-2 text-gray-500">{asset.name}</td>
                      <td className="py-5 px-2 text-gray-500">{asset.location}</td>
                      <td className="py-5 px-2 text-gray-500">{asset.category}</td>
                      <td className="py-5 px-2">
                        <div className="font-bold text-gray-700">
                          {asset.assignedTo ? asset.assignedTo.split('@')[0] : "Unassigned"}
                        </div>
                        <div className="text-[11px] text-gray-400">{asset.assignedTo || "—"}</div>
                      </td>
                      <td className="py-5 px-2">
                        <div className="flex justify-center gap-3">
                          <PencilSquareIcon 
                            className="h-5 w-5 text-gray-400 cursor-pointer hover:text-[#6a89b5]" 
                            onClick={() => handleEditClick(asset)}
                          />
                          <TrashIcon 
                            className="h-5 w-5 text-red-400 cursor-pointer hover:text-red-600" 
                            onClick={() => openDeleteConfirmation(asset.id)} // CHANGED HERE
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Form Modal (Edit/Add) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 relative">
              <button type="button" onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
              
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-gray-700">{isEditMode ? 'Edit Existing Asset' : 'Register New Asset'}</h2>
                
                <div>
                  <label className="block text-[13px] font-bold text-gray-600 mb-2">Serial Number</label>
                  <input 
                    type="text" 
                    required
                    disabled={isEditMode}
                    value={currentAsset.serialNo}
                    onChange={(e) => setCurrentAsset({...currentAsset, serialNo: e.target.value})}
                    className="w-full bg-[#f4f6f9] border-none rounded-lg p-3 text-sm outline-none text-gray-700 font-medium disabled:opacity-50" 
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-600 mb-2">Asset Hardware Model Name</label>
                  <input 
                    type="text" 
                    required
                    value={currentAsset.name}
                    onChange={(e) => setCurrentAsset({...currentAsset, name: e.target.value})}
                    placeholder="e.g. ThinkPad L14 Gen 4"
                    className="w-full bg-[#f4f6f9] border-none rounded-lg p-3 text-sm outline-none text-gray-700 font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-600 mb-2">Physical Location</label>
                  <input 
                    type="text" 
                    required
                    value={currentAsset.location}
                    onChange={(e) => setCurrentAsset({...currentAsset, location: e.target.value})}
                    placeholder="e.g. Lab 3, IT Block"
                    className="w-full bg-[#f4f6f9] border-none rounded-lg p-3 text-sm outline-none text-gray-700 font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-600 mb-2">Category Mappings</label>
                  <div className="relative">
                    <select 
                      value={currentAsset.category}
                      onChange={(e) => setCurrentAsset({...currentAsset, category: e.target.value})}
                      className="w-full bg-[#f4f6f9] appearance-none border-none rounded-lg p-3 text-sm outline-none text-gray-700 font-medium cursor-pointer"
                    >
                      <option value="Laptop">Laptop</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Server">Server</option>
                      <option value="Networking Device">Networking Device</option>
                      <option value="Projector">Projector</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Appliance">Appliance</option>
                    </select>
                    <ChevronDownIcon className="h-4 w-4 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-600 mb-2">Assign to Employee (Email Key)</label>
                  <input 
                    type="email" 
                    value={currentAsset.assignedTo}
                    onChange={(e) => setCurrentAsset({...currentAsset, assignedTo: e.target.value})}
                    placeholder="employee.gcit@rub.edu.bt"
                    className="w-full bg-[#f4f6f9] border-none rounded-lg p-3 text-sm outline-none text-gray-700 font-medium" 
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <button type="submit" className="bg-[#7e9bbd] hover:bg-[#6a89b5] text-white font-bold py-3 px-14 rounded-xl shadow-md transition-all">
                    {isEditMode ? 'Save Changes' : 'Register Asset'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* NEW: Sleek Tailwind Custom Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center relative border border-gray-100">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to permanently delete this asset? This action cannot be undone.
              </p>
              
              <div className="flex justify-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 px-6 rounded-xl text-sm transition-all outline-none"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleConfirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-6 rounded-xl text-sm shadow-sm transition-all outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;