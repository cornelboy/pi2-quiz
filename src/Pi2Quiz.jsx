import { useState, useEffect, useReducer, useCallback, useRef, useMemo } from "react";

// Load Geist fonts from CDN + Inter fallback
["https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.css",
  "https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/style.css",
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
].forEach(href => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l); });

// Brand design tokens
const BRAND = {
  dark: "#1A1A1A", light: "#FAF9F0", lavender: "#D8D2FA", teal: "#D5FAD3", error: "#E57373",
  sans: "'Geist Sans', 'Inter', system-ui, -apple-system, sans-serif",
  mono: "'Geist Mono', 'JetBrains Mono', monospace",
};

// ─── THEME SYSTEM — dark/light mode tokens ───────────────────────────────────
const THEME_TOKENS = {
  dark: {
    mode: "dark",
    pageBg: "#1A1A1A",
    pageText: "#FAF9F0",
    cardBg: "#242424",
    cardBorder: "rgba(250,249,240,0.08)",
    cardBgHover: "#2c2c2c",
    cardBorderHover: "rgba(250,249,240,0.15)",
    mutedText: "rgba(250,249,240,0.4)",
    subtleText: "rgba(250,249,240,0.3)",
    faintBg: "rgba(250,249,240,0.06)",
    faintBorder: "rgba(250,249,240,0.1)",
    faintBg2: "rgba(250,249,240,0.03)",
    faintBorder2: "rgba(250,249,240,0.12)",
    ghostBorder: "rgba(250,249,240,0.12)",
    overlayBg: "rgba(26,26,26,0.85)",
    correctBg: "#2a3229",
    correctBorder: "rgba(213,250,211,0.3)",
    wrongBg: "#2e2424",
    wrongBorder: "rgba(229,115,115,0.3)",
    dimmedText: "rgba(250,249,240,0.35)",
    badgeBg: "#242424",
    lavenderBg: "rgba(216,210,250,0.06)",
    lavenderBorder: "rgba(216,210,250,0.12)",
    lavenderBgActive: "rgba(216,210,250,0.1)",
    lavenderBorderActive: "rgba(216,210,250,0.3)",
    tealBorder: "rgba(213,250,211,0.12)",
    tealBg: "rgba(213,250,211,0.04)",
    logoSrc: "/PI2 logo light.jpeg",
    logoBg: BRAND.light,
    // background constellation
    bgNodeColors: [
      { r: 216, g: 210, b: 250 }, // lavender
      { r: 213, g: 250, b: 211 }, // teal
      { r: 250, g: 249, b: 240 }, // cream
    ],
    bgGlowLavender: (a) => `rgba(216,210,250,${a})`,
    bgGlowTeal: (a) => `rgba(213,250,211,${a})`,
    // DIFF_META per mode
    diffBeginner: { bg: "rgba(213,250,211,0.06)", border: "rgba(213,250,211,0.12)" },
    diffIntermediate: { bg: "rgba(216,210,250,0.06)", border: "rgba(216,210,250,0.12)" },
    diffAdvanced: { color: BRAND.light, bg: "rgba(250,249,240,0.06)", border: "rgba(250,249,240,0.12)" },
  },
  light: {
    mode: "light",
    pageBg: "#FAF9F0",
    pageText: "#1A1A1A",
    cardBg: "#2C2C2C",
    cardBorder: "rgba(26,26,26,0.12)",
    cardBgHover: "#343434",
    cardBorderHover: "rgba(250,249,240,0.22)",
    mutedText: "rgba(26,26,26,0.6)",
    subtleText: "rgba(26,26,26,0.5)",
    faintBg: "rgba(26,26,26,0.05)",
    faintBorder: "rgba(26,26,26,0.1)",
    faintBg2: "rgba(26,26,26,0.03)",
    faintBorder2: "rgba(26,26,26,0.1)",
    ghostBorder: "rgba(26,26,26,0.12)",
    overlayBg: "rgba(26,26,26,0.5)",
    correctBg: "#2a3229",
    correctBorder: "rgba(213,250,211,0.3)",
    wrongBg: "#2e2424",
    wrongBorder: "rgba(229,115,115,0.3)",
    dimmedText: "rgba(26,26,26,0.5)",
    badgeBg: "#333333",
    lavenderBg: "rgba(216,210,250,0.1)",
    lavenderBorder: "rgba(216,210,250,0.2)",
    lavenderBgActive: "rgba(216,210,250,0.15)",
    lavenderBorderActive: "rgba(216,210,250,0.4)",
    tealBorder: "rgba(213,250,211,0.2)",
    tealBg: "rgba(213,250,211,0.08)",
    logoSrc: "/PI2 logo dark.jpeg",
    logoBg: BRAND.dark,
    // background constellation
    bgNodeColors: [
      { r: 216, g: 210, b: 250 }, // lavender
      { r: 213, g: 250, b: 211 }, // teal
      { r: 26, g: 26, b: 26 },    // dark (replaces cream)
    ],
    bgGlowLavender: (a) => `rgba(216,210,250,${a})`,
    bgGlowTeal: (a) => `rgba(213,250,211,${a})`,
    // DIFF_META per mode
    diffBeginner: { bg: "rgba(213,250,211,0.12)", border: "rgba(213,250,211,0.25)" },
    diffIntermediate: { bg: "rgba(216,210,250,0.12)", border: "rgba(216,210,250,0.25)" },
    diffAdvanced: { color: BRAND.dark, bg: "rgba(26,26,26,0.06)", border: "rgba(26,26,26,0.12)" },
  },
};

const useTheme = () => {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("pi2-theme") || "dark"; } catch { return "dark"; }
  });
  const toggle = useCallback(() => {
    setMode(v => {
      const next = v === "dark" ? "light" : "dark";
      try { localStorage.setItem("pi2-theme", next); } catch { }
      document.body.style.background = THEME_TOKENS[next].pageBg;
      return next;
    });
  }, []);
  useEffect(() => { document.body.style.background = THEME_TOKENS[mode].pageBg; }, [mode]);
  return { mode, theme: THEME_TOKENS[mode], toggleTheme: toggle };
};

const getDiffMeta = (theme) => ({
  beginner: { label: "Beginner", color: BRAND.teal, bg: theme.diffBeginner.bg, border: theme.diffBeginner.border, icon: "●" },
  intermediate: { label: "Intermediate", color: BRAND.lavender, bg: theme.diffIntermediate.bg, border: theme.diffIntermediate.border, icon: "●" },
  advanced: { label: "Advanced", color: theme.diffAdvanced?.color || BRAND.light, bg: theme.diffAdvanced.bg, border: theme.diffAdvanced.border, icon: "●" },
});

