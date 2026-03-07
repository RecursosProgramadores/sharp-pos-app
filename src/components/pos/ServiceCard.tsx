import { cn } from "@/lib/utils";
import { Star, Clock } from "lucide-react";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    price: number;
    category: string;
    is_popular?: boolean | null;
    duration_minutes: number;
  };
  onClick: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Cortes: "border-l-primary bg-primary/5 hover:bg-primary/10",
  Degradados: "border-l-violet-500 bg-violet-500/5 hover:bg-violet-500/10",
  Ondulados: "border-l-sky-500 bg-sky-500/5 hover:bg-sky-500/10",
  Tintes: "border-l-amber-500 bg-amber-500/5 hover:bg-amber-500/10",
  "Otros Servicios": "border-l-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10",
};

const PRICE_COLORS: Record<string, string> = {
  Cortes: "text-primary",
  Degradados: "text-violet-600 dark:text-violet-400",
  Ondulados: "text-sky-600 dark:text-sky-400",
  Tintes: "text-amber-600 dark:text-amber-400",
  "Otros Servicios": "text-emerald-600 dark:text-emerald-400",
};

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const colorClass = CATEGORY_COLORS[service.category] || CATEGORY_COLORS["Cortes"];
  const priceColor = PRICE_COLORS[service.category] || "text-primary";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-lg border-l-[3px] border border-border/50",
        "transition-all duration-150 active:scale-[0.98] touch-manipulation",
        "hover:shadow-md text-left w-full",
        colorClass
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm leading-tight line-clamp-1">
            {service.name}
          </span>
          {service.is_popular && (
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">{service.duration_minutes} min</span>
        </div>
      </div>
      <span className={cn("font-display text-lg font-bold shrink-0", priceColor)}>
        S/ {service.price}
      </span>
    </button>
  );
}
