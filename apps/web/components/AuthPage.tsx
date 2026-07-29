"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Pencil, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { HTTP_BACKEND } from "@/app/config";

export function AuthPage({ isSignIn: initialIsSignIn }: {
    isSignIn: boolean;
}) {
    const router = useRouter();
    const [isSignIn, setIsSignIn] = useState(initialIsSignIn);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // On mount, clear any existing session token to allow fresh signup/signin and prevent instant redirects
    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
    }, []);

    // Track isSignIn updates from parent props if they change
    useEffect(() => {
        setIsSignIn(initialIsSignIn);
        setError(null);
    }, [initialIsSignIn]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            if (isSignIn) {
                // SIGN IN FLOW
                const response = await axios.post(`${HTTP_BACKEND}/signin`, {
                    username: email.trim(),
                    password: password
                });

                if (response.data?.token) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("userEmail", email.trim());
                    router.push("/canvas");
                } else {
                    setError("Failed to sign in. No token returned.");
                }
            } else {
                // SIGN UP FLOW
                try {
                    const derivedName = email.split("@")[0] || "User";
                    await axios.post(`${HTTP_BACKEND}/signup`, {
                        username: email.trim(),
                        password: password,
                        name: derivedName
                    });

                    // Auto Sign In on successful signup
                    const signinRes = await axios.post(`${HTTP_BACKEND}/signin`, {
                        username: email.trim(),
                        password: password
                    });

                    if (signinRes.data?.token) {
                        localStorage.setItem("token", signinRes.data.token);
                        localStorage.setItem("userEmail", email.trim());
                        router.push("/canvas");
                    } else {
                        // Fallback redirect if signin failed but signup succeeded
                        router.push("/signin?success=registered");
                    }

                } catch (signUpErr: any) {
                    console.error("[AuthPage] Signup Error:", signUpErr);
                    // Check if error status is 409 (Conflict/Duplicate)
                    if (signUpErr.response?.status === 409 || 
                        signUpErr.response?.data?.message?.toLowerCase().includes("exist")) {
                        setError("User is already exist and need to sign in");
                    } else {
                        setError(signUpErr.response?.data?.message || "Failed to create account. Please try again.");
                    }
                }
            }
        } catch (signInErr: any) {
            console.error("[AuthPage] Signin Error:", signInErr);
            setError(signInErr.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col justify-center items-center px-6 relative overflow-hidden font-sans">
            {/* Background dynamic glow */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-[80px]" />
            </div>

            {/* Grid background overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Back Link to Landing Page */}
            <div className="absolute top-6 left-6 z-20">
                <a href="/" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-all">
                    <Pencil className="w-4 h-4 text-sky-400" />
                    <span className="font-semibold tracking-wide">Sketcher</span>
                </a>
            </div>

            {/* Main Auth Card Container */}
            <div className="max-w-md w-full bg-white/[0.02] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative z-10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/10">
                        <Pencil className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                        {isSignIn ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-sm text-white/40 mt-2">
                        {isSignIn
                            ? "Sign in to access your diagrams and rooms"
                            : "Start sketching in seconds by creating a free account"}
                    </p>
                </div>

                {/* Status/Error Messages */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">{error}</p>
                            {!isSignIn && error.includes("sign in") && (
                                <button
                                    onClick={() => {
                                        setIsSignIn(true);
                                        setError(null);
                                    }}
                                    className="mt-2 text-xs font-semibold text-sky-400 hover:text-sky-300 underline flex items-center gap-1 cursor-pointer"
                                >
                                    Switch to Sign In now <ArrowRight className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-[#0c0c16] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-white/20 transition-all text-sm"
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-[#0c0c16] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-white/20 transition-all text-sm"
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-2 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-600/50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                {isSignIn ? "Sign In" : "Sign Up"}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Card Footer toggle link */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-white/40">
                    {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => {
                            setIsSignIn(!isSignIn);
                            setError(null);
                        }}
                        className="font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer ml-1"
                        disabled={loading}
                    >
                        {isSignIn ? "Sign up free" : "Sign in here"}
                    </button>
                </div>
            </div>
        </div>
    );
}