import { Phone, Mail, Calendar, Gift, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  lastVisit: string;
  visits: number;
  totalSpent: number;
  level: "new" | "regular" | "vip" | "premium";
  photo?: string;
  preferredBarber?: string;
  points: number;
}

interface ClientCardProps {
  client: Client;
  onViewDetails: (client: Client) => void;
  onWhatsApp: (phone: string) => void;
}

const levelConfig = {
  new: { label: "Nuevo", icon: "🥉", variant: "outline" as const },
  regular: { label: "Regular", icon: "🥈", variant: "secondary" as const },
  vip: { label: "VIP", icon: "🥇", variant: "default" as const },
  premium: { label: "Premium", icon: "💎", variant: "default" as const },
};

export function ClientCard({ client, onViewDetails, onWhatsApp }: ClientCardProps) {
  const level = levelConfig[client.level];
  const initials = client.name.split(" ").map((n) => n[0]).join("");
  
  const isUpcomingBirthday = () => {
    const today = new Date();
    const birthDate = new Date(client.birthDate);
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    const diffDays = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div 
      className="card-elevated p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => onViewDetails(client)}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            {client.photo ? (
              <AvatarImage src={client.photo} alt={client.name} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          {isUpcomingBirthday() && (
            <div className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground rounded-full p-1">
              <Gift className="h-3 w-3" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{client.name}</h3>
            <Badge variant={level.variant} className="text-xs shrink-0">
              {level.icon} {level.label}
            </Badge>
          </div>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span className="truncate">{client.phone}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-success hover:text-success"
                onClick={(e) => {
                  e.stopPropagation();
                  onWhatsApp(client.phone);
                }}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span className="truncate">{client.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="font-display text-xl text-primary">{client.visits}</p>
          <p className="text-xs text-muted-foreground">Visitas</p>
        </div>
        <div className="text-center">
          <p className="font-display text-xl text-secondary">${client.totalSpent}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {new Date(client.lastVisit).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Última</p>
        </div>
      </div>
    </div>
  );
}
