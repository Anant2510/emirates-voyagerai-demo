import { useState, useEffect, useRef } from "react";

/* ═══ EMIRATES BRAND TOKENS ═══ */
const E = {
  gold: "#C5973A",
  goldLight: "#E8C97A",
  goldDark: "#8B6420",
  goldGlow: "rgba(197,151,58,.15)",
  goldSoft: "#FBF6EC",
  red: "#C8102E",
  redDark: "#8B0B1F",
  redSoft: "#FDF0F2",
  redGlow: "rgba(200,16,46,.12)",
  ink: "#0D0D0D",
  charcoal: "#1A1A2E",
  slate: "#3D3D4E",
  mid: "#6B6B7B",
  pale: "#9A9AAA",
  faint: "#D4D4DC",
  mist: "#EAEAF0",
  snow: "#F8F8FB",
  white: "#FFFFFF",
  glass: "rgba(255,255,255,.88)",
  green: "#1A7A3C",
  greenSoft: "#EAF5EE",
  teal: "#0B6B8A",
  tealSoft: "#E6F3F8",
  purple: "#5A3A8A",
  purpleSoft: "#F0EAF8",
  amber: "#C87810",
  amberSoft: "#FEF7E6",
};

const DOMAIN = {
  emirates: { label: "Emirates.com", color: E.red, bg: E.redSoft, icon: "✈️" },
  cdp: { label: "VoyagerAI CDP", color: E.gold, bg: E.goldSoft, icon: "⚡" },
  google: { label: "Google / Meta Ads", color: "#1A73E8", bg: "#E8F0FE", icon: "🔵" },
  email: { label: "Email", color: E.purple, bg: E.purpleSoft, icon: "📧" },
  social: { label: "Instagram/Social", color: "#E1306C", bg: "#FCE4EC", icon: "📱" },
  sms: { label: "SMS", color: E.teal, bg: E.tealSoft, icon: "💬" },
  jo: { label: "Journey Orchestrator", color: E.amber, bg: E.amberSoft, icon: "🔄" },
  pss: { label: "Sabre/Amadeus PSS", color: E.green, bg: E.greenSoft, icon: "🛫" },
};

const TRAVELLER = {
  name: "Aisha Al-Rashidi",
  email: "aisha.rashidi@gmail.com",
  phone: "+971 50 234 5678",
  city: "Dubai",
  country: "UAE",
  age: 34,
  tier: "Prospect (New-to-Emirates)",
  segment: "High-Value Prospect",
  intent: "Business class to London Heathrow",
  route: "DXB → LHR",
  travelDate: "Q1 2026",
  pricePoint: "AED 18,500",
  propensity: 87,
  ltv: "AED 240,000+",
  churnRisk: "Low",
  ancillaryScore: 92,
};

/* ═══ SHARED COMPONENTS ═══ */
function Glass({ children, style: s = {}, highlight, borderColor }) {
  return (
    <div style={{
      background: highlight ? "rgba(255,255,255,.95)" : E.glass,
      backdropFilter: "blur(20px)",
      borderRadius: 16,
      border: `1px solid ${borderColor || (highlight ? E.gold + "40" : E.mist)}`,
      boxShadow: highlight ? `0 4px 28px ${E.goldGlow}` : "0 1px 8px rgba(0,0,0,.04)",
      ...s
    }}>{children}</div>
  );
}

function DBadge({ domain }) {
  const d = DOMAIN[domain];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: d.bg, border: `1px solid ${d.color}30`,
      borderRadius: 20, padding: "3px 10px",
      fontSize: 9.5, fontFamily: "JBM", fontWeight: 700, color: d.color
    }}>{d.icon} {d.label}</span>
  );
}

function TZone({ domain, children, active = true }) {
  const d = DOMAIN[domain];
  return (
    <div style={{
      border: `1.5px dashed ${active ? d.color + "50" : E.mist}`,
      borderRadius: 14, padding: "14px 14px 10px",
      position: "relative",
      background: active ? `${d.bg}50` : "transparent",
      opacity: active ? 1 : .4
    }}>
      <div style={{ position: "absolute", top: -9, left: 14 }}><DBadge domain={domain} /></div>
      {!active && <div style={{ position: "absolute", top: -9, right: 14, fontSize: 8.5, fontFamily: "JBM", color: E.pale, background: E.snow, padding: "2px 7px", borderRadius: 6, border: `1px solid ${E.mist}` }}>NO VISIBILITY</div>}
      <div style={{ marginTop: 6 }}>{children}</div>
    </div>
  );
}

function Chrome({ url, children }) {
  return (
    <Glass style={{ overflow: "hidden" }}>
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 9, borderBottom: `1px solid ${E.mist}`, background: "rgba(255,255,255,.5)" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {[E.red, "#f5a623", "#7ed321"].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ flex: 1, background: E.snow, borderRadius: 7, padding: "4px 12px", fontSize: 10.5, color: E.pale, fontFamily: "JBM", border: `1px solid ${E.mist}` }}>{url}</div>
      </div>
      <div style={{ minHeight: 240 }}>{children}</div>
    </Glass>
  );
}

function Btn({ onClick, children, color = E.gold, outline, full, style: s = {} }) {
  return (
    <button onClick={onClick} style={{
      border: outline ? `1.5px solid ${color}` : "none",
      background: outline ? "transparent" : `linear-gradient(135deg, ${color}, ${color}DD)`,
      color: outline ? color : "#fff",
      padding: "9px 24px", borderRadius: 10,
      fontWeight: 700, cursor: "pointer", fontSize: 12,
      fontFamily: "Cinzel, serif", width: full ? "100%" : "auto",
      boxShadow: !outline ? `0 3px 16px ${color}35` : "none",
      transition: "all .2s", letterSpacing: .5, ...s
    }}>{children}</button>
  );
}

function Tag({ children, color = E.gold }) {
  return <span style={{ background: `${color}12`, border: `1px solid ${color}35`, borderRadius: 20, padding: "2px 10px", fontSize: 9, color, fontWeight: 700, fontFamily: "JBM" }}>{children}</span>;
}

function DayBanner({ day, desc, color = E.gold }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 16px", background: `${color}0A`, border: `1.5px solid ${color}30`, borderRadius: 12 }}>
      <div style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)`, color: color === E.gold ? E.charcoal : "#fff", padding: "4px 14px", borderRadius: 8, fontWeight: 800, fontSize: 12, fontFamily: "Cinzel, serif", whiteSpace: "nowrap" }}>{day}</div>
      <div style={{ fontSize: 12, color: E.slate, fontFamily: "Outfit, sans-serif" }}>{desc}</div>
    </div>
  );
}

function PropensityGauge({ score, width = 200 }) {
  const color = score > 80 ? E.green : score > 60 ? E.gold : E.red;
  const pct = score / 100;
  return (
    <div style={{ width, textAlign: "center" }}>
      <div style={{ position: "relative", height: 14, background: E.mist, borderRadius: 7, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct * 100}%`, background: `linear-gradient(90deg, ${E.red}, ${E.gold}, ${E.green})`, borderRadius: 7, transition: "width 1s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 8, color: E.pale, fontFamily: "JBM" }}>0%</span>
        <span style={{ fontSize: 14, color, fontWeight: 700, fontFamily: "Cinzel, serif" }}>{score}% conversion propensity</span>
        <span style={{ fontSize: 8, color: E.pale, fontFamily: "JBM" }}>100%</span>
      </div>
    </div>
  );
}

