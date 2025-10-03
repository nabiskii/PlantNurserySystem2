export default function RecentActivity({ items = [] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
      <ol className="text-sm space-y-1 max-h-[50vh] overflow-auto">
        {items.length === 0 && <li className="opacity-60">No activity yet</li>}
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <span>•</span>
            <div>
              <div>{it.text}</div>
              <div className="text-xs opacity-60">{new Date(it.ts).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}