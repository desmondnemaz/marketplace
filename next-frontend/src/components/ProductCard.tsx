"use client";

import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { Product } from "@/types/product";
import { useAppContext } from "@/context/AppContext";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { currency, addToCart } = useAppContext();

    const formattedPrice =
        currency === "USD"
            ? `$${(product.priceUsd ?? 0).toFixed(2)}`
            : `ZiG ${(product.priceZig ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <Link href={`/product/${product.id}`} className="block">
                <div className="h-48 bg-gray-50 flex flex-col items-center justify-center text-gray-400 overflow-hidden p-3">
                    {product.imageName ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/product/${product.id}/image`}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="p-4 flex flex-col items-center">
                            <Package className="w-12 h-12 mb-2 stroke-1" />
                            <span className="text-xs uppercase tracking-wider font-medium text-gray-500">
                {product.category}
              </span>
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span className="font-semibold text-blue-600">{product.brand}</span>
                        <span>By {product.supplier}</span>
                    </div>

                    <h3 className="font-semibold text-gray-900 text-base line-clamp-1">
                        {product.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {product.description}
                    </p>
                </div>
            </Link>

            <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-lg font-bold text-gray-900">{formattedPrice}</p>
                    <p
                        className={`text-xs font-medium ${
                            product.available && product.quantity > 0
                                ? "text-emerald-600"
                                : "text-red-500"
                        }`}
                    >
                        {product.available && product.quantity > 0
                            ? `${product.quantity} in stock`
                            : "Out of stock"}
                    </p>
                </div>

                <button
                    disabled={!product.available || product.quantity <= 0}
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                </button>
            </div>
        </div>
    );
}