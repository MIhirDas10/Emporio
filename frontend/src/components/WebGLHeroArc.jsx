import React, { useEffect, useRef } from "react";

const WebGLHeroArc = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.warn("WebGL not supported");
      return;
    }

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_mouse_active;

      vec3 getColor(float x) {
        vec3 purple = vec3(0.55, 0.25, 0.95);
        vec3 indigo = vec3(0.18, 0.42, 0.92);
        vec3 teal = vec3(0.08, 0.75, 0.65);
        vec3 cyan = vec3(0.05, 0.78, 0.88);
        
        if (x < 0.3) {
          return mix(purple, indigo, x / 0.3);
        } else if (x < 0.5) {
          return mix(indigo, cyan, (x - 0.3) / 0.2);
        } else if (x < 0.7) {
          return mix(cyan, indigo, (x - 0.5) / 0.2);
        } else {
          return mix(indigo, purple, (x - 0.7) / 0.3);
        }
      }

      float hash(float n) { return fract(sin(n) * 43758.5453123); }
      float noise(float x) {
        float i = floor(x);
        float f = fract(x);
        float u = f * f * (3.0 - 2.0 * f);
        return mix(hash(i), hash(i + 1.0), u);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        
        // Original Quadratic Bezier Curve - Widen to fit the planet sides better
        float start_y = 0.32;
        float control_y = 1.10;
        float t = uv.x;
        float y_curve = (1.0 - t) * (1.0 - t) * start_y + 2.0 * (1.0 - t) * t * control_y + t * t * start_y;
        
        // Perpendicular normal to ensure uniform thickness and wave direction
        float dy_dt = 2.0 * (1.0 - 2.0 * t) * (control_y - start_y);
        float aspect = u_resolution.x / u_resolution.y;
        vec2 normal = normalize(vec2(-dy_dt / aspect, aspect));

        float mouseDist = distance(uv, u_mouse);
        float warpForce = 0.0;
        if (u_mouse_active > 0.5) {
          float influence = smoothstep(0.20, 0.0, mouseDist);
          warpForce = influence * 0.006 * sin(u_time * 5.0);
          y_curve += (u_mouse.y - y_curve) * influence * 0.15;
        }

        // Flowing animation traveling along the arc
        float flowTime = u_time * 2.2;
        
        // Remove the (1.0 - uv.x) * uv.x envelope so the animation flows ALL the way to the edges
        float n1 = noise(uv.x * 8.0 - flowTime * 0.8);
        float n2 = noise(uv.x * 20.0 - flowTime * 1.4);
        float waveOffset = (n1 * 0.6 + n2 * 0.4) * 0.005;

        // Project distance along the normal
        float dist_normal = dot(uv - vec2(uv.x, y_curve), normal) - waveOffset;

        // Keep all beams unified on the same offset so they don't split
        float dist1_r = abs(dist_normal - 0.0006 + warpForce);
        float dist1_g = abs(dist_normal + warpForce);
        float dist1_b = abs(dist_normal + 0.0006 - warpForce);
        
        float wave1_r = exp(-dist1_r * 220.0);
        float wave1_g = exp(-dist1_g * 220.0);
        float wave1_b = exp(-dist1_b * 220.0);
        
        // Electric pulses moving along the curve
        float intensity1 = 0.85 + 0.25 * sin(uv.x * 60.0 - flowTime * 4.5);
        
        float wave2 = exp(-abs(dist_normal) * 80.0);
        float intensity2 = 0.5 + 0.5 * noise(uv.x * 15.0 - flowTime * 1.1);
        float beam2Glow = wave2 * intensity2 * 0.6;
        
        float wave3 = exp(-abs(dist_normal) * 45.0);
        float beam3Glow = wave3 * 0.25;

        float edgeMask = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);

        float colorX = uv.x + sin(uv.x * 5.0 - flowTime * 0.2) * 0.03;
        vec3 baseColor = getColor(clamp(colorX, 0.0, 1.0));
        
        vec3 col = vec3(0.0);
        col.r = (wave1_r * intensity1 * 0.8 + beam2Glow + beam3Glow) * baseColor.r;
        col.g = (wave1_g * intensity1 * 0.8 + beam2Glow + beam3Glow) * baseColor.g;
        col.b = (wave1_b * intensity1 * 0.8 + beam2Glow + beam3Glow) * baseColor.b;
        
        col += vec3(0.9, 0.96, 1.0) * pow(wave1_g * intensity1 * 0.8, 4.0);
        
        if (u_mouse_active > 0.5) {
          float mouseGlow = exp(-mouseDist * 25.0) * 0.06;
          col += vec3(0.08, 0.75, 0.65) * mouseGlow;
        }
        
        float alpha = (wave1_g + wave2 * 0.6 + wave3 * 0.3) * edgeMask;
        gl_FragColor = vec4(col, clamp(alpha * 0.85, 0.0, 1.0));
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const mouseActiveLoc = gl.getUniformLocation(program, "u_mouse_active");

    let mouseX = 0.5;
    let mouseY = 0.5;
    let mouseActive = 0.0;

    const handleMouseMove = (e) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseActive = 1.0;
    };

    const handleMouseEnter = () => { mouseActive = 1.0; };
    const handleMouseLeave = () => { mouseActive = 0.0; };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    canvas.width = 1920;
    canvas.height = 1080;
    gl.viewport(0, 0, 1920, 1080);

    let animationId;
    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      gl.uniform2f(resolutionLoc, 1920.0, 1080.0);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(mouseLoc, mouseX, mouseY);
      gl.uniform1f(mouseActiveLoc, mouseActive);

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-20"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default WebGLHeroArc;
