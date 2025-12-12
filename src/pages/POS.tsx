import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Trash2,
  Receipt,
  User,
  Percent,
  DollarSign,
  GraduationCap,
  Save,
  ShoppingCart,
  ListOrdered,
  Package2,
  Scissors,
  ScanBarcode,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { ServiceCard } from "@/components/pos/ServiceCard";
import { ProductCard } from "@/components/pos/ProductCard";
import { QuantityModal } from "@/components/pos/QuantityModal";
import { PaymentModal } from "@/components/pos/PaymentModal";
import { DailySalesModal } from "@/components/pos/DailySalesModal";
import { SavedSalesModal } from "@/components/pos/SavedSalesModal";
import { CartItem } from "@/components/pos/CartItem";

const services = [
  { id: 1, name: "Corte Clásico", price: 15, icon: "scissors", color: "bg-blue-600" },
  { id: 2, name: "Fade", price: 20, icon: "sparkles", color: "bg-purple-600" },
  { id: 3, name: "Barba", price: 12, icon: "brush", color: "bg-amber-600" },
  { id: 4, name: "Diseño", price: 18, icon: "paint", color: "bg-pink-600" },
  { id: 5, name: "Corte + Barba", price: 25, icon: "scissors", color: "bg-green-600" },
  { id: 6, name: "Tratamiento Capilar", price: 30, icon: "droplets", color: "bg-teal-600" },
  { id: 7, name: "Coloración", price: 40, icon: "paint", color: "bg-orange-600" },
  { id: 8, name: "Niño", price: 12, icon: "baby", color: "bg-sky-600" },
];

const products = [
  { id: 101, name: "Pomada Mate", price: 18.99, stock: 15, category: "Pomadas" },
  { id: 102, name: "Gel Fijador", price: 12.99, stock: 8, category: "Geles" },
  { id: 103, name: "Aceite Barba", price: 24.99, stock: 4, category: "Aceites" },
  { id: 104, name: "Cera Moldeadora", price: 16.99, stock: 12, category: "Ceras" },
  { id: 105, name: "Shampoo Anti-Caspa", price: 14.99, stock: 20, category: "Shampoos" },
  { id: 106, name: "Aftershave", price: 19.99, stock: 2, category: "Aftershave" },
  { id: 107, name: "Tinte Negro", price: 29.99, stock: 6, category: "Tintes" },
  { id: 108, name: "Pomada Brillante", price: 17.99, stock: 0, category: "Pomadas" },
];

const barbers = [
  { id: "miguel", name: "Miguel Ángel" },
  { id: "juan", name: "Juan Carlos" },
  { id: "pedro", name: "Pedro Sánchez" },
  { id: "carlos", name: "Carlos López" },
];

const clients = [
  { id: "walk-in", name: "Cliente General" },
  { id: "carlos", name: "Carlos Mendoza" },
  { id: "roberto", name: "Roberto García" },
  { id: "luis", name: "Luis Pérez" },
  { id: "mario", name: "Mario González" },
];

const categories = ["Todos", "Pomadas", "Geles", "Aceites", "Ceras", "Shampoos", "Aftershave", "Tintes"];

interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: "service" | "product";
  barberId?: string;
}

interface SavedSale {
  id: string;
  client: string;
  items: CartItemType[];
  total: number;
  savedAt: string;
}

