import { useState } from "react";
import { Package, ArrowLeftRight, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductsTab } from "@/components/inventario/ProductsTab";
import { MovementsTab } from "@/components/inventario/MovementsTab";
import { AlertsTab } from "@/components/inventario/AlertsTab";

export default function Inventario() {
  const [activeTab, setActiveTab] = useState("products");

  // Mock counts for badges
  const lowStockCount = 4;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl tracking-tight">
          Inventario
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona productos, movimientos y alertas de stock
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Productos</span>
          </TabsTrigger>
          <TabsTrigger value="movements" className="gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="hidden sm:inline">Movimientos</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2 relative">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Alertas</span>
            {lowStockCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {lowStockCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="movements" className="mt-6">
          <MovementsTab />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <AlertsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
