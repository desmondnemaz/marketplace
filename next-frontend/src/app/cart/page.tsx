"use client";

import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function CartPage() {
    const { cart, removeFromCart, currency } = useAppContext();

    const totalAmount = cart.reduce((sum, item) => {
        const unitPrice = currency === "USD" ? item.priceUsd : item.priceZig;
        return sum + unitPrice * item.cartQuantity;
    }, 0);

    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                <Link href="/" className="text-sm text-blue-600 hover:underline font-medium">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

            <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 shadow-sm mb-6">
                {cart.map((item) => {
                    const lineTotal = (currency === "USD" ? item.priceUsd : item.priceZig) * item.cartQuantity;
                    return (
                        <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                <p className="text-xs text-gray-500">
                                    {item.brand} • Qty: {item.cartQuantity}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900">
                  {currency === "USD"
                      ? `$${lineTotal.toFixed(2)}`
                      : `ZiG ${lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </span>
                                <button
                                    onClick={() => item.id && removeFromCart(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition"
                                    title="Remove item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-sm text-gray-500">Total ({currency})</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {currency === "USD"
                            ? `$${totalAmount.toFixed(2)}`
                            : `ZiG ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    </p>
                </div>

                <button
                    onClick={() => alert("Checkout endpoint coming next!")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}