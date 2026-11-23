"use client";
import {  useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAppContext } from "@/context/AppContext";

export default function AddProductPage() {
    const router = useRouter();
    const { refreshProducts } = useAppContext();
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // 1. Keep releaseDate empty in initial state (and remove the useEffect!)
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

    // 2. Generate the current timestamp inside handleSubmit
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const productPayload = {
            ...formData,
            priceUsd: parseFloat(formData.priceUsd),
            priceZig: parseFloat(formData.priceZig),
            quantity: parseInt(formData.quantity, 10),
            releaseDate: formData.releaseDate || new Date().toISOString().slice(0, 16),
        };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Creates instant local preview
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const productPayload = {
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
            await api.put(`/product`, multipartData);
            await refreshProducts();
            router.push("/");
        } catch (err) {
            console.error("Failed to create product:", err);
            alert("Error saving product. Check your Spring Boot console.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>

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
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                            <option>Electronics</option>
                            <option>Computers</option>
                            <option>Solar & Power</option>
                            <option>Home Appliances</option>
                            <option>Fashion</option>
                            <option>Networking</option>
                            <option>Hardware & Tools</option>
                            <option>Groceries</option>
                        </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Selected preview"
                            className="mt-3 h-32 w-32 object-cover rounded-lg border border-gray-200"
                        />
                    )}
                </div>

                <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="rounded text-blue-600" />
                        Product Available for Sale
                    </label>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition"
                    >
                        {submitting ? "Uploading..." : "Save Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
}