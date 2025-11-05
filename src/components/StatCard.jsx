export default function StatCard({ title, value, hint }) {
  return (
    <div className="card">
      <div className="text-slate-600">{title}</div>
      <div className="metric mt-1">{value}</div>
      {hint ? <div className="subtle mt-1">{hint}</div> : null}
    </div>
  )
}
