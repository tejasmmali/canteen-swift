import { Clock, User, Phone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/types/canteen";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useOrders } from "@/context/OrderContext";

interface AdminOrderCardProps {
  order: Order;
}

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "completed",
};

export function AdminOrderCard({ order }: AdminOrderCardProps) {
  const { updateOrderStatus } = useOrders();

  const handleNextStatus = () => {
    const next = nextStatus[order.status];
    if (next) {
      updateOrderStatus(order.id, next);
    }
  };

  const handleCancel = () => {
    updateOrderStatus(order.id, "cancelled");
  };

  const isFinished = order.status === "completed" || order.status === "cancelled";

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg text-foreground">{order.id}</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {order.customerName}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {order.customerPhone}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {new Date(order.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="text-muted-foreground">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
          <span>Total</span>
          <span className="text-primary">₹{order.totalAmount}</span>
        </div>
      </div>

      {!isFinished && (
        <div className="p-4 pt-0 flex gap-2">
          {order.status !== "ready" && (
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            className="flex-1"
            onClick={handleNextStatus}
          >
            {nextStatus[order.status] === "completed" ? "Mark Picked Up" : "Next Step"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
