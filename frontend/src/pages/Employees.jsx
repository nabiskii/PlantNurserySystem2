import { useState, useRef } from 'react';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function EmployeesPage() {
  const [editing, setEditing] = useState(null);
  const employeeListRef = useRef(null); // reference to EmployeeList
  const { isAdmin } = useAuth(); // Use the isAdmin helper

  const handleDone = () => {
    setEditing(null);
    // trigger EmployeeList refresh
    employeeListRef.current?.fetchEmployees?.();
  };

  return (
    <div className="mx-auto p-4 grid gap-6 max-w-7xl md:grid-cols-[360px_1fr]">
      {isAdmin && <EmployeeForm editing={editing} onDone={handleDone} />} {/* Conditionally render EmployeeForm */}
      <EmployeeList ref={employeeListRef} onEdit={setEditing} />
    </div>
  );
}
