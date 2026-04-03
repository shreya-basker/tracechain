import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "border-glass-border",
  success: "border-primary/30",
  warning: "border-neon-amber/30",
  danger: "border-neon-red/30",
};

const iconVariant = {
  default: "bg-secondary text-foreground",
  success: "bg-primary/15 text-primary",
  warning: "bg-neon-amber/15 text-neon-amber",
  danger: "bg-neon-red/15 text-neon-red",
};

export default function MetricCard({ title, value, subtitle, icon, variant = "default" }: MetricCardProps) {
  return (
    <div className={`glass-panel p-5 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-display tracking-widest uppercase text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-display font-bold mt-1 text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconVariant[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
