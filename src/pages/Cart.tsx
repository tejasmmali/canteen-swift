import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartItem } from "@/components/CartItem";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const order = await createOrder(items, customerName.trim(), customerPhone.trim());
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/track?orderId=${order.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some delicious items from our menu!
          </p>
          <Button asChild>
            <Link to="/">Browse Menu</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] gradient-warm py-6">
      <div className="container max-w-2xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Your Cart</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl p-6 shadow-card space-y-4 animate-slide-up">
          <h2 className="font-semibold text-lg text-foreground">Order Details</h2>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">₹{totalAmount}</span>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : `Place Order • ₹${totalAmount}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
