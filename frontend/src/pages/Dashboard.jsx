import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaUpload, FaChartBar, FaHistory, FaDownload, FaBrain, FaCog, FaThLarge } from 'react-icons/fa';
import { motion } from 'framer-motion';
import User from '../components/User';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user'));
  const userName = userData?.name || 'User';

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-green-200 to-green-400">
      <User />
      
      {/* Main Content */}
      <motion.main
        className="flex-1 px-4 sm:px-6 md:px-8 py-4 sm:py-6 relative w-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Welcome Box */}
        <motion.div
          className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl md:shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-2xl md:max-w-3xl mx-auto mt-4 sm:mt-8 md:mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 50 }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
            Welcome {userName}!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            You have successfully logged in. Your analytics and uploads will appear here.
          </p>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {[
              { title: '2D/3D Charts', img: '/2D.jpg' },
              { title: 'AI Insights', img: '/AI.jpg' },
              { title: 'Upload History', img: '/history.webp' },
              { title: 'Excel Upload', img: '/upload.jpg' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-green-50 rounded-md sm:rounded-lg p-3 sm:p-4 flex flex-col items-center shadow hover:shadow-md transition"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-2 sm:mb-3" 
                />
                <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium text-center">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  );
}

// Sidebar Button Component (responsive)
function SidebarButton({ icon, label, onClick }) {
  const [rotate, setRotate] = useState(false);

  const handleClick = () => {
    setRotate(true);
    onClick?.();
    setTimeout(() => setRotate(false), 400);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="flex items-center w-full gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-100 transition-all duration-300 font-medium text-sm sm:text-base"
      whileHover={{ scale: 1.05 }}
      animate={rotate ? { rotateY: 360 } : { rotateY: 0 }}
      transition={{ duration: 0.4 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <span className="text-lg sm:text-xl">{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}