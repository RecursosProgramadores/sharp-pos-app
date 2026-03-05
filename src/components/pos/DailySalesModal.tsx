import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Banknote, CreditCard, Building2, Smartphone, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface DailySalesModalProps {
  open: boolean;
  onClose: () => void;
}

const methodIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  cash: Banknote,
  card: CreditCard,
  transfer: Building2,
  wallet: Smartphone,
  yape: Smartphone,
  plin: Smartphone,
  mixed: CreditCard,
};

const methodLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  wallet: "Wallet",
  yape: "Yape",
  plin: "Plin",
  mixed: "Mixto",
};

export function DailySalesModal({ open, onClose }: DailySalesModalProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: haircuts = [], isLoading: loadingHaircuts } = useQuery({
    queryKey: ["daily-haircuts", today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("haircuts")
        .select("*, barber:barbers(full_name)")
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const { data: sales = [], isLoading: loadingSales } = useQuery({
    queryKey: ["daily-sales", today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*, barber:barbers(full_name), sale_items(quantity, price, product:products(name))")
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const isLoading = loadingHaircuts || loadingSales;

  // Combine haircuts and sales into a unified list
  const allTransactions = [
    ...haircuts.map((h: any) => ({
      id: h.id,
      time: format(new Date(h.created_at), "HH:mm"),
      description: h.service_name,
      barber: h.barber?.full_name || "-",
      method: h.payment_method,
      total: Number(h.price),
      type: "service" as const,
    })),
    ...sales.map((s: any) => ({
      id: s.id,
      time: format(new Date(s.created_at), "HH:mm"),
      description: s.sale_items?.map((i: any) => i.product?.name).filter(Boolean).join(", ") || "Productos",
      barber: s.barber?.full_name || "-",
      method: s.payment_method,
      total: Number(s.total),
      type: "product" as const,
    })),
  ].sort((a, b) => b.time.localeCompare(a.time));

  const totalRevenue = allTransactions.reduce((acc, t) => acc + t.total, 0);
  const totalCount = allTransactions.length;
  const avgTicket = totalCount > 0 ? totalRevenue / totalCount : 0;

  const revenueByMethod = allTransactions.reduce((acc, t) => {
    acc[t.method] = (acc[t.method] || 0) + t.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Ventas del Día — {format(new Date(), "dd/MM/yyyy")}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Ventas</p>
            <p className="font-display text-3xl text-primary">S/ {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Transacciones</p>
            <p className="font-display text-3xl">{totalCount}</p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Ticket Promedio</p>
            <p className="font-display text-3xl">S/ {avgTicket.toFixed(2)}</p>
          </div>
        </div>

        {Object.keys(revenueByMethod).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(revenueByMethod).map(([method, amount]) => {
              const Icon = methodIcons[method] || Banknote;
              return (
                <Badge key={method} variant="outline" className="px-3 py-1.5 gap-2">
                  <Icon className="h-4 w-4" />
                  {methodLabels[method] || method}: S/ {amount.toFixed(2)}
                </Badge>
              );
            })}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : allTransactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay ventas registradas hoy.
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hora</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Barbero</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTransactions.map((t) => {
                  const Icon = methodIcons[t.method] || Banknote;
                  return (
                    <TableRow key={t.id}>
                      <TableCell>{t.time}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        <div className="flex items-center gap-1.5">
                          <Badge variant={t.type === "service" ? "default" : "secondary"} className="text-[10px] px-1">
                            {t.type === "service" ? "S" : "P"}
                          </Badge>
                          {t.description}
                        </div>
                      </TableCell>
                      <TableCell>{t.barber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm">{methodLabels[t.method] || t.method}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-display">S/ {t.total.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
