// src/pages/WishlistPage.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig'; // ✅ use the configured axios

function WishlistPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/wishlist').then((res) => {
      const list = Array.isArray(res.data) ? res.data : res.data.items || [];
      setItems(list);
    });
  }, []);

  const refetchFromResponse = (res) => {
    const list = Array.isArray(res.data) ? res.data : res.data.items || [];
    setItems(list);
  };

  const deleteItem = (id) => {
    axiosInstance.delete(`/api/wishlist/${id}`).then(refetchFromResponse);
  };

  const cloneItem = (id) => {
    axiosInstance.post(`/api/wishlist/${id}/clone`).then(refetchFromResponse);
  };

  const editItem = (item) => {
    const newQty = prompt('Enter new quantity', item.quantity || 1);
    if (!newQty) return;
    axiosInstance
      .put(`/api/wishlist/${item._id}`, { quantity: Number(newQty) })
      .then(refetchFromResponse);
  };

  // helpers to print details regardless of where they live (item, item.plant, item.plantId)
  const getField = (item, key) =>
    item[key] ?? item.plant?.[key] ?? item.plantId?.[key] ?? undefined;

  return (
    <div className="mx-auto p-4 max-w-7xl">
      <h2 className="page-title" style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
        My Wishlist
      </h2>

      {items.length === 0 ? (
        <div>No items in your wishlist yet.</div>
      ) : (
        <div className="card-grid">
          {items.map((it) => {
            const name = getField(it, 'name') || 'Plant';
            const category = getField(it, 'category');
            const price = getField(it, 'price');
            const stock = getField(it, 'stockQuantity');
            const description = getField(it, 'description');

            return (
              <div key={it._id} className="card">
                <div className="card-title">{name}</div>

                <div className="card-text">
                  {category && <span>{category}</span>}
                  {price !== undefined && (
                    <>
                      {category ? ' • ' : ''}${price}
                    </>
                  )}
                  {stock !== undefined && (
                    <>
                      {' • '}Stock: {stock}
                    </>
                  )}
                </div>

                {description && <div className="card-text">{description}</div>}
                <div className="card-text">Qty: {it.quantity ?? 1}</div>

                <div className="card-actions">
                  <button className="btn btn-register" onClick={() => editItem(it)}>
                    Edit
                  </button>
                  <button className="btn btn-register" onClick={() => cloneItem(it._id)}>
                    Clone
                  </button>
                  <button className="btn btn-logout" onClick={() => deleteItem(it._id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