const QUESTIONS = [
  { id: "b1", difficulty: "beginner", text: "What does Pi2 Network describe itself as?", options: ["A social media blockchain", "A traditional blockchain", "An infinitely scalable network", "A centralized exchange"], correct: 2, explanation: "Pi2 is building an infinitely scalable network that goes beyond traditional blockchain limitations." },
  { id: "b2", difficulty: "beginner", text: "Who is the CEO & Co-Founder of Pi Squared?", options: ["Vitalik Buterin", "Grigore Roșu", "Patrick MacKay", "Xiaohong Chen"], correct: 1, explanation: "Grigore Roșu, a UIUC computer science professor and former NASA researcher, co-founded Pi Squared." },
  { id: "b3", difficulty: "beginner", text: "What TPS did FastSet (Fast) achieve on Devnet 2.0?", options: ["10,000 TPS", "150,000 TPS", "50,000 TPS", "500,000 TPS"], correct: 1, explanation: "FastSet (Fast) achieved 150,000+ TPS with sub-100ms finality on Devnet 2.0, targeting 1 million TPS at mainnet." },
  { id: "b4", difficulty: "beginner", text: "Who is Pi Squared's Chief Marketing Officer?", options: ["Chris Hazelton", "Nicholas Harness", "Musab Alturki", "Lindsay Casale"], correct: 3, explanation: "Lindsay Casale serves as Chief Marketing Officer at Pi Squared." },
  { id: "b5", difficulty: "beginner", text: "Who is Pi Squared's CTO?", options: ["Musab Alturki", "Andrew Miller", "Xiaohong Chen", "Sriram Vishwanath"], correct: 2, explanation: "Xiaohong Chen is the CTO — a formal methods engineer and ZK researcher, graduate of Peking University and UIUC." },
  { id: "b6", difficulty: "beginner", text: "How much did Pi Squared raise in its seed funding round?", options: ["$12.5 million", "$5 million", "$25 million", "$50 million"], correct: 0, explanation: "Pi Squared raised $12.5 million in seed funding led by Polychain Capital in July 2024." },
  { id: "b7", difficulty: "beginner", text: "Which company led Pi Squared's seed round?", options: ["Polychain Capital", "Andreessen Horowitz", "Sequoia Capital", "Binance Labs"], correct: 0, explanation: "Polychain Capital led the round, with participation from ABCDE, Robot Ventures, Samsung Next, and others." },
  { id: "b8", difficulty: "beginner", text: "What is Pi2's community stress-test mini-game called?", options: ["Pi Blaster", "Reactor", "Chain Breaker", "Node Runner"], correct: 1, explanation: "The Pi2 Reactor is an interactive on-chain game where players click colored orbs to generate TPS and stress-test the network. It has attracted over 375,000 players." },
  { id: "b9", difficulty: "beginner", text: "Where is Pi Squared based?", options: ["San Francisco, CA", "Champaign, Illinois", "New York, NY", "Austin, Texas"], correct: 1, explanation: "Pi Squared is headquartered in Champaign, Illinois, home of the University of Illinois." },
  { id: "b10", difficulty: "beginner", text: "What is Pi2 Labs' payment system for the agentic economy called?", options: ["PaySet", "AgentSwap", "FastSet (Fast)", "OmniPay"], correct: 2, explanation: "FastSet (Fast) is Pi2 Labs' payment system designed for the agentic economy, enabling agents to move money globally at internet speed." },
  { id: "m1", difficulty: "intermediate", text: "What finality time does FastSet (Fast) target?", options: ["Under 1 second", "Sub-100 milliseconds", "Under 10 seconds", "Under 5 minutes"], correct: 1, explanation: "FastSet (Fast) achieves sub-100ms finality — transactions settle in under a tenth of a second, approaching internet speed." },
  { id: "m2", difficulty: "intermediate", text: "What is Pi2's core verification concept called?", options: ["Proof of Stake", "Proof of Work", "Proof of Authority", "Proof of Proof"], correct: 3, explanation: "Proof of Proof (PoP) refers to ZK proofs of mathematical proofs — verified by a small, universal proof checker that yields ZK proofs." },
  { id: "m3", difficulty: "intermediate", text: "What data structure does FastSet (Fast) use instead of a traditional ledger?", options: ["A Merkle tree", "A directed acyclic graph", "A linked list", "A set"], correct: 3, explanation: "FastSet (Fast) maintains a set of transactions rather than an ordered ledger, enabling parallel processing because most claims are weakly independent." },
  { id: "m4", difficulty: "intermediate", text: "Who is Pi Squared's Ecosystem Lead?", options: ["Chris Hazelton", "Musab Alturki", "Nicholas Harness", "George Lambeth"], correct: 2, explanation: "Nicholas Harness serves as Ecosystem Lead at Pi Squared." },
  { id: "m5", difficulty: "intermediate", text: "Which Ethereum Foundation researcher is an angel investor in Pi Squared?", options: ["Vitalik Buterin", "Danny Ryan", "Justin Drake", "Tim Beiko"], correct: 2, explanation: "Justin Drake, an Ethereum Foundation core researcher, was among the angel investors in Pi Squared's $12.5M seed round." },
  { id: "m6", difficulty: "intermediate", text: "What is OmniSet (AllSet)?", options: ["A token launchpad", "An NFT marketplace", "A staking platform", "A universal liquidity and settlement layer"], correct: 3, explanation: "OmniSet (AllSet) connects fragmented liquidity across blockchains into one cohesive, verifiable system — acting as a universal liquidity hub without relying on traditional bridges." },
  { id: "m7", difficulty: "intermediate", text: "What does Pi2 call transactions in its system?", options: ["Claims", "Blocks", "Receipts", "Entries"], correct: 0, explanation: "Pi2 uses the term 'claims' instead of 'transactions.' Claims are settled and verified through mathematical proofs on FastSet (Fast)." },
  { id: "m8", difficulty: "intermediate", text: "Which EigenLayer founder is an advisor to Pi Squared?", options: ["Vitalik Buterin", "Sreeram Kannan", "Anatoly Yakovenko", "Gavin Wood"], correct: 1, explanation: "Sreeram Kannan, founder of EigenLayer and a UIUC alum, serves as an advisor and angel investor." },
  { id: "m9", difficulty: "intermediate", text: "What does OmniSwap (AllSwap) do?", options: ["Bridges NFTs between chains", "Creates new tokens", "Aggregates DEXs across networks for best swap rates", "Manages validator nodes"], correct: 2, explanation: "OmniSwap (AllSwap) is a cross-chain DEX aggregator built on top of OmniSet (AllSet). It discovers the best available swap rates and executes trades using verifiable proofs." },
  { id: "m10", difficulty: "intermediate", text: "Where did Grigore Roșu earn his Ph.D.?", options: ["UC San Diego (UCSD)", "MIT", "Stanford University", "Carnegie Mellon"], correct: 0, explanation: "Roșu earned his Ph.D. in computer science from UCSD, then worked at NASA before becoming a professor at UIUC." },
  { id: "a1", difficulty: "advanced", text: "What formal verification framework did Grigore Roșu create over 20 years ago?", options: ["Z Framework", "L Framework", "K Framework", "V Framework"], correct: 2, explanation: "The K Framework is a formal semantics system that defines programming languages as precise mathematical models. It's the foundation of Pi2's technology." },
  { id: "a2", difficulty: "advanced", text: "What approximate value does π² (pi squared) equal?", options: ["6.2832", "3.1416", "7.3891", "9.8696"], correct: 3, explanation: "π² ≈ 9.8696 — interestingly close to the acceleration due to gravity (9.8 m/s²)." },
  { id: "a3", difficulty: "advanced", text: "According to Pi Squared's announcement, what is Pi² Labs described as?", options: ["The team behind Fast, a new payment system for the agentic economy", "A venture capital firm backing Web3 startups", "A blockchain auditing company", "A decentralized social media platform"], correct: 0, explanation: "Pi² Labs (prev. Pi Squared) announced itself as the team behind Fast, a new payment system for the agentic economy." },
  { id: "a4", difficulty: "advanced", text: "How does the K Framework enable Pi2's universal verification?", options: ["It compiles all code into a single virtual machine", "It translates all languages into Solidity", "It runs code in a sandbox environment", "It defines programming language semantics mathematically, so every execution becomes a provable proof"], correct: 3, explanation: "K defines programming languages through their formal semantics — meaning any program's execution can be mathematically proven correct, then verified with a small ZK circuit." },
  { id: "a5", difficulty: "advanced", text: "In the Pi2 stack, what are the roles of FastSet (Fast), OmniSet (AllSet), and OmniSwap (AllSwap)?", options: ["FastSet is the settlement engine, OmniSet is the liquidity fabric, OmniSwap is the trading app", "FastSet is the frontend, OmniSet is the backend, OmniSwap is storage", "They are all independent products", "FastSet and OmniSwap are the same thing"], correct: 0, explanation: "FastSet (Fast) is the engine (settlement), OmniSet (AllSet) is the liquidity fabric (cross-chain), and OmniSwap (AllSwap) is an application layer for cross-chain swaps." },
  { id: "a6", difficulty: "advanced", text: "What does BYOL stand for in Pi2's ecosystem?", options: ["Build Your Own Ledger", "Bring Your Own Language", "Buy Your Own License", "Bridge Your Own Liquidity"], correct: 1, explanation: "BYOL means developers can write smart contracts in Python, Rust, Java, C++, or any language — not just Solidity or Move." },
  { id: "a7", difficulty: "advanced", text: "What company did Grigore Roșu found before Pi Squared?", options: ["Chainlink Labs", "ConsenSys", "Alchemy", "Runtime Verification"], correct: 3, explanation: "Roșu previously founded Runtime Verification, an industry-leading formal verification company that has served the Ethereum Foundation, Uniswap, Lido, Optimism, NASA, and others." },
  { id: "a8", difficulty: "advanced", text: "On February 24th, 2026, what did Pi Squared rebrand its research and team arm to?", options: ["Pi2 Labs", "Fast Labs", "Pi2 Foundation", "Pi2 Research"], correct: 0, explanation: "Pi Squared rebranded to Pi2 Labs, announcing: The research and team behind what we are building now have a new home. Follow @Pi2_Labs. The future is Fast." },
  { id: "a9", difficulty: "advanced", text: "Which Samsung division invested in Pi Squared's seed round?", options: ["Samsung Next", "Samsung Electronics", "Samsung Ventures", "Samsung Research"], correct: 0, explanation: "Samsung Next, Samsung's innovation and investment arm, participated alongside Polychain Capital, ABCDE, Robot Ventures, and others." },
  { id: "a10", difficulty: "advanced", text: "What makes Pi2's universal ZK circuit fundamentally different from other ZK systems?", options: ["It's the largest circuit ever built", "It only works with Ethereum smart contracts", "It checks the integrity of mathematical proofs rather than re-executing computations", "It requires specialized hardware to run"], correct: 2, explanation: "Instead of re-running programs inside a ZK circuit (like most ZK rollups), Pi2's circuit verifies mathematical proofs generated by the K Framework — making it tiny, universal, and language-agnostic." },
];

const TIERS = [
  { min: 0, max: 20, title: "Orbit Rookie", emoji: "🌍", achievement: "You have taken your first steps into the Pi² universe and earned the rank of", message: "Every great journey starts with a single orbit. You've taken your first step into the Pi² universe — keep exploring!" },
  { min: 21, max: 40, title: "Gravity Walker", emoji: "🌙", achievement: "You have shown growing curiosity about the Pi² ecosystem and risen to", message: "You're breaking free from the gravitational pull of the unknown. The Pi² ecosystem is opening up to you!" },
  { min: 41, max: 60, title: "Light Speed Navigator", emoji: "🚀", achievement: "You have demonstrated solid understanding of Pi² technology and achieved the rank of", message: "You've hit light speed! Your understanding of Pi² technology is accelerating fast. The infinite awaits." },
  { min: 61, max: 80, title: "Quantum Pioneer", emoji: "⚡", achievement: "You have proven deep expertise in Pi²'s protocol and vision, earning the title of", message: "You have proven deep expertise in Pi²'s protocol and vision. The quantum frontier is yours to conquer!" },
  { min: 81, max: 100, title: "Infinite Voyager", emoji: "🪐", achievement: "You have demonstrated exceptional knowledge and mastery of the Pi² universe, earning the legendary title of", message: "You've reached infinite scalability — just like Pi². You are a true master of the Pi² universe!" },
];

