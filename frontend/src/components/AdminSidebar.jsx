import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const AdminData = JSON.parse(localStorage.getItem("user"));
  const AdminName = AdminData?.name || "Admin name";

  // Get the first letter of the admin's name and capitalize it
  const firstLetter = AdminName.charAt(0).toUpperCase();
  const adminInitial = firstLetter || "A"; // Default to 'A' if name is empty

  // Check if current route matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-70 bg-[#1a365d] text-white h-screen p-6 flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center mb-4 gap-4">
          <img
            src="/Logo.svg"
            alt="Logo"
            className="w-16 h-16 rounded-full shadow-lg bg-amber-50"
          />
          <h1 className="text-3xl font-bold mb-1">Formulytics</h1>
        </div>
        <div className="text-sm text-blue-200">Admin Panel</div>
      </div>

      {/* Admin Name */}
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
          <span className="font-medium">{adminInitial}</span>
        </div>
        <div>
          <div className="font-medium">{AdminName}</div>
          <div className="text-xs text-blue-200">Administrator</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/admin") ? "bg-blue-700" : "hover:bg-blue-800"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/admin/users") ? "bg-blue-700" : "hover:bg-blue-800"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              User Management
            </Link>
          </li>
          

          <li>
            <Link
              to="/admin/settings"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/admin/settings")
                  ? "bg-blue-700"
                  : "hover:bg-blue-800"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-blue-800">
        <Link
          to="/login"
          className="flex items-center p-3 rounded-lg hover:bg-blue-800"
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </Link>
      </div>
    </div>
  );
}