/* ═══ CDP LIVE EVENT PANEL ═══ */
function CDPPanel({ events }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [events]);
  return (
    <Glass highlight style={{ padding: 14, maxHeight: 560, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: E.gold, boxShadow: `0 0 8px ${E.gold}80`, animation: "blink2 2s ease infinite" }} />
        <span style={{ fontFamily: "JBM", fontSize: 9.5, color: E.goldDark, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>VoyagerAI Event Stream</span>
      </div>
      <div style={{ marginBottom: 8, padding: "6px 10px", background: E.goldSoft, borderRadius: 8, border: `1px solid ${E.gold}25` }}>
        <div style={{ fontSize: 8.5, fontFamily: "JBM", color: E.goldDark, fontWeight: 700 }}>CDP POWERED BY VOYAGERAI</div>
        <div style={{ fontSize: 9, color: E.mid, marginTop: 1 }}>Sabre/Amadeus PSS · Identity Stitching · Propensity AI</div>
      </div>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        {events.map((e, i) => (
          <div key={i} style={{ padding: "6px 10px", borderRadius: 9, background: E.snow, border: `1px solid ${E.mist}`, borderLeft: `3px solid ${e.color || E.gold}`, animation: "slideUp .35s cubic-bezier(.16,1,.3,1) both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 1 }}>
              <span style={{ fontSize: 8, fontFamily: "JBM", fontWeight: 700, color: e.color || E.gold, textTransform: "uppercase" }}>{e.type}</span>
              {e.domain && <span style={{ fontSize: 7, fontFamily: "JBM", color: DOMAIN[e.domain]?.color, background: DOMAIN[e.domain]?.bg, padding: "0px 4px", borderRadius: 5, fontWeight: 600 }}>{DOMAIN[e.domain]?.icon}</span>}
            </div>
            <div style={{ fontSize: 10, color: E.slate, lineHeight: 1.3 }}>{e.detail}</div>
            <div style={{ fontSize: 7.5, color: E.pale, fontFamily: "JBM" }}>{e.time}</div>
          </div>
        ))}
        {events.length === 0 && <div style={{ color: E.pale, fontSize: 11, fontStyle: "italic", padding: 14, textAlign: "center" }}>Awaiting activity…</div>}
      </div>
    </Glass>
  );
}

const STEPS = [
  { label: "Emirates Landing", n: "01" },
  { label: "Google Search", n: "02" },
  { label: "Intent Capture + PSS", n: "03" },
  { label: "Identity Stitching", n: "04" },
  { label: "VoyagerAI Profile", n: "05" },
  { label: "RLSA Retarget", n: "06" },
  { label: "Journey Orchestrator", n: "07" },
  { label: "Day 3: Email Nurture", n: "08" },
  { label: "Day 6: Social + SMS", n: "09" },
  { label: "Day 8: Convert", n: "10" },
  { label: "CAC Dashboard", n: "11" },
];

/* ═══ S1: EMIRATES LANDING ═══ */
function S1({ onNext, add }) {
  useEffect(() => {
    add({ type: "PAGE_VIEW", detail: "Anonymous visitor — business class route research", color: E.red, domain: "emirates", time: "Day 0 · 0s" });
    setTimeout(() => add({ type: "COOKIE", detail: "visitor_id: em_4f9a2c (1st-party cookie set)", color: E.red, domain: "emirates", time: "Day 0 · 0.3s" }), 600);
    setTimeout(() => add({ type: "SIGNAL", detail: "Route intent: DXB→LHR · Cabin: Business · Date: Q1 2026", color: E.gold, domain: "cdp", time: "Day 0 · 2.1s" }), 1400);
  }, []);

  return (
    <div>
      <DayBanner day="Day 0" desc="Aisha browses Emirates business class options — anonymous visitor with high intent signals" />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <TZone domain="emirates" active><span style={{ fontSize: 10.5, color: E.slate }}>🍪 Cookie captures route intent — DXB→LHR Business</span></TZone>
        <TZone domain="cdp" active><span style={{ fontSize: 10.5, color: E.slate }}>VoyagerAI captures behavioral signals in real-time</span></TZone>
      </div>
      <Chrome url="https://www.emirates.com/ae/english/book/flights/">
        <div style={{ background: `linear-gradient(160deg, ${E.charcoal} 0%, #0D0820 50%, ${E.redDark} 100%)`, padding: "36px 28px", position: "relative", minHeight: 340 }}>
          {/* Emirates Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 28, height: 28, background: E.red, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✈</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "Cinzel, serif", color: E.white, letterSpacing: 3 }}>EMIRATES</div>
            <div style={{ width: 1, height: 16, background: E.gold + "60" }} />
            <div style={{ fontSize: 10, color: E.goldLight, fontFamily: "JBM", letterSpacing: 1.5 }}>FLY BETTER</div>
          </div>

          <div style={{ animation: "slideUp .6s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ fontSize: 9, color: E.goldLight, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Business Class · First Class</div>
            <h1 style={{ fontSize: 26, lineHeight: 1.2, fontWeight: 700, fontFamily: "Cinzel, serif", margin: 0, color: E.white }}>
              Experience the World<br /><span style={{ color: E.goldLight }}>in Unrivalled Comfort</span>
            </h1>

            {/* Route Search Bar */}
            <div style={{ background: "rgba(255,255,255,.08)", border: `1px solid ${E.gold}30`, borderRadius: 14, padding: "16px 18px", marginTop: 18, backdropFilter: "blur(8px)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr 1fr 1fr", gap: 10, alignItems: "center" }}>
                {[["From", "Dubai (DXB)"], ["→", null], ["To", "London Heathrow (LHR)"], ["Date", "Mar 2026"], ["Class", "Business"]].map(([l, v], i) =>
                  l === "→" ? <div key={i} style={{ textAlign: "center", color: E.gold, fontSize: 18 }}>→</div> : (
                    <div key={i}>
                      <div style={{ fontSize: 7.5, color: E.goldLight, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>{l}</div>
                      <div style={{ fontSize: 13, color: E.white, fontWeight: 600, fontFamily: "Cinzel, serif" }}>{v}</div>
                    </div>
                  )
                )}
              </div>
              <Btn onClick={onNext} style={{ marginTop: 12, background: `linear-gradient(135deg, ${E.gold}, ${E.goldDark})`, color: E.charcoal }}>Search Flights →</Btn>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              {["Lie-flat beds", "Gourmet dining", "Chauffeur-drive", "Lounge access", "Skywards Miles"].map(t => (
                <span key={t} style={{ background: "rgba(255,255,255,.07)", border: `1px solid ${E.gold}25`, borderRadius: 6, padding: "4px 11px", fontSize: 9.5, color: E.goldLight }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Chrome>
    </div>
  );
}

/* ═══ S2: GOOGLE SEARCH ═══ */
function S2({ onNext, add }) {
  const [typed, setTyped] = useState("");
  const full = "emirates business class dubai to london price 2026";

  useEffect(() => {
    add({ type: "SEARCH", detail: "Google search — Emirates has zero cross-site visibility", color: "#1A73E8", domain: "google", time: "Day 0 · 45s" });
    let i = 0;
    const iv = setInterval(() => { i++; setTyped(full.slice(0, i)); if (i >= full.length) clearInterval(iv); }, 38);
    return () => clearInterval(iv);
  }, []);

  return (
    <div>
      <DayBanner day="Day 0" desc="Aisha searches Google after browsing — Emirates loses visibility outside .com" color="#1A73E8" />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <TZone domain="emirates" active={false}><span style={{ fontSize: 10, color: E.pale }}>Cookie cannot track Aisha off emirates.com</span></TZone>
        <TZone domain="google" active><span style={{ fontSize: 10, color: E.slate }}>Google tracks this search via logged-in account</span></TZone>
      </div>
      <Chrome url="https://www.google.com/search?q=emirates+business+class+dubai+london+price+2026">
        <div style={{ background: "#fff", padding: "22px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#4285F4" }}>G</span>
            <div style={{ flex: 1, border: "1.5px solid #E0E0E0", borderRadius: 22, padding: "9px 16px", fontSize: 12.5, color: E.ink, boxShadow: "0 1px 6px rgba(0,0,0,.08)" }}>
              {typed}<span style={{ animation: "blink2 1s step-end infinite", color: "#4285F4" }}>|</span>
            </div>
          </div>

          {/* Sponsored */}
          <div style={{ background: "#FFF8E6", border: `1.5px solid ${E.gold}30`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: 8, background: E.amber, color: "#fff", padding: "2px 7px", borderRadius: 4, fontWeight: 700, fontFamily: "JBM" }}>SPONSORED</span>
              <span style={{ fontSize: 8, background: E.redSoft, color: E.red, padding: "2px 7px", borderRadius: 4, fontWeight: 700, fontFamily: "JBM", border: `1px solid ${E.red}30` }}>VOYAGERAI RLSA · Not yet — awaiting profile</span>
            </div>
            <div style={{ fontSize: 13, color: "#1A0DAB", fontWeight: 600, marginBottom: 3 }}>Emirates Business Class — DXB to LHR</div>
            <div style={{ fontSize: 11, color: "#006621" }}>emirates.com/business-class/dubai-london</div>
            <div style={{ fontSize: 10.5, color: E.mid }}>Lie-flat beds · Gourmet dining · Lounge access · From AED 18,500</div>
          </div>

          {/* Competitor results */}
          {[{ name: "Qatar Airways Business Qsuites", sub: "qatarairways.com", desc: "DXB-DOH-LHR · Award-winning Qsuites · From AED 16,200" },
            { name: "Etihad Business Studio DXB-LHR", sub: "etihad.com", desc: "Direct flights · B787 Business Studio · From AED 17,800" }].map((r, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i === 0 ? `1px solid ${E.mist}` : "none" }}>
              <div style={{ fontSize: 13, color: "#1A0DAB", fontWeight: 600, marginBottom: 2 }}>{r.name}</div>
              <div style={{ fontSize: 10.5, color: "#006621", marginBottom: 2 }}>{r.sub}</div>
              <div style={{ fontSize: 10.5, color: E.mid }}>{r.desc}</div>
            </div>
          ))}

          <div style={{ marginTop: 12, padding: "10px 14px", background: E.redSoft, borderRadius: 8, border: `1px solid ${E.red}20` }}>
            <div style={{ fontSize: 10, fontFamily: "JBM", color: E.red, fontWeight: 700 }}>⚠️ WITHOUT VOYAGERAI: Aisha is lost to competitors. Emirates has no way to retarget her — no identity, no signal.</div>
          </div>
        </div>
      </Chrome>
      <Btn onClick={onNext} style={{ marginTop: 12 }}>Aisha Returns → Intent Capture</Btn>
    </div>
  );
}

/* ═══ S3: INTENT CAPTURE + PSS ENRICHMENT ═══ */
function S3({ onNext, add }) {
  const [phase, setPhase] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const runCapture = () => {
    setPhase(1);
    setTimeout(() => {
      setPhase(2);
      add({ type: "PSS_ENRICH", detail: "VoyagerAI queries Sabre/Amadeus — Aisha has 2 prior EK flights (economy)", color: E.green, domain: "pss", time: "Day 0 · 3m 12s" });
      add({ type: "PROPENSITY", detail: "Business class upgrade propensity: 87% · Ancillary score: 92", color: E.gold, domain: "cdp", time: "Day 0 · 3m 14s" });
      add({ type: "SEGMENT", detail: "Assigned: High-Value Prospect · DXB-LHR Business · Q1 2026", color: E.gold, domain: "cdp", time: "Day 0 · 3m 15s" });
    }, 1800);
  };

  const fillForm = () => {
    setForm({ name: TRAVELLER.name, email: TRAVELLER.email, phone: TRAVELLER.phone });
    setPhase(3);
    add({ type: "LEAD_CAPTURED", detail: `Lead: ${TRAVELLER.email} · Route: DXB→LHR Business · AED 18,500`, color: E.red, domain: "emirates", time: "Day 0 · 4m 05s" });
    setTimeout(() => add({ type: "CDP_INGEST", detail: "Cookie + email + PSS history + propensity → VoyagerAI CDP", color: E.gold, domain: "cdp", time: "Day 0 · 4m 05.5s" }), 600);
  };

  return (
    <div>
      <DayBanner day="Day 0" desc="Aisha engages with a personalised offer — VoyagerAI enriches with PSS data in real-time" />
      <TZone domain="pss" active><span style={{ fontSize: 10, color: E.slate }}>Sabre/Amadeus PSS: Aisha's prior booking history unlocked via VoyagerAI prebuilt connectors</span></TZone>
      <div style={{ marginTop: 12 }}>
        <Chrome url="https://www.emirates.com/ae/english/business-class-offer">
          <div style={{ padding: "24px 22px", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 24, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${E.gold}, ${E.red})` }} />
              <span style={{ fontSize: 10, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Exclusive Business Class Offer</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[["Route", "Dubai → London Heathrow"], ["Cabin", "Business Class"], ["Depart", "March 2026"], ["Price From", "AED 18,500"]].map(([k, v]) => (
                <div key={k} style={{ padding: "8px 12px", background: E.snow, borderRadius: 8, border: `1px solid ${E.mist}` }}>
                  <div style={{ fontSize: 8, fontFamily: "JBM", color: E.pale, textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: E.ink, marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>

            {phase === 0 && <Btn onClick={runCapture} color={E.gold} style={{ fontSize: 11, color: E.charcoal }}>▶ Unlock Exclusive Rate — Enter Details</Btn>}
            {phase === 1 && <div style={{ padding: 16, textAlign: "center", color: E.gold }}><div style={{ fontSize: 13, animation: "blink2 .8s ease infinite" }}>⚡ VoyagerAI querying PSS + enriching profile…</div></div>}

            {phase >= 2 && (
              <div style={{ animation: "slideUp .4s ease" }}>
                {/* PSS + Propensity Results */}
                <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <div style={{ flex: 1, background: E.greenSoft, border: `1.5px solid ${E.green}30`, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: "JBM", color: E.green, fontWeight: 700, marginBottom: 8 }}>🛫 PSS ENRICHMENT (SABRE)</div>
                    {[["Prior EK Flights", "2 (Economy)"], ["Skywards #", "EK-PROSPECT"], ["Preferred Route", "DXB-LHR"], ["LTV Estimate", "AED 240K+"]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px solid ${E.green}15` }}>
                        <span style={{ fontSize: 9, fontFamily: "JBM", color: E.mid }}>{k}</span>
                        <span style={{ fontSize: 9.5, fontWeight: 600, color: E.ink }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ flex: 1, background: E.goldSoft, border: `1.5px solid ${E.gold}40`, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, marginBottom: 8 }}>⚡ VOYAGERAI PROPENSITY</div>
                    <PropensityGauge score={TRAVELLER.propensity} width={160} />
                    <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                      <Tag color={E.green}>High LTV</Tag>
                      <Tag color={E.gold}>Upgrade Likely</Tag>
                      <Tag color={E.teal}>Ancillary Score: 92</Tag>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[["Full Name", "name"], ["Email", "email"], ["Phone", "phone"]].map(([l, k]) => (
                    <div key={k}>
                      <label style={{ fontSize: 8.5, color: E.pale, fontWeight: 700, textTransform: "uppercase", fontFamily: "JBM" }}>{l}</label>
                      <div style={{ marginTop: 3, padding: "7px 10px", borderRadius: 8, border: `1.5px solid ${form[k] ? E.gold + "60" : E.mist}`, background: form[k] ? E.goldSoft : E.snow, fontSize: 11.5, color: form[k] ? E.ink : E.pale }}>{form[k] || "—"}</div>
                    </div>
                  ))}
                </div>
                {phase === 2 && <Btn onClick={fillForm} style={{ marginTop: 12, color: E.charcoal }}>▶ Simulate Form Submit</Btn>}
                {phase === 3 && <Btn onClick={onNext} style={{ marginTop: 12, color: E.charcoal }}>Continue → Identity Stitching</Btn>}
              </div>
            )}
          </div>
        </Chrome>
      </div>
    </div>
  );
}

/* ═══ S4: IDENTITY STITCHING ═══ */
function S4({ onNext, add }) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => { setP(1); add({ type: "STEP 1", detail: "VoyagerAI links cookie + email + PSS booking history", color: E.green, domain: "cdp", time: "Day 0 · 4m 06s" }); }, 800),
      setTimeout(() => { setP(2); add({ type: "STEP 2", detail: "Email hash uploaded to Google Customer Match", color: "#1A73E8", domain: "google", time: "Day 0 · 4m 07s" }); }, 2200),
      setTimeout(() => { setP(3); add({ type: "STEP 3", detail: "Google matches Aisha's Chrome/Gmail account internally", color: "#1A73E8", domain: "google", time: "Day 0 · 4m 08s" }); }, 3600),
      setTimeout(() => { setP(4); add({ type: "STEP 4", detail: "RLSA audience: ek_biz_prospect_dxb_lhr_highltv", color: "#1A73E8", domain: "google", time: "Day 0 · 4m 09s" }); }, 5000),
      setTimeout(() => { setP(5); add({ type: "STEP 5", detail: "Email hash synced to Meta Custom Audience (IG/FB)", color: "#E1306C", domain: "social", time: "Day 0 · 4m 10s" }); }, 6400),
      setTimeout(() => setP(6), 7600),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const steps = [
    { label: "VoyagerAI CDP", sub: "Cookie + email + PSS history → Unified Guest Profile", icon: "⚡", color: E.gold, active: p >= 1 },
    { label: "Google Customer Match", sub: "Email hash → internal GAID match", icon: "🔵", color: "#1A73E8", active: p >= 2 },
    { label: "Chrome/Gmail ID Matched", sub: "Aisha's Google account identified", icon: "✓", color: E.green, active: p >= 3 },
    { label: "RLSA Audience Created", sub: "ek_biz_prospect_dxb_lhr_highltv", icon: "🎯", color: E.gold, active: p >= 4 },
    { label: "Meta Custom Audience", sub: "Instagram/Facebook · AED 18K+ business class intent", icon: "📱", color: "#E1306C", active: p >= 5 },
  ];

  return (
    <div>
      <DayBanner day="Day 0" desc="How VoyagerAI stitches identity across platforms — email is the universal bridge" color={E.green} />
      <div style={{ background: E.greenSoft, border: `1.5px solid ${E.green}30`, borderRadius: 14, padding: "14px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: E.ink, fontFamily: "Cinzel, serif", marginBottom: 6 }}>🔗 VoyagerAI Identity Resolution</div>
        <div style={{ fontSize: 12, color: E.slate, lineHeight: 1.7 }}>
          The site cookie <code style={{ background: "#fff", padding: "1px 5px", borderRadius: 3, color: E.red, fontSize: 10.5 }}>em_4f9a2c</code> cannot follow Aisha off emirates.com.
          VoyagerAI uploads her email hash to Google & Meta — they match to their internal IDs. <strong>Aisha is now targetable everywhere.</strong>
        </div>
      </div>

      <Glass style={{ padding: 20, marginBottom: 14 }} highlight borderColor={E.gold + "40"}>
        <div style={{ fontSize: 11, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Identity Stitching Pipeline</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: s.active ? 1 : .3, transition: "opacity .6s" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.active ? s.color : E.mist, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, transition: "background .5s", boxShadow: s.active ? `0 2px 12px ${s.color}40` : "none" }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: E.ink }}>{s.label}</div>
                <div style={{ fontSize: 10.5, color: E.mid, fontFamily: "JBM" }}>{s.sub}</div>
              </div>
              {s.active && <span style={{ marginLeft: "auto", fontSize: 9, background: E.greenSoft, color: E.green, fontFamily: "JBM", fontWeight: 700, padding: "2px 9px", borderRadius: 10, border: `1px solid ${E.green}30` }}>✓ MATCHED</span>}
            </div>
          ))}
        </div>
      </Glass>

      {p >= 5 && (
        <div style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}40`, borderRadius: 12, padding: 14, marginBottom: 12, animation: "slideUp .4s ease" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: E.goldDark, fontFamily: "Cinzel, serif" }}>✅ Aisha is now reachable across Google, Instagram & Email — without 3rd-party cookies</div>
          <div style={{ fontSize: 10.5, color: E.mid, marginTop: 4 }}>First-party identity · PSS-enriched profile · 87% conversion propensity · AED 240K LTV signal</div>
        </div>
      )}
      {p >= 6 && <Btn onClick={onNext} style={{ color: E.charcoal }}>View VoyagerAI Profile →</Btn>}
    </div>
  );
}

/* ═══ S5: VOYAGERAI UNIFIED PROFILE ═══ */
function S5({ onNext, add }) {
  useEffect(() => {
    add({ type: "PROFILE_BUILT", detail: "Unified Guest 360 — 6 data sources merged", color: E.gold, domain: "cdp", time: "Day 0 · 4m 15s" });
    add({ type: "MICRO_SEGMENT", detail: "Segment: BPROS-DXB-LHR-Q1-BIZ (Business Prospect)", color: E.gold, domain: "cdp", time: "Day 0 · 4m 16s" });
  }, []);

  const attrs = [
    ["Identity", [["Name", TRAVELLER.name], ["Email", TRAVELLER.email], ["Phone", TRAVELLER.phone], ["City", "Dubai, UAE"]]],
    ["Intent Signals", [["Route", "DXB → LHR"], ["Cabin", "Business Class"], ["Date", "Q1 2026"], ["Price Viewed", "AED 18,500"]]],
    ["PSS History", [["Prior Flights", "2 (Economy)"], ["Skywards Tier", "Blue (Prospect)"], ["Last Flight", "DXB-DEL 2024"], ["Pref. Meal", "Halal"]]],
    ["AI Scores", [["Propensity", "87% (High)"], ["Ancillary", "92/100"], ["Churn Risk", "Low"], ["LTV Estimate", "AED 240K+"]]],
  ];

  return (
    <div>
      <DayBanner day="Day 0" desc="VoyagerAI builds the complete Guest 360 — PSS + behavioral + AI propensity scores" color={E.gold} />

      <Glass style={{ padding: 18, marginBottom: 14 }} highlight>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${E.gold}, ${E.red})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👤</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: E.ink, fontFamily: "Cinzel, serif" }}>{TRAVELLER.name}</div>
            <div style={{ fontSize: 11, color: E.goldDark, fontFamily: "JBM", marginTop: 2 }}>Segment: HIGH-VALUE BUSINESS PROSPECT · DXB→LHR</div>
            <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
              <Tag color={E.green}>LTV: AED 240K+</Tag>
              <Tag color={E.gold}>Propensity: 87%</Tag>
              <Tag color={E.teal}>Ancillary: 92</Tag>
              <Tag color={E.purple}>Q1 2026 Intent</Tag>
            </div>
          </div>
        </div>
        <PropensityGauge score={TRAVELLER.propensity} width={420} />
      </Glass>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {attrs.map(([title, rows]) => (
          <Glass key={title} style={{ padding: 14 }}>
            <div style={{ fontSize: 8.5, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, color: E.goldDark, marginBottom: 8 }}>{title}</div>
            {rows.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px solid ${E.mist}` }}>
                <span style={{ fontSize: 9.5, fontFamily: "JBM", color: E.pale }}>{k}</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: E.ink }}>{v}</span>
              </div>
            ))}
          </Glass>
        ))}
      </div>

      <div style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}40`, borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontFamily: "JBM", color: E.goldDark, fontWeight: 700 }}>⚡ VoyagerAI ADVANTAGE: 60% faster profile build vs. manual modelling · Prebuilt Sabre/Amadeus connectors · AI propensity scoring ready to activate</div>
      </div>

      <Btn onClick={onNext} style={{ color: E.charcoal }}>Activate RLSA Retargeting →</Btn>
    </div>
  );
}

/* ═══ S6: RLSA RETARGETING ═══ */
function S6({ onNext, add }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    add({ type: "RLSA_ACTIVE", detail: "ek_biz_prospect_dxb_lhr_highltv audience activated on Google", color: "#1A73E8", domain: "google", time: "Day 1 · 09:14" });
    setTimeout(() => {
      setShown(true);
      add({ type: "AD_IMPRESSION", detail: "Personalised ad served — Business Class DXB→LHR · AED 18,500", color: "#1A73E8", domain: "google", time: "Day 1 · 09:15" });
      add({ type: "CTR_SIGNAL", detail: "Click → Return visit — DXB→LHR Business price page", color: E.red, domain: "emirates", time: "Day 1 · 09:16" });
    }, 2000);
  }, []);

  return (
    <div>
      <DayBanner day="Day 1" desc="VoyagerAI activates personalised RLSA ad — Aisha sees Emirates while browsing the web" color="#1A73E8" />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <TZone domain="google" active><span style={{ fontSize: 10, color: E.slate }}>Google RLSA — bid +65% for high-propensity business prospect</span></TZone>
        <TZone domain="cdp" active><span style={{ fontSize: 10, color: E.slate }}>VoyagerAI syncs audience in real-time · No 3rd-party cookies</span></TZone>
      </div>

      <Chrome url="https://www.bbc.com/news/world-middle-east">
        <div style={{ background: "#fff", padding: "20px 18px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: E.ink, marginBottom: 14 }}>BBC News — Middle East</div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
            <div>
              {["UAE-UK Ties Strengthened at Summit", "Dubai Tops Global Business Hub Rankings"].map((h, i) => (
                <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${E.mist}` }}>
                  <div style={{ fontSize: 12.5, color: E.ink, fontWeight: 600, marginBottom: 2 }}>{h}</div>
                  <div style={{ fontSize: 10, color: E.mid }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit…</div>
                </div>
              ))}
            </div>
            <div>
              {/* The Emirates Ad */}
              {shown && (
                <div style={{ animation: "slideUp .5s cubic-bezier(.16,1,.3,1)", background: `linear-gradient(160deg, ${E.charcoal}, ${E.redDark})`, borderRadius: 12, padding: 14, border: `2px solid ${E.gold}50` }}>
                  <div style={{ fontSize: 8, fontFamily: "JBM", color: E.goldLight, marginBottom: 4, letterSpacing: 1 }}>SPONSORED · EMIRATES</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: E.white, fontFamily: "Cinzel, serif", marginBottom: 4 }}>Dubai → London<br /><span style={{ color: E.goldLight }}>Business Class</span></div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", marginBottom: 8 }}>Lie-flat beds · Gourmet dining<br />From <strong style={{ color: E.goldLight }}>AED 18,500</strong></div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ fontSize: 8, background: E.goldSoft, color: E.goldDark, padding: "2px 7px", borderRadius: 10, fontFamily: "JBM", fontWeight: 700 }}>⚡ VoyagerAI PERSONALISED</span>
                  </div>
                  <Btn onClick={onNext} color={E.gold} style={{ fontSize: 10, padding: "6px 14px", color: E.charcoal }}>Book Now →</Btn>
                </div>
              )}
              {!shown && <div style={{ height: 180, background: E.snow, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: E.pale, fontSize: 10, fontFamily: "JBM" }}>Loading ad…</div>}
            </div>
          </div>
        </div>
      </Chrome>

      <div style={{ marginTop: 12, background: E.tealSoft, border: `1.5px solid ${E.teal}30`, borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: E.teal, fontFamily: "JBM" }}>💡 VOYAGERAI: Bid modifier +65% for high-LTV business prospect · Ad copy personalised to DXB→LHR route · CTR uplift vs. generic: +340%</div>
      </div>
    </div>
  );
}

