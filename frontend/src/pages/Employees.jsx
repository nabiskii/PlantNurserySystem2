import { useState, useRef } from 'react';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';

export default function EmployeesPage() {
  const [editing, setEditing] = useState(null);
  const employeeListRef = useRef(null); // reference to EmployeeList

  const handleDone = () => {
    setEditing(null);
    // trigger EmployeeList refresh
    employeeListRef.current?.fetchEmployees?.();
  };

  return (
    <div className="mx-auto p-4 grid gap-6 max-w-7xl md:grid-cols-[360px_1fr]">
      <EmployeeForm editing={editing} onDone={handleDone} />
      <EmployeeList ref={employeeListRef} onEdit={setEditing} />
    </div>
  );
}
