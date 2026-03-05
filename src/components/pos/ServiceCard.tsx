import { cn } from "@/lib/utils";
import { Scissors, Star } from "lucide-react";

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
  Cortes: "from-primary/80 to-primary",
  Degradados: "from-violet-600/80 to-violet-700",
  Ondulados: "from-sky-600/80 to-sky-700",
  Tintes: "from-amber-600/80 to-amber-700",
  "Otros Servicios": "from-emerald-600/80 to-emerald-700",
};

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const gradient = CATEGORY_COLORS[service.category] || "from-primary/80 to-primary";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 md:p-5 rounded-xl",
        "bg-gradient-to-br",
        gradient,
        "transition-all duration-200 active:scale-95 touch-manipulation",
        "hover:shadow-lg hover:scale-[1.03] border-2 border-transparent hover:border-white/20",
        "min-h-[100px] md:min-h-[120px]"
      )}
    >
      {service.is_popular && (
        <Star className="absolute top-2 right-2 h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
      )}
      <Scissors className="h-7 w-7 md:h-8 md:w-8 mb-1.5 text-white/80" />
      <span className="font-medium text-white text-xs md:text-sm text-center leading-tight line-clamp-2">
        {service.name}
      </span>
      <span className="font-display text-xl md:text-2xl text-white mt-1">
        S/ {service.price}
      </span>
      <span className="text-[10px] text-white/60 mt-0.5">
        {service.duration_minutes} min
      </span>
    </button>
  );
}
