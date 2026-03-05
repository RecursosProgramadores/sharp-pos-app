import { useState } from "react";
import {
  Calendar,
  Download,
  BarChart3,
  DollarSign,
  Scissors,
  Package,
  Users,
  GitCompare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExecutiveSummaryTab from "@/components/reportes/ExecutiveSummaryTab";
import FinancialReportTab from "@/components/reportes/FinancialReportTab";
import ServicesAnalysisTab from "@/components/reportes/ServicesAnalysisTab";
import InventoryAnalysisTab from "@/components/reportes/InventoryAnalysisTab";
import ClientsAnalysisTab from "@/components/reportes/ClientsAnalysisTab";
import ComparativeAnalysisTab from "@/components/reportes/ComparativeAnalysisTab";

export default function Reportes() {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">
            Reportes y Estadísticas
          </h1>
          <p className="text-muted-foreground mt-1">
            Analiza el rendimiento completo de tu barbería
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="yesterday">Ayer</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="lastweek">Semana pasada</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="lastmonth">Mes pasado</SelectItem>
              <SelectItem value="quarter">Últimos 3 meses</SelectItem>
              <SelectItem value="year">Año actual</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="resumen" className="gap-2 data-[state=active]:bg-background">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Resumen Ejecutivo</span>
            <span className="sm:hidden">Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="financiero" className="gap-2 data-[state=active]:bg-background">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Reporte Financiero</span>
            <span className="sm:hidden">Financiero</span>
          </TabsTrigger>
          <TabsTrigger value="servicios" className="gap-2 data-[state=active]:bg-background">
            <Scissors className="h-4 w-4" />
            <span className="hidden sm:inline">Análisis de Servicios</span>
            <span className="sm:hidden">Servicios</span>
          </TabsTrigger>
          <TabsTrigger value="inventario" className="gap-2 data-[state=active]:bg-background">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Análisis de Inventario</span>
            <span className="sm:hidden">Inventario</span>
          </TabsTrigger>
          <TabsTrigger value="clientes" className="gap-2 data-[state=active]:bg-background">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Análisis de Clientes</span>
            <span className="sm:hidden">Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="comparativo" className="gap-2 data-[state=active]:bg-background">
            <GitCompare className="h-4 w-4" />
            <span className="hidden sm:inline">Análisis Comparativo</span>
            <span className="sm:hidden">Comparativo</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumen">
          <ExecutiveSummaryTab period={period} />
        </TabsContent>
        <TabsContent value="financiero">
          <FinancialReportTab period={period} />
        </TabsContent>
        <TabsContent value="servicios">
          <ServicesAnalysisTab period={period} />
        </TabsContent>
        <TabsContent value="inventario">
          <InventoryAnalysisTab />
        </TabsContent>
        <TabsContent value="clientes">
          <ClientsAnalysisTab period={period} />
        </TabsContent>
        <TabsContent value="comparativo">
          <ComparativeAnalysisTab period={period} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
