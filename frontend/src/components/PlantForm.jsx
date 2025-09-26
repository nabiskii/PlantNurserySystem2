import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

const CATEGORIES = ['Indoor', 'Outdoor', 'Succulent', 'Flowering', 'Herb', 'Other'];

const PlantForm = ({ editing, onDone }) => {
  const [form, setForm] = useState({ name: '', category: 'Indoor', price: '', description: '' });
  const isEdit = Boolean(editing?._id);
  const { showMessage } = useMessage();

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || '',
        category: editing.category || 'Indoor',
        price: editing.price ?? '',
        description: editing.description || '',
      });
    }
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await axiosInstance.put(`/api/plants/${editing._id}`, form);
        showMessage('success', 'Plant updated successfully!');
      } else {
        await axiosInstance.post('/api/plants', form);
        showMessage('success', 'Plant created successfully!');
      }
      onDone?.();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={submit} className="border rounded p-4 flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{isEdit ? 'Edit Plant' : 'Add Plant'}</h2>
      
      <input
        className="border p-2 rounded"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <select
        className="border p-2 rounded"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        {CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />

      <textarea
        className="border p-2 rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button className="btn btn-register mt-3" type="submit">
        {isEdit ? 'Save Changes' : 'Create'}
      </button>
    </form>
  );
};

export default PlantForm;
