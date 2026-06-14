import { Project, Achievement, CodingProfile, StatMetric } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "algo-flow",
    title: "AlgoFlow Routing Console",
    subtitle: "Advanced AI Algorithm Analyzer & Visualizer",
    description: "An AI-backed algorithm analysis & learning platform reducing code debug latency by 30%. Combines real-time data structure visualizers with execution insight metrics.",
    bullets: [
      "Engineered an intelligent algorithm analysis platform with custom model agents reducing developer verification loops.",
      "Integrated Monaco Editor framework to support real-time multi-language syntax graphs & asynchronous compilations.",
      "Developed rich interactive SVG layouts visualizing Arrays, Linked Lists, Stack/Queue operations, and complex Sorting trees.",
      "Embedded runtime complexity metrics dynamic charts via Recharts and automated PDF reporting pipelines."
    ],
    tags: ["React.js", "Vite", "Tailwind CSS", "Recharts", "Groq AI", "Monaco Editor"],
    highlight: "DEBUG DECREASE: -30%",
    highlightLabel: "LATENCY DECREASE",
    github: "https://github.com/Gauravchaudhary76/AlgoFlow-Visualizer",
    demo: "https://algo-flow-visualizer.vercel.app/",
    imageAlt: "AlgoFlow UI Mockup showing sorting arrays and neural graph charts",
    accent: "amber"
  },
  {
    id: "jarvis-ai",
    title: "Jarvis AI Middleware Agent",
    subtitle: "High-Speed Personal Virtual Voice Companion",
    description: "An ultra-fast Voice Assistant executing voice-to-text, cognitive retrieval, and sound synthesis routines concurrently with optimized memory overhead.",
    bullets: [
      "Implemented concurrent, non-blocking Python execution structures to route real-time queries under 200ms benchmark.",
      "Integrated highly precise Speech-to-Text pipelines and neural custom voice synthesis for vocal feedback.",
      "Engineered automated task execution schedulers and device trigger hooks for IoT and telemetry controls."
    ],
    tags: ["Python", "FastAPI", "STT/TTS API", "WebSockets", "Asynchronous IO"],
    highlight: "LATENCY: <200ms",
    highlightLabel: "OPTIMIZED ENGINE",
    github: "https://github.com/Gauravchaudhary76/jarvis",
    imageAlt: "Jarvis AI console illustrating soundwave and audio packet buffers",
    accent: "purple"
  },
  {
    id: "telecom-vsp",
    title: "VHF Base Signal Optimization",
    subtitle: "Industrial SCADA & Wireless Telecom Networks",
    description: "Conducted exhaustive path studies and division signal logic mapping at a massive 7,000-acre industrial site, resulting in robust +15% signal gain.",
    bullets: [
      "Analyzed critical communication infrastructures under high thermal/magnetic environment stresses.",
      "Calibrated VHF base configurations and optimized signal transmission layouts across massive steel refinery complexes.",
      "Mapped real-time SCADA telemetry networks, secure hotlines, and backup micro-transmission relays."
    ],
    tags: ["PLC Logic", "SCADA Systems", "VHF Radio", "Signal Calibration", "EMI Mitigation"],
    highlight: "SIGNAL GAIN: +15%",
    highlightLabel: "FIELD DEPLOYED",
    github: "https://github.com/Gauravchaudhary76",
    demo: "https://github.com/Gauravchaudhary76",
    imageAlt: "SCADA blueprint maps of Visakhapatnam steel refinery",
    accent: "green"
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "embed-c",
    title: "Embedded System Design in C Programming",
    issuer: "Maven Silicon",
    date: "Jan 2026",
    badge: "EMBEDDED C",
    category: "certification",
    details: "Acquired industry-level masteries in register-level programming, microcontrollers interrupt optimization, and real-time clock task schedulers.",
    accent: "green"
  },
  {
    id: "vlsi-meity",
    title: "Syllabus on VLSI Design & Open-Source EDA",
    issuer: "NIT Manipur, MeitY & NINE Labs, IIT Guwahati",
    date: "Feb 2026",
    badge: "VLSI / EDA",
    category: "academic",
    details: "Completed extensive practical training on electronic computer-aided design tools, gate level synthesis, standard cell routing, and ASIC verification.",
    accent: "amber"
  },
  {
    id: "drone-meity",
    title: "Obstacle Avoidance Assembly Drone Bootcamp",
    issuer: "NIELIT Imphal & Ministry of Electronics & IT (MeitY)",
    date: "Nov 2025",
    badge: "UAV ROBOTICS",
    category: "hackathon",
    details: "Engineered onboard micro-sensor arrays, assembled custom quadcopter chassis, and flashed autonomous obstacle redirection algorithms.",
    accent: "purple"
  },
  {
    id: "ic-design",
    title: "Semiconductor and Emerging Devices for Chip Design",
    issuer: "Dhanamanjuri University & IEEE",
    date: "Oct 2025",
    badge: "SEMICONDUCTOR",
    category: "certification",
    details: "Covered nanoscale transistor physical structures, quantum tunneling constraints, and innovative high-performance chip designs.",
    accent: "cyan"
  },
  {
    id: "ic-ml",
    title: "Nanoscale Devices & Machine Learning Verification",
    issuer: "NIT Silchar",
    date: "May 2025",
    badge: "ML CHAMBER",
    category: "academic",
    details: "Focused on machine learning models used to forecast heat-sinks, layout leakage, and predict gate delays in high-speed hardware layouts.",
    accent: "cyan"
  },
  {
    id: "ncc-disciplines",
    title: "NCC Certificate holding Grade 'A' status",
    issuer: "National Cadet Corps (Corps of Electronics)",
    date: "Active Registry",
    badge: "LEADERSHIP CORP",
    category: "coding",
    details: "Decorated cadet with Grade 'A' evaluations. Orchestrated rapid platoon operations, community service camps, and rigorous training schedules.",
    accent: "green"
  }
];

