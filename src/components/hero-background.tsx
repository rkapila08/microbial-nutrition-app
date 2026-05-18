"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

// RGB approximations of the site's oklch palette (for canvas compat)
const PALETTE = [
  [100, 160, 95] as const, // sage green  ≈ oklch(0.65 0.14 143)
  [195, 105, 140] as const, // rose        ≈ oklch(0.65 0.14 350)
  [190, 168, 95] as const, // amber       ≈ oklch(0.65 0.14 75)
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  phase: number;
  ci: number; // color index into PALETTE
};

function makeParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.38,
    radius: Math.random() * 1.8 + 0.5,
    baseOpacity: Math.random() * 0.45 + 0.12,
    phase: Math.random() * Math.PI * 2,
    // weight heavily toward green, then rose, then amber
    ci: Math.random() < 0.55 ? 0 : Math.random() < 0.65 ? 1 : 2,
  };
}

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, inside: false });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  // Raw cursor position for spring blobs
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      particlesRef.current = Array.from({ length: 95 }, () =>
        makeParticle(width, height),
      );

      const cx = width / 2;
      const cy = height / 2;
      rawX.set(cx);
      rawY.set(cy);
      mouseRef.current = { x: cx, y: cy, inside: false };
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.inside =
        x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      rawX.set(x);
      rawY.set(y);
    };

    window.addEventListener("mousemove", onMove);

    let t = 0;
    const CONNECT_DIST = 115;
    const REPEL_R = 135;
    const REPEL_F = 0.052;
    const GLOW_R = 180;

    const tick = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const { x: mx, y: my, inside } = mouseRef.current;

      ctx.clearRect(0, 0, w, h);
      t += 0.007;

      const ps = particlesRef.current;

      // Cursor glow halo
      if (inside) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, GLOW_R);
        grd.addColorStop(0, "rgba(100, 160, 95, 0.12)");
        grd.addColorStop(0.45, "rgba(195, 105, 140, 0.07)");
        grd.addColorStop(1, "rgba(100, 160, 95, 0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }

      // Update particle physics
      for (const p of ps) {
        // Organic drift via sine noise
        p.vx += Math.sin(t * 0.8 + p.phase) * 0.0022;
        p.vy += Math.cos(t * 0.9 + p.phase * 1.4) * 0.0022;

        // Cursor repulsion
        const ddx = p.x - mx;
        const ddy = p.y - my;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < REPEL_R * REPEL_R && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = ((REPEL_R - d) / REPEL_R) * REPEL_F;
          p.vx += (ddx / d) * f;
          p.vy += (ddy / d) * f;
        }

        p.vx *= 0.976;
        p.vy *= 0.976;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -14) p.x = w + 14;
        else if (p.x > w + 14) p.x = -14;
        if (p.y < -14) p.y = h + 14;
        else if (p.y > h + 14) p.y = -14;
      }

      // Draw connection lines
      for (let i = 0; i < ps.length; i++) {
        const pa = ps[i];
        for (let j = i + 1; j < ps.length; j++) {
          const pb = ps[j];
          const ldx = pa.x - pb.x;
          const ldy = pa.y - pb.y;
          const ld2 = ldx * ldx + ldy * ldy;
          if (ld2 < CONNECT_DIST * CONNECT_DIST) {
            const ld = Math.sqrt(ld2);
            const alpha = (1 - ld / CONNECT_DIST) * 0.22;
            const [red, grn, blu] = PALETTE[pa.ci];
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${red}, ${grn}, ${blu}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of ps) {
        const pulse = 0.75 + 0.25 * Math.sin(t * 1.8 + p.phase);
        let op = p.baseOpacity * pulse;

        // Proximity brightness boost
        if (inside) {
          const pdx = p.x - mx;
          const pdy = p.y - my;
          const pd = Math.sqrt(pdx * pdx + pdy * pdy);
          op += Math.max(0, 1 - pd / 200) * 0.45;
        }

        const [red, grn, blu] = PALETTE[p.ci];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${red}, ${grn}, ${blu}, ${Math.min(0.95, op)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [rawX, rawY]);

  // Blob A — large green, very slow
  const axS = useSpring(rawX, { stiffness: 18, damping: 20, mass: 1.4 });
  const ayS = useSpring(rawY, { stiffness: 18, damping: 20, mass: 1.4 });
  const ax = useTransform(axS, (v) => v - 290);
  const ay = useTransform(ayS, (v) => v - 290);

  // Blob B — medium rose
  const bxS = useSpring(rawX, { stiffness: 48, damping: 22, mass: 0.9 });
  const byS = useSpring(rawY, { stiffness: 48, damping: 22, mass: 0.9 });
  const bx = useTransform(bxS, (v) => v - 200);
  const by = useTransform(byS, (v) => v - 200);

  // Blob C — small amber, snappy
  const cxS = useSpring(rawX, { stiffness: 90, damping: 25, mass: 0.6 });
  const cyS = useSpring(rawY, { stiffness: 90, damping: 25, mass: 0.6 });
  const cx = useTransform(cxS, (v) => v - 120);
  const cy = useTransform(cyS, (v) => v - 120);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Slowly rotating aurora layer */}
      <motion.div
        className="absolute inset-[-25%]"
        style={{
          background: [
            "conic-gradient(from 0deg at 50% 50%,",
            "oklch(0.68 0.18 143 / 0.2) 0deg,",
            "oklch(0.72 0.17 350 / 0.13) 100deg,",
            "oklch(0.82 0.1 75 / 0.1) 200deg,",
            "oklch(0.62 0.15 160 / 0.16) 300deg,",
            "oklch(0.68 0.18 143 / 0.2) 360deg)",
          ].join(" "),
          filter: "blur(75px)",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 45,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Cursor-following blobs */}
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: 580,
          height: 580,
          x: ax,
          y: ay,
          background: "oklch(0.68 0.18 143 / 0.3)",
          filter: "blur(90px)",
        }}
      />
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: 400,
          height: 400,
          x: bx,
          y: by,
          background: "oklch(0.72 0.17 350 / 0.24)",
          filter: "blur(72px)",
        }}
      />
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: 240,
          height: 240,
          x: cx,
          y: cy,
          background: "oklch(0.82 0.1 75 / 0.2)",
          filter: "blur(52px)",
        }}
      />

      {/* Particle + connection canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
