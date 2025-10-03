// src/pages/WishlistPage.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig'; // ✅ use the configured axios

function WishlistPage() {
  const [items, setItems] = useState([]);

  const fetchWishlist = () => {
    axiosInstance.get('/api/wishlist').then(async (res) => {
      const list = Array.isArray(res.data) ? res.data : res.data.items || [];
      // for each item, fetch the plant details
      const withPlantDetails = await Promise.all(
        list.map(async (item) => {
          if (item.plantId && typeof item.plantId === 'string') { // Check if plantId is a string
            try {
              const plantRes = await axiosInstance.get(
                `/api/plants/${item.plantId}`
              );
              return { ...item, plant: plantRes.data };
            } catch (error) {
              console.error(`Failed to fetch plant details for ID: ${item.plantId}`, error);
              // Return the item without the plant details if the fetch fails
              return item;
            }
          }
          return item;
        })
      );
      setItems(withPlantDetails);
    });
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const refetchFromResponse = () => {
    fetchWishlist();
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

  const editNotes = (item) => {
    const newNotes = prompt('Enter new notes', item.notes || '');
    if (newNotes === null) return;
    axiosInstance
      .put(`/api/wishlist/${item._id}`, { notes: newNotes })
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
                {it.notes && <div className="card-text" style={{fontStyle: 'italic'}}>{it.notes}</div>}

                <div className="card-actions">
                  <button className="btn btn-register" onClick={() => editItem(it)}>
                    Edit Qty
                  </button>
                  <button className="btn btn-register" onClick={() => editNotes(it)}>
                    Edit Notes
                  </button>
                  <button className="btn btn-register" onClick={() => cloneItem(it._id)}>
                    Clone
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 p-1 rounded"
                    onClick={() => deleteItem(it._id)}
                    title="Delete Item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
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
