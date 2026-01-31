import React, { createContext, useContext, useState, useCallback } from "react";
import { Order, CartItem, OrderStatus } from "@/types/canteen";

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (items: CartItem[], customerName: string, customerPhone: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = useCallback(
    (items: CartItem[], customerName: string, customerPhone: string): Order => {
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const estimatedTime = Math.max(...items.map((i) => i.preparationTime)) + 5;

      const newOrder: Order = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        items,
        totalAmount,
        status: "pending",
        customerName,
        customerPhone,
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedTime,
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCurrentOrder(newOrder);
      return newOrder;
    },
    []
  );

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() }
          : order
      )
    );
    setCurrentOrder((prev) =>
      prev?.id === orderId ? { ...prev, status, updatedAt: new Date() } : prev
    );
  }, []);

  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId),
    [orders]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        createOrder,
        updateOrderStatus,
        getOrderById,
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
