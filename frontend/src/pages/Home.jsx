import { Link } from 'react-router-dom';
import React from 'react';
import { motion } from 'framer-motion';

function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-400 via-green-700 to-green-900 flex flex-col p-4 overflow-hidden text-sm sm:text-base">

      {/* Logo and Title */}
      <div className="flex items-center gap-2 mb-6 justify-center">
        <img src="/Logo.svg" alt="Logo" className="w-10 h-10 rounded-full bg-white shadow-md" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-300">
          Formulytics
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-between flex-grow w-full max-w-6xl mx-auto space-y-8 md:space-y-0">

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-0">

          {/* Text Section */}
          <div className="text-center md:text-left w-full md:w-1/2 space-y-5 px-2 sm:px-6 md:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400">
              Welcome to <span className="text-green-200">Formulytics</span>
            </h2>
            <p className="text-base sm:text-lg italic font-medium text-amber-100 max-w-lg mx-auto md:mx-0">
              "Effortlessly transform Excel and CSV files into interactive 2D/3D charts, uncover smart AI-driven insights, and export beautiful, data-rich reports—all from one powerful platform."
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4 max-w-xs mx-auto md:mx-0 w-full">
              <Link to="/login" className="w-full sm:w-auto">
                <button className="bg-yellow-500 text-white px-6 py-3 rounded-md shadow-sm hover:bg-yellow-600 transition text-base w-full">
                  Login
                </button>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <button className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-md shadow-sm hover:bg-gray-100 transition text-base w-full">
                  Register
                </button>
              </Link>
            </div>
          </div>

          {/* Image Section */}
          <div className="mt-6 md:mt-0 w-full md:w-1/2 flex justify-center px-4 sm:px-0">
            <img
              src="/desk.jpg"
              alt="Dashboard Illustration"
              className="w-full max-w-[300px] sm:max-w-[380px] md:max-w-[480px] object-contain rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full pt-6 px-2 sm:px-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-yellow-500 mb-6">
            Features
          </h1>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center px-2 sm:px-6"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 300, damping: 30 }}
            viewport={{ once: true }}
          >
            {[
              { icon: '/2d.png', text: 'Generate 2D/3D charts' },
              { icon: '/aiii.jpg', text: 'AI-powered insights' },
              { icon: '/up.jpg', text: 'See upload history' },
              { icon: '/xls.jpg', text: 'Upload Excel files' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-md p-4 rounded-lg hover:scale-105 transition-all duration-300 flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <img
                  src={feature.icon}
                  alt={feature.text}
                  className="w-full h-20 sm:h-24 object-contain mb-3"
                />
                <p className="font-medium text-sm sm:text-base">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Home;
