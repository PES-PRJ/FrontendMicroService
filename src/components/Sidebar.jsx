import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Squares2X2Icon,
  UserIcon,
  ArrowDownTrayIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import LogoImg from "../assets/Logo.png";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: Squares2X2Icon, path: "/dashboard" },
    { name: "User Management", icon: UserIcon, path: "/users" },
    { name: "Download Reports", icon: ArrowDownTrayIcon, path: "/reports" },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-100 p-4 sticky top-0">
      {/* Logo */}
      <div className="flex justify-center mb-10 mt-4">
        <img src={LogoImg} alt="AMS Logo" className="h-12 object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#f0ebff] text-[#6a89b5]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <item.icon
                className={`h-5 w-5 mr-3 ${isActive ? "text-[#6a89b5]" : "text-gray-400"}`}
              />
              <span className="text-sm font-semibold">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto border-t border-gray-50 pt-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center w-full px-4 py-3 text-gray-500 hover:text-red-500 transition-colors duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
