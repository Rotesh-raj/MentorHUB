import { useState, useEffect } from 'react';
import api from '../../api/axios';

const CSVUploadHistory = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await api.get("/admin/csv/uploads");
        setUploads(res.data);
      } catch (error) {
        console.error("Error fetching CSV uploads", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading upload history...</div>;
  }

  if (uploads.length === 0) {
    return null; // Or return a message: "No CSV uploads yet."
  }

  return (
    <div className="mt-8 bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent CSV Uploads</h3>
      <div className="space-y-3">
        {uploads.map(upload => (
          <div key={upload._id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-semibold text-gray-800">{upload.fileName} <span className="text-xs font-normal text-gray-500">({upload.recordsCount} records)</span></p>
              <p className="text-sm text-gray-500 mt-1 capitalize">{upload.type} Upload • {new Date(upload.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                upload.status === 'approved' ? 'bg-green-100 text-green-700' :
                upload.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {upload.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSVUploadHistory;
