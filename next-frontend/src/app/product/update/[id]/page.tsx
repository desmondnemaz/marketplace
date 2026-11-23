"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Product } from "@/types/product";
import { useAppContext } from "@/context/AppContext";

function UpdateProductContent() {
    const { id } = useParams();
    const router = useRouter();
    const { refreshProducts } = useAppContext();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        description: "",
        priceUsd: "",
        priceZig: "",
        category: "Electronics",
        supplier: "",
        quantity: "",
        available: true,
        releaseDate: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await api.get<Product>(`/product/${id}`);
                const p = res.data;
                setFormData({
                    name: p.name,
                    brand: p.brand,
                    description: p.description,
                    priceUsd: String(p.priceUsd),
                    priceZig: String(p.priceZig),
                    category: p.category,
                    supplier: p.supplier,
                    quantity: String(p.quantity),
                    available: p.available,
                    releaseDate: p.releaseDate ? p.releaseDate.slice(0, 16) : "",
                });
            } catch (err) {
                console.error("Error loading product:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) loadProduct();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const productPayload = {
            id: Number(id),
            ...formData,
            priceUsd: parseFloat(formData.priceUsd),
            priceZig: parseFloat(formData.priceZig),
            quantity: parseInt(formData.quantity, 10),
        };

        const multipartData = new FormData();
        multipartData.append(
            "product",
            new Blob([JSON.stringify(productPayload)], { type: "application/json" })
        );
        if (imageFile) {
            multipartData.append("imageFile", imageFile);
        }

        try {
            await api.put(`/product/${id}`, multipartData);
            await refreshProducts();
            router.push(`/product/${id}`);
        } catch (err) {
            console.error("Failed to update product:", err);
            alert("Update failed.");
        }
    };

    if (loading) return <div className="py-12 text-center text-gray-500">Loading product...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Update Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input required name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required rows={3} name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                        <input required type="number" step="0.01" name="priceUsd" value={formData.priceUsd} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (ZiG)</label>
                        <input required type="number" step="0.01" name="priceZig" value={formData.priceZig} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input required name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                        <input required name="supplier" value={formData.supplier} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                        <input required type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Replace Product Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && setImageFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="rounded text-blue-600" />
                        Product Available for Sale
                    </label>

                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition">
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function UpdateProductPage() {
    return (
        <Suspense fallback={<div className="py-12 text-center text-gray-500">Loading product...</div>}>
            <UpdateProductContent />
        </Suspense>
    );
}