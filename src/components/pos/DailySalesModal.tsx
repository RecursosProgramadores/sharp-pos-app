import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Banknote, CreditCard, Building2, Smartphone } from "lucide-react";

interface Sale {
  id: string;
  time: string;
  items: number;
  total: number;
  method: string;
  cashier: string;
  barber?: string;
}

interface DailySalesModalProps {
  open: boolean;
  onClose: () => void;
}

const mockSales: Sale[] = [
  { id: "V-001", time: "09:15", items: 2, total: 45, method: "cash", cashier: "Admin", barber: "Miguel Ángel" },
  { id: "V-002", time: "09:45", items: 1, total: 20, method: "card", cashier: "Admin", barber: "Juan Carlos" },
  { id: "V-003", time: "10:20", items: 3, total: 78.50, method: "cash", cashier: "Admin", barber: "Miguel Ángel" },
  { id: "V-004", time: "11:00", items: 1, total: 35, method: "transfer", cashier: "Admin", barber: "Pedro" },
  { id: "V-005", time: "11:30", items: 4, total: 125, method: "wallet", cashier: "Admin", barber: "Juan Carlos" },
  { id: "V-006", time: "12:15", items: 2, total: 55, method: "card", cashier: "Admin", barber: "Miguel Ángel" },
  { id: "V-007", time: "13:00", items: 1, total: 25, method: "cash", cashier: "Admin" },
  { id: "V-008", time: "14:30", items: 2, total: 65, method: "card", cashier: "Admin", barber: "Pedro" },
];

const methodIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  cash: Banknote,
  card: CreditCard,
  transfer: Building2,
  wallet: Smartphone,
};

const methodLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  wallet: "Wallet",
};

export function DailySalesModal({ open, onClose }: DailySalesModalProps) {
  const totalSales = mockSales.reduce((acc, sale) => acc + sale.total, 0);
  const totalTransactions = mockSales.length;
  const averageTicket = totalSales / totalTransactions;

  const salesByMethod = mockSales.reduce((acc, sale) => {
    acc[sale.method] = (acc[sale.method] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Ventas del Día</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Ventas</p>
            <p className="font-display text-3xl text-primary">${totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Transacciones</p>
            <p className="font-display text-3xl">{totalTransactions}</p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Ticket Promedio</p>
            <p className="font-display text-3xl">${averageTicket.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(salesByMethod).map(([method, amount]) => {
            const Icon = methodIcons[method];
            return (
              <Badge key={method} variant="outline" className="px-3 py-1.5 gap-2">
                <Icon className="h-4 w-4" />
                {methodLabels[method]}: ${amount.toFixed(2)}
              </Badge>
            );
          })}
        </div>

        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Barbero</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSales.map((sale) => {
                const Icon = methodIcons[sale.method];
                return (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.time}</TableCell>
                    <TableCell>{sale.items}</TableCell>
                    <TableCell>{sale.barber || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{methodLabels[sale.method]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-display">${sale.total.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
