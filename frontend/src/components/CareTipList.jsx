import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

const CareTipList = forwardRef(({ onEdit }, ref) => {
  const [careTips, setCareTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMessage();

  const fetchCareTips = useCallback(async () => {
    try {
      // no filters → fetch all
      const { data } = await axiosInstance.get('/api/caretips');
      setCareTips(data);
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to fetch care tips');
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => { fetchCareTips(); }, [fetchCareTips]);
  useImperativeHandle(ref, () => ({ fetchCareTips }), [fetchCareTips]);

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this care tip?')) return;
    try {
      await axiosInstance.delete(`/api/caretips/${id}`);
      showMessage('success', 'Care tip deleted successfully!');
      await fetchCareTips();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to delete care tip');
    }
  };

  if (loading) return <div className="text-center">Loading care tips...</div>;

  return (
    <div className="card-grid">
      {careTips.map((ct) => (
        <div key={ct._id} className="card">
          <div className="card-title">{ct.title}</div>
          <div className="card-text">
            {(ct.tags || []).join(', ') || '—'} • {ct.difficulty?.[0]?.toUpperCase() + ct.difficulty?.slice(1)}
            {ct.readTimeMin ? ` • ${ct.readTimeMin} min read` : ''}
          </div>
          <div className="card-text">{ct.content}</div>
          <div className="card-actions">
            <button className="btn btn-register" onClick={() => onEdit?.(ct)}>Edit</button>
            <button className="btn btn-logout" onClick={() => remove(ct._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default CareTipList;
