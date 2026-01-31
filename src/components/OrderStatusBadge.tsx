import { Badge } from "@/components/ui/badge";
import { OrderStatus, ORDER_STATUS_CONFIG } from "@/types/canteen";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "lg";
}

export function OrderStatusBadge({ status, size = "sm" }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  
  return (
    <Badge 
      variant={config.color as any}
      className={size === "lg" ? "px-4 py-1.5 text-sm" : ""}
    >
      {config.label}
    </Badge>
  );
}
