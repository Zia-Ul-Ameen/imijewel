'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ImageKitProvider } from 'imagekitio-next';

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

const authenticator = async () => {
    try {
        const response = await fetch('/api/imagekit-auth');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: 1,
            },
        },
    }));

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <ImageKitProvider
                    publicKey={publicKey}
                    urlEndpoint={urlEndpoint}
                    authenticator={authenticator}
                >
                    {children}
                </ImageKitProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