export const CODING_PROFILES: CodingProfile[] = [
  {
    id: "github",
    platform: "GitHub",
    username: "Gauravchaudhary76",
    stats: "150+ Contributions | 8+ Public Repositories",
    profileUrl: "https://github.com/Gauravchaudhary76",
    rank: "Computer Systems Scholar",
    color: "from-slate-800 to-slate-900 border-slate-700 hover:border-cyan-500/50"
  },
  {
    id: "leetcode",
    platform: "LeetCode",
    username: "gauravchaudhary_76",
    stats: "343+ DSA Problems Solved | Algorithmic Problem Solver",
    profileUrl: "https://leetcode.com/u/gauravchaudhary_76/",
    rank: "Algorithmic Practice Track",
    color: "from-[#2f271a] to-[#1e170c] border-[#f59e0b]/30 hover:border-amber-400/60"
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    username: "gaurav-chaudhary76",
    stats: "Connected portfolio sync with ECE peers",
    profileUrl: "https://linkedin.com/in/gaurav-chaudhary76",
    rank: "Student Liaison @ NIT Manipur",
    color: "from-[#0d1e33] to-[#05111f] border-blue-600/30 hover:border-blue-500/60"
  },
  {
    id: "instagram",
    platform: "Instagram",
    username: "gaurav_chaudhary76",
    stats: "Personal & Academic Visual Updates",
    profileUrl: "https://instagram.com/gaurav_chaudhary76",
    rank: "Student & Developer Social Grid",
    color: "from-[#200314] to-[#080105] border-pink-500/20 hover:border-pink-500/50"
  }
];

export const STAT_METRICS: StatMetric[] = [
  {
    id: "dsa",
    label: "DSA Problems Solved",
    value: 343,
    suffix: "+",
    color: "text-amber-400 border-amber-500/20 bg-amber-500/5"
  },
  {
    id: "projects",
    label: "Projects Crafted",
    value: 6,
    suffix: "+",
    color: "text-purple-400 border-purple-500/20 bg-purple-500/5"
  },
  {
    id: "techs",
    label: "Technologies Mastered",
    value: 12,
    suffix: "+",
    color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5"
  },
  {
    id: "contrib",
    label: "GitHub Contributions",
    value: 150,
    suffix: "+",
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
  },
  {
    id: "streak",
    label: "Continuous Coding Streak",
    value: 15,
    suffix: " Days",
    color: "text-rose-400 border-rose-500/20 bg-rose-500/5"
  }
];
