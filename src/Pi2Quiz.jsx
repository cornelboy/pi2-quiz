import { useState, useEffect, useReducer, useCallback, useRef, useMemo } from "react";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const QUESTIONS = [
  { id:"b1",difficulty:"beginner",text:"What does Pi2 Network describe itself as?",options:["A social media blockchain","A traditional blockchain","An infinitely scalable network","A centralized exchange"],correct:2,explanation:"Pi2 is building an infinitely scalable network that goes beyond traditional blockchain limitations." },
  { id:"b2",difficulty:"beginner",text:"Who is the CEO & Co-Founder of Pi Squared?",options:["Vitalik Buterin","Grigore Roșu","Patrick MacKay","Xiaohong Chen"],correct:1,explanation:"Grigore Roșu, a UIUC computer science professor and former NASA researcher, co-founded Pi Squared." },
  { id:"b3",difficulty:"beginner",text:"What TPS did FastSet (Fast) achieve on Devnet 2.0?",options:["10,000 TPS","150,000 TPS","50,000 TPS","500,000 TPS"],correct:1,explanation:"FastSet (Fast) achieved 150,000+ TPS with sub-100ms finality on Devnet 2.0, targeting 1 million TPS at mainnet." },
  { id:"b4",difficulty:"beginner",text:"Who is Pi Squared's Chief Marketing Officer?",options:["Chris Hazelton","Nicholas Harness","Musab Alturki","Lindsay Casale"],correct:3,explanation:"Lindsay Casale serves as Chief Marketing Officer at Pi Squared." },
  { id:"b5",difficulty:"beginner",text:"Who is Pi Squared's CTO?",options:["Musab Alturki","Andrew Miller","Xiaohong Chen","Sriram Vishwanath"],correct:2,explanation:"Xiaohong Chen is the CTO — a formal methods engineer and ZK researcher, graduate of Peking University and UIUC." },
  { id:"b6",difficulty:"beginner",text:"How much did Pi Squared raise in its seed funding round?",options:["$12.5 million","$5 million","$25 million","$50 million"],correct:0,explanation:"Pi Squared raised $12.5 million in seed funding led by Polychain Capital in July 2024." },
  { id:"b7",difficulty:"beginner",text:"Which company led Pi Squared's seed round?",options:["Polychain Capital","Andreessen Horowitz","Sequoia Capital","Binance Labs"],correct:0,explanation:"Polychain Capital led the round, with participation from ABCDE, Robot Ventures, Samsung Next, and others." },
  { id:"b8",difficulty:"beginner",text:"What is Pi2's community stress-test mini-game called?",options:["Pi Blaster","Reactor","Chain Breaker","Node Runner"],correct:1,explanation:"The Pi2 Reactor is an interactive on-chain game where players click colored orbs to generate TPS and stress-test the network. It has attracted over 375,000 players." },
  { id:"b9",difficulty:"beginner",text:"Where is Pi Squared based?",options:["San Francisco, CA","Champaign, Illinois","New York, NY","Austin, Texas"],correct:1,explanation:"Pi Squared is headquartered in Champaign, Illinois, home of the University of Illinois." },
  { id:"b10",difficulty:"beginner",text:"What is Pi2 Labs' payment system for the agentic economy called?",options:["PaySet","AgentSwap","FastSet (Fast)","OmniPay"],correct:2,explanation:"FastSet (Fast) is Pi2 Labs' payment system designed for the agentic economy, enabling agents to move money globally at internet speed." },
  { id:"m1",difficulty:"intermediate",text:"What finality time does FastSet (Fast) target?",options:["Under 1 second","Sub-100 milliseconds","Under 10 seconds","Under 5 minutes"],correct:1,explanation:"FastSet (Fast) achieves sub-100ms finality — transactions settle in under a tenth of a second, approaching internet speed." },
  { id:"m2",difficulty:"intermediate",text:"What is Pi2's core verification concept called?",options:["Proof of Stake","Proof of Work","Proof of Authority","Proof of Proof"],correct:3,explanation:"Proof of Proof (PoP) refers to ZK proofs of mathematical proofs — verified by a small, universal proof checker that yields ZK proofs." },
  { id:"m3",difficulty:"intermediate",text:"What data structure does FastSet (Fast) use instead of a traditional ledger?",options:["A Merkle tree","A directed acyclic graph","A linked list","A set"],correct:3,explanation:"FastSet (Fast) maintains a set of transactions rather than an ordered ledger, enabling parallel processing because most claims are weakly independent." },
  { id:"m4",difficulty:"intermediate",text:"Who is Pi Squared's Ecosystem Lead?",options:["Chris Hazelton","Musab Alturki","Nicholas Harness","George Lambeth"],correct:2,explanation:"Nicholas Harness serves as Ecosystem Lead at Pi Squared." },
  { id:"m5",difficulty:"intermediate",text:"Which Ethereum Foundation researcher is an angel investor in Pi Squared?",options:["Vitalik Buterin","Danny Ryan","Justin Drake","Tim Beiko"],correct:2,explanation:"Justin Drake, an Ethereum Foundation core researcher, was among the angel investors in Pi Squared's $12.5M seed round." },
  { id:"m6",difficulty:"intermediate",text:"What is OmniSet (AllSet)?",options:["A token launchpad","An NFT marketplace","A staking platform","A universal liquidity and settlement layer"],correct:3,explanation:"OmniSet (AllSet) connects fragmented liquidity across blockchains into one cohesive, verifiable system — acting as a universal liquidity hub without relying on traditional bridges." },
  { id:"m7",difficulty:"intermediate",text:"What does Pi2 call transactions in its system?",options:["Claims","Blocks","Receipts","Entries"],correct:0,explanation:"Pi2 uses the term 'claims' instead of 'transactions.' Claims are settled and verified through mathematical proofs on FastSet (Fast)." },
  { id:"m8",difficulty:"intermediate",text:"Which EigenLayer founder is an advisor to Pi Squared?",options:["Vitalik Buterin","Sreeram Kannan","Anatoly Yakovenko","Gavin Wood"],correct:1,explanation:"Sreeram Kannan, founder of EigenLayer and a UIUC alum, serves as an advisor and angel investor." },
  { id:"m9",difficulty:"intermediate",text:"What does OmniSwap (AllSwap) do?",options:["Bridges NFTs between chains","Creates new tokens","Aggregates DEXs across networks for best swap rates","Manages validator nodes"],correct:2,explanation:"OmniSwap (AllSwap) is a cross-chain DEX aggregator built on top of OmniSet (AllSet). It discovers the best available swap rates and executes trades using verifiable proofs." },
  { id:"m10",difficulty:"intermediate",text:"Where did Grigore Roșu earn his Ph.D.?",options:["UC San Diego (UCSD)","MIT","Stanford University","Carnegie Mellon"],correct:0,explanation:"Roșu earned his Ph.D. in computer science from UCSD, then worked at NASA before becoming a professor at UIUC." },
  { id:"a1",difficulty:"advanced",text:"What formal verification framework did Grigore Roșu create over 20 years ago?",options:["Z Framework","L Framework","K Framework","V Framework"],correct:2,explanation:"The K Framework is a formal semantics system that defines programming languages as precise mathematical models. It's the foundation of Pi2's technology." },
  { id:"a2",difficulty:"advanced",text:"What approximate value does π² (pi squared) equal?",options:["6.2832","3.1416","7.3891","9.8696"],correct:3,explanation:"π² ≈ 9.8696 — interestingly close to the acceleration due to gravity (9.8 m/s²)." },
  { id:"a3",difficulty:"advanced",text:"According to Pi Squared's announcement, what is Pi² Labs described as?",options:["The team behind Fast, a new payment system for the agentic economy","A venture capital firm backing Web3 startups","A blockchain auditing company","A decentralized social media platform"],correct:0,explanation:"Pi² Labs (prev. Pi Squared) announced itself as the team behind Fast, a new payment system for the agentic economy." },
  { id:"a4",difficulty:"advanced",text:"How does the K Framework enable Pi2's universal verification?",options:["It compiles all code into a single virtual machine","It translates all languages into Solidity","It runs code in a sandbox environment","It defines programming language semantics mathematically, so every execution becomes a provable proof"],correct:3,explanation:"K defines programming languages through their formal semantics — meaning any program's execution can be mathematically proven correct, then verified with a small ZK circuit." },
  { id:"a5",difficulty:"advanced",text:"In the Pi2 stack, what are the roles of FastSet (Fast), OmniSet (AllSet), and OmniSwap (AllSwap)?",options:["FastSet is the settlement engine, OmniSet is the liquidity fabric, OmniSwap is the trading app","FastSet is the frontend, OmniSet is the backend, OmniSwap is storage","They are all independent products","FastSet and OmniSwap are the same thing"],correct:0,explanation:"FastSet (Fast) is the engine (settlement), OmniSet (AllSet) is the liquidity fabric (cross-chain), and OmniSwap (AllSwap) is an application layer for cross-chain swaps." },
  { id:"a6",difficulty:"advanced",text:"What does BYOL stand for in Pi2's ecosystem?",options:["Build Your Own Ledger","Bring Your Own Language","Buy Your Own License","Bridge Your Own Liquidity"],correct:1,explanation:"BYOL means developers can write smart contracts in Python, Rust, Java, C++, or any language — not just Solidity or Move." },
  { id:"a7",difficulty:"advanced",text:"What company did Grigore Roșu found before Pi Squared?",options:["Chainlink Labs","ConsenSys","Alchemy","Runtime Verification"],correct:3,explanation:"Roșu previously founded Runtime Verification, an industry-leading formal verification company that has served the Ethereum Foundation, Uniswap, Lido, Optimism, NASA, and others." },
  { id:"a8",difficulty:"advanced",text:"On February 24th, 2026, what did Pi Squared rebrand its research and team arm to?",options:["Pi2 Labs","Fast Labs","Pi2 Foundation","Pi2 Research"],correct:0,explanation:"Pi Squared rebranded to Pi2 Labs, announcing: The research and team behind what we are building now have a new home. Follow @Pi2_Labs. The future is Fast." },
  { id:"a9",difficulty:"advanced",text:"Which Samsung division invested in Pi Squared's seed round?",options:["Samsung Next","Samsung Electronics","Samsung Ventures","Samsung Research"],correct:0,explanation:"Samsung Next, Samsung's innovation and investment arm, participated alongside Polychain Capital, ABCDE, Robot Ventures, and others." },
  { id:"a10",difficulty:"advanced",text:"What makes Pi2's universal ZK circuit fundamentally different from other ZK systems?",options:["It's the largest circuit ever built","It only works with Ethereum smart contracts","It checks the integrity of mathematical proofs rather than re-executing computations","It requires specialized hardware to run"],correct:2,explanation:"Instead of re-running programs inside a ZK circuit (like most ZK rollups), Pi2's circuit verifies mathematical proofs generated by the K Framework — making it tiny, universal, and language-agnostic." },
];

