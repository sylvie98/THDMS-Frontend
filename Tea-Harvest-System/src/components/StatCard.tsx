import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
}

export function StatCard({ title, value, icon: Icon, subtitle }: StatCardProps) {
  return (
    <div className="stat-card flex items-start gap-4 animate-fade-in">
      <div className="rounded-lg bg-primary/10 p-2.5">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold font-display text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