const initialState = { screen: "welcome", currentQ: 0, score: 0, answers: [], selected: null, showFeedback: false, timeLeft: 20, timerActive: false, username: "", usernameType: "twitter", attempt: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "START_QUIZ": return { ...state, screen: "username" };
    case "BEGIN_QUIZ": return { ...state, screen: "loading" };
    case "LOADING_DONE": return { ...state, screen: "quiz", currentQ: 0, score: 0, answers: [], selected: null, showFeedback: false, timeLeft: 20, timerActive: true };
    case "SELECT_ANSWER": {
      if (state.showFeedback || state.selected !== null) return state;
      const q = QUESTIONS[state.currentQ]; const isCorrect = action.index === q.correct;
      return { ...state, selected: action.index, showFeedback: true, timerActive: false, score: isCorrect ? state.score + 1 : state.score, answers: [...state.answers, { questionId: q.id, selected: action.index, correct: q.correct, isCorrect }] };
    }
    case "TIME_UP": {
      if (state.showFeedback) return state;
      const tq = QUESTIONS[state.currentQ];
      return { ...state, selected: -1, showFeedback: true, timerActive: false, answers: [...state.answers, { questionId: tq.id, selected: -1, correct: tq.correct, isCorrect: false }] };
    }
    case "NEXT_QUESTION": {
      const nextQ = state.currentQ + 1;
      if (nextQ >= QUESTIONS.length) return { ...state, screen: "result", timerActive: false };
      const prevDiff = QUESTIONS[state.currentQ].difficulty; const nextDiff = QUESTIONS[nextQ].difficulty;
      if (prevDiff !== nextDiff) return { ...state, screen: "transition", currentQ: nextQ, selected: null, showFeedback: false, timeLeft: 20 };
      return { ...state, currentQ: nextQ, selected: null, showFeedback: false, timeLeft: 20, timerActive: true };
    }
    case "RESUME_FROM_TRANSITION": return { ...state, screen: "quiz", selected: null, showFeedback: false, timeLeft: 20, timerActive: true };
    case "TICK": return (!state.timerActive || state.timeLeft <= 0) ? state : { ...state, timeLeft: state.timeLeft - 1 };
    case "SET_USERNAME": return { ...state, username: action.value };
    case "SET_USERNAME_TYPE": return { ...state, usernameType: action.value, username: "" };
    case "SHOW_CERTIFICATE": return { ...state, screen: "certificate" };
    case "RESTART": return { ...initialState, username: state.username, usernameType: state.usernameType, attempt: state.attempt + 1, screen: "loading" };
    default: return state;
  }
}

const injectStyles = () => {
  if (document.getElementById("pi2-quiz-styles")) return;
  const s = document.createElement("style"); s.id = "pi2-quiz-styles";
  s.textContent = `
    @keyframes pi2SlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pi2FadeIn { from{opacity:0} to{opacity:1} }
    @keyframes pi2Shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
    @keyframes pi2TimerPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
    @keyframes pi2ScoreCount { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
    @keyframes loadBarFill { 0%{width:0%} 100%{width:100%} }
    @keyframes loadFadeOut { 0%{opacity:1} 100%{opacity:0} }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes auroraOrbit { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
    @keyframes giftPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.7} }
    @keyframes ringPulse { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
    .pi2-shake{animation:pi2Shake 0.4s ease-in-out}

    /* ── Mobile layout polish ── */
    @media(max-width:600px){
      .pi2-quiz-outer{padding:12px!important}
      .pi2-quiz-card{padding:20px 16px!important}
      .pi2-answer-btn{padding:10px 12px!important;font-size:13px!important;gap:8px!important}
      .pi2-answer-badge{width:24px!important;height:24px!important;font-size:11px!important}
      .pi2-feedback-card{padding:12px 14px!important}
      .pi2-next-btn{padding:12px!important;font-size:14px!important}
      .pi2-result-card{padding:28px 20px!important}
      .pi2-welcome-outer{padding:16px!important}
      .pi2-cert-outer{padding:16px!important}
      .pi2-score-ring{width:100px!important;height:100px!important}
      .pi2-score-ring svg{width:100px!important;height:100px!important}
      .pi2-header-row{margin-bottom:8px!important}
    }
    @media(max-width:380px){
      .pi2-answer-btn{padding:8px 10px!important;font-size:12px!important}
      .pi2-quiz-card{padding:16px 12px!important}
    }
  `;
  document.head.appendChild(s);
};

// ─── SOUND ENGINE — Web Audio API ─────────────────────────────────────────────
let _audioCtx = null;
const _soundCfg = { enabled: true };
const _getCtx = () => {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
};
const _note = (ctx, freq, t, dur, vol) => {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = "sine"; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.start(t); o.stop(t + dur + 0.01);
};
const playSound = (name) => {
  if (!_soundCfg.enabled) return;
  try {
    const ctx = _getCtx(), t = ctx.currentTime;
    if (name === "correct") {
      _note(ctx, 523, t, 0.15, 0.1); _note(ctx, 784, t + 0.09, 0.25, 0.08);
    } else if (name === "wrong") {
      _note(ctx, 220, t, 0.08, 0.1); _note(ctx, 155, t + 0.05, 0.25, 0.08);
    } else if (name === "tick") {
      _note(ctx, 880, t, 0.04, 0.05);
    } else if (name === "timeup") {
      _note(ctx, 440, t, 0.1, 0.08); _note(ctx, 300, t + 0.12, 0.3, 0.08);
    } else if (name === "complete") {
      [523, 659, 784, 1047].forEach((f, i) => _note(ctx, f, t + i * 0.13, 0.35, 0.09));
    } else if (name === "certificate") {
      [1047, 1319, 1568].forEach((f, i) => _note(ctx, f, t + i * 0.11, 0.55, 0.06));
    }
  } catch (_) { }
};
const useSoundToggle = () => {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem("pi2-sound") !== "off"; } catch { return true; }
  });
  const toggle = useCallback(() => {
    setEnabled(v => {
      const next = !v;
      _soundCfg.enabled = next;
      try { localStorage.setItem("pi2-sound", next ? "on" : "off"); } catch { }
      return next;
    });
  }, []);
  useEffect(() => { _soundCfg.enabled = enabled; }, [enabled]);
  return { soundEnabled: enabled, toggleSound: toggle };
};

// ─── ANIMATED BACKGROUND — CONSTELLATION NETWORK ─────────────────────────────
const MinimalBackground = ({ theme }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, time = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const onMouse = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouse);

    const COLORS = theme.bgNodeColors;
    const rgba = (c, a) => `rgba(${c.r},${c.g},${c.b},${a})`;
    const isLight = theme.mode === "light";

    // ── Layered nodes ──
    const LAYERS = [
      { count: 14, speedMul: 0.15, sizeMul: 0.55, alphaMul: 0.35, connectDist: 220 }, // far
      { count: 18, speedMul: 0.4, sizeMul: 0.8, alphaMul: 0.65, connectDist: 280 }, // mid
      { count: 10, speedMul: 0.8, sizeMul: 1.0, alphaMul: 1.0, connectDist: 340 }, // near
    ];

    const nodes = [];
    LAYERS.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        const col = COLORS[Math.floor(Math.random() * COLORS.length)];
        const baseR = ((2.5 + Math.random() * 3) * layer.sizeMul) * (isLight ? 0.7 : 1);
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4 * layer.speedMul,
          vy: (Math.random() - 0.5) * 0.4 * layer.speedMul,
          r: baseR,
          color: col,
          alpha: (0.3 + Math.random() * 0.5) * layer.alphaMul,
          pulseOffset: Math.random() * Math.PI * 2,
          pulseSpeed: 0.6 + Math.random() * 1.0,
          layer: li,
          connectDist: layer.connectDist,
          // "signal" travelling along edges
          signalTimer: Math.random() * 8,
          signalInterval: 4 + Math.random() * 10,
        });
      }
    });

    // Travelling signals — data packets flowing along edges
    const signals = [];
    const spawnSignal = (fromNode, toNode) => {
      signals.push({
        from: fromNode,
        to: toNode,
        t: 0, // 0 → 1 progress
        speed: 0.008 + Math.random() * 0.012,
        color: fromNode.color,
        alpha: 0.55 + Math.random() * 0.25,
      });
    };

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Ambient radial gradient ──
      const isLight = theme.mode === "light";
      const glowMul = isLight ? 3.5 : 1;
      const cx = canvas.width / 2, cy = canvas.height * 0.4;
      const pulseR = 480 + Math.sin(time * 0.3) * 60;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR);
      grd.addColorStop(0, theme.bgGlowLavender((0.022 + Math.sin(time * 0.25) * 0.008) * glowMul));
      grd.addColorStop(0.45, theme.bgGlowTeal((0.006 + Math.sin(time * 0.35) * 0.003) * glowMul));
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── Mouse proximity glow ──
      const mGrd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
      mGrd.addColorStop(0, theme.bgGlowLavender(isLight ? 0.14 : 0.04));
      mGrd.addColorStop(1, "transparent");
      ctx.fillStyle = mGrd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── Update nodes & collect live edges ──
      const liveEdges = [];
      nodes.forEach(n => {
        // Drift
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -30) n.x = canvas.width + 30;
        if (n.x > canvas.width + 30) n.x = -30;
        if (n.y < -30) n.y = canvas.height + 30;
        if (n.y > canvas.height + 30) n.y = -30;

        // Gentle mouse repulsion for near-layer nodes
        if (n.layer === 2) {
          const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 150 && md > 0) {
            const f = (1 - md / 150) * 0.6;
            n.x += (mdx / md) * f;
            n.y += (mdy / md) * f;
          }
        }

        // Signal spawning
        n.signalTimer += 0.016;
        if (n.signalTimer > n.signalInterval) {
          n.signalTimer = 0;
          n.signalInterval = 4 + Math.random() * 10;
          // find a neighbour to send to
          const neighbours = nodes.filter(m => m !== n && (function () {
            const d = Math.hypot(m.x - n.x, m.y - n.y);
            return d < n.connectDist;
          })());
          if (neighbours.length > 0 && signals.length < 40) {
            const target = neighbours[Math.floor(Math.random() * neighbours.length)];
            spawnSignal(n, target);
          }
        }
      });

      // ── Draw edges ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          // Only connect same or adjacent layers
          if (Math.abs(a.layer - b.layer) > 1) continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.min(a.connectDist, b.connectDist);
          if (dist < maxDist) {
            const proximity = 1 - dist / maxDist;
            const edgeAlpha = proximity * (isLight ? 0.18 : 0.07) * ((a.alpha + b.alpha) / 2);
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, rgba(a.color, edgeAlpha));
            grad.addColorStop(0.5, rgba(a.color, edgeAlpha * 1.5));
            grad.addColorStop(1, rgba(b.color, edgeAlpha));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.5 + proximity * 0.5;
            ctx.stroke();

            liveEdges.push({ a, b, proximity });
          }
        }
      }

      // ── Draw nodes (back to front) ──
      [...nodes].sort((a, b) => a.layer - b.layer).forEach(n => {
        const pulse = Math.sin(time * n.pulseSpeed + n.pulseOffset);
        const r = n.r * (1 + pulse * 0.18);
        const a = n.alpha * (0.85 + pulse * 0.15);

        const haloMul = isLight ? 2.5 : 1;

        // Outer halo glow (two rings)
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 5.5, 0, Math.PI * 2);
        ctx.fillStyle = rgba(n.color, a * 0.06 * haloMul);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = rgba(n.color, a * 0.14 * haloMul);
        ctx.fill();

        // Core node with canvas shadow glow
        ctx.save();
        ctx.shadowColor = rgba(n.color, a * (isLight ? 1.2 : 0.8));
        ctx.shadowBlur = (isLight ? 14 : 10) + n.layer * 4;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * (isLight ? 1.05 : 1), 0, Math.PI * 2);
        ctx.fillStyle = rgba(n.color, Math.min(a * (isLight ? 1.2 : 1), 1));
        ctx.fill();
        ctx.restore();

        // Bright centre dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = rgba(n.color, Math.min(a * 1.6, 1));
        ctx.fill();
      });

      // ── Travelling signals (data packets) ──
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s];
        sig.t += sig.speed;
        if (sig.t >= 1) { signals.splice(s, 1); continue; }

        const x = sig.from.x + (sig.to.x - sig.from.x) * sig.t;
        const y = sig.from.y + (sig.to.y - sig.from.y) * sig.t;
        const eased = Math.sin(sig.t * Math.PI); // fade in/out

        // Glow trail
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = rgba(sig.color, sig.alpha * eased * 0.25);
        ctx.fill();

        // Core bright dot
        ctx.save();
        ctx.shadowColor = rgba(sig.color, sig.alpha * eased);
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = rgba(sig.color, sig.alpha * eased);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: theme.pageBg, transition: "background 0.3s ease" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
    </div>
  );
};

