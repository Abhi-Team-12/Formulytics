import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';

export default function ManageFiles() {
  const files = [
    { id: 1, name: 'report1.xlsx', uploaded: '25-05-2025', uploadedBy: 'Alice' },
    { id: 2, name: 'chart_data.csv', uploaded: '25-05-2025', uploadedBy: 'Bob' }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-green-50">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-10 overflow-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Manage Files</h2>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-left min-w-[600px] md:min-w-full">
            <thead>
              <tr className="bg-green-200 text-green-800">
                <th className="px-3 py-2 text-sm md:text-base">S.R. No.</th>
                <th className="px-3 py-2 text-sm md:text-base">File Name</th>
                <th className="px-3 py-2 text-sm md:text-base">Uploaded Date</th>
                <th className="px-3 py-2 text-sm md:text-base">Uploaded By</th>
                <th className="px-3 py-2 text-sm md:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file.id} className="border-t">
                  <td className="px-3 py-2 text-sm md:text-base">{file.id}</td>
                  <td className="px-3 py-2 text-sm md:text-base break-words">{file.name}</td>
                  <td className="px-3 py-2 text-sm md:text-base">{file.uploaded}</td>
                  <td className="px-3 py-2 text-sm md:text-base">{file.uploadedBy}</td>
                  <td className="px-3 py-2 text-sm md:text-base">
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
