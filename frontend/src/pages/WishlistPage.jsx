import { useState } from 'react';
import WishlistList from '../components/WishlistList';
import WishlistForm from '../components/WishlistForm';

export default function WishlistPage() {
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(() => () => {});

  const handleSaved = () => {
    setEditing(null);
    refresh();
  };

  const handleEdit = (it, refetch) => {
    setEditing(it);
    setRefresh(() => refetch);
  };

  return (
    <div className="container">
      <h2>My Wishlist</h2>

      {editing ? (
        <WishlistForm
          item={editing}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      <WishlistList onEdit={handleEdit} />
    </div>
  );
}
