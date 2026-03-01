'use client';

import { useEffect, useRef } from 'react';
import { useCategoryStore } from '@/stores/category.store';

interface Props {
    categories: any[];
    brands: any[];
}

export default function StoreHydration({ categories, brands }: Props) {
    const setInitialData = useCategoryStore((state) => state.setInitialData);
    const initialized = useRef(false);

    if (!initialized.current) {
        setInitialData(categories, brands);
        initialized.current = true;
    }

    return null;
}
