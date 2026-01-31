import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Order, CartItem, OrderStatus } from "@/types/canteen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  createOrder: (items: CartItem[], customerName: string, customerPhone: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Helper to convert database row to Order type
const mapDbRowToOrder = (row: {
  id: string;
  items: unknown;
  total_amount: number;
  status: string;
  customer_name: string;
  customer_phone: string;
  estimated_time: number;
  created_at: string;
  updated_at: string;
}): Order => ({
  id: row.id,
  items: row.items as CartItem[],
  totalAmount: row.total_amount,
  status: row.status as OrderStatus,
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  estimatedTime: row.estimated_time,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedOrders = (data || []).map(mapDbRowToOrder);
      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          
          if (payload.eventType === "INSERT") {
            const newOrder = mapDbRowToOrder(payload.new as any);
            setOrders((prev) => [newOrder, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            const updatedOrder = mapDbRowToOrder(payload.new as any);
            setOrders((prev) =>
              prev.map((order) =>
                order.id === updatedOrder.id ? updatedOrder : order
              )
            );
            setCurrentOrder((prev) =>
              prev?.id === updatedOrder.id ? updatedOrder : prev
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = (payload.old as any).id;
            setOrders((prev) => prev.filter((order) => order.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const createOrder = useCallback(
    async (items: CartItem[], customerName: string, customerPhone: string): Promise<Order> => {
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const estimatedTime = Math.max(...items.map((i) => i.preparationTime)) + 5;
      const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

      const { data, error } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          items: items as unknown as any,
          total_amount: totalAmount,
          status: "pending",
          customer_name: customerName,
          customer_phone: customerPhone,
          estimated_time: estimatedTime,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create order. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      const newOrder = mapDbRowToOrder(data);
      setCurrentOrder(newOrder);
      return newOrder;
    },
    [toast]
  );

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId),
    [orders]
  );

  const fetchOrderById = useCallback(async (orderId: string): Promise<Order | null> => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !data) {
      return null;
    }

    const order = mapDbRowToOrder(data);
    setCurrentOrder(order);
    return order;
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        isLoading,
        createOrder,
        updateOrderStatus,
        getOrderById,
        fetchOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
