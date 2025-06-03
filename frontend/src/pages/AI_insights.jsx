import React from "react";
import { motion } from 'framer-motion';
import User from '../components/User';

export default function AIInsightsPage() {
  const insightsData = [
    {
      title: "Q1 Sales Analysis",
      date: "2025-05-12",
      insight: "Sales increased by 18% compared to the previous quarter, with the highest growth in the North region.",
    },
    {
      title: "Product Performance",
      date: "2025-05-15",
      insight: "Product Z outperformed all others with a 35% increase in customer preference due to seasonal trends.",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-b from-green-200 to-green-400 min-h-screen">
      <User />

      {/* Main Content */}
      <motion.main
        className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 text-gray-800 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-10 text-emerald-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🧠 AI Insights
        </motion.h2>

        <motion.div
          className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 mx-auto w-full max-w-xs sm:max-w-lg md:max-w-6xl space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {insightsData.map((item, index) => (
            <motion.div
              key={index}
              className="bg-emerald-50 p-3 sm:p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-emerald-700">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">🗓️ {item.date}</p>
              <p className="text-gray-700 text-sm sm:text-base md:text-base">{item.insight}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}
