import { cn } from "@/lib/utils";
import { Scissors, Sparkles, PaintBucket, Baby, Droplets, Brush } from "lucide-react";

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    price: number;
    icon: string;
    color: string;
  };
  onClick: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  scissors: Scissors,
  sparkles: Sparkles,
  paint: PaintBucket,
  baby: Baby,
  droplets: Droplets,
  brush: Brush,
};

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] || Scissors;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 md:p-6 rounded-xl",
        "transition-all duration-200 active:scale-95 touch-manipulation",
        "hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-primary/30",
        "min-h-[100px] md:min-h-[120px]",
        service.color
      )}
    >
      <IconComponent className="h-8 w-8 md:h-10 md:w-10 mb-2 text-white/90" />
      <span className="font-medium text-white text-sm md:text-base text-center leading-tight">
        {service.name}
      </span>
      <span className="font-display text-2xl md:text-3xl text-white mt-1">
        ${service.price}
      </span>
    </button>
  );
}
