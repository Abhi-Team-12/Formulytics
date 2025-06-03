import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form, {
        headers: { 'Content-Type': 'application/json' },
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Login failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-700 to-green-900 flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col md:flex-row bg-white/90 shadow-2xl rounded-3xl overflow-hidden w-full max-w-md sm:max-w-xl md:max-w-4xl">

        {/* Left Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hidden md:block md:w-1/2"
        >
          <img
            src="/login.png"
            alt="Login visual"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 p-6 sm:p-10 bg-amber-50 flex flex-col justify-center"
        >
          <div className="flex flex-col items-center gap-3 mb-6">
            <img
              src="./Logo.svg"
              alt="Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-md bg-white"
            />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-green-800">Log In</h2>
            <p className="text-green-700 text-sm sm:text-base text-center px-2">
              Sign in to explore powerful Excel insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="relative">
              <FaEnvelope className="absolute top-3.5 left-3 text-green-500" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-3.5 left-3 text-green-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-11 pr-10 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3.5 right-3 text-green-600 cursor-pointer focus:outline-none"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          <p className="text-center text-green-800 mt-6 text-sm sm:text-base">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-semibold">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
