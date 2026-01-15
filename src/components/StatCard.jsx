export default function StatCard({ title, value, hint, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-start gap-3">
      
      {icon && (
        <div className="text-blue-600 text-xl shrink-0">
          {icon}
        </div>
      )}
      
      <div className="flex flex-col">
        <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">
          {title}
        </div>

        <div className="text-2xl font-semibold text-slate-900 leading-tight">
          {formatValue(value)}
        </div>

        {hint && (
          <div classname="text-xs text-slate-400 mt-1">
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}

// Convert big numbers into readable form (8123 → 8.1k)
function formatValue(v) {
  if (v === null || v === undefined || v === '—') return '—';
  if (typeof v === 'number') {
    if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
  }
  return v;
}
