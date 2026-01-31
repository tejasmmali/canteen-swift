import { useState, useMemo, useEffect } from "react";
import { ChefHat, Clock, CheckCircle2, XCircle, Users, TrendingUp, RefreshCw, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminOrderCard } from "@/components/AdminOrderCard";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminAccessDenied } from "@/components/AdminAccessDenied";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { OrderStatus } from "@/types/canteen";
import { cn } from "@/lib/utils";

const statusFilters: { status: OrderStatus | "all"; label: string; icon: React.ElementType }[] = [
  { status: "all", label: "All Orders", icon: ChefHat },
  { status: "pending", label: "Pending", icon: Clock },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready", label: "Ready", icon: CheckCircle2 },
  { status: "completed", label: "Completed", icon: CheckCircle2 },
  { status: "cancelled", label: "Cancelled", icon: XCircle },
];

const Admin = () => {
  const { adminOrders, isLoading, fetchAdminOrders } = useOrders();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");

  // Fetch admin orders with decrypted data when user is admin
  useEffect(() => {
    if (isAdmin) {
      fetchAdminOrders();
    }
  }, [fetchAdminOrders, isAdmin]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <AdminLogin />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return adminOrders;
    return adminOrders.filter((order) => order.status === activeFilter);
  }, [adminOrders, activeFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: adminOrders.length };
    adminOrders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [adminOrders]);

  // Calculate stats
  const todayOrders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return adminOrders.filter((order) => new Date(order.createdAt) >= today);
  }, [adminOrders]);

  const totalRevenue = useMemo(() => {
    return adminOrders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }, [adminOrders]);

  const activeOrders = useMemo(() => {
    return adminOrders.filter(
      (order) => !["completed", "cancelled"].includes(order.status)
    ).length;
  }, [adminOrders]);

  const uniqueCustomers = useMemo(() => {
    const phones = new Set(adminOrders.map((order) => order.customerPhone));
    return phones.size;
  }, [adminOrders]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Admin Header */}
      <div className="bg-card border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Real-time order management • {adminOrders.length} total orders
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isLoading && (
                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
              )}
              <Badge variant="outline" className="text-sm px-3 py-1.5 gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                Encrypted Data
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1.5">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                Live Updates
              </Badge>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayOrders.length}</div>
              <p className="text-xs text-muted-foreground">orders placed today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{totalRevenue}</div>
              <p className="text-xs text-muted-foreground">all time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                Unique Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueCustomers}</div>
              <p className="text-xs text-muted-foreground">by phone number</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl h-64 animate-pulse"
              />
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <AdminOrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl">
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
