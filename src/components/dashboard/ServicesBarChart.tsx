import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Corte Clásico", cantidad: 156, color: "hsl(var(--primary))" },
  { name: "Fade", cantidad: 124, color: "hsl(var(--secondary))" },
  { name: "Barba", cantidad: 98, color: "hsl(var(--success))" },
  { name: "Diseño", cantidad: 72, color: "hsl(var(--info))" },
  { name: "Tratamiento", cantidad: 45, color: "hsl(var(--warning))" },
];

export function ServicesBarChart() {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-xl">Top 5 Servicios Más Solicitados</h3>
        <p className="text-sm text-muted-foreground">Este mes</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`${value} servicios`, "Cantidad"]}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
            />
            <Bar dataKey="cantidad" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
