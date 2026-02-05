import { Star, Eye, Edit, Power, Calendar, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface BarberService {
  name: string;
  price: number;
  duration: number;
}

export interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  dni: string;
  status: "active" | "inactive" | "vacation";
  specialty: string;
  hireDate: string;
  photoUrl?: string | null;
  services: BarberService[];
  rating: number;
  reviewCount: number;
  totalCuts: number;
  revenue: number;
  // Payment fields
  commissionPercentage?: number;
  lunchIncluded?: boolean;
  lunchAmount?: number;
  incentivesEnabled?: boolean;
  incentivePerCut?: number;
  incentiveThreshold?: number;
}

interface BarberCardProps {
  barber: Barber;
  onViewDetails: (barber: Barber) => void;
  onEdit: (barber: Barber) => void;
  onToggleStatus: (barber: Barber) => void;
}

const statusConfig = {
  active: { label: "Activo", variant: "success" as const, color: "bg-success" },
  inactive: { label: "Inactivo", variant: "muted" as const, color: "bg-muted-foreground" },
  vacation: { label: "Vacaciones", variant: "warning" as const, color: "bg-warning" },
};

export function BarberCard({ barber, onViewDetails, onEdit, onToggleStatus }: BarberCardProps) {
  const status = statusConfig[barber.status];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="card-elevated p-6 animate-fade-in hover:shadow-lg transition-all duration-300">
      {/* Header with Avatar and Status */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-3">
          <Avatar className="h-20 w-20 border-4 border-primary/20">
            {barber.photoUrl && (
              <AvatarImage src={barber.photoUrl} alt={barber.name} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground font-display text-2xl">
              {barber.name.split(" ")[0][0]}
              {barber.name.split(" ")[1]?.[0]}
            </AvatarFallback>
          </Avatar>
          {/* Status Badge */}
          <span
            className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-card",
              status.color
            )}
          />
        </div>
        <h3 className="font-semibold text-lg">{barber.name}</h3>
        <Badge variant={status.variant} className="mt-1">
          {status.label}
        </Badge>
        <Badge variant="outline" className="mt-2 text-xs">
          {barber.specialty}
        </Badge>
      </div>

      {/* Info Section */}
      <div className="space-y-2 text-sm border-t border-border pt-4">
        {barber.dni && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <IdCard className="h-4 w-4 shrink-0" />
            <span>DNI: {barber.dni}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>Desde {new Date(barber.hireDate).toLocaleDateString("es-MX", { month: "short", year: "numeric" })}</span>
        </div>
        {barber.commissionPercentage !== undefined && (
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Comisión:</span>
            <Badge variant="secondary" className="text-xs">
              {barber.commissionPercentage}%
            </Badge>
          </div>
        )}
      </div>

      {/* Services List */}
      {barber.services.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Servicios:</p>
          <div className="flex flex-wrap gap-1">
            {barber.services.slice(0, 3).map((service) => (
              <Badge key={service.name} variant="secondary" className="text-xs">
                {service.name} - ${service.price}
              </Badge>
            ))}
            {barber.services.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{barber.services.length - 3} más
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
        {renderStars(barber.rating)}
        <span className="font-medium">{barber.rating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({barber.reviewCount} reseñas)</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1"
          onClick={() => onViewDetails(barber)}
        >
          <Eye className="h-3.5 w-3.5" />
          Detalles
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1"
          onClick={() => onEdit(barber)}
        >
          <Edit className="h-3.5 w-3.5" />
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1",
            barber.status === "active" ? "text-destructive hover:text-destructive" : "text-success hover:text-success"
          )}
          onClick={() => onToggleStatus(barber)}
        >
          <Power className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}