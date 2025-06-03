import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

import Dashboard from './pages/Dashboard';
import UploadExcel from './pages/UploadExcel';
import AnalyzeData from './pages/AnalyzeData';
import History from './pages/History';
import DownloadPage from './pages/Download';
import AIInsightsPage from './pages/AI_insights';
import SettingsPage from './pages/Settings';
import { jwtDecode } from 'jwt-decode';

// Admin Pages (uncomment these if files exist)
 import AdminDashboard from './pages/Admin/AdminDashboard';
 import ManageUsers from './pages/Admin/ManageUsers';  // no .jsx needed usually

 import ManageFiles from './pages/Admin/ManageFiles';
 import AdminSettings from './pages/Admin/AdminSettings';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUserRole(decoded.role); // assuming token has { id, role }
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUserRole(null);
      }
    }
  }, [token]);

  const isAdmin = token && userRole === 'admin';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login setToken={setToken} />} />

      {/* User Protected Routes */}
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/home" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/upload" element={token ? <UploadExcel /> : <Navigate to="/login" />} />
      <Route path="/analyze" element={token ? <AnalyzeData /> : <Navigate to="/login" />} />
      <Route path="/history" element={token ? <History /> : <Navigate to="/login" />} />
      <Route path="/downloads" element={token ? <DownloadPage /> : <Navigate to="/login" />} />
      <Route path="/ai-insights" element={token ? <AIInsightsPage /> : <Navigate to="/login" />} />
      <Route path="/settings" element={token ? <SettingsPage /> : <Navigate to="/login" />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin" />} />
      <Route path="/admin/users" element={isAdmin ? <ManageUsers /> : <Navigate to="/login" />} />
      <Route path="/admin/files" element={isAdmin ? <ManageFiles /> : <Navigate to="/login" />} />
      <Route path="/admin/settings" element={isAdmin ? <AdminSettings /> : <Navigate to="/login" />} />
    </Routes>
  );
}


export default App;
