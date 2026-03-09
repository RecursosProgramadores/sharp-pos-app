import { useState } from "react";
import {
  Plus, Search, Filter, Grid3X3, List, Download, Edit, Trash2, Eye, Package, ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductCard } from "./ProductCard";
import { NewProductModal } from "./NewProductModal";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { useProducts, useDeleteProduct, type Product } from "@/hooks/useInventory";
import { Skeleton } from "@/components/ui/skeleton";
import { exportJsonToExcel } from "@/lib/excelExport";

const categories = ["Todos", "Pomadas", "Shampoos", "Aceites", "Ceras", "Herramientas", "Tintes", "Aftershave", "Cuidado", "Otros", "General"];
const stockStatuses = ["Todos", "Disponible", "Bajo Stock", "Agotado"];
const sortOptions = [
  { value: "name-asc", label: "Nombre A-Z" },
  { value: "name-desc", label: "Nombre Z-A" },
  { value: "price-asc", label: "Precio Bajo-Alto" },
  { value: "price-desc", label: "Precio Alto-Bajo" },
  { value: "stock-asc", label: "Stock Bajo-Alto" },
  { value: "stock-desc", label: "Stock Alto-Bajo" },
];

function getProductStatus(p: Product) {
  if (p.stock === 0) return "out_of_stock";
  if (p.stock < p.min_stock) return "low_stock";
  return "available";
}

export function ProductsTab() {
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [stockFilter, setStockFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("name-asc");
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filteredProducts = products
    .filter((p) => {
      const status = getProductStatus(p);
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode || "").includes(searchTerm);
      const matchesCategory = categoryFilter === "Todos" || p.category === categoryFilter;
      const matchesStock =
        stockFilter === "Todos" ||
        (stockFilter === "Disponible" && status === "available") ||
        (stockFilter === "Bajo Stock" && status === "low_stock") ||
        (stockFilter === "Agotado" && status === "out_of_stock");
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "price-asc": return a.sale_price - b.sale_price;
        case "price-desc": return b.sale_price - a.sale_price;
        case "stock-asc": return a.stock - b.stock;
        case "stock-desc": return b.stock - a.stock;
        default: return 0;
      }
    });

  const handleExportExcel = () => {
    const data = filteredProducts.map((p) => ({
      Nombre: p.name,
      SKU: p.sku || "",
      "Código de Barras": p.barcode || "",
      Categoría: p.category,
      "Precio Costo": p.purchase_price,
      "Precio Venta": p.sale_price,
      Margen: p.sale_price > 0 ? `${((p.sale_price - p.purchase_price) / p.sale_price * 100).toFixed(1)}%` : "0%",
      Stock: p.stock,
      "Stock Mín.": p.min_stock,
      Estado: getProductStatus(p) === "available" ? "Disponible" : getProductStatus(p) === "low_stock" ? "Bajo Stock" : "Agotado",
    }));
    await exportJsonToExcel(data, "Productos", `Inventario_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const getStatusBadge = (p: Product) => {
    const status = getProductStatus(p);
    switch (status) {
      case "available": return { text: "Disponible", variant: "success" as const };
      case "low_stock": return { text: "Bajo Stock", variant: "warning" as const };
      case "out_of_stock": return { text: "Agotado", variant: "destructive" as const };
      default: return { text: "Desconocido", variant: "outline" as const };
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Button onClick={() => setIsNewProductOpen(true)} className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Plus className="h-4 w-4" /> Nuevo Producto
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <Download className="h-4 w-4" /> Exportar Excel
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nombre, SKU, código..." className="pl-10" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filtros</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Categoría</p>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Estado de Stock</p>
                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>{stockStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48"><ArrowUpDown className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>{sortOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="rounded-r-none" onClick={() => setViewMode("grid")}><Grid3X3 className="h-4 w-4" /></Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="rounded-l-none" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No hay productos</h3>
          <p className="text-muted-foreground mb-4">Agrega tu primer producto para empezar</p>
          <Button onClick={() => setIsNewProductOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Agregar Producto</Button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredProducts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p}
              onEdit={() => { setSelectedProduct(p); setIsDetailsOpen(true); }}
              onViewDetails={() => { setSelectedProduct(p); setIsDetailsOpen(true); }}
              onDelete={() => setDeleteTarget(p)} />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && filteredProducts.length > 0 && (
        <div className="card-elevated overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Imagen</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Margen</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => {
                const margin = p.sale_price > 0 ? ((p.sale_price - p.purchase_price) / p.sale_price * 100).toFixed(0) : "0";
                const status = getStatusBadge(p);
                return (
                  <TableRow key={p.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {p.photo_url ? <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" /> : <Package className="h-5 w-5 text-muted-foreground" />}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.sku || "-"}</TableCell>
                    <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                    <TableCell className="text-right">S/{p.purchase_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">S/{p.sale_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={parseInt(margin) > 30 ? "text-success" : parseInt(margin) > 15 ? "text-warning" : "text-destructive"}>{margin}%</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={p.stock === 0 ? "destructive" : p.stock < p.min_stock ? "warning" : "success"}>{p.stock}</Badge>
                    </TableCell>
                    <TableCell><Badge variant={status.variant}>{status.text}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedProduct(p); setIsDetailsOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(p)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      <NewProductModal open={isNewProductOpen} onOpenChange={setIsNewProductOpen} />
      <ProductDetailsModal open={isDetailsOpen} onOpenChange={setIsDetailsOpen} product={selectedProduct} />
      
      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará "{deleteTarget?.name}" permanentemente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (deleteTarget) deleteProduct.mutate(deleteTarget.id); setDeleteTarget(null); }}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
