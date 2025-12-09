import { useState } from "react";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  Filter,
  Edit,
  Trash2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const products = [
  {
    id: 1,
    name: "Gel Fijador Fuerte",
    category: "Styling",
    stock: 5,
    minStock: 10,
    price: 18.99,
    cost: 8.5,
  },
  {
    id: 2,
    name: "Pomada Mate",
    category: "Styling",
    stock: 23,
    minStock: 15,
    price: 24.99,
    cost: 12.0,
  },
  {
    id: 3,
    name: "Aceite para Barba",
    category: "Barba",
    stock: 8,
    minStock: 10,
    price: 29.99,
    cost: 15.0,
  },
  {
    id: 4,
    name: "Shampoo Anticaspa",
    category: "Cuidado",
    stock: 45,
    minStock: 20,
    price: 15.99,
    cost: 6.0,
  },
  {
    id: 5,
    name: "Cera Moldeadora",
    category: "Styling",
    stock: 2,
    minStock: 10,
    price: 22.99,
    cost: 10.0,
  },
  {
    id: 6,
    name: "Bálsamo para Barba",
    category: "Barba",
    stock: 18,
    minStock: 12,
    price: 19.99,
    cost: 9.0,
  },
  {
    id: 7,
    name: "Spray Fijador",
    category: "Styling",
    stock: 30,
    minStock: 15,
    price: 14.99,
    cost: 5.5,
  },
  {
    id: 8,
    name: "Navaja Desechable (pack 10)",
    category: "Herramientas",
    stock: 50,
    minStock: 30,
    price: 12.99,
    cost: 4.0,
  },
];

export default function Inventario() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter((p) => p.stock < p.minStock).length;
  const totalValue = products.reduce((acc, p) => acc + p.stock * p.cost, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">
            Inventario
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus productos y stock
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Nuevo Producto
              </DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo producto
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="productName">Nombre del producto</Label>
                <Input id="productName" placeholder="Nombre del producto" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="styling">Styling</SelectItem>
                      <SelectItem value="barba">Barba</SelectItem>
                      <SelectItem value="cuidado">Cuidado</SelectItem>
                      <SelectItem value="herramientas">Herramientas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock inicial</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cost">Costo</Label>
                  <Input id="cost" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Precio venta</Label>
                  <Input id="price" type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minStock">Stock mínimo</Label>
                <Input id="minStock" type="number" placeholder="10" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Guardar Producto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Productos</p>
              <p className="font-display text-2xl">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-warning/10 p-3">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock Bajo</p>
              <p className="font-display text-2xl">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-success/10 p-3">
              <Package className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Inventario</p>
              <p className="font-display text-2xl">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar producto..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Styling">Styling</SelectItem>
            <SelectItem value="Barba">Barba</SelectItem>
            <SelectItem value="Cuidado">Cuidado</SelectItem>
            <SelectItem value="Herramientas">Herramientas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Margen</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const margin = ((product.price - product.cost) / product.price) * 100;
              const isLowStock = product.stock < product.minStock;
              return (
                <TableRow key={product.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={isLowStock ? "warning" : "success"}
                      className="min-w-[60px] justify-center"
                    >
                      {product.stock}
                    </Badge>
                    {isLowStock && (
                      <p className="text-xs text-warning mt-1">
                        Mín: {product.minStock}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">${product.cost.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-success">
                    {margin.toFixed(0)}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
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
    </div>
  );
}
