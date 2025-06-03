import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUpload, FaChartBar, FaHistory, FaDownload, FaBrain, FaCog, FaThLarge
} from 'react-icons/fa';

export default function AIInsightsPage() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));
  const userName = userData?.name || 'User';

  const [selectedFile] = useState('Chart_Data_For_All_Chart_Types.xlsx');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('Bar');

  const axisOptions = [
    'Category', 'Value A', 'Value B', 'Value C', 'Value X',
    'Value Y', 'Size', 'Stage', 'Increase', 'Decrease'
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-green-200 to-green-400">
      {/* Sidebar */}
      <motion.aside
        className="
          w-full md:w-64 bg-green-700 text-white 
          flex md:flex-col flex-row md:items-start items-center 
          px-4 md:px-6 py-2 md:py-8 space-x-0 md:space-x-0 space-y-0 md:space-y-4
          overflow-x-auto md:overflow-visible
          scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-green-700
        "
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 50 }}
      >
        <div className="flex items-center gap-2 mb-0 md:mb-6 flex-shrink-0">
          <div className="text-white text-3xl font-bold">F</div>
          <h1 className="text-xl font-semibold tracking-wide hidden md:block">Formulytics</h1>
        </div>

        <div className="flex md:flex-col flex-row md:space-y-4 space-x-2 md:space-x-0">
          <SidebarButton icon={<FaThLarge />} label="Dashboard" onClick={() => navigate('/dashboard')} />
          <SidebarButton icon={<FaUpload />} label="Upload Excel" onClick={() => navigate('/upload')} />
          <SidebarButton icon={<FaChartBar />} label="Analyze Data" onClick={() => navigate('/analyze')} />
          <SidebarButton icon={<FaHistory />} label="History" onClick={() => navigate('/history')} />
          <SidebarButton icon={<FaDownload />} label="Downloads" onClick={() => navigate('/downloads')} />
          <SidebarButton icon={<FaBrain />} label="AI Insights" onClick={() => navigate('/ai-insights')} />
          <SidebarButton icon={<FaCog />} label="Settings" onClick={() => navigate('/settings')} />
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        className="flex-1 p-4 md:p-10 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">🧠 AI Insights</h2>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Selected File</label>
              <input
                type="text"
                value={selectedFile}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Chart Type</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="Bar">Bar</option>
                <option value="Line">Line</option>
                <option value="Pie">Pie</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">X Axis</label>
              <select
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
              >
                <option value="">-- Choose --</option>
                {axisOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Y Axis</label>
              <select
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
              >
                <option value="">-- Choose --</option>
                {axisOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Button Section */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center sm:justify-start">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded shadow whitespace-nowrap">Generate Insights</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded whitespace-nowrap">Export .txt</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded whitespace-nowrap">Export .pdf</button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded whitespace-nowrap">Share Link</button>
            <button className="bg-cyan-600 text-white px-4 py-2 rounded whitespace-nowrap">Email Link</button>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <InsightCard
            title="Trend"
            text="Value A generally increases as the Category progresses from A to E, suggesting a positive correlation between the category order and the value."
          />
          <InsightCard
            title="Anomaly"
            text="There are no apparent outliers or anomalies in the data. The values progress relatively smoothly."
          />
          <InsightCard
            title="Actionable Insight"
            text="Focus efforts on categories D and E as they demonstrate the highest performance based on Value A. Investigate the factors driving higher values to replicate success elsewhere."
          />
        </div>
      </motion.main>
    </div>
  );
}

function SidebarButton({ icon, label, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-white text-green-700 rounded-lg hover:bg-green-100 transition-all duration-300 text-sm whitespace-nowrap"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}

function InsightCard({ title, text }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-green-700 font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 text-sm">{text}</p>
    </div>
  );
}
