import React from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import User from '../components/User';

export default function DownloadPage() {
  const navigate = useNavigate();

  const downloadData = [
    {
      fileName: "chart_q1_sales.png",
      date: "2025-05-10",
      type: "image",
      url: "/downloads/chart_q1_sales.png",
    },
    {
      fileName: "summary_report_q1.pdf",
      date: "2025-05-10",
      type: "pdf",
      url: "/downloads/summary_report_q1.pdf",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-green-200 to-green-400">
      <User />

      {/* Main Content */}
      <motion.main
        className="flex-1 px-4 sm:px-6 md:px-10 py-8 md:py-10 text-gray-800 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 md:mb-10 text-emerald-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          📥 Download Center
        </motion.h2>

        <motion.div
          className="bg-white rounded-xl shadow-xl p-6 sm:p-8 mx-auto w-full max-w-6xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Responsive table wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3 min-w-[600px] sm:min-w-full">
              <thead>
                <tr className="text-green-800 text-base sm:text-lg bg-green-100 rounded">
                  <th className="py-3 px-2 sm:px-4 rounded-l-lg min-w-[150px]">📁 File Name</th>
                  <th className="py-3 px-2 sm:px-4 min-w-[110px]">📅 Generated Date</th>
                  <th className="py-3 px-2 sm:px-4 min-w-[100px]">🔍 Preview</th>
                  <th className="py-3 px-2 sm:px-4 rounded-r-lg min-w-[110px]">⬇️ Download</th>
                </tr>
              </thead>
              <tbody>
                {downloadData.map((item, index) => (
                  <motion.tr
                    key={index}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <td className="py-2 px-2 sm:px-4 rounded-l-lg font-medium text-gray-700 whitespace-normal break-words max-w-[150px]">
                      {item.fileName}
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-gray-600 whitespace-nowrap">{item.date}</td>
                    <td className="py-2 px-2 sm:px-4">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.fileName}
                          className="h-10 sm:h-12 w-auto object-contain border rounded shadow-sm"
                        />
                      ) : (
                        <span className="text-gray-500 italic">No preview</span>
                      )}
                    </td>
                    <td className="py-2 px-2 sm:px-4 rounded-r-lg">
                      <a
                        href={item.url}
                        download
                        className="block bg-green-600 text-white text-center px-3 py-1.5 rounded hover:bg-green-700 transition text-sm sm:text-base"
                      >
                        Download
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
