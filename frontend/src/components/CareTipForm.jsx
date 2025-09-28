import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

const DIFFICULTY = ['easy', 'moderate', 'advanced'];

const CareTipForm = ({ editing, onDone }) => {
  const [form, setForm] = useState({ title: '', tags: '', difficulty: 'easy', content: '' });
  const isEdit = Boolean(editing?._id);
  const { showMessage } = useMessage();

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || '',
        tags: Array.isArray(editing.tags) ? editing.tags.join(', ') : (editing.tags || ''),
        difficulty: (editing.difficulty || 'easy').toLowerCase(),
        content: editing.content || '',
      });
    } else {
      setForm({ title: '', tags: '', difficulty: 'easy', content: '' });
    }
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      content: form.content,
      difficulty: (form.difficulty || 'easy').toLowerCase(),
      tags: (form.tags || '').split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await axiosInstance.put(`/api/caretips/${editing._id}`, payload);
        showMessage('success', 'Care tip updated successfully!');
      } else {
        await axiosInstance.post('/api/caretips', payload);
        showMessage('success', 'Care tip created successfully!');
      }
      onDone?.();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={submit} className="border rounded p-4 flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{isEdit ? 'Edit Care Tip' : 'Add Care Tip'}</h2>

      <input
        className="border p-2 rounded"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <select
        className="border p-2 rounded"
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
      >
        {DIFFICULTY.map((d) => (
          <option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>
        ))}
      </select>

      <input
        className="border p-2 rounded"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={(e) => setForm({ ...form, tags: e.target.value })}
      />

      <textarea
        className="border p-2 rounded"
        placeholder="Content"
        rows={6}
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      <button className="btn btn-register mt-3" type="submit">
        {isEdit ? 'Save Changes' : 'Create'}
      </button>
    </form>
  );
};

export default CareTipForm;