export default function POS() {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [selectedClient, setSelectedClient] = useState("walk-in");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [tipPercent, setTipPercent] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [ticketNumber] = useState(() => `T-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  
  // Modals
  const [quantityProduct, setQuantityProduct] = useState<typeof products[0] | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDailySales, setShowDailySales] = useState(false);
  const [showSavedSales, setShowSavedSales] = useState(false);
  
  // Saved sales
  const [savedSales, setSavedSales] = useState<SavedSale[]>([
    { id: "S-001", client: "Roberto García", items: [], total: 45.00, savedAt: "Hace 30 min" },
    { id: "S-002", client: "Cliente General", items: [], total: 28.50, savedAt: "Hace 1 hora" },
  ]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addService = (service: typeof services[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === service.id && i.type === "service");
      if (existing) {
        return prev.map((i) =>
          i.id === service.id && i.type === "service"
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { 
        id: service.id, 
        name: service.name, 
        price: service.price, 
        quantity: 1, 
        type: "service" as const 
      }];
    });
    toast({ title: "Servicio agregado", description: service.name });
  };

  const addProduct = (product: typeof products[0], quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.type === "product");
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.type === "product"
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity, 
        type: "product" as const 
      }];
    });
    toast({ title: "Producto agregado", description: `${product.name} x${quantity}` });
  };

  const updateQuantity = (id: number, type: "service" | "product", delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.type === type
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateBarber = (id: number, barberId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.type === "service"
          ? { ...item, barberId }
          : item
      )
    );
  };

  const removeItem = (id: number, type: "service" | "product") => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.type === type)));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountValue("");
    setTipPercent(null);
    setCustomTip("");
    setIsStudent(false);
    setSelectedClient("walk-in");
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const studentDiscount = isStudent ? subtotal * 0.1 : 0;
  
  const manualDiscount = discountValue
    ? discountType === "percent"
      ? (subtotal - studentDiscount) * (parseFloat(discountValue) / 100)
      : parseFloat(discountValue)
    : 0;
  
  const totalDiscount = studentDiscount + manualDiscount;
  
  const afterDiscount = subtotal - totalDiscount;
  
  const tax = afterDiscount * 0.16;
  
  const tipAmount = tipPercent
    ? afterDiscount * (tipPercent / 100)
    : customTip
      ? parseFloat(customTip)
      : 0;
  
  const total = afterDiscount + tax + tipAmount;

  const hasServicesWithoutBarber = cart.some(
    (item) => item.type === "service" && !item.barberId
  );

  const saveCurrentSale = () => {
    if (cart.length === 0) {
      toast({ title: "Carrito vacío", variant: "destructive" });
      return;
    }
    
    const clientName = clients.find((c) => c.id === selectedClient)?.name || "Cliente General";
    const newSaved: SavedSale = {
      id: `S-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      client: clientName,
      items: [...cart],
      total: subtotal,
      savedAt: "Ahora",
    };
    
    setSavedSales((prev) => [...prev, newSaved]);
    clearCart();
    toast({ title: "Venta guardada", description: "Puedes continuar después" });
  };

  const resumeSale = (id: string) => {
    const sale = savedSales.find((s) => s.id === id);
    if (sale) {
      setCart(sale.items);
      setSavedSales((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const deleteSavedSale = (id: string) => {
    setSavedSales((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Venta eliminada" });
  };

  const handlePaymentConfirm = () => {
    clearCart();
    setShowPaymentModal(false);
    toast({
      title: "¡Venta completada!",
      description: `Ticket ${ticketNumber} - Total: $${total.toFixed(2)}`,
    });
  };

  // Keyboard shortcuts
  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    if (e.key === "F1") {
      e.preventDefault();
      clearCart();
    } else if (e.key === "F2") {
      e.preventDefault();
      if (cart.length > 0 && !hasServicesWithoutBarber) {
        setShowPaymentModal(true);
      }
    } else if (e.key === "F9") {
      e.preventDefault();
      document.getElementById("search-input")?.focus();
    } else if (e.key === "Escape") {
      clearCart();
    }
  }, [cart.length, hasServicesWithoutBarber]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  const servicesInCart = cart.filter((item) => item.type === "service");
  const productsInCart = cart.filter((item) => item.type === "product");

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-4 lg:gap-6">
      {/* Left Panel - Catalog */}
      <div className="flex-[6] flex flex-col min-w-0">
        {/* Header with actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl tracking-tight">
              Punto de Venta
            </h1>
            <p className="text-muted-foreground text-sm">
              Ticket: {ticketNumber}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowDailySales(true)}
            >
              <ListOrdered className="h-4 w-4" />
              <span className="hidden sm:inline">Ventas del Día</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="gap-2 relative"
              onClick={() => setShowSavedSales(true)}
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Guardadas</span>
              {savedSales.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {savedSales.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs for Services/Products */}
        <Tabs defaultValue="services" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 h-14 mb-4">
            <TabsTrigger value="services" className="h-12 text-base gap-2">
              <Scissors className="h-5 w-5" />
              SERVICIOS
            </TabsTrigger>
            <TabsTrigger value="products" className="h-12 text-base gap-2">
              <Package2 className="h-5 w-5" />
              PRODUCTOS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="flex-1 overflow-auto mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => addService(service)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="flex-1 flex flex-col min-h-0 mt-0">
            {/* Search and filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search-input"
                  placeholder="Buscar producto..."
                  className="pl-10 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="lg" className="gap-2 h-12">
                <ScanBarcode className="h-5 w-5" />
                <span className="hidden sm:inline">Escanear</span>
              </Button>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Products grid */}
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setQuantityProduct(product)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Cart */}
      <div className="flex-[4] flex flex-col card-elevated p-4 lg:p-6 min-w-[320px] max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Venta Actual</h2>
            <Badge variant="outline">{ticketNumber}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive gap-1"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Limpiar
          </Button>
        </div>

        {/* Client selection */}
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-2" />

        {/* Cart items */}
        <ScrollArea className="flex-1 my-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
              <Receipt className="h-16 w-16 mb-4 opacity-30" />
              <p className="font-medium">Carrito vacío</p>
              <p className="text-sm text-center mt-1">
                Selecciona servicios o productos para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {servicesInCart.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Servicios
                  </p>
                  <div className="space-y-2">
                    {servicesInCart.map((item) => (
                      <CartItem
                        key={`service-${item.id}`}
                        item={item}
                        barbers={barbers}
                        onUpdateQuantity={(delta) => updateQuantity(item.id, "service", delta)}
                        onRemove={() => removeItem(item.id, "service")}
                        onBarberChange={(barberId) => updateBarber(item.id, barberId)}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {productsInCart.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Productos
                  </p>
                  <div className="space-y-2">
                    {productsInCart.map((item) => (
                      <CartItem
                        key={`product-${item.id}`}
                        item={item}
                        barbers={barbers}
                        onUpdateQuantity={(delta) => updateQuantity(item.id, "product", delta)}
                        onRemove={() => removeItem(item.id, "product")}
                        onBarberChange={() => {}}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {cart.length > 0 && (
          <>
            <Separator className="my-2" />

            {/* Adjustments section */}
            <div className="space-y-3 py-3">
              {/* Discount */}
              <div className="flex items-center gap-2">
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={discountType === "percent" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none h-8 px-2"
                    onClick={() => setDiscountType("percent")}
                  >
                    <Percent className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={discountType === "fixed" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none h-8 px-2"
                    onClick={() => setDiscountType("fixed")}
                  >
                    <DollarSign className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  type="number"
                  placeholder="Descuento"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="flex-1 h-8"
                />
              </div>

              {/* Tip */}
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground whitespace-nowrap">Propina:</Label>
                <div className="flex gap-1 flex-1">
                  {[5, 10, 15].map((percent) => (
                    <Button
                      key={percent}
                      variant={tipPercent === percent ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-8 px-2"
                      onClick={() => {
                        setTipPercent(tipPercent === percent ? null : percent);
                        setCustomTip("");
                      }}
                    >
                      {percent}%
                    </Button>
                  ))}
                  <Input
                    type="number"
                    placeholder="$"
                    value={customTip}
                    onChange={(e) => {
                      setCustomTip(e.target.value);
                      setTipPercent(null);
                    }}
                    className="w-16 h-8"
                  />
                </div>
              </div>

              {/* Student toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="student" className="flex items-center gap-2 text-sm cursor-pointer">
                  <GraduationCap className="h-4 w-4" />
                  Cliente estudiante (-10%)
                </Label>
                <Switch
                  id="student"
                  checked={isStudent}
                  onCheckedChange={setIsStudent}
                />
              </div>
            </div>

            <Separator className="my-2" />
          </>
        )}

        {/* Totals */}
        <div className="space-y-1.5 py-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento</span>
              <span>-${totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">IVA (16%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {tipAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Propina</span>
              <span>${tipAmount.toFixed(2)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">TOTAL</span>
            <span className="font-display text-4xl text-primary">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Warning for missing barber */}
        {hasServicesWithoutBarber && (
          <p className="text-destructive text-sm text-center mb-3">
            ⚠️ Selecciona un barbero para cada servicio
          </p>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto pt-4">
          <Button
            variant="outline"
            size="lg"
            className="h-14 gap-2"
            onClick={saveCurrentSale}
            disabled={cart.length === 0}
          >
            <Save className="h-5 w-5" />
            Guardar
          </Button>
          <Button
            size="lg"
            className="h-14 gap-2 text-lg font-bold bg-secondary hover:bg-secondary/90"
            onClick={() => setShowPaymentModal(true)}
            disabled={cart.length === 0 || hasServicesWithoutBarber}
          >
            COBRAR
          </Button>
        </div>

        {/* Keyboard shortcuts hint */}
        <p className="text-[10px] text-muted-foreground text-center mt-3">
          F1: Nuevo | F2: Cobrar | F9: Buscar | ESC: Limpiar
        </p>
      </div>

      {/* Modals */}
      <QuantityModal
        open={!!quantityProduct}
        onClose={() => setQuantityProduct(null)}
        product={quantityProduct}
        onConfirm={(qty) => {
          if (quantityProduct) {
            addProduct(quantityProduct, qty);
            setQuantityProduct(null);
          }
        }}
      />

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={total}
        onConfirm={handlePaymentConfirm}
      />

      <DailySalesModal
        open={showDailySales}
        onClose={() => setShowDailySales(false)}
      />

      <SavedSalesModal
        open={showSavedSales}
        onClose={() => setShowSavedSales(false)}
        savedSales={savedSales.map((s) => ({
          id: s.id,
          client: s.client,
          items: s.items.length,
          total: s.total,
          savedAt: s.savedAt,
        }))}
        onResume={resumeSale}
        onDelete={deleteSavedSale}
      />
    </div>
  );
}
