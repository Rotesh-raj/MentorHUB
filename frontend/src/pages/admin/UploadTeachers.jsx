import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

const UploadTeachers = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { success, error } = useNotification();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Read file preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').slice(0, 6); // First 5 rows + header
        setPreview(lines);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      error('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/admin/upload/teachers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      success(`Successfully uploaded ${response.data.count} teachers!`);
      setFile(null);
      setPreview([]);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to upload teachers');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin" className="text-xl font-bold">Smart Campus Connect - Admin</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="hover:bg-purple-700 px-3 py-2 rounded">Dashboard</Link>
              <Link to="/admin/upload/students" className="hover:bg-purple-700 px-3 py-2 rounded">Upload Students</Link>
              <Link to="/admin/manage-users" className="hover:bg-purple-700 px-3 py-2 rounded">Manage Users</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Approved Teachers</h1>
          
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">CSV Format Requirements:</h3>
            <p className="text-sm text-yellow-700">
              The CSV file should contain the following columns: staffId, name, department, email
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            {/* File Preview */}
            {preview.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">File Preview (First 5 rows):</h3>
                <pre className="text-sm text-gray-600 overflow-x-auto">
                  {preview.join('\n')}
                </pre>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Teachers'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadTeachers;
