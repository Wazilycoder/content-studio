"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Simplex-like hash & noise functions
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.35;

  // Fluid multi-octave wave field
  float wave1 = sin(st.x * 2.8 + t * 0.8) * 0.14;
  float wave2 = cos(st.x * 4.5 - t * 0.6) * 0.09;
  float wave3 = sin((st.x + st.y) * 2.2 + t * 0.4) * 0.06;
  float combined = wave1 + wave2 + wave3;

  float n = noise(st * 3.2 + vec2(t * 0.15, -t * 0.1));
  float intensity = smoothstep(0.68, -0.05, st.y + combined + (n * 0.16 - 0.08));

  // High-craft Basalt OLED Palette:
  // Deep Basalt (#06080D) -> Cyber Mint (#00D492) -> Electric Cyan (#0EA5E9) -> Deep Violet (#6366F1)
  vec3 bg = vec3(0.024, 0.031, 0.047); // #06080D
  vec3 mint = vec3(0.0, 0.83, 0.57);   // #00D492
  vec3 cyan = vec3(0.05, 0.65, 0.95);  // #0EA5E9
  vec3 violet = vec3(0.39, 0.4, 0.95); // #6366F1

  // Color modulation across screen & time
  vec3 waveColor = mix(mint, cyan, sin(st.x * 2.2 + t) * 0.5 + 0.5);
  waveColor = mix(waveColor, violet, cos(st.y * 2.8 - t * 0.7) * 0.5 + 0.5);

  // Soft luminous bloom
  vec3 finalColor = mix(bg, waveColor, intensity * 0.72);

  // Optical radial vignette
  float dist = distance(st, vec2(0.5, 0.35));
  float vignette = smoothstep(1.1, 0.25, dist);
  finalColor *= vignette;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export function WebGLAuroraShader({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    // Helper: compile shader
    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Fullscreen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    let animId = 0;
    const startTime = performance.now();

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (resLoc) {
        gl.uniform2f(resLoc, canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseLoc && canvas) {
        gl.uniform2f(mouseLoc, e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      if (timeLoc) {
        gl.uniform1f(timeLoc, elapsed);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 -z-20 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full object-cover" />
    </div>
  );
}

