import React, { useState } from "react";
import { ACHIEVEMENTS } from "../data";
import { ShieldCheck, Award, GraduationCap, Trophy, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Achievements() {
  const [filter, setFilter] = useState<"all" | "coding" | "hackathon" | "certification" | "academic">("all");

  const getAccentClass = (accent: string) => {
    switch (accent) {
      case "amber":
        return {
          glow: "hover:border-amber-500/40 hover:shadow-amber-500/5",
          badge: "border-amber-500/20 text-amber-400 bg-amber-950/20",
          text: "group-hover:text-amber-400"
        };
      case "purple":
        return {
          glow: "hover:border-purple-500/40 hover:shadow-purple-500/5",
          badge: "border-purple-500/20 text-purple-400 bg-purple-950/20",
          text: "group-hover:text-purple-400"
        };
      case "green":
        return {
          glow: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
          badge: "border-emerald-500/20 text-emerald-400 bg-emerald-950/20",
          text: "group-hover:text-emerald-400"
        };
      case "cyan":
        return {
          glow: "hover:border-cyan-500/40 hover:shadow-cyan-500/5",
          badge: "border-cyan-500/20 text-cyan-400 bg-cyan-950/20",
          text: "group-hover:text-cyan-400"
        };
      default:
        return {
          glow: "hover:border-slate-700 hover:shadow-slate-500/5",
          badge: "border-slate-700 text-slate-350 bg-slate-800/10",
          text: "group-hover:text-white"
        };
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "coding":
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case "hackathon":
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case "certification":
        return <ShieldCheck className="w-4 h-4 text-[#10b981]" />;
      case "academic":
        return <GraduationCap className="w-4 h-4 text-amber-400" />;
      default:
        return <Award className="w-4 h-4 text-cyan-400" />;
    }
  };

  const filteredAchievements = ACHIEVEMENTS.filter(item => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  return (
    <div className="border border-slate-800/80 rounded-2xl bg-slate-950/70 p-6 shadow-xl relative overflow-hidden mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-800/50">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-purple-400 animate-pulse" />
          <h3 className="font-mono text-sm uppercase tracking-wider text-slate-200 font-extrabold">
            0x04 // ACCREDITED ACHIEVEMENTS & CREDENTIALS
          </h3>
        </div>

        {/* Filter badging registry */}
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
          {[
            { id: "all", label: "ALL" },
            { id: "academic", label: "ACADEMICS" },
            { id: "certification", label: "CERTIFICATES" },
            { id: "hackathon", label: "BOOTCAMPS" },
            { id: "coding", label: "LEADERSHIP" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-2.5 py-1 rounded border transition-all cursor-pointer font-bold ${
                filter === btn.id
                  ? "bg-purple-950/30 text-purple-300 border-purple-500/50 hover:bg-purple-950/40"
                  : "bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-750"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((item) => {
            const style = getAccentClass(item.accent);
            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`border border-slate-800/80 bg-slate-950/50 p-4.5 rounded-xl transition-all duration-300 flex flex-col justify-between group ${style.glow}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="p-1.5 bg-slate-900 border border-slate-800/80 rounded">
                      {getIcon(item.category)}
                    </div>
                    <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded border tracking-wider font-mono ${style.badge}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h4 className={`text-xs sm:text-sm font-mono font-bold text-slate-100 leading-snug mb-1.5 transition-colors ${style.text}`}>
                    {item.title}
                  </h4>

                  <p className="text-[11px] sm:text-xs text-slate-300 font-mono leading-relaxed font-semibold">
                    {item.details}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between text-[9px] font-mono font-bold text-slate-400">
                  <span className="text-slate-500 truncate max-w-[140px]">{item.issuer}</span>
                  <span className="text-cyan-400 bg-cyan-950/20 px-1.5 py-0.5 rounded border border-cyan-500/10 shrink-0 font-bold">
                    {item.date}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
