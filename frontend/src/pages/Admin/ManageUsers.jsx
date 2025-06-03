  import React, { useEffect, useState } from 'react';
  import AdminSidebar from '../../components/AdminSidebar';
  import { fetchUsers, deleteUser } from '../../api/adminApi';

  // SVG Components
  const UserIcon = () => (
    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );

  export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      const loadUsers = async () => {
        try {
          setLoading(true);
          const response = await fetchUsers();
          setUsers(response.data);
          setError(null);
        } catch (err) {
          setError('Failed to fetch users. Please try again later.');
          console.error('Error fetching users:', err);
        } finally {
          setLoading(false);
        }
      };

      loadUsers();
    }, []);

    const getUserName = (user) => {
      return (
        user.name ||
        user.username ||
        user.fullName ||
        (user.profile && user.profile.name) ||
        'Unnamed User'
      );
    };

    const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

      try {
        setDeletingId(id);
        await deleteUser(id);
        setUsers(prev => prev.filter(user => user._id !== id && user.id !== id));
      } catch (err) {
        alert('Failed to delete user. Please try again.');
        console.error('Error deleting user:', err);
      } finally {
        setDeletingId(null);
      }
    };

    const filteredUsers = users.filter(user => 
      getUserName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="mt-2 text-sm text-gray-600">
                  View, manage, and monitor all registered users
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl shadow p-8 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-center py-8">
                  <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Users</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                {searchTerm ? (
                  <>
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                    <p className="mt-2 text-gray-600">Your search "{searchTerm}" did not match any users.</p>
                  </>
                ) : (
                  <>
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No users registered</h3>
                    <p className="mt-2 text-gray-600">There are currently no users in the system.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user, index) => (
                        <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <UserIcon />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{getUserName(user)}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(user.createdAt || user.joinedDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <EmailIcon />
                              <div className="ml-2">
                                <div className="text-sm text-gray-900">{user.email || 'No email'}</div>
                                <div className="text-xs text-gray-500">
                                  {user.role || 'Standard user'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDelete(user._id || user.id)}
                              disabled={deletingId === (user._id || user.id)}
                              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm ${
                                deletingId === (user._id || user.id)
                                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors`}
                            >
                              {deletingId === (user._id || user.id) ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Deleting
                                </>
                              ) : (
                                <>
                                  <TrashIcon />
                                  <span className="ml-1">Delete</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }