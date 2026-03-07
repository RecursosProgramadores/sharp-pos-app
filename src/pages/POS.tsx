import { useState, useEffect, useCallback, useMemo } from "react";
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
  CalendarCheck,
  Phone,
  ArrowRight,
  X,
  Star,
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
import { ThermalReceipt } from "@/components/pos/ThermalReceipt";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sendSaleReceipt } from "@/lib/whatsapp";
import { logActivity } from "@/lib/security";

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
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [serviceCategory, setServiceCategory] = useState("Todos");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [tipPercent, setTipPercent] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [ticketNumber] = useState(() => `T-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("services");

  // Modals
  const [quantityProduct, setQuantityProduct] = useState<any | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDailySales, setShowDailySales] = useState(false);
  const [showSavedSales, setShowSavedSales] = useState(false);
  const [printReceiptData, setPrintReceiptData] = useState<any | null>(null);

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
        .select("id, full_name, phone, level, points")
        .order("full_name")
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  // Fetch today's pending/confirmed reservations
  const today = new Date().toISOString().split("T")[0];
  const { data: todayReservations = [] } = useQuery({
    queryKey: ["pos-today-reservations", today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          id, client_name, client_phone, reservation_time, status, client_id,
          service:services(id, name, price, duration_minutes),
          barber:barbers(id, full_name)
        `)
        .eq("reservation_date", today)
        .in("status", ["pending", "confirmed"])
        .order("reservation_time", { ascending: true });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  // Service categories
  const serviceCategories = ["Todos", ...new Set(services.map((s) => s.category))];

  // Product categories
  const productCategories = ["Todos", ...new Set(products.map((p) => p.category))];

  const filteredServices = services.filter((s) => {
    const matchesCategory = serviceCategory === "Todos" || s.category === serviceCategory;
    const matchesSearch = serviceSearchTerm === "" || s.name.toLowerCase().includes(serviceSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    setActiveReservationId(null);
  };

  // Load reservation into cart
  const loadReservation = (reservation: typeof todayReservations[0]) => {
    clearCart();
    
    // Set the client
    if (reservation.client_id) {
      setSelectedClient(reservation.client_id);
    } else {
      // Try to find client by phone
      const matchedClient = clients.find(c => c.phone === reservation.client_phone);
      if (matchedClient) {
        setSelectedClient(matchedClient.id);
      }
    }

    // Add the service to cart with barber pre-assigned
    const svc = reservation.service as any;
    const barber = reservation.barber as any;
    if (svc) {
      setCart([{
        id: svc.id,
        name: svc.name,
        price: Number(svc.price),
        quantity: 1,
        type: "service",
        barberId: barber?.id || undefined,
      }]);
    }

    setActiveReservationId(reservation.id);
    setActiveTab("services");
    
    toast({
      title: "📋 Reserva cargada",
      description: `${reservation.client_name} — ${svc?.name || "Servicio"}`,
    });
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
      const paymentMethod = method === "mixed" ? "mixed" : method;
      const clientId = selectedClient !== "walk-in" ? selectedClient : null;

      // Record each service as a haircut
      for (const item of servicesInCartItems) {
        for (let i = 0; i < item.quantity; i++) {
          const { error } = await supabase.from("haircuts").insert({
            barber_id: item.barberId || null,
            service_name: item.name,
            price: item.price,
            payment_method: paymentMethod,
            client_id: clientId,
            reservation_id: activeReservationId,
          });
          if (error) throw error;
        }
      }

      // Record product sales
      if (productsInCartItems.length > 0) {
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

        const saleItems = productsInCartItems.map((item) => ({
          sale_id: sale.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: itemsError } = await supabase.from("sale_items").insert(saleItems);
        if (itemsError) throw itemsError;
      }

      // Update client stats if a client is selected
      if (clientId) {
        await supabase.rpc("update_client_after_sale", {
          p_client_id: clientId,
          p_amount: total,
        });
      }

      // Mark reservation as completed if loaded from reservation
      if (activeReservationId) {
        await supabase
          .from("reservations")
          .update({ status: "completed" })
          .eq("id", activeReservationId);
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["daily-haircuts"] });
      queryClient.invalidateQueries({ queryKey: ["daily-sales"] });
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
      queryClient.invalidateQueries({ queryKey: ["pos-clients"] });
      queryClient.invalidateQueries({ queryKey: ["pos-today-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });

      const clientObj = clientId ? clients.find(c => c.id === clientId) : null;
      const clientName = clientObj?.full_name || "Cliente General";
      const clientPhone = clientObj?.phone || "";

      // Get barber names for receipt items
      const receiptItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        type: item.type,
        barberName: item.barberId ? barbers.find(b => b.id === item.barberId)?.full_name : undefined,
      }));

      const primaryBarberName = servicesInCartItems[0]?.barberId 
        ? barbers.find(b => b.id === servicesInCartItems[0].barberId)?.full_name 
        : undefined;

      // Print receipt if option selected
      if (details.printReceipt) {
        setPrintReceiptData({
          ticketNumber,
          items: receiptItems,
          subtotal,
          discount: totalDiscount,
          tip: tipAmount,
          total,
          paymentMethod: method,
          cashReceived: details.cashReceived,
          change: details.change,
          clientName,
          clientPhone,
          barberName: primaryBarberName,
        });
      }

      // Send WhatsApp receipt if option selected
      if (details.sendWhatsApp && (details.contactInfo || clientPhone)) {
        const whatsAppPhone = details.contactInfo || clientPhone;
        sendSaleReceipt({
          clientPhone: whatsAppPhone as string,
          clientName,
          ticketNumber,
          items: receiptItems,
          total,
          paymentMethod: method,
        });
      }

      // Log activity for audit trail
      logActivity({
        action: 'sale_completed',
        entityType: 'sale',
        details: {
          ticket: ticketNumber,
          total,
          items: cart.length,
          paymentMethod: method,
          clientId,
        },
      });

      clearCart();
      setShowPaymentModal(false);
      toast({
        title: "¡Venta completada!",
        description: `Ticket ${ticketNumber} — ${clientName} — S/ ${total.toFixed(2)}`,
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

  const selectedClientData = selectedClient !== "walk-in" 
    ? clients.find(c => c.id === selectedClient) 
    : null;

  const filteredClients = useMemo(() => {
    if (!clientSearchTerm) return clients.slice(0, 8);
    const term = clientSearchTerm.toLowerCase();
    return clients.filter(c => 
      c.full_name.toLowerCase().includes(term) || c.phone.includes(term)
    ).slice(0, 8);
  }, [clients, clientSearchTerm]);

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-2 p-1 overflow-hidden">
      {/* Left Panel - Catalog */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-2 mb-1 shrink-0">
          <div className="min-w-0">
            <h1 className="font-display text-base tracking-tight leading-none">Punto de Venta</h1>
            <p className="text-muted-foreground text-[10px] leading-tight">{ticketNumber}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="gap-1.5 h-7 text-[11px] px-2" onClick={() => setShowDailySales(true)}>
              <ListOrdered className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Ventas</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 h-7 text-[11px] px-2 relative" onClick={() => setShowSavedSales(true)}>
              <Clock className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Guardadas</span>
              {savedSales.length > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[9px]">
                  {savedSales.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 h-8 mb-1 shrink-0">
            <TabsTrigger value="services" className="h-6 text-[11px] gap-1">
              <Scissors className="h-3 w-3" />
              Servicios
            </TabsTrigger>
            <TabsTrigger value="products" className="h-6 text-[11px] gap-1">
              <Package2 className="h-3 w-3" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="reservations" className="h-6 text-[11px] gap-1 relative">
              <CalendarCheck className="h-3 w-3" />
              Citas
              {todayReservations.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-3.5 w-3.5 p-0 flex items-center justify-center text-[8px] bg-success">
                  {todayReservations.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* SERVICES TAB */}
          <TabsContent value="services" className="flex-1 flex flex-col min-h-0 mt-0 overflow-hidden data-[state=inactive]:hidden">
            <div className="flex gap-1.5 mb-1 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar servicio..."
                  className="pl-7 h-7 text-xs"
                  value={serviceSearchTerm}
                  onChange={(e) => setServiceSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 mb-0.5 scrollbar-hide shrink-0">
              {serviceCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={serviceCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setServiceCategory(cat)}
                  className="whitespace-nowrap h-6 text-[10px] px-2"
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
                  <Scissors className="h-12 w-12 mb-3 opacity-20" />
                  <p className="font-semibold text-xs">No se encontraron servicios</p>
                </div>
              ) : (
                <div className="grid gap-1.5 pb-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onClick={() => addService(service)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="flex-1 flex flex-col min-h-0 mt-0 overflow-hidden data-[state=inactive]:hidden">
            <div className="flex gap-1.5 mb-1 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search-input"
                  placeholder="Buscar producto o escanear código..."
                  className="pl-7 h-7 text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-7 gap-1 shrink-0 px-2">
                <ScanBarcode className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 mb-0.5 scrollbar-hide shrink-0">
              {productCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="whitespace-nowrap h-6 text-[10px] px-2"
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
                  <Package2 className="h-12 w-12 mb-3 opacity-20" />
                  <p className="font-semibold text-xs">No hay productos disponibles</p>
                </div>
              ) : (
                <div className="grid gap-1.5 pb-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setQuantityProduct(product)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* RESERVATIONS TAB */}
          <TabsContent value="reservations" className="flex-1 flex flex-col min-h-0 mt-0 overflow-hidden data-[state=inactive]:hidden">
            <div className="flex items-center justify-between mb-1 shrink-0">
              <div>
                <h3 className="font-display text-xs font-bold">Citas de Hoy</h3>
                <p className="text-[10px] text-muted-foreground">Toca una reserva para cargarla</p>
              </div>
              {todayReservations.length > 0 && (
                <Badge variant="outline" className="text-[10px]">
                  {todayReservations.length} cita{todayReservations.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              {todayReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
                  <CalendarCheck className="h-12 w-12 mb-3 opacity-20" />
                  <p className="font-semibold text-xs">No hay citas pendientes hoy</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1.5 pb-1">
                  {todayReservations.map((reservation) => {
                    const svc = reservation.service as any;
                    const barber = reservation.barber as any;
                    const isActive = activeReservationId === reservation.id;
                    return (
                      <button
                        key={reservation.id}
                        onClick={() => loadReservation(reservation)}
                        className={cn(
                          "group w-full text-left p-2.5 rounded-lg border transition-all duration-200 hover:shadow-md",
                          isActive
                            ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                            : "border-border/40 bg-card hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                              <Clock className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-xs leading-tight">{reservation.client_name}</p>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Phone className="h-2.5 w-2.5" />
                                {reservation.client_phone}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-sm font-bold text-primary leading-tight">
                              {reservation.reservation_time}
                            </p>
                            <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"} className="text-[8px] h-3.5">
                              {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-border/30">
                          <div className="flex items-center gap-1">
                            <Scissors className="h-2.5 w-2.5 text-muted-foreground" />
                            <span className="truncate max-w-[80px]">{svc?.name || "Servicio"}</span>
                            <span className="font-bold text-primary">S/ {svc?.price || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-2.5 w-2.5" />
                            <span className="truncate max-w-[60px]">{barber?.full_name || "—"}</span>
                          </div>
                        </div>
                        {isActive && (
                          <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-primary font-medium bg-primary/5 rounded py-0.5">
                            <ArrowRight className="h-2.5 w-2.5" />
                            En carrito
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Cart (fixed width, full height flex column) */}
      <div className="w-[340px] shrink-0 flex flex-col card-elevated overflow-hidden">
        {/* Cart Header - sticky top */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xs font-bold leading-none">Venta Actual</h2>
              <p className="text-[9px] text-muted-foreground">{ticketNumber}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive gap-1 h-6 text-[10px] px-1.5"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            <Trash2 className="h-3 w-3" />
            Limpiar
          </Button>
        </div>

        {/* Client Search - compact */}
        <div className="px-3 py-2 border-b border-border/40 shrink-0 relative">
          <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5 block">Cliente</label>
          {selectedClientData ? (
            <div className="flex items-center gap-2 p-1.5 rounded-lg border border-primary/30 bg-primary/5">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {selectedClientData.level === "vip" ? (
                  <Star className="h-3 w-3 text-primary fill-primary" />
                ) : (
                  <User className="h-3 w-3 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[11px] truncate leading-tight">{selectedClientData.full_name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted-foreground">{selectedClientData.phone}</span>
                  <Badge variant={
                    selectedClientData.level === "vip" ? "default" :
                    selectedClientData.level === "premium" ? "secondary" : "muted"
                  } className="text-[8px] px-1 h-3">
                    {selectedClientData.level === "vip" ? "VIP" :
                     selectedClientData.level === "premium" ? "Premium" : "Regular"}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full hover:bg-destructive/10 hover:text-destructive shrink-0"
                onClick={() => { setSelectedClient("walk-in"); setClientSearchTerm(""); }}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-7 h-7 text-[11px] rounded-md"
                value={clientSearchTerm}
                onChange={(e) => {
                  setClientSearchTerm(e.target.value);
                  setShowClientDropdown(true);
                }}
                onFocus={() => setShowClientDropdown(true)}
                onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
              />
              {showClientDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-[180px] overflow-y-auto">
                  <button
                    className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-muted/50 transition-colors flex items-center gap-2 border-b border-border/30"
                    onMouseDown={() => {
                      setSelectedClient("walk-in");
                      setClientSearchTerm("");
                      setShowClientDropdown(false);
                    }}
                  >
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-2.5 w-2.5 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">Sin cliente / General</span>
                  </button>
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-primary/5 transition-colors flex items-center gap-2"
                      onMouseDown={() => {
                        setSelectedClient(client.id);
                        setClientSearchTerm("");
                        setShowClientDropdown(false);
                      }}
                    >
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate leading-tight">{client.full_name}</p>
                        <p className="text-[9px] text-muted-foreground">{client.phone}</p>
                      </div>
                      <Badge variant="muted" className="text-[8px] px-1 h-3 shrink-0">
                        {(client as any).points || 0} pts
                      </Badge>
                    </button>
                  ))}
                  {filteredClients.length === 0 && clientSearchTerm && (
                    <div className="px-2.5 py-3 text-center text-[11px] text-muted-foreground">
                      No se encontraron clientes
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {activeReservationId && (
            <Badge variant="default" className="text-[8px] gap-1 bg-success mt-1">
              <CalendarCheck className="h-2.5 w-2.5" />
              Desde reserva
            </Badge>
          )}
        </div>

        {/* Cart items - scrollable middle section */}
        <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                <Receipt className="h-6 w-6 opacity-30" />
              </div>
              <p className="font-semibold text-xs">Carrito vacío</p>
              <p className="text-[10px] text-center mt-0.5 max-w-[180px]">Selecciona servicios, productos o carga una cita</p>
            </div>
          ) : (
            <div className="space-y-2">
              {servicesInCart.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Servicios</p>
                  <div className="space-y-1.5">
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
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Productos</p>
                  <div className="space-y-1.5">
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
        </div>

        {/* Sticky Footer - Totals & Actions */}
        <div className="shrink-0 border-t border-border/40 bg-card px-3 py-2">
          {cart.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {/* Discount row */}
              <div className="flex items-center gap-1.5">
                <div className="flex border rounded overflow-hidden shrink-0">
                  <Button variant={discountType === "percent" ? "default" : "ghost"} size="sm" className="rounded-none h-6 w-6 p-0" onClick={() => setDiscountType("percent")}>
                    <Percent className="h-2.5 w-2.5" />
                  </Button>
                  <Button variant={discountType === "fixed" ? "default" : "ghost"} size="sm" className="rounded-none h-6 w-6 p-0" onClick={() => setDiscountType("fixed")}>
                    <DollarSign className="h-2.5 w-2.5" />
                  </Button>
                </div>
                <Input type="number" placeholder="Desc." value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="flex-1 h-6 text-[11px]" />
                <div className="flex items-center gap-0.5 shrink-0">
                  <GraduationCap className="h-3 w-3 text-muted-foreground" />
                  <Switch id="student" checked={isStudent} onCheckedChange={setIsStudent} className="scale-75" />
                </div>
              </div>

              {/* Tip row */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground shrink-0">Propina:</span>
                {[5, 10, 15].map((percent) => (
                  <Button key={percent} variant={tipPercent === percent ? "default" : "outline"} size="sm" className="flex-1 h-5 px-1 text-[10px]" onClick={() => { setTipPercent(tipPercent === percent ? null : percent); setCustomTip(""); }}>
                    {percent}%
                  </Button>
                ))}
                <Input type="number" placeholder="S/" value={customTip} onChange={(e) => { setCustomTip(e.target.value); setTipPercent(null); }} className="w-12 h-5 text-[10px]" />
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-[11px] text-green-600">
                <span>Descuento</span>
                <span>-S/ {totalDiscount.toFixed(2)}</span>
              </div>
            )}
            {tipAmount > 0 && (
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Propina</span>
                <span>S/ {tipAmount.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-1" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">TOTAL</span>
              <span className="font-display text-2xl text-primary font-bold">S/ {total.toFixed(2)}</span>
            </div>
          </div>

          {hasServicesWithoutBarber && (
            <p className="text-destructive text-[10px] text-center my-1">⚠️ Asigna barbero a cada servicio</p>
          )}

          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button variant="outline" size="sm" className="h-10 gap-1.5 text-xs" onClick={saveCurrentSale} disabled={cart.length === 0}>
              <Save className="h-3.5 w-3.5" />
              Guardar
            </Button>
            <Button
              size="sm"
              className="h-10 gap-1.5 text-sm font-bold bg-secondary hover:bg-secondary/90"
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0 || hasServicesWithoutBarber || isProcessing}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "COBRAR"}
            </Button>
          </div>

          <p className="text-[9px] text-muted-foreground text-center mt-1.5">
            F1: Nuevo · F2: Cobrar · F9: Buscar · ESC: Limpiar
          </p>
        </div>
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

      {/* Thermal Receipt Printing */}
      {printReceiptData && (
        <ThermalReceipt
          {...printReceiptData}
          onClose={() => setPrintReceiptData(null)}
        />
      )}
    </div>
  );
}
