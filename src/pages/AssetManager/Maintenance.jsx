import React, { useState, useEffect } from "react";
import { 
  ChevronLeftIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import ManagerSidebar from "../../components/ManagerSidebar";

const Maintenance = () => {
  const [viewDetail, setViewDetail] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  // Dynamic API Data Hooks
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // Checkbox Tracking State
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);

  // Tracking Action Form Context
  const [ticketStatus, setTicketStatus] = useState("REPORTED");
  const [managerNotes, setManagerNotes] = useState("");

  // UI Modal Manager State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "confirm", 
    title: "",
    message: "",
    onConfirm: null,
    isProcessing: false
  });

  const token = localStorage.getItem("token");

  // Fetch tickets on lifecycle mount
  useEffect(() => {
    fetchActiveTickets();
  }, []);

  // GET: Fetch all registered tracking claims from the gateway
  const fetchActiveTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8765/api/maintenance/tickets", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Could not load global asset maintenance directory.");
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (ticket) => {
    setSelectedIssue(ticket);
    setTicketStatus(ticket.status || "REPORTED");
    setManagerNotes(ticket.managerNotes || "");
    setViewDetail(true);
  };

  // Close Modal Utility
  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false, isProcessing: false }));
  };

  // PUT: Update processing progress changes downstream to PostgreSQL
  const handleUpdateTicket = async () => {
    setSubmitLoading(true);
    try {
      const response = await fetch(`http://localhost:8765/api/maintenance/tickets/${selectedIssue.id}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: ticketStatus,
          managerNotes: managerNotes
        }),
      });

      if (!response.ok) throw new Error("Server rejected status property write handshake.");
      
      setViewDetail(false);
      fetchActiveTickets(); 
      
      setModalConfig({
        isOpen: true,
        type: "alert",
        title: "Update Successful",
        message: `Ticket #00${selectedIssue.id} status tracking records have been safely written down.`,
        onConfirm: closeModal
      });
    } catch (err) {
      setModalConfig({
        isOpen: true,
        type: "alert",
        title: "Operation Failed",
        message: err.message,
        onConfirm: closeModal
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // DELETE: Trigger backend endpoint removal handshake
  const handleDeleteTicket = (ticketId) => {
    setModalConfig({
      isOpen: true,
      type: "confirm",
      title: "Confirm Purge Operation",
      message: `Are you absolutely sure you want to permanently delete ticket #00${ticketId}? This action cannot be undone.`,
      isProcessing: false,
      onConfirm: async () => {
        setModalConfig(prev => ({ ...prev, isProcessing: true }));
        try {
          const response = await fetch(`http://localhost:8765/api/maintenance/tickets/${ticketId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) throw new Error("Failed to delete the maintenance record. Verify permissions.");

          setViewDetail(false);
          setSelectedTicketIds(prev => prev.filter(id => id !== ticketId));
          fetchActiveTickets();
          
          setModalConfig({
            isOpen: true,
            type: "alert",
            title: "Record Dropped",
            message: `Maintenance ticket #00${ticketId} has been successfully cleared from Postgres logs.`,
            onConfirm: closeModal
          });
        } catch (err) {
          setModalConfig({
            isOpen: true,
            type: "alert",
            title: "Network Deletion Error",
            message: err.message,
            onConfirm: closeModal
          });
        }
      }
    });
  };

  // Bulk Deletion for checkboxes in List View
  const handleBulkDelete = () => {
    if (selectedTicketIds.length === 0) return;

    setModalConfig({
      isOpen: true,
      type: "confirm",
      title: "Confirm Bulk Purge",
      message: `Are you sure you want to delete all ${selectedTicketIds.length} selected ticket logs simultaneously?`,
      isProcessing: false,
      onConfirm: async () => {
        setModalConfig(prev => ({ ...prev, isProcessing: true }));
        try {
          await Promise.all(
            selectedTicketIds.map(id =>
              fetch(`http://localhost:8765/api/maintenance/tickets/${id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              })
            )
          );

          setSelectedTicketIds([]);
          fetchActiveTickets();

          setModalConfig({
            isOpen: true,
            type: "alert",
            title: "Batch Deletion Done",
            message: "All checked tickets cleared successfully.",
            onConfirm: closeModal
          });
        } catch (err) {
          setModalConfig({
            isOpen: true,
            type: "alert",
            title: "Batch Failure Context",
            message: "An administrative error occurred during microservice loop processing.",
            onConfirm: closeModal
          });
        }
      }
    });
  };

  // Toggle checkbox utility selection mapping
  const handleCheckboxChange = (ticketId) => {
    setSelectedTicketIds((prev) =>
      prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]
    );
  };

  // Live client-side string filter logic
  const filteredTickets = tickets.filter((ticket) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (ticket.id && ticket.id.toString().includes(searchLower)) ||
      (ticket.assetSerialNo && ticket.assetSerialNo.toLowerCase().includes(searchLower)) ||
      (ticket.reportedByEmail && ticket.reportedByEmail.toLowerCase().includes(searchLower)) ||
      (ticket.description && ticket.description.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="flex min-h-screen font-sans bg-[#f0ebff]">
      <ManagerSidebar />
      
      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          {/* Simplified static header layout */}
          <h1 className="text-xl font-semibold text-gray-800 mb-8">Maintenance</h1>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm border border-red-100">
              <strong>System Connectivity Alert:</strong> {error}
            </div>
          )}

          {!viewDetail ? (
            /* LIST VIEW */
            <div className="bg-white rounded-2xl p-8 shadow-sm min-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-80">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by Email, Serial, or ID..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#f4f6f9] border-none rounded-lg text-sm outline-none text-gray-700" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  {selectedTicketIds.length > 0 && (
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded animate-fade-in">
                      {selectedTicketIds.length} Selected
                    </span>
                  )}
                  <TrashIcon 
                    onClick={handleBulkDelete}
                    className={`h-6 w-6 transition-colors ${
                      selectedTicketIds.length > 0 ? "text-red-500 cursor-pointer hover:text-red-700" : "text-gray-200 cursor-not-allowed"
                    }`} 
                  />
                </div>
              </div>

              {loading ? (
                <p className="text-gray-400 text-sm animate-pulse">Fetching global ticket directory logs...</p>
              ) : filteredTickets.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No open tracking claims match parameters.</p>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-4 w-1/3">
                        <input 
                          type="checkbox" 
                          checked={selectedTicketIds.includes(ticket.id)}
                          onChange={() => handleCheckboxChange(ticket.id)}
                          className="rounded border-gray-300 text-[#6a89b5] focus:ring-[#6a89b5]" 
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-gray-400">#00{ticket.id}</span>
                          <span className="text-sm font-bold text-gray-700 truncate max-w-[200px]" title={ticket.reportedByEmail}>
                            {ticket.reportedByEmail}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 text-sm text-gray-500 font-medium px-4">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 font-bold mr-3">{ticket.assetSerialNo}</span>
                        <span className="text-gray-500">{ticket.description}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ticket.status}
                        </span>
                        <button 
                          onClick={() => handleView(ticket)}
                          className="text-[#6a89b5] text-sm font-bold hover:underline"
                        >
                          view
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* DETAIL FORM VIEW */
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setViewDetail(false)} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
                  <ChevronLeftIcon className="h-6 w-6 text-gray-400" />
                </button>
                <button 
                  onClick={() => handleDeleteTicket(selectedIssue?.id)}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition-colors border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete Ticket
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Ticket Reference ID</label>
                    <input disabled value={`#00${selectedIssue?.id}`} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-600 font-bold outline-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Target Asset Serial No.</label>
                    <input disabled value={selectedIssue?.assetSerialNo} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Issue Classification</label>
                    <input disabled value={selectedIssue?.issueType ? selectedIssue.issueType.replace(/_/g, ' ') : ""} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none uppercase" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Reported By (User Email)</label>
                    <input disabled value={selectedIssue?.reportedByEmail} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Date Logged</label>
                    <input disabled value={selectedIssue?.createdAt ? new Date(selectedIssue.createdAt).toLocaleString() : "N/A"} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none" />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">User Symptoms Report</label>
                    <textarea disabled rows={3} value={selectedIssue?.description} className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-3 text-sm text-gray-500 outline-none resize-none" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Modify Processing Status</label>
                    <select 
                      value={ticketStatus}
                      onChange={(e) => setTicketStatus(e.target.value)}
                      className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-4 text-sm text-gray-700 font-semibold outline-none focus:ring-1 focus:ring-[#6a89b5]"
                    >
                      <option value="REPORTED">Reported / Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved / Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-400 uppercase">Manager Diagnostic Notes</label>
                    <textarea 
                      rows={4} 
                      value={managerNotes}
                      onChange={(e) => setManagerNotes(e.target.value)}
                      placeholder="Input repair tracking progress information or hardware technician assessments details..."
                      className="w-full mt-1 bg-[#f4f6f9] border-none rounded-lg p-4 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-[#6a89b5] resize-none" 
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={handleUpdateTicket}
                      disabled={submitLoading}
                      className="bg-[#4e89ff] hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-16 rounded-xl shadow-lg transition-colors w-full"
                    >
                      {submitLoading ? "Processing Update..." : "Commit Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- REUSABLE TAILWIND NOTIFICATION MODAL DIALOG --- */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all border border-gray-100 animate-slide-up">
            <div className="flex items-start gap-4">
              {modalConfig.type === "confirm" ? (
                <div className="p-3 bg-red-50 rounded-xl text-red-500">
                  <ExclamationTriangleIcon className="h-6 w-6" />
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{modalConfig.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{modalConfig.message}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-50 pt-4">
              {modalConfig.type === "confirm" ? (
                <>
                  <button 
                    disabled={modalConfig.isProcessing}
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={modalConfig.isProcessing}
                    onClick={modalConfig.onConfirm}
                    className="px-5 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-md transition-colors disabled:bg-gray-400"
                  >
                    {modalConfig.isProcessing ? "Processing..." : "Confirm Action"}
                  </button>
                </>
              ) : (
                <button 
                  onClick={modalConfig.onConfirm}
                  className="px-6 py-2 text-sm font-bold text-white bg-[#4e89ff] hover:bg-blue-600 rounded-xl shadow-md transition-colors w-full sm:w-auto"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;