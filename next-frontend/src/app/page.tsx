"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const { products, searchQuery } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories dynamically from your products
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  // Filter by both category pill and search bar text
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
    const query = (searchQuery ?? "").toLowerCase();
    const matchesSearch =
        (product.name ?? "").toLowerCase().includes(query) ||
        (product.brand ?? "").toLowerCase().includes(query) ||
        (product.category ?? "").toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
      <div>
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((category) => (
              <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                      selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
              >
                {category}
              </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No products found. Make sure your Spring Boot server is running on port 8080!
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
              ))}
            </div>
        )}
      </div>
  );
}