'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  modelNumber: string;
  price: number;
  offerPrice?: number;
  image: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (item) => {
        const existing = get().cart.find((i) => i.id === item.id);
        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ cart: [...get().cart, { ...item, quantity: 1 }] });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        set({
          cart: get().cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ cart: [] }),

      totalItems: () => get().cart.reduce((acc, i) => acc + i.quantity, 0),

      totalPrice: () =>
        get().cart.reduce((acc, i) => acc + (i.offerPrice ?? i.price) * i.quantity, 0),
    }),
    {
      name: 'imijewel-cart',
    }
  )
);
