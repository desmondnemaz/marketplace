"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { useAppContext } from "@/context/AppContext";

export default function AddProductPage() {
    const router = useRouter();
    const { refreshProducts, user } = useAppContext();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
            router.push("/login");
            return;
        }

        try {
            const parsed = JSON.parse(savedUser);
            if (parsed.role !== "SELLER" && parsed.role !== "ADMIN") {
                router.push("/");
            }
        } catch {
            router.push("/login");
        }
    }, [user, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!imageFile) {
            setError("Please select a product image.");
            return;
        }

        setSubmitting(true);
        try {
            const multipartData = new FormData();
            const productPayload = {
                ...formData,
                priceUsd: parseFloat(formData.priceUsd),
                priceZig: parseFloat(formData.priceZig),
                quantity: parseInt(formData.quantity, 10),
                releaseDate: formData.releaseDate
                    ? `${formData.releaseDate}T00:00:00`
                    : null,
            };

            multipartData.append(
                "product",
                new Blob([JSON.stringify(productPayload)], { type: "application/json" })
            );
            multipartData.append("imageFile", imageFile);

            await api.post("/product", multipartData);
            await refreshProducts();
            router.push("/");
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message || "Failed to add product. Ensure you are signed in as a Seller.";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        List an item with dual USD &amp; ZiG pricing
                    </p>
                </div>
                <Link
                    href="/"
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. HP Omen 16"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brand
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. HP"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        required
                        rows={3}
                        placeholder="Key specifications, condition, and details..."
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (USD)
                        </label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.priceUsd}
                            onChange={(e) =>
                                setFormData({ ...formData, priceUsd: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (ZiG)
                        </label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.priceZig}
                            onChange={(e) =>
                                setFormData({ ...formData, priceZig: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Automotive">Automotive</option>
                            <option value="Home & Kitchen">Home &amp; Kitchen</option>
                            <option value="Groceries">Groceries</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Supplier
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="Supplier name"
                            value={formData.supplier}
                            onChange={(e) =>
                                setFormData({ ...formData, supplier: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity
                        </label>
                        <input
                            required
                            type="number"
                            min="1"
                            placeholder="10"
                            value={formData.quantity}
                            onChange={(e) =>
                                setFormData({ ...formData, quantity: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Release Date
                        </label>
                        <input
                            required
                            type="date"
                            value={formData.releaseDate}
                            onChange={(e) =>
                                setFormData({ ...formData, releaseDate: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 pt-5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.available}
                            onChange={(e) =>
                                setFormData({ ...formData, available: e.target.checked })
                            }
                            className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        />
                        Available for immediate sale
                    </label>
                </div>

                {/* Image Upload & Uncropped Preview */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-4 cursor-pointer transition bg-gray-50">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-44 w-full object-contain rounded-lg"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-500 py-4">
                                <Upload className="w-6 h-6 mb-1.5 text-blue-600" />
                                <span className="text-sm font-medium">
                                    Click to upload product image
                                </span>
                                <span className="text-xs text-gray-400 mt-0.5">
                                    PNG, JPG, or WEBP
                                </span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition"
                >
                    {submitting ? "Uploading Product..." : "Publish Product"}
                </button>
            </form>
        </div>
    );
}