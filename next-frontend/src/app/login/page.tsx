"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Store, ShoppingBag } from "lucide-react";
import api from "@/lib/axios";
import { useAppContext, AuthUser } from "@/context/AppContext";

export default function LoginPage() {
    const router = useRouter();
    const { loginUser } = useAppContext();

    const [isRegister, setIsRegister] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"BUYER" | "SELLER">("SELLER");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const endpoint = isRegister ? "/auth/register" : "/auth/login";
            const payload = isRegister
                ? { fullName, email, password, role }
                : { email, password };

            const res = await api.post<AuthUser>(endpoint, payload);
            loginUser(res.data);
            router.push("/");
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message || "Authentication failed. Please check your credentials.";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isRegister ? "Create an Account" : "Welcome Back"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {isRegister
                        ? "Register as a Buyer or Seller on CodeGraspers"
                        : "Sign in to manage products or shop"}
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                            <input
                                required
                                type="text"
                                placeholder="Desmond Nemaunga"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                            required
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {isRegister && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Account Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole("BUYER")}
                                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition ${
                                    role === "BUYER"
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Buyer
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("SELLER")}
                                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition ${
                                    role === "SELLER"
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <Store className="w-4 h-4" />
                                Seller
                            </button>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition"
                >
                    {submitting
                        ? "Please wait..."
                        : isRegister
                            ? "Create Account"
                            : "Sign In"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
                {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                    type="button"
                    onClick={() => {
                        setIsRegister(!isRegister);
                        setError("");
                    }}
                    className="text-blue-600 font-semibold hover:underline"
                >
                    {isRegister ? "Sign In" : "Register"}
                </button>
            </div>
        </div>
    );
}