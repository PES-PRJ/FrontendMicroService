import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/UserManagement"; // Make sure this path is correct
import SideBar from "./components/Sidebar";
import DownloadReports from "./pages/Admin/DownloadReports"; // Make sure this path is correct
import "./index.css";

// This wrapper ensures the Sidebar stays on the left for all admin pages
const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen font-sans">
    <SideBar />
    <div className="flex-1">{children}</div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Login Page: No Sidebar */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard: Sidebar + Dashboard content */}
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        {/* User Management: Sidebar + User Table content */}
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
