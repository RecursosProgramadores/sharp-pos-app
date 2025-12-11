import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Scan,
  Upload,
  Download,
  Edit,
  Trash2,
  Copy,
  Eye,
  Package,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductCard } from "./ProductCard";
import { NewProductModal } from "./NewProductModal";
import { ProductDetailsModal } from "./ProductDetailsModal";

const products = [
  { id: 1, name: "Gel Fijador Fuerte", sku: "PRD-001", barcode: "7501234567890", category: "Styling", stock: 5, minStock: 10, price: 18.99, cost: 8.50, status: "low_stock" as const },
  { id: 2, name: "Pomada Mate Premium", sku: "PRD-002", barcode: "7501234567891", category: "Styling", stock: 23, minStock: 15, price: 24.99, cost: 12.00, status: "available" as const },
  { id: 3, name: "Aceite para Barba Orgánico", sku: "PRD-003", barcode: "7501234567892", category: "Barba", stock: 8, minStock: 10, price: 29.99, cost: 15.00, status: "low_stock" as const },
  { id: 4, name: "Shampoo Anticaspa Pro", sku: "PRD-004", barcode: "7501234567893", category: "Cuidado", stock: 45, minStock: 20, price: 15.99, cost: 6.00, status: "available" as const },
  { id: 5, name: "Cera Moldeadora Strong", sku: "PRD-005", barcode: "7501234567894", category: "Styling", stock: 0, minStock: 10, price: 22.99, cost: 10.00, status: "out_of_stock" as const },
  { id: 6, name: "Bálsamo para Barba Suave", sku: "PRD-006", barcode: "7501234567895", category: "Barba", stock: 18, minStock: 12, price: 19.99, cost: 9.00, status: "available" as const },
  { id: 7, name: "Spray Fijador Extra", sku: "PRD-007", barcode: "7501234567896", category: "Styling", stock: 30, minStock: 15, price: 14.99, cost: 5.50, status: "available" as const },
  { id: 8, name: "Navaja Desechable Pack 10", sku: "PRD-008", barcode: "7501234567897", category: "Herramientas", stock: 50, minStock: 30, price: 12.99, cost: 4.00, status: "available" as const },
  { id: 9, name: "Tinte Capilar Negro Intenso", sku: "PRD-009", barcode: "7501234567898", category: "Tintes", stock: 12, minStock: 8, price: 35.99, cost: 18.00, status: "available" as const },
  { id: 10, name: "Aftershave Mentolado", sku: "PRD-010", barcode: "7501234567899", category: "Aftershave", stock: 3, minStock: 10, price: 16.99, cost: 7.00, status: "low_stock" as const },
  { id: 11, name: "Aceite Esencial Eucalipto", sku: "PRD-011", barcode: "7501234567900", category: "Aceites", stock: 20, minStock: 10, price: 12.99, cost: 5.00, status: "available" as const },
  { id: 12, name: "Peine Profesional Carbon", sku: "PRD-012", barcode: "7501234567901", category: "Herramientas", stock: 35, minStock: 15, price: 8.99, cost: 3.00, status: "available" as const },
];

const categories = ["Todos", "Styling", "Barba", "Cuidado", "Herramientas", "Tintes", "Aftershave", "Aceites"];
const stockStatuses = ["Todos", "Disponible", "Bajo Stock", "Agotado"];
const sortOptions = [
  { value: "name-asc", label: "Nombre A-Z" },
  { value: "name-desc", label: "Nombre Z-A" },
  { value: "price-asc", label: "Precio Bajo-Alto" },
  { value: "price-desc", label: "Precio Alto-Bajo" },
  { value: "stock-asc", label: "Stock Bajo-Alto" },
  { value: "stock-desc", label: "Stock Alto-Bajo" },
];

export function ProductsTab() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [stockFilter, setStockFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("name-asc");
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm);
      const matchesCategory = categoryFilter === "Todos" || product.category === categoryFilter;
      const matchesStock = 
        stockFilter === "Todos" ||
        (stockFilter === "Disponible" && product.status === "available") ||
        (stockFilter === "Bajo Stock" && product.status === "low_stock") ||
        (stockFilter === "Agotado" && product.status === "out_of_stock");
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "stock-asc": return a.stock - b.stock;
        case "stock-desc": return b.stock - a.stock;
        default: return 0;
      }
    });

  const handleViewDetails = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleEdit = (product: typeof products[0]) => {
    console.log("Edit product:", product);
  };

  const handleDelete = (product: typeof products[0]) => {
    console.log("Delete product:", product);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available": return { text: "Disponible", variant: "success" as const };
      case "low_stock": return { text: "Bajo Stock", variant: "warning" as const };
      case "out_of_stock": return { text: "Agotado", variant: "destructive" as const };
      default: return { text: "Desconocido", variant: "outline" as const };
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Button 
            onClick={() => setIsNewProductOpen(true)}
            className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2">
              <Scan className="h-4 w-4" />
              Escanear Código
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Importar CSV
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, SKU, código..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Categoría</p>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Estado de Stock</p>
                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stockStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products View */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Imagen</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>SKU / Código</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Margen</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Mín.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const margin = ((product.price - product.cost) / product.price * 100).toFixed(0);
                const status = getStatusBadge(product.status);
                return (
                  <TableRow key={product.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{product.sku}</p>
                        <p className="text-xs text-muted-foreground">{product.barcode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${product.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={parseInt(margin) > 30 ? "text-success" : parseInt(margin) > 15 ? "text-warning" : "text-destructive"}>
                        {margin}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.stock === 0 ? "destructive" : product.stock < product.minStock ? "warning" : "success"}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{product.minStock}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.text}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetails(product)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
      <ProductDetailsModal 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
        product={selectedProduct}
      />
    </div>
  );
}
