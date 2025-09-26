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
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-[1fr_1fr] gap-6">
      <PlantForm editing={editing} onDone={handleDone} />
      <PlantList ref={plantListRef} onEdit={setEditing} />
    </div>
  );
}
