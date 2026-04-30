import { useState, useEffect, useRef } from "react";

/* ═══ EMIRATES BRAND TOKENS ═══ */
const E = {
  gold: "#C5973A", goldLight: "#E8C97A", goldDark: "#8B6420",
  goldGlow: "rgba(197,151,58,.15)", goldSoft: "#FBF6EC",
  red: "#C8102E", redDark: "#8B0B1F", redSoft: "#FDF0F2", redGlow: "rgba(200,16,46,.12)",
  ink: "#0D0D0D", charcoal: "#1A1A2E", slate: "#3D3D4E",
  mid: "#6B6B7B", pale: "#9A9AAA", faint: "#D4D4DC", mist: "#EAEAF0",
  snow: "#F8F8FB", white: "#FFFFFF", glass: "rgba(255,255,255,.88)",
  green: "#1A7A3C", greenSoft: "#EAF5EE",
  teal: "#0B6B8A", tealSoft: "#E6F3F8",
  purple: "#5A3A8A", purpleSoft: "#F0EAF8",
  amber: "#C87810", amberSoft: "#FEF7E6",
};

const DOMAIN = {
  emirates: { label: "Emirates.com", color: E.red, bg: E.redSoft, icon: "✈️" },
  cdp: { label: "VoyagerAI CDP", color: E.gold, bg: E.goldSoft, icon: "⚡" },
  google: { label: "Google Ads", color: "#1A73E8", bg: "#E8F0FE", icon: "🔵" },
  email: { label: "Email", color: E.purple, bg: E.purpleSoft, icon: "📧" },
  social: { label: "LinkedIn / Instagram", color: "#E1306C", bg: "#FCE4EC", icon: "📱" },
  sms: { label: "SMS", color: E.teal, bg: E.tealSoft, icon: "💬" },
  jo: { label: "Journey Orchestrator", color: E.amber, bg: E.amberSoft, icon: "🔄" },
  pss: { label: "Sabre PSS", color: E.green, bg: E.greenSoft, icon: "🛫" },
};

/*
  STORY: Aisha Al-Rashidi — Partner at Al Tamimi & Company (Middle East's largest law firm).
  
  THE EMOTIONAL HOOK — ONE FLIGHT, ONE PITCH, ONE WIN:
  Six months ago she flew economy DXB→LHR for a major pitch. Red-eye. Arrived exhausted. 
  Stumbled through the opening. Lost a £2M instruction to Clifford Chance. Her managing 
  partner's debrief: "You weren't at your best."
  
  NOW: Her firm has won Apex Capital as a new client. There's a critical pitch in London on 
  18 March 2026. She is flying out DXB→LHR on 14 March. The firm WILL reimburse Business Class.
  She cannot — will not — make the same mistake twice. ONE flight done right.
  
  Emirates sees her: economy passenger #39821, Skywards Blue, AED 12K lifetime.
  VoyagerAI sees: 89% propensity to book Business Class for 14 March. Long-term LTV signal: 
  AED 280K+ (Apex requires recurring London visits). The conversion that opens the relationship.

  TECHNICAL FLOW:
  1. Morning visit → browses Business Class cabin page anonymously → cookie fires → intent logged
  2. Leaves site → Googles fares → competitors visible, Emirates loses ground
  3. Clicks Emirates organic result → RETURNS to site → offered fare alert → FILLS FORM
  4. Email submitted → THEN PSS queried using email → booking history found in 4 seconds
  5. Identity stitched → RLSA + LinkedIn audiences → journey orchestration begins
  6. SMS holds the seat for 14 March → urgency email → she books → AED 18,500 · AED 310 CAC
*/
const TRAVELLER = {
  name: "Aisha Al-Rashidi",
  email: "aisha.alrashidi@altamimi.ae",
  phone: "+971 50 234 5678",
  job: "Partner, Al Tamimi & Company",
  client: "Apex Capital (MENA-focused PE fund)",
  pitchDate: "18 March 2026",
  flightDate: "14 March 2026",
  flightNo: "EK007",
  lostDeal: "£2M instruction — Clifford Chance won it while she was recovering from a red-eye",
  skywardsNo: "EK-294857", skywardsTier: "Blue",
  priorFlights: 4, priorCabin: "Economy",
  lastFlight: "DXB–LHR, Nov 2024 (economy — the lost pitch)",
  route: "DXB → LHR", cabin: "Business Class",
  pricePerTrip: "AED 18,500",
  ltv: "AED 280,000+",
  propensity: 89, ancillaryScore: 91, mealPref: "Vegetarian",
  cacTraditional: "AED 1,400", cacVoyager: "AED 310",
  immediateRoi: "60x",
  lifetimeRoi: "904x",
};

