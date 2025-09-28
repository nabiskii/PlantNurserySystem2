import axiosInstance from '../axiosConfig';

const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5001';

export function subscribeActivity({ onCreated, onUpdated, onDeleted } = {}) {
  const es = new EventSource(`${BASE}/api/events/caretips`);

  if (onCreated) es.addEventListener('careTip.created', (e) => onCreated(JSON.parse(e.data)));
  if (onUpdated) es.addEventListener('careTip.updated', (e) => onUpdated(JSON.parse(e.data)));
  if (onDeleted) es.addEventListener('careTip.deleted', (e) => onDeleted(JSON.parse(e.data)));

  return () => es.close();
}

export const api = {
  async list(params = {}) {
    const { data } = await axiosInstance.get('/api/caretips', { params });
    return data;
  },
  async get(id, opts = {}) {
    const { data } = await axiosInstance.get(`/api/caretips/${id}`, { params: opts });
    return data;
  },
  async create(payload) {
    const { data } = await axiosInstance.post('/api/caretips', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await axiosInstance.put(`/api/caretips/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await axiosInstance.delete(`/api/caretips/${id}`);
    return data;
  },
};
