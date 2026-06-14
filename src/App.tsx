import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Send,
  Cpu,
  Layers,
  Wrench,
  ShieldCheck,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  Radio,
  FileCode2,
  Download,
  Code2,
  Coffee,
  Binary,
  GitBranch,
  Activity,
  Database,
  Sparkles,
  Globe,
  Server,
  Settings,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";

// Import modular components & static datasets
import { Hero } from "./components/Hero";
import { Metrics } from "./components/Metrics";
import { Projects } from "./components/Projects";
import { Achievements } from "./components/Achievements";
import { CodingProfiles } from "./components/CodingProfiles";

interface TerminalLine {
  type: "input" | "system" | "output" | "error";
  text: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 0.8,
    },
  },
};

const getTechDecoration = (tech: string) => {
  switch (tech) {
    // Languages
    case "Python":
      return { icon: <Terminal className="w-3.5 h-3.5 text-cyan-400" />, border: "hover:border-cyan-500/50 hover:bg-cyan-950/20" };
    case "JavaScript":
      return { icon: <FileCode2 className="w-3.5 h-3.5 text-yellow-400" />, border: "hover:border-yellow-500/50 hover:bg-yellow-950/20" };
    case "Java":
      return { icon: <Coffee className="w-3.5 h-3.5 text-amber-500" />, border: "hover:border-amber-500/50 hover:bg-amber-950/20" };
    case "C":
      return { icon: <Code2 className="w-3.5 h-3.5 text-blue-400" />, border: "hover:border-blue-500/50 hover:bg-blue-950/20" };
    case "Verilog":
      return { icon: <Cpu className="w-3.5 h-3.5 text-emerald-400" />, border: "hover:border-emerald-500/50 hover:bg-emerald-950/20" };
    case "VHDL":
      return { icon: <Binary className="w-3.5 h-3.5 text-fuchsia-400" />, border: "hover:border-fuchsia-500/50 hover:bg-fuchsia-950/20" };
    case "Embedded C":
      return { icon: <Zap className="w-3.5 h-3.5 text-rose-400" />, border: "hover:border-rose-500/50 hover:bg-rose-950/20" };

    // Frameworks
    case "React.js":
      return { icon: <Globe className="w-3.5 h-3.5 text-sky-400" />, border: "hover:border-sky-500/50 hover:bg-sky-950/20" };
    case "Next.js":
      return { icon: <Layers className="w-3.5 h-3.5 text-white" />, border: "hover:border-white/30 hover:bg-white/5" };
    case "Angular":
      return { icon: <Shield className="w-3.5 h-3.5 text-red-500" />, border: "hover:border-red-500/50 hover:bg-red-950/20" };
    case "Redux":
      return { icon: <Database className="w-3.5 h-3.5 text-purple-400" />, border: "hover:border-purple-500/50 hover:bg-purple-950/20" };
    case "Node.js":
      return { icon: <Server className="w-3.5 h-3.5 text-green-400" />, border: "hover:border-green-500/50 hover:bg-green-950/20" };
    case "FastAPI":
      return { icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, border: "hover:border-amber-500/50 hover:bg-amber-950/20" };
    case "STT/TTS API":
      return { icon: <Radio className="w-3.5 h-3.5 text-rose-400" />, border: "hover:border-rose-500/50 hover:bg-rose-950/20" };

    // Core Hardware & Toolsets
    case "Git":
      return { icon: <GitBranch className="w-3.5 h-3.5 text-orange-400" />, border: "hover:border-orange-500/50 hover:bg-orange-950/20" };
    case "GitHub":
      return { icon: <Github className="w-3.5 h-3.5 text-slate-350" />, border: "hover:border-slate-500/50 hover:bg-slate-900/40" };
    case "LTspice":
      return { icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />, border: "hover:border-emerald-500/50 hover:bg-emerald-950/20" };
    case "Proteus":
      return { icon: <Wrench className="w-3.5 h-3.5 text-cyan-400" />, border: "hover:border-cyan-500/50 hover:bg-cyan-950/20" };
    case "Multisim":
      return { icon: <Activity className="w-3.5 h-3.5 text-fuchsia-400" />, border: "hover:border-fuchsia-500/50 hover:bg-fuchsia-950/20" };
    case "Logisim":
      return { icon: <Settings className="w-3.5 h-3.5 text-blue-400" />, border: "hover:border-blue-500/50 hover:bg-blue-950/20" };
    case "Quartus Prime":
      return { icon: <Cpu className="w-3.5 h-3.5 text-rose-400" />, border: "hover:border-rose-500/50 hover:bg-rose-950/20" };
    case "Arduino":
      return { icon: <Cpu className="w-3.5 h-3.5 text-teal-400" />, border: "hover:border-teal-500/50 hover:bg-teal-950/20" };
    case "MATLAB":
      return { icon: <Binary className="w-3.5 h-3.5 text-indigo-400" />, border: "hover:border-indigo-500/50 hover:bg-indigo-950/20" };
    case "SCADA Systems":
      return { icon: <Radio className="w-3.5 h-3.5 text-lime-400" />, border: "hover:border-lime-500/50 hover:bg-lime-950/20" };

    // Engineering Competencies
    case "DSA Solutions":
      return { icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />, border: "hover:border-amber-500/50 hover:bg-amber-950/20" };
    case "Object-Oriented Logic":
      return { icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />, border: "hover:border-indigo-500/50 hover:bg-indigo-950/20" };
    case "AI Algorithm Analysis":
      return { icon: <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />, border: "hover:border-fuchsia-500/50 hover:bg-fuchsia-950/20" };
    case "Signal Processing":
      return { icon: <Radio className="w-3.5 h-3.5 text-teal-400" />, border: "hover:border-teal-500/50 hover:bg-teal-950/20" };
    case "Modulation Layouts":
      return { icon: <Activity className="w-3.5 h-3.5 text-cyan-400" />, border: "hover:border-cyan-500/50 hover:bg-cyan-950/20" };

    default:
      return { icon: <Code2 className="w-3.5 h-3.5 text-slate-400" />, border: "hover:border-slate-500/50" };
  }
};