const Card = ({ children, style = {}, theme, ...props }) => <div style={{ background: (theme || THEME_TOKENS.dark).cardBg, border: `1px solid ${(theme || THEME_TOKENS.dark).cardBorder}`, borderRadius: 12, transition: "background 0.3s ease, border-color 0.3s ease", ...style }} {...props}>{children}</div>;

const TimerRing = ({ timeLeft, total = 20, theme }) => {
  const pct = timeLeft / total; const circ = 2 * Math.PI * 22; const off = circ * (1 - pct);
  const isCrit = timeLeft <= 5; const isLow = timeLeft <= 10;
  const t = theme || THEME_TOKENS.dark;
  const color = isCrit ? BRAND.error : isLow ? BRAND.lavender : t.pageText;
  return (
    <div style={{ position: "relative", width: 56, height: 56, animation: isCrit ? "pi2TimerPulse 0.5s ease-in-out infinite" : "none" }}>
      <svg width={56} height={56} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={28} cy={28} r={22} fill="none" stroke={t.faintBg} strokeWidth={4} />
        <circle cx={28} cy={28} r={22} fill="none" stroke={color} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear,stroke 0.3s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BRAND.mono, fontSize: 16, fontWeight: 600, color }}>{timeLeft}</div>
    </div>
  );
};

const ProgressBar = ({ current, total, theme }) => {
  const t = theme || THEME_TOKENS.dark;
  return (
    <div style={{ width: "100%", height: 4, borderRadius: 2, background: t.faintBg, overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 2, background: BRAND.lavender, width: `${(current / total) * 100}%`, transition: "width 0.4s ease" }} />
    </div>
  );
};

const DiffBadge = ({ difficulty, theme }) => { const dm = getDiffMeta(theme || THEME_TOKENS.dark); const m = dm[difficulty]; return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: m.color, background: m.bg, border: `1px solid ${m.border}` }}>{m.icon} {m.label}</span>; };

// ═════════════════════════════════════════════════════════════════════════════
// SCREENS
// ═════════════════════════════════════════════════════════════════════════════

