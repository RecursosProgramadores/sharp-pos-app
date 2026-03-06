import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek, subWeeks, format } from "date-fns";
import { es } from "date-fns/locale";

export interface WeeklyReportData {
  currentWeek: {
    start: string;
    end: string;
    totalRevenue: number;
    totalHaircuts: number;
    totalProductSales: number;
    newClients: number;
    avgTicket: number;
    topServices: { name: string; count: number }[];
    topBarbers: { name: string; revenue: number; cuts: number }[];
    revenueByDay: { day: string; amount: number }[];
  };
  previousWeek: {
    totalRevenue: number;
    totalHaircuts: number;
    newClients: number;
  };
  revenueChange: number;
  haircutsChange: number;
  clientsChange: number;
}

async function fetchWeekData(weekStart: Date, weekEnd: Date) {
  const start = weekStart.toISOString();
  const end = weekEnd.toISOString();

  const [haircutsRes, salesRes, clientsRes, barbersRes] = await Promise.all([
    supabase.from("haircuts").select("service_name, price, barber_id, created_at").gte("created_at", start).lte("created_at", end),
    supabase.from("sales").select("total, created_at").gte("created_at", start).lte("created_at", end),
    supabase.from("clients").select("id").gte("created_at", start).lte("created_at", end),
    supabase.from("barbers").select("id, full_name"),
  ]);

  const haircuts = haircutsRes.data || [];
  const sales = salesRes.data || [];
  const clients = clientsRes.data || [];
  const barbers = barbersRes.data || [];

  const haircutRevenue = haircuts.reduce((s, h) => s + Number(h.price), 0);
  const salesRevenue = sales.reduce((s, h) => s + Number(h.total), 0);
  const totalRevenue = haircutRevenue + salesRevenue;
  const totalTransactions = haircuts.length + sales.length;

  // Top services
  const serviceMap: Record<string, number> = {};
  for (const h of haircuts) {
    serviceMap[h.service_name] = (serviceMap[h.service_name] || 0) + 1;
  }
  const topServices = Object.entries(serviceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // Top barbers
  const barberMap: Record<string, { revenue: number; cuts: number }> = {};
  for (const h of haircuts) {
    if (!h.barber_id) continue;
    if (!barberMap[h.barber_id]) barberMap[h.barber_id] = { revenue: 0, cuts: 0 };
    barberMap[h.barber_id].revenue += Number(h.price);
    barberMap[h.barber_id].cuts++;
  }
  const barberNameMap = Object.fromEntries(barbers.map(b => [b.id, b.full_name]));
  const topBarbers = Object.entries(barberMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([id, stats]) => ({ name: barberNameMap[id] || "Desconocido", ...stats }));

  // Revenue by day
  const dayMap: Record<string, number> = {};
  for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
    dayMap[format(d, "yyyy-MM-dd")] = 0;
  }
  for (const h of haircuts) {
    const d = format(new Date(h.created_at), "yyyy-MM-dd");
    if (dayMap[d] !== undefined) dayMap[d] += Number(h.price);
  }
  for (const s of sales) {
    const d = format(new Date(s.created_at), "yyyy-MM-dd");
    if (dayMap[d] !== undefined) dayMap[d] += Number(s.total);
  }
  const revenueByDay = Object.entries(dayMap).map(([date, amount]) => ({
    day: format(new Date(date), "EEE", { locale: es }),
    amount: Math.round(amount),
  }));

  return {
    totalRevenue,
    totalHaircuts: haircuts.length,
    totalProductSales: sales.length,
    newClients: clients.length,
    avgTicket: totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0,
    topServices,
    topBarbers,
    revenueByDay,
  };
}

export function useWeeklyReport() {
  return useQuery({
    queryKey: ["weekly-report"],
    queryFn: async (): Promise<WeeklyReportData> => {
      const now = new Date();
      const currentStart = startOfWeek(now, { weekStartsOn: 1 });
      const currentEnd = endOfWeek(now, { weekStartsOn: 1 });
      const prevStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
      const prevEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

      const [current, previous] = await Promise.all([
        fetchWeekData(currentStart, currentEnd),
        fetchWeekData(prevStart, prevEnd),
      ]);

      const pctChange = (curr: number, prev: number) =>
        prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

      return {
        currentWeek: {
          start: format(currentStart, "d MMM", { locale: es }),
          end: format(currentEnd, "d MMM", { locale: es }),
          ...current,
        },
        previousWeek: {
          totalRevenue: previous.totalRevenue,
          totalHaircuts: previous.totalHaircuts,
          newClients: previous.newClients,
        },
        revenueChange: pctChange(current.totalRevenue, previous.totalRevenue),
        haircutsChange: pctChange(current.totalHaircuts, previous.totalHaircuts),
        clientsChange: pctChange(current.newClients, previous.newClients),
      };
    },
    refetchInterval: 300000, // 5 min
  });
}
