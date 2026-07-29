"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/app/config";

export default function CanvasLanding() {
  const [roomId, setRoomId] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function verifyOrAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        try {
          console.log("[Lobby] No session found. Setting up guest/free tier account...");
          const devUser = {
            username: "dev-user@example.com",
            password: "password123",
            name: "Dev User"
          };
          
          try {
            await axios.post(`${HTTP_BACKEND}/signup`, devUser);
          } catch(e) {} // Ignore error if guest user already exists in DB

          const signinRes = await axios.post(`${HTTP_BACKEND}/signin`, {
            username: devUser.username,
            password: devUser.password
          });

          if (signinRes.data?.token) {
            localStorage.setItem("token", signinRes.data.token);
            localStorage.setItem("userEmail", devUser.username);
            setCheckingAuth(false);
          } else {
            router.push("/signup");
          }
        } catch(err) {
          console.error("[Lobby] Guest authentication failed:", err);
          router.push("/signup");
        }
      } else {
        setCheckingAuth(false);
      }
    }
    
    verifyOrAuth();
  }, [router]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      const target = `/canvas/${encodeURIComponent(roomId.trim().toLowerCase())}`;
      console.log(`[Lobby] Joining custom room. Redirecting to: ${target}`);
      router.push(target);
    }
  };

  const handleCreateRandom = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const target = `/canvas/${randomId}`;
    console.log(`[Lobby] Creating random room. Redirecting to: ${target}`);
    router.push(target);
  };

  if (checkingAuth) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#0a0a0f] text-white">
        <div className="w-10 h-10 border-3 border-white/10 border-t-sky-500 rounded-full animate-spin mb-4" />
        <p className="text-white/40 text-sm">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#0a0a0f] text-white px-6">
      <div className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
          Join a Canvas Room
        </h1>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Room ID / Name
            </label>
            <input
              type="text"
              placeholder="e.g., room-123"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-3 bg-[#0c0c16] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-white/20 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-500/20"
          >
            Join Room
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-[#0d0d17] px-3 text-xs text-white/40">or</span>
        </div>

        <button
          type="button"
          onClick={handleCreateRandom}
          className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold rounded-xl transition-all"
        >
          Create Random Room
        </button>
      </div>
    </div>
  );
}