const WelcomeScreen = ({ dispatch, theme }) => {
  const t = theme;
  const isDark = t.mode === "dark";
  const [showRaffle, setShowRaffle] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 480);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return (
    <div className="pi2-welcome-outer" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 4 }}>
      <div style={{ textAlign: "center", maxWidth: 480, width: "100%" }}>

        {/* ── LOGO with aurora glow ring ── */}
        <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 24px", animation: "pi2FadeIn 0.5s ease" }}>
          {/* Aurora orbit ring */}
          <div style={{
            position: "absolute", inset: -16,
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, ${BRAND.lavender}, ${BRAND.teal}, transparent, ${BRAND.lavender})`,
            opacity: isDark ? 0.25 : 0.8,
            animation: "auroraOrbit 8s linear infinite",
            filter: isDark ? "blur(6px)" : "blur(12px)",
          }} />
          {/* Second solid lavender glow layer (light mode boost) */}
          {!isDark && <div style={{
            position: "absolute", inset: -10,
            borderRadius: "50%",
            background: `conic-gradient(from 180deg, ${BRAND.lavender}, transparent, ${BRAND.teal})`,
            opacity: 0.4,
            animation: "auroraOrbit 12s linear infinite reverse",
            filter: "blur(8px)",
          }} />}
          {/* Static soft glow behind logo */}
          <div style={{
            position: "absolute", inset: -24,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${isDark ? "rgba(216,210,250,0.08)" : "rgba(216,210,250,0.5)"} 0%, transparent 70%)`,
          }} />
          {/* Logo mask */}
          <div
            style={{
              position: "relative", height: 72, width: 72,
              background: isDark ? BRAND.light : BRAND.dark,
              WebkitMaskImage: "url('/PI2 logo light.jpeg')",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskMode: "luminance",
              maskImage: "url('/PI2 logo light.jpeg')",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskMode: "luminance",
              transition: "background 0.3s ease",
            }}
            role="img" aria-label="Pi² Labs"
          />
        </div>

        {/* ── TITLE ── */}
        <h1 style={{
          fontFamily: BRAND.sans, fontSize: "clamp(32px,7vw,44px)", fontWeight: 800,
          color: t.pageText, lineHeight: 1.05, marginBottom: 24,
          letterSpacing: "-0.03em",
          animation: "pi2SlideUp 0.4s ease-out",
        }}>COMMUNITY<br />QUIZ</h1>

        {/* ── Description ── */}
        <p style={{
          fontSize: 16, color: t.mutedText, lineHeight: 1.8,
          maxWidth: 400, margin: "0 auto 32px", fontFamily: BRAND.sans,
          animation: "pi2FadeIn 0.6s ease",
        }}>Test your knowledge of Pi²'s technology, team, and ecosystem across three levels of difficulty.</p>

        {/* ── Stat cards — vertical layout (number on top, label below) ── */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 28, animation: "pi2SlideUp 0.5s ease-out" }}>
          {[["30", "Questions"], ["3", "Levels"], ["20s", "Timer"], ["🏆", "Certificate"]].map(([v, l], i) => (
            <div key={i} style={{
              padding: "14px 18px", borderRadius: 12, textAlign: "center",
              background: t.cardBg, border: `1px solid ${t.cardBorder}`,
              minWidth: 80, transition: "transform 0.15s ease, border-color 0.15s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = t.cardBorderHover }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = t.cardBorder }}
            >
              <div style={{ fontFamily: BRAND.mono, fontSize: 22, fontWeight: 700, color: BRAND.light, marginBottom: 4 }}>{v}</div>
              <div style={{ fontSize: 11, color: "rgba(250,249,240,0.4)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── Floating raffle FAB (bottom-right fixed, mobile-safe) ── */}
        <div style={{
          position: "fixed", bottom: isMobile ? 20 : 28, right: isMobile ? 16 : 28, zIndex: 50,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        }}>
          {/* Popup tooltip */}
          {showRaffle && (
            <>
              {/* Click-outside overlay */}
              <div onClick={() => setShowRaffle(false)} style={{
                position: "fixed", inset: 0, zIndex: 49,
              }} />
              <div style={{
                position: "absolute", bottom: "calc(100% + 14px)", right: 0,
                background: t.cardBg, border: `1px solid ${t.tealBorder}`,
                borderRadius: 12, padding: "16px 20px", minWidth: isMobile ? 220 : 260, maxWidth: isMobile ? "calc(100vw - 40px)" : 300,
                textAlign: "center", zIndex: 51,
                boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.2)",
                animation: "pi2SlideUp 0.2s ease-out",
              }}>
                {/* Arrow */}
                <div style={{
                  position: "absolute", bottom: -6, right: 22, transform: "rotate(45deg)",
                  width: 12, height: 12, background: t.cardBg,
                  borderRight: `1px solid ${t.tealBorder}`, borderBottom: `1px solid ${t.tealBorder}`,
                }} />
                <div style={{ fontSize: 24, marginBottom: 8 }}>🎁</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: BRAND.teal, marginBottom: 6, fontFamily: BRAND.sans }}>$5 Raffle Entry</div>
                <div style={{ fontSize: 13, color: "rgba(250,249,240,0.6)", lineHeight: 1.6, fontFamily: BRAND.sans }}>
                  Score <strong style={{ color: BRAND.teal }}>81% or higher</strong> on your very first attempt to automatically enter our $5 raffle draw!
                </div>
              </div>
            </>
          )}

          {/* FAB button with ring pulse */}
          <div style={{ position: "relative" }}>
            {/* Ring pulse beacon */}
            {!showRaffle && <div style={{
              position: "absolute", inset: -4,
              borderRadius: "50%",
              border: `2px solid ${isDark ? BRAND.teal : "#2D7A3A"}`,
              animation: "ringPulse 2s ease-out infinite",
            }} />}
            <button
              onClick={() => setShowRaffle(!showRaffle)}
              style={{
                width: isMobile ? 48 : 56, height: isMobile ? 48 : 56, borderRadius: "50%",
                background: t.cardBg, border: `1px solid ${t.tealBorder}`,
                cursor: "pointer", fontSize: isMobile ? 24 : 28, lineHeight: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: showRaffle ? "none" : "giftPulse 2s ease-in-out infinite",
                boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.15)",
                transition: "transform 0.2s ease",
                position: "relative", zIndex: 51,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              aria-label="Raffle info"
            >🎁</button>
          </div>

          {/* Label */}
          {!showRaffle && <span style={{
            fontSize: 10, fontWeight: 700, color: isDark ? BRAND.teal : "#2D7A3A",
            fontFamily: BRAND.sans, letterSpacing: "0.05em",
            textTransform: "uppercase",
            animation: "pi2FadeIn 0.5s ease",
          }}>Win $5!</span>}
        </div>

        {/* ── CTA BUTTON with gradient + edge-lit border ── */}
        <button onClick={() => dispatch({ type: "START_QUIZ" })}
          style={{
            width: "100%", padding: "18px 32px", borderRadius: 12,
            border: "none",
            borderTop: `1px solid rgba(255,255,255,0.25)`,
            background: `linear-gradient(135deg, ${BRAND.lavender} 0%, #C8BEF5 100%)`,
            color: BRAND.dark,
            fontFamily: BRAND.sans, fontSize: 17, fontWeight: 700,
            cursor: "pointer", transition: "all 0.2s ease", letterSpacing: 0.3,
            boxShadow: `0 6px 32px ${isDark ? "rgba(216,210,250,0.2)" : "rgba(216,210,250,0.35)"}`,
            animation: "pi2SlideUp 0.6s ease-out",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 10px 40px ${isDark ? "rgba(216,210,250,0.35)" : "rgba(216,210,250,0.5)"}`; const arrow = e.currentTarget.querySelector('.cta-arrow'); if (arrow) arrow.style.transform = 'translateX(4px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 6px 32px ${isDark ? "rgba(216,210,250,0.2)" : "rgba(216,210,250,0.35)"}`; const arrow = e.currentTarget.querySelector('.cta-arrow'); if (arrow) arrow.style.transform = 'translateX(0)'; }}
        >
          Start Quiz
          <span className="cta-arrow" style={{ transition: "transform 0.2s ease", display: "inline-block" }}>→</span>
        </button>
      </div>
    </div>
  );
};

const UsernameScreen = ({ state, dispatch, theme }) => {
  const isTwitter = state.usernameType === "twitter";
  const canProceed = state.username.trim().length >= 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 4, animation: "pi2SlideUp 0.3s ease-out" }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <Card theme={theme} style={{ padding: "48px 32px", textAlign: "center" }}>
          {/* Simple user icon */}
          <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 24px", background: "rgba(216,210,250,0.08)", border: "1px solid rgba(216,210,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={BRAND.lavender} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h2 style={{ fontFamily: BRAND.sans, fontSize: 24, fontWeight: 700, color: BRAND.light, marginBottom: 8 }}>Before we begin</h2>
          <p style={{ fontSize: 14, color: "rgba(250,249,240,0.4)", lineHeight: 1.6, marginBottom: 32, fontFamily: BRAND.sans }}>Enter your username so we can personalize your certificate.</p>

          {/* Platform toggle */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
            {[
              { key: "twitter", label: "𝕏  Twitter" },
              { key: "discord", label: "Discord", svg: true },
            ].map(p => (
              <button key={p.key} onClick={() => dispatch({ type: "SET_USERNAME_TYPE", value: p.key })}
                style={{ padding: "8px 20px", borderRadius: 8, background: state.usernameType === p.key ? "rgba(216,210,250,0.1)" : "transparent", border: `1px solid ${state.usernameType === p.key ? "rgba(216,210,250,0.3)" : "rgba(250,249,240,0.08)"}`, color: state.usernameType === p.key ? BRAND.light : "rgba(250,249,240,0.3)", fontFamily: BRAND.sans, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.15s ease" }}
              >{p.svg ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><svg width="18" height="14" viewBox="0 0 71 55" fill="currentColor"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A26.5 26.5 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18.7-.9 32.2.3 45.5v.2a58.9 58.9 0 0017.7 9 .2.2 0 00.3-.1 42.1 42.1 0 003.6-5.9.2.2 0 00-.1-.3 38.8 38.8 0 01-5.5-2.7.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 42 42 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.7.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.7 58.7 0 0070.5 45.7v-.2c1.4-15-2.3-28.1-9.8-39.7a.2.2 0 00-.1 0zM23.7 37.3c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.2 6.3 7-2.8 7-6.3 7zm23.2 0c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.2 6.3 7-2.8 7-6.3 7z" /></svg>{p.label}</span> : p.label}</button>
            ))}
          </div>

          {/* Clean input */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 6, background: "rgba(250,249,240,0.03)", border: "1px solid rgba(250,249,240,0.12)", transition: "border-color 0.15s ease" }}>
              {isTwitter && <span style={{ fontSize: 16, fontWeight: 600, color: BRAND.lavender, fontFamily: BRAND.mono }}>@</span>}
              <input type="text" value={state.username} onChange={e => { const val = isTwitter ? e.target.value.replace(/[^a-zA-Z0-9_]/g, "") : e.target.value.replace(/[^a-zA-Z0-9_.\-#]/g, ""); dispatch({ type: "SET_USERNAME", value: val }); }} placeholder={isTwitter ? "your_twitter_handle" : "username#0000"} maxLength={isTwitter ? 15 : 37} autoFocus style={{ flex: 1, background: "transparent", border: "none", color: BRAND.light, fontSize: 16, fontWeight: 500, fontFamily: BRAND.mono, outline: "none" }} onKeyDown={e => { if (e.key === "Enter" && canProceed) dispatch({ type: "BEGIN_QUIZ" }) }} onFocus={e => { e.currentTarget.parentElement.style.borderColor = "rgba(216,210,250,0.5)" }} onBlur={e => { e.currentTarget.parentElement.style.borderColor = "rgba(250,249,240,0.12)" }} />
            </div>
          </div>

          <button onClick={() => dispatch({ type: "BEGIN_QUIZ" })} disabled={!canProceed} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: canProceed ? BRAND.lavender : "rgba(250,249,240,0.04)", color: canProceed ? BRAND.dark : "rgba(250,249,240,0.2)", fontFamily: BRAND.sans, fontSize: 15, fontWeight: 600, cursor: canProceed ? "pointer" : "not-allowed", opacity: canProceed ? 1 : 0.6, transition: "all 0.15s ease" }}>Continue →</button>
        </Card>
      </div>
    </div>
  );
};

const LoadingScreen = ({ dispatch, theme }) => {
  const t = theme;
  const [phase, setPhase] = useState(0);
  const [dots, setDots] = useState("");
  useEffect(() => {
    const dotInterval = setInterval(() => { setDots(d => d.length >= 3 ? "" : d + "."); }, 400);
    const readyTimer = setTimeout(() => setPhase(1), 2200);
    const fadeTimer = setTimeout(() => setPhase(2), 2800);
    const goTimer = setTimeout(() => dispatch({ type: "LOADING_DONE" }), 3200);
    return () => { clearInterval(dotInterval); clearTimeout(readyTimer); clearTimeout(fadeTimer); clearTimeout(goTimer); };
  }, [dispatch]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 4, animation: phase === 2 ? "loadFadeOut 0.3s ease-out forwards" : "pi2FadeIn 0.3s ease" }}>
      {/* Pi² logo */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            height: 64, width: 64,
            background: t.mode === "dark" ? BRAND.light : BRAND.dark,
            WebkitMaskImage: "url('/PI2 logo light.jpeg')",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskMode: "luminance",
            maskImage: "url('/PI2 logo light.jpeg')",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskMode: "luminance",
          }}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        {phase === 0 && <p style={{ fontFamily: BRAND.sans, fontSize: 16, fontWeight: 400, color: t.mutedText }}>Preparing your challenge{dots}</p>}
        {phase >= 1 && <p style={{ fontFamily: BRAND.sans, fontSize: 24, fontWeight: 700, color: BRAND.lavender, animation: "pi2SlideUp 0.2s ease-out", letterSpacing: "0.05em" }}>READY</p>}
      </div>
      <div style={{ width: 160, height: 2, borderRadius: 1, marginTop: 24, background: t.faintBg, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 1, background: BRAND.lavender, animation: "loadBarFill 2.8s ease-out forwards" }} />
      </div>
    </div>
  );
};

const QuizScreen = ({ state, dispatch, theme }) => {
  const t = theme;
  const q = QUESTIONS[state.currentQ];
  // ── Sound effects ──
  useEffect(() => {
    if (!state.showFeedback) return;
    if (state.selected === -1) playSound("timeup");
    else if (state.selected === q.correct) playSound("correct");
    else playSound("wrong");
  }, [state.showFeedback, state.selected, q.correct]);
  useEffect(() => {
    if (state.timerActive && state.timeLeft > 0 && state.timeLeft <= 5) playSound("tick");
  }, [state.timeLeft, state.timerActive]);

  // ── Keyboard shortcuts (Feature 2) ──
  useEffect(() => {
    const handler = (e) => {
      // Keys 1-4 to select answer
      if (!state.showFeedback && state.selected === null) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4 && num <= q.options.length) {
          e.preventDefault();
          dispatch({ type: "SELECT_ANSWER", index: num - 1 });
          return;
        }
      }
      // Enter or Space to advance
      if (state.showFeedback && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        dispatch({ type: "NEXT_QUESTION" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.showFeedback, state.selected, state.currentQ, q.options.length, dispatch]);

  return (
    <div className="pi2-quiz-outer" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 4 }}>
      <div style={{ width: "100%", maxWidth: 600 }} key={state.currentQ}>
        <div className="pi2-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, animation: "pi2FadeIn 0.2s ease" }}>
          <DiffBadge difficulty={q.difficulty} theme={t} />
          <div style={{ fontFamily: BRAND.mono, fontSize: 13, fontWeight: 500, color: t.subtleText }}>{state.currentQ + 1} / {QUESTIONS.length}</div>
          <TimerRing timeLeft={state.timeLeft} theme={t} />
        </div>
        <div style={{ marginBottom: 24 }}><ProgressBar current={state.currentQ + (state.showFeedback ? 1 : 0)} total={QUESTIONS.length} theme={t} /></div>
        <Card theme={t} className="pi2-quiz-card" style={{ padding: "32px 28px", marginBottom: 16, animation: "pi2SlideUp 0.25s ease-out" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(250,249,240,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{q.difficulty} · Question {state.currentQ + 1}</span>
            <span style={{ fontFamily: BRAND.mono, fontSize: 13, fontWeight: 500, color: BRAND.lavender }}>Score: {state.score}/{state.currentQ + (state.showFeedback ? 1 : 0)}</span>
          </div>
          <h2 style={{ fontFamily: BRAND.sans, fontSize: "clamp(17px,3.5vw,20px)", fontWeight: 600, lineHeight: 1.5, color: BRAND.light }}>{q.text}</h2>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "pi2SlideUp 0.3s ease-out" }}>
          {q.options.map((opt, i) => {
            const isSelected = state.selected === i; const isCorrect = i === q.correct;
            const showCorrect = state.showFeedback && isCorrect; const showWrong = state.showFeedback && isSelected && !isCorrect;
            let bg = t.cardBg, border = t.cardBorder, tc = BRAND.light, anim = "";
            if (showCorrect) { bg = t.correctBg; border = t.correctBorder; tc = BRAND.teal; }
            else if (showWrong) { bg = t.wrongBg; border = t.wrongBorder; tc = BRAND.error; anim = "pi2-shake"; }
            else if (state.showFeedback) { bg = t.cardBg; tc = "rgba(250,249,240,0.35)"; }
            return (
              <button key={i} className={`pi2-answer-btn ${anim}`} onClick={() => !state.showFeedback && dispatch({ type: "SELECT_ANSWER", index: i })} disabled={state.showFeedback}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 16px", borderRadius: 8, border: `1px solid ${border}`, background: bg, color: tc, fontFamily: BRAND.sans, fontSize: 15, fontWeight: 400, textAlign: "left", cursor: state.showFeedback ? "default" : "pointer", transition: "all 0.15s ease" }}
                onMouseEnter={e => { if (!state.showFeedback) { e.currentTarget.style.background = t.cardBgHover; e.currentTarget.style.borderColor = t.cardBorderHover; e.currentTarget.style.transform = "translateY(-1px)" } }}
                onMouseLeave={e => { if (!state.showFeedback) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = "translateY(0)" } }}
              >
                <span className="pi2-answer-badge" style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0, background: showCorrect ? "rgba(213,250,211,0.15)" : showWrong ? "rgba(229,115,115,0.15)" : "rgba(250,249,240,0.06)", color: showCorrect ? BRAND.teal : showWrong ? BRAND.error : "rgba(250,249,240,0.4)", fontFamily: BRAND.mono }}>{showCorrect ? "✓" : showWrong ? "✕" : String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {state.showFeedback && (
          <div style={{ animation: "pi2SlideUp 0.2s ease-out" }}>
            <Card theme={t} className="pi2-feedback-card" style={{ marginTop: 12, padding: "16px 20px", borderColor: state.selected === q.correct ? "rgba(213,250,211,0.15)" : state.selected === -1 ? "rgba(216,210,250,0.15)" : "rgba(229,115,115,0.15)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: state.selected === q.correct ? BRAND.teal : state.selected === -1 ? BRAND.lavender : BRAND.error }}>{state.selected === q.correct ? "✓ Correct" : state.selected === -1 ? "⏱ Time's up" : "✕ Incorrect"}</div>
              <div style={{ fontSize: 14, color: "rgba(250,249,240,0.5)", lineHeight: 1.6, fontFamily: BRAND.sans }}>{q.explanation}</div>
            </Card>
            <button className="pi2-next-btn" onClick={() => dispatch({ type: "NEXT_QUESTION" })} style={{ marginTop: 12, width: "100%", padding: "14px", borderRadius: 8, border: "none", background: BRAND.lavender, color: BRAND.dark, fontFamily: BRAND.sans, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              {state.currentQ + 1 >= QUESTIONS.length ? "See Results →" : "Next Question →"}
            </button>
            <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: t.dimmedText, fontFamily: BRAND.mono, letterSpacing: "0.03em" }}>Press <span style={{ display: "inline-block", padding: "1px 6px", borderRadius: 4, background: t.faintBg, border: `1px solid ${t.faintBorder}`, fontSize: 11 }}>Enter ↵</span> to continue</div>
          </div>
        )}
        {!state.showFeedback && <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: t.dimmedText, fontFamily: BRAND.mono, letterSpacing: "0.03em" }}>Press <span style={{ display: "inline-block", padding: "1px 6px", borderRadius: 4, background: t.faintBg, border: `1px solid ${t.faintBorder}`, fontSize: 11 }}>1</span>–<span style={{ display: "inline-block", padding: "1px 6px", borderRadius: 4, background: t.faintBg, border: `1px solid ${t.faintBorder}`, fontSize: 11 }}>4</span> to answer</div>}
      </div>
    </div>
  );
};

const TransitionScreen = ({ state, dispatch, theme }) => {
  const t = theme;
  const nextDiff = QUESTIONS[state.currentQ].difficulty; const dm = getDiffMeta(t);
  const prevScore = state.answers.filter(a => a.isCorrect).length; const prevTotal = state.answers.length;
  const msgs = { intermediate: { title: "Level Up", sub: "You've cleared the Beginner round. Time to test your deeper knowledge." }, advanced: { title: "Final Level", sub: "You've made it to Advanced. These questions separate the experts from the explorers." } };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 4, animation: "pi2SlideUp 0.3s ease-out" }}>
      <Card theme={t} style={{ maxWidth: 440, width: "100%", padding: "48px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: BRAND.sans, fontSize: 28, fontWeight: 700, color: BRAND.light, marginBottom: 8 }}>{msgs[nextDiff]?.title}</h2>
        <p style={{ fontSize: 15, color: "rgba(250,249,240,0.4)", lineHeight: 1.6, marginBottom: 24, fontFamily: BRAND.sans }}>{msgs[nextDiff]?.sub}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32, padding: "16px", borderRadius: 8, background: "rgba(250,249,240,0.03)" }}>
          <div style={{ textAlign: "center" }}><div style={{ fontFamily: BRAND.mono, fontSize: 24, fontWeight: 600, color: BRAND.lavender }}>{prevScore}</div><div style={{ fontSize: 12, color: "rgba(250,249,240,0.3)", marginTop: 4 }}>Correct</div></div>
          <div style={{ width: 1, background: "rgba(250,249,240,0.08)" }} />
          <div style={{ textAlign: "center" }}><div style={{ fontFamily: BRAND.mono, fontSize: 24, fontWeight: 600, color: BRAND.teal }}>{prevTotal}</div><div style={{ fontSize: 12, color: "rgba(250,249,240,0.3)", marginTop: 4 }}>Answered</div></div>
        </div>
        <DiffBadge difficulty={nextDiff} theme={t} />
        <button onClick={() => dispatch({ type: "RESUME_FROM_TRANSITION" })} style={{ display: "block", width: "100%", marginTop: 24, padding: "14px", borderRadius: 8, border: "none", background: BRAND.lavender, color: BRAND.dark, fontFamily: BRAND.sans, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Continue →</button>
      </Card>
    </div>
  );
};

// ─── BRAND CONFETTI — lightweight canvas particle burst ───────────────────────
const BrandConfetti = ({ theme }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isLight = theme?.mode === "light";
    const COLORS = [
      { r: 216, g: 210, b: 250 }, // lavender
      { r: 213, g: 250, b: 211 }, // teal
      isLight ? { r: 26, g: 26, b: 26 } : { r: 250, g: 249, b: 240 }, // dark or cream
      { r: 216, g: 210, b: 250, a: 0.7 },
      { r: 213, g: 250, b: 211, a: 0.7 },
    ];

    const particles = [];
    const COUNT = 120;

    // Spawn from top-center with spread
    for (let i = 0; i < COUNT; i++) {
      const col = COLORS[Math.floor(Math.random() * COLORS.length)];
      const angle = (Math.random() - 0.5) * Math.PI * 0.8; // spread angle
      const speed = 4 + Math.random() * 8;
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.35 + (Math.random() - 0.5) * 80,
        vx: Math.sin(angle) * speed,
        vy: -Math.abs(Math.cos(angle) * speed) - Math.random() * 3,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        color: col,
        alpha: 0.9 + Math.random() * 0.1,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
        gravity: 0.12 + Math.random() * 0.06,
        drift: (Math.random() - 0.5) * 0.3,
        decay: 0.003 + Math.random() * 0.004,
      });
    }

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      particles.forEach(p => {
        if (p.alpha <= 0) return;
        alive++;
        p.vy += p.gravity;
        p.vx += p.drift * 0.02;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rotation += p.spin;
        p.alpha -= p.decay;
        if (p.alpha <= 0) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        const a = p.color.a || 1;
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${a})`;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive > 0) animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none" }} />;
};

const ResultScreen = ({ state, dispatch, theme }) => {
  const t = theme;
  const pct = Math.round((state.score / QUESTIONS.length) * 100);
  const tier = [...TIERS].reverse().find(tr => pct >= tr.min);
  const [animPct, setAnimPct] = useState(0);
  const isInfiniteVoyager = pct >= 81;
  const isRaffleEligible = isInfiniteVoyager && state.attempt === 1;
  const [showRaffleModal, setShowRaffleModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // ── Score history (localStorage, keyed per user) ──
  const [isNewBest, setIsNewBest] = useState(false);
  const [prevBestPct, setPrevBestPct] = useState(null);
  useEffect(() => {
    try {
      const userKey = `pi2-best-${(state.username || "anon").trim().toLowerCase()}`;
      const raw = localStorage.getItem(userKey);
      const data = raw ? JSON.parse(raw) : null;
      const prevBest = data?.bestPct ?? 0;
      const prevAttempts = data?.attempts ?? 0;
      setPrevBestPct(prevBest > 0 ? prevBest : null);
      if (pct > prevBest) {
        setIsNewBest(true);
        localStorage.setItem(userKey, JSON.stringify({
          bestScore: state.score,
          bestPct: pct,
          attempts: prevAttempts + 1,
          lastDate: new Date().toISOString(),
        }));
      } else {
        localStorage.setItem(userKey, JSON.stringify({
          ...data,
          attempts: prevAttempts + 1,
          lastDate: new Date().toISOString(),
        }));
      }
    } catch (_) { }
  }, []);

  useEffect(() => { playSound("complete"); }, []);
  useEffect(() => { const dur = 1500, start = Date.now(); const anim = () => { const e = Date.now() - start, p = Math.min(e / dur, 1), ea = 1 - Math.pow(1 - p, 3); setAnimPct(Math.round(ea * pct)); if (p < 1) requestAnimationFrame(anim); else { if (isInfiniteVoyager) setShowConfetti(true); if (isRaffleEligible) setTimeout(() => setShowRaffleModal(true), 800); } }; requestAnimationFrame(anim) }, [pct]);
  const byDiff = d => { const qs = state.answers.filter((_, i) => QUESTIONS[i].difficulty === d); return { correct: qs.filter(a => a.isCorrect).length, total: qs.length } };
  const diffMeta = getDiffMeta(t);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 4, animation: "pi2SlideUp 0.3s ease-out" }}>
      {showConfetti && <BrandConfetti theme={t} />}
      <Card theme={t} className="pi2-result-card" style={{ maxWidth: 480, width: "100%", padding: "40px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8, animation: "pi2ScoreCount 0.4s ease-out" }}>{tier.emoji}</div>
        <h2 style={{ fontFamily: BRAND.sans, fontSize: 24, fontWeight: 700, color: BRAND.light, marginBottom: 4 }}>{tier.title}</h2>
        {state.attempt > 1 && <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, color: "rgba(250,249,240,0.4)", background: t.badgeBg, border: "1px solid rgba(250,249,240,0.08)", marginBottom: 8 }}>Attempt #{state.attempt}</div>}
        {isNewBest && <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: BRAND.teal, background: t.badgeBg, border: "1px solid rgba(213,250,211,0.2)", marginBottom: 8, animation: "pi2SlideUp 0.3s ease-out" }}>🏆 New Personal Best!</div>}
        {!isNewBest && prevBestPct !== null && <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, color: "rgba(250,249,240,0.35)", background: t.badgeBg, border: "1px solid rgba(250,249,240,0.08)", marginBottom: 8 }}>Personal Best: <span style={{ fontFamily: BRAND.mono, fontWeight: 600, color: BRAND.lavender }}>{prevBestPct}%</span></div>}
        <p style={{ fontSize: 14, color: "rgba(250,249,240,0.4)", lineHeight: 1.6, maxWidth: 360, margin: "0 auto 24px", fontFamily: BRAND.sans }}>{tier.message}</p>
        <div className="pi2-score-ring" style={{ position: "relative", width: 120, height: 120, margin: "0 auto 24px" }}>
          <svg width={120} height={120} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={60} cy={60} r={52} fill="none" stroke="rgba(250,249,240,0.04)" strokeWidth={6} />
            <circle cx={60} cy={60} r={52} fill="none" stroke={BRAND.lavender} strokeWidth={6} strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - animPct / 100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.1s linear" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: BRAND.mono, fontSize: 32, fontWeight: 600, color: BRAND.light, fontVariantNumeric: "tabular-nums" }}>{animPct}%</span>
            <span style={{ fontSize: 11, color: "rgba(250,249,240,0.3)", fontWeight: 500, fontFamily: BRAND.mono }}>{state.score}/{QUESTIONS.length}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
          {["beginner", "intermediate", "advanced"].map(d => {
            const { correct, total } = byDiff(d); const dm = diffMeta[d]; return (
              <div key={d} style={{ padding: "12px 8px", borderRadius: 8, background: dm.bg, border: `1px solid ${dm.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: dm.color, marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{dm.label}</div>
                <div style={{ fontFamily: BRAND.mono, fontSize: 18, fontWeight: 600, color: BRAND.light }}>{correct}/{total}</div>
              </div>
            )
          })}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => dispatch({ type: "SHOW_CERTIFICATE" })} style={{ flex: 1, padding: "14px 16px", borderRadius: 8, border: "none", background: BRAND.lavender, color: BRAND.dark, fontFamily: BRAND.sans, fontSize: 14, fontWeight: 600, cursor: "pointer", minWidth: 140 }}>Get Certificate</button>
          <button onClick={() => dispatch({ type: "RESTART" })} style={{ flex: 1, padding: "14px 16px", borderRadius: 8, background: "transparent", border: "1px solid rgba(250,249,240,0.12)", color: BRAND.light, fontFamily: BRAND.sans, fontSize: 14, fontWeight: 500, cursor: "pointer", minWidth: 100 }}>↻ Retry</button>
        </div>
        {isRaffleEligible && <div style={{ marginTop: 12 }}>
          <button onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSdKqgvw5NZ6CGts_tOjqwaWrXaAXMU7rhu5iqEF1cID_ycubg/viewform?usp=publish-editor", "_blank")} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${t.tealBorder}`, background: t.tealBg, color: BRAND.teal, fontFamily: BRAND.sans, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>🎁 Enter $5 Raffle</button>
        </div>}
      </Card>
      {showRaffleModal && <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", animation: "pi2FadeIn 0.2s ease-out" }}>
        <div onClick={() => setShowRaffleModal(false)} style={{ position: "absolute", inset: 0, background: t.overlayBg }} />
        <div style={{ position: "relative", maxWidth: 400, width: "90%", padding: "40px 32px", borderRadius: 12, background: t.cardBg, border: `1px solid ${t.cardBorder}`, textAlign: "center" }}>
          <h3 style={{ fontFamily: BRAND.sans, fontSize: 20, fontWeight: 700, color: BRAND.light, marginBottom: 8 }}>Raffle Unlocked</h3>
          <p style={{ fontSize: 14, color: "rgba(250,249,240,0.4)", lineHeight: 1.6, marginBottom: 8, fontFamily: BRAND.sans }}>
            As an <span style={{ color: BRAND.light, fontWeight: 600 }}>Infinite Voyager</span> on your first attempt, you're eligible for the <span style={{ color: BRAND.teal, fontWeight: 600 }}>$5 raffle</span>.
          </p>
          <p style={{ fontSize: 12, color: "rgba(250,249,240,0.3)", marginBottom: 24, fontFamily: BRAND.sans }}>Fill out the form with your details to enter.</p>
          <button onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSdKqgvw5NZ6CGts_tOjqwaWrXaAXMU7rhu5iqEF1cID_ycubg/viewform?usp=publish-editor", "_blank")} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: BRAND.teal, color: BRAND.dark, fontFamily: BRAND.sans, fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>Enter Raffle</button>
          <button onClick={() => setShowRaffleModal(false)} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid rgba(250,249,240,0.08)", background: "transparent", color: "rgba(250,249,240,0.4)", fontFamily: BRAND.sans, fontSize: 14, fontWeight: 400, cursor: "pointer" }}>Maybe Later</button>
        </div>
      </div>}
    </div>
  );
};

