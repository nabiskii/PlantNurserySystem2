import { useState, useRef, useEffect } from 'react';
import CareTipList from '../components/CareTipList';
import CareTipForm from '../components/CareTipForm';
import RecentActivity from '../components/RecentActivity';
import { subscribeActivity } from '../lib/caretipsClient';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function CareTipsPage() {
  const [editing, setEditing] = useState(null);
  const [activity, setActivity] = useState([]);
  const careTipListRef = useRef(null); // reference to PlantList
  const { isAdmin } = useAuth(); // Use the isAdmin helper

  const handleDone = async () => {
    setEditing(null);
    // trigger CareTipList refresh
    careTipListRef.current?.fetchCareTips?.();
  };

  useEffect(() => {
    const addActivity = (text) =>
      setActivity((prev) => [{ text, ts: Date.now() }, ...prev].slice(0, 50));

    const unsubscribe = subscribeActivity({
      onCreated: ({tip}) => {
        careTipListRef.current?.upsertTip?.(tip);
        addActivity(`Created “${tip.title}”`);
      },
      onUpdated: ({tip}) => {
        careTipListRef.current?.upsertTip?.(tip);
        addActivity(`Updated “${tip.title}”`);
      },
      onDeleted: ({tipId}) => {
        careTipListRef.current?.removeTip?.(tipId);
        addActivity(`Deleted a care tip (ID: ${tipId})`);
      },
    });
    

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_1fr] gap-6">
      <div className="space-y-6">
        {isAdmin && <CareTipForm editing={editing} onDone={handleDone} />} {/* Conditionally render CareTipForm */}
        <CareTipList ref={careTipListRef} onEdit={setEditing} />
      </div>
      <RecentActivity items={activity} />
    </div>
  );
}
