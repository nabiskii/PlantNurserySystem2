import { useState, useMemo } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

export default function WishlistForm({ item, onSaved, onCancel }) {
  const { showMessage } = useMessage();

  // Guard: if no item passed yet
  const itemId = item?._id;
  const initialQty = useMemo(() => {
    const q = Number(item?.quantity ?? 1);
    return Number.isFinite(q) && q > 0 ? q : 1;
  }, [item]);

  const [quantity, setQuantity] = useState(initialQty);
  const [notes, setNotes] = useState(item?.notes || '');
  const [saving, setSaving] = useState(false);

  if (!itemId) {
    return <div className="text-center">Select a wishlist item to edit.</div>;
  }

  const onChangeQty = (e) => {
    const v = parseInt(e.target.value, 10);
    setQuantity(Number.isFinite(v) && v > 0 ? v : 1);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/api/wishlist/items/${itemId}`, {
        quantity,
        notes: notes?.trim?.() ?? '',
      });
      showMessage('success', 'Wishlist item updated');
      onSaved?.();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="form">
      <label htmlFor="qty">Quantity</label>
      <input
        id="qty"
        type="number"
        min="1"
        value={quantity}
        onChange={onChangeQty}
      />

      <label htmlFor="notes">Notes</label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />

      <div className="card-actions" style={{ gap: 8, marginTop: 8 }}>
        <button className="btn btn-register" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        {onCancel && (
          <button
            className="btn btn-logout"
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
