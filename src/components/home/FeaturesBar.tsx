"use client";

import { Truck, Package, Shield } from "lucide-react";

import styles from './FeaturesBar.module.css';

export const FeaturesBar = () => {
    const features = [
        {
            icon: Truck,
            text: "Express Shipment",
        },
        {
            icon: Package,
            text: "Free Delivery",
        },
        {
            icon: Shield,
            text: "Safe & Secure Transaction",
        },
    ];

    return (
        <div className="bg-black border-t border-zinc-800 py-2 overflow-hidden">
            <div className="container mx-auto md:px-6">
                {/* Desktop: centered flex layout */}
                <div className="hidden md:flex items-center justify-center gap-16">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 text-white"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700">
                                    <Icon className="w-5 h-5 text-zinc-300" />
                                </div>
                                <span className="text-base font-medium text-zinc-300 whitespace-nowrap">
                                    {feature.text}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile: Pure CSS infinite scroll */}
                <div className="md:hidden relative overflow-hidden">
                    <div className="flex">
                        {/* Container 1 */}
                        <div className={`flex items-center flex-shrink-0 ${styles.animateInfiniteScroll}`}>
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 text-white flex-shrink-0"
                                        style={{ marginRight: '12px' }}
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700">
                                            <Icon className="w-5 h-5 text-zinc-300" />
                                        </div>
                                        <span className="text-sm font-medium text-zinc-300 whitespace-nowrap">
                                            {feature.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Container 2 (Duplicate) */}
                        <div className={`flex items-center flex-shrink-0 ${styles.animateInfiniteScroll}`}>
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 text-white flex-shrink-0"
                                        style={{ marginRight: '12px' }}
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700">
                                            <Icon className="w-5 h-5 text-zinc-300" />
                                        </div>
                                        <span className="text-sm font-medium text-zinc-300 whitespace-nowrap">
                                            {feature.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
