"use client";

import Link from "next/link";
import { ShoppingCart, PlusCircle, LogIn, LogOut, User, Search } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function Navbar() {
    const {
        currency,
        setCurrency,
        searchQuery,
        setSearchQuery,
        cart,
        user,
        isSellerOrAdmin,
        logoutUser,
    } = useAppContext();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Brand */}
                <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight shrink-0">
                    CodeGraspers<span className="text-gray-900">Market</span>
                </Link>

                {/* Search Input */}
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                        type="text"
                        placeholder="Search products, brands, categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Currency Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 text-xs font-semibold">
                        <button
                            type="button"
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
                            type="button"
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

                    {/* Seller / Admin Only: Add Product */}
                    {isSellerOrAdmin && (
                        <Link
                            href="/add-product"
                            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Add Product</span>
                        </Link>
                    )}

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative p-2 text-gray-700 hover:text-blue-600 transition"
                        aria-label="Shopping Cart"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
                        )}
                    </Link>

                    {/* Auth Controls & Role Badge */}
                    {user ? (
                        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                            <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                    {user.fullName}
                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  {user.role}
                </span>
                            </div>
                            <button
                                type="button"
                                onClick={logoutUser}
                                title="Sign Out"
                                className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 transition"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-200 transition"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}