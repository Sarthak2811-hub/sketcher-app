"use client"
import { WS_URL, HTTP_BACKEND } from "@/app/config"
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import axios from "axios";

function getWsUrl(configuredUrl: string): string {
    if (!configuredUrl) return "ws://localhost:8080";
    let cleanUrl = configuredUrl.trim();
    if (cleanUrl.startsWith("http://")) {
        cleanUrl = cleanUrl.replace("http://", "ws://");
    } else if (cleanUrl.startsWith("https://")) {
        cleanUrl = cleanUrl.replace("https://", "wss://");
    }
    if (!cleanUrl.startsWith("ws://") && !cleanUrl.startsWith("wss://")) {
        if (cleanUrl.includes("onrender.com") || cleanUrl.includes("vercel.app") || !cleanUrl.includes("localhost")) {
            cleanUrl = "wss://" + cleanUrl;
        } else {
            cleanUrl = "ws://" + cleanUrl;
        }
    }
    return cleanUrl;
}

// Global authentication promise lock to prevent concurrent/StrictMode race conditions in development
let globalAuthPromise: Promise<string> | null = null;

async function getOrPerformDevLogin(): Promise<string> {
    if (globalAuthPromise) {
        console.log("[RoomCanvas] Awaiting existing parallel authentication process...");
        return globalAuthPromise;
    }
    
    globalAuthPromise = (async () => {
        try {
            const devUser = {
                username: "dev-user@example.com",
                password: "password123",
                name: "Dev User"
            };

            // 1. Attempt dynamic dev registration
            try {
                await axios.post(`${HTTP_BACKEND}/signup`, devUser);
                console.log("[RoomCanvas] Auto-registered local dev account");
            } catch (e) {
                // User already exists — fine
            }

            // 2. Perform dev signin
            const signinRes = await axios.post(`${HTTP_BACKEND}/signin`, {
                username: devUser.username,
                password: devUser.password
            });

            if (signinRes.data?.token) {
                const token = signinRes.data.token;
                localStorage.setItem("token", token);
                console.log("[RoomCanvas] Auto-signin successful, token saved");
                return token;
            }
        } catch (err) {
            console.error("[RoomCanvas] Global dev authentication failed:", err);
        } finally {
            globalAuthPromise = null; // Release the lock
        }
        return "";
    })();
    
    return globalAuthPromise;
}

export function RoomCanvas({roomId}:{
    roomId: string;
}){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let ws: WebSocket | null = null;
        let active = true;
        let pingInterval: any = null;

        async function connect() {
            setError(null);
            let token = localStorage.getItem("token") || "";
            
            if (!token) {
                console.log("[RoomCanvas] No token found. Attempting automatic guest/free account login...");
                token = await getOrPerformDevLogin();
                if (token) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("userEmail", "dev-user@example.com");
                } else if (active) {
                    window.location.href = "/signup";
                    return;
                }
            }

            if (!active) return;

            console.log("[RoomCanvas] Connecting to WebSocket with token:", token ? (token.substring(0, 15) + "...") : "none");
            
            try {
                const resolvedWsUrl = getWsUrl(WS_URL);
                console.log("[RoomCanvas] WebSocket URL resolved to:", resolvedWsUrl);
                const socketInstance = new WebSocket(`${resolvedWsUrl}?token=${token}`);
                ws = socketInstance;
                
                socketInstance.onopen = () => {
                    if (!active) {
                        socketInstance.close();
                        return;
                    }
                    setSocket(socketInstance);
                    socketInstance.send(JSON.stringify({
                        type: "join",
                        roomId
                    }));

                    // Start sending ping heartbeats every 30 seconds to keep connection alive on Render
                    pingInterval = setInterval(() => {
                        if (socketInstance.readyState === WebSocket.OPEN) {
                            socketInstance.send(JSON.stringify({ type: "ping" }));
                        }
                    }, 30000);
                };
                
                socketInstance.onerror = () => {
                    // onerror is always followed by onclose — let onclose handle the error UI
                    // Logging an empty WebSocket ErrorEvent is misleading, so we skip it here
                    console.warn("[RoomCanvas] WebSocket connection error (see onclose for details)");
                };
                
                socketInstance.onclose = (event) => {
                    console.log("[RoomCanvas] WebSocket closed:", event.code, event.reason);
                    if (pingInterval) {
                        clearInterval(pingInterval);
                        pingInterval = null;
                    }
                    if (!active) return; // StrictMode cleanup — ignore silently
                    
                    setSocket(null); // Clear socket state to unmount the canvas
                    
                    if (event.code === 4001) {
                        setError("Your session token was rejected by the server. Your token may have expired or is invalid.");
                    } else if (event.code !== 1000 && event.code !== 1001) {
                        // Only show error for truly abnormal close codes
                        setError(`Connection to drawing server was closed (Code: ${event.code}). Please verify network or server status.`);
                    }
                    // Codes 1000/1001 = clean close by StrictMode cleanup — silently no-op
                };
            } catch (err: any) {
                console.error("[RoomCanvas] Connection initialization failed:", err);
                if (active) {
                    setError(`Failed to initialize WebSocket: ${err.message || String(err)}`);
                }
            }
        }

        connect();

        return () => {
            active = false;
            if (pingInterval) {
                clearInterval(pingInterval);
            }
            if (ws) {
                ws.close();
            }
        };
    }, [roomId]);

    // Error State Renderer
    if (error) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#0a0a0f] text-white px-6">
                <div className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-lg font-bold">!</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Connection Issue</h2>
                    <p className="text-xs text-white/50 mb-6 leading-relaxed px-2">{error}</p>
                    
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                setError(null);
                                window.location.reload();
                            }}
                            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-500/20 text-xs uppercase tracking-wider"
                        >
                            Reset Session & Retry
                        </button>
                        <a
                            href="/canvas"
                            className="block w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold rounded-xl transition-all text-xs uppercase tracking-wider"
                        >
                            Back to Lobby
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (!socket) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                backgroundColor: "#000",
                color: "#fff",
                fontFamily: "sans-serif",
                gap: "16px"
            }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid #333",
                    borderTop: "3px solid #6366f1",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Connecting to canvas...</p>
            </div>
        );
    }

    return <Canvas roomId={roomId} socket={socket} />;
}