/* ═══ S7: JOURNEY ORCHESTRATOR ═══ */
function S7({ onNext, add }) {
  useEffect(() => {
    add({ type: "JOURNEY_START", detail: "Aisha enters: BPROS-DXB-LHR-BIZ journey flow", color: E.amber, domain: "jo", time: "Day 0 · EOD" });
    add({ type: "CHANNEL_PLAN", detail: "Day 3: Email #1 · Day 6: IG + SMS · Day 8: Urgency email", color: E.amber, domain: "jo", time: "Day 0 · EOD" });
    add({ type: "CONTENT_AI", detail: "GenAI drafts personalised copy: Aisha · Dubai · Business · March", color: E.gold, domain: "cdp", time: "Day 0 · EOD" });
  }, []);

  const journey = [
    { day: "Day 0", event: "Lead captured — form + PSS enrichment + propensity scored", channel: "emirates", status: "done" },
    { day: "Day 0", event: "Identity stitched across Google + Meta · RLSA activated", channel: "cdp", status: "done" },
    { day: "Day 1", event: "RLSA personalised ad served — BBC, CNN, LinkedIn", channel: "google", status: "done" },
    { day: "Day 3", event: "Email #1: 'Your DXB→LHR Business Class Awaits, Aisha'", channel: "email", status: "pending" },
    { day: "Day 6", event: "Instagram: Lie-flat bed creative · SMS: 24hr seat hold offer", channel: "social", status: "pending" },
    { day: "Day 8", event: "Email #2: Urgency — 'Only 3 Business Class seats left'", channel: "email", status: "pending" },
    { day: "Day 8", event: "Convert → suppression across all channels", channel: "jo", status: "pending" },
  ];

  return (
    <div>
      <DayBanner day="Journey Plan" desc="VoyagerAI Journey Orchestrator maps the full multi-channel acquisition journey" color={E.amber} />

      <Glass style={{ padding: 18, marginBottom: 14 }} highlight>
        <div style={{ fontSize: 11, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Orchestrated Journey — Aisha Al-Rashidi</div>
        {journey.map((j, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start", animation: "slideUp .3s cubic-bezier(.16,1,.3,1) both", animationDelay: `${i * .05}s` }}>
            <div style={{ minWidth: 46, fontSize: 8.5, color: E.pale, fontFamily: "JBM", paddingTop: 2 }}>{j.day}</div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: j.status === "done" ? E.green : E.gold, flexShrink: 0, marginTop: 3, boxShadow: j.status === "done" ? `0 0 6px ${E.green}60` : `0 0 6px ${E.gold}60` }} />
            <div style={{ flex: 1, fontSize: 11, color: E.slate }}>{j.event}</div>
            <DBadge domain={j.channel} />
          </div>
        ))}
      </Glass>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[["Channels", "5", E.gold], ["AI Content", "8 variations", E.purple], ["Journey Days", "8", E.teal]].map(([l, v, c]) => (
          <Glass key={l} style={{ padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 8, color: E.mid, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: c, marginTop: 4, fontFamily: "Cinzel, serif" }}>{v}</div>
          </Glass>
        ))}
      </div>

      <Btn onClick={onNext} style={{ color: E.charcoal }}>Day 3: Email Nurture →</Btn>
    </div>
  );
}

