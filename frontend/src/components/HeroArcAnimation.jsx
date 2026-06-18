import { useEffect, useRef } from "react";

const HeroArcAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 0;

    // Stars
    const stars = [];
    const numStars = 100;

    const initStars = (w, h) => {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.45,
          radius: 0.3 + Math.random() * 1.0,
          twinkleSpeed: 0.015 + Math.random() * 0.035,
          phase: Math.random() * Math.PI * 2,
          baseOpacity: 0.2 + Math.random() * 0.5,
        });
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = () => {
      time += 1;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      // ── Planet geometry ──
      // Center the planet far below so only the top curve peeks in.
      // The arc peak should sit around 40% from top — behind the heading text.
      const planetCenterX = w / 2;
      const planetCenterY = h + h * 0.65;
      const planetRadiusX = w * 0.9;
      const planetRadiusY = h * 1.1;

      // Breathing animation
      const breathe = Math.sin(time * 0.01) * 0.06 + 1.0;
      const slowDrift = Math.sin(time * 0.005) * 0.02;

      // Get Y on the planet ellipse for a given X
      const getHorizonY = (x) => {
        const dx = (x - planetCenterX) / planetRadiusX;
        if (Math.abs(dx) > 1) return h + 100;
        return planetCenterY - planetRadiusY * Math.sqrt(1 - dx * dx);
      };

      const horizonPeakY = getHorizonY(w / 2);

      // ── 1. Draw planet body (deep dark navy below the horizon) ──
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        planetCenterX, planetCenterY,
        planetRadiusX, planetRadiusY,
        0, Math.PI, 2 * Math.PI
      );
      ctx.closePath();
      const planetGrad = ctx.createRadialGradient(
        planetCenterX, horizonPeakY + 30, 10,
        planetCenterX, planetCenterY, planetRadiusY
      );
      planetGrad.addColorStop(0, "rgba(20, 25, 70, 1)");
      planetGrad.addColorStop(0.15, "rgba(10, 14, 50, 1)");
      planetGrad.addColorStop(0.5, "rgba(5, 8, 30, 1)");
      planetGrad.addColorStop(1, "rgba(2, 3, 12, 1)");
      ctx.fillStyle = planetGrad;
      ctx.fill();
      ctx.restore();

      // ── 2. Atmospheric glow layers ──

      // Layer A: Huge outer purple/violet haze
      ctx.save();
      const outerAtmos = ctx.createRadialGradient(
        planetCenterX, horizonPeakY + 10, 0,
        planetCenterX, horizonPeakY + 10, w * 0.7 * breathe
      );
      outerAtmos.addColorStop(0, `rgba(160, 100, 255, ${0.32 * breathe})`);
      outerAtmos.addColorStop(0.15, `rgba(130, 70, 230, ${0.22 * breathe})`);
      outerAtmos.addColorStop(0.35, `rgba(90, 40, 190, ${0.12 * breathe})`);
      outerAtmos.addColorStop(0.6, `rgba(50, 20, 130, ${0.05})`);
      outerAtmos.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = outerAtmos;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Layer B: Mid-range blue/indigo glow
      ctx.save();
      const midAtmos = ctx.createRadialGradient(
        planetCenterX + w * slowDrift, horizonPeakY, 0,
        planetCenterX + w * slowDrift, horizonPeakY, w * 0.42 * breathe
      );
      midAtmos.addColorStop(0, `rgba(110, 140, 255, ${0.38 * breathe})`);
      midAtmos.addColorStop(0.2, `rgba(80, 100, 240, ${0.22 * breathe})`);
      midAtmos.addColorStop(0.5, `rgba(50, 50, 190, ${0.08})`);
      midAtmos.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = midAtmos;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Layer C: Tight white-hot glow at horizon edge
      ctx.save();
      const coreGlow = ctx.createRadialGradient(
        planetCenterX, horizonPeakY - 8, 0,
        planetCenterX, horizonPeakY - 8, w * 0.28 * breathe
      );
      coreGlow.addColorStop(0, `rgba(210, 220, 255, ${0.5 * breathe})`);
      coreGlow.addColorStop(0.1, `rgba(170, 185, 255, ${0.3 * breathe})`);
      coreGlow.addColorStop(0.3, `rgba(120, 100, 230, ${0.12})`);
      coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // ── 3. Horizon rim light (multi-pass strokes) ──
      const traceHorizon = () => {
        ctx.beginPath();
        let started = false;
        for (let x = -30; x <= w + 30; x += 2) {
          const y = getHorizonY(x);
          if (y < h + 50) {
            if (!started) { ctx.moveTo(x, y); started = true; }
            else ctx.lineTo(x, y);
          }
        }
      };

      // Pass 1: Wide purple ambient glow
      ctx.save();
      traceHorizon();
      ctx.shadowBlur = 55 * breathe;
      ctx.shadowColor = `rgba(150, 100, 255, ${0.75 * breathe})`;
      ctx.strokeStyle = `rgba(130, 80, 240, ${0.2 * breathe})`;
      ctx.lineWidth = 28;
      ctx.stroke();
      ctx.restore();

      // Pass 2: Medium blue core
      ctx.save();
      traceHorizon();
      ctx.shadowBlur = 22 * breathe;
      ctx.shadowColor = `rgba(90, 130, 255, ${0.85 * breathe})`;
      ctx.strokeStyle = `rgba(110, 155, 255, ${0.45 * breathe})`;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      // Pass 3: Crisp white/cyan rim
      ctx.save();
      traceHorizon();
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(190, 210, 255, 0.9)";
      ctx.strokeStyle = `rgba(230, 240, 255, ${0.85 + Math.sin(time * 0.018) * 0.1})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // ── 4. Surface glow lines on planet face ──
      ctx.save();
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 4; i++) {
        const lineY = horizonPeakY + 20 + i * 18;
        const lineWidth = w * (0.5 - i * 0.08);
        const lineOpacity = 0.04 - i * 0.008 + Math.sin(time * 0.012 + i * 1.2) * 0.01;
        
        const lineGrad = ctx.createLinearGradient(
          planetCenterX - lineWidth / 2, lineY,
          planetCenterX + lineWidth / 2, lineY
        );
        lineGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        lineGrad.addColorStop(0.3, `rgba(80, 100, 220, ${lineOpacity})`);
        lineGrad.addColorStop(0.5, `rgba(100, 130, 255, ${lineOpacity * 1.5})`);
        lineGrad.addColorStop(0.7, `rgba(80, 100, 220, ${lineOpacity})`);
        lineGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = lineGrad;
        ctx.fillRect(
          planetCenterX - lineWidth / 2, lineY - 1.5,
          lineWidth, 3
        );
      }
      ctx.restore();

      // ── 5. Stars ──
      ctx.save();
      for (const star of stars) {
        const horizonAtStar = getHorizonY(star.x);
        if (star.y >= horizonAtStar - 40) continue;

        const twinkle = star.baseOpacity +
          Math.sin(time * star.twinkleSpeed + star.phase) * 0.3;
        const opacity = Math.max(0, Math.min(1, twinkle));

        // Soft glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 255, ${opacity * 0.12})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 240, 255, ${opacity})`;
        ctx.fill();
      }
      ctx.restore();

      // ── 6. Drifting aurora wisps ──
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 4; i++) {
        const wispX = w * (0.2 + i * 0.18) +
          Math.sin(time * 0.006 + i * 2.2) * w * 0.08;
        const wispY = horizonPeakY - 25 - i * 12 +
          Math.cos(time * 0.005 + i * 1.3) * 8;
        const wispR = w * (0.1 + i * 0.03);
        const wispOpacity = 0.025 + Math.sin(time * 0.008 + i * 1.8) * 0.012;

        const wispGrad = ctx.createRadialGradient(
          wispX, wispY, 0,
          wispX, wispY, wispR
        );
        wispGrad.addColorStop(0, `rgba(140, 120, 255, ${wispOpacity})`);
        wispGrad.addColorStop(0.5, `rgba(90, 70, 210, ${wispOpacity * 0.3})`);
        wispGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = wispGrad;
        ctx.fillRect(wispX - wispR, wispY - wispR, wispR * 2, wispR * 2);
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-10"
    />
  );
};

export default HeroArcAnimation;
