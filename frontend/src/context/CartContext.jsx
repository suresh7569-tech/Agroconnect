import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'agroconnect_cart';

function read() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(read);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(crop, qty = 1) {
    setItems((prev) => {
      const same = prev.find(i => i.crop._id === crop._id);
      if (same) return prev.map(i => i.crop._id === crop._id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { crop, qty }];
    });
  }

  function updateQty(cropId, qty) {
    setItems((prev) => prev.map(i => i.crop._id === cropId ? { ...i, qty: Math.max(1, qty) } : i));
  }

  function removeItem(cropId) {
    setItems((prev) => prev.filter(i => i.crop._id !== cropId));
  }

  function clear() {
    setItems([]);
  }

  // Cart is scoped per-farm — orders can only contain crops from one farm.
  const farmId = items[0]?.crop.farmId?._id || items[0]?.crop.farmId || null;
  const subtotal = items.reduce((s, i) => s + i.crop.pricePerUnit * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const value = { items, farmId, subtotal, count, addItem, updateQty, removeItem, clear };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
