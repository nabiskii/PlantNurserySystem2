import { useState, useRef } from 'react';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import { useAuth } from '../context/AuthContext'; 

export default function EmployeesPage() {
  const [editing, setEditing] = useState(null);
  const employeeListRef = useRef(null); 
  const { isAdmin } = useAuth(); 

  const handleDone = () => {
    setEditing(null);
    // trigger EmployeeList refresh
    employeeListRef.current?.fetchEmployees?.();
  };

  return (
    <div className="mx-auto p-4 max-w-7xl">
      {isAdmin ? (
        <div className="grid gap-6 md:grid-cols-[360px_1fr]">
          <EmployeeForm editing={editing} onDone={handleDone} />
          <EmployeeList ref={employeeListRef} onEdit={setEditing} />
        </div>
      ) : (
        <EmployeeList ref={employeeListRef} onEdit={setEditing} />
      )}
    </div>
  );
}
