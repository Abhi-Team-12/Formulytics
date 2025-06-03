import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { fetchTotalUsers, fetchTotalFiles } from '../../api/adminApi';

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalFiles, setTotalFiles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [usersRes, filesRes] = await Promise.all([
          fetchTotalUsers(),
          fetchTotalFiles(),
        ]);
        setTotalUsers(usersRes.data.totalUsers);
        setTotalFiles(filesRes.data.totalFiles);
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-lg text-gray-700 text-center">Loading stats...</div>
    );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-green-50 via-white to-green-100">
      {/* Sidebar should be responsive inside AdminSidebar */}
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 md:p-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-8">
          Admin Dashboard
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          <StatCard
            title="Total Users"
            value={totalUsers ?? 0}
            icon="👥"
            bg="bg-green-100"
          />
          <StatCard
            title="Files Uploaded"
            value={totalFiles ?? 0}
            icon="📁"
            bg="bg-yellow-100"
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, bg }) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md transition-transform transform hover:scale-[1.02] hover:shadow-lg ${bg}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-3xl sm:text-4xl">{icon}</div>
        <div className="text-right">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700">{title}</h3>
          <p className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
      </div>
    </div>
  );
}
