import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WishlistPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/api/wishlist').then(res => setItems(res.data.items));
  }, []);

  const deleteItem = (id) => {
    axios.delete(`/api/wishlist/${id}`).then(res => setItems(res.data.items));
  };

  const cloneItem = (id) => {
    axios.post(`/api/wishlist/${id}/clone`).then(res => setItems(res.data.items));
  };

  return (
    <div>
      <h2>My Wishlist</h2>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.plantId?.name} (x{item.quantity})
            <button>Edit</button>
            <button onClick={() => cloneItem(item._id)}>Clone</button>
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WishlistPage;
