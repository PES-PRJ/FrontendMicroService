import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import LoginPage from "./pages/LoginPage";
import SetPasswordPage from "./pages/SetPasswordPage";
import Dashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/UserManagement"; 
import DownloadReports from "./pages/Admin/DownloadReports"; 
import EmployeeDashboard from "./pages/Employee/EmployeeDasboard";
import ManagerDashboard from "./pages/AssetManager/ManagerDashboard";
import Maintenance from "./pages/AssetManager/Maintenance";

// Components
import SideBar from "./components/Sidebar";
import "./index.css";

// Layout for Admin pages
const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen font-sans">
    <SideBar />
    <div className="flex-1">{children}</div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      <Routes>
        {/* 1. Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />

        {/* 2. Admin Routes */}
        <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
        <Route path="/reports" element={<AdminLayout><DownloadReports /></AdminLayout>} />

        {/* 3. Employee Route */}
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

        {/* 4. Manager Route */}
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </div>
  );
}

export default App;