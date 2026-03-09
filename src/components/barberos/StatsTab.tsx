import { useState, useEffect } from "react";
import { Download, TrendingUp, Star, Scissors, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useBarbers } from "@/hooks/useBarbers";
import { exportJsonToExcel } from "@/lib/excelExport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function StatsTab() {
  const { barbers, isLoading: barbersLoading } = useBarbers();
  const [selectedBarberId, setSelectedBarberId] = useState<string>("all");
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [haircutHistory, setHaircutHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [selectedBarberId]);

  const fetchStats = async () => {
    setIsLoading(true);

    // Fetch income by barber
    const { data: incomeByBarber } = await supabase.from("income_by_barber").select("*");
    setIncomeData(incomeByBarber || []);

    // Fetch haircut history
    let query = supabase
      .from("haircuts")
      .select("*, barbers(full_name)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (selectedBarberId !== "all") {
      query = query.eq("barber_id", selectedBarberId);
    }

    const { data: haircuts } = await query;
    setHaircutHistory(haircuts || []);
    setIsLoading(false);
  };

  // Compute metrics
  const totalCuts = selectedBarberId === "all"
    ? incomeData.reduce((sum, d) => sum + Number(d.total_sales || 0), 0)
    : incomeData.find((d) => d.barber_id === selectedBarberId)?.total_sales || 0;

  const totalRevenue = selectedBarberId === "all"
    ? incomeData.reduce((sum, d) => sum + Number(d.total_revenue || 0), 0)
    : Number(incomeData.find((d) => d.barber_id === selectedBarberId)?.total_revenue || 0);

  const avgTicket = selectedBarberId === "all"
    ? (totalCuts > 0 ? totalRevenue / totalCuts : 0)
    : Number(incomeData.find((d) => d.barber_id === selectedBarberId)?.average_ticket || 0);

  // Chart data
  const chartData = incomeData.map((d) => ({
    name: d.barber_name?.split(" ")[0] || "N/A",
    ingresos: Number(d.total_revenue || 0),
    cortes: Number(d.total_sales || 0),
  }));

  const exportExcel = () => {
    const rows = haircutHistory.map((h) => ({
      Fecha: new Date(h.created_at).toLocaleDateString("es-MX"),
      Hora: new Date(h.created_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      Servicio: h.service_name,
      Barbero: h.barbers?.full_name || "-",
      Monto: `$${h.price}`,
      Pago: h.payment_method,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estadísticas");
    XLSX.writeFile(wb, `Estadisticas_Barberos.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Estadísticas de Barberos", 14, 22);
    doc.setFontSize(11);
    doc.text(`Total Cortes: ${totalCuts} | Ingresos: $${totalRevenue.toLocaleString()}`, 14, 32);

    autoTable(doc, {
      startY: 40,
      head: [["Fecha", "Servicio", "Barbero", "Monto", "Pago"]],
      body: haircutHistory.map((h) => [
        new Date(h.created_at).toLocaleDateString("es-MX"),
        h.service_name,
        h.barbers?.full_name || "-",
        `$${h.price}`,
        h.payment_method,
      ]),
    });
    doc.save("Estadisticas_Barberos.pdf");
  };

  if (barbersLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando estadísticas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">Todos los barberos</div>
            </SelectItem>
            {barbers.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    {b.photoUrl && <AvatarImage src={b.photoUrl} />}
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {b.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {b.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={exportExcel}><Download className="h-4 w-4" />Excel</Button>
          <Button variant="outline" className="gap-2" onClick={exportPDF}><Download className="h-4 w-4" />PDF</Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Cortes</p>
              <p className="font-display text-3xl">{Number(totalCuts).toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10"><Scissors className="h-6 w-6 text-primary" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ingresos Generados</p>
              <p className="font-display text-3xl">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10"><DollarSign className="h-6 w-6 text-success" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ticket Promedio</p>
              <p className="font-display text-3xl">${avgTicket.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-xl bg-info/10"><TrendingUp className="h-6 w-6 text-info" /></div>
          </div>
        </div>
      </div>

      {/* Income Chart */}
      {chartData.length > 0 && (
        <div className="card-elevated p-6">
          <h3 className="font-display text-xl mb-4">Comparativa de Ingresos por Barbero</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}
                  formatter={(value: number, name: string) => [name === "ingresos" ? `$${value.toLocaleString()}` : value, name === "ingresos" ? "Ingresos" : "Cortes"]}
                />
                <Bar dataKey="ingresos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="card-elevated">
        <div className="p-4 border-b border-border">
          <h3 className="font-display text-xl">Historial de Atenciones</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 text-sm font-medium">Fecha</th>
                <th className="text-left p-3 text-sm font-medium">Servicio</th>
                <th className="text-left p-3 text-sm font-medium">Barbero</th>
                <th className="text-right p-3 text-sm font-medium">Monto</th>
                <th className="text-center p-3 text-sm font-medium">Pago</th>
              </tr>
            </thead>
            <tbody>
              {haircutHistory.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No hay registros de atenciones</td></tr>
              ) : haircutHistory.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-3">
                    <p className="font-medium">{new Date(item.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}</p>
                    <p className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</p>
                  </td>
                  <td className="p-3"><Badge variant="secondary">{item.service_name}</Badge></td>
                  <td className="p-3">{item.barbers?.full_name || "-"}</td>
                  <td className="p-3 text-right font-display text-lg">${item.price}</td>
                  <td className="p-3 text-center"><Badge variant="outline">{item.payment_method}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
