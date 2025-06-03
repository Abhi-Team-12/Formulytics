import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import User from '../components/User';

export default function SettingsPage() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-green-200 to-green-400">
      {/* Sidebar for md+ */}
      <aside className="w-full md:w-60 bg-white shadow-md md:shadow-none">
        <User />
      </aside>

      {/* Main content */}
      <motion.main
        className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Settings title OUTSIDE the box */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-800 mb-4 sm:mb-6 text-center md:text-left w-full max-w-xl">
          ⚙ Settings
        </h2>

        {/* Form Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-xl md:max-w-2xl">
          <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm sm:text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-1">
                Old Password
              </label>
              <input
                type="password"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm sm:text-base"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm sm:text-base"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition text-sm sm:text-base"
            >
              Update Profile
            </button>
          </form>
        </div>
      </motion.main>
    </div>
  );
}

function SidebarButton({ icon, label, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center w-full gap-3 px-3 py-2 bg-white text-green-700 rounded-lg hover:bg-green-100 transition-all duration-300 text-xs sm:text-sm"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span className="text-base sm:text-lg">{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}
