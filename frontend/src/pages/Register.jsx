import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ Registered successfully:", res.data);
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Something went wrong. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-700 to-green-900 flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col sm:flex-col md:flex-row bg-white/90 shadow-2xl rounded-3xl overflow-hidden w-full max-w-md sm:max-w-xl md:max-w-5xl">

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 p-6 sm:p-8 bg-amber-50 flex flex-col justify-center"
        >
          <div className="flex flex-col items-center gap-2 mb-6 px-2">
            <img
              src="./Logo.svg"
              alt="Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg bg-white"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800 text-center">
              Create New Account
            </h2>
            <p className="text-sm sm:text-base text-green-700 text-center">
              Join and unlock powerful Excel insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="relative">
              <FaUser className="absolute top-3.5 left-3 text-green-500" />
              <input
                type="text"
                placeholder="Name"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-green-50 text-gray-800 placeholder-gray-500 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-3.5 left-3 text-green-500" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-green-50 text-gray-800 placeholder-gray-500 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-3.5 left-3 text-green-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-green-50 text-gray-800 placeholder-gray-500 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3.5 right-3 text-green-600 cursor-pointer focus:outline-none"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm sm:text-base font-medium transition"
            >
              Register
            </motion.button>
          </form>

          <p className="text-emerald-700 text-center mt-6 text-sm sm:text-base px-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-green-900 font-semibold"
            >
              Log in
            </Link>
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hidden sm:block md:w-1/2"
          style={{ minHeight: '350px' }}
        >
          <img
            src="./register.jpeg"
            alt="Register visual"
            className="w-full h-full object-cover rounded-r-3xl"
          />
        </motion.div>
      </div>
    </div>
  );
}
