import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GuardrailCore3DProps {
  statusText?: string;
  isEnforcing?: boolean;
}

export const GuardrailCore3D: React.FC<GuardrailCore3DProps> = ({
  statusText = 'AI ALIGNMENT STATE: ACTIVE',
  isEnforcing = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for Core Objects
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Geometric Icosahedron (The AI Reasoning Core)
    const icoGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF3D00,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    coreGroup.add(icoMesh);

    // 2. Inner Solid Core
    const innerGeo = new THREE.OctahedronGeometry(0.8, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00FF41,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 3. Outer Alignment Rings (Torus Wireframes)
    const torusGeo1 = new THREE.TorusGeometry(2.3, 0.02, 16, 64);
    const torusMat1 = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const ring1 = new THREE.Mesh(torusGeo1, torusMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const torusGeo2 = new THREE.TorusGeometry(2.6, 0.02, 16, 64);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0x00FF41,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const ring2 = new THREE.Mesh(torusGeo2, torusMat2);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // 4. Floating Satellite Nodes (The 6 pillars)
    const satelliteGroup = new THREE.Group();
    const satCount = 6;
    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2;
      const x = Math.cos(angle) * 3.2;
      const y = Math.sin(angle) * 3.2;
      const satGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
      const satMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xFF3D00 : 0x00FF41
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.position.set(x, y, 0);
      satelliteGroup.add(sat);
    }
    coreGroup.add(satelliteGroup);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      icoMesh.rotation.x += 0.004;
      icoMesh.rotation.y += 0.007;

      innerMesh.rotation.x -= 0.008;
      innerMesh.rotation.z += 0.006;

      ring1.rotation.z += 0.003;
      ring2.rotation.x -= 0.003;

      satelliteGroup.rotation.z += 0.005;

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] bg-[#0E0E0E] border border-[#222] overflow-hidden flex flex-col justify-between p-4">
      {/* 2D Geometric SVG Crosshairs and Mask Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 800 400" preserveAspectRatio="none">
        <path d="M400 0 V400 M0 200 H800" stroke="#FFF" strokeWidth="0.5" />
        <circle cx="400" cy="200" r="140" stroke="#00FF41" strokeWidth="0.5" strokeDasharray="4 4" fill="none" />
        <circle cx="400" cy="200" r="180" stroke="#FFF" strokeWidth="0.5" strokeDasharray="2 6" fill="none" />
        <rect x="330" y="130" width="140" height="140" stroke="#FF3D00" strokeWidth="0.5" fill="none" transform="rotate(45 400 200)" />
      </svg>

      {/* Top Header Information */}
      <div className="flex items-center justify-between z-10 text-[10px] mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00FF41]" />
          <span className="font-bold text-white tracking-widest">{statusText}</span>
        </div>
        <div className="flex items-center gap-2 text-[#888]">
          <span>TRUST COEFFICIENT:</span>
          <span className="text-[#00FF41] font-bold">0.99984</span>
        </div>
      </div>

      {/* 3D Canvas Anchor */}
      <div ref={mountRef} className="absolute inset-0 z-0 flex items-center justify-center" />

      {/* Bottom Telemetry Floating Badges */}
      <div className="flex items-center justify-between z-10 text-[9px] mono text-[#888] pt-2 border-t border-[#222]">
        <div className="flex items-center gap-3">
          <span>ALIGNMENT_PERIMETER: <strong className="text-white">STABLE</strong></span>
          <span className="text-[#444]">|</span>
          <span>MODEL_DRIFT: <strong className="text-[#00FF41]">0.0001%</strong></span>
        </div>
        <div>
          <span>RECONCILIATION: <strong className="text-white">100% IDEMPOTENT</strong></span>
        </div>
      </div>
    </div>
  );
};