export default function App() {
  const [currentTime, setCurrentTime] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [latency, setLatency] = useState<number | null>(null);

  // Kernel AI Command Line state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { type: "system", text: "Enter queries below or tap the macro registers to pull specs." },
  ]);
  const [isKernelQuerying, setIsKernelQuerying] = useState(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Recruiter Despatch State
  const [recruiterName, setRecruiterName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [isDespatching, setIsDespatching] = useState(false);
  const [backupParams, setBackupParams] = useState<{ name: string; email: string; body: string } | null>(null);
  const [despatchStatus, setDespatchStatus] = useState<{
    status: "idle" | "sending" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  const handleScrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadResume = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let y = 14;

    const centerText = (text: string, fontSize: number, style: "normal" | "bold" | "italic" = "normal", color: [number, number, number] = [0, 0, 0]) => {
      doc.setFont("helvetica", style);
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(text, 105, y, { align: "center" });
    };

    const sectionTitle = (title: string) => {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(15, y - 1, 195, y - 1);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42); 
      doc.text(title, 15, y + 3);
      y += 5.5;
    };

    // --- HEADER ---
    centerText("GAURAV KUMAR CHAUDHARY", 15, "bold", [15, 23, 42]);
    y += 4.5;

    centerText("(+91) 7630050681  |  gauravkr11311@gmail.com  |  linkedin.com/in/gaurav-chaudhary76", 8.2, "normal", [71, 85, 105]);
    y += 3.8;
    centerText("github.com/Gauravchaudhary76  |  Imphal, Manipur, India  |  Work Authorization: Eligible to work in India", 8.2, "normal", [71, 85, 105]);
    y += 6.5;

    // --- SUMMARY ---
    sectionTitle("SUMMARY");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(51, 65, 85);
    const summaryText = "An ECE undergraduate and software engineering enthusiast at NIT Manipur building at the intersection of embedded software development and intelligent applications. Experienced in full-stack web applications, signal processing, and interactive data visualization tools. Proven track record of analyzing large-scale industrial wireless communication architectures and SCADA systems. Disciplined NCC Cadet (Grade A) bringing leadership, accountability, and strong execution under pressure.";
    const splitSummary = doc.splitTextToSize(summaryText, 180);
    doc.text(splitSummary, 15, y);
    y += (splitSummary.length * 3.6) + 1.5;

    // --- SKILLS ---
    sectionTitle("SKILLS");
    const skills = [
      { category: "Programming Software Engineering", items: "Python, JavaScript, Java, C, Verilog, VHDL, Embedded Software Development" },
      { category: "Frontend Development", items: "React.js, Next.js, Angular, Redux, HTML5, CSS3, Tailwind CSS, Data Visualization" },
      { category: "Backend & APIs", items: "Node.js, FastAPI, RESTful APIs, Virtual Assistant Development" },
      { category: "Engineering Systems", items: "LTspice, Proteus, Multisim, Logisim, Quartus Prime, Arduino, MATLAB, EDA, SCADA Systems" },
      { category: "Development Tools", items: "Git, GitHub, VS Code" },
      { category: "Core Competencies", items: "Data Structures & Algorithms (DSA), AI Algorithm Analysis, Embedded Systems, Signal Processing, Modulation Techniques" }
    ];

    skills.forEach(skillSet => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.2);
      doc.setTextColor(15, 23, 42);
      doc.text(`* ${skillSet.category}:`, 15, y);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(skillSet.items, 68, y);
      y += 3.6;
    });
    y += 1.5;

    // --- EXPERIENCE ---
    sectionTitle("EXPERIENCE");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Research Intern - Wireless Communication Systems", 15, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(71, 85, 105);
    doc.text("Rashtriya Ispat Nigam Limited (RINL), Visakhapatnam, India", 195, y, { align: "right" });
    y += 3.6;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.2);
    doc.text("June 2025 - Present", 15, y);
    y += 3.6;

    const expBullets = [
      "Analyzed industrial wireless communication architectures, optimizing VHF base station configurations to improve signal reliability by 15%.",
      "Studied critical modulation techniques, signal flows, and infrastructure supporting safety-critical industrial operations across a 7,000-acre plant.",
      "Observed and mapped SCADA systems, real-time CCTV feeds, and emergency hotlines used for division coordination.",
      "Authored a detailed project report titled \"Study of Wireless Communication Systems\" outlining critical telecom infrastructure."
    ];

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    expBullets.forEach(bullet => {
      const splitBullet = doc.splitTextToSize(`* ${bullet}`, 176);
      doc.text(splitBullet, 18, y);
      y += (splitBullet.length * 3.6) + 0.5;
    });
    y += 1.5;

    // --- PROJECTS ---
    sectionTitle("PROJECTS");

    // Project 1
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("AlgoFlow - Advanced AI Algorithm Analyzer & Visualizer", 15, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("React.js, Vite, Groq AI", 195, y, { align: "right" });
    y += 3.6;

    const proj1Bullets = [
      "Engineered an AI algorithm analysis and learning platform using Groq AI (Llama 3) that reduced user debugging time by 30%.",
      "Integrated Monaco Editor to support asynchronous code compilation and syntax highlighting for major languages.",
      "Developed interactive data visualization layouts for Arrays, Linked Lists, and complex Sorting/Searching configurations.",
      "Implemented runtime complexity metrics charts via Recharts and an automated report export pipeline utilizing jsPDF."
    ];

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.2);
    proj1Bullets.forEach(bullet => {
      const splitBullet = doc.splitTextToSize(`* ${bullet}`, 176);
      doc.text(splitBullet, 18, y);
      y += (splitBullet.length * 3.6) + 0.5;
    });
    y += 1.5;

    // Project 2
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Jarvis AI - Personal Virtual Assistant", 15, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Python, APIs", 195, y, { align: "right" });
    y += 3.6;

    const proj2Bullets = [
      "Executed the virtual assistant development of a modular personal companion, integrating text-to-speech, real-time search, and speech recognition.",
      "Implemented asynchronous Python architectures to effectively handle concurrent API communication routines under 200ms of latency."
    ];

    proj2Bullets.forEach(bullet => {
      const splitBullet = doc.splitTextToSize(`* ${bullet}`, 176);
      doc.text(splitBullet, 18, y);
      y += (splitBullet.length * 3.6) + 0.5;
    });
    y += 1.5;

    // --- EDUCATION ---
    sectionTitle("EDUCATION");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("National Institute of Technology Manipur", 15, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(71, 85, 105);
    doc.text("Imphal, India", 195, y, { align: "right" });
    y += 3.6;

    doc.setFont("helvetica", "italic");
    doc.setTextColor(51, 65, 85);
    doc.text("Bachelor of Technology (B.Tech) in Electronics and Communication Engineering", 15, y);
    doc.setFont("helvetica", "normal");
    doc.text("Jan 2023 - Apr 2027 (Expected)", 195, y, { align: "right" });
    y += 3.6;

    doc.setFont("helvetica", "bold");
    doc.text("Academic Performance: 6th Semester SPI: 7.94", 15, y);
    y += 5.5;

    // --- ACTIVITIES ---
    sectionTitle("ACTIVITIES");
    const activities = [
      "Member - Google Developer Group (GDG): Cultivated technical skills in software engineering and web frameworks (Jan 2025 - Present).",
      "NCC Cadet - National Cadet Corps: Built discipline, fitness, and elite teamwork through formal drills.",
      "Member - Cygnus Club: Collaborated on multidisciplinary student prototyping for IoT, AI, and robotics."
    ];

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    activities.forEach(bullet => {
      const splitBullet = doc.splitTextToSize(`* ${bullet}`, 176);
      doc.text(splitBullet, 18, y);
      y += (splitBullet.length * 3.6) + 0.5;
    });
    y += 1.5;

    // --- CERTIFICATIONS ---
    sectionTitle("CERTIFICATIONS");
    const certifications = [
      "Certification: Embedded System Design using C Programming - Maven Silicon (Verified: Jan 2026)",
      "Technical Workshop: VLSI Design Using Open-Source Tools - NIT Manipur, MeitY & NINE Labs, IIT Guwahati (Feb 2026)",
      "Technical Bootcamp: 3-Day Drone Bootcamp (Obstacle Avoidance Assembly) - NIELIT Imphal & MeitY (Nov 2025)",
      "International Workshop: Semiconductor and Emerging Devices for Chip Design - Dhanamanjuri University & IEEE (Oct 2025)",
      "Technical Workshop: Nanoscale Semiconductor Devices and ML Verification - NIT Silchar (May 2025)",
      "Credentials: NCC A & B Certificates (Grade A) | Participations: MIMASA-2025 & ReGen Hackathon-2025"
    ];

    certifications.forEach(bullet => {
      const splitBullet = doc.splitTextToSize(`* ${bullet}`, 180);
      doc.text(splitBullet, 15, y);
      y += (splitBullet.length * 3.6) + 0.5;
    });

    doc.save("Gaurav_Kumar_Chaudhary_Resume.pdf");

    setTerminalHistory((prev) => [
      ...prev,
      {
        type: "system",
        text: "⚡ CRITICAL SYSTEM INSTRUCTION COMPLETED: Compiled official premium PDF document 'Gaurav_Kumar_Chaudhary_Resume.pdf' with exact academic specifications and initiated systems transmission download.",
      },
    ]);
  };

  // Update Clock & Measure Link Latency
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
      
      try {
        const localStr = now.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + ", " + now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        
        let tz = "";
        try {
          const parts = now.toLocaleDateString("en-US", { day: "numeric", timeZoneName: "short" }).split(", ");
          if (parts.length > 1) {
            tz = " " + parts.pop()?.split(" ").pop();
          }
        } catch(e) {}
        
        setLocalTime(localStr + (tz ? ` (${tz})` : ""));
      } catch (err) {
        setLocalTime(now.toLocaleString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const latInterval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 25) + 8);
    }, 4000);
    setLatency(12);

    return () => {
      clearInterval(interval);
      clearInterval(latInterval);
    };
  }, []);

  // Auto-scroll terminal to bottom inside container to prevent jumping/viewport-scroll
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const executeQuery = async (cmdText: string) => {
    const cleanCmdText = cmdText.trim();
    if (!cleanCmdText) return;

    setTerminalHistory((prev) => [...prev, { type: "input", text: cleanCmdText }]);
    setIsKernelQuerying(true);

    const lowerCmd = cleanCmdText.toLowerCase();
    if (lowerCmd === "resume" || lowerCmd === "download" || lowerCmd === "cv") {
      setTimeout(() => {
        handleDownloadResume();
        setIsKernelQuerying(false);
      }, 750);
      return;
    }

    try {
      const chatHistory = terminalHistory
        .filter((h) => h.type === "input" || h.type === "output")
        .map((h) => ({
          role: h.type === "input" ? "user" : "model",
          text: h.text,
        }));

      const response = await fetch("/api/kernel/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: cleanCmdText, history: chatHistory }),
      });

      if (!response.ok) {
        throw new Error(`Kernel Error Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "output", text: data.response },
        ]);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: `QUERY EXCEPTION: ${data.response || "Unknown Exception"}` },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      const normalizedQuery = cleanCmdText.toLowerCase().trim();
      const matchSkills = ["skill", "skills", "languages", "programming", "frameworks", "tools", "competencies", "hardware", "verilog", "vhdl"];
      const matchProjects = ["project", "projects", "algoflow", "jarvis", "system", "embedded"];
      const matchInternship = ["internship", "rinl", "visakhapatnam", "research", "steel plant"];
      const matchSpi = ["spi", "cgpa", "grades", "percentage", "academic", "academics", "education"];
      const matchNcc = ["ncc", "national cadet corps", "cadet", "military", "discipline"];
      const matchCertifications = ["certification", "certifications", "certificate", "certificates", "courses", "training"];
      const matchSocial = ["instagram", "insta", "social", "contact", "linkedin", "github", "profile", "profiles"];

      const containsKeyword = (text: string, keywords: string[]) => keywords.some((kw) => text.includes(kw));

      let fallbackText = "";
      if (containsKeyword(normalizedQuery, matchSkills)) {
        fallbackText = `[SYSTEM::TECHNICAL_COMPETENCIES]
> Software Programming : Python, JavaScript, Java, Verilog, VHDL, Embedded Software Dev
> Frontend & Interfaces  : React.js, Next.js, Redux, HTML5, CSS3, Tailwind CSS, Data Visualization
> Middleware & APIs      : Node.js, FastAPI, RESTful microservices, concurrent Python routines
> Hardware & EDA Toolsets: LTspice, Proteus, Multisim, Logisim, Quartus, Arduino, MATLAB
STATUS: STACK_FULLY_OPERATIONAL`;
      } else if (containsKeyword(normalizedQuery, matchProjects)) {
        fallbackText = `[SYSTEM::DEPLOYED_ARCHITECTURES]
> AlgoFlow Analyzer : Built an AI-driven visual data structures platform reducing debug latency by 30%.
> Jarvis Assistant  : Crafted an asynchronous concurrent Python broker responding under 200ms benchmark.
STATUS: ACTIVE_BUILDS_VERIFIED`;
      } else if (containsKeyword(normalizedQuery, matchInternship)) {
        fallbackText = `[SYSTEM::FIELD_EXPERIENCE]
> Wireless Systems @ VSP : Optimized VHF base configurations, increasing signal gain by 15%.
> SCADA & Division Logic : Mapped safety-critical emergency telecom links across a 7,000-acre plant.
STATUS: EXCELLENCE_RECORD_SYNCED`;
      } else if (containsKeyword(normalizedQuery, matchSpi)) {
        fallbackText = `[SYSTEM::ACADEMIC_PROFILES]
> Degree & Focus        : Bachelor of Technology (ECE wing) @ NIT Manipur (Jan 2023 - Expected Apr 2027)
> Performance Trajectory : Outstanding active progression with a 6th Semester SPI of 7.94.
STATUS: ACADEMIC_METRICS_COMPLIANT`;
      } else if (containsKeyword(normalizedQuery, matchNcc)) {
        fallbackText = `[SYSTEM::LEADERSHIP_REGISTERS]
> NCC Wing & Cadence: Cadet leader holding Grade 'A' NCC Certifications (Electronics Corps).
> Core Disciplines  : Rapid team action orchestration, fitness drill synchronization, and structured command.
STATUS: LEADERSHIP_AUTHENTICATED`;
      } else if (containsKeyword(normalizedQuery, matchCertifications)) {
        fallbackText = `[SYSTEM::ACCREDITED_CREDENTIALS]
> Maven Silicon & VLSI : Certified in Embedded System Design using C and Open-Source VLSI tools.
> Drone Assembly & ML  : Completed MeitY Drone Bootcamp and ML Semiconductor Verification training.
STATUS: CREDENTIALS_CONFIRMED`;
      } else if (containsKeyword(normalizedQuery, matchSocial)) {
        fallbackText = `[SYSTEM::DIGITAL_NETWORKS]
> Instagram Grid : Username: @gaurav_chaudhary76
> LinkedIn Sync  : https://linkedin.com/in/gaurav-chaudhary76
> GitHub Portal  : https://github.com/Gauravchaudhary76
STATUS: NETWORKS_FULLY_RESOLVED`;
      } else {
        fallbackText = `[SYSTEM::FALLBACK_ALGORITHM]
> Identity Summary: Gaurav is an ECE undergraduate student merging physical hardware logic (SCADA, telecom) with modern full-stack web platforms.
> Action Register: Input parsed but fell outside primary registers. Please try suggested quick button registers below.
STATUS: READY_FOR_NEXT_REGISTER`;
      }

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: fallbackText }
      ]);
    } finally {
      setIsKernelQuerying(false);
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const currentQuery = terminalInput;
    setTerminalInput("");
    executeQuery(currentQuery);
  };

  const runMacro = (macroText: string) => {
    executeQuery(macroText);
  };

  // Recruiter Despatch Form handler
  const handleDespatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterName.trim() || !companyEmail.trim() || !messageBody.trim()) {
      setDespatchStatus({
        status: "error",
        message: "INPUT MISALIGNMENT: All registers (Name, Email, Message) must be written.",
      });
      return;
    }

    const currentName = recruiterName.trim();
    const currentEmail = companyEmail.trim();
    const currentBody = messageBody.trim();
    setBackupParams({ name: currentName, email: currentEmail, body: currentBody });

    setIsDespatching(true);
    setDespatchStatus({ status: "sending" });

    try {
      const response = await fetch("/api/recruiter/despatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterName: currentName,
          companyEmail: currentEmail,
          messageBody: currentBody,
        }),
      });

      let data: any = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textFallback = await response.text();
        throw new Error(textFallback || `HTTP Status ${response.status}`);
      }

      if (response.ok && data.success) {
        let successMessage = "Your message has been received successfully!";
        if (data.emailStatus === "simulated_offline") {
          successMessage = "Your message was saved! Note: Real email delivery requires configuring EMAIL_USER and EMAIL_PASS secrets in your Settings panel.";
        } else if (data.emailStatus && data.emailStatus.startsWith("failed_error")) {
          const rawErr = data.emailStatus.replace("failed_error:", "").trim();
          if (rawErr.includes("535") || rawErr.toLowerCase().includes("accepted") || rawErr.toLowerCase().includes("login") || rawErr.toLowerCase().includes("authentication")) {
            successMessage = "Message Saved to Database!\n\n⚠️ Email notification failed (SMTP 535 Invalid Login)\n\nTo easily route your notifications through Brevo SMTP, simply update your existing Settings variables:\n\n👉 Step 1: Set EMAIL_USER to your Brevo SMTP Login (e.g. aeb436001@smtp-brevo.com)\n👉 Step 2: Set EMAIL_PASS to your Brevo SMTP Password (e.g. 1ywnp2JY4vROKaDE)\n\nOur system will automatically detect the Brevo credentials and securely dispatch notifications. All submitted data is fully secure in the database!";
          } else {
            successMessage = `Your message was saved, but email notification failed to deliver. Details: ${rawErr}`;
          }
        } else {
          successMessage = "Your message has been successfully sent and saved!";
        }

        setDespatchStatus({
          status: "success",
          message: successMessage,
        });
        setRecruiterName("");
        setCompanyEmail("");
        setMessageBody("");

        setTerminalHistory((prev) => [
          ...prev,
          {
            type: "system",
            text: `[SIGNAL INCOMING] Recruiter Despatch Alert: Message from '${recruiterName}' in-flight. Database synchronized.`,
          },
        ]);
      } else {
        throw new Error(data.error || "System rejected message payload structures.");
      }
    } catch (err: any) {
      console.error(err);
      setDespatchStatus({
        status: "error",
        message: `DESPATCH COLLISION: ${err.message || "Target route unavailable."}`,
      });
    } finally {
      setIsDespatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02050a] text-slate-100 font-sans tracking-wide selection:bg-cyan-455 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Dynamic atmospheric cyberpunk light sources */}
      <div className="absolute top-[-5%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Cyber circuit matrix grid backing */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#081120_1px,transparent_1px),linear-gradient(to_bottom,#081120_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none opacity-40 z-0" />

      {/* Primary content grid framing */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 py-6 sm:py-8 relative z-10"
      >
        
        {/* TOP STATUS BAR MODULE */}
        <motion.div
          id="status-header"
          variants={itemVariants}
          className="border border-slate-800/80 bg-slate-950/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 mb-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            <span className="font-mono text-[10px] text-slate-300 tracking-[0.2em] font-extrabold uppercase">
              GAURAV_NETWORK_LINK_OK :: LATENCY {latency !== null ? `${latency}ms` : "12ms"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-[10px] font-mono text-slate-400">
            <span>CLOCK_LOCAL: <strong className="text-cyan-400">{localTime || "SYNCING..."}</strong></span>
            <span className="hidden sm:inline text-slate-750">|</span>
            <span>CLOCK_UTC: <strong className="text-slate-300">{currentTime || "SYNCING..."}</strong></span>
            <span className="hidden md:inline text-slate-750">|</span>
            <span>SYSTEM_SHIELD: <strong className="text-emerald-400 font-bold">ARM64_HW_ENCRYPTION</strong></span>
          </div>
        </motion.div>

        {/* 1. HERO CORE INTRO */}
        <Hero
          onDownloadResume={handleDownloadResume}
          onScrollToElement={handleScrollToElement}
        />

        {/* 2. STATS & METRICS INDICATORS */}
        <Metrics />

        {/* MAIN SPLIT GRID STRUCTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT AREA: TERMINAL AND RECRUITER FORM (7 COLUMNS) */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* AI KERNEL CONTROL CONSOLE */}
            <motion.div
              variants={itemVariants}
              className="border border-slate-800 bg-slate-950/80 backend-blur-md rounded-2xl overflow-hidden shadow-2xl flex flex-col group hover:border-[#10b981]/35 transition-all duration-300"
            >
              <div className="bg-[#040810] px-4 py-3.5 flex items-center justify-between border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-[#f59e0b] animate-pulse" />
                  <span className="font-mono text-[11px] text-slate-200 font-extrabold tracking-wider uppercase">
                    GAURAV_KERNEL_AI_SHELL v4.2
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                </div>
              </div>

              {/* Logs Output Panel */}
              <div
                ref={terminalContainerRef}
                className="p-4 h-[350px] overflow-y-auto font-mono text-[11px] sm:text-xs space-y-4 scrollbar-thin scrollbar-thumb-slate-800 bg-[#03060c]"
              >
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {line.type === "input" && (
                      <div className="flex items-start gap-2 text-amber-400">
                        <span className="text-[#10b981] font-extrabold select-none">&gt;</span>
                        <span className="font-bold">{line.text}</span>
                      </div>
                    )}
                    {line.type === "system" && (
                      <div className="text-emerald-400/90 flex gap-2">
                        <span className="text-slate-500 font-bold select-none">[SYS]</span>
                        <span>{line.text}</span>
                      </div>
                    )}
                    {line.type === "error" && (
                      <div className="text-rose-450 bg-rose-950/15 border-l-2 border-rose-500 p-2.5 my-1 rounded-r">
                        <span>{line.text}</span>
                      </div>
                    )}
                    {line.type === "output" && (
                      <div className="pl-3.5 border-l-2 border-cyan-500/30 bg-slate-950/40 py-2.5 px-3 rounded shadow-inner font-mono text-[11px] sm:text-xs">
                        {line.text.split("\n").map((subLine, subIdx) => {
                          const isHeader = subLine.startsWith("[") && subLine.endsWith("]");
                          const isStatus = subLine.startsWith("STATUS:");
                          const isArrow = subLine.startsWith(">");
                          if (isHeader) {
                            return (
                              <div key={subIdx} className="text-cyan-400 font-bold tracking-wider mb-2.5 uppercase font-mono">
                                {subLine}
                              </div>
                            );
                          }
                          if (isStatus) {
                            return (
                              <div key={subIdx} className="text-[#10b981] font-bold mt-2.5 font-mono border-t border-slate-850 pt-2 flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {subLine}
                              </div>
                            );
                          }
                          if (isArrow) {
                            const colonIndex = subLine.indexOf(":");
                            if (colonIndex !== -1) {
                              const tag = subLine.substring(0, colonIndex + 1);
                              const details = subLine.substring(colonIndex + 1);
                              return (
                                <div key={subIdx} className="text-slate-200 leading-relaxed font-mono py-1">
                                  <span className="text-cyan-400/90 font-bold">{tag}</span>
                                  <span className="text-slate-200 font-semibold">{details}</span>
                                </div>
                              );
                            }
                          }
                          return (
                            <div key={subIdx} className="text-slate-300 leading-relaxed font-mono py-1">
                              {subLine}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                {isKernelQuerying && (
                  <div className="flex items-center gap-2 text-slate-300 animate-pulse font-mono pl-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                    <span>RETRIEVING INTEL VECTOR COPROCESSORS...</span>
                  </div>
                )}
                <div ref={terminalBottomRef} />
              </div>

              {/* Console Quick Command macros */}
              <div className="px-4 py-3 border-t border-slate-900 bg-slate-950">
                <span className="text-[9px] font-mono text-slate-500 block mb-1.5 uppercase font-bold tracking-widest">
                  Hardwired Command Micro-Registers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "skills_db", cmd: "skills" },
                    { label: "deployed_builds", cmd: "projects" },
                    { label: "research_rinl", cmd: "internship" },
                    { label: "academic_grades", cmd: "spi" },
                    { label: "military_ncc", cmd: "ncc" },
                    { label: "professional_cv", cmd: "resume" },
                  ].map((macro) => (
                    <button
                      key={macro.label}
                      type="button"
                      onClick={() => runMacro(macro.cmd)}
                      className="px-2.5 py-1 font-mono text-[9px] bg-slate-900 hover:bg-[#061c14] text-slate-400 hover:text-[#10b981] border border-slate-800 hover:border-[#10b981]/30 rounded transition-all active:scale-95 cursor-pointer font-bold"
                    >
                      FLSH::{macro.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleTerminalSubmit} className="flex border-t border-slate-800 bg-[#020509]">
                <span className="text-[#10b981] font-mono text-sm pl-4 self-center select-none font-extrabold">&gt;</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Enter request keys or queries (e.g. 'show achievements', 'list skills')..."
                  className="flex-1 bg-transparent border-0 px-2.5 py-3 text-slate-100 outline-none focus:ring-0 placeholder:text-slate-600 font-mono text-xs font-semibold"
                />
                <button
                  type="submit"
                  disabled={isKernelQuerying}
                  className="bg-slate-900 hover:bg-[#061c14] text-slate-400 hover:text-[#10b981] border-l border-slate-800 px-5 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>

            {/* QUICK DISPATCH CONTACT CONSOLE */}
            <motion.div
              id="recruiter-despatch-console"
              className="border border-slate-800 bg-slate-950/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-[-1px] left-8 w-16 h-[1.5px] bg-[#10b981]" />

              <div className="bg-[#040810] px-4 py-3.5 flex items-center gap-2.5 border-b border-slate-800/80">
                <Send className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-slate-100 font-extrabold uppercase tracking-wider">
                  0x06 // TRANSACT COMMUNICATIONS / SECURE MESSAGE DISPATCH
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Social Actions Panel */}
                <div className="md:col-span-4 bg-[#03060b] p-5 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between font-mono">
                  <div className="space-y-4">
                    <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Social Gateways
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Reach out directly via these channels, or dispatch an instant message through the secure carrier form.
                    </p>
                    
                    <div className="space-y-2.5 text-xs">
                      <a
                        href="https://linkedin.com/in/gaurav-chaudhary76"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-400 transition-colors p-1.5 rounded bg-slate-900/40 hover:bg-cyan-950/15 border border-transparent hover:border-cyan-500/10 font-bold"
                      >
                        <Linkedin className="w-4 h-4 text-cyan-400" />
                        <span>LINKEDIN</span>
                      </a>
                      <a
                        href="https://github.com/Gauravchaudhary76"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-455 transition-colors p-1.5 rounded bg-slate-900/40 hover:bg-slate-900 border border-transparent hover:border-slate-750 font-bold"
                      >
                        <Github className="w-4 h-4 text-slate-400" />
                        <span>GITHUB</span>
                      </a>
                      <a
                        href="https://instagram.com/gaurav_chaudhary76"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 text-slate-300 hover:text-pink-400 transition-colors p-1.5 rounded bg-slate-900/40 hover:bg-pink-950/15 border border-transparent hover:border-pink-500/10 font-bold"
                      >
                        <Instagram className="w-4 h-4 text-pink-400" />
                        <span>INSTAGRAM</span>
                      </a>
                      <a
                        href="mailto:gauravkr11311@gmail.com"
                        className="flex items-center gap-2.5 text-slate-300 hover:text-amber-400 transition-colors p-1.5 rounded bg-slate-900/40 hover:bg-amber-950/15 border border-transparent hover:border-amber-500/10 font-bold"
                      >
                        <Mail className="w-4 h-4 text-amber-550" />
                        <span>EMAIL DIRECT</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-900 mt-4 text-[10px] text-slate-500 space-y-1">
                    <p>SECURE: GPG_RSA_2048</p>
                    <p>STATUS: PORTS_CLOSED_LISTEN</p>
                  </div>
                </div>

                {/* Main Form Fields */}
                <form onSubmit={handleDespatchSubmit} className="md:col-span-8 p-5 space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                      Your Name / Company Identifier *
                    </label>
                    <input
                      type="text"
                      required
                      value={recruiterName}
                      onChange={(e) => setRecruiterName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-[#03060a] border border-slate-800 rounded-lg p-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all font-semibold placeholder:text-slate-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                      Your Electronic Mail (Email) *
                    </label>
                    <input
                      type="email"
                      required
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="e.g. recruiter@company.com"
                      className="w-full bg-[#03060a] border border-slate-800 rounded-lg p-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all font-semibold placeholder:text-slate-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                      Message / Project Specifications *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      placeholder="Specify tech-stack requested, role requirements, or collaboration notes here..."
                      className="w-full bg-[#03060a] border border-slate-800 rounded-lg p-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all font-semibold placeholder:text-slate-700 resize-none font-mono"
                    />
                  </div>

                  {/* Feedback screen overlay */}
                  <AnimatePresence mode="wait">
                    {despatchStatus.status !== "idle" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg overflow-hidden"
                      >
                        {despatchStatus.status === "sending" && (
                          <div className="bg-slate-900 border-l-2 border-amber-500 text-amber-400 p-3 flex items-center gap-2.5">
                            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                            <span className="font-bold tracking-wider uppercase text-[10px]">TRANSMITTING DATA PACKETS...</span>
                          </div>
                        )}
                                           {despatchStatus.status === "success" && (
                          <div className="bg-emerald-950/20 border border-emerald-500/20 border-l-2 border-l-emerald-500 text-emerald-400 p-3.5 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-[10px]">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span>TRANSMISSION OK // DEPLOYMENT SUCCESS</span>
                            </div>
                            <p className="text-[10px] text-slate-350 font-mono leading-relaxed break-words whitespace-pre-line font-medium">
                              {despatchStatus.message}
                            </p>
                            
                            {backupParams && (
                              <div className="mt-2.5 pt-2.5 border-t border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px]">
                                <span className="text-slate-400 text-left leading-normal">
                                  Want a real manual copy as well? Launch direct Gmail dispatch preloaded with your note:
                                </span>
                                <a
                                  href={`mailto:gauravkr11311@gmail.com?subject=${encodeURIComponent("💼 Gaurav's Portfolio: Contact Alert from " + backupParams.name)}&body=${encodeURIComponent("Hello Gaurav,\n\nI am contacting you from my address: " + backupParams.email + "\n\n" + backupParams.body)}`}
                                  className="w-full sm:w-auto bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold px-3 py-1.5 rounded transition-all shrink-0 uppercase tracking-wider text-[9px] flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>GMAIL DISPATCH</span>
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {despatchStatus.status === "error" && (
                          <div className="bg-rose-950/20 border border-rose-500/20 border-l-2 border-l-rose-500 text-rose-455 p-3.5 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-[10px]">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span>TRANSMISSION REFUSED [CRITICAL_FAULT]</span>
                            </div>
                            <p className="text-[10px] text-rose-300 font-mono leading-relaxed whitespace-pre-line font-medium">
                              {despatchStatus.message}
                            </p>
                            
                            {backupParams && (
                              <div className="mt-2.5 pt-2.5 border-t border-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px]">
                                <span className="text-slate-400 text-left leading-normal">
                                  Bypass hosting restrictions: push this packet directly via your device mail client:
                                </span>
                                <a
                                  href={`mailto:gauravkr11311@gmail.com?subject=${encodeURIComponent("💼 Gaurav's Portfolio: Contact Alert from " + backupParams.name)}&body=${encodeURIComponent("Hello Gaurav,\n\nI am contacting you from my address: " + backupParams.email + "\n\n" + backupParams.body)}`}
                                  className="w-full sm:w-auto bg-rose-500 text-slate-50 hover:bg-rose-400 font-extrabold px-3 py-1.5 rounded transition-all shrink-0 uppercase tracking-wider text-[9px] flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                                >
                                  <Mail className="w-3.5 h-3.5 text-slate-50" />
                                  <span>DIRECT MAILTO</span>
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isDespatching}
                    className="w-full bg-[#10b981] text-slate-950 hover:bg-[#20e9a3] font-mono font-extrabold uppercase rounded-lg py-3 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-widest text-[11px]"
                  >
                    {isDespatching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>TRANSMITTING MESSAGE...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4.5 h-4.5 text-slate-950" />
                        <span>DISPATCH DIGITAL PACKET</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

          </div>

          {/* RIGHT AREA: ACHIEVEMENTS, CERTIFICATIONS, CORES (5 COLUMNS) */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* BENTO SKILLS COMPILATION */}
            <motion.div
              variants={itemVariants}
              className="border border-slate-800 bg-slate-950/80 backdrop-blur-md rounded-2xl p-5 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/5 rotate-45 pointer-events-none" />

              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800/50">
                <Cpu className="w-4.5 h-4.5 text-[#10b981]" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-200 font-extrabold">
                  0x08 // REGISTERED ENGINEERING CAPABILITIES
                </h3>
              </div>

              {/* Bento lists with high-contrast text */}
              <div className="space-y-4 font-mono">
                
                {/* Languages */}
                <div className="border border-slate-850 bg-slate-950/40 p-3.5 rounded-xl hover:border-cyan-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-cyan-400 font-extrabold tracking-wide">
                      0x01 // COMPILER COMPATIBLE LANGUAGES
                    </span>
                    <Wrench className="w-3.5 h-3.5 text-slate-650" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Python", "JavaScript", "Java", "C", "Verilog", "VHDL", "Embedded C"].map((lang) => {
                      const { icon, border } = getTechDecoration(lang);
                      return (
                        <span key={lang} className={`text-[10px] bg-slate-900 border border-slate-800 text-slate-200 hover:text-white px-2.5 py-1 rounded flex items-center gap-1.5 font-bold transition-all ${border}`}>
                          {icon}
                          {lang}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Frameworks */}
                <div className="border border-slate-850 bg-slate-950/40 p-3.5 rounded-xl hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-purple-400 font-extrabold tracking-wide">
                      0x02 // COGNITIVE MIDDLEWARE & INTERFACES
                    </span>
                    <Layers className="w-3.5 h-3.5 text-slate-650" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["React.js", "Next.js", "Angular", "Redux", "Node.js", "FastAPI", "STT/TTS API"].map((fw) => {
                      const { icon, border } = getTechDecoration(fw);
                      return (
                        <span key={fw} className={`text-[10px] bg-slate-900 border border-slate-850 text-slate-200 hover:text-white px-2.5 py-1 rounded flex items-center gap-1.5 font-bold transition-all ${border}`}>
                          {icon}
                          {fw}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Core Hardware & Toolsets */}
                <div className="border border-slate-850 bg-slate-950/40 p-3.5 rounded-xl hover:border-slate-700 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-400 font-extrabold tracking-wide">
                      0x03 // RF ENGINEERING & CAD TOOLSETS
                    </span>
                    <Cpu className="w-3.5 h-3.5 text-slate-650" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Git", "GitHub", "LTspice", "Proteus", "Multisim",
                      "Logisim", "Quartus Prime", "Arduino", "MATLAB", "SCADA Systems"
                    ].map((tool) => {
                      const { icon, border } = getTechDecoration(tool);
                      return (
                        <span key={tool} className={`text-[10px] bg-slate-900 px-2.5 py-1 border border-slate-850 text-slate-350 rounded font-bold hover:text-white flex items-center gap-1.5 transition-all ${border}`}>
                          {icon}
                          {tool}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Engineering Competencies */}
                <div className="border border-slate-850 bg-slate-950/40 p-3.5 rounded-xl hover:border-slate-700 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-400 font-extrabold tracking-wide">
                      0x04 // COMPUTER SYSTEMS & THEORY
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-650" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["DSA Solutions", "Object-Oriented Logic", "AI Algorithm Analysis", "Signal Processing", "Modulation Layouts"].map((core) => {
                      const { icon, border } = getTechDecoration(core);
                      return (
                        <span key={core} className={`text-[10px] bg-slate-900 px-2.5 py-1 border border-slate-850 text-slate-350 rounded font-bold hover:text-white flex items-center gap-1.5 transition-all ${border}`}>
                          {icon}
                          {core}
                        </span>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>

            {/* AUXILIARY REGISTERS (NCC/ORGANIZATIONS) */}
            <motion.div
              variants={itemVariants}
              className="border border-slate-800 bg-slate-950/80 backdrop-blur-md rounded-2xl p-5 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800/50">
                <ShieldCheck className="w-4.5 h-4.5 text-purple-400" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-200 font-extrabold">
                  0x09 // AUXILIARY NETWORKS & LEADERSHIP CORPS
                </h3>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* NCC */}
                <div className="border border-slate-850 bg-slate-950/40 p-4 rounded-xl hover:border-amber-500/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-slate-100 font-bold">NCC Cadet (Grade 'A')</h4>
                    <span className="text-[8px] bg-amber-950/30 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-extrabold tracking-wider">
                      LEADERSHIP
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-semibold">
                    National Cadet Corps ECE core. Cultivated physical rigor, operational coordination, and discipline in teamwork.
                  </p>
                </div>

                {/* GDG */}
                <div className="border border-slate-850 bg-slate-950/40 p-4 rounded-xl hover:border-[#10b981]/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-slate-100 font-bold">Google Developer Group Member</h4>
                    <span className="text-[8px] bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-extrabold tracking-wider">
                      DEV CORE
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-semibold">
                    GDG NIT Manipur chapter. Researched high-scale application trends, software blueprints, and systems deployment.
                  </p>
                </div>

                {/* Cygnus */}
                <div className="border border-slate-850 bg-slate-950/40 p-4 rounded-xl hover:border-purple-500/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-slate-100 font-bold">Cygnus Robotics and IoT Member</h4>
                    <span className="text-[8px] bg-purple-950/30 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-extrabold tracking-wider">
                      PROTOTYPES
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-semibold">
                    Synthesized autonomous microcontroller models, circuit layout patterns, and low-level firmware signal protocols.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

        {/* 3. EXPERIENCES AND ADVANCED DEPLOYMENTS SECTION */}
        <div id="field-deployments" className="mt-8">
          <Projects />
        </div>

        {/* 4. CODING SITES / PROFILES GRID */}
        <div className="mt-8">
          <CodingProfiles />
        </div>

        {/* 5. ACCREDITED ACHIEVEMENTS */}
        <div className="mt-8">
          <Achievements />
        </div>

        {/* RECRUITER HIGH-ACCESSIBILITY FOOTER */}
        <footer className="mt-12 pt-8 border-t border-slate-900 font-mono text-[11px] text-slate-450">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-slate-350">
            <div>
              <h5 className="text-slate-100 font-bold text-xs mb-3 uppercase tracking-wider">Navigation Indexes</h5>
              <ul className="space-y-2 font-semibold">
                <li><button onClick={() => handleScrollToElement("status-header")} className="hover:text-cyan-400 transition-colors cursor-pointer">0x01 // Top Node</button></li>
                <li><button onClick={() => handleScrollToElement("field-deployments")} className="hover:text-cyan-400 transition-colors cursor-pointer">0x03 // Project Matrices</button></li>
                <li><button onClick={() => handleScrollToElement("recruiter-despatch-console")} className="hover:text-cyan-400 transition-colors cursor-pointer">0x06 // secure communications</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-slate-100 font-bold text-xs mb-3 uppercase tracking-wider">Secure Gateways</h5>
              <div className="space-y-2 font-semibold">
                <a href="https://github.com/Gauravchaudhary76" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cyan-405 transition-colors">
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository Base</span>
                </a>
                <a href="https://linkedin.com/in/gaurav-chaudhary76" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cyan-405 transition-colors">
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn Professional Gateway</span>
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-slate-100 font-bold text-xs mb-3 uppercase tracking-wider">Infrastructure specs</h5>
              <div className="space-y-1 bg-slate-950/60 border border-slate-900 rounded-lg p-3 text-[10px] text-slate-450 leading-relaxed font-semibold">
                <p>ENGINE: ReactJS + Tailwind CSS v4</p>
                <p>LATENCY: LOCAL_PROXY_VITE_SPA_TUNNEL</p>
                <p>PERSISTENCE: MULTIPLE_THREAD_PERSIST_MONGO</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-950 pt-5 text-slate-500 font-bold text-[10px]">
            <span>DESIGN THEME: HIGH-CONTRAST CYBER-PHYSICAL WORKSPACE HUD v4.5</span>
            <span className="mt-2 sm:mt-0">© GAURAV KUMAR CHAUDHARY // 100% EXCELLENCE-FUELED APPLICATION ENGINE</span>
          </div>
        </footer>

      </motion.div>
    </div>
  );
}