const CertificateScreen = ({ state, dispatch, theme }) => {
  const t = theme;
  const pct = Math.round((state.score / QUESTIONS.length) * 100);
  const tier = [...TIERS].reverse().find(t => pct >= t.min);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const isTwitter = state.usernameType === "twitter";
  const displayName = isTwitter ? `@${state.username.replace("@", "")}` : state.username;
  const isRaffleEligible = pct >= 81 && state.attempt === 1;

  const drawCert = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");

    // High-resolution: 2× for crisp output
    const SCALE = 2;
    const W = 1400, H = 900;
    c.width = W * SCALE; c.height = H * SCALE;
    ctx.scale(SCALE, SCALE);

    // ── Brand palette only ──
    const CREAM = "#FAF9F0";
    const DARK = "#1A1A1A";
    const LAVENDER = "#D8D2FA";
    const TEAL = "#D5FAD3";

    // ── Brand fonts ──
    const SANS = "'Geist Sans', 'Inter', system-ui, sans-serif";
    const MONO = "'Geist Mono', 'JetBrains Mono', monospace";

    // ── Text wrap helper ──
    const wrapLines = (text, maxWidth, font) => {
      ctx.font = font;
      const words = text.split(" ");
      const lines = [];
      let line = "";
      words.forEach(w => {
        const test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      });
      if (line) lines.push(line);
      return lines;
    };

    const bg = new Image();
    bg.crossOrigin = "anonymous";
    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, W, H);
      ctx.textAlign = "center";

      // ═══════════════════════════════════════════════════════
      // ZONE 1 — Title  (fixed at Y=200)
      // ═══════════════════════════════════════════════════════
      ctx.font = `700 28px ${SANS}`;
      ctx.fillStyle = CREAM;
      ctx.letterSpacing = "0.12em";
      ctx.fillText("C E R T I F I C A T E", W / 2, 200);

      ctx.font = `500 13px ${SANS}`;
      ctx.fillStyle = LAVENDER;
      ctx.fillText("O F   A C H I E V E M E N T", W / 2, 226);

      // Divider with decorative diamond
      const divW = 200;
      const drawDivider = (y, width, alpha) => {
        const g = ctx.createLinearGradient(W / 2 - width, 0, W / 2 + width, 0);
        g.addColorStop(0, "transparent");
        g.addColorStop(0.25, `rgba(216,210,250,${alpha * 0.6})`);
        g.addColorStop(0.5, `rgba(216,210,250,${alpha})`);
        g.addColorStop(0.75, `rgba(216,210,250,${alpha * 0.6})`);
        g.addColorStop(1, "transparent");
        ctx.strokeStyle = g; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W / 2 - width, y);
        ctx.lineTo(W / 2 + width, y);
        ctx.stroke();
      };

      drawDivider(248, divW, 0.35);

      // Decorative diamond on first divider
      ctx.save();
      ctx.fillStyle = "rgba(216,210,250,0.4)";
      ctx.translate(W / 2, 248);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();

      // ═══════════════════════════════════════════════════════
      // ZONE 2 — Presented to + Username  (fixed Y=310, 378)
      // ═══════════════════════════════════════════════════════
      ctx.font = `500 12px ${SANS}`;
      ctx.fillStyle = "rgba(250,249,240,0.35)";
      ctx.fillText("P R O U D L Y   P R E S E N T E D   T O", W / 2, 310);

      ctx.save();
      ctx.font = `800 52px ${SANS}`;
      ctx.fillStyle = CREAM;
      ctx.fillText(displayName, W / 2, 378);
      ctx.restore();

      // Underline beneath name
      ctx.font = `800 52px ${SANS}`;
      const nameW = ctx.measureText(displayName).width || 200;
      const lineHalf = Math.min(nameW / 2 + 40, 380);
      const ulGrad = ctx.createLinearGradient(W / 2 - lineHalf, 0, W / 2 + lineHalf, 0);
      ulGrad.addColorStop(0, "transparent");
      ulGrad.addColorStop(0.2, "rgba(216,210,250,0.15)");
      ulGrad.addColorStop(0.5, "rgba(216,210,250,0.5)");
      ulGrad.addColorStop(0.8, "rgba(216,210,250,0.15)");
      ulGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = ulGrad; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2 - lineHalf, 400);
      ctx.lineTo(W / 2 + lineHalf, 400);
      ctx.stroke();

      // ═══════════════════════════════════════════════════════
      // ZONE 3 — Achievement text  (fixed block at Y=432–468)
      // Renders up to 3 lines, always centred as a block
      // ═══════════════════════════════════════════════════════
      const achFont = `400 16px ${SANS}`;
      const achLines = wrapLines(tier.achievement, 560, achFont);
      const achLineH = 26;
      // anchor the block so its vertical centre sits at Y=450
      const achBlockCY = 450;
      const achBlockH = achLines.length * achLineH;
      const achBlockTop = achBlockCY - achBlockH / 2 + achLineH / 2;
      ctx.font = achFont;
      ctx.fillStyle = "rgba(250,249,240,0.45)";
      achLines.forEach((line, i) => {
        ctx.fillText(line, W / 2, achBlockTop + i * achLineH);
      });

      // ═══════════════════════════════════════════════════════
      // ZONE 4 — Tier title  (fixed at Y=520)
      // ═══════════════════════════════════════════════════════
      const TIER_Y = 520;
      ctx.font = `700 34px ${SANS}`;
      ctx.fillStyle = LAVENDER;
      ctx.fillText(`${tier.emoji}  ${tier.title}  ${tier.emoji}`, W / 2, TIER_Y);

      // Tier divider line below title
      drawDivider(TIER_Y + 20, 280, 0.28);

      // ═══════════════════════════════════════════════════════
      // ZONE 5 — Score stats  (fixed at Y=575)
      // ═══════════════════════════════════════════════════════
      ctx.font = `600 14px ${MONO}`;
      ctx.fillStyle = TEAL;
      ctx.fillText(`${pct}%  ·  ${state.score}/${QUESTIONS.length} correct  ·  Attempt #${state.attempt}`, W / 2, 575);

      // ═══════════════════════════════════════════════════════
      // Seal — centred at Y=700
      // ═══════════════════════════════════════════════════════
      const sealX = W / 2, sealY = 700, sealR = 70;
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = LAVENDER;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(sealX, sealY, sealR - 10, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.onload = () => {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.arc(sealX, sealY, sealR - 14, 0, Math.PI * 2);
        ctx.clip();
        const logoSize = (sealR - 14) * 1.6;
        ctx.drawImage(logo, sealX - logoSize / 2, sealY - logoSize / 2, logoSize, logoSize);
        ctx.restore();
      };
      logo.src = "/PI2 logo light.jpeg";

      // ═══════════════════════════════════════════════════════
      // Footer  (fixed at Y=835)
      // ═══════════════════════════════════════════════════════
      ctx.font = `500 11px ${SANS}`;
      ctx.fillStyle = "rgba(250,249,240,0.18)";
      ctx.fillText("Pi² Community Quiz  ·  2026", W / 2, 835);
    };
    bg.src = "/certificate-bg.png";

  }, [displayName, pct, tier, state.score, state.attempt]);

  // Ensure fonts are loaded before drawing
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 300));
      } catch (e) { }
      setReady(true);
    };
    loadFonts();
  }, []);

  useEffect(() => { if (ready) drawCert(); }, [ready, drawCert]);
  useEffect(() => { if (ready) playSound("certificate"); }, [ready]);

  const downloadCert = () => {
    const c = canvasRef.current; if (!c) return;
    const link = document.createElement("a");
    link.download = `pi2-quiz-${state.username || "user"}.png`;
    link.href = c.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareToX = () => {
    const text = `I scored ${pct}% on the Pi² Network Quiz and earned "${tier.title}" ${tier.emoji}${state.attempt > 1 ? ` on attempt #${state.attempt}` : ""}!\n\nThink you can beat me? Take the quiz 👇\npi2-quiz.vercel.app\n\n@Pi2_Labs @PiSquared`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="pi2-cert-outer" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 4, animation: "pi2SlideUp 0.3s ease-out" }}>
      <div style={{ maxWidth: 680, width: "100%", textAlign: "center" }}>
        <h2 style={{ fontFamily: BRAND.sans, fontSize: 24, fontWeight: 700, color: t.pageText, marginBottom: 16 }}>Your Certificate</h2>
        <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${t.ghostBorder}`, marginBottom: 16 }}>
          {!ready && <div style={{ padding: 40, color: t.subtleText, fontSize: 14, fontFamily: BRAND.sans }}>Generating certificate...</div>}
          <canvas ref={canvasRef} style={{ width: "100%", height: "auto", aspectRatio: "14/9", display: ready ? "block" : "none" }} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={downloadCert} style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: BRAND.lavender, color: BRAND.dark, fontFamily: BRAND.sans, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>↓ Download</button>
          <button onClick={shareToX} style={{ padding: "12px 24px", borderRadius: 8, background: "transparent", border: `1px solid ${t.ghostBorder}`, color: t.pageText, fontFamily: BRAND.sans, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>𝕏 Share to X</button>
          <button onClick={() => dispatch({ type: "RESTART" })} style={{ padding: "12px 24px", borderRadius: 8, background: "transparent", border: `1px solid ${t.ghostBorder}`, color: t.pageText, fontFamily: BRAND.sans, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>↻ Retry</button>
        </div>
        {isRaffleEligible && <div style={{ marginTop: 10 }}>
          <button onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSdKqgvw5NZ6CGts_tOjqwaWrXaAXMU7rhu5iqEF1cID_ycubg/viewform?usp=publish-editor", "_blank")} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${t.tealBorder}`, background: t.tealBg, color: BRAND.teal, fontFamily: BRAND.sans, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>🎁 Enter $5 Raffle</button>
        </div>}
      </div>
    </div>
  );
};

