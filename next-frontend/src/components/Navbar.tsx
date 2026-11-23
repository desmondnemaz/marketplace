"use client";

import Link from "next/link";
import { ShoppingCart, PlusCircle, Search, Store } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function Navbar() {
    const { cart, currency, setCurrency, searchQuery, setSearchQuery } =
        useAppContext();

    const totalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Brand Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold text-blue-600 shrink-0"
                >
                    <Store className="w-6 h-6" />
                    <span>CodeGraspers</span>
                </Link>

                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search products, brands, suppliers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {/* Navigation Links, Currency Switcher & Cart */}
                <div className="flex items-center gap-4 shrink-0">
                    {/* USD / ZiG Toggle */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-semibold">
                        <button
                            onClick={() => setCurrency("USD")}
                            className={`px-2.5 py-1 rounded-md transition ${
                                currency === "USD"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            USD
                        </button>
                        <button
                            onClick={() => setCurrency("ZiG")}
                            className={`px-2.5 py-1 rounded-md transition ${
                                currency === "ZiG"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            ZiG
                        </button>
                    </div>

                    <Link
                        href="/add-product"
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Product</span>
                    </Link>

                    <Link
                        href="/cart"
                        className="relative flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}