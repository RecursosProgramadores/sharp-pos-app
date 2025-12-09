import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Lun", ingresos: 2400, servicios: 24 },
  { name: "Mar", ingresos: 1398, servicios: 13 },
  { name: "Mié", ingresos: 3200, servicios: 32 },
  { name: "Jue", ingresos: 2780, servicios: 27 },
  { name: "Vie", ingresos: 4890, servicios: 48 },
  { name: "Sáb", ingresos: 5390, servicios: 54 },
  { name: "Dom", ingresos: 1490, servicios: 14 },
];

export function RevenueChart() {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-xl">Ingresos de la Semana</h3>
        <p className="text-sm text-muted-foreground">
          Resumen de ventas de los últimos 7 días
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(358, 76%, 47%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(358, 76%, 47%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis
              dataKey="name"
              stroke="hsl(220, 9%, 46%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(220, 9%, 46%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`$${value}`, "Ingresos"]}
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="hsl(358, 76%, 47%)"
              strokeWidth={2}
              fill="url(#colorIngresos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
