import { useEffect, useRef } from "react";

const Background = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Responsive setup
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Track mouse coordinates
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Premium Color Palette (matching Emporio's emerald-teal theme)
    const colors = [
      "rgba(16, 185, 129, 0.12)",  // Emerald
      "rgba(20, 184, 166, 0.10)",  // Teal
      "rgba(99, 102, 241, 0.06)",  // Indigo
      "rgba(5, 150, 105, 0.08)",   // Forest Green
    ];

    // Initialize large floating orbs
    const orbs = [
      { x: width * 0.25, y: height * 0.25, vx: 0.35, vy: 0.25, radius: 380, color: colors[0] },
      { x: width * 0.75, y: height * 0.35, vx: -0.25, vy: 0.35, radius: 420, color: colors[1] },
      { x: width * 0.5, y: height * 0.75, vx: 0.2, vy: -0.2, radius: 450, color: colors[2] },
      { x: width * 0.1, y: height * 0.8, vx: -0.3, vy: -0.15, radius: 360, color: colors[3] },
    ];

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const draw = () => {
      // 1. Solid background (dark gray-950)
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // Interpolate mouse coordinates for fluid, lagging spring effect
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // 2. Draw fine grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 72;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Update and draw floating gradient orbs
      orbs.forEach((orb) => {
        if (!motionQuery.matches) {
          // Normal floating movement
          orb.x += orb.vx;
          orb.y += orb.vy;

          // Boundary collision (with padding for seamless entry/exit)
          const pad = orb.radius * 0.5;
          if (orb.x < -pad || orb.x > width + pad) orb.vx *= -1;
          if (orb.y < -pad || orb.y > height + pad) orb.vy *= -1;

          // Mouse influence (gentle gravity attraction towards mouse)
          if (mouse.active) {
            const dx = mouse.x - orb.x;
            const dy = mouse.y - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 800) {
              const force = (800 - dist) * 0.00015;
              orb.x += (dx / dist) * force;
              orb.y += (dy / dist) * force;
            }
          }
        }

        // Draw radial glow
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(0.5, orb.color.replace(/[\d.]+\)$/, "0.04)"));
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Cursor spotlight halo removed per user request

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default Background;
