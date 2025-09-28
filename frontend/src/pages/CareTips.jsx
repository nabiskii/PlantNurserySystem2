import { useState, useRef, useEffect } from 'react';
import CareTipList from '../components/CareTipList';
import CareTipForm from '../components/CareTipForm';
import RecentActivity from '../components/RecentActivity';

export default function CareTipsPage() {
  const [editing, setEditing] = useState(null);
  const [activity, setActivity] = useState([]);
  const careTipListRef = useRef(null); // reference to PlantList

  const handleDone = () => {
    setEditing(null);
    // trigger CareTipList refresh
    careTipListRef.current?.fetchCareTips?.();
  };

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5001';
    const es = new EventSource(`${API_BASE}/api/events/caretips`/*, { withCredentials: true }*/);
    const addActivity = (text) =>
      setActivity((prev) => [{ text, ts: Date.now() }, ...prev].slice(0, 50));

    const onCreated = (e) => {
      const { tip } = JSON.parse(e.data);
      careTipListRef.current?.upsertTip?.(tip);
      addActivity(`Created “${tip.title}”`);
    };
    const onUpdated = (e) => {
      const { tip } = JSON.parse(e.data);
      careTipListRef.current?.upsertTip?.(tip);
      addActivity(`Updated “${tip.title}”`);
    };
    const onDeleted = (e) => {
      const { tipId } = JSON.parse(e.data);
      careTipListRef.current?.removeTip?.(tipId);
      addActivity(`Deleted tip ${tipId}`);
    };

    es.addEventListener('careTip.created', onCreated);
    es.addEventListener('careTip.updated', onUpdated);
    es.addEventListener('careTip.deleted', onDeleted);

    return () => {
      es.removeEventListener('careTip.created', onCreated);
      es.removeEventListener('careTip.updated', onUpdated);
      es.removeEventListener('careTip.deleted', onDeleted);
      es.close();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_1fr] gap-6">
      <div className="space-y-6">
        <CareTipForm editing={editing} onDone={handleDone} />
        <CareTipList ref={careTipListRef} onEdit={setEditing} />
      </div>
      <RecentActivity items={activity} />
    </div>
  );
}
