import { useState, useEffect, useRef } from "react";

const API = async (messages, system, useSearch = false) => {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system,
    messages,
  };
  if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  const res = await fetch("https://cors-anywhere.herokuapp.com/https://api.anthropic.com/v1/messages", {
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
  @keyframes shimmer { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
  @keyframes pulse { 0%,100% { opacity:.3; } 50% { opacity:1; } }
  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .dot-pulse { animation: pulse 1.6s ease-in-out infinite; }
  .dot-pulse:nth-child(2) { animation-delay: .25s; }
  .dot-pulse:nth-child(3) { animation-delay: .5s; }
  input, textarea { background: #111; border: 1px solid #222; border-radius: 8px; padding: 11px 14px; color: #e4dbd0; font-family: 'DM Sans', sans-serif; font-size: 14px; width: 100%; outline: none; transition: border .2s; }
  input:focus, textarea:focus { border-color: #7a5a1f; }
  input::placeholder { color: #333; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
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
  .conf-high { color: #5a9a6a; }
  .conf-medium { color: #c8953a; }
  .conf-low { color: #4a4540; }
  .assess-excellent { color: #5a9a6a; }
  .assess-good { color: #c8953a; }
  .assess-fair { color: #b8a040; }
  .assess-overpriced { color: #c06060; }
  .hero-photo { width: 100%; height: 320px; object-fit: cover; filter: brightness(0.35) saturate(0.6); }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(6,6,6,.2), rgba(6,6,6,.5), #060606); }
  .gig-img { width: 100%; height: 180px; object-fit: cover; border-radius: 10px 10px 0 0; filter: brightness(0.75) saturate(0.85); }
  .creator-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #3a2a0d, #c8953a); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #060606; flex-shrink: 0; }
  .connect-btn { background: none; border: 1px solid #1a1a1a; border-radius: 6px; padding: 7px 14px; color: #7a7068; font-size: 12px; cursor: pointer; transition: all .2s; width: 100%; }
  .connect-btn:hover { border-color: #3a2a0d; color: #c8953a; }
  .loading-bar { height: 1px; background: #1a1a1a; overflow: hidden; border-radius: 1px; }
  .loading-bar-fill { height: 100%; width: 30%; background: #c8953a; animation: scanline 1.8s ease-in-out infinite; }
`;

const SCAN_MSGS = [
  "scanning live promo sources...",
  "checking airline newsletters...",
  "hunting reddit deal threads...",
  "cross-referencing booking windows...",
  "analyzing fare volatility...",
  "building your escape plan...",
];

const GIG_SCAN_MSGS = [
  "scanning instagram for creator calls...",
  "checking facebook groups...",
  "searching threads posts...",
  "scanning reddit r/forhire...",
  "pulling twitter opportunities...",
  "aggregating live gig listings...",
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
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setScanIdx(i => (i + 1) % SCAN_MSGS.length), 2800);
    return () => clearInterval(t);
  }, [loading]);

  const hunt = async () => {
    if (!from.trim() || !to.trim()) return;
    setLoading(true); setResults(null); setError(false); setScanIdx(0);
    const data = await API(
      [{ role: "user", content: `Find the absolute best deals and ALL currently active promo codes for: ${from.trim().toUpperCase()} → ${to.trim().toUpperCase()}${dates ? `, around ${dates}` : ""}${flexible ? " (flexible ±3 days)" : ""}. Search aggressively for every working code. Include airline-direct codes, OTA codes (Expedia, Kayak, Priceline), credit card portal offers, any current airline sale codes.` }],
      `You are an elite travel deal hunter. Search the web aggressively for currently active promo codes. Return ONLY raw JSON, no markdown, no explanation:
{"codes":[{"code":"string","airline":"string","discount":"string","expires":"string or null","confidence":"high|medium|low","source":"string","howToUse":"string"}],"strategies":[{"tactic":"string","savings":"string","explanation":"string","risk":"low|medium|high","steps":["string"]}],"fareIntel":{"assessment":"overpriced|fair|good|excellent","context":"string","bestBookingWindow":"string","cheapestDays":["string"]},"ghostRoutes":[{"route":"string","savings":"string","reason":"string"}],"godMode":{"title":"string","description":"string","expectedSavings":"string"}}
Find 5-8 real active codes. Be specific about which airlines/OTAs they apply to.`,
      true
    );
    if (data) { setResults(data); } else { setError(true); }
    setLoading(false);
  };

  const copy = code => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      {/* Hero */}
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

      {/* Search */}
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

        {/* Loading state */}
        {loading && (
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[0,1,2].map(i => <div key={i} className="dot-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#c8953a", animationDelay: `${i*.25}s` }} />)}
            </div>
            <div key={scanIdx} className="fade-up mono" style={{ fontSize: 11, color: "#4a4540", letterSpacing: ".08em" }}>{SCAN_MSGS[scanIdx]}</div>
            <div style={{ width: 200 }} className="loading-bar"><div className="loading-bar-fill" /></div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <p className="mono" style={{ fontSize: 11, color: "#c06060" }}>hunt failed. try again.</p>
            <button onClick={() => setError(false)} style={{ marginTop: 12, background: "none", border: "1px solid #1a1a1a", borderRadius: 6, padding: "6px 14px", color: "#4a4540", fontSize: 12, cursor: "pointer" }}>retry</button>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div className="fade-up" style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Route header */}
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: ".3em", color: "#3a2a0d", marginBottom: 6 }}>results for</div>
              <h2 className="serif" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#e4dbd0", fontWeight: 400, letterSpacing: "-.02em" }}>
                {from.trim().toUpperCase()} <span style={{ color: "#c8953a" }}>→</span> {to.trim().toUpperCase()}
              </h2>
            </div>

            {/* God Mode */}
            {results.godMode && (
              <div>
                <div className="section-label"><span>best single move</span><div /></div>
                <div style={{ background: "#09080a", border: "1px solid #241c0d", borderRadius: 12, padding: 22 }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: ".25em", color: "#7a5a1f", marginBottom: 8 }}>god mode</div>
                  <div className="serif" style={{ fontSize: "1.3rem", color: "#e4dbd0", marginBottom: 10, lineHeight: 1.35 }}>{results.godMode.title}</div>
                  <p style={{ fontSize: 13, color: "#7a7068", lineHeight: 1.75, marginBottom: 14 }}>{results.godMode.description}</p>
                  <span className="mono" style={{ fontSize: 12, color: "#c8953a", background: "#130f05", border: "1px solid #241c0d", borderRadius: 4, padding: "4px 10px" }}>
                    est. savings: {results.godMode.expectedSavings}
                  </span>
                </div>
              </div>
            )}

            {/* Promo Codes */}
            {results.codes?.length > 0 && (
              <div>
                <div className="section-label"><span>active codes</span><div /></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                  {results.codes.map((c, i) => (
                    <div key={i} className="card" style={{ padding: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: "#e4dbd0", letterSpacing: ".08em" }}>{c.code}</span>
                        <button className="copy-btn" onClick={() => copy(c.code)}>{copied === c.code ? "✓" : "copy"}</button>
                      </div>
                      <div style={{ fontSize: 11, color: "#3a2a0d", marginBottom: 4 }}>{c.airline}</div>
                      <div style={{ fontSize: 18, color: "#c8953a", fontWeight: 600, marginBottom: 8 }}>{c.discount}</div>
                      <p style={{ fontSize: 11, color: "#4a4030", lineHeight: 1.5, marginBottom: 10 }}>{c.howToUse}</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span className="mono" style={{ fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase" }}
                          className={`mono conf-${c.confidence}`}>● {c.confidence}</span>
                        {c.expires && <span className="mono" style={{ fontSize: 9, color: "#3a3028", letterSpacing: ".08em" }}>exp {c.expires}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategies */}
            {results.strategies?.length > 0 && (
              <div>
                <div className="section-label"><span>booking tactics</span><div /></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {results.strategies.map((s, i) => (
                    <div key={i} className="card" style={{ padding: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 12 }}>
                        <span style={{ fontSize: 15, color: "#d4cfc8", fontWeight: 500 }}>{s.tactic}</span>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                          <span className="mono" style={{ fontSize: 12, color: "#c8953a" }}>{s.savings}</span>
                          <span className={`pill risk-${s.risk}`} style={{ fontSize: 9, letterSpacing: ".1em" }}>{s.risk}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: "#7a7068", lineHeight: 1.7, marginBottom: 10 }}>{s.explanation}</p>
                      {s.steps?.length > 0 && (
                        <ol style={{ listStyle: "none", borderTop: "1px solid #141414", paddingTop: 10 }}>
                          {s.steps.map((step, j) => (
                            <li key={j} style={{ display: "flex", gap: 10, fontSize: 11, color: "#4a4030", padding: "3px 0", lineHeight: 1.55 }}>
                              <span className="mono" style={{ color: "#3a2a0d", flexShrink: 0 }}>{String(j+1).padStart(2,"0")}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fare Intel + Ghost Routes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {results.fareIntel && (
                <div>
                  <div className="section-label"><span>fare intel</span><div /></div>
                  <div className="card" style={{ padding: 20 }}>
                    <div className={`serif assess-${results.fareIntel.assessment}`} style={{ fontSize: "2rem", marginBottom: 6, textTransform: "capitalize" }}>
                      {results.fareIntel.assessment}
                    </div>
                    <p style={{ fontSize: 12, color: "#7a7068", lineHeight: 1.7, marginBottom: 14 }}>{results.fareIntel.context}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div>
                        <div className="mono" style={{ fontSize: 9, letterSpacing: ".2em", color: "#3a3028", marginBottom: 3 }}>BEST WINDOW</div>
                        <div style={{ fontSize: 12, color: "#d4cfc8" }}>{results.fareIntel.bestBookingWindow}</div>
                      </div>
                      {results.fareIntel.cheapestDays?.length > 0 && (
                        <div>
                          <div className="mono" style={{ fontSize: 9, letterSpacing: ".2em", color: "#3a3028", marginBottom: 3 }}>CHEAPEST DAYS</div>
                          <div style={{ fontSize: 12, color: "#d4cfc8" }}>{results.fareIntel.cheapestDays.join(", ")}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {results.ghostRoutes?.length > 0 && (
                <div>
                  <div className="section-label"><span>ghost routes</span><div /></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {results.ghostRoutes.map((r, i) => (
                      <div key={i} className="card" style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span className="mono" style={{ fontSize: 12, color: "#d4cfc8", letterSpacing: ".04em" }}>{r.route}</span>
                          <span className="mono" style={{ fontSize: 12, color: "#c8953a", flexShrink: 0, marginLeft: 8 }}>{r.savings}</span>
                        </div>
                        <p style={{ fontSize: 11, color: "#4a4030", lineHeight: 1.5 }}>{r.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer note */}
            <div className="mono" style={{ borderTop: "1px solid #141414", paddingTop: 16, fontSize: 9, letterSpacing: ".05em", color: "#2a2520", lineHeight: 1.7 }}>
              codes sourced from live web — always verify before checkout. hidden city ticketing violates most airline ToS; use at your own risk. prices fluctuate constantly.
            </div>

            {/* Reset */}
            <button onClick={() => setResults(null)} style={{ background: "none", border: "none", color: "#3a3028", fontSize: 11, cursor: "pointer", letterSpacing: ".15em", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", alignSelf: "flex-start" }}>
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
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [scanIdx, setScanIdx] = useState(0);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setScanIdx(i => (i + 1) % GIG_SCAN_MSGS.length), 2500);
    return () => clearInterval(t);
  }, [loading]);

  const findGigs = async () => {
    setLoading(true); setGigs([]); setScanIdx(0); setSearched(true);
    const data = await API(
      [{ role: "user", content: `Find creator gigs and job opportunities${query ? ` for: ${query}` : " in travel/lifestyle photography and videography"}. Search Instagram, Facebook groups, Threads, Reddit r/forhire, Twitter/X for people looking to hire photographers, videographers, UGC creators, filmmakers, content creators. Find 8-10 real opportunities that are recently posted.` }],
      `You are a creator gig aggregator. Search social platforms and job boards for creator opportunities. Return ONLY raw JSON:
{"gigs":[{"id":number,"title":"string","poster":"string","pay":"string","location":"string","type":"Photography|Videography|UGC|Filmmaking|Content","platform":"Instagram|Facebook|Threads|Reddit|Twitter|LinkedIn","posted":"string","description":"string","requirements":"string","contact":"string or null"}]}
Find 8-10 varied gigs. Include platform source. Be specific about pay ranges. Mix remote and location-based.`,
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

  const filteredGigs = filter === "all" ? gigs : gigs.filter(g => g.type === filter || g.platform === filter);
  const TYPES = ["all", "Photography", "Videography", "UGC", "Filmmaking"];
  const PLATFORMS = ["Instagram", "Facebook", "Threads", "Reddit", "Twitter"];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 64px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: ".3em", color: "#3a2a0d", marginBottom: 8 }}>creator economy</div>
        <h2 className="serif" style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "#e4dbd0", fontWeight: 400, letterSpacing: "-.02em", marginBottom: 8 }}>
          gig finder
        </h2>
        <p style={{ fontSize: 13, color: "#4a4540" }}>live opportunities from instagram, facebook, threads, reddit, twitter — all in one place</p>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && findGigs()} placeholder="travel photography, UGC, documentary, Asia-based, remote..." style={{ flex: 1 }} />
          <button className="hunt-btn" onClick={findGigs} disabled={loading} style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
            {loading ? "scanning..." : "find gigs"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "40px 0" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[0,1,2].map(i => <div key={i} className="dot-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#c8953a", animationDelay: `${i*.25}s` }} />)}
          </div>
          <div key={scanIdx} className="fade-up mono" style={{ fontSize: 11, color: "#4a4540", letterSpacing: ".08em" }}>{GIG_SCAN_MSGS[scanIdx]}</div>
          <div style={{ width: 200 }} className="loading-bar"><div className="loading-bar-fill" /></div>
        </div>
      )}

      {/* Filters */}
      {gigs.length > 0 && !loading && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
          {TYPES.map(f => (
            <button key={f} onClick={() => setFilter(f)} className="mono" style={{
              background: filter === f ? "rgba(200,149,58,.12)" : "none",
              border: `1px solid ${filter === f ? "rgba(200,149,58,.3)" : "#1a1a1a"}`,
              borderRadius: 5, padding: "5px 12px",
              color: filter === f ? "#c8953a" : "#4a4540",
              fontSize: 10, letterSpacing: ".15em", cursor: "pointer",
              textTransform: "uppercase"
            }}>{f}</button>
          ))}
          <div style={{ width: 1, background: "#1a1a1a", margin: "0 4px" }} />
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setFilter(p)} className="mono" style={{
              background: filter === p ? "rgba(200,149,58,.12)" : "none",
              border: `1px solid ${filter === p ? "rgba(200,149,58,.3)" : "#1a1a1a"}`,
              borderRadius: 5, padding: "5px 12px",
              color: filter === p ? "#c8953a" : "#4a4540",
              fontSize: 10, letterSpacing: ".15em", cursor: "pointer",
              textTransform: "uppercase"
            }}>{p}</button>
          ))}
        </div>
      )}

      {/* Gig Grid */}
      {filteredGigs.length > 0 && (
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {filteredGigs.map((gig, i) => (
            <div key={gig.id} className="card" style={{ overflow: "hidden" }}>
              <img src={GIG_IMGS[i % GIG_IMGS.length]} alt="" className="gig-img" />
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 9, letterSpacing: ".15em", marginBottom: 4 }}
                      style={{ color: PLATFORM_COLORS[gig.platform] || "#c8953a", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: ".15em", marginBottom: 4 }}>
                      {gig.platform} · {gig.posted}
                    </div>
                    <h3 style={{ fontSize: 14, color: "#d4cfc8", fontWeight: 500, lineHeight: 1.35 }}>{gig.title}</h3>
                  </div>
                  <button onClick={() => toggleSave(gig)} className="save-btn" style={{ marginTop: 2 }}
                    className={`save-btn ${isSaved(gig.id) ? "saved" : "unsaved"}`}>
                    {isSaved(gig.id) ? "♥" : "♡"}
                  </button>
                </div>
                <div style={{ fontSize: 12, color: "#7a7068", marginBottom: 4 }}>by {gig.poster}</div>
                <p style={{ fontSize: 12, color: "#4a4540", lineHeight: 1.6, marginBottom: 12 }}>{gig.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#4a4030" }}>📍 {gig.location}</span>
                  <span className="mono" style={{ fontSize: 13, color: "#c8953a", fontWeight: 600 }}>{gig.pay}</span>
                </div>
                <span className={`pill`} style={{
                  background: "rgba(200,149,58,.08)", color: "#7a5a1f",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: ".12em",
                  textTransform: "uppercase", padding: "3px 8px", borderRadius: 3
                }}>{gig.type}</span>
                {gig.requirements && (
                  <p style={{ fontSize: 11, color: "#3a3028", lineHeight: 1.5, marginTop: 10 }}>↳ {gig.requirements}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !gigs.length && searched && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <p className="mono" style={{ fontSize: 11, color: "#3a3028" }}>no gigs found. try a different search.</p>
        </div>
      )}

      {/* Saved Gigs */}
      {savedGigs.length > 0 && (
        <div style={{ marginTop: 48, borderTop: "1px solid #141414", paddingTop: 40 }}>
          <div className="section-label"><span>saved gigs ({savedGigs.length})</span><div /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {savedGigs.map(gig => (
              <div key={gig.id} className="card" style={{ padding: "14px 16px", borderColor: "#241c0d" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 13, color: "#d4cfc8", marginBottom: 4, lineHeight: 1.3 }}>{gig.title}</h3>
                    <span className="mono" style={{ fontSize: 12, color: "#c8953a" }}>{gig.pay}</span>
                  </div>
                  <button onClick={() => toggleSave(gig)} style={{ background: "none", border: "1px solid #3a1010", borderRadius: 5, padding: "4px 8px", color: "#c05050", fontSize: 11, cursor: "pointer" }}>×</button>
                </div>
                <p style={{ fontSize: 11, color: "#4a4030", marginTop: 8 }}>{gig.location}</p>
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
        <div className="mono" style={{ fontSize: 10, letterSpacing: ".3em", color: "#3a2a0d", marginBottom: 8 }}>who's out there</div>
        <h2 className="serif" style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "#e4dbd0", fontWeight: 400, letterSpacing: "-.02em", marginBottom: 8 }}>
          creator network
        </h2>
        <p style={{ fontSize: 13, color: "#4a4540" }}>photographers, videographers, ugc creators, filmmakers — globally</p>
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
                <span key={tag} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 3, padding: "2px 7px", fontSize: 9, color: "#4a4030", fontFamily: "'JetBrains Mono', monospace", letterSpacing: ".08em" }}>
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
        <div style={{ marginTop: 40, borderTop: "1px solid #141414", paddingTop: 28 }}>
          <div className="section-label"><span>your connections ({connected.length})</span><div /></div>
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