/* ═══ S8: EMAIL #1 ═══ */
function S8({ onNext, add }) {
  useEffect(() => {
    add({ type: "EMAIL_SENT", detail: "Email #1: Personalised — 'Aisha, your DXB→LHR Business Class awaits'", color: E.purple, domain: "email", time: "Day 3 · 08:30" });
    setTimeout(() => add({ type: "EMAIL_OPEN", detail: "Open detected · 09:14 · Dubai · iPhone 15 · Open rate: 78%", color: E.purple, domain: "email", time: "Day 3 · 09:14" }), 1500);
    setTimeout(() => add({ type: "NO_CLICK", detail: "No click — Journey Orchestrator schedules social + SMS escalation", color: E.amber, domain: "jo", time: "Day 3 · 09:14" }), 3000);
  }, []);

  return (
    <div>
      <DayBanner day="Day 3" desc="GenAI drafts a personalised email — Aisha's name, route, price, and timing woven in" color={E.purple} />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <TZone domain="email" active><span style={{ fontSize: 10, color: E.slate }}>GenAI creates 1:1 personalised email — 60% faster than manual authoring</span></TZone>
        <TZone domain="jo" active><span style={{ fontSize: 10, color: E.slate }}>Open but no-click → auto-escalate to social + SMS on Day 6</span></TZone>
      </div>

      <Chrome url="Gmail — aisha.rashidi@gmail.com">
        <div style={{ background: "#fff", padding: 0 }}>
          {/* Email Header */}
          <div style={{ background: E.snow, padding: "12px 18px", borderBottom: `1px solid ${E.mist}` }}>
            <div style={{ fontSize: 8, fontFamily: "JBM", color: E.pale, marginBottom: 4 }}>FROM: reservations@emirates.com · TO: aisha.rashidi@gmail.com · Day 3 · 08:30</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: E.ink }}>Aisha, your Dubai → London Business Class seat is waiting ✈️</div>
          </div>
          {/* Email Body */}
          <div style={{ padding: "18px 20px" }}>
            <div style={{ background: `linear-gradient(160deg, ${E.charcoal}, ${E.redDark})`, borderRadius: 12, padding: "20px 22px", marginBottom: 14 }}>
              <div style={{ fontSize: 8, fontFamily: "JBM", color: E.goldLight, letterSpacing: 2, marginBottom: 6 }}>EMIRATES BUSINESS CLASS</div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Cinzel, serif", color: E.white }}>Dubai <span style={{ color: E.goldLight }}>→</span> London</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 4 }}>March 2026 · Business Class · From <strong style={{ color: E.goldLight }}>AED 18,500</strong></div>
            </div>

            <p style={{ fontSize: 12.5, color: E.slate, lineHeight: 1.7, marginBottom: 12 }}>
              <strong>Dear Aisha,</strong><br />
              We noticed you were exploring our Business Class options for your Dubai–London journey in March 2026. We'd love to make that trip exceptional for you.
            </p>

            <div style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}40`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: E.goldDark, marginBottom: 6, fontFamily: "JBM" }}>YOUR EXCLUSIVE OFFER</div>
              {[["Route", "Dubai (DXB) → London Heathrow (LHR)"], ["Cabin", "Business Class · Lie-flat bed"], ["Fare from", "AED 18,500 all-inclusive"], ["Includes", "Chauffeur Drive · Lounge · Halal dining"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10, padding: "3px 0", fontSize: 11 }}>
                  <span style={{ color: E.pale, fontFamily: "JBM", fontSize: 9, minWidth: 60 }}>{k}:</span>
                  <span style={{ color: E.ink, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            <Btn onClick={onNext} style={{ color: E.charcoal }}>Book Aisha's Seat →</Btn>
            <div style={{ marginTop: 14, padding: "8px 12px", background: E.purpleSoft, borderRadius: 8, border: `1px solid ${E.purple}20` }}>
              <div style={{ fontSize: 9.5, fontFamily: "JBM", color: E.purple }}>⚡ GenAI PERSONALISED: Name · Route · Date · Meal preference · Skywards tier · All in 0.3s · 60% faster than manual</div>
            </div>
          </div>
        </div>
      </Chrome>
    </div>
  );
}

/* ═══ S9: DAY 6 SOCIAL + SMS ═══ */
function S9({ onNext, add }) {
  useEffect(() => {
    add({ type: "IG_AD", detail: "Instagram: Lie-flat bed creative · 'Fly Better, Aisha'", color: "#E1306C", domain: "social", time: "Day 6 · 11:30" });
    add({ type: "SMS_SENT", detail: "SMS: 'Aisha, only 4 Business Class seats remain. 24hr hold available.'", color: E.teal, domain: "sms", time: "Day 6 · 12:00" });
    setTimeout(() => add({ type: "SMS_OPEN", detail: "SMS opened in 3 minutes · Response: 'Save my seat'", color: E.teal, domain: "sms", time: "Day 6 · 12:03" }), 2000);
    setTimeout(() => add({ type: "SIGNAL_SPIKE", detail: "High intent signal — CDP triggers Day 8 urgency email early", color: E.gold, domain: "cdp", time: "Day 6 · 12:04" }), 3500);
  }, []);

  return (
    <div>
      <DayBanner day="Day 6" desc="VoyagerAI escalates to Instagram visual + SMS urgency — open but no click on email triggers multi-channel" color="#E1306C" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Instagram */}
        <div>
          <div style={{ fontSize: 9.5, fontFamily: "JBM", color: E.mid, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Instagram · Paid</div>
          <Glass style={{ overflow: "hidden" }}>
            <div style={{ background: "#000", padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #222" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: E.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✈</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "Cinzel, serif" }}>emirates</div>
                <div style={{ fontSize: 8, color: "#888" }}>Sponsored</div>
              </div>
            </div>
            <div style={{ background: `linear-gradient(160deg, ${E.charcoal}, #1A0015, ${E.redDark})`, height: 180, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 28 }}>🛏️</div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "Cinzel, serif", color: E.white, textAlign: "center" }}>Fly Better,<br /><span style={{ color: E.goldLight }}>Aisha</span></div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", fontFamily: "JBM" }}>DUBAI → LONDON · BUSINESS CLASS</div>
            </div>
            <div style={{ background: "#000", padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "#fff", marginBottom: 4 }}><strong style={{ color: E.goldLight }}>AED 18,500</strong> · From Dubai to London in style</div>
              <div style={{ fontSize: 10, color: "#888" }}>Book at emirates.com → Business Class</div>
              <div style={{ marginTop: 8, fontSize: 9.5, fontFamily: "JBM", color: "#E1306C" }}>⚡ VoyagerAI: Name-personalised · Route-targeted · High-LTV audience</div>
            </div>
          </Glass>
        </div>

        {/* SMS */}
        <div>
          <div style={{ fontSize: 9.5, fontFamily: "JBM", color: E.mid, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>SMS · Seat Hold Offer</div>
          <Glass style={{ padding: 14, background: E.snow }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: E.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✈</div>
              <div style={{ background: "#fff", border: `1px solid ${E.mist}`, borderRadius: "0 14px 14px 14px", padding: "10px 12px" }}>
                <div style={{ fontSize: 9, fontFamily: "JBM", color: E.red, fontWeight: 700, marginBottom: 4 }}>EMIRATES · 12:00</div>
                <div style={{ fontSize: 11.5, color: E.ink, lineHeight: 1.6 }}>
                  Dear <strong>Aisha</strong>, only <strong>4 Business Class seats</strong> remain on EK007 DXB→LHR, March 14.<br /><br />
                  Reply <strong>SAVE</strong> to hold your seat for 24hrs. From <strong>AED 18,500</strong>.<br /><br />
                  <span style={{ color: E.pale, fontSize: 10 }}>Reply STOP to opt out.</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "flex-start" }}>
              <div style={{ background: E.teal, borderRadius: "14px 0 14px 14px", padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>SAVE</div>
              </div>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: E.mist, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>👤</div>
            </div>
            <div style={{ marginTop: 10, padding: "7px 10px", background: E.tealSoft, borderRadius: 8, border: `1px solid ${E.teal}25` }}>
              <div style={{ fontSize: 9.5, fontFamily: "JBM", color: E.teal }}>✓ SMS opened in 3 min · Reply "SAVE" detected · High intent signal → VoyagerAI triggers Day 8 urgency early</div>
            </div>
          </Glass>
        </div>
      </div>

      <Btn onClick={onNext} style={{ marginTop: 14, color: E.charcoal }}>Day 8: Conversion →</Btn>
    </div>
  );
}

/* ═══ S10: CONVERSION ═══ */
function S10({ onNext, add }) {
  const [p, setP] = useState(0);

  const doConvert = () => {
    setP(1);
    setTimeout(() => {
      setP(2);
      add({ type: "CONVERTED", detail: "Aisha books EK007 DXB→LHR Business Class · AED 18,500", color: E.green, domain: "emirates", time: "Day 8 · 07:42" });
      add({ type: "SKYWARDS", detail: "Skywards profile created · Tier upgrade journey initiated", color: E.gold, domain: "cdp", time: "Day 8 · 07:43" });
      add({ type: "SUPPRESS", detail: "All acquisition channels suppressed — Aisha is now a customer", color: E.green, domain: "jo", time: "Day 8 · 07:43" });
      add({ type: "CAC_LOG", detail: "CAC: AED 280 vs. traditional AED 1,200 · Saving: 77%", color: E.green, domain: "cdp", time: "Day 8 · 07:43" });
    }, 2000);
  };

  return (
    <div>
      <DayBanner day="Day 8" desc="Aisha converts — VoyagerAI suppresses all channels · CAC logged" color={E.green} />

      <Chrome url="https://www.emirates.com/ae/english/booking/confirmation">
        <div style={{ padding: "24px 22px", background: "#fff" }}>
          {p === 0 && (
            <div>
              <div style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}40`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, marginBottom: 10 }}>⚡ URGENCY EMAIL — Day 8 · From VoyagerAI</div>
                <div style={{ fontSize: 13, color: E.ink, lineHeight: 1.7 }}>
                  <strong>Aisha</strong> — you saved a seat. <strong>Only 3 Business Class seats remain</strong> on EK007 DXB→LHR, March 14.<br />
                  Your 24hr hold expires in <strong style={{ color: E.red }}>4 hours 12 minutes.</strong>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: E.red, fontFamily: "Cinzel, serif" }}>AED 18,500</div>
                  <div style={{ fontSize: 11, color: E.mid }}>Business Class · All-inclusive · Chauffeur drive</div>
                </div>
              </div>
              <Btn onClick={doConvert} style={{ color: E.charcoal }}>▶ Confirm Booking — Aisha Converts</Btn>
            </div>
          )}

          {p === 1 && (
            <div style={{ padding: 24, textAlign: "center", animation: "blink2 .8s ease infinite" }}>
              <div style={{ fontSize: 16, color: E.gold, fontFamily: "Cinzel, serif" }}>⚡ Processing booking…</div>
            </div>
          )}

          {p >= 2 && (
            <div style={{ animation: "slideUp .5s cubic-bezier(.16,1,.3,1)" }}>
              <div style={{ background: E.greenSoft, border: `2px solid ${E.green}40`, borderRadius: 16, padding: "20px 22px", marginBottom: 14, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: E.green, fontFamily: "Cinzel, serif", marginBottom: 4 }}>Booking Confirmed!</div>
                <div style={{ fontSize: 12, color: E.mid }}>EK007 · Dubai → London Heathrow · Business Class</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: E.green, marginTop: 6 }}>AED 18,500 · March 14, 2026</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[["CAC This Journey", "AED 280", E.green], ["Traditional CAC", "AED 1,200", E.red], ["CAC Saving", "77%", E.gold], ["Journey Days", "8 Days", E.teal]].map(([l, v, c]) => (
                  <Glass key={l} style={{ padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: E.mid, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c, marginTop: 4, fontFamily: "Cinzel, serif" }}>{v}</div>
                  </Glass>
                ))}
              </div>

              <div style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}40`, borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontFamily: "JBM", color: E.goldDark, fontWeight: 700 }}>✅ ALL CHANNELS SUPPRESSED · No further acquisition spend on Aisha · Post-booking journey initiated</div>
              </div>

              <Btn onClick={onNext} style={{ color: E.charcoal }}>View CAC Dashboard →</Btn>
            </div>
          )}
        </div>
      </Chrome>
    </div>
  );
}

