import { Check, Clock, ChefHat, Bell, Package } from "lucide-react";
import { Order, OrderStatus } from "@/types/canteen";
import { cn } from "@/lib/utils";

interface OrderTrackerProps {
  order: Order;
}

const steps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "pending", label: "Order Placed", icon: Clock },
  { status: "confirmed", label: "Confirmed", icon: Check },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready", label: "Ready", icon: Bell },
  { status: "completed", label: "Picked Up", icon: Package },
];

export function OrderTracker({ order }: OrderTrackerProps) {
  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  if (order.status === "cancelled") {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
        <p className="text-destructive font-semibold">Order Cancelled</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex flex-col items-center relative">
              {index > 0 && (
                <div
                  className={cn(
                    "absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2",
                    isCompleted || isCurrent ? "bg-primary" : "bg-muted"
                  )}
                  style={{ width: "calc(100% + 2rem)", right: "50%" }}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  isCompleted && "bg-primary border-primary",
                  isCurrent && "bg-primary border-primary animate-pulse",
                  !isCompleted && !isCurrent && "bg-background border-muted"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isCompleted || isCurrent
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                />
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {order.status === "preparing" && (
        <div className="bg-accent rounded-xl p-4 text-center">
          <p className="text-accent-foreground font-medium">
            Estimated ready in{" "}
            <span className="text-primary font-bold">{order.estimatedTime} mins</span>
          </p>
        </div>
      )}

      {order.status === "ready" && (
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center animate-pulse">
          <p className="text-success font-semibold">
            🎉 Your order is ready! Please collect from the counter.
          </p>
        </div>
      )}
    </div>
  );
}
