import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaUpload,
  FaChartBar,
  FaHistory,
  FaDownload,
  FaBrain,
  FaCog,
  FaThLarge,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { LuLogOut } from "react-icons/lu";
import { FiMenu, FiX } from "react-icons/fi";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));
  const userName = userData?.name || "User name";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Close sidebar on window resize if wider than md (768px)
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-green-200 to-green-400">
      {/* Mobile Top Bar */}
      <div className="md:hidden p-4 flex justify-between items-center bg-green-700 text-white">
        <span className="text-lg font-semibold">Formulytics</span>
        <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <FiMenu size={28} />
        </button>
      </div>

      {/* Sidebar Overlay on mobile when open */}
      <AnimatePresence>
        {sidebarOpen && window.innerWidth < 768 && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            className="
              fixed md:static top-0 left-0 z-50
              w-64 h-full md:h-auto
              bg-green-700 text-white flex flex-col px-6 py-6 space-y-5 md:space-y-6
              shadow-lg md:shadow-none
            "
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.4 }}
          >
            {/* Close button for mobile */}
            {window.innerWidth < 768 && (
              <button
                className="self-end mb-4 p-2 rounded-md hover:bg-green-600"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close Sidebar"
              >
                <FiX size={24} />
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src="./Logo.svg"
                alt="Logo"
                className="w-12 h-12 bg-amber-50 rounded-full shadow-md"
              />
              <h1 className="text-xl font-bold">Formulytics</h1>
            </div>

            {/* User */}
            <div className="text-white font-medium text-lg mb-4 truncate">
              👤 {userName}
            </div>

            {/* Menu */}
            <SidebarButton icon={<FaThLarge />} label="Dashboard" onClick={() => navigate("/dashboard")} />
            <SidebarButton icon={<FaUpload />} label="Upload Excel" onClick={() => navigate("/upload")} />
            <SidebarButton icon={<FaChartBar />} label="Analyze Data" onClick={() => navigate("/analyze")} />
            <SidebarButton icon={<FaHistory />} label="History" onClick={() => navigate("/history")} />
            {/* <SidebarButton icon={<FaDownload />} label="Downloads" onClick={() => navigate("/downloads")} /> */}
            <SidebarButton icon={<FaBrain />} label="AI Insights" onClick={() => navigate("/ai-insights")} />
            <SidebarButton icon={<FaCog />} label="Settings" onClick={() => navigate("/settings")} />
            <SidebarButton icon={<LuLogOut />} label="Logout" onClick={handleLogout} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content placeholder */}
      {/* <main className="flex-1 p-6 md:ml-64">
        Replace this with your actual content
        <h2 className="text-2xl font-semibold text-green-900 mb-6">Welcome, {userName}!</h2>
      </main> */}
    </div>
  );
}

function SidebarButton({ icon, label, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="
        flex items-center w-full gap-3 px-3 py-2 sm:px-4 sm:py-2
        bg-white text-green-700 rounded-lg hover:bg-green-100 transition-all duration-300 font-medium
        text-sm sm:text-base
      "
      whileHover={{ scale: 1.05 }}
      aria-label={label}
    >
      <span className="text-lg sm:text-xl">{icon}</span>
      <span className="truncate">{label}</span>
    </motion.button>
  );
}
