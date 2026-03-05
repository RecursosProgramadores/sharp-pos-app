import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, X, Scissors, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    type: "service" | "product";
    barberId?: string;
  };
  barbers: { id: string; full_name: string }[];
  onUpdateQuantity: (delta: number) => void;
  onRemove: () => void;
  onBarberChange: (barberId: string) => void;
}

export function CartItem({ item, barbers, onUpdateQuantity, onRemove, onBarberChange }: CartItemProps) {
  const subtotal = item.price * item.quantity;
  const needsBarber = item.type === "service" && !item.barberId;

  return (
    <div className="p-3 rounded-lg bg-muted/50 space-y-2">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-background">
          {item.type === "service" ? (
            <Scissors className="h-4 w-4 text-primary" />
          ) : (
            <Package className="h-4 w-4 text-secondary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">{item.name}</p>
            <Badge variant={item.type === "service" ? "default" : "secondary"} className="text-[10px] px-1.5">
              {item.type === "service" ? "Servicio" : "Producto"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            S/ {item.price.toFixed(2)} c/u
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(-1)}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(1)}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <span className="font-display text-lg">S/ {subtotal.toFixed(2)}</span>
      </div>

      {item.type === "service" && (
        <Select value={item.barberId || ""} onValueChange={onBarberChange}>
          <SelectTrigger className={needsBarber ? "border-destructive" : ""}>
            <SelectValue placeholder="Seleccionar barbero" />
          </SelectTrigger>
          <SelectContent>
            {barbers.map((barber) => (
              <SelectItem key={barber.id} value={barber.id}>
                {barber.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
