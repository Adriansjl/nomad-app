import { useState, useEffect } from "react";

const API = async (messages, system, useSearch = false) => {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system,
    messages,
  };
  if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.REACT_APP_ANTHROPIC_KEY
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const text = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n") || "";
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
};

const HERO_IMGS = [
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80",
];

const GIG_IMGS = [
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80",
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=500&q=80",
  "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=500&q=80",
];

const PLATFORM_COLORS = {
  Instagram: "#c13584", Facebook: "#1877f2", Threads: "#000000",
  Reddit: "#ff4500", Twitter: "#1da1f2", LinkedIn: "#0077b5",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060606; }
  .nomad-root { min-height: 100vh; background: #060606; color: #d4cfc8; font-family: 'DM Sans', sans-serif; }
  .serif { font-family: 'Playfair Display', Georgia, serif; }
  .mono { font-family: 'JetBrains Mono', monospace; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:.3; } 50% { opacity:1; } }
  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .dot-pulse { animation: pulse 1.6s ease-in-out infinite; }
  .dot-pulse:nth-child(2) { animation-delay: .25s; }
  .dot-pulse:nth-child(3) { animation-delay: .5s; }
  input, textarea { background: #111; border: 1px solid #222; border-radius: 8px; padding: 11px 14px; color: #e4dbd0; font-family: 'DM Sans', sans-serif; font-size: 14px; width: 100%; outline: none; transition: border .2s; }
  input:focus, textarea:focus { border-color: #7a5a1f; }
  input::placeholder { color: #333; }
  .tab-btn { background: none; border: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; padding: 8px 16px; border-radius: 5px; transition: all .2s; }
  .tab-btn.active { background: rgba(200,149,58,.12); color: #c8953a; border: 1px solid rgba(200,149,58,.25); }
  .tab-btn.inactive { color: #4a4540; border: 1px solid transparent; }
  .tab-btn.inactive:hover { color: #7a7068; }
  .hunt-btn { background: #c8953a; border: none; border-radius: 8px; padding: 12px 24px; color: #0a0a0a; font-weight: 700; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; cursor: pointer; transition: all .2s; font-family: 'JetBrains Mono', monospace; }
  .hunt-btn:hover { background: #e8b060; }
  .hunt-btn:disabled { background: #282420; color: #333; cursor: not-allowed; }
  .card { background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 12px; transition: border-color .2s; }
  .card:hover { border-color: #241c0d; }
  .pill { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .15em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; }
  .copy-btn { background: none; border: 1px solid #1a1a1a; border-radius: 4px; padding: 3px 10px; color: #4a4540; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .1em; cursor: pointer; transition: all .15s; text-transform: uppercase; }
  .copy-btn:hover { color: #c8953a; border-color: #3a2a0d; }
  .save-btn { background: none; border: 1px solid #1a1a1a; border-radius: 6px; padding: 6px 12px; font-size: 12px; cursor: pointer; transition: all .15s; }
  .save-btn.saved { border-color: #3a1010; color: #c05050; background: rgba(192,80,80,.08); }
  .save-btn.unsaved { color: #4a4540; }
  .save-btn:hover { border-color: #333; }
  .section-label { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .section-label span { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .3em; text-transform: uppercase; color: #7a5a1f; white-space: nowrap; }
  .section-label div { flex: 1; height: 1px; background: #1a1a1a; }
  .risk-low { background: rgba(50,100,60,.15); color: #5a9a6a; }
  .risk-medium { background: rgba(180,140,0,.1); color: #b8a040; }
  .risk-high { background: rgba(160,50,50,.12); color: #c06060; }
  .hero-photo { width: 100%; height: 320px; object-fit: cover; filter: brightness(0.35) saturate(0.6); }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(6,6,6,.2), rgba(6,6,6,.5), #060606); }
  .gig-img { width: 100%; height: 180px; object-fit: cover; border-radius: 10px 10px 0 0; filter: brightness(0.75) saturate(0.85); }
  .creator-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #3a2a0d, #c8953a); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #060606; flex-shrink: 0; }
  .connect-btn { background: none; border: 1px solid #1a1a1a; border-radius: 6px; padding: 7px 14px; color: #7a7068; font-size: 12px; cursor: pointer; transition: all .2s; width: 100%; }
  .connect-btn:hover { border-color: #3a2a0d; color: #c8953a; }
  .loading-bar { height: 1px; background: #1a1a1a; overflow: hidden; border-radius: 1px; }
  .loading-bar-fill { height: 100%; width: 30%; background: #c8953a; animation: pulse 1.8s ease-in-out infinite; }
`;

const SCAN_MSGS = [
  "scanning live promo sources...",
  "checking airline newsletters...",
  "hunting reddit deal threads...",
];

const GIG_SCAN_MSGS = [
  "scanning instagram for creator calls...",
  "checking facebook groups...",
  "searching threads posts...",
];

export default function Nomad() {
  const [tab, setTab] = useState("flights");
  const [savedGigs, setSavedGigs] = useState([]);
  const [heroImg] = useState(HERO_IMGS[Math.floor(Math.random() * HERO_IMGS.length)]);

  return (
    <div className="nomad-root">
      <style>{css}</style>
      <Nav tab={tab} setTab={setTab} savedCount={savedGigs.length} />
      {tab === "flights" && <FlightsTab heroImg={heroImg} />}
      {tab === "gigs" && <GigsTab savedGigs={savedGigs} setSavedGigs={setSavedGigs} />}
      {tab === "network" && <NetworkTab />}
    </div>
  );
}

function Nav({ tab, setTab, savedCount }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(6,6,6,.92)", borderBottom: "1px solid #141414", backdropFilter: "blur(12px)", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span className="serif" style={{ fontSize: 22, color: "#c8953a", fontWeight: 500, letterSpacing: "-.01em" }}>NOMAD</span>
        <span className="mono" style={{ fontSize: 10, color: "#3a3028", letterSpacing: ".3em" }}>CREATOR EDITION</span>
      </div>
      <div style={{ display: "flex", gap: 4, background: "#0a0a0a", padding: "4px", borderRadius: 8, border: "1px solid #141414" }}>
        {[
          { id: "flights", label: "flights" },
          { id: "gigs", label: savedCount ? `gigs (${savedCount})` : "gigs" },
          { id: "network", label: "network" },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : "inactive"}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function FlightsTab({ heroImg }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dates, setDates] = useState("");
  const [flexible, setFlexible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [scanIdx, setScanIdx] = useState(0);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setScanIdx(i => (i + 1) % SCAN_MSGS.length), 2800);
    return () => clearInterval(t);
  }, [loading]);

  const hunt = async () => {
    if (!from.trim() || !to.trim()) return;
    setLoading(true);
    setResults(null);
    setScanIdx(0);
    const data = await API(
      [{ role: "user", content: `Find the absolute best deals and ALL currently active promo codes for: ${from.trim().toUpperCase()} → ${to.trim().toUpperCase()}${dates ? `, around ${dates}` : ""}${flexible ? " (flexible ±3 days)" : ""}` }],
      `You are an elite travel deal hunter. Return ONLY raw JSON with flight deals and promo codes.`,
      true
    );
    setResults(data);
    setLoading(false);
  };

  const copy = code => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={heroImg} alt="" className="hero-photo" />
        <div className="hero-overlay" />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: ".4em", color: "#7a5a1f", marginBottom: 12 }}>fly further. spend less.</div>
          <h1 className="serif" style={{ fontSize: "clamp(3rem,7vw,5rem)", color: "#e4dbd0", fontWeight: 400, letterSpacing: "-.03em", lineHeight: 1, marginBottom: 8 }}>
            the fare<span style={{ color: "#c8953a" }}>.</span>
          </h1>
          <p style={{ fontSize: 14, color: "#4a4030", letterSpacing: ".05em" }}>real codes. real intel. no fake anything.</p>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "-60px auto 0", padding: "0 20px 48px", position: "relative", zIndex: 10 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "end", marginBottom: 12 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: ".2em", color: "#3a3028", marginBottom: 5 }}>FROM</div>
              <input value={from} onChange={e => setFrom(e.target.value)} onKeyDown={e => e.key === "Enter" && hunt()} placeholder="NYC, JFK, New York..." />
            </div>
            <div style={{ color: "#3a3028", fontSize: 18, paddingBottom: 11, textAlign: "center" }}>→</div>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: ".2em", color: "#3a3028", marginBottom: 5 }}>TO</div>
              <input value={to} onChange={e => setTo(e.target.value)} onKeyDown={e => e.key === "Enter" && hunt()} placeholder="LAX, London, BKK..." />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: ".2em", color: "#3a3028", marginBottom: 5 }}>DATES (optional)</div>
            <input value={dates} onChange={e => setDates(e.target.value)} onKeyDown={e => e.key === "Enter" && hunt()} placeholder="June, next month, summer..." />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <span style={{ fontSize: 13, color: "#4a4540" }}>flexible dates <span style={{ color: "#2a2520" }}>±3 days</span></span>
            <div onClick={() => setFlexible(f => !f)} style={{ width: 40, height: 22, borderRadius: 11, background: flexible ? "#3a2a0d" : "#1a1a1a", cursor: "pointer", position: "relative", transition: "background .2s" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: flexible ? "#c8953a" : "#333", position: "absolute", top: 3, left: flexible ? 21 : 3, transition: "left .2s" }} />
            </div>
          </div>
          <button className="hunt-btn" style={{ width: "100%" }} onClick={hunt} disabled={loading || !from.trim() || !to.trim()}>
            {loading ? "hunting..." : "hunt deals"}
          </button>
        </div>

        {loading && (
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[0,1,2].map(i => <div key={i} className="dot-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#c8953a" }} />)}
            </div>
            <div key={scanIdx} className="fade-up mono" style={{ fontSize: 11, color: "#4a4540", letterSpacing: ".08em" }}>{SCAN_MSGS[scanIdx]}</div>
          </div>
        )}

        {results && !loading && (
          <div className="fade-up" style={{ marginTop: 40 }}>
            <h2 className="serif" style={{ fontSize: "2rem", color: "#e4dbd0", marginBottom: 20 }}>
              {from.trim().toUpperCase()} → {to.trim().toUpperCase()}
            </h2>
            {results.codes ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {results.codes.map((c, i) => (
                  <div key={i} className="card" style={{ padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: "#e4dbd0" }}>{c.code || "N/A"}</span>
                      <button className="copy-btn" onClick={() => copy(c.code || "")}>{copied === c.code ? "✓" : "copy"}</button>
                    </div>
                    <div style={{ fontSize: 12, color: "#c8953a" }}>{c.discount || "Check details"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#7a7068" }}>No data available. Try again.</p>
            )}
            <button onClick={() => setResults(null)} style={{ marginTop: 20, background: "none", border: "none", color: "#3a3028", fontSize: 11, cursor: "pointer", textTransform: "uppercase" }}>
              ← new search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GigsTab({ savedGigs, setSavedGigs }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [scanIdx, setScanIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setScanIdx(i => (i + 1) % GIG_SCAN_MSGS.length), 2500);
    return () => clearInterval(t);
  }, [loading]);

  const findGigs = async () => {
    setLoading(true);
    setGigs([]);
    setScanIdx(0);
    const data = await API(
      [{ role: "user", content: `Find creator gigs${query ? ` for: ${query}` : ""}` }],
      `You are a gig aggregator. Return JSON with gig opportunities.`,
      true
    );
    if (data?.gigs) setGigs(data.gigs);
    setLoading(false);
  };

  const toggleSave = gig => {
    if (savedGigs.some(g => g.id === gig.id)) {
      setSavedGigs(savedGigs.filter(g => g.id !== gig.id));
    } else {
      setSavedGigs([...savedGigs, gig]);
    }
  };

  const isSaved = id => savedGigs.some(g => g.id === id);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 64px" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 className="serif" style={{ fontSize: "2rem", color: "#e4dbd0", marginBottom: 8 }}>gig finder</h2>
        <p style={{ fontSize: 13, color: "#4a4540" }}>find creator opportunities</p>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && findGigs()} placeholder="search for gigs..." style={{ flex: 1 }} />
          <button className="hunt-btn" onClick={findGigs} disabled={loading} style={{ whiteSpace: "nowrap" }}>
            {loading ? "scanning..." : "find gigs"}
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "40px 0" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[0,1,2].map(i => <div key={i} className="dot-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#c8953a" }} />)}
          </div>
          <div className="fade-up mono" style={{ fontSize: 11, color: "#4a4540" }}>{GIG_SCAN_MSGS[scanIdx]}</div>
        </div>
      )}

      {gigs.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {gigs.map((gig, i) => (
            <div key={gig.id || i} className="card" style={{ overflow: "hidden" }}>
              <img src={GIG_IMGS[i % GIG_IMGS.length]} alt="" className="gig-img" />
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 8 }}>
                  <h3 style={{ fontSize: 14, color: "#d4cfc8" }}>{gig.title}</h3>
                  <button onClick={() => toggleSave(gig)} className={`save-btn ${isSaved(gig.id) ? "saved" : "unsaved"}`}>
                    {isSaved(gig.id) ? "♥" : "♡"}
                  </button>
                </div>
                <p style={{ fontSize: 12, color: "#4a4540", lineHeight: 1.6 }}>{gig.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                  <span style={{ fontSize: 11, color: "#4a4030" }}>📍 {gig.location}</span>
                  <span className="mono" style={{ fontSize: 13, color: "#c8953a", fontWeight: 600 }}>{gig.pay}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {savedGigs.length > 0 && (
        <div style={{ marginTop: 48, paddingTop: 40 }}>
          <h3 style={{ fontSize: 18, color: "#e4dbd0", marginBottom: 16 }}>saved gigs ({savedGigs.length})</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {savedGigs.map(gig => (
              <div key={gig.id} className="card" style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 13, color: "#d4cfc8", marginBottom: 4 }}>{gig.title}</h3>
                    <span className="mono" style={{ fontSize: 12, color: "#c8953a" }}>{gig.pay}</span>
                  </div>
                  <button onClick={() => toggleSave(gig)} style={{ background: "none", border: "none", color: "#c05050", fontSize: 16, cursor: "pointer" }}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const MOCK_CREATORS = [
  { id: 1, name: "Alex Chen", init: "AC", specialty: "Travel Cinematography", location: "Singapore", tags: ["Sony FX3", "Aerial", "Documentary"], followers: "2.3K" },
  { id: 2, name: "Maya Patel", init: "MP", specialty: "UGC & Reels", location: "Dubai", tags: ["Instagram", "TikTok", "Brands"], followers: "45K" },
  { id: 3, name: "James Rodriguez", init: "JR", specialty: "Landscape & Street", location: "Mexico City", tags: ["Sony A7", "Film Emulation"], followers: "18K" },
  { id: 4, name: "Sofia Rossi", init: "SR", specialty: "Fashion & Lifestyle", location: "Rome", tags: ["Video", "Photo", "Editorial"], followers: "62K" },
  { id: 5, name: "Kai Tanaka", init: "KT", specialty: "Drone & Aerial", location: "Tokyo", tags: ["DJI", "Aerial", "Commercial"], followers: "35K" },
  { id: 6, name: "Emma Wilson", init: "EW", specialty: "Documentary Films", location: "London", tags: ["Arri", "Canon", "Festivals"], followers: "8.4K" },
  { id: 7, name: "Carlos Dias", init: "CD", specialty: "Adventure & Outdoor", location: "Lisbon", tags: ["Action", "POV", "GoPro"], followers: "22K" },
  { id: 8, name: "Nana Kofi", init: "NK", specialty: "Portrait & Culture", location: "Accra", tags: ["People", "Africa", "Brands"], followers: "14K" },
];

function NetworkTab() {
  const [connected, setConnected] = useState([]);
  const [search, setSearch] = useState("");

  const filtered = MOCK_CREATORS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.specialty.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 64px" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 className="serif" style={{ fontSize: "2rem", color: "#e4dbd0", marginBottom: 8 }}>creator network</h2>
        <p style={{ fontSize: 13, color: "#4a4540" }}>photographers, videographers, creators — globally</p>
      </div>

      <div style={{ marginBottom: 28 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="search by name, specialty, location..." style={{ maxWidth: 360 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
        {filtered.map(c => (
          <div key={c.id} className="card" style={{ padding: 18, textAlign: "center" }}>
            <div className="creator-avatar" style={{ margin: "0 auto 12px" }}>{c.init}</div>
            <div style={{ fontSize: 14, color: "#d4cfc8", fontWeight: 500, marginBottom: 2 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: "#c8953a", marginBottom: 4 }}>{c.specialty}</div>
            <div style={{ fontSize: 11, color: "#4a4030", marginBottom: 10 }}>📍 {c.location}</div>
            <div className="mono" style={{ fontSize: 10, color: "#3a3028", marginBottom: 12 }}>{c.followers} followers</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", marginBottom: 14 }}>
              {c.tags.map(tag => (
                <span key={tag} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 3, padding: "2px 7px", fontSize: 9, color: "#4a4030" }}>
                  {tag}
                </span>
              ))}
            </div>
            <button className="connect-btn" onClick={() => setConnected(cc => cc.includes(c.id) ? cc.filter(x => x !== c.id) : [...cc, c.id])}>
              {connected.includes(c.id) ? "✓ connected" : "connect"}
            </button>
          </div>
        ))}
      </div>

      {connected.length > 0 && (
        <div style={{ marginTop: 40, paddingTop: 28 }}>
          <h3 style={{ fontSize: 18, color: "#e4dbd0", marginBottom: 16 }}>your connections ({connected.length})</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {connected.map(id => {
              const c = MOCK_CREATORS.find(x => x.id === id);
              return c ? (
                <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 8, padding: "8px 12px" }}>
                  <div className="creator-avatar" style={{ width: 28, height: 28, fontSize: 12 }}>{c.init}</div>
                  <div>
                    <div style={{ fontSize: 12, color: "#d4cfc8" }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: "#4a4030" }}>{c.location}</div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}