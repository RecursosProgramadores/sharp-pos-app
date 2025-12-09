import {
  DollarSign,
  Users,
  Scissors,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopServices } from "@/components/dashboard/TopServices";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { BarberStatus } from "@/components/dashboard/BarberStatus";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido de vuelta. Aquí está el resumen de hoy.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Hoy</span>
          </Button>
          <Button className="gap-2">
            <Scissors className="h-4 w-4" />
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos del Día"
          value="$1,248"
          change={{ value: 12.5, type: "increase" }}
          icon={DollarSign}
          iconColor="primary"
        />
        <StatCard
          title="Servicios Realizados"
          value="24"
          change={{ value: 8.2, type: "increase" }}
          icon={Scissors}
          iconColor="secondary"
        />
        <StatCard
          title="Clientes Nuevos"
          value="7"
          change={{ value: 23.1, type: "increase" }}
          icon={Users}
          iconColor="success"
        />
        <StatCard
          title="Ticket Promedio"
          value="$52"
          change={{ value: 4.3, type: "decrease" }}
          icon={TrendingUp}
          iconColor="info"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <TopServices />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentSales />
        <BarberStatus />
      </div>
    </div>
  );
}