/* ═══ SHARED UI ═══ */
function Glass({ children, style: s = {}, highlight, borderColor }) {
  return (
    <div style={{ background: highlight ? "rgba(255,255,255,.96)" : E.glass, backdropFilter: "blur(20px)", borderRadius: 16, border: `1px solid ${borderColor || (highlight ? E.gold + "40" : E.mist)}`, boxShadow: highlight ? `0 4px 28px ${E.goldGlow}` : "0 1px 8px rgba(0,0,0,.04)", ...s }}>{children}</div>
  );
}
function DBadge({ domain }) {
  const d = DOMAIN[domain];
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: d.bg, border: `1px solid ${d.color}30`, borderRadius: 20, padding: "3px 10px", fontSize: 9.5, fontFamily: "JBM", fontWeight: 700, color: d.color }}>{d.icon} {d.label}</span>;
}
function TZone({ domain, children, active = true, note }) {
  const d = DOMAIN[domain];
  return (
    <div style={{ border: `1.5px dashed ${active ? d.color + "50" : E.mist}`, borderRadius: 14, padding: "14px 14px 10px", position: "relative", background: active ? `${d.bg}50` : "transparent", opacity: active ? 1 : .4 }}>
      <div style={{ position: "absolute", top: -9, left: 14 }}><DBadge domain={domain} /></div>
      {note && <div style={{ position: "absolute", top: -9, right: 14, fontSize: 8.5, fontFamily: "JBM", color: active ? d.color : E.pale, background: E.snow, padding: "2px 7px", borderRadius: 6, border: `1px solid ${active ? d.color + "40" : E.mist}` }}>{note}</div>}
      <div style={{ marginTop: 6 }}>{children}</div>
    </div>
  );
}
function Chrome({ url, children }) {
  return (
    <Glass style={{ overflow: "hidden" }}>
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 9, borderBottom: `1px solid ${E.mist}`, background: "rgba(255,255,255,.5)" }}>
        <div style={{ display: "flex", gap: 5 }}>{[E.red, "#f5a623", "#7ed321"].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}</div>
        <div style={{ flex: 1, background: E.snow, borderRadius: 7, padding: "4px 12px", fontSize: 10.5, color: E.pale, fontFamily: "JBM", border: `1px solid ${E.mist}` }}>{url}</div>
      </div>
      <div style={{ minHeight: 240 }}>{children}</div>
    </Glass>
  );
}
function Btn({ onClick, children, color = E.gold, style: s = {} }) {
  return <button onClick={onClick} style={{ border: "none", background: `linear-gradient(135deg, ${color}, ${color}CC)`, color: color === E.gold ? E.charcoal : "#fff", padding: "9px 24px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "Cinzel, serif", boxShadow: `0 3px 16px ${color}35`, transition: "all .2s", letterSpacing: .5, ...s }}>{children}</button>;
}
function Tag({ children, color = E.gold }) {
  return <span style={{ background: `${color}12`, border: `1px solid ${color}35`, borderRadius: 20, padding: "2px 10px", fontSize: 9, color, fontWeight: 700, fontFamily: "JBM" }}>{children}</span>;
}
function DayBanner({ day, desc, color = E.gold, sub }) {
  return (
    <div style={{ marginBottom: 14, padding: "12px 16px", background: `${color}08`, border: `1.5px solid ${color}28`, borderRadius: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ background: `linear-gradient(135deg, ${color}, ${color}AA)`, color: color === E.gold ? E.charcoal : "#fff", padding: "4px 14px", borderRadius: 8, fontWeight: 800, fontSize: 12, fontFamily: "Cinzel, serif", whiteSpace: "nowrap", flexShrink: 0 }}>{day}</div>
        <div style={{ fontSize: 12.5, color: E.slate, fontWeight: 600 }}>{desc}</div>
      </div>
      {sub && <div style={{ marginTop: 6, fontSize: 11, color: E.mid, paddingLeft: 4 }}>{sub}</div>}
    </div>
  );
}
function PropensityBar({ score }) {
  const color = score > 80 ? E.green : score > 60 ? E.gold : E.red;
  return (
    <div>
      <div style={{ position: "relative", height: 12, background: E.mist, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${score}%`, background: `linear-gradient(90deg, ${E.amber}, ${E.green})`, borderRadius: 6, transition: "width 1.2s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 8, color: E.pale, fontFamily: "JBM" }}>0%</span>
        <span style={{ fontSize: 13, color, fontWeight: 700, fontFamily: "Cinzel, serif" }}>{score}% Conversion Propensity</span>
        <span style={{ fontSize: 8, color: E.pale, fontFamily: "JBM" }}>100%</span>
      </div>
    </div>
  );
}
function InfoBox({ icon, title, body, color = E.gold }) {
  return (
    <div style={{ background: `${color}08`, border: `1.5px solid ${color}30`, borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "JBM", marginBottom: 5 }}>{icon} {title}</div>
      <div style={{ fontSize: 11, color: E.slate, lineHeight: 1.6 }}>{body}</div>
    </div>
  );
}

/* ═══ CDP PANEL ═══ */
function CDPPanel({ events }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [events]);
  return (
    <Glass highlight style={{ padding: 14, maxHeight: 580, display: "flex", flexDirection: "column", position: "sticky", top: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: E.gold, boxShadow: `0 0 8px ${E.gold}80`, animation: "blink2 2s ease infinite" }} />
        <span style={{ fontFamily: "JBM", fontSize: 9, color: E.goldDark, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>VoyagerAI · Live Event Stream</span>
      </div>
      <div style={{ marginBottom: 8, padding: "6px 10px", background: E.goldSoft, borderRadius: 8, border: `1px solid ${E.gold}25` }}>
        <div style={{ fontSize: 8, fontFamily: "JBM", color: E.goldDark, fontWeight: 700 }}>CDP · PSS CONNECTOR · PROPENSITY AI</div>
        <div style={{ fontSize: 9, color: E.mid, marginTop: 1 }}>Sabre · Identity Stitching · GenAI Content · Journey Orchestrator</div>
      </div>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        {events.map((e, i) => (
          <div key={i} style={{ padding: "6px 9px", borderRadius: 8, background: E.snow, border: `1px solid ${E.mist}`, borderLeft: `3px solid ${e.color || E.gold}`, animation: "slideUp .3s cubic-bezier(.16,1,.3,1) both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 1 }}>
              <span style={{ fontSize: 7.5, fontFamily: "JBM", fontWeight: 700, color: e.color || E.gold, textTransform: "uppercase" }}>{e.type}</span>
              {e.domain && <span style={{ fontSize: 7, fontFamily: "JBM", color: DOMAIN[e.domain]?.color, background: DOMAIN[e.domain]?.bg, padding: "0px 4px", borderRadius: 4, fontWeight: 600 }}>{DOMAIN[e.domain]?.icon}</span>}
            </div>
            <div style={{ fontSize: 9.5, color: E.slate, lineHeight: 1.35 }}>{e.detail}</div>
            <div style={{ fontSize: 7, color: E.pale, fontFamily: "JBM", marginTop: 1 }}>{e.time}</div>
          </div>
        ))}
        {events.length === 0 && <div style={{ color: E.pale, fontSize: 11, fontStyle: "italic", padding: 14, textAlign: "center" }}>Awaiting activity…</div>}
      </div>
    </Glass>
  );
}

const STEPS = [
  { label: "The Problem", n: "01" },
  { label: "Anonymous Visit", n: "02" },
  { label: "Google Search", n: "03" },
  { label: "Returns → Form Fill", n: "04" },
  { label: "PSS Enrich", n: "05" },
  { label: "Identity Stitching", n: "06" },
  { label: "VoyagerAI Profile", n: "07" },
  { label: "Journey Plan", n: "08" },
  { label: "Day 1–2: RLSA + LinkedIn", n: "09" },
  { label: "Day 3: Email", n: "10" },
  { label: "Day 6: Social + SMS", n: "11" },
  { label: "Day 9: Convert", n: "12" },
  { label: "CAC Dashboard", n: "13" },
];

/* ═══ S1: THE PROBLEM ═══ */
function S1({ onNext, add }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    add({ type: "CONTEXT", detail: "Emirates has 4.2M Skywards members. 2.3M show Business Class propensity > 70%. VoyagerAI identifies & converts them at 78% lower CAC.", color: E.red, domain: "emirates", time: "Business Context" });
    const t = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1300),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div>
      <DayBanner day="The Problem" desc="Emirates is sitting on millions of hidden Business Class passengers — and can't see any of them" color={E.red} />

      <Glass style={{ padding: "18px 22px 20px", marginBottom: 14, position: "relative", overflow: "hidden" }} highlight>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: E.gold, animation: "blink2 1.5s ease infinite" }} />
          <div style={{ fontSize: 9, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>The Hidden Funnel — From 4.2M Members to One Booking Today</div>
        </div>

        <svg viewBox="0 0 720 340" style={{ width: "100%", height: "auto", maxHeight: 380 }}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={E.charcoal} />
              <stop offset="100%" stopColor={E.slate} />
            </linearGradient>
            <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={E.slate} />
              <stop offset="100%" stopColor={E.mid} />
            </linearGradient>
            <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={E.gold} />
              <stop offset="100%" stopColor={E.goldDark} />
            </linearGradient>
            <linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={E.green} />
              <stop offset="100%" stopColor="#0F5C2D" />
            </linearGradient>
          </defs>

          {/* Layer 1 — All Skywards Members */}
          <g style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(-8px)", transition: "all .6s cubic-bezier(.16,1,.3,1)" }}>
            <rect x="20" y="15" width="680" height="58" rx="10" fill="url(#g1)" />
            <text x="40" y="38" fill={E.goldLight} fontSize="9" fontFamily="JetBrains Mono" fontWeight="700" letterSpacing="2">SKYWARDS MEMBERS · PUBLIC FIGURE</text>
            <text x="40" y="61" fill="#fff" fontSize="22" fontFamily="Cinzel, serif" fontWeight="700">37,000,000</text>
            <text x="680" y="36" textAnchor="end" fill="rgba(255,255,255,.55)" fontSize="9" fontFamily="JetBrains Mono">Emirates broadcasts to all</text>
            <text x="680" y="55" textAnchor="end" fill="rgba(255,255,255,.4)" fontSize="9" fontFamily="JetBrains Mono">— one bucket, one strategy</text>
            <text x="680" y="68" textAnchor="end" fill={E.redSoft} fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">Industry CAC: AED 1,000–1,500</text>
          </g>

          {/* Connector 1→2 */}
          <g style={{ opacity: phase >= 2 ? 0.4 : 0, transition: "opacity .8s ease" }}>
            <line x1="50" y1="73" x2="120" y2="93" stroke={E.gold} strokeWidth="1" strokeDasharray="3,3" />
            <line x1="670" y1="73" x2="600" y2="93" stroke={E.gold} strokeWidth="1" strokeDasharray="3,3" />
          </g>

          {/* Layer 2 — Active high-propensity (illustrative subset) */}
          <g style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(-8px)", transition: "all .6s cubic-bezier(.16,1,.3,1)" }}>
            <rect x="120" y="93" width="480" height="55" rx="10" fill="url(#g2)" />
            <text x="140" y="115" fill={E.goldLight} fontSize="9" fontFamily="JetBrains Mono" fontWeight="700" letterSpacing="2">ACTIVE · HIGH BUSINESS CLASS PROPENSITY</text>
            <text x="140" y="137" fill="#fff" fontSize="20" fontFamily="Cinzel, serif" fontWeight="700">~2.3M (illustrative)</text>
            <text x="580" y="113" textAnchor="end" fill="rgba(255,255,255,.55)" fontSize="9" fontFamily="JetBrains Mono">Income · job · travel pattern signals</text>
            <text x="580" y="130" textAnchor="end" fill="rgba(255,255,255,.4)" fontSize="9" fontFamily="JetBrains Mono">— invisible without VoyagerAI</text>
          </g>

          {/* Connector 2→3 */}
          <g style={{ opacity: phase >= 3 ? 0.4 : 0, transition: "opacity .8s ease" }}>
            <line x1="150" y1="148" x2="210" y2="168" stroke={E.gold} strokeWidth="1" strokeDasharray="3,3" />
            <line x1="570" y1="148" x2="510" y2="168" stroke={E.gold} strokeWidth="1" strokeDasharray="3,3" />
          </g>

          {/* Layer 3 — Imminent intent */}
          <g style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "translateY(0)" : "translateY(-8px)", transition: "all .6s cubic-bezier(.16,1,.3,1)" }}>
            <rect x="210" y="168" width="300" height="55" rx="10" fill="url(#g3)" />
            <text x="230" y="190" fill={E.charcoal} fontSize="9" fontFamily="JetBrains Mono" fontWeight="700" letterSpacing="2">RESEARCHING THIS WEEK</text>
            <text x="230" y="212" fill={E.charcoal} fontSize="20" fontFamily="Cinzel, serif" fontWeight="700">~12,400</text>
            <text x="490" y="188" textAnchor="end" fill="rgba(0,0,0,.65)" fontSize="9" fontFamily="JetBrains Mono">9-day conversion window</text>
            <text x="490" y="205" textAnchor="end" fill="rgba(0,0,0,.5)" fontSize="9" fontFamily="JetBrains Mono">— competitors closing in</text>
          </g>

          {/* Connector 3→4 */}
          <g style={{ opacity: phase >= 4 ? 0.6 : 0, transition: "opacity .8s ease" }}>
            <line x1="240" y1="223" x2="290" y2="248" stroke={E.green} strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="480" y1="223" x2="430" y2="248" stroke={E.green} strokeWidth="1.5" strokeDasharray="3,3" />
          </g>

          {/* Layer 4 — Aisha */}
          <g style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(-8px)", transition: "all .8s cubic-bezier(.16,1,.3,1)" }}>
            <rect x="290" y="248" width="140" height="78" rx="10" fill="url(#g4)" stroke={E.green} strokeWidth="2" />
            <text x="360" y="268" textAnchor="middle" fill="rgba(255,255,255,.85)" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="700" letterSpacing="2">ONE PASSENGER · TODAY</text>
            <text x="360" y="289" textAnchor="middle" fill="#fff" fontSize="14" fontFamily="Cinzel, serif" fontWeight="700">Aisha Al-Rashidi</text>
            <text x="360" y="305" textAnchor="middle" fill="rgba(255,255,255,.85)" fontSize="9" fontFamily="JetBrains Mono">89% propensity</text>
            <text x="360" y="318" textAnchor="middle" fill={E.goldLight} fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">AED 280K LTV signal</text>

            {/* Annotation arrow */}
            <line x1="440" y1="287" x2="500" y2="287" stroke={E.green} strokeWidth="1.5" />
            <polygon points="500,283 510,287 500,291" fill={E.green} />
            <text x="520" y="284" fill={E.green} fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">Today's case study</text>
            <text x="520" y="297" fill={E.mid} fontSize="8.5" fontFamily="JetBrains Mono">Watch VoyagerAI find,</text>
            <text x="520" y="308" fill={E.mid} fontSize="8.5" fontFamily="JetBrains Mono">score &amp; convert her</text>
          </g>
        </svg>

        <div style={{ marginTop: 8, padding: "11px 14px", background: E.snow, borderRadius: 8, border: `1px solid ${E.mist}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, color: E.slate, lineHeight: 1.6 }}>
              <strong style={{ color: E.red }}>Today's industry CAC for premium B2B travel acquisition: ~AED 1,000–1,500.</strong> VoyagerAI's targeting collapses this by serving only the in-market segment with personalised creative. <strong style={{ color: E.green }}>Etihad Airways' published RLSA case study reduced CPA by 60% on a similar audience strategy.</strong>
            </div>
          </div>
          <div style={{ fontSize: 8, fontFamily: "JBM", color: E.pale, textAlign: "right", whiteSpace: "nowrap", flexShrink: 0, paddingTop: 2 }}>
            <div>Skywards: 37M (Emirates official)</div>
            <div>CAC: First Page Sage benchmark</div>
            <div>RLSA: AdWords Robot case study</div>
          </div>
        </div>
      </Glass>
      <div style={{ background: `linear-gradient(135deg, ${E.charcoal}, #1A0820)`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
        <div style={{ fontSize: 9, fontFamily: "JBM", color: E.goldLight, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Meet Our Traveller — The Economy Loyalist Emirates Doesn't Know Is Worth AED 280K</div>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${E.gold}, ${E.red})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👩‍⚖️</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: E.white, fontFamily: "Cinzel, serif" }}>{TRAVELLER.name}</div>
            <div style={{ fontSize: 11, color: E.goldLight, marginTop: 2 }}>{TRAVELLER.job}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 6, lineHeight: 1.65 }}>
              <strong style={{ color: "rgba(255,255,255,.85)" }}>18 November 2024.</strong> EK007 economy, seat 47B. 90 minutes of fragmented sleep on a 30° recline. Heathrow immigration took 52 minutes — no fast-track. She reached her hotel at 09:18. The pitch was at 10:00. She walked into the Clifford Chance boardroom at 10:07 — late, voice hoarse, suit creased, eyes red. The other side looked rested. <strong style={{ color: "#ff9999" }}>The £2M instruction went to Clifford Chance.</strong> Her managing partner the next morning: <em style={{ color: "rgba(255,255,255,.4)" }}>"You weren't at your best."</em>
              <br /><br />
              <strong style={{ color: "rgba(255,255,255,.85)" }}>On 18 March 2026 she has another pitch in London</strong> — Apex Capital, a client her firm just won. She flies out 14 March. The firm will reimburse Business Class. She refuses to lose another mandate to exhaustion. Today she is on emirates.com researching that one critical flight — and Emirates has no idea who she is, or what converting her unlocks.
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              <Tag color={E.gold}>Skywards Blue · 4 Economy Flights</Tag>
              <Tag color={E.red}>Emirates sees: economy passenger #39821</Tag>
              <Tag color={E.green}>Reality: This booking opens an AED 280K+ LTV relationship</Tag>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: `1.5px solid ${E.mist}`, borderRadius: 14, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 9, fontFamily: "JBM", color: E.mid, letterSpacing: 2, marginBottom: 10, textTransform: "uppercase", fontWeight: 700 }}>The Two Days Side by Side — Why She Will Pay the Premium</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: E.redSoft, border: `1.5px solid ${E.red}30`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 8, fontFamily: "JBM", color: E.red, fontWeight: 700, background: "#fff", padding: "2px 7px", borderRadius: 5, border: `1px solid ${E.red}30` }}>18 NOV 2024 · ECONOMY · WHAT HAPPENED</span>
            </div>
            <div style={{ fontSize: 11, color: E.slate, lineHeight: 1.7 }}>
              <div>🛏 90 min fragmented sleep · 30° recline</div>
              <div>📋 Tray too small to spread case notes</div>
              <div>💧 Cabin air at 12% humidity · throat raw</div>
              <div>🛂 Heathrow customs: 52 min · no fast-track</div>
              <div>⏰ Hotel 09:18 → pitch 10:00 → walked in 10:07</div>
              <div>🎤 Voice hoarse · suit creased · eyes red</div>
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${E.red}40`, fontWeight: 700, color: E.red }}>Result: £2M instruction lost to Clifford Chance</div>
            </div>
          </div>
          <div style={{ background: E.greenSoft, border: `1.5px solid ${E.green}30`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 8, fontFamily: "JBM", color: E.green, fontWeight: 700, background: "#fff", padding: "2px 7px", borderRadius: 5, border: `1px solid ${E.green}30` }}>14 MAR 2026 · BUSINESS CLASS · WHAT'S POSSIBLE</span>
            </div>
            <div style={{ fontSize: 11, color: E.slate, lineHeight: 1.7 }}>
              <div>🛏 5–6 hours real sleep · fully lie-flat bed</div>
              <div>💼 Private suite · review notes at altitude</div>
              <div>🥂 Hydration on tap · multi-course dining at altitude</div>
              <div>🛂 Fast-track immigration: ~8 minutes</div>
              <div>🚗 Chauffeur to hotel: arrival ~07:45</div>
              <div>👔 Shower · prep · walk in at 09:55, rested</div>
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${E.green}40`, fontWeight: 700, color: E.green }}>Possible: Apex Capital mandate won</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "10px 12px", background: E.goldSoft, borderRadius: 8, border: `1px solid ${E.gold}30` }}>
          <div style={{ fontSize: 11, color: E.slate, lineHeight: 1.6 }}>
            <strong style={{ color: E.goldDark }}>For Aisha, AED 18,500 isn't a flight upgrade — it's mandate insurance.</strong> A single Magic Circle–level instruction is worth millions in fees over its lifetime. The Business Class fare is rounding error against the cost of arriving wrecked and losing the work. <strong>This is why VoyagerAI's propensity model gives her 89%</strong> — not because she's wealthy, but because the math is overwhelming for her specifically.
          </div>
        </div>
      </div>

      <Btn onClick={onNext}>Watch VoyagerAI Find and Convert Her →</Btn>
    </div>
  );
}

