"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const heroFeatures = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 3H3a2 2 0 0 0-2 2v2" /><path d="M19 3h2a2 2 0 0 1 2 2v2" />
          <path d="M5 21H3a2 2 0 0 1-2-2v-2" /><path d="M19 21h2a2 2 0 0 0 2-2v-2" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="9" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="15" />
          <line x1="9" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="15" y2="12" />
        </svg>
      ),
      color: "#6366f1", glow: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.25)",
      tag: "Canvas", title: "Infinite Canvas",
      desc: "Pan and zoom endlessly in any direction. Smoothly scales from 10% to 2000%, always relative to your cursor.",
      bullets: ["Spacebar + drag to pan", "Scroll wheel to zoom", "Dynamic dot grid that scales with you"],
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
      color: "#10b981", glow: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.25)",
      tag: "Sharing", title: "One-Click Share",
      desc: "Copy the room link instantly. Anyone with the link joins directly into your live session — no signup required.",
      bullets: ["Click the share icon in the toolbar", "Link copied to clipboard instantly", "Paste and send to anyone"],
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: "#f59e0b", glow: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.25)",
      tag: "Multiplayer", title: "Real-Time Collaboration",
      desc: "See every stroke as it happens. Built on WebSockets — all shapes, paths and edits sync instantly across all users.",
      bullets: ["Live WebSocket sync", "Full shape & pencil support", "Shared undo / redo history"],
    },
  ];

  const allFeatures = [
    { icon: "✏️", label: "Pencil", desc: "Freehand smooth strokes" },
    { icon: "▭", label: "Rectangle", desc: "Axis-aligned boxes" },
    { icon: "○", label: "Circle", desc: "Draw from center point" },
    { icon: "→", label: "Arrow", desc: "Directional with arrowheads" },
    { icon: "△", label: "Triangle", desc: "Outline triangles" },
    { icon: "T", label: "Text", desc: "Place editable labels" },
    { icon: "◌", label: "Eraser", desc: "Adjustable eraser brush" },
    { icon: "↖", label: "Select", desc: "Drag & resize any shape" },
    { icon: "✋", label: "Pan", desc: "Hand tool canvas navigation" },
    { icon: "↩", label: "Undo / Redo", desc: "Full history stack" },
    { icon: "🎨", label: "8 Colors", desc: "White, Red, Orange, Yellow, Green, Blue, Purple, Pink" },
    { icon: "⬤", label: "4 Stroke Sizes", desc: "Thin, Medium, Thick, Extra Thick" },
    { icon: "📤", label: "Export PNG", desc: "Download canvas as image" },
    { icon: "📐", label: "Export SVG", desc: "Vector-quality download" },
    { icon: "📄", label: "Export JSON", desc: "Raw shape data export" },
    { icon: "🔐", label: "JWT Auth", desc: "Secure user accounts" },
    { icon: "🔲", label: "Dot Grid", desc: "Dynamic tiled background" },
    { icon: "🔍", label: "Zoom Controls", desc: "10% to 2000% precision" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090b",
      color: "#fff",
      fontFamily: "'Inter', 'Geist Sans', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(9,9,11,0.85)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(99,102,241,0.4)"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "18px", letterSpacing: "-0.3px" }}>Sketcher</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a href="http://localhost:3003" style={{
            fontSize: "13px", color: "rgba(255,255,255,0.5)",
            textDecoration: "none", transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          >Open Canvas</a>
          <a href="https://github.com/Sarthak2811-hub/sketcher-app" target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              color: "rgba(255,255,255,0.5)", fontSize: "13px",
              transition: "color 0.2s", textDecoration: "none",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center",
        padding: "96px 24px 64px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "300px",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "5px 14px", borderRadius: "999px",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
          fontSize: "12px", fontWeight: 600, color: "#a5b4fc",
          letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "28px",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
          Now with Real-Time Multiplayer
        </div>

        <h1 style={{
          fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 800,
          lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "24px",
          background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.5))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Draw Together,<br />Anywhere.
        </h1>

        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", maxWidth: "480px", lineHeight: 1.7, marginBottom: "56px" }}>
          A premium infinite whiteboard with real-time collaboration, one-click sharing, and a full suite of creative drawing tools.
        </p>

        {/* Room join card */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
          padding: "28px 32px", borderRadius: "20px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)", boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          width: "100%", maxWidth: "420px",
        }}>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            Enter a Room ID to join
          </span>
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && roomId.trim()) router.push(`/room/${roomId.trim()}`); }}
              type="text"
              placeholder="e.g. abc123"
              style={{
                flex: 1, padding: "12px 16px", borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
                color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => { if (roomId.trim()) router.push(`/room/${roomId.trim()}`); }}
              style={{
                padding: "12px 20px", borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none", color: "#fff", fontWeight: 700, fontSize: "14px",
                cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                transition: "transform 0.15s", fontFamily: "inherit", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              Join Room →
            </button>
          </div>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
            Or go straight to{" "}
            <a href="http://localhost:3003" style={{ color: "#6366f1", textDecoration: "none" }}>localhost:3003</a>
          </p>
        </div>
      </section>

      {/* 3 Key Feature Cards */}
      <section style={{ padding: "0 24px 80px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "8px" }}>
          Core capabilities
        </p>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.8px", textAlign: "center", marginBottom: "40px", color: "rgba(255,255,255,0.9)" }}>
          Everything you need to create together
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", width: "100%", maxWidth: "1024px" }}>
          {heroFeatures.map((f, i) => (
            <div key={i} style={{
              padding: "28px", borderRadius: "20px",
              background: `linear-gradient(135deg, ${f.glow} 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${f.border}`, display: "flex", flexDirection: "column", gap: "16px",
              transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px rgba(0,0,0,0.3)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: f.glow, border: `1px solid ${f.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color }}>{f.icon}</div>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: f.color, padding: "4px 10px", borderRadius: "999px", background: f.glow, border: `1px solid ${f.border}` }}>{f.tag}</span>
              </div>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", letterSpacing: "-0.3px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "7px", padding: 0 }}>
                {f.bullets.map((b, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: f.color, flexShrink: 0 }} />{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* All Tools Grid */}
      <section style={{
        padding: "0 24px 96px", display: "flex", flexDirection: "column", alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: "72px",
      }}>
        <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: "12px" }}>
          Full feature set
        </p>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.8px", textAlign: "center", marginBottom: "8px", color: "rgba(255,255,255,0.9)" }}>
          18 tools. Zero compromises.
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", marginBottom: "48px", textAlign: "center" }}>
          Everything built in — no plugins, no extensions, no paywalls for core tools.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px", width: "100%", maxWidth: "1024px",
        }}>
          {allFeatures.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "12px",
              padding: "16px 18px", borderRadius: "14px",
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              transition: "background 0.2s, border-color 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.06)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <span style={{ fontSize: "22px", lineHeight: 1, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: "3px" }}>{f.label}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        margin: "0 24px 80px",
        padding: "48px 40px",
        borderRadius: "24px",
        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
        border: "1px solid rgba(99,102,241,0.2)",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "20px",
        maxWidth: "1024px",
        alignSelf: "center", width: "calc(100% - 48px)",
      }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 700, letterSpacing: "-0.5px" }}>
          Ready to start drawing?
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", maxWidth: "400px" }}>
          Open the canvas, create a room, and share the link with your team. No setup required.
        </p>
        <a
          href="http://localhost:3003"
          style={{
            padding: "14px 32px", borderRadius: "14px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", fontWeight: 700, fontSize: "15px",
            textDecoration: "none", boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
        >
          Open Sketcher →
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 48px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,0.2)", fontSize: "12px", gap: "8px",
      }}>
        <span>Built with Next.js, WebSockets & Prisma</span>
        <span>·</span>
        <a href="https://github.com/Sarthak2811-hub/sketcher-app" target="_blank" rel="noopener noreferrer"
          style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
          View on GitHub
        </a>
      </footer>
    </div>
  );
}
