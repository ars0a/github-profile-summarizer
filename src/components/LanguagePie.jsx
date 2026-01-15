import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

const COLORS = [
  "#6366F1", "#06B6D4", "#22C55E", "#F59E0B", "#EF4444",
  "#8B5CF6", "#14B8A6", "#EAB308", "#F97316", "#84CC16"
];

export default function LanguagePie({ data }) {
  if (!data?.length) {
    return (
      <div className="text-slate-500 text-sm italic">
        No language data available.
      </div>
    );
  }

  // Sort by bytes descending so largest languages come first
  const sorted = [...data].sort((a, b) => b.bytes - a.bytes);

  // Group only top 8 (UI clarity)
  const chart = sorted.slice(0, 8).map(d => ({
    name: d.name,
    value: d.bytes
  }));

  const total = sorted.reduce((acc, cur) => acc + cur.bytes, 0);

  return (
    <div className="w-full h-[330px]">
      <ResponsiveContainer>
        <PieChart>
          
          <Pie
            data={chart}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            labelLine={false}
            label={({ name, value }) => {
              const percent = ((value / total) * 100).toFixed(1);
              return percent >= 5 ? `${name} (${percent}%)` : "";
            }}
          >
            {chart.map((entry, index) => (
              <Cell
                key={`slice-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth={1}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{ fontSize: "0.8rem" }}
            formatter={(value, _, props) => {
              const p = ((value / total) * 100).toFixed(1);
              return [`${value} bytes (${p}%)`, props.payload.name];
            }}
          />

          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: "0.8rem", paddingLeft: "12px" }}
          />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
