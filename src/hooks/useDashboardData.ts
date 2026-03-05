import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";
import { es } from "date-fns/locale";

export function useTodaySales() {
  return useQuery({
    queryKey: ["dashboard-today-sales"],
    queryFn: async () => {
      const today = startOfDay(new Date()).toISOString();

      // Haircuts (services) today
      const { data: haircuts } = await supabase
        .from("haircuts")
        .select("price, payment_method")
        .gte("created_at", today);

      // Product sales today
      const { data: sales } = await supabase
        .from("sales")
        .select("total, payment_method")
        .gte("created_at", today);

      const haircutRevenue = (haircuts || []).reduce((s, h) => s + Number(h.price), 0);
      const salesRevenue = (sales || []).reduce((s, h) => s + Number(h.total), 0);
      const totalRevenue = haircutRevenue + salesRevenue;
      const totalHaircuts = (haircuts || []).length;

      // Payment method distribution
      const paymentMap: Record<string, number> = {};
      for (const h of haircuts || []) {
        const m = h.payment_method || "cash";
        paymentMap[m] = (paymentMap[m] || 0) + Number(h.price);
      }
      for (const s of sales || []) {
        const m = s.payment_method || "cash";
        paymentMap[m] = (paymentMap[m] || 0) + Number(s.total);
      }

      return { totalRevenue, totalHaircuts, haircutRevenue, salesRevenue, paymentMap };
    },
    refetchInterval: 30000,
  });
}

export function useYesterdaySales() {
  return useQuery({
    queryKey: ["dashboard-yesterday-sales"],
    queryFn: async () => {
      const yesterday = startOfDay(subDays(new Date(), 1)).toISOString();
      const today = startOfDay(new Date()).toISOString();

      const { data: haircuts } = await supabase
        .from("haircuts")
        .select("price")
        .gte("created_at", yesterday)
        .lt("created_at", today);

      const { data: sales } = await supabase
        .from("sales")
        .select("total")
        .gte("created_at", yesterday)
        .lt("created_at", today);

      const revenue = (haircuts || []).reduce((s, h) => s + Number(h.price), 0) +
        (sales || []).reduce((s, h) => s + Number(h.total), 0);
      const haircuts_count = (haircuts || []).length;

      return { revenue, haircuts_count };
    },
  });
}

export function useActiveBarbers() {
  return useQuery({
    queryKey: ["dashboard-active-barbers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("barbers")
        .select("id, full_name, active")
        .order("full_name");
      return data || [];
    },
  });
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: ["dashboard-low-stock"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, stock, min_stock")
        .filter("active", "eq", true);
      return (data || []).filter(p => p.stock <= p.min_stock);
    },
  });
}

export function useRevenue30Days() {
  return useQuery({
    queryKey: ["dashboard-revenue-30days"],
    queryFn: async () => {
      const from = subDays(new Date(), 29);

      const { data: haircuts } = await supabase
        .from("haircuts")
        .select("price, created_at")
        .gte("created_at", startOfDay(from).toISOString());

      const { data: sales } = await supabase
        .from("sales")
        .select("total, created_at")
        .gte("created_at", startOfDay(from).toISOString());

      // Group by day
      const dayMap: Record<string, number> = {};
      for (let i = 0; i < 30; i++) {
        const d = format(subDays(new Date(), 29 - i), "yyyy-MM-dd");
        dayMap[d] = 0;
      }

      for (const h of haircuts || []) {
        const d = format(new Date(h.created_at), "yyyy-MM-dd");
        if (dayMap[d] !== undefined) dayMap[d] += Number(h.price);
      }
      for (const s of sales || []) {
        const d = format(new Date(s.created_at), "yyyy-MM-dd");
        if (dayMap[d] !== undefined) dayMap[d] += Number(s.total);
      }

      return Object.entries(dayMap).map(([date, ingresos]) => ({
        name: format(new Date(date), "d MMM", { locale: es }),
        ingresos: Math.round(ingresos),
        fullDate: date,
      }));
    },
    refetchInterval: 60000,
  });
}

export function useTopServices() {
  return useQuery({
    queryKey: ["dashboard-top-services"],
    queryFn: async () => {
      const thirtyDaysAgo = startOfDay(subDays(new Date(), 30)).toISOString();
      const { data } = await supabase
        .from("haircuts")
        .select("service_name")
        .gte("created_at", thirtyDaysAgo);

      const countMap: Record<string, number> = {};
      for (const h of data || []) {
        countMap[h.service_name] = (countMap[h.service_name] || 0) + 1;
      }

      const sorted = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const max = sorted[0]?.[1] || 1;
      return sorted.map(([name, count]) => ({
        name,
        cantidad: count,
      }));
    },
    refetchInterval: 60000,
  });
}

export function useBarberRanking() {
  return useQuery({
    queryKey: ["dashboard-barber-ranking"],
    queryFn: async () => {
      const thirtyDaysAgo = startOfDay(subDays(new Date(), 30)).toISOString();

      const { data: haircuts } = await supabase
        .from("haircuts")
        .select("barber_id, price")
        .gte("created_at", thirtyDaysAgo)
        .not("barber_id", "is", null);

      const { data: barbers } = await supabase
        .from("barbers")
        .select("id, full_name");

      const barberMap: Record<string, { cuts: number; revenue: number }> = {};
      for (const h of haircuts || []) {
        if (!h.barber_id) continue;
        if (!barberMap[h.barber_id]) barberMap[h.barber_id] = { cuts: 0, revenue: 0 };
        barberMap[h.barber_id].cuts++;
        barberMap[h.barber_id].revenue += Number(h.price);
      }

      const nameMap = Object.fromEntries((barbers || []).map(b => [b.id, b.full_name]));

      return Object.entries(barberMap)
        .map(([id, stats]) => ({
          id,
          name: nameMap[id] || "Desconocido",
          avatar: (nameMap[id] || "??").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
          cuts: stats.cuts,
          revenue: stats.revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((b, i) => ({ ...b, position: i + 1 }));
    },
    refetchInterval: 60000,
  });
}

export function usePaymentDistribution() {
  return useQuery({
    queryKey: ["dashboard-payment-distribution"],
    queryFn: async () => {
      const thirtyDaysAgo = startOfDay(subDays(new Date(), 30)).toISOString();

      const { data: haircuts } = await supabase
        .from("haircuts")
        .select("payment_method, price")
        .gte("created_at", thirtyDaysAgo);

      const { data: sales } = await supabase
        .from("sales")
        .select("payment_method, total")
        .gte("created_at", thirtyDaysAgo);

      const map: Record<string, number> = {};
      for (const h of haircuts || []) {
        const m = h.payment_method || "cash";
        map[m] = (map[m] || 0) + Number(h.price);
      }
      for (const s of sales || []) {
        const m = s.payment_method || "cash";
        map[m] = (map[m] || 0) + Number(s.total);
      }

      const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;

      const labels: Record<string, string> = {
        cash: "Efectivo",
        card: "Tarjeta",
        transfer: "Transferencia",
        yape: "Yape/Plin",
        mixed: "Mixto",
      };

      const colors: Record<string, string> = {
        cash: "hsl(var(--primary))",
        card: "hsl(var(--secondary))",
        transfer: "hsl(var(--info))",
        yape: "hsl(var(--success))",
        mixed: "hsl(var(--warning))",
      };

      return Object.entries(map).map(([method, value]) => ({
        name: labels[method] || method,
        value: Math.round((value / total) * 100),
        amount: value,
        color: colors[method] || "hsl(var(--muted-foreground))",
      }));
    },
    refetchInterval: 60000,
  });
}
