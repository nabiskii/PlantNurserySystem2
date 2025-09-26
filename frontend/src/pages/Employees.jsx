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
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-[1fr_1fr] gap-6">
      <EmployeeForm editing={editing} onDone={handleDone} />
      <EmployeeList ref={employeeListRef} onEdit={setEditing} />
    </div>
  );
}
