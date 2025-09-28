import { useState, useRef } from 'react';
import CareTipList from '../components/CareTipList';
import CareTipForm from '../components/CareTipForm';

export default function CareTipsPage() {
  const [editing, setEditing] = useState(null);
  const careTipListRef = useRef(null); // reference to PlantList

  const handleDone = () => {
    setEditing(null);
    // trigger CareTipList refresh
    careTipListRef.current?.fetchCareTips?.();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-[1fr_1fr] gap-6">
      <CareTipForm editing={editing} onDone={handleDone} />
      <CareTipList ref={careTipListRef} onEdit={setEditing} />
    </div>
  );
}
