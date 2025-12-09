import { useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  User,
  Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const services = [
  { id: 1, name: "Corte Clásico", price: 25, category: "Cortes" },
  { id: 2, name: "Fade Degradado", price: 35, category: "Cortes" },
  { id: 3, name: "Corte + Barba", price: 45, category: "Combos" },
  { id: 4, name: "Barba Completa", price: 20, category: "Barba" },
  { id: 5, name: "Afeitado Tradicional", price: 15, category: "Barba" },
  { id: 6, name: "Tratamiento Capilar", price: 30, category: "Tratamientos" },
];

const products = [
  { id: 101, name: "Gel Fijador", price: 18.99, category: "Productos" },
  { id: 102, name: "Pomada Mate", price: 24.99, category: "Productos" },
  { id: 103, name: "Aceite Barba", price: 29.99, category: "Productos" },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: "service" | "product";
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  const allItems = [...services, ...products.map((p) => ({ ...p, category: "Productos" }))];
  
  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: { id: number; name: string; price: number }, type: "service" | "product") => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1, type }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const processPayment = (method: "cash" | "card") => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos o servicios para continuar",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "¡Venta completada!",
      description: `Total: $${total.toFixed(2)} - Pago: ${method === "cash" ? "Efectivo" : "Tarjeta"}`,
    });
    setCart([]);
    setSelectedClient("");
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-6">
      {/* Left Panel - Items */}
      <div className="flex-1 flex flex-col space-y-4 min-w-0">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">
            Punto de Venta
          </h1>
          <p className="text-muted-foreground mt-1">
            Registra ventas y servicios
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "Cortes", "Barba", "Combos", "Tratamientos", "Productos"].map(
              (cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "all" ? "Todos" : cat}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  addToCart(item, item.id > 100 ? "product" : "service")
                }
                className="card-elevated p-4 text-left hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant={item.id > 100 ? "secondary" : "default"}
                    className="text-xs"
                  >
                    {item.category}
                  </Badge>
                  <span className="font-display text-lg group-hover:text-primary transition-colors">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <h3 className="font-medium text-sm">{item.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-full max-w-md flex flex-col card-elevated p-6">
        {/* Client & Barber Selection */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walk-in">Cliente sin registro</SelectItem>
                <SelectItem value="carlos">Carlos Mendoza</SelectItem>
                <SelectItem value="roberto">Roberto García</SelectItem>
                <SelectItem value="luis">Luis Pérez</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedBarber} onValueChange={setSelectedBarber}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar barbero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="miguel">Miguel Ángel</SelectItem>
                <SelectItem value="juan">Juan Carlos</SelectItem>
                <SelectItem value="pedro">Pedro Sánchez</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Cart Items */}
        <div className="flex-1 overflow-auto space-y-2 my-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Receipt className="h-12 w-12 mb-2 opacity-50" />
              <p>Carrito vacío</p>
              <p className="text-sm">Selecciona servicios o productos</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <Separator className="my-2" />

        {/* Totals */}
        <div className="space-y-2 py-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">IVA (16%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="font-display text-3xl">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => processPayment("cash")}
          >
            <Banknote className="h-5 w-5" />
            Efectivo
          </Button>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => processPayment("card")}
          >
            <CreditCard className="h-5 w-5" />
            Tarjeta
          </Button>
        </div>
      </div>
    </div>
  );
}
