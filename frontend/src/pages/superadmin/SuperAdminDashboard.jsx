import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ admins: 0, users: 0, pendingAdmins: 0 });
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [allAdmins, setAllAdmins]         = useState([]);
  const [pendingCSV, setPendingCSV]       = useState([]);
  const [activeTab, setActiveTab]         = useState("pending"); // "pending" | "all" | "csv"
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id of admin or csv being actioned

  /* ─────────── FETCH ALL DATA ─────────── */
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, allRes, csvRes] = await Promise.all([
        api.get("/superadmin/stats"),
        // ✅ Pending admins — uses auth route (protect + superadmin role via token)
        api.get("/auth/admin/pending"),
        // ✅ All admins list — from superadmin route
        api.get("/superadmin/admins"),
        // ✅ Pending CSV uploads
        api.get("/superadmin/csv/pending"),
      ]);

      setStats(statsRes.data);
      setPendingAdmins(pendingRes.data?.admins || []);
      setAllAdmins(Array.isArray(allRes.data) ? allRes.data : allRes.data?.admins || []);
      setPendingCSV(csvRes.data || []);
    } catch (err) {
      console.error("SuperAdmin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ─────────── APPROVE ─────────── */
  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      // ✅ Uses PATCH /auth/admin/approve/:id (defined in auth.routes.js)
      await api.patch(`/auth/admin/approve/${id}`);
      await fetchAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Approve failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ─────────── REJECT / DELETE ─────────── */
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject and remove this admin?")) return;
    try {
      setActionLoading(id);
      // ✅ Uses PATCH /auth/admin/reject/:id (defined in auth.routes.js)
      await api.patch(`/auth/admin/reject/${id}`);
      await fetchAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ─────────── CSV ACTIONS ─────────── */
  const handleCSVApprove = async (id) => {
    try {
      setActionLoading(`csv-${id}`);
      await api.post(`/superadmin/csv/${id}/approve`);
      await fetchAll();
    } catch (err) {
      alert(err?.response?.data?.message || "CSV Approve failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCSVReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this CSV batch?")) return;
    try {
      setActionLoading(`csv-${id}`);
      await api.post(`/superadmin/csv/${id}/reject`);
      await fetchAll();
    } catch (err) {
      alert(err?.response?.data?.message || "CSV Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ─────────── LOGOUT ─────────── */
  const handleLogout = () => {
    logout();           // clears localStorage + context state
    navigate("/admin-auth");
  };

  /* ─────────── RENDER HELPERS ─────────── */
  const AdminCard = ({ admin, showActions }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{admin.name}</p>
        <p className="text-sm text-gray-500">{admin.email}</p>
        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
          {admin.college && <span>🏫 {admin.college}</span>}
          {admin.department && <span>📚 {admin.department}</span>}
          <span>🕒 {new Date(admin.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            admin.isApproved
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {admin.isApproved ? "✅ Approved" : "⏳ Pending"}
        </span>

        {showActions && !admin.isApproved && (
          <button
            onClick={() => handleApprove(admin._id)}
            disabled={actionLoading === admin._id}
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            {actionLoading === admin._id ? "..." : "Approve"}
          </button>
        )}

        <button
          onClick={() => handleReject(admin._id)}
          disabled={actionLoading === admin._id}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-50"
        >
          {actionLoading === admin._id ? "..." : "Reject"}
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (activeTab === "pending") {
      if (pendingAdmins.length === 0) {
        return (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">✅</div>
            <p className="font-medium">No pending admins</p>
            <p className="text-sm mt-1">All admins are approved</p>
          </div>
        );
      }
      return pendingAdmins.map((admin) => (
        <AdminCard key={admin._id} admin={admin} showActions={true} />
      ));
    }

    if (activeTab === "all") {
      if (allAdmins.length === 0) {
        return <p className="text-center py-12 text-gray-400">No admins registered yet.</p>;
      }
      return allAdmins.map((admin) => (
        <AdminCard key={admin._id} admin={admin} showActions={true} />
      ));
    }

    if (activeTab === "csv") {
      if (pendingCSV.length === 0) {
        return <p className="text-center py-12 text-gray-400">No pending CSV uploads.</p>;
      }
      return pendingCSV.map((csv) => (
        <div key={csv._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{csv.fileName} <span className="text-xs font-normal text-gray-500">({csv.recordsCount} records)</span></p>
            <p className="text-sm text-gray-500">Type: <span className="capitalize">{csv.type}</span></p>
            <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
              <span>🏫 {csv.collegeId?.name} ({csv.collegeId?.code})</span>
              <span>📚 {csv.department}</span>
              <span>👤 By: {csv.uploadedBy?.name}</span>
              <span>🕒 {new Date(csv.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCSVApprove(csv._id)}
              disabled={actionLoading === `csv-${csv._id}`}
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              {actionLoading === `csv-${csv._id}` ? "..." : "Approve"}
            </button>
            <button
              onClick={() => handleCSVReject(csv._id)}
              disabled={actionLoading === `csv-${csv._id}`}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              {actionLoading === `csv-${csv._id}` ? "..." : "Reject"}
            </button>
          </div>
        </div>
      ));
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ─── TOP NAVBAR ─── */}
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">College SuperAdmin</h1>
          <p className="text-sm text-gray-500 font-medium text-indigo-600">Managing All Departments — {user?.college?.split('(')[1]?.replace(')', '') || user?.college?.split(' ')[0]}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>

          <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full font-bold text-lg">
            {user?.name?.charAt(0) || "S"}
          </div>

          {/* ✅ Logout button */}
          <button
            id="superadmin-logout"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">

        {/* ─── STATS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Total Admins</p>
            <p className="text-4xl font-bold text-blue-600 mt-1">{stats.admins}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-4xl font-bold text-green-600 mt-1">{stats.users}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-yellow-400">
            <p className="text-sm text-gray-500">Pending Approvals</p>
            <p className="text-4xl font-bold text-yellow-500 mt-1">{stats.pendingAdmins}</p>
          </div>
        </div>

        {/* ─── ADMIN MANAGEMENT ─── */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {/* Tab header */}
          <div className="flex border-b">
            <button
              id="tab-pending"
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "pending"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ⏳ Pending Approvals
              {pendingAdmins.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingAdmins.length}
                </span>
              )}
            </button>
            <button
              id="tab-all"
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "all"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              👥 All Admins ({allAdmins.length})
            </button>
            <button
              id="tab-csv"
              onClick={() => setActiveTab("csv")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "csv"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📄 CSV Uploads
              {pendingCSV.length > 0 && (
                <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingCSV.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab body */}
          <div className="p-6 space-y-3">
            {renderTabContent()}
          </div>
        </div>

      </main>
    </div>
  );
};

export default SuperAdminDashboard;