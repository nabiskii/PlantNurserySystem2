import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

const PlantList = forwardRef(({ onEdit }, ref) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMessage();

  const fetchPlants = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/api/plants");
      setPlants(data);
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to fetch plants");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  useImperativeHandle(ref, () => ({
    fetchPlants,
  }));

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plant?")) return;
    try {
      await axiosInstance.delete(`/api/plants/${id}`);
      showMessage("success", "Plant deleted successfully!");
      await fetchPlants();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to delete plant");
    }
  };

  if (loading) return <div className="text-center">Loading plants...</div>;

  return (
    <div className="card-grid">
      {plants.map((p) => (
        <div key={p._id} className="card">
          <div className="card-title">{p.name}</div>
          <div className="card-text">
            {p.category} • ${p.price} • Stock: {p.stockQuantity}
          </div>
          <div className="card-text">{p.description}</div>
          <div className="card-actions">
            <button
              className="btn btn-register"
              onClick={() => onEdit(p)}
            >
              Edit
            </button>
            <button
              className="btn btn-logout"
              onClick={() => remove(p._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default PlantList;
