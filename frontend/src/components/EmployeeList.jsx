import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

const EmployeeList = forwardRef(({ onEdit }, ref) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMessage();

  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/api/employees");
      setEmployees(data);
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useImperativeHandle(ref, () => ({
    fetchEmployees,
  }));

  const removeEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axiosInstance.delete(`/api/employees/${id}`);
      showMessage("success", "Employee deleted successfully!");
      await fetchEmployees();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to delete employee");
    }
  };

  if (loading) return <div className="text-center">Loading employees...</div>;

  return (
    <div className="card-grid">
      {employees.map((e) => (
        <div key={e._id} className="card">
          <div className="card-title">{e.name}</div>
          <div className="card-text">
            {e.role} • {e.department} • {e.phone}
          </div>
          <div className="card-text">{e.email}</div>
          <div className="card-text">
            Joined: {new Date(e.dateJoined).toLocaleDateString()}
          </div>
          <div className="card-actions">
            <button
              className="btn btn-register"
              onClick={() => onEdit(e)}
            >
              Edit
            </button>
            <button
              className="btn btn-logout"
              onClick={() => removeEmployee(e._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default EmployeeList;
