import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import SetPasswordPage from "./pages/SetPasswordPage"; // New Import
import Dashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/UserManagement"; 
import SideBar from "./components/Sidebar";
import DownloadReports from "./pages/Admin/DownloadReports"; 
import "./index.css";

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
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <AdminLayout>
              <DownloadReports />
            </AdminLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;