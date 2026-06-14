import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function ThreeAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const [activeTerm, setActiveTerm] = useState("AI_ENGINEER_STANDBY");
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight || 400;

    // Detect if mobile/lower performance device to adjust simulation bounds
    const isMobile = window.innerWidth < 768;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.12);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 7.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // ROOT AVATAR GROUP
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // LIGHTS WITH CHROMATIC NEON RANGE
    const ambientLight = new THREE.AmbientLight(0x020617, 2.5);
    scene.add(ambientLight);

    // Cyberpunk Cyan Accent Light
    const cyanLight = new THREE.DirectionalLight(0x06b6d4, 4.0);
    cyanLight.position.set(6, 4, 5);
    scene.add(cyanLight);

    // Cyberpunk Magenta/Purple Glow Fill Light
    const purpleLight = new THREE.PointLight(0xd946ef, 5.0, 16);
    purpleLight.position.set(-5, 0, 4);
    scene.add(purpleLight);

    // Cyberpunk Emerald Green Node light
    const greenLight = new THREE.PointLight(0x10b981, 3.0, 10);
    greenLight.position.set(2, -4, 2);
    scene.add(greenLight);

    // 1. ADVANCED HOLOGRAM CYBERNETIC MESH (Increased size by 15%)
    // Base scale is now ~1.72
    const baseOrbRadius = 1.72;
    const headGeometry = new THREE.IcosahedronGeometry(baseOrbRadius, isMobile ? 1 : 2);
    
    // Outer Primary Wireframe (Teal/Cyan)
    const headWireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const headWireframe = new THREE.Mesh(headGeometry, headWireframeMaterial);
    avatarGroup.add(headWireframe);

    // Secondary Inner Counter-Rotating Shell to generate complex interference patterns
    const innerShellGeom = new THREE.IcosahedronGeometry(baseOrbRadius * 0.96, isMobile ? 1 : 2);
    const innerShellMaterial = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const innerShell = new THREE.Mesh(innerShellGeom, innerShellMaterial);
    avatarGroup.add(innerShell);

    // Inner Faceted Shaded Core (Deep purple/navy crystal core)
    const headCoreGeometry = new THREE.IcosahedronGeometry(baseOrbRadius * 0.90, 1);
    const headCoreMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e1b4b,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.45,
      flatShading: true,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
    });
    const headCore = new THREE.Mesh(headCoreGeometry, headCoreMaterial);
    avatarGroup.add(headCore);

    // 2. GLOWING CENTRAL AI CORE (Pulsing Heartbeat)
    const glowingCoreGeom = new THREE.SphereGeometry(0.55, 32, 32);
    const glowingCoreMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const glowingCore = new THREE.Mesh(glowingCoreGeom, glowingCoreMat);
    avatarGroup.add(glowingCore);

    // 3. PROPAGATING VOLUMETRIC ENERGY WAVEFRONTS (Concentric Radiating Shells)
    const wavefrontCount = isMobile ? 2 : 3;
    const wavefronts: { mesh: THREE.Mesh; scale: number; speed: number }[] = [];
    const wavefrontMatBase = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < wavefrontCount; i++) {
      const wavefrontGeom = new THREE.SphereGeometry(baseOrbRadius, 12, 12);
      const waveMesh = new THREE.Mesh(wavefrontGeom, wavefrontMatBase.clone());
      // Start at staggered intervals
      const initialScale = 1.0 + (i / wavefrontCount) * 1.5;
      waveMesh.scale.setScalar(initialScale);
      scene.add(waveMesh);
      wavefronts.push({
        mesh: waveMesh,
        scale: initialScale,
        speed: 0.012 + i * 0.003,
      });
    }

    // 4. VR CYBER VISOR BAND (Recruiter-friendly sleek glass)
    const visorGeom = new THREE.TorusGeometry(baseOrbRadius * 1.06, 0.11, 10, 36, Math.PI);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xd946ef,
      emissive: 0xa855f7,
      emissiveIntensity: 0.6,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.9,
    });
    const visor = new THREE.Mesh(visorGeom, visorMat);
    visor.rotation.x = Math.PI / 2;
    visor.position.set(0, 0.08, 0);
    avatarGroup.add(visor);

    // Left/Right Cyber Ears Adapters
    const earGeom = new THREE.CylinderGeometry(0.24, 0.28, 0.35, 16);
    const earMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.1,
      roughness: 0.15,
      metalness: 0.85,
    });
    
    const leftEar = new THREE.Mesh(earGeom, earMat);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-baseOrbRadius * 1.02, 0.08, 0);
    avatarGroup.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.set(baseOrbRadius * 1.02, 0.08, 0);
    avatarGroup.add(rightEar);

    // 5. ORBITING NEURAL RINGS (Improved Bloom & Contrast)
    const ringGroup = new THREE.Group();
    avatarGroup.add(ringGroup);

    // Ring 1 - Cyan Horizontal Tech-Ring
    const ring1Geom = new THREE.TorusGeometry(baseOrbRadius * 1.55, 0.016, 4, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    ringGroup.add(ring1);

    // Ring 2 - Magenta Slanted Neural Link Orbit
    const ring2Geom = new THREE.TorusGeometry(baseOrbRadius * 1.72, 0.012, 4, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 5;
    ringGroup.add(ring2);

    // Flowing Micro Nodes Traveling on Ring 1 (Signals)
    const signalNodeGeom = new THREE.DodecahedronGeometry(0.13);
    const signalNodeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const signalNode = new THREE.Mesh(signalNodeGeom, signalNodeMat);
    ring1.add(signalNode);

    // 6. HIGH-SPEED CONDUIT DATA PARTICLES (Digital Dust)
    const particleCount = isMobile ? 60 : 150;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];
    const particleYLimits: number[] = [];
    const particleDrifts: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 9;
      const py = (Math.random() - 0.5) * 6.5;
      const pz = (Math.random() - 0.5) * 5.5 - 2.0;

      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;

      particleSpeeds.push(0.008 + Math.random() * 0.02);
      particleYLimits.push(3.5 + Math.random() * 1.5);
      particleDrifts.push((Math.random() - 0.5) * 0.005);
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: isMobile ? 0.05 : 0.07,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // 7. FLOATING HUD HOLOGRAM CODE SNIPPETS
    const createCodeTexture = (title: string, line: string, isGreen = false) => {
      const canvas = document.createElement("canvas");
      canvas.width = 280;
      canvas.height = 120;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // High-tech styled card
        ctx.fillStyle = "rgba(8, 13, 28, 0.92)";
        ctx.fillRect(0, 0, 280, 120);

        // Neon border highlight
        ctx.strokeStyle = isGreen ? "rgba(16, 185, 129, 0.65)" : "rgba(6, 182, 212, 0.65)";
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, 280, 120);

        // Grid corner ticks
        ctx.fillStyle = isGreen ? "#10b981" : "#06b6d4";
        ctx.fillRect(0, 0, 12, 4);
        ctx.fillRect(0, 0, 4, 12);
        ctx.fillRect(268, 0, 12, 4);
        ctx.fillRect(276, 0, 4, 12);

        // Terminal Prompt
        ctx.fillStyle = isGreen ? "#34d399" : "#22d3ee";
        ctx.font = "bold 16px monospace";
        ctx.fillText(`❯ ${title}`, 20, 36);

        // Executed syntax
        ctx.fillStyle = "#f1f5f9";
        ctx.font = "13px monospace";
        ctx.fillText(line, 20, 72);

        // Connection Latency Indicator
        ctx.fillStyle = "rgba(100, 116, 139, 0.8)";
        ctx.font = "bold 10px monospace";
        ctx.fillText("LATENCY :: 12ms // CONDUIT_OK_", 20, 102);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const codeTabs: { mesh: THREE.Mesh; yBase: number; floatOffset: number; speed: number }[] = [];
    const codeSnippetTemplates = [
      { tag: "NEURAL_NET_V5", code: "model.compile(adam_lr);", pos: [-2.6, 1.6, 1.4], green: false },
      { tag: "OPTIMIZER_SEC", code: "while(solving) refactor();", pos: [2.5, -0.9, 1.2], green: true },
      { tag: "GPIO_TELEMETRY", code: "write(ch, 0x7F_SCADA);", pos: [-2.7, -1.3, 1.0], green: false },
    ];

    codeSnippetTemplates.forEach((data) => {
      const tex = createCodeTexture(data.tag, data.code, data.green);
      const tabMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const tabGeom = new THREE.PlaneGeometry(1.68, 0.72);
      const tabMesh = new THREE.Mesh(tabGeom, tabMat);
      
      tabMesh.position.set(data.pos[0], data.pos[1], data.pos[2]);
      // Give realistic screen angling toward center
      tabMesh.rotation.y = data.pos[0] > 0 ? -0.3 : 0.3;
      tabMesh.rotation.x = data.pos[1] > 0 ? 0.1 : -0.1;
      
      scene.add(tabMesh);
      codeTabs.push({
        mesh: tabMesh,
        yBase: data.pos[1],
        floatOffset: Math.random() * Math.PI * 2,
        speed: 0.45 + Math.random() * 0.3,
      });
    });

    // 8. REFLECTIVE KEYBOARD / RADAR TARGETING GRID (Double Grids for Parallax)
    const gridColor1 = new THREE.Color(0x06b6d4);
    const gridColor2 = new THREE.Color(0x0f172a);
    const keyboardGrid = new THREE.GridHelper(5, 20, gridColor1, gridColor2);
    keyboardGrid.position.set(0, -2.6, 0);
    scene.add(keyboardGrid);

    // Minor second concentric grid closer to floor for beautiful parallax grid mesh effect
    const subGrid = new THREE.GridHelper(4.8, 10, 0xa855f7, 0x020617);
    subGrid.position.set(0, -2.62, 0);
    subGrid.material.opacity = 0.5;
    scene.add(subGrid);

    // MOUSE PARALLAX SPRING INTERPOLATOR VARIABLES
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isMouseInside = false;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Calculate from center normalized to [-1.0, 1.0]
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;
      isMouseInside = true;
    };

    const handleMouseLeave = () => {
      // Direct back smoothly to home base
      mouseX = 0;
      mouseY = 0;
      isMouseInside = false;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // ANIMATION LOOP FOR PREMIUM SMOOTHNESS
    const clock = new THREE.Clock();
    let animationFrameId: number;

    // Glitch Timer Management
    let lastGlitchTime = 0;
    let glitchDuration = 0.4; // seconds
    let glitchingNow = false;

    // AI Core Heartbeat Pulse Modifier
    let burstIntensity = 0.0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Periodic system update burst (heartbeat swell) every 4 seconds
      const pulseCycle = elapsedTime * Math.PI * 0.5;
      const heartbeat = Math.pow(Math.sin(pulseCycle), 16); // Sharp periodic bump
      
      // Gradually decay burstIntensity
      burstIntensity += (heartbeat - burstIntensity) * 0.15;

      // 15 - 20 Second Glitch Automation Trigger
      if (Math.floor(elapsedTime) % 18 === 0 && Math.floor(elapsedTime) > 0) {
        if (!glitchingNow && elapsedTime - lastGlitchTime > 3.0) {
          glitchingNow = true;
          lastGlitchTime = elapsedTime;
          setIsGlitching(true);
        }
      }

      // Turn off glitch after set period
      if (glitchingNow && elapsedTime - lastGlitchTime > glitchDuration) {
        glitchingNow = false;
        setIsGlitching(false);
      }

      // MOUSE PARALLAX SPRING SPRING INTERPOLATION
      // Spring constant or inertia. Eases back to zero if mouse leaves.
      const springConstant = isMouseInside ? 0.06 : 0.045;
      targetX += (mouseX - targetX) * springConstant;
      targetY += (mouseY - targetY) * springConstant;

      // Rotate group incrementally
      avatarGroup.rotation.y = targetX * 0.55 + Math.sin(elapsedTime * 0.2) * 0.05;
      avatarGroup.rotation.x = -targetY * 0.35 + Math.cos(elapsedTime * 0.15) * 0.1;

      // Apply subtle spatial jittering during glitch
      if (glitchingNow) {
        avatarGroup.position.x = (Math.random() - 0.5) * 0.18;
        avatarGroup.position.y = (Math.random() - 0.5) * 0.18;
        headWireframeMaterial.opacity = 0.85 + Math.cos(elapsedTime * 85) * 0.15;
        innerShellMaterial.opacity = 0.7;
      } else {
        // Slow luxurious vertical bounce (idle breath)
        avatarGroup.position.x = 0;
        avatarGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.14;
        
        // Return visibility to standard standby ranges
        headWireframeMaterial.opacity = 0.48 + (isHoveredRef.current ? 0.22 : 0.0);
        innerShellMaterial.opacity = 0.22 + (isHoveredRef.current ? 0.15 : 0.0);
      }

      // Counter-rotating the dual outer mesh shells
      headWireframe.rotation.y = elapsedTime * 0.07;
      headWireframe.rotation.z = elapsedTime * 0.04;
      innerShell.rotation.y = -elapsedTime * 0.04;
      innerShell.rotation.x = -elapsedTime * 0.02;

      // Fast angular rotation on the crystal solid core inside
      headCore.rotation.y = -elapsedTime * 0.05;

      // Rings speed progression
      ring1.rotation.z = elapsedTime * 0.40;
      ring2.rotation.z = -elapsedTime * 0.18;

      // Revolving energy node on Ring 1
      signalNode.position.x = Math.cos(elapsedTime * 1.8) * (baseOrbRadius * 1.55);
      signalNode.position.z = Math.sin(elapsedTime * 1.8) * (baseOrbRadius * 1.55);
      signalNode.scale.setScalar(0.9 + Math.sin(elapsedTime * 4.5) * 0.25);

      // Core scale is multiplied by basic oscillation + sudden dynamic heartbeat burst swell
      const corePulseScale = 1.0 + Math.sin(elapsedTime * 2.8) * 0.08 + burstIntensity * 0.38 + (isHoveredRef.current ? 0.15 : 0.0);
      glowingCore.scale.setScalar(corePulseScale);

      // Propagate concentric volumetric energy wavefront outer shells
      wavefronts.forEach((wave) => {
        wave.scale += wave.speed * (1.0 + burstIntensity * 1.8);
        
        // Wrap around limits
        if (wave.scale > 3.6) {
          wave.scale = baseOrbRadius;
        }

        // Apply fading to wavefront as it expands
        const progress = (wave.scale - baseOrbRadius) / (3.6 - baseOrbRadius);
        const waveMat = wave.mesh.material as THREE.MeshBasicMaterial;
        waveMat.opacity = Math.max(0, (1.0 - progress) * 0.12 * (1.0 + burstIntensity * 1.5));
        
        wave.mesh.scale.setScalar(wave.scale);
        wave.mesh.rotation.y = elapsedTime * 0.05;
      });

      // Ambient HUD Text Tabs floating cycles
      codeTabs.forEach((tab) => {
        tab.mesh.position.y = tab.yBase + Math.sin(elapsedTime * tab.speed + tab.floatOffset) * 0.12;
        // Face the front viewport with small tracking
        tab.mesh.rotation.y = (tab.mesh.position.x > 0 ? -0.3 : 0.3) + targetX * 0.15;
      });

      // Cascade background neural dust particles
      const positionsAttr = particleGeom.getAttribute("position");
      const array = positionsAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Raise upward
        array[i * 3 + 1] += particleSpeeds[i] * (1.1 + burstIntensity * 0.8);
        // Apply slight sideways physical drift
        array[i * 3] += particleDrifts[i];

        // Wrap particles back to base when they float out of standard viewport threshold
        if (array[i * 3 + 1] > particleYLimits[i]) {
          array[i * 3 + 1] = -3.2;
          array[i * 3] = (Math.random() - 0.5) * 9;
        }
      }
      positionsAttr.needsUpdate = true;

      // Smooth point light orbital tracking
      purpleLight.position.x = Math.sin(elapsedTime * 0.8) * 6;
      purpleLight.position.y = Math.cos(elapsedTime * 0.6) * 3;

      cyanLight.position.x = Math.cos(elapsedTime * 0.5) * 6;
      cyanLight.position.z = Math.sin(elapsedTime * 0.5) * 5;

      // Update state nomenclature on elapsed cycles
      const terms = [
        "AI_ENGINEER_LOADED",
        "SCADA_TELEMETRY_SYNCED",
        "OPTIMIZATION_CYCLES_OK",
        "EMBEDDED_COMPILER_ONLINE",
        "DECISION_AIMS_ONLINE"
      ];
      const cycleIndex = Math.floor((elapsedTime / 3.5) % terms.length);
      setActiveTerm(terms[cycleIndex]);

      renderer.render(scene, camera);
    };

    animate();

    // DYNAMIC RESIZE STREAM
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight || 400;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      handleResize();
    });

    resizeObserver.observe(container);

    // CLEANUP TO REVENT MEMORY LEAKS
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose materials & geometries
      headGeometry.dispose();
      headWireframeMaterial.dispose();
      innerShellGeom.dispose();
      innerShellMaterial.dispose();
      headCoreGeometry.dispose();
      headCoreMaterial.dispose();
      glowingCoreGeom.dispose();
      glowingCoreMat.dispose();
      visorGeom.dispose();
      visorMat.dispose();
      earGeom.dispose();
      earMat.dispose();
      leftEar.geometry.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      signalNodeGeom.dispose();
      signalNodeMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      keyboardGrid.dispose();
      subGrid.dispose();
      wavefrontMatBase.dispose();

      wavefronts.forEach(wave => {
        wave.mesh.geometry.dispose();
        (wave.mesh.material as THREE.Material).dispose();
      });
      
      codeTabs.forEach(tab => {
        tab.mesh.geometry.dispose();
        if (Array.isArray(tab.mesh.material)) {
          tab.mesh.material.forEach(m => m.dispose());
        } else {
          tab.mesh.material.dispose();
        }
      });
    };
  }, []);

  return (
    <div 
      className="relative w-full h-[340px] sm:h-[420px] lg:h-[460px] flex items-center justify-center select-none overflow-hidden group"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      {/* 1. Volumetric lighting backdrop behind (Custom stylized radial background grid shine) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.07)_0%,rgba(168,85,247,0.03)_50%,transparent_100%)] pointer-events-none" />

      {/* 2. Horizontal scanlines overlay (Iron-man / holographic visual grit) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(rgba(18,24,38,0)_50%,rgba(6,182,212,1)_50%)] bg-[length:100%_4px] mix-blend-color-dodge z-20" />

      {/* Ambient Glitch chromatic split wrapper */}
      <div 
        className={`w-full h-full transition-all duration-300 ${
          isGlitching ? "skew-x-3 scale-[1.02] filter hue-rotate-15 contrast-125 saturate-150" : ""
        }`}
      >
        <div 
          ref={containerRef} 
          className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing z-10"
        />
      </div>

      {/* Cybernetic HUD overlay indicators (Top Right) */}
      <div className="absolute top-4 right-4 pointer-events-none flex flex-col items-end gap-1 font-mono text-[9px] text-cyan-400 z-20">
        <div className={`flex items-center gap-1.5 bg-slate-950/75 border px-2.5 py-0.5 rounded backdrop-blur-sm transition-all ${
          isGlitching ? "border-rose-500 text-rose-450 animate-bounce" : "border-cyan-500/30"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
            isGlitching ? "bg-rose-500" : "bg-emerald-400"
          }`} />
          <span>{isGlitching ? "SYSTEM_GLITCH_CORRECT" : "AI_ENGINE_ONLINE"}</span>
        </div>
        <div className="bg-slate-950/70 border border-cyan-500/20 px-2 py-0.5 rounded backdrop-blur-sm text-slate-500">
          CORE: <span className="text-purple-400">98.4%_HEALTH</span>
        </div>
      </div>

      {/* Active Diagnostics Indicator Command Row (Bottom Left) */}
      <div className="absolute bottom-4 left-4 pointer-events-none flex flex-col gap-1 font-mono text-[10px] text-slate-400 z-20">
        <div className="bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded backdrop-blur-sm text-cyan-400 flex items-center gap-2">
          <span className="text-emerald-400 font-bold font-mono">❯</span>
          <span className="font-extrabold tracking-widest uppercase transition-all duration-300">
            {isGlitching ? "ERR_REPARING_SECTOR" : activeTerm}
          </span>
        </div>
        <span className="text-[9px] text-slate-500 font-bold ml-1 tracking-wider uppercase">
          HOLOGRAM COMPILER v5.0 // DAMPED PARALLAX INTENT
        </span>
      </div>

      {/* Developer Subtitles (Bottom Right) */}
      <div className="absolute bottom-4 right-4 pointer-events-none flex flex-col items-end gap-1 font-mono text-[9px] text-slate-500 z-20">
        <span className="text-cyan-455/60 font-bold">AI CORE ENGINEER + PROBLEM SOLVER</span>
        <span>INTELLIGENT_AGENTS_ACTIVE</span>
      </div>

      {/* Fine Neon Cyber Corner framing angles */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-500/30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-500/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-500/30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-500/30 pointer-events-none" />
    </div>
  );
}
