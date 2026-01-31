import { useState, useMemo } from "react";
import { ChefHat, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminOrderCard } from "@/components/AdminOrderCard";
import { useOrders } from "@/context/OrderContext";
import { OrderStatus } from "@/types/canteen";
import { cn } from "@/lib/utils";

const statusFilters: { status: OrderStatus | "all"; label: string; icon: React.ElementType }[] = [
  { status: "all", label: "All Orders", icon: ChefHat },
  { status: "pending", label: "Pending", icon: Clock },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready", label: "Ready", icon: CheckCircle2 },
  { status: "completed", label: "Completed", icon: CheckCircle2 },
  { status: "cancelled", label: "Cancelled", icon: XCircle },
];

const Admin = () => {
  const { orders } = useOrders();
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-warm py-6">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order Dashboard</h1>
            <p className="text-muted-foreground">Manage and track all orders</p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {orders.length} Total Orders
          </Badge>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {statusFilters.map(({ status, label, icon: Icon }) => (
            <Button
              key={status}
              variant={activeFilter === status ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveFilter(status)}
              className={cn(
                "shrink-0 gap-2",
                activeFilter === status && "shadow-glow"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {statusCounts[status] > 0 && (
                <Badge
                  variant={activeFilter === status ? "secondary" : "outline"}
                  className="ml-1"
                >
                  {statusCounts[status]}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <AdminOrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Orders
            </h3>
            <p className="text-muted-foreground">
              {activeFilter === "all"
                ? "Orders will appear here when customers place them."
                : `No ${activeFilter} orders at the moment.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
