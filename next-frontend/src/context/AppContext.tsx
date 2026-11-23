"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { Product } from "@/types/product";

type Currency = "USD" | "ZiG";

export interface CartItem extends Product {
    cartQuantity: number;
}

interface AppContextType {
    products: Product[];
    loading: boolean;
    refreshProducts: () => Promise<void>;
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currency, setCurrency] = useState<Currency>("USD");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const refreshProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<Product[]>("/products");
            setProducts(response.data);
        } catch (error) {
            console.warn("Could not load products from backend:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadInitialProducts = async () => {
            await refreshProducts();
        };
        loadInitialProducts();
    }, [refreshProducts]);

    const addToCart = (product: Product) => {
        if (product.id === undefined) return;
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, cartQuantity: item.cartQuantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, cartQuantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    return (
        <AppContext.Provider
            value={{
                products,
                loading,
                refreshProducts,
                cart,
                addToCart,
                removeFromCart,
                currency,
                setCurrency,
                searchQuery,
                setSearchQuery,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}