import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Generate 30 days of data
const generateData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'short' });
    
    // Generate realistic revenue with weekends having higher sales
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseRevenue = isWeekend ? 3500 : 2200;
    const variance = Math.random() * 1200 - 400;
    
    data.push({
      name: `${day} ${month}`,
      ingresos: Math.round(baseRevenue + variance),
    });
  }
  
  return data;
};

const data = generateData();

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <p className="text-lg font-display text-primary">
          ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">Ingresos del día</p>
      </div>
    );
  }
  return null;
};

export function RevenueChart30Days() {
  // Calculate total and average
  const total = data.reduce((acc, item) => acc + item.ingresos, 0);
  const average = Math.round(total / data.length);

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-xl">Ingresos Últimos 30 Días</h3>
          <p className="text-sm text-muted-foreground">Tendencia de ventas diarias</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-display text-xl text-primary">${total.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Promedio</p>
            <p className="font-display text-xl">${average.toLocaleString()}/día</p>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIngresos30" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tickMargin={8}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorIngresos30)"
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