const TIERS = [
  { min:0,max:20,title:"Orbit Rookie",emoji:"🌍",achievement:"You have taken your first steps into the Pi² universe and earned the rank of",message:"Every great journey starts with a single orbit. You've taken your first step into the Pi² universe — keep exploring!" },
  { min:21,max:40,title:"Gravity Walker",emoji:"🌙",achievement:"You have shown growing curiosity about the Pi² ecosystem and risen to",message:"You're breaking free from the gravitational pull of the unknown. The Pi² ecosystem is opening up to you!" },
  { min:41,max:60,title:"Light Speed Navigator",emoji:"🚀",achievement:"You have demonstrated solid understanding of Pi² technology and achieved the rank of",message:"You've hit light speed! Your understanding of Pi² technology is accelerating fast. The infinite awaits." },
  { min:61,max:80,title:"Quantum Pioneer",emoji:"⚡",achievement:"You have proven deep expertise in Pi²'s protocol and vision, earning the title of",message:"You have proven deep expertise in Pi²'s protocol and vision. The quantum frontier is yours to conquer!" },
  { min:81,max:100,title:"Infinite Voyager",emoji:"🪐",achievement:"You have demonstrated exceptional knowledge and mastery of the Pi² universe, earning the legendary title of",message:"You've reached infinite scalability — just like Pi². You are a true master of the Pi² universe!" },
];

const DIFF_META = {
  beginner:{label:"Beginner",color:"#34D399",bg:"rgba(52,211,153,0.1)",border:"rgba(52,211,153,0.25)",icon:"🌱"},
  intermediate:{label:"Intermediate",color:"#FBBF24",bg:"rgba(251,191,36,0.1)",border:"rgba(251,191,36,0.25)",icon:"⚡"},
  advanced:{label:"Advanced",color:"#F87171",bg:"rgba(248,113,113,0.1)",border:"rgba(248,113,113,0.25)",icon:"🔥"},
};

const initialState = { screen:"welcome",currentQ:0,score:0,answers:[],selected:null,showFeedback:false,timeLeft:20,timerActive:false,username:"",usernameType:"twitter",attempt:1 };

function reducer(state, action) {
  switch (action.type) {
    case "START_QUIZ": return {...state,screen:"username"};
    case "BEGIN_QUIZ": return {...state,screen:"loading"};
    case "LOADING_DONE": return {...state,screen:"quiz",currentQ:0,score:0,answers:[],selected:null,showFeedback:false,timeLeft:20,timerActive:true};
    case "SELECT_ANSWER": {
      if (state.showFeedback||state.selected!==null) return state;
      const q=QUESTIONS[state.currentQ]; const isCorrect=action.index===q.correct;
      return {...state,selected:action.index,showFeedback:true,timerActive:false,score:isCorrect?state.score+1:state.score,answers:[...state.answers,{questionId:q.id,selected:action.index,correct:q.correct,isCorrect}]};
    }
    case "TIME_UP": {
      if (state.showFeedback) return state;
      const tq=QUESTIONS[state.currentQ];
      return {...state,selected:-1,showFeedback:true,timerActive:false,answers:[...state.answers,{questionId:tq.id,selected:-1,correct:tq.correct,isCorrect:false}]};
    }
    case "NEXT_QUESTION": {
      const nextQ=state.currentQ+1;
      if (nextQ>=QUESTIONS.length) return {...state,screen:"result",timerActive:false};
      const prevDiff=QUESTIONS[state.currentQ].difficulty; const nextDiff=QUESTIONS[nextQ].difficulty;
      if (prevDiff!==nextDiff) return {...state,screen:"transition",currentQ:nextQ,selected:null,showFeedback:false,timeLeft:20};
      return {...state,currentQ:nextQ,selected:null,showFeedback:false,timeLeft:20,timerActive:true};
    }
    case "RESUME_FROM_TRANSITION": return {...state,screen:"quiz",selected:null,showFeedback:false,timeLeft:20,timerActive:true};
    case "TICK": return (!state.timerActive||state.timeLeft<=0)?state:{...state,timeLeft:state.timeLeft-1};
    case "SET_USERNAME": return {...state,username:action.value};
    case "SET_USERNAME_TYPE": return {...state,usernameType:action.value,username:""};
    case "SHOW_CERTIFICATE": return {...state,screen:"certificate"};
    case "RESTART": return {...initialState,username:state.username,usernameType:state.usernameType,attempt:state.attempt+1,screen:"loading"};
    default: return state;
  }
}

const injectStyles = () => {
  if (document.getElementById("pi2-quiz-styles")) return;
  const s = document.createElement("style"); s.id = "pi2-quiz-styles";
  s.textContent = `
    @keyframes synthGridScroll {
      0% { transform: perspective(400px) rotateX(62deg) translateY(0); }
      100% { transform: perspective(400px) rotateX(62deg) translateY(80px); }
    }
    @keyframes horizonPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    @keyframes starTwinkle {
      0%, 100% { opacity: 0.15; }
      50% { opacity: 0.7; }
    }
    @keyframes pi2SlideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pi2SlideIn { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
    @keyframes pi2FadeIn { from{opacity:0} to{opacity:1} }
    @keyframes pi2Shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
    @keyframes pi2CorrectPulse { 0%{box-shadow:0 0 0 0 rgba(52,211,153,0.4)} 70%{box-shadow:0 0 0 12px rgba(52,211,153,0)} 100%{box-shadow:0 0 0 0 rgba(52,211,153,0)} }
    @keyframes pi2TimerPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
    @keyframes pi2ScoreCount { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
    @keyframes pi2Confetti { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(400px) rotate(720deg);opacity:0} }
    @keyframes scanLine { 0%{transform:translateY(-100vh)} 100%{transform:translateY(100vh)} }
    @keyframes logoFadeScale { 0%{opacity:0;transform:scale(0.7)} 60%{opacity:1;transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
    @keyframes logoGlow { 0%,100%{filter:drop-shadow(0 0 8px rgba(168,85,247,0.3)) drop-shadow(0 0 20px rgba(255,45,149,0.1))} 50%{filter:drop-shadow(0 0 16px rgba(168,85,247,0.5)) drop-shadow(0 0 40px rgba(255,45,149,0.2))} }
    @keyframes borderRotate { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
    @keyframes sparkleFloat {
      0%{transform:translateY(0) scale(1);opacity:0}
      10%{opacity:1}
      90%{opacity:1}
      100%{transform:translateY(-120px) scale(0);opacity:0}
    }
    @keyframes ringExpand {
      0%{transform:translate(-50%,-50%) scale(0.8);opacity:0.4}
      100%{transform:translate(-50%,-50%) scale(1.8);opacity:0}
    }
    @keyframes avatarFloat {
      0%,100%{transform:translateY(0)}
      50%{transform:translateY(-8px)}
    }
    @keyframes inputGlow {
      0%,100%{box-shadow:0 0 15px rgba(124,58,237,0.15),0 0 30px rgba(255,45,149,0.05)}
      50%{box-shadow:0 0 25px rgba(124,58,237,0.3),0 0 50px rgba(255,45,149,0.1)}
    }
    @keyframes piSpin {
      0%{transform:rotate(0deg)}
      100%{transform:rotate(360deg)}
    }
    @keyframes piSpinGlow {
      0%,100%{filter:drop-shadow(0 0 12px rgba(168,85,247,0.4)) drop-shadow(0 0 30px rgba(255,45,149,0.15))}
      50%{filter:drop-shadow(0 0 24px rgba(168,85,247,0.6)) drop-shadow(0 0 50px rgba(255,45,149,0.25))}
    }
    @keyframes loadDots {
      0%{content:''}20%{content:'.'}40%{content:'..'}60%{content:'...'}80%{content:'...'}100%{content:''}
    }
    @keyframes loadBarFill {
      0%{width:0%}
      100%{width:100%}
    }
    @keyframes loadFadeOut {
      0%{opacity:1;transform:scale(1)}
      100%{opacity:0;transform:scale(1.1)}
    }
    .pi2-shake{animation:pi2Shake 0.5s ease-in-out} .pi2-correct-pulse{animation:pi2CorrectPulse 0.6s ease-out}
  `;
  document.head.appendChild(s);
};

