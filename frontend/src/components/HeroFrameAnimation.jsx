import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 40;
const FRAME_DURATION = 120; // ms per frame (~8.3 fps for a slower, smoother cinematic feel)

// Pre-generate frame paths with cache busting
const CACHE_BUSTER = 123456789; // Hardcoded to force refresh
const framePaths = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/hero-frames/frame-${String(i + 1).padStart(3, "0")}.webp?v=${CACHE_BUSTER}`
);

const HeroFrameAnimation = () => {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const directionRef = useRef(1); // 1 for forward, -1 for backward
  const animationRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Preload all frames
  useEffect(() => {
    let cancelled = false;
    const images = [];
    let loadedCount = 0;

    framePaths.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES && !cancelled) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      images[i] = img;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Resize canvas to match container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }, []);

  // Animation loop
  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastTime = 0;

    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed >= FRAME_DURATION) {
        lastTime = timestamp - (elapsed % FRAME_DURATION);
        
        // Ping-pong loop logic
        if (directionRef.current === 1) {
          if (frameIndexRef.current >= TOTAL_FRAMES - 1) {
            directionRef.current = -1;
            frameIndexRef.current--;
          } else {
            frameIndexRef.current++;
          }
        } else {
          if (frameIndexRef.current <= 0) {
            directionRef.current = 1;
            frameIndexRef.current++;
          } else {
            frameIndexRef.current--;
          }
        }
      }

      const img = imagesRef.current[frameIndexRef.current];
      if (img) {
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        // Draw image to cover the canvas (object-fit: cover behavior)
        const imgAspect = img.width / img.height;
        const canvasAspect = w / h;
        let drawW, drawH, drawX, drawY;

        if (canvasAspect > imgAspect) {
          drawW = w;
          drawH = w / imgAspect;
          drawX = 0;
          drawY = (h - drawH) / 2;
        } else {
          drawH = h;
          drawW = h * imgAspect;
          drawX = (w - drawW) / 2;
          drawY = 0;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [loaded, resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-10"
      style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}
    />
  );
};

export default HeroFrameAnimation;