// ─── SCREEN TRANSITION — smooth fade between screens ──────────────────────────
const ScreenTransition = ({ screenKey, children }) => {
  const containerRef = useRef(null);
  const [displayKey, setDisplayKey] = useState(screenKey);
  const [phase, setPhase] = useState("in"); // "in" | "out"
  const prevKeyRef = useRef(screenKey);

  useEffect(() => {
    if (screenKey === prevKeyRef.current) return;
    const prev = prevKeyRef.current;
    prevKeyRef.current = screenKey;

    // Loading screen has its own exit animation — skip fade-out
    if (prev === "loading") {
      setDisplayKey(screenKey);
      setPhase("in");
      return;
    }

    // Fade out old screen, then swap
    setPhase("out");
    const timer = setTimeout(() => {
      setDisplayKey(screenKey);
      setPhase("in");
    }, 200);
    return () => clearTimeout(timer);
  }, [screenKey]);

  return (
    <div
      ref={containerRef}
      style={{
        transition: "opacity 200ms ease, transform 200ms ease",
        opacity: phase === "out" ? 0 : 1,
        transform: phase === "out" ? "translateY(8px)" : "translateY(0)",
      }}
    >
      {typeof children === "function" ? children(displayKey) : children}
    </div>
  );
};

export default function Pi2Quiz() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { soundEnabled, toggleSound } = useSoundToggle();
  const { mode, theme, toggleTheme } = useTheme();
  useEffect(() => { injectStyles() }, []);
  useEffect(() => { if (!state.timerActive) return; const i = setInterval(() => dispatch({ type: "TICK" }), 1000); return () => clearInterval(i) }, [state.timerActive]);
  useEffect(() => { if (state.timeLeft === 0 && state.timerActive) dispatch({ type: "TIME_UP" }) }, [state.timeLeft, state.timerActive]);
  return (
    <div style={{ fontFamily: BRAND.sans, minHeight: "100vh", color: theme.pageText, position: "relative", transition: "color 0.3s ease" }}>
      <MinimalBackground theme={theme} />
      {/* ── Top-right controls: theme toggle + sound toggle ── */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 10, display: "flex", gap: 8 }}>
        <button onClick={toggleTheme} title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${theme.faintBorder}`, background: theme.faintBg, color: theme.pageText, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", opacity: 0.7 }} onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = theme.faintBg }} onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.background = theme.faintBg }}>{mode === "dark" ? "☀️" : "🌙"}</button>
        <button onClick={toggleSound} title={soundEnabled ? "Mute sounds" : "Enable sounds"} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${theme.faintBorder}`, background: theme.faintBg, color: soundEnabled ? theme.pageText : theme.subtleText, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", opacity: 0.7 }} onMouseEnter={e => { e.currentTarget.style.opacity = "1" }} onMouseLeave={e => { e.currentTarget.style.opacity = "0.7" }}>{soundEnabled ? "🔊" : "🔇"}</button>
      </div>
      <ScreenTransition screenKey={state.screen}>
        {(activeScreen) => (
          <>
            {activeScreen === "welcome" && <WelcomeScreen dispatch={dispatch} theme={theme} />}
            {activeScreen === "username" && <UsernameScreen state={state} dispatch={dispatch} theme={theme} />}
            {activeScreen === "loading" && <LoadingScreen dispatch={dispatch} theme={theme} />}
            {activeScreen === "quiz" && <QuizScreen state={state} dispatch={dispatch} theme={theme} />}
            {activeScreen === "transition" && <TransitionScreen state={state} dispatch={dispatch} theme={theme} />}
            {activeScreen === "result" && <ResultScreen state={state} dispatch={dispatch} theme={theme} />}
            {activeScreen === "certificate" && <CertificateScreen state={state} dispatch={dispatch} theme={theme} />}
          </>
        )}
      </ScreenTransition>
    </div>
  );
}
