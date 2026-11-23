"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Trash2, Edit, Package } from "lucide-react";
import api from "@/lib/axios";
import { Product } from "@/types/product";
import { useAppContext } from "@/context/AppContext";

function ProductDetailsContent() {
    const { id } = useParams();
    const router = useRouter();
    const { currency, addToCart, refreshProducts } = useAppContext();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get<Product>(`/product/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Failed to fetch product details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/product/${id}`);
            await refreshProducts();
            router.push("/");
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Could not delete product.");
        }
    };

    if (loading) return <div className="py-12 text-center text-gray-500">Loading product...</div>;
    if (!product) return <div className="py-12 text-center text-red-500">Product not found.</div>;

    const formattedPrice =
        currency === "USD"
            ? `$${product.priceUsd.toFixed(2)}`
            : `ZiG ${product.priceZig.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Marketplace
            </Link>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 rounded-xl flex flex-col items-center justify-center overflow-hidden min-h-[280px] text-gray-400">
                    {product.imageName ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/product/${product.id}/image`}
                            alt={product.name}
                            className="w-full h-full max-h-[360px] object-cover"
                        />
                    ) : (
                        <div className="p-8 flex flex-col items-center">
                            <Package className="w-20 h-20 mb-3 stroke-1" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {product.category}
              </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                            <span>{product.brand}</span>
                            <span className="text-gray-500 font-normal normal-case">Supplier: {product.supplier}</span>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

                        <div className="border-t border-b border-gray-100 py-4 mb-6">
                            <p className="text-3xl font-bold text-gray-900">{formattedPrice}</p>
                            <p className={`text-sm mt-1 font-medium ${product.available && product.quantity > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                {product.available && product.quantity > 0
                                    ? `In Stock (${product.quantity} units available)`
                                    : "Currently Out of Stock"}
                            </p>
                            {product.releaseDate && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Listed: {new Date(product.releaseDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            disabled={!product.available || product.quantity <= 0}
                            onClick={() => addToCart(product)}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition"
                        >
                            <ShoppingCart className="w-5 h-5" /> Add to Cart
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href={`/product/update/${product.id}`}
                                className="flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition"
                            >
                                <Edit className="w-4 h-4" /> Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="flex items-center justify-center gap-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 rounded-xl text-sm transition"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductDetailsPage() {
    return (
        <Suspense fallback={<div className="py-12 text-center text-gray-500">Loading product...</div>}>
            <ProductDetailsContent />
        </Suspense>
    );
}