// ─── SYNTHWAVE GRID BACKGROUND (portal.pi2.network style) ────────────────────
const SynthwaveBackground = () => {
  const stars = useMemo(() => Array.from({length: 60}, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 45}%`,
    size: Math.random() * 2 + 0.5,
    delay: `${Math.random() * 5}s`,
    duration: `${2 + Math.random() * 4}s`,
  })), []);

  return (
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",background:"#000000"}}>
      {/* Top dark-to-purple gradient (sky) */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"55%",
        background:"linear-gradient(180deg, #000000 0%, #05010d 30%, #0d0520 55%, #1a0a3e 80%, #2d1266 100%)",
      }}/>
      
      {/* Stars in the sky area */}
      {stars.map(s => (
        <div key={s.id} style={{
          position:"absolute", left:s.left, top:s.top,
          width:s.size, height:s.size, borderRadius:"50%",
          background:"#fff",
          animation:`starTwinkle ${s.duration} ease-in-out infinite`,
          animationDelay: s.delay,
        }}/>
      ))}

      {/* Horizon glow — subtle purple line */}
      <div style={{
        position:"absolute", top:"48%", left:0, right:0, height:2,
        background:"linear-gradient(90deg, transparent 10%, rgba(100,60,230,0.4) 30%, rgba(120,80,255,0.5) 50%, rgba(100,60,230,0.4) 70%, transparent 90%)",
        boxShadow:"0 0 20px 4px rgba(100,60,230,0.15), 0 0 60px 12px rgba(100,60,230,0.08)",
        zIndex:2,
      }}/>
      
      {/* Secondary horizon lines */}
      <div style={{
        position:"absolute", top:"46.5%", left:0, right:0, height:1,
        background:"linear-gradient(90deg, transparent 10%, rgba(100,60,230,0.15) 30%, rgba(100,60,230,0.08) 50%, rgba(100,60,230,0.15) 70%, transparent 90%)",
      }}/>
      <div style={{
        position:"absolute", top:"49.5%", left:0, right:0, height:1,
        background:"linear-gradient(90deg, transparent 10%, rgba(80,50,200,0.15) 30%, rgba(80,50,200,0.08) 50%, rgba(80,50,200,0.15) 70%, transparent 90%)",
      }}/>

      {/* THE GRID — perspective floor scrolling toward viewer */}
      <div style={{
        position:"absolute", top:"48%", left:0, right:0, bottom:0,
        overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", top:0, left:"-50%", width:"200%", height:"300%",
          backgroundImage:`
            linear-gradient(rgba(80,50,220,0.55) 1px, transparent 1px),
            linear-gradient(90deg, rgba(80,50,220,0.35) 1px, transparent 1px)
          `,
          backgroundSize:"80px 80px",
          animation:"synthGridScroll 4s linear infinite",
          transformOrigin:"top center",
        }}/>
      </div>

      {/* Vertical convergence lines (vanishing point rays) */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1,pointerEvents:"none"}} viewBox="0 0 1000 1000" preserveAspectRatio="none">
        {/* Radial lines from vanishing point */}
        {Array.from({length: 20}, (_, i) => {
          const x = (i / 19) * 1000;
          return <line key={i} x1="500" y1="480" x2={x} y2="1000"
            stroke="rgba(100,60,230,0.2)" strokeWidth="0.8"/>;
        })}
      </svg>

      {/* Horizontal purple accent lines across the grid */}
      {[52, 58, 66, 76, 90].map((top, i) => (
        <div key={i} style={{
          position:"absolute", top:`${top}%`, left:0, right:0,
          height: i === 0 ? 2 : 1,
          background:`linear-gradient(90deg, transparent 5%, rgba(100,60,230,${0.2 - i * 0.025}) 25%, rgba(100,60,230,${0.1 - i * 0.012}) 50%, rgba(100,60,230,${0.2 - i * 0.025}) 75%, transparent 95%)`,
          zIndex:1,
        }}/>
      ))}

      {/* Purple ambient glow in the center */}
      <div style={{
        position:"absolute", top:"35%", left:"50%", transform:"translate(-50%,-50%)",
        width:600, height:300, borderRadius:"50%",
        background:"radial-gradient(ellipse, rgba(100,40,200,0.15), transparent 70%)",
        filter:"blur(40px)", zIndex:1,
      }}/>

      {/* Subtle scan line effect */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        pointerEvents:"none", zIndex:3,
      }}/>

      {/* Vignette */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)",
        pointerEvents:"none", zIndex:3,
      }}/>
    </div>
  );
};

const Confetti = () => {
  const pieces = useMemo(()=>Array.from({length:40},(_,i)=>({id:i,left:`${Math.random()*100}%`,color:["#A855F7","#22D3EE","#34D399","#FBBF24","#F87171","#818CF8"][i%6],delay:`${Math.random()*2}s`,duration:`${2+Math.random()*2}s`,size:`${6+Math.random()*6}px`})),[]);
  return <div style={{position:"fixed",inset:0,zIndex:100,pointerEvents:"none",overflow:"hidden"}}>{pieces.map(p=><div key={p.id} style={{position:"absolute",top:"-10px",left:p.left,width:p.size,height:p.size,backgroundColor:p.color,borderRadius:Math.random()>0.5?"50%":"2px",animation:`pi2Confetti ${p.duration} ease-out forwards`,animationDelay:p.delay}}/>)}</div>;
};

const Glass = ({children,style={},...props}) => <div style={{background:"rgba(10,5,25,0.65)",border:"1px solid rgba(120,80,220,0.2)",borderRadius:20,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",...style}} {...props}>{children}</div>;

const TimerRing = ({timeLeft,total=20}) => {
  const pct=timeLeft/total; const circ=2*Math.PI*22; const off=circ*(1-pct);
  const isCrit=timeLeft<=5; const isLow=timeLeft<=10;
  const color=isCrit?"#EF4444":isLow?"#FBBF24":"#22D3EE";
  return (
    <div style={{position:"relative",width:56,height:56,animation:isCrit?"pi2TimerPulse 0.5s ease-in-out infinite":"none"}}>
      <svg width={56} height={56} style={{transform:"rotate(-90deg)"}}>
        <circle cx={28} cy={28} r={22} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4}/>
        <circle cx={28} cy={28} r={22} fill="none" stroke={color} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear,stroke 0.3s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color}}>{timeLeft}</div>
    </div>
  );
};

const ProgressBar = ({current,total}) => (
  <div style={{width:"100%",height:6,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
    <div style={{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#A855F7,#22D3EE)",width:`${(current/total)*100}%`,transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)"}}/>
  </div>
);

const DiffBadge = ({difficulty}) => { const m=DIFF_META[difficulty]; return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:100,fontSize:12,fontWeight:600,letterSpacing:0.5,color:m.color,background:m.bg,border:`1px solid ${m.border}`}}>{m.icon} {m.label}</span>; };

// ═════════════════════════════════════════════════════════════════════════════
// SCREENS
// ═════════════════════════════════════════════════════════════════════════════

const WelcomeScreen = ({dispatch}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 280, H = 120;
    canvas.width = W * 2; canvas.height = H * 2;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.scale(2, 2);

    // Draw target text to get pixel positions
    ctx.font = "300 80px 'Outfit', sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("π", W / 2 - 10, H / 2 + 5);
    ctx.font = "300 38px 'Outfit', sans-serif";
    ctx.fillText("2", W / 2 + 45, H / 2 - 18);

    // Sample target pixels
    const imgData = ctx.getImageData(0, 0, W * 2, H * 2);
    const targets = [];
    for (let y = 0; y < H * 2; y += 4) {
      for (let x = 0; x < W * 2; x += 4) {
        const i = (y * W * 2 + x) * 4;
        if (imgData.data[i + 3] > 128) {
          targets.push({ x: x / 2, y: y / 2 });
        }
      }
    }

    // Create particles at random positions
    const particles = targets.map(t => ({
      x: Math.random() * W, y: Math.random() * H,
      tx: t.x, ty: t.y,
      vx: 0, vy: 0,
      color: Math.random() < 0.3 ? `hsl(${270 + Math.random() * 60}, 80%, ${60 + Math.random() * 30}%)` : `rgba(255,255,255,${0.5 + Math.random() * 0.5})`,
      size: 1 + Math.random() * 1.2,
      arrived: false,
    }));

    let frame = 0;
    const assembleFrames = 120; // ~2s to assemble
    const holdFrames = 30; // ~0.5s hold as particles
    const dissolveFrames = 60; // ~1s dissolve to clean text
    const totalFrames = assembleFrames + holdFrames + dissolveFrames;
    let glowPhase = 0;
    let animId;

    const drawCleanLogo = (alpha, glowAmount) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(168,85,247,0.5)";
      ctx.shadowBlur = glowAmount;
      ctx.font = "300 80px 'Outfit', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("π", W / 2 - 10, H / 2 + 5);
      ctx.font = "300 38px 'Outfit', sans-serif";
      const grad = ctx.createLinearGradient(W/2+20, 0, W/2+65, H/2);
      grad.addColorStop(0, "rgba(168,85,247,1)");
      grad.addColorStop(0.5, "rgba(255,110,199,1)");
      grad.addColorStop(1, "rgba(34,211,238,1)");
      ctx.fillStyle = grad;
      ctx.fillText("2", W / 2 + 45, H / 2 - 18);
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      const assembleProgress = Math.min(frame / assembleFrames, 1);
      const ease = 1 - Math.pow(1 - assembleProgress, 3);
      const isDissolving = frame > assembleFrames + holdFrames;
      const dissolveProgress = isDissolving ? Math.min((frame - assembleFrames - holdFrames) / dissolveFrames, 1) : 0;
      const dissolveEase = dissolveProgress * dissolveProgress; // ease-in

      // Draw particles (fade out during dissolve)
      const particleAlpha = 1 - dissolveEase;
      if (particleAlpha > 0.01) {
        particles.forEach(p => {
          if (assembleProgress < 1) {
            p.x += (p.tx - p.x) * (0.03 + ease * 0.08);
            p.y += (p.ty - p.y) * (0.03 + ease * 0.08);
            if (assembleProgress < 0.7) {
              p.x += (Math.random() - 0.5) * (1 - ease) * 2;
              p.y += (Math.random() - 0.5) * (1 - ease) * 2;
            }
          } else if (isDissolving) {
            // Scatter outward during dissolve
            p.x += (p.x - W/2) * 0.008 + (Math.random()-0.5)*0.5;
            p.y += (p.y - H/2) * 0.008 + (Math.random()-0.5)*0.5;
          } else {
            p.x = p.tx; p.y = p.ty;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = (0.4 + ease * 0.6) * particleAlpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.5 + ease * 0.5), 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // Draw clean logo (fade in during dissolve)
      if (dissolveProgress > 0) {
        glowPhase += 0.03;
        const glowAmt = 12 + Math.sin(glowPhase) * 6;
        drawCleanLogo(dissolveEase, glowAmt);
      }

      // After fully dissolved, just pulse the clean logo
      if (dissolveProgress >= 1) {
        glowPhase += 0.02;
        const glowAmt = 10 + Math.sin(glowPhase) * 8;
        // Already drawn above, just keep animating glow
      }

      animId = requestAnimationFrame(animate);
    };

    // Small delay for font loading
    setTimeout(() => { animate(); }, 200);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"20px",position:"relative",zIndex:4,animation:"pi2SlideUp 0.8s ease-out"}}>
    <div style={{textAlign:"center",maxWidth:580}}>
      {/* Particle Assembly π² Logo */}
      <div style={{marginBottom:20,display:"flex",justifyContent:"center"}}>
        <canvas ref={canvasRef} style={{display:"block"}} />
      </div>
      <p style={{fontSize:12,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.3)",fontWeight:500,marginBottom:20}}>An Infinitely Scalable Network</p>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 16px",borderRadius:100,fontSize:12,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",color:"#ff6ec7",background:"rgba(255,110,199,0.06)",border:"1px solid rgba(255,110,199,0.15)",marginBottom:16}}>✦ Community Quiz ✦</div>
      <p style={{fontSize:16,color:"#94A3B8",lineHeight:1.7,maxWidth:440,margin:"0 auto 36px"}}>Test your knowledge of Pi Squared's technology, team, and ecosystem across three levels of difficulty.</p>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:28,maxWidth:480,margin:"0 auto 28px"}}>
        {[["30","Questions"],["3","Levels"],["20s","Per Question"],["🏆","Certificate"]].map(([v,l],i)=>(
          <div key={i} style={{padding:"10px 18px",borderRadius:12,background:"rgba(100,50,200,0.1)",border:"1px solid rgba(120,80,220,0.2)",fontSize:13,color:"#94A3B8"}}><span style={{color:"#F1F5F9",fontWeight:700,marginRight:5}}>{v}</span>{l}</div>
        ))}
      </div>
      <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:12,background:"rgba(255,200,50,0.06)",border:"1px solid rgba(255,200,50,0.2)",marginBottom:28}}>
        <span style={{fontSize:18}}>🎁</span>
        <span style={{fontSize:13,color:"#fbbf24",fontWeight:600}}>Score 81%+ on your first attempt to enter our $5 raffle!</span>
      </div>
      <button onClick={()=>dispatch({type:"START_QUIZ"})} style={{display:"inline-flex",alignItems:"center",gap:10,padding:"18px 48px",borderRadius:16,border:"none",background:"linear-gradient(135deg,#7c3aed,#ff2d95)",color:"white",fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 30px rgba(124,58,237,0.4), 0 0 60px rgba(255,45,149,0.15)",transition:"all 0.25s ease",letterSpacing:0.3}} onMouseEnter={e=>{e.target.style.transform="translateY(-3px)";e.target.style.boxShadow="0 8px 40px rgba(124,58,237,0.5), 0 0 80px rgba(255,45,149,0.25)"}} onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 4px 30px rgba(124,58,237,0.4), 0 0 60px rgba(255,45,149,0.15)"}}>Start Quiz →</button>
    </div>
  </div>
  );
};

const UsernameScreen = ({state,dispatch}) => {
  const isTwitter = state.usernameType === "twitter";
  const canProceed = state.username.trim().length >= 2;
  const sparkles = useMemo(() => Array.from({length:16}, (_,i) => ({
    id:i, left:`${10+Math.random()*80}%`, delay:`${Math.random()*4}s`,
    duration:`${2.5+Math.random()*2}s`, size:`${3+Math.random()*4}px`,
    color:["#A855F7","#ff6ec7","#22D3EE","#fff"][i%4],
  })), []);

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"20px",position:"relative",zIndex:4,animation:"pi2SlideUp 0.8s ease-out"}}>

      {/* Floating sparkles */}
      {sparkles.map(s => (
        <div key={s.id} style={{
          position:"absolute", left:s.left, bottom:"15%",
          width:s.size, height:s.size, borderRadius:"50%",
          background:s.color,
          boxShadow:`0 0 6px ${s.color}`,
          animation:`sparkleFloat ${s.duration} ease-out infinite`,
          animationDelay:s.delay,
          pointerEvents:"none", zIndex:5,
        }}/>
      ))}

      {/* Card with animated rotating gradient border */}
      <div style={{position:"relative",maxWidth:460,width:"100%"}}>
        {/* Rotating gradient border */}
        <div style={{
          position:"absolute",inset:-2,borderRadius:22,overflow:"hidden",
          zIndex:0,
        }}>
          <div style={{
            position:"absolute",inset:"-50%",
            background:"conic-gradient(from 0deg, #7c3aed, #ff2d95, #22D3EE, #7c3aed)",
            animation:"borderRotate 4s linear infinite",
            opacity:0.6,
          }}/>
        </div>

        {/* Expanding ring pulses behind card */}
        {[0,1,2].map(i => (
          <div key={i} style={{
            position:"absolute",top:"25%",left:"50%",
            width:200,height:200,borderRadius:"50%",
            border:"1px solid rgba(168,85,247,0.2)",
            animation:`ringExpand 3s ease-out infinite`,
            animationDelay:`${i*1}s`,
            pointerEvents:"none",zIndex:0,
          }}/>
        ))}

        <div style={{
          position:"relative",zIndex:1,
          background:"rgba(8,4,20,0.85)",
          border:"1px solid rgba(120,80,220,0.15)",
          borderRadius:20,
          backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
          padding:"48px 36px",textAlign:"center",
        }}>
          {/* Glowing avatar orb */}
          <div style={{
            width:72,height:72,borderRadius:"50%",
            margin:"0 auto 20px",
            background:"radial-gradient(circle at 40% 35%, rgba(168,85,247,0.4), rgba(124,58,237,0.2) 60%, rgba(255,45,149,0.1))",
            border:"2px solid rgba(168,85,247,0.3)",
            display:"flex",alignItems:"center",justifyContent:"center",
            animation:"avatarFloat 3s ease-in-out infinite",
            boxShadow:"0 0 30px rgba(124,58,237,0.25), 0 0 60px rgba(255,45,149,0.1)",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>

          <h2 style={{fontFamily:"'Outfit'",fontSize:28,fontWeight:800,color:"#F1F5F9",marginBottom:6,letterSpacing:-0.5}}>
            Before we begin...
          </h2>
          <p style={{fontSize:14,color:"#94A3B8",lineHeight:1.6,marginBottom:28}}>
            Enter your username so we can personalize your certificate at the end.
          </p>

          {/* Platform toggle */}
          <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>
            {[
              {key:"twitter",label:"𝕏  Twitter"},
              {key:"discord",label:"Discord",svg:true},
            ].map(p=>(
              <button key={p.key} onClick={()=>dispatch({type:"SET_USERNAME_TYPE",value:p.key})}
                style={{
                  padding:"10px 24px",borderRadius:12,
                  background:state.usernameType===p.key
                    ?"linear-gradient(135deg,rgba(124,58,237,0.25),rgba(255,45,149,0.15))"
                    :"rgba(100,50,200,0.05)",
                  border:`1px solid ${state.usernameType===p.key?"rgba(168,85,247,0.5)":"rgba(120,80,220,0.15)"}`,
                  color:state.usernameType===p.key?"#F1F5F9":"#64748B",
                  fontFamily:"'Outfit'",fontSize:14,fontWeight:600,cursor:"pointer",
                  transition:"all 0.25s ease",
                  boxShadow:state.usernameType===p.key?"0 0 20px rgba(124,58,237,0.15)":"none",
                }}
              >{p.svg ? <span style={{display:"inline-flex",alignItems:"center",gap:6}}><svg width="18" height="14" viewBox="0 0 71 55" fill="currentColor"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A26.5 26.5 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18.7-.9 32.2.3 45.5v.2a58.9 58.9 0 0017.7 9 .2.2 0 00.3-.1 42.1 42.1 0 003.6-5.9.2.2 0 00-.1-.3 38.8 38.8 0 01-5.5-2.7.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 42 42 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.7.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.7 58.7 0 0070.5 45.7v-.2c1.4-15-2.3-28.1-9.8-39.7a.2.2 0 00-.1 0zM23.7 37.3c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.2 6.3 7-2.8 7-6.3 7zm23.2 0c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.2 6.3 7-2.8 7-6.3 7z"/></svg>{p.label}</span> : p.label}</button>
            ))}
          </div>

          {/* Input with glow */}
          <div style={{position:"relative",marginBottom:28}}>
            <div style={{
              display:"flex",alignItems:"center",gap:8,
              padding:"14px 20px",borderRadius:14,
              background:"rgba(100,50,200,0.08)",
              border:"1px solid rgba(120,80,220,0.3)",
              animation:canProceed?"inputGlow 2s ease-in-out infinite":"none",
              transition:"all 0.3s ease",
            }}>
              {isTwitter && <span style={{fontSize:18,fontWeight:700,color:"#A855F7",fontFamily:"'JetBrains Mono'"}}>@</span>}
              <input
                type="text"
                value={state.username}
                onChange={e => {
                  const val = isTwitter
                    ? e.target.value.replace(/[^a-zA-Z0-9_]/g,"")
                    : e.target.value.replace(/[^a-zA-Z0-9_.\-#]/g,"");
                  dispatch({type:"SET_USERNAME",value:val});
                }}
                placeholder={isTwitter ? "your_twitter_handle" : "username#0000"}
                maxLength={isTwitter ? 15 : 37}
                autoFocus
                style={{
                  flex:1,background:"transparent",border:"none",
                  color:"#F1F5F9",fontSize:18,fontWeight:600,
                  fontFamily:"'JetBrains Mono',monospace",outline:"none",
                }}
                onKeyDown={e=>{if(e.key==="Enter"&&canProceed)dispatch({type:"BEGIN_QUIZ"})}}
              />
            </div>
          </div>

          <button
            onClick={()=>dispatch({type:"BEGIN_QUIZ"})}
            disabled={!canProceed}
            style={{
              width:"100%",padding:"16px",borderRadius:14,border:"none",
              background:canProceed?"linear-gradient(135deg,#7c3aed,#ff2d95)":"rgba(100,50,200,0.1)",
              color:canProceed?"white":"#64748B",
              fontFamily:"'Outfit'",fontSize:17,fontWeight:700,
              cursor:canProceed?"pointer":"not-allowed",
              opacity:canProceed?1:0.4,
              boxShadow:canProceed?"0 4px 30px rgba(124,58,237,0.35), 0 0 60px rgba(255,45,149,0.12)":"none",
              transition:"all 0.3s ease",
              transform:canProceed?"scale(1)":"scale(0.98)",
            }}
          >
            Let's Go →
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingScreen = ({dispatch}) => {
  const [phase, setPhase] = useState(0); // 0=spinning, 1=ready, 2=fadeout
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Dot animation
    const dotInterval = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".");
    }, 400);
    // After 2.2s show "READY"
    const readyTimer = setTimeout(() => setPhase(1), 2200);
    // After 2.8s fade out
    const fadeTimer = setTimeout(() => setPhase(2), 2800);
    // After 3.2s dispatch
    const goTimer = setTimeout(() => dispatch({type:"LOADING_DONE"}), 3200);
    return () => { clearInterval(dotInterval); clearTimeout(readyTimer); clearTimeout(fadeTimer); clearTimeout(goTimer); };
  }, [dispatch]);

  return (
    <div style={{
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      minHeight:"100vh",padding:"20px",position:"relative",zIndex:4,
      animation: phase === 2 ? "loadFadeOut 0.4s ease-out forwards" : "pi2FadeIn 0.4s ease",
    }}>
      {/* Spinning π² logo */}
      <div style={{
        position:"relative",width:120,height:120,marginBottom:36,
        animation:"piSpinGlow 2s ease-in-out infinite",
      }}>
        {/* Orbit ring */}
        <div style={{
          position:"absolute",inset:-12,borderRadius:"50%",
          border:"2px solid transparent",
          borderTopColor:"rgba(168,85,247,0.5)",
          borderRightColor:"rgba(255,45,149,0.3)",
          animation:"piSpin 1.5s linear infinite",
        }}/>
        <div style={{
          position:"absolute",inset:-4,borderRadius:"50%",
          border:"1px solid transparent",
          borderBottomColor:"rgba(34,211,238,0.4)",
          borderLeftColor:"rgba(168,85,247,0.2)",
          animation:"piSpin 2.5s linear infinite reverse",
        }}/>
        {/* Inner glow */}
        <div style={{
          position:"absolute",inset:0,borderRadius:"50%",
          background:"radial-gradient(circle at 40% 40%, rgba(124,58,237,0.15), rgba(255,45,149,0.05) 70%, transparent)",
        }}/>
        {/* π² text */}
        <div style={{
          position:"absolute",inset:0,
          display:"flex",alignItems:"center",justifyContent:"center",
        }}>
          <span style={{
            fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:300,
            color:"rgba(255,255,255,0.9)",
            textShadow:"0 0 20px rgba(168,85,247,0.4)",
          }}>
            π<sup style={{fontSize:"0.5em",position:"relative",top:"-0.4em"}}>2</sup>
          </span>
        </div>
      </div>

      {/* Text */}
      <div style={{textAlign:"center"}}>
        {phase === 0 && (
          <p style={{
            fontFamily:"'Outfit'",fontSize:18,fontWeight:500,
            color:"#94A3B8",letterSpacing:0.5,
          }}>
            Preparing your challenge{dots}
          </p>
        )}
        {phase >= 1 && (
          <p style={{
            fontFamily:"'Outfit'",fontSize:28,fontWeight:800,
            background:"linear-gradient(135deg,#A855F7,#ff2d95,#22D3EE)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            backgroundClip:"text",
            animation:"pi2SlideUp 0.3s ease-out",
            letterSpacing:1,
          }}>
            READY!
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div style={{
        width:200,height:3,borderRadius:2,marginTop:24,
        background:"rgba(255,255,255,0.06)",overflow:"hidden",
      }}>
        <div style={{
          height:"100%",borderRadius:2,
          background:"linear-gradient(90deg,#7c3aed,#ff2d95,#22D3EE)",
          animation:"loadBarFill 2.8s ease-out forwards",
        }}/>
      </div>
    </div>
  );
};

const QuizScreen = ({state,dispatch}) => {
  const q=QUESTIONS[state.currentQ];
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"20px",position:"relative",zIndex:4}}>
      <div style={{width:"100%",maxWidth:640}} key={state.currentQ}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,animation:"pi2FadeIn 0.3s ease"}}>
          <DiffBadge difficulty={q.difficulty}/>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:600,color:"#64748B"}}>{state.currentQ+1} / {QUESTIONS.length}</div>
          <TimerRing timeLeft={state.timeLeft}/>
        </div>
        <div style={{marginBottom:28}}><ProgressBar current={state.currentQ+(state.showFeedback?1:0)} total={QUESTIONS.length}/></div>
        <Glass style={{padding:"36px 32px",marginBottom:20,animation:"pi2SlideIn 0.45s ease-out"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:12,fontWeight:500,color:"#64748B",letterSpacing:1,textTransform:"uppercase"}}>{q.difficulty} · Question {state.currentQ+1}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:600,color:"#A855F7"}}>Score: {state.score}/{state.currentQ+(state.showFeedback?1:0)}</span>
          </div>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(18px,3.5vw,22px)",fontWeight:700,lineHeight:1.4,color:"#F1F5F9"}}>{q.text}</h2>
        </Glass>
        <div style={{display:"flex",flexDirection:"column",gap:10,animation:"pi2SlideUp 0.5s ease-out"}}>
          {q.options.map((opt,i)=>{
            const isSelected=state.selected===i; const isCorrect=i===q.correct;
            const showCorrect=state.showFeedback&&isCorrect; const showWrong=state.showFeedback&&isSelected&&!isCorrect;
            let bg="rgba(10,5,25,0.5)",border="rgba(120,80,220,0.15)",tc="#E2E8F0",anim="";
            if(showCorrect){bg="rgba(52,211,153,0.12)";border="rgba(52,211,153,0.4)";tc="#34D399";anim="pi2-correct-pulse";}
            else if(showWrong){bg="rgba(248,113,113,0.12)";border="rgba(248,113,113,0.4)";tc="#F87171";anim="pi2-shake";}
            else if(state.showFeedback){bg="rgba(10,5,25,0.3)";tc="#64748B";}
            return (
              <button key={i} className={anim} onClick={()=>!state.showFeedback&&dispatch({type:"SELECT_ANSWER",index:i})} disabled={state.showFeedback}
                style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"16px 20px",borderRadius:14,border:`1px solid ${border}`,background:bg,color:tc,fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:500,textAlign:"left",cursor:state.showFeedback?"default":"pointer",transition:"all 0.2s ease",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"}}
                onMouseEnter={e=>{if(!state.showFeedback){e.currentTarget.style.background="rgba(120,80,220,0.15)";e.currentTarget.style.borderColor="rgba(168,85,247,0.5)";e.currentTarget.style.transform="translateY(-2px)"}}}
                onMouseLeave={e=>{if(!state.showFeedback){e.currentTarget.style.background=bg;e.currentTarget.style.borderColor=border;e.currentTarget.style.transform="translateY(0)"}}}
              >
                <span style={{width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0,background:showCorrect?"rgba(52,211,153,0.2)":showWrong?"rgba(248,113,113,0.2)":"rgba(120,80,220,0.15)",color:showCorrect?"#34D399":showWrong?"#F87171":"#94A3B8",fontFamily:"'JetBrains Mono',monospace"}}>{showCorrect?"✓":showWrong?"✕":String.fromCharCode(65+i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {state.showFeedback&&(
          <div style={{animation:"pi2SlideUp 0.4s ease-out"}}>
            <Glass style={{marginTop:16,padding:"18px 22px",borderColor:state.selected===q.correct?"rgba(52,211,153,0.2)":state.selected===-1?"rgba(251,191,36,0.2)":"rgba(248,113,113,0.2)"}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:6,color:state.selected===q.correct?"#34D399":state.selected===-1?"#FBBF24":"#F87171"}}>{state.selected===q.correct?"✓ Correct!":state.selected===-1?"⏱ Time's up!":"✕ Incorrect"}</div>
              <div style={{fontSize:14,color:"#94A3B8",lineHeight:1.6}}>{q.explanation}</div>
            </Glass>
            <button onClick={()=>dispatch({type:"NEXT_QUESTION"})} style={{marginTop:16,width:"100%",padding:"15px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#7c3aed,#ff2d95)",color:"white",fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:700,cursor:"pointer"}}>
              {state.currentQ+1>=QUESTIONS.length?"See Results →":"Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TransitionScreen = ({state,dispatch}) => {
  const nextDiff=QUESTIONS[state.currentQ].difficulty; const dm=DIFF_META[nextDiff];
  const prevScore=state.answers.filter(a=>a.isCorrect).length; const prevTotal=state.answers.length;
  const msgs={intermediate:{title:"Level Up!",sub:"You've cleared the Beginner round. Time to test your deeper knowledge."},advanced:{title:"Final Level!",sub:"You've made it to Advanced. These questions separate the experts from the explorers."}};
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"20px",position:"relative",zIndex:4,animation:"pi2SlideUp 0.8s ease-out"}}>
      <Glass style={{maxWidth:480,width:"100%",padding:"48px 36px",textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:16}}>{dm.icon}</div>
        <h2 style={{fontFamily:"'Outfit'",fontSize:32,fontWeight:800,color:"#F1F5F9",marginBottom:8}}>{msgs[nextDiff]?.title}</h2>
        <p style={{fontSize:15,color:"#94A3B8",lineHeight:1.6,marginBottom:24}}>{msgs[nextDiff]?.sub}</p>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:32,padding:"16px",borderRadius:14,background:"rgba(100,50,200,0.08)"}}>
          <div style={{textAlign:"center"}}><div style={{fontFamily:"'JetBrains Mono'",fontSize:24,fontWeight:700,color:"#A855F7"}}>{prevScore}</div><div style={{fontSize:12,color:"#64748B",marginTop:2}}>Correct</div></div>
          <div style={{width:1,background:"rgba(120,80,220,0.2)"}}/>
          <div style={{textAlign:"center"}}><div style={{fontFamily:"'JetBrains Mono'",fontSize:24,fontWeight:700,color:"#22D3EE"}}>{prevTotal}</div><div style={{fontSize:12,color:"#64748B",marginTop:2}}>Answered</div></div>
        </div>
        <DiffBadge difficulty={nextDiff}/>
        <button onClick={()=>dispatch({type:"RESUME_FROM_TRANSITION"})} style={{display:"block",width:"100%",marginTop:28,padding:"16px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#7c3aed,#ff2d95)",color:"white",fontFamily:"'Outfit'",fontSize:17,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 24px rgba(124,58,237,0.3)"}}>Continue →</button>
      </Glass>
    </div>
  );
};

const ResultScreen = ({state,dispatch}) => {
  const pct=Math.round((state.score/QUESTIONS.length)*100);
  const tier=[...TIERS].reverse().find(t=>pct>=t.min);
  const [animPct,setAnimPct]=useState(0);
  const [showConfetti,setShowConfetti]=useState(false);
  const isRaffleEligible = pct >= 81 && state.attempt === 1;
  const [showRaffleModal,setShowRaffleModal]=useState(false);
  useEffect(()=>{const dur=1500,start=Date.now();const anim=()=>{const e=Date.now()-start,p=Math.min(e/dur,1),ea=1-Math.pow(1-p,3);setAnimPct(Math.round(ea*pct));if(p<1)requestAnimationFrame(anim);else{if(pct>=60)setShowConfetti(true);if(isRaffleEligible)setTimeout(()=>setShowRaffleModal(true),800);}};requestAnimationFrame(anim)},[pct]);
  const byDiff=d=>{const qs=state.answers.filter((_,i)=>QUESTIONS[i].difficulty===d);return{correct:qs.filter(a=>a.isCorrect).length,total:qs.length}};
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"20px",position:"relative",zIndex:4,animation:"pi2SlideUp 0.8s ease-out"}}>
      {showConfetti&&<Confetti/>}
      <Glass style={{maxWidth:520,width:"100%",padding:"44px 36px",textAlign:"center"}}>
        <div style={{fontSize:60,marginBottom:8,animation:"pi2ScoreCount 0.6s ease-out"}}>{tier.emoji}</div>
        <h2 style={{fontFamily:"'Outfit'",fontSize:28,fontWeight:800,color:"#F1F5F9",marginBottom:4}}>{tier.title}</h2>
        {state.attempt > 1 && <div style={{display:"inline-flex",padding:"4px 12px",borderRadius:100,fontSize:11,fontWeight:600,color:"#94A3B8",background:"rgba(100,50,200,0.1)",border:"1px solid rgba(120,80,220,0.15)",marginBottom:8}}>Attempt #{state.attempt}</div>}
        <p style={{fontSize:14,color:"#94A3B8",lineHeight:1.6,maxWidth:380,margin:"0 auto 28px"}}>{tier.message}</p>
        <div style={{position:"relative",width:140,height:140,margin:"0 auto 28px"}}>
          <svg width={140} height={140} style={{transform:"rotate(-90deg)"}}>
            <circle cx={70} cy={70} r={60} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8}/>
            <circle cx={70} cy={70} r={60} fill="none" stroke="url(#scoreGrad)" strokeWidth={8} strokeDasharray={2*Math.PI*60} strokeDashoffset={2*Math.PI*60*(1-animPct/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.1s linear"}}/>
            <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#ff2d95"/></linearGradient></defs>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'JetBrains Mono'",fontSize:36,fontWeight:700,color:"#F1F5F9"}}>{animPct}%</span>
            <span style={{fontSize:11,color:"#64748B",fontWeight:500}}>{state.score}/{QUESTIONS.length}</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:28}}>
          {["beginner","intermediate","advanced"].map(d=>{const{correct,total}=byDiff(d);const dm=DIFF_META[d];return(
            <div key={d} style={{padding:"14px 10px",borderRadius:12,background:dm.bg,border:`1px solid ${dm.border}`,textAlign:"center"}}>
              <div style={{fontSize:11,fontWeight:600,color:dm.color,marginBottom:4}}>{dm.icon} {dm.label}</div>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:18,fontWeight:700,color:"#F1F5F9"}}>{correct}/{total}</div>
            </div>
          )})}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <button onClick={()=>dispatch({type:"SHOW_CERTIFICATE"})} style={{flex:1,padding:"15px 20px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#7c3aed,#ff2d95)",color:"white",fontFamily:"'Outfit'",fontSize:15,fontWeight:700,cursor:"pointer",minWidth:160}}>🏆 Get Certificate</button>
          <button onClick={()=>dispatch({type:"RESTART"})} style={{flex:1,padding:"15px 20px",borderRadius:14,background:"rgba(100,50,200,0.1)",border:"1px solid rgba(120,80,220,0.2)",color:"#E2E8F0",fontFamily:"'Outfit'",fontSize:15,fontWeight:600,cursor:"pointer",minWidth:120}}>↻ Retry</button>
        </div>
        {isRaffleEligible && <div style={{marginTop:14}}>
          <button onClick={()=>window.open("https://docs.google.com/forms/d/e/1FAIpQLSdKqgvw5NZ6CGts_tOjqwaWrXaAXMU7rhu5iqEF1cID_ycubg/viewform?usp=publish-editor","_blank")} style={{width:"100%",padding:"14px 20px",borderRadius:14,border:"1px solid rgba(255,200,50,0.3)",background:"rgba(255,200,50,0.08)",color:"#fbbf24",fontFamily:"'Outfit'",fontSize:15,fontWeight:700,cursor:"pointer"}}>🎁 Enter $5 Raffle</button>
        </div>}
      </Glass>
      {showRaffleModal && <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",animation:"pi2FadeIn 0.3s ease-out"}}>
        <div onClick={()=>setShowRaffleModal(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)"}}/>
        <div style={{position:"relative",maxWidth:420,width:"90%",padding:"40px 32px",borderRadius:24,background:"linear-gradient(145deg,#0c0d18 0%,#1a0a3e 100%)",border:"1px solid rgba(255,200,50,0.25)",boxShadow:"0 0 60px rgba(255,200,50,0.1), 0 20px 60px rgba(0,0,0,0.5)",textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:12}}>🎉</div>
          <h3 style={{fontFamily:"'Outfit'",fontSize:24,fontWeight:800,color:"#fbbf24",marginBottom:8}}>You've Unlocked the Raffle!</h3>
          <p style={{fontSize:14,color:"#94A3B8",lineHeight:1.6,marginBottom:8}}>
            As an <span style={{color:"#F1F5F9",fontWeight:600}}>Infinite Voyager</span> on your first attempt, you're eligible to enter our <span style={{color:"#fbbf24",fontWeight:700}}>$5 raffle</span>!
          </p>
          <p style={{fontSize:12,color:"#64748B",marginBottom:24}}>Fill out the form with your details to enter.</p>
          <button onClick={()=>window.open("https://docs.google.com/forms/d/e/1FAIpQLSdKqgvw5NZ6CGts_tOjqwaWrXaAXMU7rhu5iqEF1cID_ycubg/viewform?usp=publish-editor","_blank")} style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#f59e0b,#fbbf24)",color:"#0a0a12",fontFamily:"'Outfit'",fontSize:16,fontWeight:800,cursor:"pointer",marginBottom:12,boxShadow:"0 4px 20px rgba(251,191,36,0.3)"}}>🎁 Enter Raffle Now</button>
          <button onClick={()=>setShowRaffleModal(false)} style={{width:"100%",padding:"12px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94A3B8",fontFamily:"'Outfit'",fontSize:14,fontWeight:500,cursor:"pointer"}}>Maybe Later</button>
        </div>
      </div>}
    </div>
  );
};

const CertificateScreen = ({state,dispatch}) => {
  const pct=Math.round((state.score/QUESTIONS.length)*100);
  const tier=[...TIERS].reverse().find(t=>pct>=t.min);
  const canvasRef=useRef(null);
  const [ready, setReady] = useState(false);
  const isTwitter = state.usernameType === "twitter";
  const displayName = isTwitter ? `@${state.username.replace("@","")}` : state.username;
  const isRaffleEligible = pct >= 81 && state.attempt === 1;

  const drawCert = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const W = 1000, H = 620;
    c.width = W; c.height = H;

    const ICE = "#00D4FF";
    const ICE_DIM = "rgba(0,212,255,0.35)";
    const PURPLE = "#A855F7";
    const PURPLE_DIM = "rgba(168,85,247,0.3)";
    const SILVER = "#C0C0C0";
    const WHITE = "#FFFFFF";
    const BG = "#08090f";
    const BG_INNER = "#0c0d18";

    // === BACKGROUND ===
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(0,212,255,0.03)";
    ctx.fillRect(0, 0, W, H);

    // === GUILLOCHE-STYLE DECORATIVE BORDER ===
    ctx.strokeStyle = ICE_DIM; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(18, 18, W-36, H-36, 6); ctx.stroke();

    ctx.strokeStyle = PURPLE_DIM; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(26, 26, W-52, H-52, 4); ctx.stroke();

    // Dot pattern between borders
    for (let x = 40; x < W-40; x += 8) {
      ctx.fillStyle = ICE; ctx.globalAlpha = 0.08;
      ctx.beginPath(); ctx.arc(x, 22, 0.8, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x, H-22, 0.8, 0, Math.PI*2); ctx.fill();
    }
    for (let y = 40; y < H-40; y += 8) {
      ctx.beginPath(); ctx.arc(22, y, 0.8, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(W-22, y, 0.8, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Wavy decorative border (guilloche waves)
    ctx.strokeStyle = "rgba(0,212,255,0.08)"; ctx.lineWidth = 1;
    for (let offset = 0; offset < 2; offset++) {
      const m = 34 + offset * 6;
      ctx.beginPath();
      for (let x = m; x < W-m; x++) {
        const y = m + Math.sin((x - m) * 0.08) * 3;
        x === m ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let x = m; x < W-m; x++) {
        const y = H - m + Math.sin((x - m) * 0.08) * 3;
        x === m ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let y = m; y < H-m; y++) {
        const x = m + Math.sin((y - m) * 0.08) * 3;
        y === m ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let y = m; y < H-m; y++) {
        const x = W - m + Math.sin((y - m) * 0.08) * 3;
        y === m ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Inner content border
    ctx.strokeStyle = ICE_DIM; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(50, 50, W-100, H-100, 3); ctx.stroke();

    // Corner flourishes
    const drawCornerFlourish = (cx, cy, dx, dy) => {
      ctx.strokeStyle = ICE; ctx.lineWidth = 2; ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(cx + 55*dx, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + 55*dy);
      ctx.stroke();
      ctx.lineWidth = 1; ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.moveTo(cx + 40*dx, cy + 8*dy);
      ctx.quadraticCurveTo(cx + 8*dx, cy + 8*dy, cx + 8*dx, cy + 40*dy);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };
    drawCornerFlourish(52, 52, 1, 1);
    drawCornerFlourish(W-52, 52, -1, 1);
    drawCornerFlourish(52, H-52, 1, -1);
    drawCornerFlourish(W-52, H-52, -1, -1);

    // Inner content fill
    ctx.fillStyle = BG_INNER;
    ctx.beginPath(); ctx.roundRect(55, 55, W-110, H-110, 2); ctx.fill();

    // Subtle center glow
    const centerGlow = ctx.createRadialGradient(W/2, H/2-40, 0, W/2, H/2-40, 300);
    centerGlow.addColorStop(0, "rgba(0,212,255,0.02)");
    centerGlow.addColorStop(1, "transparent");
    ctx.fillStyle = centerGlow;
    ctx.fillRect(55, 55, W-110, H-110);


    // === "CERTIFICATE" (no medallion above) ===
    ctx.textAlign = "center";
    ctx.font = "800 56px 'Outfit', sans-serif";
    ctx.fillStyle = WHITE;
    ctx.fillText("CERTIFICATE", W/2, 110);

    // === "OF ACHIEVEMENT" ===
    ctx.font = "600 20px 'Outfit', sans-serif";
    ctx.fillStyle = ICE;
    ctx.fillText("O F   A C H I E V E M E N T", W/2, 144);

    // Ornamental line with diamonds
    const achLine = ctx.createLinearGradient(W/2-180, 0, W/2+180, 0);
    achLine.addColorStop(0, "transparent");
    achLine.addColorStop(0.2, PURPLE_DIM);
    achLine.addColorStop(0.5, ICE_DIM);
    achLine.addColorStop(0.8, PURPLE_DIM);
    achLine.addColorStop(1, "transparent");
    ctx.strokeStyle = achLine; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W/2-180, 160); ctx.lineTo(W/2+180, 160); ctx.stroke();
    [W/2-185, W/2, W/2+185].forEach(x => {
      ctx.fillStyle = ICE; ctx.globalAlpha = 0.5;
      ctx.save(); ctx.translate(x, 160); ctx.rotate(Math.PI/4);
      ctx.fillRect(-2.5, -2.5, 5, 5); ctx.restore();
    });
    ctx.globalAlpha = 1;

    // === "PROUDLY PRESENTED TO" ===
    ctx.font = "500 15px 'Outfit', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillText("PROUDLY PRESENTED TO", W/2, 200);

    // === USERNAME ===
    ctx.save();
    ctx.shadowColor = ICE; ctx.shadowBlur = 50;
    ctx.font = "italic 800 58px 'Georgia', 'Outfit', serif";
    ctx.fillStyle = WHITE;
    ctx.fillText(displayName, W/2, 258);
    ctx.restore();
    ctx.font = "italic 800 58px 'Georgia', 'Outfit', serif";
    ctx.fillStyle = WHITE;
    ctx.fillText(displayName, W/2, 258);

    // Name underline
    const nameW = ctx.measureText(displayName).width;
    const nlGrad = ctx.createLinearGradient(W/2 - nameW/2 - 20, 0, W/2 + nameW/2 + 20, 0);
    nlGrad.addColorStop(0, "transparent");
    nlGrad.addColorStop(0.15, ICE_DIM);
    nlGrad.addColorStop(0.5, ICE);
    nlGrad.addColorStop(0.85, ICE_DIM);
    nlGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = nlGrad; ctx.lineWidth = 1.5;
    const nlL = Math.max(W/2 - nameW/2 - 20, 100);
    const nlR = Math.min(W/2 + nameW/2 + 20, W-100);
    ctx.beginPath(); ctx.moveTo(nlL, 276); ctx.lineTo(nlR, 276); ctx.stroke();

    // === ACHIEVEMENT TEXT (tier-specific) ===
    ctx.font = "italic 400 14px 'Outfit', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    const achWords = tier.achievement.split(" "); let achLine2 = "", achY = 308;
    achWords.forEach(w => {
      const test = achLine2 + w + " ";
      if (ctx.measureText(test).width > 500) {
        ctx.fillText(achLine2.trim(), W/2, achY); achLine2 = w + " "; achY += 18;
      } else { achLine2 = test; }
    });
    ctx.fillText(achLine2.trim(), W/2, achY);

    // === TIER TITLE ===
    ctx.font = "700 32px 'Outfit', sans-serif";
    ctx.fillStyle = WHITE;
    ctx.fillText(`${tier.emoji}  ${tier.title}  ${tier.emoji}`, W/2, achY + 42);

    // === SCORE ===
    const scoreY = achY + 78;
    ctx.font = "700 18px 'JetBrains Mono', monospace";
    ctx.fillStyle = ICE;
    ctx.fillText(`${pct}%  ·  ${state.score}/${QUESTIONS.length} correct  ·  Attempt #${state.attempt}`, W/2, scoreY);

    // === DIVIDER ===
    const divY = scoreY + 28;
    const divGrad = ctx.createLinearGradient(W/2-200, 0, W/2+200, 0);
    divGrad.addColorStop(0, "transparent");
    divGrad.addColorStop(0.3, PURPLE_DIM);
    divGrad.addColorStop(0.5, ICE_DIM);
    divGrad.addColorStop(0.7, PURPLE_DIM);
    divGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = divGrad; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(W/2-200, divY); ctx.lineTo(W/2+200, divY); ctx.stroke();

    // === BOTTOM SEAL ===
    const sealX = W/2, sealY = divY + 50;
    ctx.strokeStyle = ICE; ctx.lineWidth = 2; ctx.globalAlpha = 0.35;
    ctx.beginPath(); ctx.arc(sealX, sealY, 30, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
    for (let i = 0; i < 24; i++) {
      const a = (Math.PI * 2 * i) / 24;
      ctx.fillStyle = SILVER; ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(sealX + Math.cos(a) * 28, sealY + Math.sin(a) * 28, 2, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const sBG = ctx.createRadialGradient(sealX-4, sealY-4, 1, sealX, sealY, 26);
    sBG.addColorStop(0, "rgba(0,212,255,0.1)");
    sBG.addColorStop(1, "rgba(8,9,15,0.8)");
    ctx.fillStyle = sBG;
    ctx.beginPath(); ctx.arc(sealX, sealY, 24, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = PURPLE; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(sealX, sealY, 18, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.font = "700 16px 'Outfit', sans-serif";
    ctx.fillStyle = ICE; ctx.textAlign = "center";
    ctx.fillText("π²", sealX, sealY + 5);

    // Signature lines
    const sigY = sealY + 10;
    ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, sigY); ctx.lineTo(310, sigY); ctx.stroke();
    ctx.font = "500 12px 'Outfit', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText("pi2.network", 215, sigY + 20);

    ctx.beginPath(); ctx.moveTo(W-310, sigY); ctx.lineTo(W-120, sigY); ctx.stroke();
    ctx.fillText("An Infinitely Scalable Network", W-215, sigY + 20);

    ctx.font = "400 10px 'Outfit', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillText("2026", W/2, sealY + 48);

  }, [displayName, pct, tier, state.score, state.attempt]);

  // Ensure fonts are loaded before drawing
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await document.fonts.ready;
        // Extra delay for font rendering
        await new Promise(r => setTimeout(r, 300));
      } catch(e) {}
      setReady(true);
    };
    loadFonts();
  }, []);

  useEffect(() => { if (ready) drawCert(); }, [ready, drawCert]);

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
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"20px",position:"relative",zIndex:4,animation:"pi2SlideUp 0.8s ease-out"}}>
      <div style={{maxWidth:720,width:"100%",textAlign:"center"}}>
        <h2 style={{fontFamily:"'Outfit'",fontSize:28,fontWeight:800,color:"#F1F5F9",marginBottom:20}}>Congratulations 🎉</h2>
        <div style={{borderRadius:16,overflow:"hidden",border:"1px solid rgba(120,80,220,0.2)",marginBottom:20,boxShadow:"0 8px 50px rgba(124,58,237,0.15), 0 0 100px rgba(255,45,149,0.05)"}}>
          {!ready && <div style={{padding:40,color:"#64748B",fontSize:14}}>Generating certificate...</div>}
          <canvas ref={canvasRef} style={{width:"100%",height:"auto",display:ready?"block":"none"}} />
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={downloadCert} style={{padding:"14px 28px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#7c3aed,#ff2d95)",color:"white",fontFamily:"'Outfit'",fontSize:15,fontWeight:700,cursor:"pointer",transition:"all 0.2s",boxShadow:"0 4px 20px rgba(124,58,237,0.3)"}}>↓ Download</button>
          <button onClick={shareToX} style={{padding:"14px 28px",borderRadius:14,background:"rgba(100,50,200,0.1)",border:"1px solid rgba(120,80,220,0.2)",color:"#E2E8F0",fontFamily:"'Outfit'",fontSize:15,fontWeight:600,cursor:"pointer"}}>𝕏 Share to X</button>
          <button onClick={()=>dispatch({type:"RESTART"})} style={{padding:"14px 28px",borderRadius:14,background:"rgba(100,50,200,0.1)",border:"1px solid rgba(120,80,220,0.2)",color:"#E2E8F0",fontFamily:"'Outfit'",fontSize:15,fontWeight:600,cursor:"pointer"}}>↻ Retry Quiz</button>
        </div>
        {isRaffleEligible && <div style={{marginTop:12}}>
          <button onClick={()=>window.open("https://docs.google.com/forms/d/e/1FAIpQLSdKqgvw5NZ6CGts_tOjqwaWrXaAXMU7rhu5iqEF1cID_ycubg/viewform?usp=publish-editor","_blank")} style={{width:"100%",padding:"14px 20px",borderRadius:14,border:"1px solid rgba(255,200,50,0.3)",background:"rgba(255,200,50,0.08)",color:"#fbbf24",fontFamily:"'Outfit'",fontSize:15,fontWeight:700,cursor:"pointer"}}>🎁 Enter $5 Raffle</button>
        </div>}
      </div>
    </div>
  );
};

