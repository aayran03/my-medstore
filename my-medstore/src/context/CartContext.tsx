import React, { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  productId: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("med_cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("med_cart_v1", JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (productId: string, qty = 1) => {
    setItems(prev => {
      const found = prev.find(p => p.productId === productId);
      if (found) {
        return prev.map(p => p.productId === productId ? { ...p, qty: p.qty + qty } : p);
      }
      return [...prev, { productId, qty }];
    });
  };

const remove = (productId: string) => {
  setItems((prev) => {
    const found = prev.find((p) => p.productId === productId);
    if (!found) return prev;

    if (found.qty > 1) {
      return prev.map((p) =>
        p.productId === productId ? { ...p, qty: p.qty - 1 } : p
      );
    } else {
      return prev.filter((p) => p.productId !== productId);
    }
  });
};


  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}
