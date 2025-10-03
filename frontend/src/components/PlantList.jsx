import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext'; 

const PlantList = forwardRef(({ onEdit }, ref) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null); 
  const { showMessage } = useMessage();
  const { isAdmin } = useAuth(); 

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

  // add-to-wishlist handler (global wishlist backend)
  const addToWishlist = async (plant) => {
    try {
      setBusyId(plant._id);
      await axiosInstance.post('/api/wishlist', {
  plant: {
    _id: plant._id,
    name: plant.name,
    category: plant.category,
    price: plant.price,
    stockQuantity: plant.stockQuantity,
    description: plant.description,
  },
});
      showMessage("success", `"${plant.name}" added to wishlist`);
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to add to wishlist");
    } finally {
      setBusyId(null);
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

          {/* Actions: three buttons inside the card, aligned & equal width */}
          <div className="card-actions card-actions--row">
            {isAdmin && (
              <button
                className="btn btn-register"
                onClick={() => onEdit(p)}
              >
                Edit
              </button>
            )}

            <button
              className="btn btn-register"
              onClick={() => addToWishlist(p)}
              disabled={busyId === p._id}
              title="Add to wishlist"
            >
              {busyId === p._id ? "Adding..." : "Add to wishlist"}
            </button>

            {isAdmin && ( 
              <button
                className="text-red-500 hover:text-red-700 p-1 rounded"
                onClick={() => remove(p._id)}
                title="Delete Plant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default PlantList;
