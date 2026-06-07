"use client";

import { useState, useEffect } from 'react';
import {
  Pencil,
  Shapes,
  Share2,
  Download,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  Star,
  Menu,
  X,
  MousePointer2,
  Type,
  Image,
  Layers,
  Sparkles,
  Infinity,
} from 'lucide-react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Nav */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5' : ''
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <Pencil className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Sketcher</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="/signin" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
              Sign in
            </a>
            <a
              href="/canvas"
              className="text-sm bg-sky-500 hover:bg-sky-400 transition-colors px-4 py-2 rounded-lg font-medium"
            >
              Try for free
            </a>
          </div>

          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#0e0e18] border-t border-white/5 px-6 py-4 flex flex-col gap-4 text-sm">
            <a href="#features" className="text-white/60 hover:text-white" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#showcase" className="text-white/60 hover:text-white" onClick={() => setMenuOpen(false)}>Showcase</a>
            <div className="pt-2 flex flex-col gap-2">
              <a href="/signin" className="text-center py-2 text-white/60 hover:text-white">Sign in</a>
              <a href="/canvas" className="text-center py-2 bg-sky-500 hover:bg-sky-400 rounded-lg font-medium">Try for free</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-cyan-400/8 rounded-full blur-[80px]" />
        </div>

        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Open-source diagramming, reimagined</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Draw ideas that{' '}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              come alive
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10">
            Sketcher is a fast, beautiful canvas for brainstorming, wireframing, and
            diagramming — built for those who think visually.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="group flex items-center gap-2 bg-sky-500 hover:bg-sky-400 transition-all px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-sky-500/20"
            >
              Start sketching
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white/30">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> No sign-up required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Completely free</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Open source</span>
          </div>
        </div>

        {/* Hero canvas mockup */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="rounded-2xl border border-white/10 bg-[#0e0e18] overflow-hidden shadow-2xl shadow-black/60">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 p-3 bg-[#13131f] border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80 mr-1" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 mr-1" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 mr-4" />
              {[MousePointer2, Pencil, Shapes, Type, Image].map((Icon, i) => (
                <button
                  key={i}
                  className={`p-2 rounded-lg transition-colors ${i === 1 ? 'bg-sky-500/20 text-sky-400' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Canvas area */}
            <div className="relative h-[380px] bg-[#0c0c16] overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Sketch elements */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 380">
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                  </marker>
                </defs>

                <rect x="80" y="80" width="180" height="110" rx="8" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 3" opacity="0.7" />
                <text x="170" y="141" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="sans-serif">Component A</text>

                <path d="M260 135 L340 135" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

                <rect x="340" y="80" width="180" height="110" rx="8" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
                <text x="430" y="141" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="sans-serif">Component B</text>

                <path d="M560 100 Q580 80 600 100 Q620 120 640 95 Q660 70 680 100" fill="none" stroke="#f472b6" strokeWidth="2" opacity="0.6" />

                <rect x="560" y="160" width="150" height="90" rx="4" fill="#fef08a" opacity="0.08" />
                <text x="635" y="200" textAnchor="middle" fill="#fef08a" fontSize="11" fontFamily="sans-serif" opacity="0.8">Design notes</text>
                <text x="635" y="218" textAnchor="middle" fill="#fef08a" fontSize="10" fontFamily="sans-serif" opacity="0.5">Refine border radius</text>

                <ellipse cx="170" cy="280" rx="70" ry="22" fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.6" />
                <rect x="100" y="280" width="140" height="40" fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.6" />
                <ellipse cx="170" cy="320" rx="70" ry="22" fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.6" />
                <text x="170" y="303" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontFamily="sans-serif" opacity="0.8">Database</text>

                <path d="M170 258 L170 135 L260 135" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />

                <g transform="translate(430 220)">
                  <path d="M0 0 L0 18 L5 13 L9 20 L11 19 L7 12 L14 12 Z" fill="white" opacity="0.9" />
                  <circle cx="0" cy="0" r="3" fill="#38bdf8" opacity="0.6" />
                </g>
              </svg>
            </div>
          </div>
          <div className="absolute -bottom-px left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
        </div>
      </section>



      {/* Features */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-400 text-sm font-medium uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to sketch
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Powerful tools that feel natural. From rough ideas to polished diagrams in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Infinity, title: 'Infinite Canvas', desc: 'Scroll to zoom, pan to explore. An endless drawing board that expands in every direction with your ideas.', color: 'sky' },
              { icon: Users, title: 'Real-Time Collaboration', desc: 'Draw with your team live. Share the URL and watch changes sync instantly with zero latency via WebSockets.', color: 'sky' },
              { icon: Share2, title: 'One-Click Sharing', desc: 'Share your workspace instantly. One click copies the direct room URL to your clipboard for instant collaboration.', color: 'blue' },
              { icon: Pencil, title: 'Freehand Drawing', desc: 'Draw naturally with a stylus or mouse. Smart shape recognition converts rough sketches into clean geometry.', color: 'sky' },
              { icon: Download, title: 'Export Anywhere', desc: 'Export to PNG, SVG, or JSON. Drop your diagrams into any doc or presentation.', color: 'sky' },
              { icon: Zap, title: 'Blazing Fast', desc: 'Built on a performant rendering engine. Handles thousands of elements without breaking a sweat.', color: 'blue' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.12] rounded-2xl p-6 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">


          {/* Export row */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="rounded-2xl border border-white/10 bg-[#0e0e18] p-5 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Export options</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { fmt: 'PNG', desc: 'High resolution', color: '#38bdf8' },
                    { fmt: 'SVG', desc: 'Vector format', color: '#2dd4bf' },
                    { fmt: 'JSON', desc: 'Raw data', color: '#60a5fa' },
                  ].map(({ fmt, desc, color }) => (
                    <div key={fmt} className="rounded-xl p-4 text-center" style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
                      <div className="font-bold text-lg mb-1" style={{ color }}>{fmt}</div>
                      <div className="text-white/30 text-xs">{desc}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium mb-0.5">flowchart-v2.png</div>
                    <div className="text-xs text-white/30">2048 x 1536 · 340 KB</div>
                  </div>
                  <button className="bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-400 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">Export</p>
              <h2 className="text-4xl font-bold tracking-tight mb-5 leading-tight">
                Take your diagrams anywhere
              </h2>
              <p className="text-white/40 text-lg leading-relaxed mb-8">
                Export pixel-perfect images or developer-ready SVGs. Copy-paste straight into Notion, Confluence, or your favorite doc editor.
              </p>
              <ul className="space-y-3">
                {['PNG, SVG & JSON exports', 'Copy as image shortcut', 'Embed in Notion & Confluence', 'Dark and light backgrounds'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-sky-500/5 rounded-3xl blur-3xl" />
          <div className="relative bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-3xl px-8 py-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              Start sketching{' '}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                right now
              </span>
            </h2>
            <p className="text-white/40 text-lg mb-8 max-w-lg mx-auto">
              No installation. No account needed. Open the canvas and let your ideas flow.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 transition-all px-8 py-3.5 rounded-xl font-semibold shadow-xl shadow-sky-500/20"
            >
              Open Sketcher
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <Pencil className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold">Sketcher</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Blog</a>
            <a href="#" className="hover:text-white/60 transition-colors">Changelog</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-white/40 hover:text-white">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-white/40 hover:text-white">
              <TwitterIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 text-center text-xs text-white/20">
          2026 © Sketcher. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

export default App;
