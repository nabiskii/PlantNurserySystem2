import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

export default function AdminWishlists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMessage();

  const fetchAll = useCallback(async () => {
    try {
      // Admin route is mounted under /api/wishlist in the backend:
      // router.get('/admin', authorizeRoles('ADMIN'), getAllWishlists)
      const { data } = await axiosInstance.get('/api/wishlist/admin');
      setLists(Array.isArray(data) ? data : []);
    } catch (e) {
      showMessage('error', e.response?.data?.message || 'Failed to load wishlists');
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) return <div className="text-center">Loading all wishlists…</div>;

  return (
    <div className="container">
      <h2>All Wishlists (Admin)</h2>
      <div className="card-grid">
        {lists.map((wl) => (
          <div className="card" key={wl._id}>
            <div className="card-title">
              {wl.userId?.email || 'Unknown user'} {wl.userId?.role ? `• ${wl.userId.role}` : ''}
            </div>
            <div className="card-text">{(wl.items?.length ?? 0)} item(s)</div>
          </div>
        ))}
      </div>
    </div>
  );
}