/* ═══ S2: ANONYMOUS VISIT ═══ */
function S2({ onNext, add }) {
  useEffect(() => {
    add({ type: "PAGE_VIEW", detail: "Anonymous visitor — Business Class cabin page · DXB→LHR route · iPhone 15", color: E.red, domain: "emirates", time: "Day 0 · 10:14 AM" });
    setTimeout(() => add({ type: "COOKIE", detail: "1st-party cookie: em_4f9a2c · session started · device fingerprint logged", color: E.red, domain: "emirates", time: "Day 0 · 10:14:01" }), 700);
    setTimeout(() => add({ type: "BEHAVIOUR", detail: "4m 32s on Business Class page · DXB→LHR checked 3x · Seat map opened · Fare calendar: March–May highlighted", color: E.gold, domain: "cdp", time: "Day 0 · 10:18 AM" }), 1600);
    setTimeout(() => add({ type: "INTENT_SIGNAL", detail: "HIGH INTENT flagged — Business cabin + DXB→LHR + March window + 4m32s dwell + seat map interaction. Identity: ANONYMOUS.", color: E.gold, domain: "cdp", time: "Day 0 · 10:18:05" }), 2800);
  }, []);
  return (
    <div>
      <DayBanner day="Day 0 · 10:14 AM" desc="Aisha visits emirates.com on her lunch break — anonymous, but leaving rich intent signals" color={E.red}
        sub="She is actively researching. She checks the Business Class cabin, the lie-flat bed, the DXB→LHR route, the fare calendar — everything she should have done last time. VoyagerAI captures every signal, but she has not identified herself yet." />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <TZone domain="emirates" active note="Cookie fires"><span style={{ fontSize: 10.5, color: E.slate }}>🍪 Cookie <code>em_4f9a2c</code> set — behavioral signals captured in real-time</span></TZone>
        <TZone domain="cdp" active note="HIGH INTENT"><span style={{ fontSize: 10.5, color: E.slate }}>VoyagerAI scores: Business cabin dwell + route + date window = upgrade intent signal</span></TZone>
      </div>
      <Chrome url="https://www.emirates.com/ae/english/flying/cabins/business-class/">
        <div style={{ background: `linear-gradient(160deg, ${E.charcoal} 0%, #0D0820 50%, ${E.redDark} 100%)`, padding: "32px 28px", minHeight: 310 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 26, height: 26, background: E.red, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✈</div>
            <div style={{ fontSize: 17, fontWeight: 800, fontFamily: "Cinzel, serif", color: E.white, letterSpacing: 3 }}>EMIRATES</div>
            <div style={{ width: 1, height: 14, background: E.gold + "60" }} />
            <div style={{ fontSize: 9, color: E.goldLight, fontFamily: "JBM", letterSpacing: 1.5 }}>FLY BETTER</div>
          </div>
          <div style={{ animation: "slideUp .6s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ fontSize: 9, color: E.goldLight, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Business Class Experience</div>
            <h1 style={{ fontSize: 24, lineHeight: 1.2, fontWeight: 700, fontFamily: "Cinzel, serif", margin: "0 0 10px", color: E.white }}>Arrive Ready.<br /><span style={{ color: E.goldLight }}>Not Just There.</span></h1>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: 12, maxWidth: 340, lineHeight: 1.6 }}>Lie-flat beds. Multi-course dining. Private chauffeur. Business Lounge access. 7 hours DXB→LHR — arrive rested and ready for whatever London demands.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14, maxWidth: 360 }}>
              {[["DXB → LHR", "Daily · 7h 30m · Non-stop"], ["Business Class", "From AED 18,500 return"], ["Chauffeur Drive", "Door to door, included"], ["Skywards Miles", "Earn 150% more miles"]].map(([k, v]) => (
                <div key={k} style={{ background: "rgba(255,255,255,.07)", border: `1px solid ${E.gold}20`, borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: E.goldLight, fontFamily: "JBM" }}>{k}</div>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.45)", marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
            <Btn onClick={onNext} style={{ marginTop: 14, background: `linear-gradient(135deg, ${E.gold}, ${E.goldDark})` }}>She Leaves Without Booking →</Btn>
          </div>
        </div>
      </Chrome>
      <div style={{ marginTop: 12 }}>
        <InfoBox icon="⚠️" title="WITHOUT VOYAGERAI — this intent signal would be lost forever" color={E.red}
          body="Aisha leaves the page without booking. Emirates records a bounce. No one knows a Skywards member with 4 prior flights spent 4 minutes exploring Business Class, checked DXB→LHR 3 times, and opened the fare calendar. The intent evaporates. She remains 'economy passenger #39821'." />
      </div>
    </div>
  );
}

/* ═══ S3: GOOGLE SEARCH — EMIRATES LOSES VISIBILITY ═══ */
function S3({ onNext, add }) {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState(0);
  const full = "emirates business class dubai london march 2026 price";
  useEffect(() => {
    add({ type: "LEFT SITE", detail: "Aisha navigates away from emirates.com to Google to compare Business Class fares", color: E.amber, domain: "emirates", time: "Day 0 · 10:19 AM" });
    let i = 0;
    const iv = setInterval(() => { i++; setTyped(full.slice(0, i)); if (i >= full.length) { clearInterval(iv); setTimeout(() => setPhase(1), 500); } }, 42);
    return () => clearInterval(iv);
  }, []);
  return (
    <div>
      <DayBanner day="Day 0 · 10:19 AM" desc="Aisha opens Google to compare fares — Emirates goes completely blind" color="#1A73E8"
        sub="73% of high-intent travellers compare prices on Google after visiting an airline site. Without VoyagerAI, Emirates loses all visibility the moment she crosses domains. Competitors are waiting with paid placements." />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <TZone domain="emirates" active={false} note="NO VISIBILITY"><span style={{ fontSize: 10, color: E.pale }}>1st-party cookie dies at the emirates.com border — cannot follow Aisha across domains</span></TZone>
        <TZone domain="google" active note="Tracks search"><span style={{ fontSize: 10, color: E.slate }}>Google captures query via Aisha's logged-in Chrome profile — building intent graph</span></TZone>
      </div>
      <Chrome url="https://www.google.com/search">
        <div style={{ background: "#fff", padding: "20px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#4285F4" }}>G</span>
            <div style={{ flex: 1, border: "1.5px solid #ddd", borderRadius: 22, padding: "9px 16px", fontSize: 12, color: E.ink, boxShadow: "0 1px 6px rgba(0,0,0,.1)" }}>
              {typed}<span style={{ animation: "blink2 1s step-end infinite", color: "#4285F4" }}>|</span>
            </div>
          </div>
          <div style={{ background: E.redSoft, border: `1.5px solid ${E.red}25`, borderRadius: 10, padding: "9px 13px", marginBottom: 12 }}>
            <div style={{ fontSize: 9.5, fontFamily: "JBM", color: E.red, fontWeight: 700 }}>⚠️ Emirates has NO personalised retargeting ad here. Aisha is anonymous to Emirates across domains. Competitors fill the paid slots.</div>
          </div>
          {[
            { name: "Qatar Airways Qsuites — Dubai to London LHR", url: "qatarairways.com/en/qsuites", desc: "Award-winning Qsuites Business · DXB–DOH–LHR · From AED 15,900 return · Book now" },
            { name: "Etihad Business Studio · Dubai to Heathrow", url: "etihad.com/en-ae/business", desc: "Direct B787 service · Business Studio · From AED 16,800 · Corporate rate available" },
          ].map((r, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: `1px solid ${E.mist}` }}>
              <span style={{ fontSize: 7.5, background: "#5C0069", color: "#fff", padding: "2px 7px", borderRadius: 4, fontWeight: 700, fontFamily: "JBM" }}>SPONSORED</span>
              <div style={{ fontSize: 13, color: "#1A0DAB", fontWeight: 600, marginBottom: 2, marginTop: 4 }}>{r.name}</div>
              <div style={{ fontSize: 10.5, color: "#006621" }}>{r.url}</div>
              <div style={{ fontSize: 10.5, color: E.mid, marginTop: 2 }}>{r.desc}</div>
            </div>
          ))}
          <div style={{ padding: "10px 0", borderBottom: `1px solid ${E.mist}` }}>
            <div style={{ fontSize: 13, color: "#1A0DAB", fontWeight: 600, marginBottom: 2 }}>Emirates Business Class Flights | emirates.com</div>
            <div style={{ fontSize: 10.5, color: "#006621" }}>emirates.com/ae/english/flying/cabins/business-class</div>
            <div style={{ fontSize: 10.5, color: E.mid, marginTop: 2 }}>Lie-flat beds, gourmet dining, chauffeur drive. Earn Skywards Miles. Book online.</div>
          </div>
          {phase >= 1 && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: E.greenSoft, borderRadius: 8, border: `1px solid ${E.green}30`, animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 9.5, fontFamily: "JBM", color: E.green, fontWeight: 700 }}>✅ Aisha clicks the Emirates organic result — she returns to emirates.com. VoyagerAI's cookie <code style={{ background: "#fff", padding: "1px 4px", borderRadius: 3, fontSize: 9 }}>em_4f9a2c</code> is still active and recognises her session immediately.</div>
            </div>
          )}
          {phase >= 1 && <Btn onClick={onNext} style={{ marginTop: 12 }}>She Returns to Emirates.com →</Btn>}
        </div>
      </Chrome>
      <div style={{ marginTop: 12 }}>
        <InfoBox icon="💡" title="Why this matters — the competitive window is closing" color={E.amber}
          body="Qatar Airways and Etihad each spent AED 800+ in paid ads to reach Aisha right now. Emirates gets the organic click for free — but has no way to personalise her experience when she returns, or retarget her if she leaves again without converting. VoyagerAI changes that entirely." />
      </div>
    </div>
  );
}

/* ═══ S4: RETURNS TO SITE → FARE ALERT FORM FILL ═══ */
function S4({ onNext, add }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    add({ type: "RETURN_VISIT", detail: "Aisha returns via organic Google click · Cookie em_4f9a2c recognised · Session resumed · HIGH INTENT context restored", color: E.red, domain: "emirates", time: "Day 0 · 10:26 AM" });
    setTimeout(() => add({ type: "BANNER_SHOWN", detail: "VoyagerAI triggers contextual Business Class offer banner — based on morning session behaviour (4m32s dwell, DXB→LHR ×3, fare calendar opened)", color: E.gold, domain: "cdp", time: "Day 0 · 10:26:02" }), 800);
  }, []);

  const handleSubmit = () => {
    setPhase(1);
    add({ type: "FORM_SUBMITTED", detail: `Name: ${TRAVELLER.name} · Email: ${TRAVELLER.email} · Phone: ${TRAVELLER.phone} · Route: DXB→LHR`, color: E.red, domain: "emirates", time: "Day 0 · 10:34 AM" });
    setTimeout(() => {
      add({ type: "IDENTITY_BRIDGE", detail: "Email captured → VoyagerAI links cookie em_4f9a2c to aisha.alrashidi@altamimi.ae · First-party identity established", color: E.gold, domain: "cdp", time: "Day 0 · 10:34:01" });
    }, 900);
    setTimeout(() => {
      setPhase(2);
    }, 2000);
  };

  return (
    <div>
      <DayBanner day="Day 0 · 10:26 AM" desc="Aisha returns to emirates.com — and this time, she fills the fare alert form" color={E.gold}
        sub="Her cookie from the morning visit is still live. VoyagerAI immediately restores her intent context and shows a personalised Business Class offer banner. She fills the form — and this email address is the identity key that unlocks everything." />

      <div style={{ background: E.tealSoft, border: `1.5px solid ${E.teal}30`, borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: E.teal, fontFamily: "Cinzel, serif", marginBottom: 4 }}>🔑 Why the Form Fill is the Critical Moment</div>
        <div style={{ fontSize: 11, color: E.slate, lineHeight: 1.65 }}>
          Up to this point, Aisha is anonymous. VoyagerAI has rich behavioural signals — but no identity. The moment she submits her email, it becomes the <strong>universal identity key</strong>: VoyagerAI uses it to query Sabre PSS, find her Skywards number, retrieve her booking history, and stitch her identity across every marketing platform — all in under 5 seconds.
        </div>
      </div>

      <Chrome url="https://www.emirates.com/ae/english/flying/business-class/exclusive-offer">
        <div style={{ padding: "0px", background: "#fff" }}>
          {/* Contextual banner based on morning session */}
          <div style={{ background: `linear-gradient(135deg, ${E.charcoal}, ${E.redDark})`, padding: "14px 18px", borderBottom: `1px solid ${E.gold}20` }}>
            <div style={{ fontSize: 8, fontFamily: "JBM", color: E.goldLight, letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" }}>Based on your interest in Business Class this morning</div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "Cinzel, serif", color: E.white }}>DXB → LHR Business Class <span style={{ color: E.goldLight }}>— Exclusive Offer</span></div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.5)", marginTop: 3 }}>Lie-flat · Premium dining · Chauffeur · Lounge access · From <strong style={{ color: E.goldLight }}>AED 18,500</strong> return</div>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 18, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${E.gold}, ${E.red})` }} />
              <span style={{ fontSize: 10, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Business Class Fare Alert · Enter Your Details</span>
            </div>
            <p style={{ fontSize: 11.5, color: E.slate, lineHeight: 1.6, marginBottom: 14 }}>Get a personalised offer for your DXB→LHR route — including corporate rate options and availability for March–May 2026.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[["Full Name", TRAVELLER.name], ["Email Address", TRAVELLER.email], ["Phone Number", TRAVELLER.phone], ["Route", "DXB → LHR"]].map(([l, v]) => (
                <div key={l}>
                  <label style={{ fontSize: 8.5, color: E.pale, fontWeight: 700, textTransform: "uppercase", fontFamily: "JBM" }}>{l}</label>
                  <div style={{ marginTop: 3, padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${phase >= 1 ? E.gold + "70" : E.mist}`, background: phase >= 1 ? E.goldSoft : E.snow, fontSize: 11.5, color: phase >= 1 ? E.ink : E.pale, transition: "all .4s" }}>
                    {phase >= 1 ? v : "—"}
                  </div>
                </div>
              ))}
            </div>

            {phase === 0 && <Btn onClick={handleSubmit}>▶ Simulate: Aisha Submits the Form</Btn>}

            {phase === 1 && (
              <div style={{ animation: "slideUp .3s ease", padding: "12px 14px", background: E.goldSoft, border: `1.5px solid ${E.gold}40`, borderRadius: 10 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: E.goldDark, fontFamily: "JBM" }}>✅ Email captured — identity established</div>
                <div style={{ fontSize: 10.5, color: E.mid, marginTop: 4 }}>Cookie <code style={{ fontSize: 9.5 }}>em_4f9a2c</code> → email <code style={{ fontSize: 9.5 }}>{TRAVELLER.email}</code></div>
                <div style={{ fontSize: 10, color: E.goldDark, marginTop: 6, animation: "blink2 1s ease infinite" }}>⚡ VoyagerAI now querying Sabre PSS using this email…</div>
              </div>
            )}

            {phase >= 2 && (
              <div style={{ animation: "slideUp .4s ease" }}>
                <div style={{ padding: "10px 14px", background: E.greenSoft, border: `1.5px solid ${E.green}30`, borderRadius: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: E.green }}>✅ Identity bridge created — PSS query now firing</div>
                  <div style={{ fontSize: 10, color: E.mid, marginTop: 3 }}>Email → Skywards lookup → booking history → propensity model → full profile. See Step 5 for the complete enrichment sequence.</div>
                </div>
                <Btn onClick={onNext}>Watch PSS Enrichment in Real-Time →</Btn>
              </div>
            )}
          </div>
        </div>
      </Chrome>
    </div>
  );
}

