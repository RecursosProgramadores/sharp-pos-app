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
  Loader2,
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface CartItemType {
  id: string;
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
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [selectedClient, setSelectedClient] = useState("walk-in");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [serviceCategory, setServiceCategory] = useState("Todos");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [tipPercent, setTipPercent] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [ticketNumber] = useState(() => `T-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals
  const [quantityProduct, setQuantityProduct] = useState<any | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDailySales, setShowDailySales] = useState(false);
  const [showSavedSales, setShowSavedSales] = useState(false);

  // Saved sales (local state)
  const [savedSales, setSavedSales] = useState<SavedSale[]>([]);

  // Fetch real services
  const { data: services = [] } = useQuery({
    queryKey: ["pos-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("category")
        .order("price");
      if (error) throw error;
      return data;
    },
  });

  // Fetch real products
  const { data: products = [] } = useQuery({
    queryKey: ["pos-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("category")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch real barbers
  const { data: barbers = [] } = useQuery({
    queryKey: ["pos-barbers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("barbers")
        .select("id, full_name, photo_url")
        .eq("active", true)
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch real clients
  const { data: clients = [] } = useQuery({
    queryKey: ["pos-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, full_name, phone")
        .order("full_name")
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  // Service categories
  const serviceCategories = ["Todos", ...new Set(services.map((s) => s.category))];

  // Product categories
  const productCategories = ["Todos", ...new Set(products.map((p) => p.category))];

  const filteredServices = serviceCategory === "Todos"
    ? services
    : services.filter((s) => s.category === serviceCategory);

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
        price: Number(service.price),
        quantity: 1,
        type: "service" as const,
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
        price: Number(product.sale_price),
        quantity,
        type: "product" as const,
      }];
    });
    toast({ title: "Producto agregado", description: `${product.name} x${quantity}` });
  };

  const updateQuantity = (id: string, type: "service" | "product", delta: number) => {
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

  const updateBarber = (id: string, barberId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.type === "service"
          ? { ...item, barberId }
          : item
      )
    );
  };

  const removeItem = (id: string, type: "service" | "product") => {
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
  const tipAmount = tipPercent
    ? afterDiscount * (tipPercent / 100)
    : customTip
      ? parseFloat(customTip)
      : 0;
  const total = afterDiscount + tipAmount;

  const hasServicesWithoutBarber = cart.some(
    (item) => item.type === "service" && !item.barberId
  );

  const saveCurrentSale = () => {
    if (cart.length === 0) {
      toast({ title: "Carrito vacío", variant: "destructive" });
      return;
    }
    const clientName = selectedClient === "walk-in"
      ? "Cliente General"
      : clients.find((c) => c.id === selectedClient)?.full_name || "Cliente General";
    const newSaved: SavedSale = {
      id: `S-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      client: clientName,
      items: [...cart],
      total: subtotal,
      savedAt: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
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

  const handlePaymentConfirm = async (method: string, details: Record<string, unknown>) => {
    setIsProcessing(true);
    try {
      const servicesInCartItems = cart.filter((i) => i.type === "service");
      const productsInCartItems = cart.filter((i) => i.type === "product");

      // Determine the payment method string
      const paymentMethod = method === "mixed" ? "mixed" : method;

      // Record each service as a haircut
      for (const item of servicesInCartItems) {
        for (let i = 0; i < item.quantity; i++) {
          const { error } = await supabase.from("haircuts").insert({
            barber_id: item.barberId || null,
            service_name: item.name,
            price: item.price,
            payment_method: paymentMethod,
          });
          if (error) throw error;
        }
      }

      // Record product sales
      if (productsInCartItems.length > 0) {
        // Use the first service's barber or null
        const barberId = servicesInCartItems[0]?.barberId || null;
        const productTotal = productsInCartItems.reduce((a, i) => a + i.price * i.quantity, 0);

        const { data: sale, error: saleError } = await supabase
          .from("sales")
          .insert({
            barber_id: barberId,
            total: productTotal,
            payment_method: paymentMethod,
          })
          .select("id")
          .single();

        if (saleError) throw saleError;

        // Insert sale items
        const saleItems = productsInCartItems.map((item) => ({
          sale_id: sale.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: itemsError } = await supabase.from("sale_items").insert(saleItems);
        if (itemsError) throw itemsError;
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["daily-haircuts"] });
      queryClient.invalidateQueries({ queryKey: ["daily-sales"] });
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });

      clearCart();
      setShowPaymentModal(false);
      toast({
        title: "¡Venta completada!",
        description: `Ticket ${ticketNumber} — Total: S/ ${total.toFixed(2)}`,
      });
    } catch (error: any) {
      toast({ title: "Error al procesar venta", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  // Keyboard shortcuts
  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    if (e.key === "F1") { e.preventDefault(); clearCart(); }
    else if (e.key === "F2") {
      e.preventDefault();
      if (cart.length > 0 && !hasServicesWithoutBarber) setShowPaymentModal(true);
    }
    else if (e.key === "F9") { e.preventDefault(); document.getElementById("search-input")?.focus(); }
    else if (e.key === "Escape") clearCart();
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl tracking-tight">Punto de Venta</h1>
            <p className="text-muted-foreground text-sm">Ticket: {ticketNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowDailySales(true)}>
              <ListOrdered className="h-4 w-4" />
              <span className="hidden sm:inline">Ventas del Día</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 relative" onClick={() => setShowSavedSales(true)}>
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

          <TabsContent value="services" className="flex-1 flex flex-col min-h-0 mt-0">
            {/* Service category pills */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {serviceCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={serviceCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceCategory(cat)}
                  className="whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>

            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onClick={() => addService(service)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="products" className="flex-1 flex flex-col min-h-0 mt-0">
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
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {productCategories.map((cat) => (
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

            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setQuantityProduct(product)}
                  />
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No hay productos disponibles.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Cart */}
      <div className="flex-[4] flex flex-col card-elevated p-4 lg:p-6 min-w-[320px] max-w-md">
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
              <SelectItem value="walk-in">Cliente General</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.full_name} — {client.phone}
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
              <p className="text-sm text-center mt-1">Selecciona servicios o productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {servicesInCart.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Servicios</p>
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
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Productos</p>
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
            <div className="space-y-3 py-3">
              {/* Discount */}
              <div className="flex items-center gap-2">
                <div className="flex border rounded-md overflow-hidden">
                  <Button variant={discountType === "percent" ? "default" : "ghost"} size="sm" className="rounded-none h-8 px-2" onClick={() => setDiscountType("percent")}>
                    <Percent className="h-3 w-3" />
                  </Button>
                  <Button variant={discountType === "fixed" ? "default" : "ghost"} size="sm" className="rounded-none h-8 px-2" onClick={() => setDiscountType("fixed")}>
                    <DollarSign className="h-3 w-3" />
                  </Button>
                </div>
                <Input type="number" placeholder="Descuento" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="flex-1 h-8" />
              </div>

              {/* Tip */}
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground whitespace-nowrap">Propina:</Label>
                <div className="flex gap-1 flex-1">
                  {[5, 10, 15].map((percent) => (
                    <Button key={percent} variant={tipPercent === percent ? "default" : "outline"} size="sm" className="flex-1 h-8 px-2" onClick={() => { setTipPercent(tipPercent === percent ? null : percent); setCustomTip(""); }}>
                      {percent}%
                    </Button>
                  ))}
                  <Input type="number" placeholder="S/" value={customTip} onChange={(e) => { setCustomTip(e.target.value); setTipPercent(null); }} className="w-16 h-8" />
                </div>
              </div>

              {/* Student toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="student" className="flex items-center gap-2 text-sm cursor-pointer">
                  <GraduationCap className="h-4 w-4" />
                  Cliente estudiante (-10%)
                </Label>
                <Switch id="student" checked={isStudent} onCheckedChange={setIsStudent} />
              </div>
            </div>
            <Separator className="my-2" />
          </>
        )}

        {/* Totals */}
        <div className="space-y-1.5 py-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento</span>
              <span>-S/ {totalDiscount.toFixed(2)}</span>
            </div>
          )}
          {tipAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Propina</span>
              <span>S/ {tipAmount.toFixed(2)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">TOTAL</span>
            <span className="font-display text-4xl text-primary">S/ {total.toFixed(2)}</span>
          </div>
        </div>

        {hasServicesWithoutBarber && (
          <p className="text-destructive text-sm text-center mb-3">⚠️ Selecciona un barbero para cada servicio</p>
        )}

        <div className="grid grid-cols-2 gap-3 mt-auto pt-4">
          <Button variant="outline" size="lg" className="h-14 gap-2" onClick={saveCurrentSale} disabled={cart.length === 0}>
            <Save className="h-5 w-5" />
            Guardar
          </Button>
          <Button
            size="lg"
            className="h-14 gap-2 text-lg font-bold bg-secondary hover:bg-secondary/90"
            onClick={() => setShowPaymentModal(true)}
            disabled={cart.length === 0 || hasServicesWithoutBarber || isProcessing}
          >
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : "COBRAR"}
          </Button>
        </div>

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
