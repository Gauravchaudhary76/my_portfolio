import React from "react";
import { CODING_PROFILES } from "../data";
import { Github, Linkedin, ExternalLink, Trophy, Code2, Award, Zap, Instagram } from "lucide-react";
import { motion } from "motion/react";

export function CodingProfiles() {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github className="w-5 h-5 text-cyan-400" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5 text-blue-400" />;
      case "leetcode":
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case "codeforces":
        return <Zap className="w-5 h-5 text-blue-500" />;
      case "hackerrank":
        return <Award className="w-5 h-5 text-emerald-500" />;
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-450" style={{ color: "#ec4899" }} />;
      default:
        return <Code2 className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="border border-slate-800/80 rounded-2xl bg-slate-950/70 p-6 shadow-xl relative overflow-hidden mb-6">
      <div className="flex items-center justify-between mb-5 pb-2 border-b border-slate-800/50">
        <div className="flex items-center gap-2.5">
          <Trophy className="w-5 h-5 text-amber-500 animate-pulse" />
          <h3 className="font-mono text-sm uppercase tracking-wider text-slate-200 font-extrabold">
            0x05 // DIGITAL PORTFOLIOS & SOCIAL NETWORKS
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono tracking-widest font-extrabold uppercase">
          STABLE_LINK_OK
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CODING_PROFILES.map((profile, index) => (
          <motion.a
            key={profile.id}
            href={profile.profileUrl}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={`flex flex-col justify-between border p-4 rounded-xl bg-gradient-to-br ${profile.color} hover:translate-y-[-2px] transition-all duration-350 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 relative overflow-hidden group`}
          >
            {/* Visual signal lines */}
            <div className="absolute top-[-1px] right-2 w-8 h-[1.5px] bg-cyan-400/40 group-hover:w-16 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-slate-950/80 border border-slate-800/65 rounded-lg group-hover:scale-105 transition-transform">
                  {getIcon(profile.platform)}
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h4 className="text-sm font-mono font-bold text-slate-100 group-hover:text-cyan-400 transition-colors uppercase">
                {profile.platform}
              </h4>
              <p className="text-[11px] font-mono text-slate-400 mt-1 font-bold">
                @{profile.username}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900">
              <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-cyan-500/10 text-cyan-400 bg-cyan-950/20 block text-center mb-1.5 tracking-wider truncate font-mono uppercase">
                {profile.rank}
              </span>
              <p className="text-[10px] text-slate-300 font-mono font-semibold leading-snug">
                {profile.stats}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
