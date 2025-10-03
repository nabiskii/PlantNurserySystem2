import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { api } from "../lib/caretipsClient";
import { useMessage } from "../context/MessageContext";
import { useAuth } from '../context/AuthContext'; // Import useAuth

const CareTipList = forwardRef(({ onEdit }, ref) => {
  const [careTips, setCareTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMessage();
  const { isAdmin } = useAuth(); // Use the isAdmin helper

  const fetchCareTips = useCallback(async () => {
    try {
      // no filters → fetch all
      const data = await api.list({ sort: '-updatedAt' });
      setCareTips(data);
    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.message || "Failed to fetch care tips"
      );
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  // Upsert (for SSE: created/updated)
  const upsertTip = useCallback((tip) => {
    setCareTips((prev) => {
      const i = prev.findIndex((t) => t._id === tip._id);
      if (i === -1) return [tip, ...prev];
      const next = prev.slice();
      next[i] = tip;
      return next;
    });
  }, []);

  // Remove (for SSE: deleted)
  const removeTip = useCallback((tipId) => {
    setCareTips((prev) => prev.filter((t) => t._id !== tipId));
  }, []);

  useEffect(() => {
    fetchCareTips();
  }, [fetchCareTips]);
  useImperativeHandle(ref, () => ({ fetchCareTips, upsertTip, removeTip }), [
    fetchCareTips,
    upsertTip,
    removeTip,
  ]);

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this care tip?"))
      return;
    const snapshot = careTips;
    removeTip(id);
    try {
      await api.remove(id);
      showMessage("success", "Care tip deleted successfully!");
      await fetchCareTips();
    } catch (err) {
      setCareTips(snapshot); // rollback
      showMessage(
        "error",
        err.response?.data?.message || "Failed to delete care tip"
      );
    }
  };

  if (loading) return <div className="text-center">Loading care tips...</div>;

  return (
    <div className="card-grid">
      {careTips.map((ct) => (
        <div key={ct._id} className="card">
          <div className="card-title">{ct.title}</div>
          <div className="card-text">
            {(ct.tags || []).join(", ") || "—"} •{" "}
            {ct.difficulty?.[0]?.toUpperCase() + ct.difficulty?.slice(1)}
            {ct.readTimeMin ? ` • ${ct.readTimeMin} min read` : ""}
          </div>
          <div className="card-text">{ct.content}</div>
          <div className="card-actions">
            {isAdmin && ( // Conditionally render Edit button
              <button className="btn btn-register" onClick={() => onEdit?.(ct)}>
                Edit
              </button>
            )}
            {isAdmin && ( // Conditionally render Delete button
              <button
                className="text-red-500 hover:text-red-700 p-1 rounded"
                onClick={() => remove(ct._id)}
                title="Delete Care Tip"
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

export default CareTipList;
