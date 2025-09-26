import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

const ROLES = ['Admin', 'Staff', 'Manager', 'Other'];

const EmployeeForm = ({ editing, onDone }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Admin',
    phone: '',
    department: '',
    dateJoined: '',
  });
  const isEdit = Boolean(editing?._id);
  const { showMessage } = useMessage();

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || '',
        email: editing.email || '',
        role: editing.role || 'Admin',
        phone: editing.phone || '',
        department: editing.department || '',
        dateJoined: editing.dateJoined ? editing.dateJoined.split('T')[0] : '',
      });
    }
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await axiosInstance.put(`/api/employees/${editing._id}`, form);
        showMessage('success', 'Employee updated successfully!');
      } else {
        await axiosInstance.post('/api/employees', form);
        showMessage('success', 'Employee created successfully!');
      }
      onDone?.();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={submit} className="border rounded p-4 flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>

      <input
        className="border p-2 rounded"
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        className="border p-2 rounded"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <select
        className="border p-2 rounded"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        {ROLES.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>

      <input
        type="text"
        className="border p-2 rounded"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        type="text"
        className="border p-2 rounded"
        placeholder="Department"
        value={form.department}
        onChange={(e) => setForm({ ...form, department: e.target.value })}
      />

      <input
        type="date"
        className="border p-2 rounded"
        value={form.dateJoined}
        onChange={(e) => setForm({ ...form, dateJoined: e.target.value })}
      />

      <button className="btn btn-register mt-3" type="submit">
        {isEdit ? 'Save Changes' : 'Create'}
      </button>
    </form>
  );
};

export default EmployeeForm;
