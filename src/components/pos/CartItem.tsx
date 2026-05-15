import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, X, Scissors, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    type: "service" | "product";
    barberId?: string;
  };
  barbers: { id: string; full_name: string; photo_url?: string | null }[];
  onUpdateQuantity: (delta: number) => void;
  onRemove: () => void;
  onBarberChange: (barberId: string) => void;
}

export function CartItem({ item, barbers, onUpdateQuantity, onRemove, onBarberChange }: CartItemProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const subtotal = item.price * item.quantity;
  const needsBarber = item.type === "service" && !item.barberId;
  const assignedBarber = item.barberId ? barbers.find(b => b.id === item.barberId) : null;

  useEffect(() => {
    setIsHighlighted(true);
    const timer = setTimeout(() => setIsHighlighted(false), 800);
    return () => clearTimeout(timer);
  }, [item.quantity]);

  return (
    <div className={cn(
      "relative p-2.5 rounded-xl border transition-all duration-200",
      isHighlighted && "animate-highlight ring-2 ring-primary/20",
      needsBarber
        ? "border-destructive/40 bg-destructive/5"
        : "border-border/40 bg-muted/30 hover:bg-muted/50"
    )}>
      {/* Header row */}
      <div className="flex items-start gap-2">
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
          item.type === "service" ? "bg-primary/10" : "bg-secondary/10"
        )}>
          {item.type === "service" ? (
            <Scissors className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Package className="h-3.5 w-3.5 text-secondary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-xs leading-tight truncate">{item.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            S/ {item.price.toFixed(2)} c/u
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full shrink-0"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Quantity + Subtotal */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full border-border/60"
            onClick={() => onUpdateQuantity(-1)}
          >
            <Minus className="h-2.5 w-2.5" />
          </Button>
          <span className="w-7 text-center font-bold text-xs">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full border-border/60"
            onClick={() => onUpdateQuantity(1)}
          >
            <Plus className="h-2.5 w-2.5" />
          </Button>
        </div>
        <span className="font-display text-sm font-bold text-primary">
          S/ {subtotal.toFixed(2)}
        </span>
      </div>

      {/* Barber selector for services */}
      {item.type === "service" && (
        <div className="mt-2">
          <Select value={item.barberId || ""} onValueChange={onBarberChange}>
            <SelectTrigger className={cn(
              "h-7 text-[11px] rounded-lg",
              needsBarber ? "border-destructive/50 text-destructive" : "border-border/40"
            )}>
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3" />
                <SelectValue placeholder="Asignar barbero" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {barbers.map((barber) => (
                <SelectItem key={barber.id} value={barber.id} className="text-xs">
                  <div className="flex items-center gap-2">
                    {barber.photo_url ? (
                      <img src={barber.photo_url} alt="" className="h-4 w-4 rounded-full object-cover" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-2.5 w-2.5 text-muted-foreground" />
                      </div>
                    )}
                    {barber.full_name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
