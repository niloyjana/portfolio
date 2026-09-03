'use client';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { isMobile } from 'react-device-detect';
import { useScrollStore, useThemeStore, usePortalStore } from '@stores';

// ─── GLSL Shaders ─────────────────────────────────────────────────────────────

const VERT = /* glsl */`
  attribute float aIndex;
  attribute float aSize;
  uniform   float uTime;
  varying   float vIndex;

  void main() {
    vIndex = aIndex;

    // Subtle GSAP-driven floating drift
    vec3 pos = position;
    pos.y += sin(uTime * 0.5  + position.x * 0.009) * 5.0;
    pos.x += cos(uTime * 0.35 + position.z * 0.007) * 4.0;
    pos.z += sin(uTime * 0.25 + position.y * 0.006) * 3.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Distance-based sizing: farther = smaller, closer = larger
    float pSize = aSize * (300.0 / -mvPosition.z);
    gl_PointSize = min(max(pSize, 0.0), 300.0); // cap max size
    gl_Position  = projectionMatrix * mvPosition;
  }
`;

const FRAG = /* glsl */`
  uniform sampler2D uAtlas;   // texture atlas  (COLS × ROWS grid)
  uniform float     uCols;
  uniform float     uRows;
  uniform float     uOpacity;
  varying float     vIndex;

  void main() {
    float col = mod(vIndex, uCols);
    float row = floor(vIndex / uCols);

    // Map gl_PointCoord into the correct atlas cell
    vec2 uv = vec2(
      (col + gl_PointCoord.x)         / uCols,
      1.0 - (row + gl_PointCoord.y)   / uRows   // flip Y
    );

    vec4 tex = texture2D(uAtlas, uv);
    if (tex.a < 0.01) discard;

    gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
  }
`;

// ─── Atlas builder ─────────────────────────────────────────────────────────────
const ATLAS_COLS = 10;
const ATLAS_ROWS = 10;
const CELL       = 256;   // px per cell

const PALETTES = [
  ['#1a1a2e','#e94560'],['#0f3460','#16213e'],['#162032','#4fc3f7'],
  ['#1b262c','#a8dadc'],['#0d1b2a','#457b9d'],['#1e1e2e','#cba6f7'],
  ['#12172b','#89dceb'],['#1e3a5f','#f9c74f'],['#1a1a1a','#e0aaff'],
  ['#0a0a1a','#80ffdb'],
];

function buildAtlas(): THREE.CanvasTexture {
  const W  = ATLAS_COLS * CELL;
  const H  = ATLAS_ROWS * CELL;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d')!;

  for (let row = 0; row < ATLAS_ROWS; row++) {
    for (let col = 0; col < ATLAS_COLS; col++) {
      const idx = row * ATLAS_COLS + col;
      const [bg, accent] = PALETTES[idx % PALETTES.length];
      const x = col * CELL, y = row * CELL;

      // Background
      ctx.fillStyle = bg;
      ctx.fillRect(x, y, CELL, CELL);

      // Accent border
      ctx.strokeStyle = accent + '55';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 4, y + 4, CELL - 8, CELL - 8);

      // Inner accent line
      ctx.strokeStyle = accent + '33';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 14, y + 14, CELL - 28, CELL - 28);

      // Placeholder image icon
      ctx.strokeStyle = accent + '66';
      ctx.lineWidth   = 2;
      const ix = x + CELL * 0.35, iy = y + CELL * 0.3;
      const iw = CELL * 0.3,      ih = CELL * 0.25;
      ctx.strokeRect(ix, iy, iw, ih);
      // Mountains
      ctx.beginPath();
      ctx.moveTo(ix,        iy + ih);
      ctx.lineTo(ix + iw * 0.35, iy + ih * 0.4);
      ctx.lineTo(ix + iw * 0.6,  iy + ih * 0.65);
      ctx.lineTo(ix + iw * 0.75, iy + ih * 0.45);
      ctx.lineTo(ix + iw,   iy + ih);
      ctx.closePath();
      ctx.fillStyle = accent + '33';
      ctx.fill();

      // Index label
      ctx.fillStyle  = accent + 'aa';
      ctx.font       = `bold ${CELL * 0.1}px "Inter",sans-serif`;
      ctx.textAlign  = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(idx + 1).padStart(2,'0'), x + CELL / 2, y + CELL - 12);
    }
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return tex;
}

// ─── Component ────────────────────────────────────────────────────────────────
const N = 100;