export default function Pi2Quiz() {
  const [state,dispatch]=useReducer(reducer,initialState);
  useEffect(()=>{injectStyles()},[]);
  useEffect(()=>{if(!state.timerActive)return;const i=setInterval(()=>dispatch({type:"TICK"}),1000);return()=>clearInterval(i)},[state.timerActive]);
  useEffect(()=>{if(state.timeLeft===0&&state.timerActive)dispatch({type:"TIME_UP"})},[state.timeLeft,state.timerActive]);
  return (
    <div style={{fontFamily:"'Outfit',sans-serif",minHeight:"100vh",color:"#F1F5F9",position:"relative"}}>
      <SynthwaveBackground/>
      {state.screen==="welcome"&&<WelcomeScreen dispatch={dispatch}/>}
      {state.screen==="username"&&<UsernameScreen state={state} dispatch={dispatch}/>}
      {state.screen==="loading"&&<LoadingScreen dispatch={dispatch}/>}
      {state.screen==="quiz"&&<QuizScreen state={state} dispatch={dispatch}/>}
      {state.screen==="transition"&&<TransitionScreen state={state} dispatch={dispatch}/>}
      {state.screen==="result"&&<ResultScreen state={state} dispatch={dispatch}/>}
      {state.screen==="certificate"&&<CertificateScreen state={state} dispatch={dispatch}/>}
    </div>
  );
}
