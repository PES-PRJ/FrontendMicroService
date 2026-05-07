import React, { useState } from "react";
import { XMarkIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import ManagerSidebar from "../../components/ManagerSidebar";

const ManagerDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [currentAsset, setCurrentAsset] = useState({
    sn: "",
    name: "",
    loc: "",
    cat: "Electronics",
    user: "",
    email: ""
  });

  const [assets, setAssets] = useState([
    { sn: "SN67890", name: "Dell Laptop", loc: "Office 101", cat: "Electronics", user: "Zimba", email: "zimba123@gmail.com" },
    { sn: "SN54321", name: "Office Chair", loc: "Office 104", cat: "Furniture", user: "Lhaki Yangden", email: "lhaki@gmail.com" },
    { sn: "SN12378", name: "Air Conditioner", loc: "HR Office", cat: "Appliance", user: "Jigdrel Chonie", email: "jigs@gmail.com" },
  ]);

  const handleEditClick = (asset) => {
    setCurrentAsset(asset);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setCurrentAsset({ sn: `SN${Math.floor(Math.random() * 90000)}`, name: "", loc: "", cat: "Electronics", user: "", email: "" });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setAssets(assets.map(a => a.sn === currentAsset.sn ? currentAsset : a));
    } else {
      setAssets([...assets, currentAsset]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen font-sans bg-[#f0ebff]">
      <ManagerSidebar />

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-800 mb-8">Hello Lungten,</h1>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-72">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input type="text" placeholder="Search assets" className="w-full pl-10 pr-4 py-2 bg-[#f4f6f9] border-none rounded-lg text-sm outline-none" />
              </div>
              <button onClick={handleAddClick} className="bg-[#6a89b5] text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm">
                ADD Asset
              </button>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-gray-400 uppercase border-b border-gray-50">
                  <th className="pb-4 px-2">Serial No.</th>
                  <th className="pb-4 px-2">NAME</th>
                  <th className="pb-4 px-2">Location</th>
                  <th className="pb-4 px-2">CATEGORY</th>
                  <th className="pb-4 px-2">Assigned to</th>
                  <th className="pb-4 px-2 text-center">Edit</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {assets.map((asset, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-5 px-2 font-bold text-gray-700">{asset.sn}</td>
                    <td className="py-5 px-2 text-gray-500">{asset.name}</td>
                    <td className="py-5 px-2 text-gray-500">{asset.loc}</td>
                    <td className="py-5 px-2 text-gray-500">{asset.cat}</td>
                    <td className="py-5 px-2">
                      <div className="font-bold text-gray-700">{asset.user}</div>
                      <div className="text-[11px] text-gray-400">{asset.email}</div>
                    </td>
                    <td className="py-5 px-2">
                      <div className="flex justify-center gap-3">
                        <PencilSquareIcon 
                          className="h-5 w-5 text-gray-400 cursor-pointer hover:text-[#6a89b5]" 
                          onClick={() => handleEditClick(asset)}
                        />
                        <TrashIcon 
                          className="h-5 w-5 text-red-400 cursor-pointer hover:text-red-600" 
                          onClick={() => setAssets(assets.filter(a => a.sn !== asset.sn))}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Modal (Edit/Add) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 relative">
              <button type="button" onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
              
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-gray-700">{isEditMode ? 'Edit Asset' : 'Add New Asset'}</h2>
                
                <div>
                  <label className="block text-[13px] font-bold text-gray-600 mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    value={currentAsset.name}
                    onChange={(e) => setCurrentAsset({...currentAsset, name: e.target.value})}
                    placeholder="Enter an asset name"
                    className="w-full bg-[#f4f6f9] border-none rounded-lg p-3 text-sm outline-none text-gray-700 font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-600 mb-2">Location</label>
                  <input 
                    type="text" 
                    required
                    value={currentAsset.loc}
                    onChange={(e) => setCurrentAsset({...currentAsset, loc: e.target.value})}
                    placeholder="Enter the location"
                    className="w-full bg-[#f4f6f9] border-none rounded-lg p-3 text-sm outline-none text-gray-700 font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-600 mb-2">Category</label>
                  <div className="relative">
                    <select 
                      value={currentAsset.cat}
                      onChange={(e) => setCurrentAsset({...currentAsset, cat: e.target.value})}
                      className="w-full bg-[#f4f6f9] appearance-none border-none rounded-lg p-3 text-sm outline-none text-gray-700 font-medium cursor-pointer"
                    >
                      <option>Electronics</option>
                      <option>Furniture</option>
                      <option>Appliance</option>
                    </select>
                    <ChevronDownIcon className="h-4 w-4 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-600 mb-2">Assign to</label>
                  <div className="relative">
                    <select 
                      value={currentAsset.user}
                      required
                      onChange={(e) => setCurrentAsset({...currentAsset, user: e.target.value, email: `${e.target.value.toLowerCase().replace(/\s/g, '')}@gmail.com`})}
                      className="w-full bg-[#f4f6f9] appearance-none border-none rounded-lg p-3 text-sm outline-none text-gray-700 font-medium cursor-pointer"
                    >
                      <option value="">Select an employee</option>
                      <option value="Zimba">Zimba</option>
                      <option value="Lhaki Yangden">Lhaki Yangden</option>
                      <option value="Jigdrel Chonie">Jigdrel Chonie</option>
                    </select>
                    <ChevronDownIcon className="h-4 w-4 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <button type="submit" className="bg-[#7e9bbd] hover:bg-[#6a89b5] text-white font-bold py-3 px-14 rounded-xl shadow-md transition-all">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;