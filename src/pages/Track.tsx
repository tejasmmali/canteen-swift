import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderTracker } from "@/components/OrderTracker";
import { useOrders } from "@/context/OrderContext";
import { Order } from "@/types/canteen";

const Track = () => {
  const [searchParams] = useSearchParams();
  const { getOrderById, orders } = useOrders();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderId(id);
      const found = getOrderById(id);
      setOrder(found);
      setSearched(true);
    }
  }, [searchParams, getOrderById, orders]);

  const handleSearch = () => {
    const found = getOrderById(orderId.toUpperCase());
    setOrder(found);
    setSearched(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-warm py-6">
      <div className="container max-w-2xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Track Your Order</h1>

        {/* Search */}
        <div className="bg-card rounded-2xl p-6 shadow-card mb-6 animate-fade-in">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Enter Order ID
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., ORD-XXXXX"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Track
            </Button>
          </div>
        </div>

        {/* Order Status */}
        {order ? (
          <div className="animate-slide-up space-y-6">
            <OrderTracker order={order} />

            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-muted-foreground">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg border-t border-border pt-3 mt-3">
                  <span>Total</span>
                  <span className="text-primary">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        ) : searched ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Order Not Found
            </h3>
            <p className="text-muted-foreground">
              Please check the order ID and try again.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Track;