/* ═══ S5: PSS ENRICH — THE CORRECTED SEQUENCE ═══ */
function S5({ onNext, add }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Three enrichment streams fire in parallel from the email:
    //   Stream A (PSS): email → Skywards lookup → booking history
    //   Stream B (B2B): email domain → firm identification → LinkedIn job title
    //   Stream C (Intent): firm name → public news/press monitoring → mandate signals
    const timers = [
      setTimeout(() => { setPhase(1); add({ type: "ENRICHMENT_FAN_OUT", detail: "Email triggers 3 parallel enrichments: (A) Sabre PSS · (B) B2B firmographic · (C) Public news intent", color: E.gold, domain: "cdp", time: "Day 0 · 10:34:02" }); }, 600),
      setTimeout(() => { add({ type: "PSS_QUERY", detail: "Stream A: email sent to Sabre PSS via prebuilt connector — looking up linked Skywards account", color: E.green, domain: "pss", time: "Day 0 · 10:34:02" }); }, 900),
      setTimeout(() => { add({ type: "B2B_QUERY", detail: "Stream B: email domain altamimi.ae sent to Clearbit / ZoomInfo / Apollo APIs — firmographic + person-level enrichment", color: E.teal, domain: "cdp", time: "Day 0 · 10:34:02" }); }, 1100),
      setTimeout(() => { add({ type: "INTENT_QUERY", detail: "Stream C: VoyagerAI's news/press monitor checks recent mandate announcements naming the firm or known partners", color: E.purple, domain: "cdp", time: "Day 0 · 10:34:03" }); }, 1300),
      setTimeout(() => { setPhase(2); add({ type: "PSS_RESULT", detail: "Stream A returns: Skywards #EK-294857 · 4 economy flights · DXB-LHR, DXB-DEL, DXB-BOM, DXB-CMB · Blue tier · Last: DXB-LHR Nov 2024", color: E.green, domain: "pss", time: "Day 0 · 10:34:03" }); }, 2200),
      setTimeout(() => { setPhase(3); add({ type: "B2B_RESULT", detail: "Stream B returns: altamimi.ae → Al Tamimi & Company (largest law firm in MENA · 700+ lawyers · 17 offices) · LinkedIn match: Aisha Al-Rashidi · Partner · Corporate / M&A", color: E.teal, domain: "cdp", time: "Day 0 · 10:34:03" }); }, 2900),
      setTimeout(() => { setPhase(4); add({ type: "INTENT_RESULT", detail: "Stream C returns: Khaleej Times (12 Feb 2026) · 'Al Tamimi advises Apex Capital on £500M MENA infrastructure fund' · Lead partner: Aisha Al-Rashidi · London engagement implied", color: E.purple, domain: "cdp", time: "Day 0 · 10:34:04" }); }, 3700),
      setTimeout(() => { setPhase(5); add({ type: "PROPENSITY_RUNNING", detail: "AI model combines all 3 streams: PSS history + B2B context (Partner @ top firm) + Intent (Apex mandate just announced) + website behaviour + return visit pattern", color: E.gold, domain: "cdp", time: "Day 0 · 10:34:05" }); }, 4800),
      setTimeout(() => { setPhase(6); add({ type: "PROFILE_COMPLETE", detail: `Propensity: ${TRAVELLER.propensity}% · Ancillary: ${TRAVELLER.ancillaryScore} · LTV: ${TRAVELLER.ltv} · Segment: CORP-UPGRADE-DXB-LHR · Time elapsed: 4.1 seconds`, color: E.gold, domain: "cdp", time: "Day 0 · 10:34:06" }); }, 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const sequenceSteps = [
    { label: "Email submitted on fare alert form", sub: "First-party identity key obtained · Cookie bridged", done: true, color: E.gold, always: true },
    { label: "3 parallel enrichments fan out from email", sub: "PSS · B2B firmographic · Public news intent — all fire simultaneously", done: phase >= 1, color: E.gold },
    { label: "Stream A — Sabre PSS returns booking history", sub: "4 flights · Blue tier · meal pref · DXB-LHR route history", done: phase >= 2, color: E.green },
    { label: "Stream B — Email domain reveals firm + role", sub: "altamimi.ae → Al Tamimi · LinkedIn match → Partner, M&A", done: phase >= 3, color: E.teal },
    { label: "Stream C — Public news ties firm to imminent travel", sub: "Khaleej Times: Al Tamimi advising Apex Capital · she is lead partner", done: phase >= 4, color: E.purple },
    { label: "Propensity model runs across all signals", sub: "PSS + B2B context + Intent + behaviour combined", done: phase >= 5, color: E.gold },
    { label: "Full enriched profile ready", sub: "89% propensity · AED 280K LTV · Segment assigned", done: phase >= 6, color: E.gold },
  ];

  return (
    <div>
      <DayBanner day="Day 0 · 10:34 AM" desc="Email triggers 3 parallel enrichments → PSS, B2B firmographic, public news intent → Full profile in 4.1 seconds" color={E.green}
        sub="The email is the universal key. From it, VoyagerAI fans out three parallel queries — Sabre PSS for booking history, Clearbit/ZoomInfo for firm and role context, and a news/press monitor for public intent signals. Each is a real, standard CDP capability. Together they explain who Aisha is and why she's about to book." />

      <Glass style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Live Enrichment Sequence — Step by Step</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sequenceSteps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: (s.always || s.done) ? 1 : .25, transition: "opacity .6s" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: (s.always || s.done) ? s.color : E.mist, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700, fontFamily: "JBM", flexShrink: 0, transition: "all .5s", boxShadow: (s.always || s.done) ? `0 2px 10px ${s.color}45` : "none" }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: E.ink }}>{s.label}</span>
                <div style={{ fontSize: 10, color: E.mid, fontFamily: "JBM", marginTop: 1 }}>{s.sub}</div>
              </div>
              {(s.always || s.done) && <span style={{ fontSize: 8, background: E.greenSoft, color: E.green, fontFamily: "JBM", fontWeight: 700, padding: "2px 8px", borderRadius: 8, border: `1px solid ${E.green}25`, whiteSpace: "nowrap" }}>✓ DONE</span>}
            </div>
          ))}
        </div>
      </Glass>

      {phase >= 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12, animation: "slideUp .4s ease" }}>
          {/* Stream A: PSS */}
          <Glass style={{ padding: 14 }}>
            <div style={{ fontSize: 9, fontFamily: "JBM", color: E.green, fontWeight: 700, marginBottom: 8 }}>🛫 STREAM A · SABRE PSS</div>
            {[["Skywards No.", TRAVELLER.skywardsNo], ["Tier", TRAVELLER.skywardsTier], ["EK Flights", `${TRAVELLER.priorFlights} × Economy`], ["Prior DXB→LHR", "1 · Nov 2024"], ["Meal Pref.", TRAVELLER.mealPref]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px solid ${E.mist}`, fontSize: 10 }}>
                <span style={{ color: E.mid, fontFamily: "JBM", fontSize: 8.5 }}>{k}</span>
                <span style={{ fontWeight: 600, color: E.ink, fontSize: 10 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: 8, color: E.green, fontFamily: "JBM" }}>Source: Sabre PSS prebuilt connector</div>
          </Glass>

          {/* Stream B: B2B */}
          {phase >= 3 ? (
            <Glass style={{ padding: 14 }}>
              <div style={{ fontSize: 9, fontFamily: "JBM", color: E.teal, fontWeight: 700, marginBottom: 8 }}>🏢 STREAM B · B2B FIRMOGRAPHIC</div>
              {[["Email Domain", "altamimi.ae"], ["Firm", "Al Tamimi & Co."], ["Industry", "Legal · M&A · Corporate"], ["Size", "700+ lawyers · 17 offices"], ["Person Match", "Partner · M&A"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px solid ${E.mist}`, fontSize: 10 }}>
                  <span style={{ color: E.mid, fontFamily: "JBM", fontSize: 8.5 }}>{k}</span>
                  <span style={{ fontWeight: 600, color: E.ink, fontSize: 10 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, fontSize: 8, color: E.teal, fontFamily: "JBM" }}>Source: Clearbit / ZoomInfo / LinkedIn</div>
            </Glass>
          ) : (
            <Glass style={{ padding: 14, opacity: .35 }}>
              <div style={{ fontSize: 9, fontFamily: "JBM", color: E.teal, fontWeight: 700, marginBottom: 8 }}>🏢 STREAM B · B2B FIRMOGRAPHIC</div>
              <div style={{ fontSize: 10, color: E.pale, fontStyle: "italic", padding: "20px 0", textAlign: "center" }}>Querying Clearbit / ZoomInfo / LinkedIn…</div>
            </Glass>
          )}

          {/* Stream C: Intent */}
          {phase >= 4 ? (
            <Glass style={{ padding: 14 }}>
              <div style={{ fontSize: 9, fontFamily: "JBM", color: E.purple, fontWeight: 700, marginBottom: 8 }}>📰 STREAM C · NEWS INTENT</div>
              <div style={{ fontSize: 10, color: E.slate, lineHeight: 1.5, marginBottom: 6 }}><strong>Khaleej Times · 12 Feb 2026</strong></div>
              <div style={{ fontSize: 10, color: E.slate, lineHeight: 1.45, marginBottom: 8, fontStyle: "italic" }}>"Al Tamimi advises Apex Capital on £500M MENA infrastructure fund. Lead partner: Aisha Al-Rashidi."</div>
              {[["Mandate", "Apex Capital"], ["Deal Size", "£500M"], ["Lead Partner", "Aisha Al-Rashidi"], ["London Implied", "Yes — fund HQ"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: `1px solid ${E.mist}`, fontSize: 9.5 }}>
                  <span style={{ color: E.mid, fontFamily: "JBM", fontSize: 8.5 }}>{k}</span>
                  <span style={{ fontWeight: 600, color: E.ink, fontSize: 9.5 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, fontSize: 8, color: E.purple, fontFamily: "JBM" }}>Source: Bombora / 6sense / press monitor</div>
            </Glass>
          ) : (
            <Glass style={{ padding: 14, opacity: .35 }}>
              <div style={{ fontSize: 9, fontFamily: "JBM", color: E.purple, fontWeight: 700, marginBottom: 8 }}>📰 STREAM C · NEWS INTENT</div>
              <div style={{ fontSize: 10, color: E.pale, fontStyle: "italic", padding: "20px 0", textAlign: "center" }}>Scanning press releases for {`{firm}`} mentions…</div>
            </Glass>
          )}
        </div>
      )}

      {phase >= 6 && (
        <Glass style={{ padding: 14, marginBottom: 12, animation: "slideUp .4s ease" }} highlight>
          <div style={{ fontSize: 9, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, marginBottom: 8 }}>⚡ VOYAGERAI · AI PROPENSITY MODEL · ALL 3 STREAMS COMBINED</div>
          <PropensityBar score={TRAVELLER.propensity} />
          <div style={{ marginTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
            <Tag color={E.green}>LTV: {TRAVELLER.ltv}</Tag>
            <Tag color={E.gold}>Ancillary: {TRAVELLER.ancillaryScore}</Tag>
            <Tag color={E.purple}>Corp Upgrade · Apex mandate</Tag>
            <Tag color={E.teal}>Partner @ Al Tamimi</Tag>
          </div>
          <div style={{ marginTop: 8, fontSize: 9, color: E.goldDark, fontFamily: "JBM", fontWeight: 700 }}>Segment: CORP-UPGRADE-DXB-LHR · PRIORITY: HIGH · Confidence: 89%</div>
        </Glass>
      )}

      {phase >= 6 && (
        <div style={{ animation: "slideUp .4s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[["⚡ 4.1 seconds", "Full profile from 3 enrichment streams + behavioural data"], ["🔌 Standard CDP capabilities", "PSS connector · B2B enrichment · News intent — all production-grade APIs"], ["📊 89% propensity accuracy", "AI model with 3 signal types · 40% more accurate than rule-based"]].map(([v, d]) => (
              <div key={v} style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}30`, borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: E.goldDark, fontFamily: "Cinzel, serif", marginBottom: 5 }}>{v}</div>
                <div style={{ fontSize: 10, color: E.mid }}>{d}</div>
              </div>
            ))}
          </div>
          <Btn onClick={onNext}>Identity Stitching — Reach Her Everywhere →</Btn>
        </div>
      )}
    </div>
  );
}

/* ═══ S6: IDENTITY STITCHING ═══ */
function S6({ onNext, add }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const t = [
      setTimeout(() => { setP(1); add({ type: "STEP 1", detail: "CDP merges: cookie + email + PSS history + behavioural signals → Unified Guest Profile", color: E.gold, domain: "cdp", time: "Day 0 · 10:34:06" }); }, 600),
      setTimeout(() => { setP(2); add({ type: "STEP 2", detail: "SHA-256 hashed email uploaded to Google Customer Match — no raw PII shared, fully compliant", color: "#1A73E8", domain: "google", time: "Day 0 · 10:34:07" }); }, 2000),
      setTimeout(() => { setP(3); add({ type: "STEP 3", detail: "Google matches hash to Aisha's signed-in Chrome/Gmail account internally — GAID linked, RLSA audience live", color: "#1A73E8", domain: "google", time: "Day 0 · 10:34:08" }); }, 3400),
      setTimeout(() => { setP(4); add({ type: "STEP 4", detail: "RLSA audience active: ek_corp_upgrade_dxb_lhr_highltv · Google Search + Display bid modifier: +70%", color: "#1A73E8", domain: "google", time: "Day 0 · 10:34:09" }); }, 4800),
      setTimeout(() => { setP(5); add({ type: "STEP 5", detail: "Email hash pushed to LinkedIn Matched Audiences + Meta Custom Audience — Instagram + Facebook targeting active", color: "#E1306C", domain: "social", time: "Day 0 · 10:34:10" }); }, 6200),
      setTimeout(() => setP(6), 7400),
    ];
    return () => t.forEach(clearTimeout);
  }, []);
  const steps = [
    { label: "Unified Guest Profile Created", sub: "Cookie + Email + PSS + Behaviour merged into one 360° view", icon: "⚡", color: E.gold, active: p >= 1 },
    { label: "Google Customer Match Upload", sub: "SHA-256 hashed email — raw PII never leaves Emirates' environment", icon: "🔵", color: "#1A73E8", active: p >= 2 },
    { label: "Chrome/Gmail Account Linked", sub: "Google matches internally — Aisha's Google identity found", icon: "✓", color: E.green, active: p >= 3 },
    { label: "RLSA Audience Active", sub: "ek_corp_upgrade_dxb_lhr_highltv · Google Search & Display bid +70%", icon: "🎯", color: E.gold, active: p >= 4 },
    { label: "LinkedIn + Meta Audiences Live", sub: "LinkedIn Matched Audiences · Instagram Custom Audience · Facebook targeting", icon: "📱", color: "#E1306C", active: p >= 5 },
  ];
  return (
    <div>
      <DayBanner day="Day 0 · 10:34 AM" desc="One email — Aisha is now reachable across every platform Emirates uses" color={E.green}
        sub="No third-party cookies. No raw PII shared. Fully compliant with GDPR and UAE PDPL. VoyagerAI stitches identity across Google, LinkedIn, and Instagram using only a hashed email — the gold standard for cookieless targeting." />
      <div style={{ background: E.greenSoft, border: `1.5px solid ${E.green}30`, borderRadius: 14, padding: "14px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: E.ink, fontFamily: "Cinzel, serif", marginBottom: 5 }}>🔗 Why the Email Is the Universal Key</div>
        <div style={{ fontSize: 12, color: E.slate, lineHeight: 1.7 }}>
          Aisha's site cookie <code style={{ background: "#fff", padding: "1px 5px", borderRadius: 3, color: E.red, fontSize: 10.5 }}>em_4f9a2c</code> dies the moment she leaves emirates.com.
          But her email is permanent. VoyagerAI uploads a SHA-256 hash to Google Customer Match and LinkedIn Matched Audiences — they match it to their own internal user IDs.
          <strong> Emirates can now reach Aisha on any platform, without ever seeing or sharing her raw personal data.</strong>
        </div>
      </div>
      <Glass style={{ padding: 20, marginBottom: 14 }} highlight borderColor={E.gold + "40"}>
        <div style={{ fontSize: 10, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Identity Resolution Pipeline — Real-Time</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: s.active ? 1 : .25, transition: "opacity .6s" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.active ? s.color : E.mist, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, transition: "all .5s", boxShadow: s.active ? `0 2px 14px ${s.color}45` : "none" }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: E.ink }}>{s.label}</div>
                <div style={{ fontSize: 10, color: E.mid, fontFamily: "JBM" }}>{s.sub}</div>
              </div>
              {s.active && <span style={{ fontSize: 8, background: E.greenSoft, color: E.green, fontFamily: "JBM", fontWeight: 700, padding: "2px 8px", borderRadius: 8, border: `1px solid ${E.green}30`, whiteSpace: "nowrap" }}>✓ LIVE</span>}
            </div>
          ))}
        </div>
      </Glass>
      {p >= 6 && (
        <div>
          <InfoBox icon="✅" title="Aisha is now reachable on 4 platforms — cookieless, compliant, in real-time" color={E.green}
            body="Emirates can now serve Aisha a personalised ad on Google while she reads news, on LinkedIn while she checks legal briefings, and on Instagram while she scrolls. All coordinated by VoyagerAI. Every channel knows what the others have done. No double-counting. No overkill." />
          <Btn onClick={onNext} style={{ marginTop: 12 }}>Build the Full VoyagerAI Guest Profile →</Btn>
        </div>
      )}
    </div>
  );
}

/* ═══ S7: VOYAGERAI UNIFIED PROFILE ═══ */
function S7({ onNext, add }) {
  useEffect(() => {
    add({ type: "GUEST_360", detail: "Unified Guest Profile complete — 5 sources merged in 4.1 seconds · Traditional manual process: 2–3 days", color: E.gold, domain: "cdp", time: "Day 0 · 10:34:11" });
    add({ type: "MICRO_SEGMENT", detail: "Assigned: CORP-UPGRADE-DXB-LHR-Q1 · Priority: HIGH · Journey Orchestrator triggered", color: E.gold, domain: "cdp", time: "Day 0 · 10:34:12" });
  }, []);
  const attrs = [
    ["Identity · From Form Fill", [["Name", TRAVELLER.name], ["Email", TRAVELLER.email], ["Phone", TRAVELLER.phone], ["Location", "Dubai, UAE"]]],
    ["PSS · Sabre Data", [["Skywards No.", TRAVELLER.skywardsNo], ["Tier", TRAVELLER.skywardsTier], ["EK Flights", "4 × Economy (1 DXB→LHR)"], ["Meal Pref.", TRAVELLER.mealPref]]],
    ["B2B · Firmographic + LinkedIn", [["Firm", "Al Tamimi & Co."], ["Role", "Partner · M&A"], ["Industry", "Legal · Top-tier MENA"], ["Source", "Email domain + Clearbit"]]],
    ["News Intent · Press Monitor", [["Mandate", "Apex Capital"], ["Deal Size", "£500M MENA fund"], ["Source", "Khaleej Times · 12 Feb"], ["Travel Implied", "London · imminent"]]],
    ["Intent Signals · Web Behaviour", [["Route", "DXB → LHR"], ["Cabin", "Business Class"], ["Dwell Time", "4m 32s on cabin page"], ["Travel Window", "March–May 2026"]]],
    ["AI Scores · VoyagerAI Model", [["Propensity", `${TRAVELLER.propensity}% (High)`], ["Ancillary", `${TRAVELLER.ancillaryScore}/100`], ["Pitch Signal", "18 March · LHR"], ["LTV Estimate", TRAVELLER.ltv]]],
  ];
  return (
    <div>
      <DayBanner day="Day 0 · 10:34 AM" desc="The complete Guest 360 — what VoyagerAI knows about Aisha after 4 seconds" color={E.gold}
        sub="Emirates CRM shows Aisha as an economy passenger worth AED 12,000 lifetime. VoyagerAI's unified profile reveals a corporate traveller worth AED 280,000+. This gap is where revenue is lost — and where VoyagerAI recovers it." />
      <Glass style={{ padding: 18, marginBottom: 14 }} highlight>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${E.gold}, ${E.red})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👩‍⚖️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: E.ink, fontFamily: "Cinzel, serif" }}>{TRAVELLER.name}</div>
            <div style={{ fontSize: 11, color: E.mid, marginTop: 2 }}>{TRAVELLER.job}</div>
            <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
              <Tag color={E.green}>LTV: {TRAVELLER.ltv}</Tag>
              <Tag color={E.gold}>14 March · {TRAVELLER.pricePerTrip}</Tag>
              <Tag color={E.purple}>Apex Capital pitch · 18 March</Tag>
              <Tag color={E.teal}>Propensity: {TRAVELLER.propensity}%</Tag>
            </div>
          </div>
        </div>
        <PropensityBar score={TRAVELLER.propensity} />
      </Glass>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {attrs.map(([title, rows]) => (
          <Glass key={title} style={{ padding: 14 }}>
            <div style={{ fontSize: 8.5, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, color: E.goldDark, marginBottom: 8 }}>{title}</div>
            {rows.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px solid ${E.mist}` }}>
                <span style={{ fontSize: 9, fontFamily: "JBM", color: E.pale }}>{k}</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: E.ink }}>{v}</span>
              </div>
            ))}
          </Glass>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[["⚡ 4 seconds", "Full profile from 5 sources vs. 2–3 days manual"], ["🎯 60% faster", "Prebuilt Sabre connector — no custom integration needed"], ["📊 40% more accurate", "AI propensity vs. manual rule-based segmentation"]].map(([v, d]) => (
          <div key={v} style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}30`, borderRadius: 12, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: E.goldDark, fontFamily: "Cinzel, serif", marginBottom: 5 }}>{v}</div>
            <div style={{ fontSize: 10, color: E.mid }}>{d}</div>
          </div>
        ))}
      </div>
      <Btn onClick={onNext}>Design the Orchestrated Journey →</Btn>
    </div>
  );
}

/* ═══ S8: JOURNEY ORCHESTRATOR ═══ */
function S8({ onNext, add }) {
  useEffect(() => {
    add({ type: "JOURNEY_STARTED", detail: "Aisha enters: corporate_upgrade_nurture_v2 · 9-day journey · 5 channels · Zero overkill logic active", color: E.amber, domain: "jo", time: "Day 0 · EOD" });
    add({ type: "GENAI_CONTENT", detail: "8 personalised content variants generated in 0.3 seconds: name + route + Apex Capital pitch context + arrive-rested hook + Skywards Silver path + lie-flat overnight + urgency", color: E.gold, domain: "cdp", time: "Day 0 · EOD" });
  }, []);

  // Each touchpoint: day, channel domain, label, type
  const touchpoints = [
    { day: 0,   ch: "cdp",    label: "Identity stitched · audiences live",     icon: "⚡", lane: 0, status: "done" },
    { day: 1.5, ch: "google", label: "RLSA + LinkedIn ads",                    icon: "🎯", lane: 1, status: "next" },
    { day: 3,   ch: "email",  label: "Email #1 · arrive-ready",                icon: "📧", lane: 2, status: "queued" },
    { day: 6,   ch: "social", label: "Instagram visual",                       icon: "📱", lane: 3, status: "queued" },
    { day: 6.2, ch: "sms",    label: "SMS · 72h seat hold",                    icon: "💬", lane: 4, status: "queued" },
    { day: 9,   ch: "email",  label: "Email #2 · urgency",                     icon: "📧", lane: 2, status: "queued" },
    { day: 9.1, ch: "emirates", label: "Booked → all channels suppressed",     icon: "✓", lane: 5, status: "goal" },
  ];
  const lanes = [
    { d: "cdp",      label: "VoyagerAI CDP" },
    { d: "google",   label: "Google + LinkedIn" },
    { d: "email",    label: "Email" },
    { d: "social",   label: "Instagram" },
    { d: "sms",      label: "SMS" },
    { d: "emirates", label: "Conversion" },
  ];

  // Helpers: x position from day (0..9 -> 80..680)
  const xFromDay = (d) => 80 + (d / 9) * 600;

  return (
    <div>
      <DayBanner day="Journey Plan" desc="A 9-day, 5-channel orchestrated journey — every touchpoint timed and contextual" color={E.amber}
        sub="If Aisha converts on Day 3, Days 6 and 9 never fire. Zero overkill, zero wasted spend. VoyagerAI stops the moment the job is done." />

      {/* GANTT-STYLE TIMELINE VISUALIZATION */}
      <Glass style={{ padding: "16px 18px 14px", marginBottom: 14 }} highlight>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: E.amber, animation: "blink2 1.5s ease infinite" }} />
          <div style={{ fontSize: 9, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Orchestrated Journey · {TRAVELLER.name} · 9-Day Multi-Channel Plan</div>
        </div>

        <svg viewBox="0 0 720 250" style={{ width: "100%", height: "auto" }}>
          <defs>
            <linearGradient id="laneBg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={E.snow} stopOpacity="0" />
              <stop offset="50%" stopColor={E.snow} stopOpacity="1" />
              <stop offset="100%" stopColor={E.snow} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Day axis grid */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
            <g key={d}>
              <line x1={xFromDay(d)} y1="22" x2={xFromDay(d)} y2="220" stroke={E.mist} strokeWidth="1" strokeDasharray={d % 3 === 0 ? "0" : "2,3"} opacity={d % 3 === 0 ? .8 : .4} />
              <text x={xFromDay(d)} y="14" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700" fill={d % 3 === 0 ? E.goldDark : E.pale}>D{d}</text>
            </g>
          ))}

          {/* Lanes */}
          {lanes.map((ln, i) => {
            const y = 32 + i * 32;
            const dom = DOMAIN[ln.d];
            return (
              <g key={ln.d}>
                <rect x="0" y={y - 14} width="720" height="26" fill={i % 2 === 0 ? E.snow : "#fff"} opacity=".6" />
                <text x="6" y={y + 1} fontSize="9" fontFamily="JetBrains Mono" fontWeight="700" fill={dom.color}>{dom.icon} {ln.label}</text>
                <line x1="76" y1={y} x2="700" y2={y} stroke={E.mist} strokeWidth="1" />
              </g>
            );
          })}

          {/* Connecting flow line through all touchpoints */}
          <path 
            d={touchpoints.map((t, i) => `${i === 0 ? "M" : "L"} ${xFromDay(t.day)} ${32 + t.lane * 32}`).join(" ")}
            fill="none" stroke={E.gold} strokeWidth="2" strokeDasharray="4,4" opacity=".4"
          />

          {/* Touchpoints */}
          {touchpoints.map((t, i) => {
            const x = xFromDay(t.day);
            const y = 32 + t.lane * 32;
            const dom = DOMAIN[t.ch];
            const isGoal = t.status === "goal";
            const isDone = t.status === "done";
            return (
              <g key={i} style={{ animation: `slideUp .4s cubic-bezier(.16,1,.3,1) both`, animationDelay: `${i * .15}s` }}>
                {/* Pulse ring for goal */}
                {isGoal && <circle cx={x} cy={y} r="14" fill="none" stroke={E.green} strokeWidth="1.5" opacity=".4">
                  <animate attributeName="r" from="10" to="22" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from=".5" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>}

                {/* Marker */}
                <circle cx={x} cy={y} r={isGoal ? 11 : 9} fill={isGoal ? E.green : isDone ? E.gold : "#fff"} stroke={dom.color} strokeWidth="2" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize={isGoal ? "11" : "10"}>{t.icon}</text>

                {/* Label */}
                <rect x={x + 13} y={y - 9} rx="4" width={t.label.length * 5.5 + 12} height="18" fill={isGoal ? E.green : "#fff"} stroke={isGoal ? E.green : dom.color} strokeWidth="1" opacity={isGoal ? 1 : .92} />
                <text x={x + 19} y={y + 3} fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="600" fill={isGoal ? "#fff" : E.charcoal}>{t.label}</text>
              </g>
            );
          })}

          {/* Footer: zero-overkill rule */}
          <text x="360" y="240" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fontStyle="italic" fill={E.mid}>If Aisha converts at any touchpoint → all subsequent channels suppressed automatically</text>
        </svg>
      </Glass>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[["Channels", "5", E.gold], ["AI Variants", "8", E.purple], ["Journey Days", "9", E.teal], ["Zero Overkill", "✓", E.green]].map(([l, v, c]) => (
          <Glass key={l} style={{ padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 8, color: E.mid, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: .8 }}>{l}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: c, marginTop: 3, fontFamily: "Cinzel, serif" }}>{v}</div>
          </Glass>
        ))}
      </div>
      <Btn onClick={onNext}>Day 1–2: Watch RLSA + LinkedIn Fire →</Btn>
    </div>
  );
}

/* ═══ SRLSA: DAY 1–2 RLSA + LINKEDIN — RETARGETING IN ACTION ═══ */
function SRLSA({ onNext, add }) {
  useEffect(() => {
    add({ type: "RLSA_BID_WON", detail: "Aisha returns to Google for fare comparison · VoyagerAI's +70% bid modifier on her hashed email wins top SERP placement · Emirates ad served only to her", color: "#1A73E8", domain: "google", time: "Day 1 · 11:42 AM" });
    setTimeout(() => add({ type: "RLSA_IMPRESSION", detail: "Personalised ad rendered: 'Aisha — Skywards member · Your DXB→LHR Business Class for 14 March from AED 18,500'", color: "#1A73E8", domain: "google", time: "Day 1 · 11:42:01" }), 900);
    setTimeout(() => add({ type: "RLSA_CLICK", detail: "Aisha clicks the personalised Emirates ad · CTR 12.4% vs 0.8% on generic ads · Cookie em_4f9a2c recognised, identity restored", color: "#1A73E8", domain: "google", time: "Day 1 · 11:43 AM" }), 2000);
    setTimeout(() => add({ type: "LINKEDIN_IMPRESSION", detail: "Day 2: LinkedIn Matched Audience fires · Sponsored content shown to ek_corp_upgrade_dxb_lhr_highltv segment only · Aisha sees it during lunch scroll", color: "#E1306C", domain: "social", time: "Day 2 · 1:18 PM" }), 3200);
    setTimeout(() => add({ type: "BRAND_LIFT", detail: "Multi-touch reinforcement complete · 3 brand exposures over 48 hours · Email open propensity raised pre-Day 3 · Recall +340% vs single-channel", color: E.gold, domain: "cdp", time: "Day 2 · 1:19 PM" }), 4400);
  }, []);

  return (
    <div>
      <DayBanner day="Day 1–2" desc="The audiences activated in Step 6 win their first impressions — Aisha sees personalised ads, only Aisha" color="#1A73E8"
        sub="On Day 0 (Step 3), Aisha was anonymous on Google — competitors won the paid placements. Now her hashed email is in Google Customer Match and LinkedIn Matched Audiences. VoyagerAI bids +70% specifically for her. Emirates wins the top slot. The ad copy is personalised. Same on LinkedIn." />

      <div style={{ background: E.greenSoft, border: `1.5px solid ${E.green}30`, borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: E.green, fontFamily: "Cinzel, serif", marginBottom: 5 }}>🎯 Day 0 vs. Day 1 — the same Google search, completely different result</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 10, border: `1px solid ${E.red}30` }}>
            <div style={{ fontSize: 9, fontFamily: "JBM", color: E.red, fontWeight: 700, marginBottom: 3 }}>DAY 0 · STEP 3 — BEFORE IDENTITY</div>
            <div style={{ fontSize: 10, color: E.slate, lineHeight: 1.5 }}>Aisha anonymous · Emirates couldn't bid for her specifically · Qatar &amp; Etihad won paid placements with generic offers · Emirates only in organic listing</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 8, padding: 10, border: `1px solid ${E.green}30` }}>
            <div style={{ fontSize: 9, fontFamily: "JBM", color: E.green, fontWeight: 700, marginBottom: 3 }}>DAY 1 · NOW — AFTER IDENTITY</div>
            <div style={{ fontSize: 10, color: E.slate, lineHeight: 1.5 }}>VoyagerAI applies +70% bid modifier on her hashed email · Emirates wins top slot · Ad copy personalised with name, route, date, fare · Competitors invisible to her</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontFamily: "JBM", color: E.mid, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Day 1 · 11:42 AM · Google Search — Aisha checks fares again</div>
        <Chrome url="https://www.google.com/search?q=business+class+dubai+london+march+2026">
          <div style={{ background: "#fff", padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#4285F4" }}>G</span>
              <div style={{ flex: 1, border: "1.5px solid #ddd", borderRadius: 22, padding: "8px 14px", fontSize: 11.5, color: E.ink, boxShadow: "0 1px 6px rgba(0,0,0,.1)" }}>business class dubai london march 2026 price</div>
            </div>

            <div style={{ background: `linear-gradient(135deg, ${E.goldSoft}, #fff)`, border: `2px solid ${E.gold}55`, borderRadius: 10, padding: "14px 14px 12px", marginBottom: 10, position: "relative", boxShadow: `0 4px 18px ${E.goldGlow}` }}>
              <div style={{ position: "absolute", top: -9, left: 12, fontSize: 8, background: E.gold, color: E.charcoal, padding: "2px 9px", borderRadius: 5, fontFamily: "JBM", fontWeight: 700, letterSpacing: .5 }}>⚡ VOYAGERAI RLSA · WON TOP SLOT · +70% BID MODIFIER</div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 4 }}>
                <div style={{ width: 30, height: 30, background: E.red, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✈</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 7.5, background: "#5C0069", color: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 700, fontFamily: "JBM" }}>SPONSORED</span>
                    <span style={{ fontSize: 8, color: E.green, fontFamily: "JBM", fontWeight: 700 }}>● Personalised for you · Skywards member</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#1A0DAB", fontWeight: 700, marginTop: 4 }}>Aisha — Your DXB→LHR Business Class for 14 March</div>
                  <div style={{ fontSize: 10.5, color: "#006621", marginTop: 1 }}>emirates.com/skywards/exclusive · Skywards member rate</div>
                  <div style={{ fontSize: 11, color: E.slate, marginTop: 4, lineHeight: 1.5 }}>EK007 · 14 March · Lie-flat overnight · Premium dining · Chauffeur · Lounge · From <strong>AED 18,500</strong> · <strong style={{ color: E.goldDark }}>Hold this fare →</strong></div>
                </div>
              </div>
            </div>

            <div style={{ padding: "8px 0", borderBottom: `1px solid ${E.mist}`, opacity: .6 }}>
              <span style={{ fontSize: 7.5, background: "#5C0069", color: "#fff", padding: "2px 7px", borderRadius: 4, fontWeight: 700, fontFamily: "JBM" }}>SPONSORED</span>
              <div style={{ fontSize: 12, color: "#1A0DAB", fontWeight: 600, marginTop: 4 }}>Qatar Airways Qsuites — Dubai to London</div>
              <div style={{ fontSize: 10, color: "#006621" }}>qatarairways.com</div>
              <div style={{ fontSize: 10, color: E.mid, marginTop: 2 }}>Generic Business Class offer · No personal context</div>
            </div>
            <div style={{ padding: "8px 0", borderBottom: `1px solid ${E.mist}`, opacity: .6 }}>
              <span style={{ fontSize: 7.5, background: "#5C0069", color: "#fff", padding: "2px 7px", borderRadius: 4, fontWeight: 700, fontFamily: "JBM" }}>SPONSORED</span>
              <div style={{ fontSize: 12, color: "#1A0DAB", fontWeight: 600, marginTop: 4 }}>Etihad Business Studio · Dubai to Heathrow</div>
              <div style={{ fontSize: 10, color: "#006621" }}>etihad.com</div>
              <div style={{ fontSize: 10, color: E.mid, marginTop: 2 }}>Generic Business cabin offer · No personal context</div>
            </div>

            <div style={{ marginTop: 10, padding: "8px 12px", background: E.greenSoft, borderRadius: 8, border: `1px solid ${E.green}30` }}>
              <div style={{ fontSize: 9.5, fontFamily: "JBM", color: E.green, fontWeight: 700 }}>✅ Aisha clicks the Emirates ad · CTR 12.4% vs 0.8% on generic ads · Lands on tailored offer page · Identity already restored</div>
            </div>
          </div>
        </Chrome>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontFamily: "JBM", color: E.mid, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Day 2 · 1:18 PM · LinkedIn — Lunchtime scroll</div>
        <Chrome url="https://www.linkedin.com/feed/">
          <div style={{ background: "#F3F2EF", padding: "14px 16px" }}>
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #DDD", overflow: "hidden", marginBottom: 8 }}>
              <div style={{ padding: "10px 14px 8px", display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 4, background: E.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✈</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: E.ink }}>Emirates · Following</div>
                  <div style={{ fontSize: 9.5, color: E.mid }}>2,481,332 followers · <span style={{ color: "#0073B1", fontWeight: 600 }}>Promoted</span></div>
                  <div style={{ fontSize: 9, color: E.pale }}>Day 2 · 1:18 PM</div>
                </div>
              </div>
              <div style={{ padding: "0 14px 12px", fontSize: 11.5, color: E.ink, lineHeight: 1.6 }}>For partners and senior counsel flying DXB→LHR for client meetings: <strong>arrive ready, not wrecked</strong>. Business Class on the overnight EK007. Lie-flat. Multi-course dining. Chauffeur both ends. Land at 6:45 AM, take your meeting at 9.</div>
              <div style={{ background: `linear-gradient(160deg, ${E.charcoal}, ${E.redDark})`, padding: "26px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 8, fontFamily: "JBM", color: E.goldLight, letterSpacing: 2, textTransform: "uppercase" }}>Emirates · Business Class</div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "Cinzel, serif", color: E.white, marginTop: 4 }}>Lead the room.</div>
                  <div style={{ fontSize: 10.5, color: E.goldLight, marginTop: 2 }}>DXB → LHR · Lie-flat overnight</div>
                </div>
                <div style={{ fontSize: 36 }}>🛏️</div>
              </div>
              <div style={{ padding: "10px 14px", display: "flex", gap: 12, fontSize: 11, color: E.mid, borderTop: "1px solid #EEE" }}>
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>🔁 Repost</span>
                <span style={{ marginLeft: "auto", color: "#0073B1", fontWeight: 600 }}>Learn more →</span>
              </div>
            </div>
            <div style={{ padding: "8px 12px", background: "#E8F3FF", borderRadius: 8, border: "1px solid #0073B130" }}>
              <div style={{ fontSize: 9, fontFamily: "JBM", color: "#0073B1", fontWeight: 700 }}>⚡ Targeting: ek_corp_upgrade_dxb_lhr_highltv audience · Existing customers excluded · Served only to identified high-LTV economy loyalists like Aisha</div>
            </div>
          </div>
        </Chrome>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[["+70% bid won", "Personalised ad takes top SERP placement on her search", E.green], ["12.4% CTR", "vs 0.8% on generic competitor ads · 15× lift", E.gold], ["+340% recall", "Multi-touch reinforcement raises Day 3 email open propensity", E.purple]].map(([v, d, c]) => (
          <div key={v} style={{ background: `${c}10`, border: `1.5px solid ${c}30`, borderRadius: 12, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: "Cinzel, serif", marginBottom: 5 }}>{v}</div>
            <div style={{ fontSize: 10, color: E.mid }}>{d}</div>
          </div>
        ))}
      </div>

      <InfoBox icon="💡" title="Why this is the moment that matters" color={E.gold}
        body="Step 6 was about activating the audiences. Step 9 is where they earn their keep. Aisha sees Emirates exactly when she's open to seeing them — searching for fares again, scrolling LinkedIn at lunch — with copy that knows who she is and what she wants. By the time the Day 3 email arrives, she's already had 2 brand-positive impressions. The conversion path is being paved." />

      <Btn onClick={onNext} style={{ marginTop: 12 }}>Day 3: Personalised Email →</Btn>
    </div>
  );
}

