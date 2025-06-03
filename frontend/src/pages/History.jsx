import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";
import User from "../components/User";

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api/upload";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch files");

        const files = await response.json();

        const formatted = files.map((file) => ({
          id: file._id,
          fileName: file.fileName,
          date: new Date(file.createdAt).toISOString().split("T")[0],
        }));

        setHistoryData(formatted);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFiles();
  }, [token]);

  const handleDelete = async (idToDelete) => {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${idToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      setHistoryData((prev) => prev.filter((file) => file.id !== idToDelete));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-green-100 to-green-200">
      <User />

      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 md:py-10 text-gray-800 overflow-auto">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-10 text-emerald-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          📂 Upload History
        </motion.h2>

        <motion.div
          className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 mx-auto w-full max-w-6xl overflow-x-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <table className="w-full min-w-[480px] text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-green-800 text-sm sm:text-base md:text-lg bg-green-100 rounded">
                <th className="py-2 px-2 sm:px-4 rounded-l-lg min-w-[150px]">📁 File Name</th>
                <th className="py-2 px-2 sm:px-4 min-w-[110px]">📅 Upload Date</th>
                <th className="py-2 px-2 sm:px-4 rounded-r-lg text-center min-w-[90px]">🗑️ Action</th>
              </tr>
            </thead>
            <tbody>
              {historyData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500 text-sm sm:text-base">
                    No uploads found.
                  </td>
                </tr>
              ) : (
                historyData.map((item) => (
                  <motion.tr
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="py-2 px-2 sm:px-4 rounded-l-lg font-medium text-gray-700 text-xs sm:text-sm md:text-base break-words max-w-[150px]">
                      {item.fileName}
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm md:text-base whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-center rounded-r-lg">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 transition p-2 sm:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete"
                        aria-label={`Delete file ${item.fileName}`}
                      >
                        <FaTrashAlt size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </main>
    </div>
  );
};

export default HistoryPage;
