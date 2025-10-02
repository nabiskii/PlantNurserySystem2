import { useState, useRef } from 'react';
import PlantList from '../components/PlantList';
import PlantForm from '../components/PlantForm';

export default function PlantsPage() {
  const [editing, setEditing] = useState(null);
  const plantListRef = useRef(null); // reference to PlantList

  const handleDone = () => {
    setEditing(null);
    // trigger PlantList refresh
    plantListRef.current?.fetchPlants?.();
  };

  return (
    <div className="mx-auto p-4 grid gap-6 max-w-7xl md:grid-cols-[360px_1fr]">
      <PlantForm editing={editing} onDone={handleDone} />
      <PlantList ref={plantListRef} onEdit={setEditing} />
    </div>
  );
}