/* ═══ S9: EMAIL #1 ═══ */
function S9({ onNext, add }) {
  useEffect(() => {
    add({ type: "EMAIL_SENT", detail: "Email #1: 'Aisha, arrive ready for your Apex Capital pitch — Business Class, 14 March' · GenAI authored · 8 personalised signals · 08:00 AM", color: E.purple, domain: "email", time: "Day 3 · 08:00 AM" });
    setTimeout(() => add({ type: "EMAIL_OPEN", detail: "Opened · 08:47 AM · Dubai · iPhone 15 · Open rate: 56% (top quartile for triggered emails · travel industry avg 22-30% per MailerLite 2025) · No click", color: E.purple, domain: "email", time: "Day 3 · 08:47 AM" }), 1800);
    setTimeout(() => add({ type: "NO_CLICK", detail: "Open but no click. JO inference: decision-stage review, likely to act at desktop. Day 6 escalation queued: Instagram + SMS seat hold for 14 March.", color: E.amber, domain: "jo", time: "Day 3 · 08:47 AM" }), 3400);
  }, []);
  return (
    <div>
      <DayBanner day="Day 3 · 08:00 AM" desc="GenAI writes Aisha a 1:1 email — speaking directly to the pitch she cannot afford to lose" color={E.purple}
        sub="Every detail earns its place: her name, the DXB→LHR route, the 14 March flight date, the Apex Capital pitch on 18 March, lie-flat sleep, and the Skywards Silver path. GenAI generates this in 0.3 seconds from 8 personal data signals." />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <TZone domain="email" active note="GenAI authored"><span style={{ fontSize: 10, color: E.slate }}>8 personalised signals · Triggered email open ~56% (travel industry avg 22-30%) · GenAI 60% faster than manual</span></TZone>
        <TZone domain="jo" active note="Open, no click"><span style={{ fontSize: 10, color: E.slate }}>JO detects mobile open → queues Instagram visual + SMS seat hold for 14 March</span></TZone>
      </div>
      <Chrome url={`Gmail · ${TRAVELLER.email}`}>
        <div style={{ background: "#fff" }}>
          <div style={{ background: "#F6F8FC", padding: "10px 18px", borderBottom: `1px solid ${E.mist}` }}>
            <div style={{ fontSize: 8.5, fontFamily: "JBM", color: E.pale, marginBottom: 4 }}>FROM: reservations@emirates.com · TO: {TRAVELLER.email} · Day 3 · 08:00 AM</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: E.ink }}>Aisha — arrive ready for your 18 March pitch. Business Class on 14 March. ✈️</div>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <div style={{ background: `linear-gradient(160deg, ${E.charcoal}, ${E.redDark})`, borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
              <div style={{ fontSize: 8, fontFamily: "JBM", color: E.goldLight, letterSpacing: 2, marginBottom: 5, textTransform: "uppercase" }}>Emirates Business Class</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "Cinzel, serif", color: E.white }}>Dubai <span style={{ color: E.goldLight }}>→</span> London Heathrow</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 3 }}>EK007 · 14 March 2026 · Business Class · From <strong style={{ color: E.goldLight }}>AED 18,500</strong> return</div>
            </div>
            <p style={{ fontSize: 12.5, color: E.slate, lineHeight: 1.75, marginBottom: 14 }}>
              <strong>Dear Aisha,</strong><br /><br />
              On 18 March you have the floor in London. Don't spend the night before in a reclined economy seat.<br /><br />
              In Business Class, you arrive at the Apex Capital pitch <strong>rested, sharp, and ready</strong> — you sleep on the lie-flat bed, work at altitude in your own private suite, step off the plane straight into a chauffeur drive to your hotel. <strong>Seven hours that don't cost you the pitch.</strong>
            </p>
            <div style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}40`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, marginBottom: 8 }}>YOUR PERSONALISED CORPORATE OFFER · 14 MARCH 2026</div>
              {[["Flight", "EK007 · DXB 02:35 → LHR 06:45 · Lands rested for the day"], ["Cabin", "Business Class · Fully lie-flat bed · Do Not Disturb mode"], ["Fare", "AED 18,500 return · All-inclusive corporate rate"], ["Sleep", "Premium bedding · Sleep mask · Wake-30-min-before-landing service"], ["Extras", "Chauffeur drive both ends · Business Lounge · 40kg baggage"], ["Skywards", "Earn 150% miles · One booking from Silver tier"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10, padding: "4px 0", borderBottom: `1px solid ${E.gold}20`, fontSize: 11 }}>
                  <span style={{ color: E.pale, fontFamily: "JBM", fontSize: 8.5, minWidth: 52 }}>{k}</span>
                  <span style={{ color: E.ink, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11.5, color: E.mid, marginBottom: 14, lineHeight: 1.6 }}>This booking puts you <strong style={{ color: E.goldDark }}>one flight from Skywards Silver</strong> — lounge access and priority boarding for every future trip. London is clearly going to be a recurring destination.</p>
            <Btn onClick={onNext}>Continue to Day 6 →</Btn>
            <div style={{ marginTop: 12, padding: "8px 12px", background: E.purpleSoft, borderRadius: 8, border: `1px solid ${E.purple}20` }}>
              <div style={{ fontSize: 8.5, fontFamily: "JBM", color: E.purple, fontWeight: 700 }}>⚡ GenAI signals used: name · 14 March flight date · Apex Capital pitch on 18 March · DXB→LHR route · sleep mode preference · lie-flat overnight · Skywards Silver path · arrive-ready hook · Generated in 0.3 seconds</div>
            </div>
          </div>
        </div>
      </Chrome>
    </div>
  );
}

/* ═══ S10: DAY 6 SOCIAL + SMS ═══ */
function S10({ onNext, add }) {
  useEffect(() => {
    add({ type: "IG_AD", detail: "Instagram: 'Arrive. Don't Just Land.' Business Class cinematic creative · Dubai corporate targeting · Aisha only", color: "#E1306C", domain: "social", time: "Day 6 · 12:30 PM" });
    setTimeout(() => add({ type: "SMS_SENT", detail: "SMS: '72hr corporate rate hold — only 4 Business Class seats on EK007 DXB→LHR March 14. Reply HOLD.'", color: E.teal, domain: "sms", time: "Day 6 · 1:00 PM" }), 1500);
    setTimeout(() => add({ type: "SMS_REPLY", detail: "Aisha replies 'HOLD' — 4 minutes after SMS received. VoyagerAI: propensity updated 89% → 94%. JO arms Day 9 urgency email.", color: E.teal, domain: "sms", time: "Day 6 · 1:04 PM" }), 3200);
    setTimeout(() => add({ type: "JOURNEY_UPDATE", detail: "High-intent signal logged · Day 9 urgency email armed with real seat countdown · Propensity: 94%", color: E.gold, domain: "cdp", time: "Day 6 · 1:04 PM" }), 4600);
  }, []);
  return (
    <div>
      <DayBanner day="Day 6" desc="Email opened but no click — Journey Orchestrator escalates: Instagram visual + SMS urgency" color="#E1306C"
        sub="Different people convert on different channels and triggers. Aisha is a visual thinker who responds to real urgency. VoyagerAI tests both simultaneously — a cinematic Instagram ad and a concrete seat hold via SMS. She replies to the SMS in 4 minutes." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: "JBM", color: E.mid, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Instagram · 12:30 PM · Personalised Visual</div>
          <Glass style={{ overflow: "hidden" }}>
            <div style={{ background: "#000", padding: "9px 12px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #222" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${E.red}, ${E.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✈</div>
              <div><div style={{ fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: "Cinzel, serif" }}>emirates</div><div style={{ fontSize: 8, color: "#888" }}>Sponsored · For you</div></div>
            </div>
            <div style={{ background: `linear-gradient(170deg, ${E.charcoal}, #120020, ${E.redDark})`, height: 180, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 28 }}>🛏️</div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "Cinzel, serif", color: E.white, textAlign: "center" }}>Arrive.<br /><span style={{ color: E.goldLight }}>Don't Just Land.</span></div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,.35)", fontFamily: "JBM", letterSpacing: 1 }}>DUBAI · LONDON · BUSINESS CLASS</div>
            </div>
            <div style={{ background: "#000", padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "#fff", marginBottom: 3 }}>7 hours. Lie-flat. Land at Heathrow rested and ready for the pitch on 18 March. From <strong style={{ color: E.goldLight }}>AED 18,500</strong>.</div>
              <div style={{ fontSize: 8.5, fontFamily: "JBM", color: "#E1306C", fontWeight: 700, marginTop: 4 }}>⚡ VoyagerAI: corporate upgrade prospects only · Not a generic ad</div>
            </div>
          </Glass>
        </div>
        <div>
          <div style={{ fontSize: 9, fontFamily: "JBM", color: E.mid, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>SMS · 1:00 PM · Real Urgency, Real Seat</div>
          <Glass style={{ padding: 14, background: E.snow }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: E.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>✈</div>
              <div style={{ background: "#fff", border: `1px solid ${E.mist}`, borderRadius: "2px 14px 14px 14px", padding: "10px 12px", fontSize: 11, color: E.ink, lineHeight: 1.7 }}>
                <div style={{ fontSize: 8, fontFamily: "JBM", color: E.red, fontWeight: 700, marginBottom: 4 }}>EMIRATES · 1:00 PM</div>
                <strong>Aisha</strong>, only <strong>4 Business Class seats</strong> remain on EK007 DXB→LHR for March 14.<br /><br />
                Reply <strong>HOLD</strong> to reserve at our 72-hour <strong>corporate rate</strong>. <strong style={{ color: E.goldDark }}>AED 18,500</strong> return · Lie-flat · Chauffeur included.<br />
                <span style={{ fontSize: 9, color: E.pale }}>Reply STOP to opt out.</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ background: E.teal, borderRadius: "14px 2px 14px 14px", padding: "7px 13px" }}>
                <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>HOLD</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: E.mist, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>👩‍⚖️</div>
            </div>
            <div style={{ padding: "8px 10px", background: E.tealSoft, borderRadius: 8, border: `1px solid ${E.teal}25` }}>
              <div style={{ fontSize: 9, fontFamily: "JBM", color: E.teal, fontWeight: 700 }}>✓ Reply received in 4 minutes · Propensity: 89% → 94% · JO arms Day 9 urgency email with seat countdown</div>
            </div>
          </Glass>
        </div>
      </div>
      <Btn onClick={onNext} style={{ marginTop: 14 }}>Day 9: Final Conversion →</Btn>
    </div>
  );
}

