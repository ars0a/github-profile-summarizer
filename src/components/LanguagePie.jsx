import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#6366F1","#06B6D4","#22C55E","#F59E0B","#EF4444","#8B5CF6","#14B8A6","#EAB308","#F97316","#84CC16"];

export default function LanguagePie({ data }) {
  if (!data?.length) return <div className="subtle">No language data</div>;
  const total = data.reduce((a,c)=>a+c.bytes,0);
  const chart = data.slice(0, 8).map(d => ({ name: d.name, value: d.bytes }));
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={chart} outerRadius={120} label>
            {chart.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v)=>`${((v/total)*100).toFixed(1)}%`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
