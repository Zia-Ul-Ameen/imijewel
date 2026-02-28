'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  modelNumber: string;
  price: number;
  offerPrice?: number;
  image: string;
}

interface WishlistStore {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],

      addToWishlist: (item) => {
        if (!get().isInWishlist(item.id)) {
          set({ wishlist: [...get().wishlist, item] });
        }
      },

      removeFromWishlist: (id) => {
        set({ wishlist: get().wishlist.filter((i) => i.id !== id) });
      },

      isInWishlist: (id) => get().wishlist.some((i) => i.id === id),

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'imijewel-wishlist',
    }
  )
);
