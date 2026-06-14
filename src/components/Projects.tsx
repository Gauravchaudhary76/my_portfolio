import React from "react";
import { Project } from "../types";
import { PROJECTS } from "../data";
import { ArrowUpRight, Code, ExternalLink, Github, Monitor, Server, Radio, Sliders, Activity, Briefcase, Calendar, Building2 } from "lucide-react";
import { motion } from "motion/react";

export function Projects() {
  const getAccentClass = (accent: string) => {
    switch (accent) {
      case "amber":
        return {
          glow: "group-hover:shadow-amber-500/10",
          border: "group-hover:border-amber-500/40",
          text: "text-amber-400",
          badge: "bg-amber-950/30 text-amber-400 border-amber-500/20",
          bullet: "text-amber-500"
        };
      case "purple":
        return {
          glow: "group-hover:shadow-purple-500/10",
          border: "group-hover:border-purple-500/40",
          text: "text-purple-400",
          badge: "bg-purple-950/30 text-purple-400 border-purple-500/20",
          bullet: "text-purple-500"
        };
      case "green":
        return {
          glow: "group-hover:shadow-emerald-500/10",
          border: "group-hover:border-emerald-500/40",
          text: "text-emerald-400",
          badge: "bg-emerald-950/30 text-emerald-400 border-emerald-500/20",
          bullet: "text-emerald-500"
        };
      default:
        return {
          glow: "group-hover:shadow-cyan-500/10",
          border: "group-hover:border-cyan-500/40",
          text: "text-cyan-400",
          badge: "bg-cyan-950/30 text-cyan-400 border-cyan-500/20",
          bullet: "text-cyan-500"
        };
    }
  };

  // Built-in cool visual representations instead of static images
  const renderMockPreview = (id: string) => {
    if (id === "algo-flow") {
      return (
        <div className="h-44 w-full bg-[#03060c] border border-slate-800/80 rounded-lg p-3 relative overflow-hidden font-mono text-[9px] text-[#10b981] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1 text-slate-500">
            <span>[COMPILER_RUNNING::ALGO_FLOW]</span>
            <Activity className="w-3 h-3 text-amber-500 animate-pulse" />
          </div>
          <div className="space-y-1 my-2 leading-relaxed">
            <div><span className="text-purple-400">const</span> <span className="text-blue-400">bstSort</span> = (nodes) =&gt; &#123;</div>
            <div className="pl-3 text-slate-400">// Generating Monaco graph vertices</div>
            <div className="pl-3"><span className="text-amber-400">return</span> nodes.map(n =&gt; <span className="text-emerald-400">`vertex_id_$&#123;n.id&#125;`</span>);</div>
            <div>&#125;;</div>
          </div>
          {/* Mock visual array nodes */}
          <div className="flex gap-1 items-end h-8 border-t border-slate-900 pt-2">
            {[45, 80, 20, 60, 95, 30, 75].map((val, i) => (
              <div 
                key={i} 
                style={{ height: `${val}%` }} 
                className="flex-1 bg-amber-500/20 hover:bg-amber-400/40 border-t-2 border-amber-500 rounded-sm transition-all duration-300 relative group/bar"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 text-[7px] text-white transition-opacity bg-slate-950 px-0.5 rounded">{val}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (id === "jarvis-ai") {
      return (
        <div className="h-44 w-full bg-[#03060c] border border-slate-800/80 rounded-lg p-3 relative overflow-hidden font-mono text-[9px] text-purple-400 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1 text-slate-500">
            <span>[STT_COGNITIVE_RETRIEVAL]</span>
            <Server className="w-3 h-3 text-purple-500" />
          </div>
          {/* Animated custom visual voice waves */}
          <div className="flex items-center justify-center gap-1.5 py-4 my-auto h-16">
            {[3, 8, 5, 12, 18, 9, 22, 14, 25, 11, 7, 16, 4].map((h, i) => (
              <div 
                key={i}
                style={{ height: `${h * 2}px` }}
                className="w-[3px] bg-purple-500/30 border-y border-purple-400 rounded-full animate-pulse"
              />
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-slate-900 pt-1 text-[8px] text-slate-500">
            <span>PING: <strong className="text-emerald-400">142ms</strong></span>
            <span>FREQ: <strong className="text-purple-400">44.1kHz</strong></span>
          </div>
        </div>
      );
    }

    // RINL VSP
    return (
      <div className="h-44 w-full bg-[#03060c] border border-slate-800/80 rounded-lg p-3 relative overflow-hidden font-mono text-[9px] text-emerald-400 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-900 pb-1 text-slate-500">
          <span>[RINL_VSP::RF_STUDIES]</span>
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
        </div>
        {/* Mock wave chart */}
        <div className="relative h-16 border border-slate-900/60 rounded flex items-center justify-center bg-slate-950/40 my-2">
          <svg className="w-full h-full absolute inset-0 text-emerald-500/20" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M0,20 Q5,25 15,10 T30,30 T45,5 T70,35 T90,12 T100,20" fill="none" stroke="#10b981" strokeWidth="1" className="animate-pulse" />
          </svg>
          <span className="text-[7.5px] uppercase text-emerald-300 font-bold tracking-wider relative z-10 bg-slate-950/80 px-1 border border-emerald-500/20 rounded">
            CALIBRATION CONSTANT: 0.145
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-900 pt-1 text-slate-500">
          <span>COURSES: <strong>VHF SYS</strong></span>
          <span>GAIN: <strong className="text-emerald-400">+15.4%</strong></span>
        </div>
      </div>
    );
  };

  const internshipProject = PROJECTS.find(p => p.id === "telecom-vsp");
  const architecturesProjects = PROJECTS.filter(p => p.id !== "telecom-vsp");

  return (
    <div className="space-y-8">
      {/* SECTION 1: RESEARCH INTERNSHIP */}
      {internshipProject && (
        <div className="border border-slate-800/80 rounded-2xl bg-slate-950/70 p-6 shadow-xl relative overflow-hidden">
          {/* Subtle background industrial circuit matrix glow */}
          <div className="absolute right-[-10%] top-[-10%] w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-800/50">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <h3 className="font-mono text-sm uppercase tracking-wider text-slate-200 font-extrabold flex flex-wrap items-center gap-2">
                <span>0x03 // FIELD RESEARCH & COOPERATIVE INTERNSHIP</span>
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-950/30 text-emerald-400 font-mono border border-emerald-500/20 px-3 py-1 rounded font-extrabold tracking-wider uppercase shrink-0">
              PROFESSIONAL SECTOR
            </span>
          </div>

          <div>
            {(() => {
              const colors = getAccentClass(internshipProject.accent);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`border border-[#10b981]/30 bg-slate-950/40 p-5 sm:p-6 rounded-xl hover:translate-y-[-2px] transition-all duration-300 flex flex-col md:flex-row gap-6 hover:shadow-2xl hover:bg-slate-950/90 group ${colors.glow} hover:border-emerald-500/40`}
                >
                  {/* Left Mock Preview (Visual simulation element) */}
                  <div className="md:w-[240px] shrink-0 space-y-4">
                    {renderMockPreview(internshipProject.id)}
                    
                    {/* Position / Location Badges */}
                    <div className="space-y-2 bg-slate-950/80 border border-slate-900 rounded-lg p-3 font-mono text-[10px] text-slate-400 leading-normal">
                      <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>RINL Steel Plant</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 font-semibold mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>June 2025 - Present</span>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-2 border-t border-slate-900 pt-1.5 font-bold uppercase tracking-wider">
                        STATUS: COMPLETED / VERIFIED
                      </p>
                    </div>
                  </div>

                  {/* Right Details Column */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-500/10 px-2 py-0.5 rounded-full">
                          <span className="relative flex h-1.5 w-1.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          RESEARCH INTERN ROLE
                        </span>
                        <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded border bg-emerald-950/30 text-emerald-400 border-emerald-500/20 tracking-wider`}>
                          SIGNAL GAIN: +15%
                        </span>
                      </div>

                      <h4 className="text-xl sm:text-2xl font-mono font-extrabold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors">
                        {internshipProject.title}
                      </h4>

                      <p className="text-slate-300 text-sm font-mono leading-relaxed mb-4 font-semibold">
                        {internshipProject.description}
                      </p>

                      <div className="space-y-2.5 font-mono text-xs text-slate-400">
                        {internshipProject.bullets.map((bullet, bidx) => (
                          <div key={bidx} className="flex items-start gap-2.5 hover:text-slate-200 transition-colors">
                            <span className="text-emerald-400 font-bold shrink-0">&gt;&gt;</span>
                            <p className="leading-relaxed font-semibold">{bullet}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-5 pt-3 border-t border-slate-900">
                      {internshipProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] bg-slate-900 text-slate-400 hover:text-slate-200 px-2.5 py-0.5 border border-slate-800/80 rounded font-bold transition-all"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SECTION 2: PRODUCTION ARCHITECTURES (PERSONAL PROJECTS) */}
      <div className="border border-slate-800/80 rounded-2xl bg-slate-950/70 p-6 shadow-xl relative overflow-hidden">
        {/* Subtle background visual layout details */}
        <div className="absolute right-[-10%] bottom-[-10%] w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800/50">
          <div className="flex items-center gap-2.5">
            <Code className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono text-sm uppercase tracking-wider text-slate-200 font-extrabold">
              0x04 // PRODUCTION SYSTEM ARCHITECTURES
            </h3>
          </div>
          <span className="text-[10px] bg-cyan-950/30 text-cyan-400 font-mono border border-cyan-500/20 px-2 py-0.5 rounded font-extrabold">
            TOTAL: {architecturesProjects.length} DEPLOYED
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {architecturesProjects.map((project, idx) => {
            const colors = getAccentClass(project.accent);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1 }}
                className={`border border-slate-800/80 bg-slate-950/50 p-5 sm:p-6 rounded-xl hover:translate-y-[-2px] transition-all duration-300 flex flex-col md:flex-row gap-6 hover:shadow-2xl hover:bg-slate-950/90 group ${colors.glow} ${colors.border}`}
              >
                {/* Right column (Illustration & CTAs for desktop, layout helper) */}
                <div className="md:w-[240px] shrink-0 space-y-4">
                  {renderMockPreview(project.id)}
                  
                  <div className="flex gap-2.5">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-mono text-[10px] font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 hover:text-cyan-455 transition-all text-slate-300"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>REPOSITORIES</span>
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-mono text-[10px] font-bold bg-[#0c1221] border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 hover:bg-[#122235]/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>LIVE PREVIEW</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Left Column (Details) */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.bullet.replace("text-", "bg-")} animate-pulse`} />
                        {project.subtitle}
                      </span>
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded border ${colors.badge} tracking-wider`}>
                        {project.highlight}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-mono font-extrabold text-slate-100 mb-2 group-hover:text-cyan-450 transition-colors">
                      {project.title}
                    </h4>

                    <p className="text-slate-200 text-sm font-mono leading-relaxed mb-4 leading-relaxed font-semibold">
                      {project.description}
                    </p>

                    <div className="space-y-2 font-mono text-xs text-slate-400">
                      {project.bullets.map((bullet, bidx) => (
                        <div key={bidx} className="flex items-start gap-2.5 hover:text-slate-200 transition-colors">
                          <span className={`${colors.text} font-bold shrink-0`}>&gt;&gt;</span>
                          <p className="leading-relaxed hover:text-slate-200">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-5 pt-3 border-t border-slate-900">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] bg-slate-900 text-slate-400 hover:text-slate-200 px-2.5 py-0.5 border border-slate-800/80 rounded font-bold transition-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
