import { cn } from "@/lib/utils";
import { Star, Clock, Scissors } from "lucide-react";

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

const CATEGORY_STYLES: Record<string, { border: string; bg: string; icon: string; price: string }> = {
  Cortes: {
    border: "border-l-primary",
    bg: "bg-primary/5 hover:bg-primary/10",
    icon: "text-primary",
    price: "text-primary",
  },
  Degradados: {
    border: "border-l-violet-500",
    bg: "bg-violet-500/5 hover:bg-violet-500/10",
    icon: "text-violet-500",
    price: "text-violet-600 dark:text-violet-400",
  },
  Ondulados: {
    border: "border-l-sky-500",
    bg: "bg-sky-500/5 hover:bg-sky-500/10",
    icon: "text-sky-500",
    price: "text-sky-600 dark:text-sky-400",
  },
  Tintes: {
    border: "border-l-amber-500",
    bg: "bg-amber-500/5 hover:bg-amber-500/10",
    icon: "text-amber-500",
    price: "text-amber-600 dark:text-amber-400",
  },
  "Otros Servicios": {
    border: "border-l-emerald-500",
    bg: "bg-emerald-500/5 hover:bg-emerald-500/10",
    icon: "text-emerald-500",
    price: "text-emerald-600 dark:text-emerald-400",
  },
};

const DEFAULT_STYLE = CATEGORY_STYLES["Cortes"];

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const style = CATEGORY_STYLES[service.category] || DEFAULT_STYLE;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between p-3 rounded-xl border-l-[3px] border border-border/40",
        "transition-all duration-200 active:scale-[0.97] touch-manipulation",
        "hover:shadow-lg hover:-translate-y-0.5 text-left w-full h-full min-h-[90px]",
        style.border,
        style.bg
      )}
    >
      {service.is_popular && (
        <div className="absolute top-1.5 right-1.5">
          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
        </div>
      )}

      <div className="flex items-start gap-2.5 w-full mb-auto">
        <div className={cn("h-8 w-8 rounded-lg bg-background/80 flex items-center justify-center shrink-0 shadow-sm", style.icon)}>
          <Scissors className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-xs leading-tight line-clamp-2 block">
            {service.name}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="text-[10px] font-medium">{service.duration_minutes} min</span>
        </div>
        <span className={cn("font-display text-base font-bold", style.price)}>
          S/ {service.price}
        </span>
      </div>
    </button>
  );
}