/* ═══ S11: CAC DASHBOARD ═══ */
function S11({ add }) {
  useEffect(() => {
    add({ type: "COMPLETE", detail: "8 days · 5 channels · Business class prospect → customer · CAC: AED 280", color: E.green, domain: "cdp", time: "Day 8 · EOD" });
  }, []);

  const journey = [
    { day: "Day 0", ev: "Anonymous visit — DXB→LHR Business intent captured", d: "emirates" },
    { day: "Day 0", ev: "Google: 'emirates business class dubai london 2026'", d: "google" },
    { day: "Day 0", ev: "PSS query: 2 prior economy flights · LTV: AED 240K+", d: "pss" },
    { day: "Day 0", ev: "Form captured · VoyagerAI identity stitched across 3 platforms", d: "cdp" },
    { day: "Day 1", ev: "RLSA personalised ad · BBC/LinkedIn · Bid +65%", d: "google" },
    { day: "Day 3", ev: "📧 Email #1: Name-personalised · DXB→LHR · Opened, no click", d: "email" },
    { day: "Day 6", ev: "📱 Instagram: 'Fly Better, Aisha' · SMS: 24hr seat hold", d: "social" },
    { day: "Day 8", ev: "📧 Email #2: Urgency · Seat hold expiry · Converts ✈️", d: "emirates" },
    { day: "Day 8", ev: "ALL channels suppressed ❌ · Skywards journey begins", d: "jo" },
  ];

  return (
    <div style={{ animation: "slideUp .6s cubic-bezier(.16,1,.3,1)" }}>
      <DayBanner day="Summary" desc="Anonymous DXB→LHR business prospect → Emirates customer in 8 days · CAC reduced 77%" color={E.green} />

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[["CAC", "AED 280", E.green], ["vs Traditional", "AED 1,200", E.red], ["Saving", "77%", E.gold], ["LTV Signal", "AED 240K+", E.teal], ["Days", "8", E.purple]].map(([l, v, c]) => (
          <Glass key={l} style={{ padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 7.5, color: E.mid, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: .8 }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: c, marginTop: 3, fontFamily: "Cinzel, serif" }}>{v}</div>
          </Glass>
        ))}
      </div>

      {/* Traveller card */}
      <Glass style={{ padding: 18, marginBottom: 14, display: "flex", gap: 16, alignItems: "center" }} highlight>
        <div style={{ flexShrink: 0 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${E.gold}, ${E.red})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👤</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: E.ink, fontFamily: "Cinzel, serif" }}>{TRAVELLER.name} — Business Class · EK007</div>
          <div style={{ fontSize: 11, color: E.goldDark, fontFamily: "JBM", marginTop: 4 }}>Propensity: {TRAVELLER.propensity}% · LTV: AED 240K+ · PSS-enriched via VoyagerAI/Sabre</div>
          <div style={{ fontSize: 11, color: E.mid, marginTop: 2 }}>2 prior economy flights → first-ever Business Class booking</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            <Tag color={E.green}>Converted ✓</Tag>
            <Tag color={E.gold}>Skywards Blue → Active</Tag>
            <Tag color={E.teal}>CAC: AED 280</Tag>
            <Tag color={E.red}>ROI: 857x</Tag>
          </div>
        </div>
      </Glass>

      {/* Journey Log */}
      <Glass style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ fontFamily: "JBM", fontSize: 9, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, fontWeight: 700, color: E.ink }}>Orchestrated Journey</div>
        {journey.map((j, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, alignItems: "center", animation: "slideUp .3s cubic-bezier(.16,1,.3,1) both", animationDelay: `${i * .04}s` }}>
            <div style={{ minWidth: 46, fontSize: 8.5, color: E.pale, fontFamily: "JBM" }}>{j.day}</div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: DOMAIN[j.d].color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 11, color: E.slate }}>{j.ev}</div>
            <span style={{ fontSize: 7, fontFamily: "JBM", fontWeight: 600, color: DOMAIN[j.d].color, background: DOMAIN[j.d].bg, padding: "1px 5px", borderRadius: 5 }}>{DOMAIN[j.d].icon}</span>
          </div>
        ))}
      </Glass>

      {/* VoyagerAI Advantage */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[["⚡ PSS Connectors", "60% faster data modelling via prebuilt Sabre/Amadeus schemas"], ["🎯 AI Propensity", "87% scoring accuracy · 40% more relevant targeting vs. manual"], ["🔄 GenAI Content", "8 personalised variants in 0.3s · 60% faster than manual authoring"]].map(([t, d]) => (
          <div key={t} style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}35`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: E.goldDark, fontFamily: "Cinzel, serif", marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 10.5, color: E.mid }}>{d}</div>
          </div>
        ))}
      </div>

      {/* Final Summary */}
      <div style={{ background: `linear-gradient(135deg, ${E.charcoal}, ${E.redDark})`, borderRadius: 16, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: E.white, fontFamily: "Cinzel, serif", marginBottom: 4 }}>
          ✈️ Anonymous Prospect → Business Class Customer · 8 Days
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginBottom: 4 }}>
          Cookie → PSS Enrich → Identity Stitched → RLSA → Email → Social/SMS → Urgency → Converted → Suppressed
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
          {[["CAC Reduced", "77%"], ["ROI on Spend", "857x"], ["LTV Signal", "AED 240K+"], ["Journey Days", "8"]].map(([l, v]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: E.goldLight, fontFamily: "Cinzel, serif" }}>{v}</div>
              <div style={{ fontSize: 8.5, color: "rgba(255,255,255,.45)", fontFamily: "JBM", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: "rgba(255,255,255,.35)", fontFamily: "JBM" }}>Powered by VoyagerAI · Sabre/Amadeus PSS · CDP + Journey Orchestrator + GenAI</div>
      </div>
    </div>
  );
}

/* ═══ MAIN APP ═══ */
export default function App() {
  const [step, setStep] = useState(0);
  const [events, setEvents] = useState([]);
  const add = (e) => setEvents(p => [...p, e]);
  const next = () => setStep(p => Math.min(p + 1, STEPS.length - 1));

  const pages = [
    <S1 onNext={next} add={add} />, <S2 onNext={next} add={add} />, <S3 onNext={next} add={add} />,
    <S4 onNext={next} add={add} />, <S5 onNext={next} add={add} />, <S6 onNext={next} add={add} />,
    <S7 onNext={next} add={add} />, <S8 onNext={next} add={add} />, <S9 onNext={next} add={add} />,
    <S10 onNext={next} add={add} />, <S11 add={add} />,
  ];

  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: E.snow, minHeight: "100vh", color: E.ink, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink2{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        *{box-sizing:border-box;margin:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${E.faint};border-radius:4px}
        button:hover{opacity:.88;transform:translateY(-1px)}button:active{transform:translateY(0)}
        code{font-family:JBM,monospace}
        .JBM{font-family:"JetBrains Mono",monospace}
      `}</style>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 15% 5%, ${E.goldGlow}, transparent 65%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 40% at 85% 90%, ${E.redGlow}, transparent 60%)` }} />
        <svg width="100%" height="100%" style={{ position: "absolute", opacity: .025 }}>
          <defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke={E.ink} strokeWidth=".5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
      </div>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 24px", borderBottom: `1px solid ${E.mist}`, background: "rgba(255,255,255,.92)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 24, height: 24, background: E.red, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✈</div>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "Cinzel, serif", color: E.charcoal, letterSpacing: 2 }}>EMIRATES</div>
          </div>
          <div style={{ width: 1, height: 18, background: E.gold + "60" }} />
          <div style={{ fontSize: 11, fontFamily: "JBM", color: E.goldDark, letterSpacing: 1.5, fontWeight: 700 }}>× VoyagerAI</div>
          <span style={{ fontSize: 10, color: E.mid, fontFamily: "Outfit" }}>Customer Acquisition · Low-Cost Lead Conversion Demo</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {step > 0 && <button onClick={() => setStep(p => p - 1)} style={{ background: "transparent", color: E.mid, border: `1px solid ${E.mist}`, padding: "4px 12px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontFamily: "Outfit" }}>←</button>}
          <button onClick={() => { setStep(0); setEvents([]); }} style={{ background: "transparent", color: E.goldDark, border: `1px solid ${E.gold}40`, padding: "4px 12px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontFamily: "Outfit", fontWeight: 600 }}>↺ Reset</button>
        </div>
      </div>

      {/* Step Nav */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 0, padding: "6px 24px", overflowX: "auto", background: "rgba(255,255,255,.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${E.mist}` }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "none", cursor: "pointer", padding: "5px 8px", fontFamily: "Outfit", fontSize: 10, color: i === step ? E.goldDark : i < step ? E.ink : E.pale, fontWeight: i === step ? 700 : 400, whiteSpace: "nowrap", borderBottom: i === step ? `2px solid ${E.gold}` : "2px solid transparent" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 17, height: 17, borderRadius: "50%", fontSize: 7.5, fontFamily: "JBM", fontWeight: 700, background: i === step ? E.gold : i < step ? E.green : E.mist, color: i <= step ? (i === step ? E.charcoal : "#fff") : E.pale, boxShadow: i === step ? `0 0 10px ${E.goldGlow}` : "none" }}>{s.n}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 270px", gap: 14, padding: "12px 24px 40px", alignItems: "start" }}>
        <div key={step} style={{ animation: "slideUp .45s cubic-bezier(.16,1,.3,1)" }}>{pages[step]}</div>
        <CDPPanel events={events} />
      </div>
    </div>
  );
}
