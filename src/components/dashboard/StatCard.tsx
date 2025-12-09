import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  iconColor?: "primary" | "secondary" | "success" | "warning" | "info";
}

const iconColorClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "primary",
}: StatCardProps) {
  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-display text-3xl tracking-tight">{value}</p>
          {change && (
            <p
              className={cn(
                "text-sm font-medium flex items-center gap-1",
                change.type === "increase" ? "text-success" : "text-destructive"
              )}
            >
              <span>{change.type === "increase" ? "↑" : "↓"}</span>
              <span>{Math.abs(change.value)}%</span>
              <span className="text-muted-foreground font-normal">vs mes anterior</span>
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-3", iconColorClasses[iconColor])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
