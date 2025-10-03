import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const EmployeeList = forwardRef(({ onEdit }, ref) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMessage();
  const { isAdmin } = useAuth(); // Use the isAdmin helper

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
            {e.role} • {e.department} {isAdmin && `• ${e.phone}`}
          </div>
          <div className="card-text">{e.email}</div>
          {isAdmin && (
            <div className="card-text">
              Joined: {new Date(e.dateJoined).toLocaleDateString()}
            </div>
          )}
          <div className="card-actions">
            {isAdmin && ( // Conditionally render Edit button
              <button
                className="btn btn-register"
                onClick={() => onEdit(e)}
              >
                Edit
              </button>
            )}
            {isAdmin && ( // Conditionally render Delete button
              <button
                className="text-red-500 hover:text-red-700 p-1 rounded"
                onClick={() => removeEmployee(e._id)}
                title="Delete Employee"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default EmployeeList;
