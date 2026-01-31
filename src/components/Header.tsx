import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, UtensilsCrossed, ClipboardList, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { totalItems } = useCart();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-soft group-hover:shadow-glow transition-shadow">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Campus<span className="text-primary">Bites</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {!isAdmin ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/track" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">Track Order</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/admin" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
              <Button variant="icon" size="icon" asChild className="relative">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-bounce-in">
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>
            </>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/">
                <UtensilsCrossed className="h-4 w-4 mr-2" />
                Back to Menu
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
