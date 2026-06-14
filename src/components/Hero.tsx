import React, { useState, useEffect } from "react";
import { Download, LayoutGrid, MessageSquare, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThreeAvatar } from "./ThreeAvatar";

interface HeroProps {
  onDownloadResume: () => void;
  onScrollToElement: (id: string) => void;
}

export function Hero({ onDownloadResume, onScrollToElement }: HeroProps) {
  const words = [
    "AI & Full-Stack Developer",
    "Hardware-Software Systems Enthusiast",
    "Embedded C & VLSI Designer",
    "ECE Scholar @ NIT Manipur"
  ];
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = words[currentWordIndex];

    const handleType = () => {
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        if (displaysFullText()) {
          timer = setTimeout(() => setIsDeleting(true), 1500); // Wait on full text
          return;
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        if (displaysEmptyText()) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(100);
          return;
        }
      }

      setTypingSpeed(isDeleting ? 40 : 100);
    };

    function displaysFullText() {
      return displayText === currentFullText;
    }

    function displaysEmptyText() {
      return displayText === "";
    }

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex, typingSpeed]);

  return (
    <div className="relative border border-slate-800/80 bg-slate-950/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-10 mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden group">
      {/* Visual cyber mesh and lights */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/80 to-purple-500/80 group-hover:via-cyan-400 group-hover:to-purple-400 transition-all duration-500" />
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500" />
      <div className="absolute -left-32 -top-32 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-center">
        {/* Left column: Bio information (7/12 width) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Hardware prompt indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 font-bold tracking-[0.25em] uppercase">
              GAURAV_INIT_VECTOR // SECURE CORE OPERATIONAL
            </span>
          </div>

          {/* Name and Professional Headline */}
          <span className="font-mono text-xs sm:text-sm text-cyan-400 font-bold tracking-widest block mb-1 uppercase">
            Welcome to the digital grid of
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-mono font-extrabold text-slate-100 tracking-tight leading-none mb-4">
            GAURAV KUMAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-[#10b981] to-purple-500">CHAUDHARY</span>
          </h1>

          <h2 className="text-base sm:text-xl md:text-2xl font-mono font-bold text-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-h-[56px] sm:min-h-[36px] overflow-hidden">
            <span className="text-slate-400 shrink-0">Software Engineer |</span>
            <span className="text-cyan-400 inline-block min-w-0 sm:whitespace-nowrap">
              {displayText}
              <span className="animate-pulse bg-cyan-400 w-[2.5px] h-[1.15em] inline-block ml-1 align-middle" />
            </span>
          </h2>

          {/* Narrative bio/introduction - 2 paragraph visual flow */}
          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-mono mb-8 border-l border-cyan-500/30 pl-4 py-1">
            An electronics and communication engineering student at <span className="text-cyan-300 font-bold">NIT Manipur</span> bridges low-level hardware design paradigms with responsive, web-scale API grids. Spanning telemetry controls, embedded C, algorithms, and AI agents.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onDownloadResume}
              className="flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-xs font-bold bg-gradient-to-r from-[#f59e0b] to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <Download className="w-4.5 h-4.5" />
              <span>VIEW & DOWNLOAD RESUME</span>
            </button>

            <button
              onClick={() => onScrollToElement("field-deployments")}
              className="flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-xs font-semibold bg-[#0c1324] text-slate-200 hover:text-cyan-450 border border-slate-850 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <LayoutGrid className="w-4.5 h-4.5 text-cyan-400" />
              <span>VIEW ARCHIVES & PROJECTS</span>
            </button>

            <button
              onClick={() => onScrollToElement("recruiter-despatch-console")}
              className="flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-xs font-semibold bg-[#0c1324] text-slate-200 hover:text-emerald-400 border border-slate-850 hover:border-[#10b981]/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <MessageSquare className="w-4.5 h-4.5 text-[#10b981]" />
              <span>CONNECT / CONTACT ME</span>
            </button>
          </div>
        </div>

        {/* Right column: Interactive 3D Developer Avatar (5/12 width) */}
        <div className="lg:col-span-5 w-full flex items-center justify-center bg-slate-950/20 rounded-xl overflow-hidden border border-slate-900/50 hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] transition-all duration-500">
          <ThreeAvatar />
        </div>
      </div>
    </div>
  );
}
