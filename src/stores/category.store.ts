'use client';

import { create } from 'zustand';

interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
}

interface Brand {
    id: string;
    name: string;
    slug: string;
}

interface CategoryStore {
    categories: Category[];
    brands: Brand[];
    loading: boolean;
    hasFetched: boolean;
    fetchCategories: () => Promise<void>;
    fetchBrands: () => Promise<void>;
    fetchAll: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
    categories: [],
    brands: [],
    loading: false,
    hasFetched: false,

    fetchCategories: async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (Array.isArray(data)) {
                set({ categories: data });
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },

    fetchBrands: async () => {
        try {
            const res = await fetch('/api/brands');
            const data = await res.json();
            if (Array.isArray(data)) {
                set({ brands: data });
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    },

    fetchAll: async () => {
        if (get().hasFetched) return;

        set({ loading: true });
        try {
            const [cats, brds] = await Promise.all([
                fetch('/api/categories').then(r => r.json()),
                fetch('/api/brands').then(r => r.json()),
            ]);

            set({
                categories: Array.isArray(cats) ? cats : [],
                brands: Array.isArray(brds) ? brds : [],
                hasFetched: true
            });
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            set({ loading: false });
        }
    },
}));
