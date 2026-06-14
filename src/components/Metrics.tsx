import React, { useState, useEffect } from "react";
import { STAT_METRICS } from "../data";
import { motion } from "motion/react";
import { Code2, GitMerge, Laptop, Cpu, Trophy } from "lucide-react";

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count}</span>;
}

export function Metrics() {
  const getIcon = (id: string, colorClass: string) => {
    switch (id) {
      case "dsa":
        return <Trophy className={`w-5 h-5 ${colorClass}`} />;
      case "projects":
        return <Laptop className={`w-5 h-5 ${colorClass}`} />;
      case "techs":
        return <Cpu className={`w-5 h-5 ${colorClass}`} />;
      case "contrib":
        return <GitMerge className={`w-5 h-5 ${colorClass}`} />;
      case "streak":
        return <Code2 className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <Code2 className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        <span className="font-mono text-[10px] text-emerald-400 font-bold tracking-[0.2em] uppercase">
          0x02 // LIVE PERFORMANCE METRICS
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {STAT_METRICS.map((stat, idx) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, type: "spring", stiffness: 100 }}
            className={`border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-705 bg-slate-950/65 hover:bg-slate-950/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.03)] hover:-translate-y-1 relative group overflow-hidden`}
          >
            {/* Minimal cyber highlights */}
            <div className="absolute top-0 left-0 w-1/3 h-[1px] bg-cyan-500/60 group-hover:w-full transition-all duration-300" />
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase">
                REG::{stat.id.toUpperCase()}
              </span>
              <div className="p-1.5 bg-slate-900 border border-slate-800/80 rounded-lg group-hover:scale-105 transition-transform">
                {getIcon(stat.id, stat.color)}
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-0.5">
                <span className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white`}>
                  <AnimatedCounter value={stat.value} />
                </span>
                <span className={`text-base font-mono font-bold ${stat.color.split(" ")[0]}`}>
                  {stat.suffix}
                </span>
              </div>
              <p className="text-[11px] sm:text-[12px] text-slate-300 font-mono mt-1 font-semibold leading-snug">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
