import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import User from '../components/User';

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return setMessage('Please choose a file first.');

    const formData = new FormData();
    formData.append('excel', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message || '✅ Upload Successful!');
    } catch (error) {
      console.error(error);
      setMessage('❌ Upload failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-200 to-green-400">
      {/* Sidebar for md+ */}
      <aside className="w-full md:w-60 bg-white shadow-md md:shadow-none">
        <User />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 place-items-center px-4 sm:px-8 lg:px-12 relative overflow-hidden">
        {/* Floating animated icons - hidden on mobile */}
        <div className="hidden sm:flex absolute top-4 gap-4 sm:gap-8 justify-center w-full z-0">
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/2906/2906274.png"
            alt="Cloud Upload"
            className="w-12 h-12 sm:w-16 sm:h-16"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
            alt="Excel Icon"
            className="w-12 h-12 sm:w-16 sm:h-16"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/901/901122.png"
            alt="File Processing"
            className="w-12 h-12 sm:w-16 sm:h-16"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          />
        </div>

        {/* Left Side Illustration - hidden on mobile and tablet */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="xl.jpg"
            alt="Excel Upload Illustration"
            className="w-72 lg:w-96 h-auto"
          />
        </motion.div>

        {/* Right Side Upload Box */}
        <motion.div
          className="bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto my-8 sm:my-0 text-center z-10"
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Upload Excel File</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Supported formats: .xls, .xlsx, .csv</p>

          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-indigo-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-indigo-700 transition inline-block"
          >
            Choose File
            <input
              id="file-upload"
              type="file"
              accept=".xls,.xlsx,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {file && (
            <p className="mt-2 text-xs sm:text-sm text-gray-700 truncate">{file.name}</p>
          )}

          <button
            onClick={handleUpload}
            className="mt-4 sm:mt-6 bg-emerald-600 hover:bg-emerald-700 text-white w-full py-2 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition"
          >
            Upload
          </button>

          {message && (
            <p
              className={`mt-3 sm:mt-4 text-xs sm:text-sm font-medium ${
                message.includes('failed') ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}

          {file && !isAnalyzing && !message.includes('failed') && (
            <button
              onClick={() => navigate('/analyze')}
              className="mt-3 sm:mt-4 bg-violet-600 hover:bg-violet-700 text-white w-full py-2 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition"
            >
              Analyze Now
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
