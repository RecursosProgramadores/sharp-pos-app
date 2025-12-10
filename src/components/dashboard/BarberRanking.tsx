import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const barbers = [
  {
    position: 1,
    name: "Miguel Ángel Rodríguez",
    avatar: "MA",
    cuts: 156,
    revenue: 4680,
    rating: 4.9,
  },
  {
    position: 2,
    name: "Juan Carlos Pérez",
    avatar: "JC",
    cuts: 142,
    revenue: 4260,
    rating: 4.8,
  },
  {
    position: 3,
    name: "Pedro Sánchez López",
    avatar: "PS",
    cuts: 128,
    revenue: 3840,
    rating: 4.7,
  },
  {
    position: 4,
    name: "Roberto Díaz García",
    avatar: "RD",
    cuts: 115,
    revenue: 3450,
    rating: 4.6,
  },
  {
    position: 5,
    name: "Luis Gómez Martínez",
    avatar: "LG",
    cuts: 98,
    revenue: 2940,
    rating: 4.5,
  },
];

const getMedalIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="font-display text-lg text-muted-foreground">{position}</span>;
  }
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalf
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-muted-foreground/30"
          )}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating}</span>
    </div>
  );
};

export function BarberRanking() {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-xl">Barberos Más Productivos del Mes</h3>
        <p className="text-sm text-muted-foreground">Ranking basado en servicios e ingresos</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">#</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Barbero</th>
              <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Cortes</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Ingresos</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Rating</th>
            </tr>
          </thead>
          <tbody>
            {barbers.map((barber) => (
              <tr
                key={barber.position}
                className={cn(
                  "border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors",
                  barber.position <= 3 && "bg-muted/20"
                )}
              >
                <td className="py-3 px-2 w-12">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getMedalIcon(barber.position)}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                        {barber.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium truncate max-w-[150px]">{barber.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="font-display text-lg">{barber.cuts}</span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="font-display text-lg text-success">${barber.revenue.toLocaleString()}</span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex justify-end">
                    {renderStars(barber.rating)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