const UniverseCanvas = () => {
  const scrollProgress = useScrollStore(s => s.scrollProgress);
  const themeColor     = useThemeStore(s => s.theme.color);
  const activePortalId = usePortalStore(s => s.activePortalId);

  // Reveal after skills section (scroll > 0.98)
  const fadeIn  = Math.max(0, Math.min(1, (scrollProgress - 0.98) / 0.015));
  const opacity = activePortalId ? 0 : fadeIn;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<{
    renderer  : THREE.WebGLRenderer;
    scene     : THREE.Scene;
    camera    : THREE.PerspectiveCamera;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controls  : any;
    material  : THREE.ShaderMaterial;
    gsapTicker: gsap.core.Tween;
    rafId     : number;
    cleanup   : () => void;
  } | null>(null);

  // ── Build Three.js scene once ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stateRef.current) return;

    let isMounted = true;

    // Renderer (transparent so site bg shows through when opacity < 1)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const initW = isMobile ? window.innerWidth : window.innerWidth - 32;
    const initH = isMobile ? window.innerHeight : window.innerHeight - 32;
    renderer.setSize(initW, initH);
    renderer.setClearColor(0x000000, 0);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 1, 3000
    );
    camera.position.set(0, 0, 700);

    // Texture atlas
    const atlas = buildAtlas();

    // Geometry — random 3D positions
    const positions  = new Float32Array(N * 3);
    const indices    = new Float32Array(N);
    const sizes      = new Float32Array(N);
    const baseZ      = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 1400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 900;
      // Start z evenly distributed between 700 and -1300 (camera is at 700)
      const z = 700 - Math.random() * 2000;
      positions[i * 3 + 2] = z;
      baseZ[i]             = z;

      indices[i] = Math.floor(Math.random() * (ATLAS_COLS * ATLAS_ROWS));
      sizes[i]   = 40 + Math.random() * 120;  // base point size
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aIndex',   new THREE.BufferAttribute(indices,   1));
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,     1));

    // Shader material
    const material = new THREE.ShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      uniforms: {
        uAtlas:   { value: atlas },
        uCols:    { value: ATLAS_COLS },
        uRows:    { value: ATLAS_ROWS },
        uTime:    { value: 0 },
        uOpacity: { value: 1 },
      },
      transparent: true,
      depthWrite:  false,
    });

    const points = new THREE.Points(geo, material);
    scene.add(points);

    // Dynamic flight variables
    let flightDistance = 0;
    let targetFlightDistance = 0;

    // Handle scroll wheel manually for infinite flight
    const onWheel = (e: WheelEvent) => {
      if (targetFlightDistance <= 0 && e.deltaY < 0) {
        // Scrolled all the way back -> pass up to page scroll
        const scrollEl = useScrollStore.getState().scrollEl;
        if (scrollEl) {
          scrollEl.scrollTop += e.deltaY; // use exact delta
        } else {
          window.scrollBy(0, e.deltaY);
        }
      } else {
        // Fly forward or backward
        e.preventDefault();
        e.stopPropagation();
        
        // Use a much higher multiplier when scrolling backwards (up)
        // so the user can easily get back without endless scrolling, 
        // but it doesn't instantly snap and cause visual aliasing.
        let multiplier = e.deltaY < 0 ? 15 : 1.5;
        let delta = e.deltaY * multiplier;

        targetFlightDistance += delta;
        targetFlightDistance = Math.max(0, targetFlightDistance);
      }
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // OrbitControls (dynamic import — SSR safe)
    import('three/addons/controls/OrbitControls.js').then(({ OrbitControls }) => {
      if (!isMounted) return;
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom    = false; // We handle zoom manually for infinite flight
      controls.enablePan     = true;
      controls.enableRotate  = true;
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.rotateSpeed   = 0.5;
      controls.panSpeed      = 0.8;

      // GSAP ticker → drives uTime for floating animation
      const gsapTicker = gsap.to(material.uniforms.uTime, {
        value: Math.PI * 200,
        duration: 600,
        ease: 'none',
        repeat: -1,
      });

      // Render loop
      let rafId = 0;
      const animate = () => {
        rafId = requestAnimationFrame(animate);
        controls.update();

        // Smoothly interpolate flight distance
        flightDistance += (targetFlightDistance - flightDistance) * 0.08;

        // Wrap particles to create infinite universe effect
        const posAttr = geo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < N; i++) {
          // Current absolute z position
          let z = baseZ[i] + flightDistance;
          
          // Wrap between +700 (camera) and -1300 (far away)
          // Relative to camera at 700: range is 2000 units.
          // z - 700 goes from 0 to -2000.
          let relZ = z - 700;
          relZ = ((relZ % 2000) + 2000) % 2000; // positive modulo
          if (relZ > 0) relZ -= 2000;
          
          posAttr.setZ(i, 700 + relZ);
        }
        posAttr.needsUpdate = true;

        renderer.render(scene, camera);
      };
      animate();

      // Resize
      const onResize = () => {
        const w = isMobile ? window.innerWidth : window.innerWidth - 32;
        const h = isMobile ? window.innerHeight : window.innerHeight - 32;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);
      onResize(); // Call initially to set exact correct size

      // Cleanup
      const cleanup = () => {
        isMounted = false;
        canvas.removeEventListener('wheel', onWheel);
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(rafId);
        gsapTicker.kill();
        controls.dispose();
        geo.dispose();
        material.dispose();
        atlas.dispose();
        renderer.dispose();
        stateRef.current = null;
      };

      stateRef.current = {
        renderer, scene, camera, controls, material,
        gsapTicker, rafId, cleanup,
      };
    });

    return () => {
      stateRef.current?.cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync renderer background with theme
  useEffect(() => {
    if (!stateRef.current) return;
    // Make WebGL transparent so the base canvas shows through
    stateRef.current.renderer.setClearColor(new THREE.Color(themeColor), 0);
  }, [themeColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        ...(!isMobile && {
          top: '1rem',
          left: '1rem',
          width: 'calc(100% - 2rem)',
          height: 'calc(100% - 2rem)',
        }),
        // Sits above R3F canvas (z-index ~1) but below Skills overlay (z-index 10)
        zIndex: 5,
        opacity,
        transition: 'opacity 0.5s ease',
        display: 'block',
        // Pointer events ON so OrbitControls captures drag/scroll
        pointerEvents: opacity > 0.05 ? 'auto' : 'none',
      }}
    />
  );
};

export default UniverseCanvas;
