import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  UserPlus,
  PlusCircle,
  User,
  Phone,
  Loader2,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const pages = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Reservas", icon: Calendar, path: "/admin/reservas" },
  { name: "Barberos", icon: Scissors, path: "/admin/barberos" },
  { name: "Inventario", icon: Package, path: "/admin/inventario" },
  { name: "Punto de Venta", icon: ShoppingCart, path: "/admin/pos" },
  { name: "Clientes", icon: Users, path: "/admin/clientes" },
  { name: "Reportes", icon: BarChart3, path: "/admin/reportes" },
  { name: "Configuración", icon: Settings, path: "/admin/configuracion" },
];

const actions = [
  { name: "Nueva Venta", icon: ShoppingCart, path: "/admin/pos" },
  { name: "Nuevo Cliente", icon: UserPlus, path: "/admin/clientes" },
  { name: "Nueva Reserva", icon: PlusCircle, path: "/admin/reservas" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Fetch clients for search
  const { data: clients = [] } = useQuery({
    queryKey: ["cmd-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, full_name, phone, level")
        .order("full_name")
        .limit(500);
      if (error) throw error;
      return data;
    },
    enabled: open,
    staleTime: 30000,
  });

  // Fetch products for search
  const { data: products = [] } = useQuery({
    queryKey: ["cmd-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, sale_price, stock")
        .eq("active", true)
        .order("name")
        .limit(500);
      if (error) throw error;
      return data;
    },
    enabled: open,
    staleTime: 30000,
  });

  // Filter results based on search
  const filteredClients = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return clients
      .filter(c => c.full_name.toLowerCase().includes(q) || c.phone.includes(q))
      .slice(0, 8);
  }, [search, clients]);

  const filteredProducts = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 8);
  }, [search, products]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Reset search when closing
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const runCommand = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Buscar clientes, productos, páginas..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>

        {/* Live client results */}
        {filteredClients.length > 0 && (
          <>
            <CommandGroup heading="Clientes">
              {filteredClients.map((client) => (
                <CommandItem
                  key={`client-${client.id}`}
                  onSelect={() => runCommand("/admin/clientes")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span>{client.full_name}</span>
                    <span className="text-xs text-muted-foreground">{client.phone} · {client.level}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Live product results */}
        {filteredProducts.length > 0 && (
          <>
            <CommandGroup heading="Productos">
              {filteredProducts.map((product) => (
                <CommandItem
                  key={`product-${product.id}`}
                  onSelect={() => runCommand("/admin/inventario")}
                  className="cursor-pointer"
                >
                  <Package className="mr-2 h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span>{product.name}</span>
                    <span className="text-xs text-muted-foreground">
                      S/ {product.sale_price} · Stock: {product.stock} · {product.category}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Páginas">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              onSelect={() => runCommand(page.path)}
              className="cursor-pointer"
            >
              <page.icon className="mr-2 h-4 w-4" />
              {page.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Acciones rápidas">
          {actions.map((action) => (
            <CommandItem
              key={action.name}
              onSelect={() => runCommand(action.path)}
              className="cursor-pointer"
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
