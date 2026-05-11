import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});
  const { success, error } = useNotification();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (err) {
      error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Approve this user?')) return;
    setActionLoading(prev => ({...prev, [id]: true}));
    try {
      await api.put(`/admin/approve/${id}`);
      success('User approved successfully');
      fetchUsers(); // Refresh list
    } catch (err) {
      error(err.response?.data?.message || 'Failed to approve user');
    } finally {
      setActionLoading(prev => ({...prev, [id]: false}));
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this user?')) return;
    setActionLoading(prev => ({...prev, [id]: true}));
    try {
      await api.put(`/admin/reject/${id}`);
      success('User rejected successfully');
      fetchUsers(); // Refresh list
    } catch (err) {
      error(err.response?.data?.message || 'Failed to reject user');
    } finally {
      setActionLoading(prev => ({...prev, [id]: false}));
    }
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">Manage Users</h1>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <label className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Filter Role:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-neutral-100 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
            disabled={loading}
          >
            <option value="all">All Users</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-xl font-black text-neutral-900 mb-2">No users found</h3>
          <p className="text-neutral-500">Try adjusting the filter or wait for new registrations</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Card noPadding>
              <table className="min-w-full divide-y divide-neutral-100">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">User</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Identity</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-900">{user.name}</p>
                            <p className="text-xs text-neutral-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <Badge variant={user.role === 'teacher' ? 'accent' : 'primary'}>
                            {user.role}
                          </Badge>
                          <p className="text-[10px] font-bold text-neutral-400">ID: {user.referenceId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.status === 'approved' ? 'success' : user.status === 'rejected' ? 'danger' : 'warning'}>
                          {user.status || 'pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.status !== 'approved' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleApprove(user._id)}
                              disabled={actionLoading[user._id]}
                            >
                              Approve
                            </Button>
                          )}
                          {user.status !== 'rejected' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleReject(user._id)}
                              disabled={actionLoading[user._id]}
                            >
                              Reject
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-neutral-900 text-sm">{user.name}</h4>
                      <p className="text-xs text-neutral-500 truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant={user.role === 'teacher' ? 'accent' : 'primary'}>
                    {user.role}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</p>
                    <Badge variant={user.status === 'approved' ? 'success' : user.status === 'rejected' ? 'danger' : 'warning'}>
                      {user.status || 'pending'}
                    </Badge>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Ref ID</p>
                    <p className="text-xs font-bold text-neutral-700">{user.referenceId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {user.status !== 'approved' && (
                    <Button
                      variant="primary"
                      onClick={() => handleApprove(user._id)}
                      disabled={actionLoading[user._id]}
                    >
                      Approve
                    </Button>
                  )}
                  {user.status !== 'rejected' && (
                    <Button
                      variant="secondary"
                      className="text-red-600 hover:bg-red-50 border-red-100"
                      onClick={() => handleReject(user._id)}
                      disabled={actionLoading[user._id]}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
