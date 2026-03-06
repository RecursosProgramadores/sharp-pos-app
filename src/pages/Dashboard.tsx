import { Calendar, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { RevenueChart30Days } from "@/components/dashboard/RevenueChart30Days";
import { ServicesBarChart } from "@/components/dashboard/ServicesBarChart";
import { PaymentDonutChart } from "@/components/dashboard/PaymentDonutChart";
import { BarberRanking } from "@/components/dashboard/BarberRanking";
import { TodayAppointments } from "@/components/dashboard/TodayAppointments";
import { AlertsTimeline } from "@/components/dashboard/AlertsTimeline";
import { BarberSchedule } from "@/components/dashboard/BarberSchedule";
import { WeeklyReportCard } from "@/components/dashboard/WeeklyReportCard";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();

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
          <Button variant="outline" className="gap-2" onClick={() => navigate("/admin/reservas")}>
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Hoy</span>
          </Button>
          <Button className="gap-2" onClick={() => navigate("/admin/pos")}>
            <Scissors className="h-4 w-4" />
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <MetricCards />

      {/* Charts Grid - 2 columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart30Days />
        <ServicesBarChart />
      </div>

      {/* Second row of charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PaymentDonutChart />
        <BarberRanking />
      </div>

      {/* Today's Appointments + Weekly Report */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TodayAppointments />
        <WeeklyReportCard />
      </div>

      {/* Alerts + Schedule */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AlertsTimeline />
        <BarberSchedule />
      </div>
    </div>
  );
}
