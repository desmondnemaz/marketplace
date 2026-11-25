"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types/product";

export type Currency = "USD" | "ZiG";

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface AuthUser {
    token: string;
    email: string;
    fullName: string;
    role: "BUYER" | "SELLER" | "ADMIN";
}

interface AppContextType {
    products: Product[];
    loading: boolean;
    refreshProducts: () => Promise<void>;
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    user: AuthUser | null;
    isSellerOrAdmin: boolean;
    loginUser: (authData: AuthUser) => void;
    logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currency, setCurrency] = useState<Currency>("USD");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [user, setUser] = useState<AuthUser | null>(null);

    const refreshProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get<Product[]>("/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshProducts();

        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (savedToken && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
    }, []);

    const loginUser = (authData: AuthUser) => {
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData));
        setUser(authData);
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const isSellerOrAdmin = user?.role === "SELLER" || user?.role === "ADMIN";

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const clearCart = () => setCart([]);

    return (
        <AppContext.Provider
            value={{
                products,
                loading,
                refreshProducts,
                currency,
                setCurrency,
                searchQuery,
                setSearchQuery,
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                user,
                isSellerOrAdmin,
                loginUser,
                logoutUser,
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