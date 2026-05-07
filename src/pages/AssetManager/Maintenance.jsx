import React, { useState } from "react";
import { 
  ChevronLeftIcon, 
  TrashIcon, 
  MagnifyingGlassIcon 
} from "@heroicons/react/24/outline";
import ManagerSidebar from "../../components/ManagerSidebar";

const Maintenance = () => {
  const [viewDetail, setViewDetail] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const issues = [
    { id: 1, name: "Zimba", description: "Battery issue and it overheats very fast", sn: "SN67890", asset: "Dell Laptop", loc: "Office 101", cat: "Electronics", email: "zimba@gmail.com" },
    { id: 2, name: "Lhaki Yangden", description: "Someone broke my desk", sn: "SN54321", asset: "Office Chair", loc: "Office 104", cat: "Furniture", email: "lhaki@gmail.com" },
    { id: 3, name: "Jigdrel Chonie Wangmo", description: "Needs printer color", sn: "SN11223", asset: "HP Printer", loc: "Office 101", cat: "Electronics", email: "jigs@gmail.com" },
  ];

  const handleView = (issue) => {
    setSelectedIssue(issue);
    setViewDetail(true);
  };

  return (
    <div className="flex min-h-screen font-sans bg-[#f0ebff]">
      <ManagerSidebar />
      
      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-800 mb-8">Hello Lungten,</h1>

          {!viewDetail ? (
            /* LIST VIEW */
            <div className="bg-white rounded-2xl p-8 shadow-sm min-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-80">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 bg-[#f4f6f9] border-none rounded-lg text-sm outline-none" />
                </div>
                <TrashIcon className="h-6 w-6 text-red-500 cursor-pointer" />
              </div>

              <div className="space-y-4">
                {issues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-4 w-1/4">
                      <input type="checkbox" className="rounded border-gray-300 text-[#6a89b5] focus:ring-[#6a89b5]" />
                      <span className="text-sm font-bold text-gray-700">{issue.name}</span>
                    </div>
                    <div className="flex-1 text-sm text-gray-500 truncate px-4">
                      {issue.description}
                    </div>
                    <button 
                      onClick={() => handleView(issue)}
                      className="text-[#6a89b5] text-sm font-bold hover:underline"
                    >
                      view
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* DETAIL FORM VIEW */
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <button onClick={() => setViewDetail(false)} className="mb-6 hover:bg-gray-100 p-1 rounded-full transition-colors">
                <ChevronLeftIcon className="h-6 w-6 text-gray-400" />
              </button>

              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Serial No.</label>
                    <input disabled value={selectedIssue?.sn} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Asset Name</label>
                    <input disabled value={selectedIssue?.asset} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Location</label>
                    <input disabled value={selectedIssue?.loc} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Category</label>
                    <input disabled value={selectedIssue?.cat} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Employee Name</label>
                    <input disabled value={selectedIssue?.name} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Employee Email</label>
                    <input disabled value={selectedIssue?.email} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none" />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Issue Description</label>
                    <textarea disabled rows={3} value={selectedIssue?.description} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none resize-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Maintain</label>
                    <select className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none">
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Maintain Date</label>
                    <input type="date" className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-400 outline-none" />
                  </div>
                  <div className="pt-10 flex justify-end">
                    <button className="bg-[#4e89ff] text-white font-bold py-3 px-16 rounded-xl shadow-lg hover:bg-blue-600 transition-colors">
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Maintenance;