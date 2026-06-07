"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [isJoinHovered, setIsJoinHovered] = useState(false);
  const [isChatHovered, setIsChatHovered] = useState(false);
  const [isCreateHovered, setIsCreateHovered] = useState(false);
  const [showArchInfo, setShowArchInfo] = useState(false);
  const router = useRouter();

  // Primary Action: Join Canvas Room on Port 3003
  const handleJoinCanvas = (targetId?: string) => {
    const id = targetId || roomId.trim();
    if (id) {
      window.location.href = `http://localhost:3003/canvas/${encodeURIComponent(id.toLowerCase())}`;
    }
  };

  // Secondary Action: Join Chat Room on Port 3000
  const handleJoinChat = () => {
    if (roomId.trim()) {
      router.push(`/room/${encodeURIComponent(roomId.trim().toLowerCase())}`);
    }
  };

  // Action: Create a new random room and open canvas
  const handleCreateRandomCanvas = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    window.location.href = `http://localhost:3003/canvas/sketch-${randomId}`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030303",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: "var(--font-geist-sans), 'Inter', system-ui, sans-serif",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
      padding: "24px 24px 48px 24px",
      boxSizing: "border-box",
    }}>
      {/* CSS Styles for Grid Background & Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-1.5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1) translate(-50%, -50%); }
          50% { opacity: 0.25; transform: scale(1.08) translate(-50%, -50%); }
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        .float-el-1 { animation: float 6s ease-in-out infinite; }
        .float-el-2 { animation: float-reverse 7s ease-in-out infinite; }
        .float-el-3 { animation: float 5.5s ease-in-out infinite 0.5s; }
        
        /* Grid background pattern */
        .grid-bg {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background-image: radial-gradient(rgba(99, 102, 241, 0.15) 1.5px, transparent 1.5px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 1;
        }

        /* Ambient glow spots */
        .ambient-glow {
          position: absolute;
          top: 30%;
          left: 50%;
          width: 800px;
          height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
          animation: pulse-slow 10s ease-in-out infinite;
        }
      `}</style>

      {/* Grid Pattern and Ambient Glows */}
      <div className="grid-bg" />
      <div className="ambient-glow" />

      {/* Top Navbar */}
      <header style={{
        width: "100%",
        maxWidth: "1100px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
        height: "64px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        marginBottom: "40px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(99,102,241,0.4)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.5px" }}>Sketcher</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a
            href="http://localhost:3003"
            style={{
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.6)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"}
          >
            Launch App
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.8)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      {/* Floating Canvas Decorative Elements - Visual Wow Factor */}
      {/* Floating Element Left: Rectangle with arrow & text */}
      <div className="float-el-1" style={{
        position: "absolute",
        left: "8%",
        top: "28%",
        zIndex: 5,
        display: "none",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none",
        transformOrigin: "center",
      }}>
        {/* Responsive display: visible only on larger screens */}
        <style>{`
          @media (min-width: 1024px) {
            .float-el-1 { display: flex !important; }
            .float-el-2 { display: flex !important; }
          }
        `}</style>

        {/* Hand-drawn style SVG Rectangle */}
        <svg width="180" height="100" viewBox="0 0 180 100" style={{ filter: "drop-shadow(0 10px 20px rgba(99,102,241,0.15))" }}>
          {/* Main rectangle path (slightly irregular/hand-drawn) */}
          <path
            d="M 10 12 C 50 8, 130 14, 170 10 C 172 40, 168 70, 172 90 C 130 92, 50 88, 8 92 C 6 60, 12 30, 10 12"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="500"
            strokeDashoffset="500"
            style={{ animation: "draw 2s ease-out forwards" }}
          />
          <text x="90" y="55" textAnchor="middle" fill="#a5b4fc" fontSize="13" fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="bold">
            Infinite Canvas
          </text>
        </svg>

        {/* Squiggly indicator line */}
        <svg width="80" height="60" viewBox="0 0 80 60" style={{ marginLeft: "60px", opacity: 0.6 }}>
          <path
            d="M 10 10 Q 40 45 70 15"
            fill="none"
            stroke="#a5b4fc"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          <polygon points="70,15 63,12 65,19" fill="#a5b4fc" />
        </svg>
      </div>

      {/* Floating Element Right: Sticky Note & Circle */}
      <div className="float-el-2" style={{
        position: "absolute",
        right: "6%",
        top: "32%",
        zIndex: 5,
        display: "none",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        pointerEvents: "none",
        transformOrigin: "center",
      }}>
        {/* Sticky note */}
        <div style={{
          width: "140px",
          height: "140px",
          background: "linear-gradient(135deg, #fef08a, #fde047)",
          color: "#422006",
          padding: "16px",
          boxShadow: "5px 15px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
          transform: "rotate(6deg)",
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "2px",
          borderBottomRightRadius: "20px 2px",
        }}>
          <p style={{ margin: 0, lineHeight: 1.4 }}>💡 Real-time synchronization is fully active!</p>
          <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "10px", opacity: 0.6 }}>
            — Dev
          </div>
        </div>

        {/* Hand-drawn style SVG Circle */}
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-10deg)", marginTop: "20px", filter: "drop-shadow(0 10px 20px rgba(16,185,129,0.15))" }}>
          <path
            d="M 60 10 C 90 8, 112 30, 110 60 C 108 90, 88 112, 58 110 C 28 108, 8 88, 10 58 C 12 28, 30 12, 60 10 Z"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="400"
            strokeDashoffset="400"
            style={{ animation: "draw 2.5s ease-out forwards 0.3s" }}
          />
          <text x="60" y="65" textAnchor="middle" fill="#34d399" fontSize="12" fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="bold">
            Live Sync
          </text>
        </svg>
      </div>

      {/* Main Container */}
      <main style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "600px",
        zIndex: 10,
        textAlign: "center",
      }}>
        
        {/* Glow-pulse Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "999px",
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.18)",
          fontSize: "12px",
          fontWeight: 600,
          color: "#a5b4fc",
          letterSpacing: "0.5px",
          marginBottom: "24px",
          backdropFilter: "blur(4px)",
        }}>
          <span style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#6366f1",
            display: "inline-block",
            boxShadow: "0 0 10px #6366f1",
            animation: "pulse 2s infinite"
          }} />
          Collaborative Digital Canvas
        </div>

        {/* Hero Headlines */}
        <h1 style={{
          fontSize: "clamp(38px, 6.5vw, 56px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-1.5px",
          marginBottom: "16px",
          background: "linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.6) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Where Ideas Take Shape.
        </h1>

        <p style={{
          fontSize: "15px",
          color: "rgba(255, 255, 255, 0.45)",
          maxWidth: "460px",
          margin: "0 auto 36px auto",
          lineHeight: 1.6,
        }}>
          Sketcher lets you draw, plan, and collaborate with others in real-time. Enter a room ID to start instantly, or spin up a new private canvas.
        </p>

        {/* Interactive Join / Create Card */}
        <div style={{
          width: "100%",
          padding: "32px",
          borderRadius: "24px",
          background: "rgba(20, 20, 25, 0.65)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 30px 70px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxSizing: "border-box",
        }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
            <label style={{
              fontSize: "11px",
              color: "rgba(255, 255, 255, 0.4)",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase"
            }}>
              Room Identification
            </label>
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoinCanvas();
              }}
              type="text"
              placeholder="Enter room name (e.g., design-sprint)..."
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.04)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 500,
                outline: "none",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={e => {
                e.target.style.borderColor = "rgba(99, 102, 241, 0.6)";
                e.target.style.background = "rgba(255, 255, 255, 0.07)";
                e.target.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.15)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.target.style.background = "rgba(255, 255, 255, 0.04)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Action Row for the Typed Room ID */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "12px",
            width: "100%",
          }}>
            <style>{`
              @media (min-width: 480px) {
                .button-grid {
                  grid-template-columns: 1.2fr 0.8fr !important;
                }
              }
            `}</style>
            <div className="button-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", width: "100%" }}>
              {/* Main Button: Canvas App */}
              <button
                onClick={() => handleJoinCanvas()}
                onMouseEnter={() => setIsJoinHovered(true)}
                onMouseLeave={() => setIsJoinHovered(false)}
                disabled={!roomId.trim()}
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  border: "none",
                  background: !roomId.trim() 
                    ? "rgba(255, 255, 255, 0.03)" 
                    : isJoinHovered
                      ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                      : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: !roomId.trim() ? "rgba(255,255,255,0.25)" : "#fff",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: roomId.trim() ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: roomId.trim() && isJoinHovered
                    ? "0 10px 25px rgba(99,102,241,0.45)"
                    : "none",
                  transform: roomId.trim() && isJoinHovered ? "translateY(-1px)" : "translateY(0)",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Draw on Canvas 🎨
              </button>

              {/* Secondary Button: Text Chat Room */}
              <button
                onClick={handleJoinChat}
                onMouseEnter={() => setIsChatHovered(true)}
                onMouseLeave={() => setIsChatHovered(false)}
                disabled={!roomId.trim()}
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  background: isChatHovered ? "rgba(255, 255, 255, 0.07)" : "transparent",
                  color: !roomId.trim() ? "rgba(255,255,255,0.2)" : "rgba(255, 255, 255, 0.75)",
                  fontWeight: 500,
                  fontSize: "14px",
                  cursor: roomId.trim() ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Join Chat 💬
              </button>
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "rgba(255,255,255,0.12)",
            fontSize: "11px",
            margin: "4px 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            OR CREATE A NEW SPACE
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Random Space Button */}
          <button
            onClick={handleCreateRandomCanvas}
            onMouseEnter={() => setIsCreateHovered(true)}
            onMouseLeave={() => setIsCreateHovered(false)}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "1px dashed rgba(99, 102, 241, 0.4)",
              background: isCreateHovered ? "rgba(99, 102, 241, 0.06)" : "rgba(99, 102, 241, 0.02)",
              color: "#a5b4fc",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: isCreateHovered ? "0 4px 20px rgba(99, 102, 241, 0.1)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Start a New Sketching Board ✨
          </button>
        </div>

        {/* Feature quick badges */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "32px",
          width: "100%",
        }}>
          {[
            { text: "No Sign-up Needed", icon: "✨" },
            { text: "Zero Lag WebSocket Sync", icon: "⚡" },
            { text: "Export SVG / PNG", icon: "💾" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                fontSize: "12px",
                color: "rgba(255,255,255,0.45)",
                fontWeight: 500,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Architecture Explain Accordion (to address user's port confusion elegantly) */}
        <div style={{
          width: "100%",
          marginTop: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(10, 10, 12, 0.5)",
          overflow: "hidden",
          textAlign: "left",
          boxSizing: "border-box",
        }}>
          <button
            onClick={() => setShowArchInfo(!showArchInfo)}
            style={{
              width: "100%",
              padding: "14px 18px",
              background: "transparent",
              border: "none",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              outline: "none",
              fontFamily: "inherit",
            }}
          >
            <span>ℹ️ Architecture & Port Information</span>
            <span style={{
              transform: showArchInfo ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              fontSize: "10px"
            }}>
              ▼
            </span>
          </button>
          
          {showArchInfo && (
            <div style={{
              padding: "0 18px 18px 18px",
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.6,
              borderTop: "1px solid rgba(255, 255, 255, 0.04)",
              background: "rgba(0, 0, 0, 0.2)",
            }}>
              <p style={{ marginTop: "12px", marginBottom: "8px" }}>
                This is a <strong>Turborepo Monorepo</strong> with separate modular servers running on different ports:
              </p>
              <ul style={{ paddingLeft: "20px", margin: "0 0 12px 0", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Port 3000 (web)</strong>: The landing lobby and basic text-based room communication.</li>
                <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Port 3003 (sketcher-frontend)</strong>: The premium drawing canvas with an infinite whiteboard.</li>
                <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Port 3002 (http-backend)</strong> &amp; <strong style={{ color: "rgba(255,255,255,0.7)" }}>Port 8080 (ws-backend)</strong>: API endpoints and WebSockets.</li>
              </ul>
              <p style={{ margin: 0 }}>
                Clicking <strong>Draw on Canvas</strong> will instantly launch the canvas app on port 3003, while <strong>Join Chat</strong> runs the chat room locally on this port.
              </p>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer style={{
        width: "100%",
        maxWidth: "1100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        marginTop: "60px",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        paddingTop: "24px",
        zIndex: 10,
      }}>
        <p style={{
          fontSize: "11px",
          color: "rgba(255, 255, 255, 0.2)",
          margin: 0,
        }}>
          Built with Next.js 16 · Turborepo · WebSockets · Prisma Client · SQLite
        </p>
        <p style={{
          fontSize: "11px",
          color: "rgba(255, 255, 255, 0.12)",
          margin: 0,
        }}>
          © 2026 Sketcher. Open source and free to use.
        </p>
      </footer>
    </div>
  );
}
