import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

export default function WishlistList({ onEdit }) {
  const [wl, setWl] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMessage();

  const fetchWl = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/wishlist');
      setWl(data);
    } catch (e) {
      showMessage('error', e.response?.data?.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchWl();
  }, [fetchWl]);

  const remove = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axiosInstance.delete(`/api/wishlist/items/${id}`);
      showMessage('success', 'Item deleted');
      await fetchWl();
    } catch (e) {
      showMessage('error', e.response?.data?.message || 'Delete failed');
    }
  };

  const clone = async (id) => {
    try {
      await axiosInstance.post(`/api/wishlist/items/${id}/clone`, {});
      showMessage('success', 'Item duplicated');
      await fetchWl();
    } catch (e) {
      showMessage('error', e.response?.data?.message || 'Clone failed');
    }
  };

  if (loading) return <div className="text-center">Loading wishlist…</div>;
  if (!wl) return null;

  return (
    <div className="card-grid">
      {(wl.items || []).map((it) => (
        <div key={it._id} className="card">
          <div className="card-title">{it.name}</div>
          <div className="card-text">
            Qty: {it.quantity} • {it.meta?.category || it.meta?.supplier || '—'}
          </div>
          {it.notes ? <div className="card-text">{it.notes}</div> : null}
          <div className="card-actions">
            <button
              className="btn btn-register"
              onClick={() => onEdit?.(it, fetchWl)}
            >
              Edit
            </button>
            <button
              className="btn"
              onClick={() => clone(it._id)}
            >
              Duplicate
            </button>
            <button
              className="btn btn-logout"
              onClick={() => remove(it._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