/* ═══ S11: CONVERSION ═══ */
function S11({ onNext, add }) {
  const [p, setP] = useState(0);
  const doConvert = () => {
    setP(1);
    setTimeout(() => {
      setP(2);
      add({ type: "CONVERTED", detail: "Aisha books EK007 DXB→LHR Business Class · 14 March 2026 · AED 18,500 · Confirmed", color: E.green, domain: "emirates", time: "Day 9 · 09:12 AM" });
      add({ type: "SKYWARDS", detail: "Skywards Blue → Silver fast-tracked after this booking · Corporate account created · Future London bookings flagged as priority", color: E.gold, domain: "cdp", time: "Day 9 · 09:12 AM" });
      add({ type: "SUPPRESSED", detail: "ALL acquisition channels suppressed immediately — no more RLSA, no more Instagram, no more SMS. She is a customer now.", color: E.green, domain: "jo", time: "Day 9 · 09:12 AM" });
      add({ type: "CAC_LOGGED", detail: "CAC: AED 310 vs. AED 1,400 traditional · Saving: 78% · Immediate ROI: 60x · LTV signal: AED 280K+ over relationship", color: E.green, domain: "cdp", time: "Day 9 · 09:12 AM" });
      add({ type: "POST_BOOKING", detail: "Post-booking journey triggered: lounge day-pass · chauffeur upgrade · Skywards Silver fast-track · pre-trip cabin brief · April 2026 LHR fare alert flagged", color: E.amber, domain: "jo", time: "Day 9 · 09:13 AM" });
    }, 2000);
  };
  return (
    <div>
      <DayBanner day="Day 9 · 09:12 AM" desc="The urgency email lands — her seat hold expires at 1pm. She books." color={E.green}
        sub="The right message at the right moment. She texted HOLD 3 days ago — that intent has only sharpened. The pitch is 4 days away. 2 seats left. She remembers the last time she flew economy to London. She books." />
      <Chrome url="https://www.emirates.com/ae/english/booking/confirmation">
        <div style={{ padding: "22px 22px", background: "#fff" }}>
          {p === 0 && (
            <div>
              <div style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}40`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
                <div style={{ fontSize: 9.5, fontFamily: "JBM", color: E.goldDark, fontWeight: 700, marginBottom: 8 }}>📧 DAY 9 · 09:00 AM — URGENCY EMAIL</div>
                <div style={{ fontSize: 13, color: E.ink, lineHeight: 1.75 }}>
                  <strong>Aisha</strong> — your 72-hour corporate rate hold on EK007 expires at <strong style={{ color: E.red }}>1:04 PM today</strong>.<br /><br />
                  <strong>Only 2 Business Class seats</strong> remain on the 14 March DXB→LHR flight. Your Apex Capital pitch is 4 days later.<br /><br />
                  Book now. Land rested. Lead the room.
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: E.green, fontFamily: "Cinzel, serif" }}>AED 18,500</div>
                  <div style={{ fontSize: 11, color: E.mid }}>EK007 · 14 March 2026 · Business Class return · Lie-flat · Chauffeur · Lounge · 40kg</div>
                </div>
              </div>
              <Btn onClick={doConvert}>▶ Aisha Confirms — Books the Flight</Btn>
            </div>
          )}
          {p === 1 && <div style={{ padding: 24, textAlign: "center" }}><div style={{ fontSize: 14, color: E.gold, fontFamily: "Cinzel, serif", animation: "blink2 .8s ease infinite" }}>⚡ Confirming Business Class booking…</div></div>}
          {p >= 2 && (
            <div style={{ animation: "slideUp .5s cubic-bezier(.16,1,.3,1)" }}>
              <div style={{ background: E.greenSoft, border: `2px solid ${E.green}40`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: 24 }}>🎉</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: E.green, fontFamily: "Cinzel, serif" }}>Booking Confirmed</div>
                    <div style={{ fontSize: 10, color: E.mid, fontFamily: "JBM", marginTop: 2 }}>Ref: EK007-MAR14-BC · Issued instantly</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: E.green, fontFamily: "Cinzel, serif" }}>AED 18,500</div>
                    <div style={{ fontSize: 9, color: E.mid, fontFamily: "JBM" }}>charged to Al Tamimi corporate</div>
                  </div>
                </div>
                <div style={{ background: "#fff", border: `1.5px solid ${E.green}30`, borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "Cinzel, serif", color: E.charcoal }}>DXB → LHR</div>
                      <div style={{ fontSize: 11, color: E.slate, fontWeight: 600, marginTop: 2 }}>14 March 2026 · Saturday</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, fontFamily: "JBM", fontWeight: 700, color: E.green, background: E.greenSoft, padding: "3px 9px", borderRadius: 6, display: "inline-block" }}>✓ CONFIRMED</div>
                      <div style={{ fontSize: 9, color: E.pale, fontFamily: "JBM", marginTop: 4 }}>EK007</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                    {[["Departure", "DXB · 02:35 (14 Mar)"], ["Arrival", "LHR · 06:45 (14 Mar)"], ["Cabin", "Business Class · Lie-flat"], ["Duration", "7h 30m · Non-stop"], ["Sleep", "Do Not Disturb mode"], ["Extras", "Chauffeur · Lounge · 40kg"]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px solid ${E.mist}`, fontSize: 10 }}>
                        <span style={{ color: E.pale, fontFamily: "JBM", fontSize: 8.5 }}>{k}</span>
                        <span style={{ fontWeight: 600, color: E.ink }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ background: E.purpleSoft, border: `1.5px solid ${E.purple}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: E.purple, fontFamily: "Cinzel, serif", marginBottom: 6 }}>🔮 LTV Signal — This Booking Opens the Relationship</div>
                <div style={{ fontSize: 10.5, color: E.slate, lineHeight: 1.6 }}>VoyagerAI projects this is the first of <strong>5–7 Business Class bookings to LHR over 18 months</strong> based on her Apex Capital pattern, plus DXB→SIN, DXB→FRA potential. Aisha is now flagged as a <strong style={{ color: E.purple }}>Tier 1 retention asset</strong>. Post-booking journey: lounge day-pass · chauffeur upgrade · April fare alert · Skywards Silver fast-track on next flight.</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[["CAC (VoyagerAI)", "AED 310", E.green], ["CAC (Traditional)", "AED 1,400", E.red], ["CAC Saving", "78%", E.gold], ["Booking Value", "AED 18,500", E.teal], ["Immediate ROI", "60x", E.green], ["Projected LTV", "AED 280K+", E.purple]].map(([l, v, c]) => (
                  <Glass key={l} style={{ padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 7.5, color: E.mid, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: .8 }}>{l}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: c, marginTop: 3, fontFamily: "Cinzel, serif" }}>{v}</div>
                  </Glass>
                ))}
              </div>
              <InfoBox icon="✅" title="Zero overkill — all channels suppressed the moment she converted" color={E.green}
                body="No retargeting ad follows Aisha around the web. No more emails. No more Instagram. VoyagerAI switches her instantly into the post-booking journey: lounge day-pass offer, chauffeur upgrade, Skywards Silver fast-track, and an April fare alert for her next likely London trip. The engine that found her now retains her." />
              <Btn onClick={onNext} style={{ marginTop: 12 }}>View CAC Dashboard →</Btn>
            </div>
          )}
        </div>
      </Chrome>
    </div>
  );
}

/* ═══ S12: CAC DASHBOARD ═══ */
function S12({ add }) {
  useEffect(() => {
    add({ type: "COMPLETE", detail: "9 days · 5 channels · Economy loyalist → Business Class booking · CAC: AED 310 · Immediate ROI: 60x · Projected LTV: AED 280K+", color: E.green, domain: "cdp", time: "Day 9 · EOD" });
  }, []);
  const journey = [
    { day: "Day 0", ev: "Anonymous visit — 4m 32s on Business Class cabin page. VoyagerAI flags HIGH INTENT. Cookie set.", d: "emirates" },
    { day: "Day 0", ev: "Leaves to Google — Emirates invisible. Qatar & Etihad win paid placements. She clicks Emirates organic.", d: "google" },
    { day: "Day 0", ev: "Returns to site via organic click. Fills fare alert form. Email captured — identity key obtained.", d: "emirates" },
    { day: "Day 0", ev: "VoyagerAI queries Sabre PSS using email → Skywards found → 4 flights · Propensity: 89% in 4.1 seconds.", d: "pss" },
    { day: "Day 0", ev: "Identity stitched: Google Customer Match + LinkedIn + Instagram. RLSA bid +70% for Aisha only.", d: "cdp" },
    { day: "Day 1–2", ev: "RLSA + LinkedIn: 'Big pitch in London? Arrive Ready.' CTR: 4.2% vs 0.8% generic creative.", d: "google" },
    { day: "Day 3", ev: "📧 Email #1: Apex Capital pitch context + 14 March flight + lie-flat overnight + Skywards Silver path. Opened, no click.", d: "email" },
    { day: "Day 6", ev: "📱 Instagram: 'Arrive. Don't Just Land.' · 💬 SMS holds 14 March seat → Aisha replies HOLD in 4 min. Propensity: 94%.", d: "social" },
    { day: "Day 9", ev: "📧 Urgency: 2 seats left, hold expires 1pm → Aisha books EK007 14 March Business Class. AED 18,500. 🎉", d: "emirates" },
    { day: "Day 9", ev: "ALL channels suppressed · Post-booking: lounge offer · Skywards Silver · April fare alert flagged · Retained.", d: "jo" },
  ];
  return (
    <div style={{ animation: "slideUp .6s cubic-bezier(.16,1,.3,1)" }}>
      <DayBanner day="Results" desc="Economy loyalist → Business Class booking · 9 days · AED 310 CAC · 78% lower than traditional" color={E.green}
        sub="Identify the right passenger. Score their intent accurately. Reach them across every channel with content that speaks to their real situation. Convert them on the booking that opens the relationship. This is VoyagerAI." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, marginBottom: 14 }}>
        {[["CAC", "AED 310", E.green], ["Traditional", "AED 1,400", E.red], ["Saving", "78%", E.gold], ["Booking Value", "AED 18,500", E.teal], ["LTV Signal", "AED 280K+", E.purple], ["Days", "9", E.amber]].map(([l, v, c]) => (
          <Glass key={l} style={{ padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 6.5, color: E.mid, fontFamily: "JBM", textTransform: "uppercase", letterSpacing: .5 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: c, marginTop: 3, fontFamily: "Cinzel, serif" }}>{v}</div>
          </Glass>
        ))}
      </div>
      <Glass style={{ padding: 18, marginBottom: 14, display: "flex", gap: 16, alignItems: "center" }} highlight>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${E.gold}, ${E.red})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👩‍⚖️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: E.ink, fontFamily: "Cinzel, serif" }}>{TRAVELLER.name}</div>
          <div style={{ fontSize: 11, color: E.goldDark, fontFamily: "JBM", marginTop: 2 }}>{TRAVELLER.job}</div>
          <div style={{ fontSize: 11, color: E.mid, marginTop: 2 }}>4× economy loyalist → Business Class on 14 March in 9 days · Tier 1 retention asset · Apex Capital pattern flagged</div>
          <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap" }}>
            <Tag color={E.green}>Converted ✓ · 14 March booked</Tag>
            <Tag color={E.gold}>Skywards → Silver next flight</Tag>
            <Tag color={E.teal}>CAC: AED 310</Tag>
            <Tag color={E.red}>Immediate ROI: 60x</Tag>
            <Tag color={E.purple}>Projected LTV: AED 280K+</Tag>
          </div>
        </div>
      </Glass>
      <Glass style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ fontFamily: "JBM", fontSize: 8.5, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, fontWeight: 700, color: E.ink }}>Complete Orchestrated Journey — Every Step</div>
        {journey.map((j, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start", animation: "slideUp .3s cubic-bezier(.16,1,.3,1) both", animationDelay: `${i * .04}s` }}>
            <div style={{ minWidth: 46, fontSize: 8, color: E.pale, fontFamily: "JBM", paddingTop: 2 }}>{j.day}</div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: DOMAIN[j.d].color, flexShrink: 0, marginTop: 3 }} />
            <div style={{ flex: 1, fontSize: 10.5, color: E.slate, lineHeight: 1.45 }}>{j.ev}</div>
            <span style={{ fontSize: 7, fontFamily: "JBM", fontWeight: 600, color: DOMAIN[j.d].color, background: DOMAIN[j.d].bg, padding: "1px 5px", borderRadius: 5, whiteSpace: "nowrap" }}>{DOMAIN[j.d].icon}</span>
          </div>
        ))}
      </Glass>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[["⚡ Prebuilt PSS Connector", "Sabre/Amadeus integration in weeks, not months. PSS data live from day one. No custom API engineering required.", E.green], ["🎯 AI Propensity Engine", "89% accuracy on upgrade intent. 40% more relevant than manual segmentation. Unified profile in 4.1 seconds from first-party email.", E.gold], ["🔄 GenAI Content at Scale", "8 personalised variants across 5 channels in 0.3 seconds. 60% faster than manual. Every message earns its place in the journey.", E.purple]].map(([t, d, c]) => (
          <div key={t} style={{ background: `${c}08`, border: `1.5px solid ${c}30`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c, fontFamily: "Cinzel, serif", marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 10.5, color: E.mid, lineHeight: 1.5 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ background: E.goldSoft, border: `1.5px solid ${E.gold}40`, borderRadius: 12, padding: "14px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: E.goldDark, fontFamily: "Cinzel, serif", marginBottom: 8 }}>📊 The Emirates Scale Opportunity — Across 2.3M Economy Loyalists</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[["Economy loyalists with upgrade propensity > 70%", "2.3M passengers currently invisible to Emirates"], ["CAC saving per converted customer", "AED 1,090 saved vs. traditional digital campaigns"], ["Revenue if just 1% converts to Business Class", "AED 1.27B in incremental Business Class revenue"]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontWeight: 700, color: E.goldDark, marginBottom: 3, fontFamily: "JBM", fontSize: 8.5, textTransform: "uppercase" }}>{k}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: E.ink }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <Glass style={{ padding: "14px 18px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 14 }}>📊</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: E.ink, fontFamily: "Cinzel, serif" }}>Methodology &amp; Data Sources</div>
            <div style={{ fontSize: 9, color: E.mid, fontFamily: "JBM" }}>Every claim in this demo, audited and sourced</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 10, color: E.slate, lineHeight: 1.55 }}>
          <div>
            <div style={{ fontSize: 8.5, fontFamily: "JBM", fontWeight: 700, color: E.green, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>✓ Verified Public Data</div>
            <div>• Skywards 37M members — Emirates official (2025)</div>
            <div>• EK007 schedule DXB→LHR — Emirates timetable</div>
            <div>• Travel email open rate 22-30% — MailerLite 2025</div>
            <div>• RLSA 60% CPA reduction — Etihad Airways case study</div>
            <div>• Sabre PSS, Clearbit, ZoomInfo, Bombora — production-grade APIs</div>
          </div>
          <div>
            <div style={{ fontSize: 8.5, fontFamily: "JBM", fontWeight: 700, color: E.amber, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>⚠ Illustrative · For Demo</div>
            <div>• Aisha Al-Rashidi — fictional persona</div>
            <div>• Apex Capital mandate, propensity 89%, AED 280K LTV — illustrative</div>
            <div>• 12,400 weekly in-market — illustrative segment sizing</div>
            <div>• AED 1,000–1,500 industry CAC range from First Page Sage benchmark</div>
            <div>• AED 310 VoyagerAI CAC — modelled outcome based on 60-78% reduction range</div>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: "8px 11px", background: E.snow, borderRadius: 8, border: `1px dashed ${E.mist}` }}>
          <div style={{ fontSize: 9.5, color: E.mid, lineHeight: 1.55 }}><strong style={{ color: E.slate }}>Pre-pilot calibration:</strong> All illustrative figures must be validated against Emirates' actual Skywards segmentation, historical CAC, and PSS data before any production deployment. This demo shows the architectural pattern and expected order-of-magnitude impact, not Emirates-specific numbers.</div>
        </div>
      </Glass>

      <div style={{ background: `linear-gradient(135deg, ${E.charcoal}, ${E.redDark})`, borderRadius: 16, padding: "22px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 9, fontFamily: "JBM", color: E.goldLight, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Powered by VoyagerAI · Coforge</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: E.white, fontFamily: "Cinzel, serif", marginBottom: 5 }}>✈️ Economy Loyalist → Business Class Booker · 9 Days · 78% Lower CAC · AED 280K+ LTV Unlocked</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginBottom: 12 }}>Anonymous Browse → Returns to Site → Form Fill → PSS Enrich (4.1s) → Identity Stitched → RLSA → Email → Instagram → SMS Hold → Urgency → 14 March Booked → Suppressed → Retained</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {[["CAC Reduced", "78%"], ["Booking Value", "AED 18,500"], ["LTV Unlocked", "AED 280K+"], ["Profile Built In", "4.1 Seconds"]].map(([l, v]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: E.goldLight, fontFamily: "Cinzel, serif" }}>{v}</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,.4)", fontFamily: "JBM", textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function App() {
  const [step, setStep] = useState(0);
  const [events, setEvents] = useState([]);
  const add = (e) => setEvents(p => [...p, e]);
  const next = () => setStep(p => Math.min(p + 1, STEPS.length - 1));
  const pages = [
    <S1 onNext={next} add={add} />, <S2 onNext={next} add={add} />, <S3 onNext={next} add={add} />,
    <S4 onNext={next} add={add} />, <S5 onNext={next} add={add} />, <S6 onNext={next} add={add} />,
    <S7 onNext={next} add={add} />, <S8 onNext={next} add={add} />, <SRLSA onNext={next} add={add} />,
    <S9 onNext={next} add={add} />, <S10 onNext={next} add={add} />, <S11 onNext={next} add={add} />,
    <S12 add={add} />,
  ];
  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: E.snow, minHeight: "100vh", color: E.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink2{0%,100%{opacity:1}50%{opacity:.3}}
        *{box-sizing:border-box;margin:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${E.faint};border-radius:4px}
        button:hover{opacity:.88;transform:translateY(-1px)}button:active{transform:translateY(0)}
        code{font-family:"JetBrains Mono",monospace;font-size:.9em}
      `}</style>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 10% 5%, ${E.goldGlow}, transparent 60%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 40% at 90% 90%, ${E.redGlow}, transparent 55%)` }} />
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 24px", borderBottom: `1px solid ${E.mist}`, background: "rgba(255,255,255,.93)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 22, background: E.red, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✈</div>
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "Cinzel, serif", color: E.charcoal, letterSpacing: 2 }}>EMIRATES</div>
          </div>
          <div style={{ width: 1, height: 16, background: E.gold + "60" }} />
          <div style={{ fontSize: 10.5, fontFamily: "JBM", color: E.goldDark, letterSpacing: 1, fontWeight: 700 }}>× VoyagerAI</div>
          <span style={{ fontSize: 10, color: E.mid }}>Economy to Business Class Conversion · Low-Cost Customer Acquisition Demo</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {step > 0 && <button onClick={() => setStep(p => p - 1)} style={{ background: "transparent", color: E.mid, border: `1px solid ${E.mist}`, padding: "4px 12px", borderRadius: 7, cursor: "pointer", fontSize: 11 }}>←</button>}
          <button onClick={() => { setStep(0); setEvents([]); }} style={{ background: "transparent", color: E.goldDark, border: `1px solid ${E.gold}40`, padding: "4px 12px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>↺ Reset</button>
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 0, padding: "5px 24px", overflowX: "auto", background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${E.mist}` }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{ display: "flex", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "5px 7px", fontSize: 9.5, color: i === step ? E.goldDark : i < step ? E.ink : E.pale, fontWeight: i === step ? 700 : 400, whiteSpace: "nowrap", borderBottom: i === step ? `2px solid ${E.gold}` : "2px solid transparent", transition: "all .2s" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", fontSize: 7, fontFamily: "JBM", fontWeight: 700, background: i === step ? E.gold : i < step ? E.green : E.mist, color: i <= step ? (i === step ? E.charcoal : "#fff") : E.pale }}>{s.n}</span>
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 270px", gap: 14, padding: "14px 24px 48px", alignItems: "start" }}>
        <div key={step} style={{ animation: "slideUp .45s cubic-bezier(.16,1,.3,1)" }}>{pages[step]}</div>
        <CDPPanel events={events} />
      </div>
    </div>
  );
}
