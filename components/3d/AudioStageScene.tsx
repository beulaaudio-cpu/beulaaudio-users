"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { updateCameraForProgress } from "./CameraScrollRig";

export interface AudioStageSceneProps {
  scrollProgress: number; // 0.0 to 1.0
  activeCategory?: "dj" | "instrument" | "custom";
  activePackageIndex?: number;
  className?: string;
}

export function AudioStageScene({
  scrollProgress,
  activeCategory,
  activePackageIndex = 0,
  className = "fixed inset-0 z-0 pointer-events-none",
}: AudioStageSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    let isDisposed = false;
    let animationFrameId: number;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040407);
    scene.fog = new THREE.FogExp2(0x040407, 0.038);

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 8.6);
    const lookAtTarget = new THREE.Vector3(0, 0.5, -2.0);
    camera.lookAt(lookAtTarget);

    // 3. Renderer setup
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn("Could not create WebGLRenderer:", err);
      setWebGlSupported(false);
      return;
    }

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0c0e18, 0.9);
    scene.add(ambientLight);

    // Stage Front Spotlight
    const frontSpot = new THREE.SpotLight(0xfff1dc, 3.5, 30, 0.65, 0.5);
    frontSpot.position.set(0, 7, 5);
    frontSpot.castShadow = true;
    scene.add(frontSpot);

    // Side Color Fixtures
    const leftBlueSpot = new THREE.SpotLight(0x3b82f6, 3.0, 24, 0.7, 0.5);
    leftBlueSpot.position.set(-7, 6, -1);
    scene.add(leftBlueSpot);

    const rightAmberSpot = new THREE.SpotLight(0xf59e0b, 3.2, 24, 0.7, 0.5);
    rightAmberSpot.position.set(7, 6, -1);
    scene.add(rightAmberSpot);

    // Logo Pin-Spot Light (points directly at center backdrop logo)
    const logoSpot = new THREE.SpotLight(0xffedd5, 4.2, 18, 0.45, 0.3);
    logoSpot.position.set(0, 4.5, -3.5);
    logoSpot.target.position.set(0, 1.2, -6.8);
    scene.add(logoSpot);
    scene.add(logoSpot.target);

    // Stage Deck Floor
    const stageFloorGeo = new THREE.BoxGeometry(22, 0.6, 12);
    const stageFloorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0b12,
      roughness: 0.7,
      metalness: 0.25,
    });
    const stageDeck = new THREE.Mesh(stageFloorGeo, stageFloorMat);
    stageDeck.position.set(0, -2.1, -2.5);
    stageDeck.receiveShadow = true;
    scene.add(stageDeck);

    // Metallic Front Edge Trim
    const trimGeo = new THREE.BoxGeometry(22.2, 0.12, 0.15);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x78350f,
      emissiveIntensity: 0.3,
    });
    const frontTrim = new THREE.Mesh(trimGeo, trimMat);
    frontTrim.position.set(0, -1.8, 3.5);
    scene.add(frontTrim);

    // Rear Stage Backdrop Wall
    const backdropGeo = new THREE.BoxGeometry(26, 12, 0.5);
    const backdropMat = new THREE.MeshStandardMaterial({
      color: 0x05060b,
      roughness: 0.9,
      metalness: 0.1,
    });
    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    backdrop.position.set(0, 3.2, -7.0);
    scene.add(backdrop);

    // CENTER STAGE WALL: BEULA AUDIO LOGO & BRAND TEXT
    // 1. Center Emblem Plaque with Logo Texture
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load("/Logo/BeulaAudio-BlackBG.jpg");
    logoTexture.colorSpace = THREE.SRGBColorSpace;

    const logoEmblemGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.08, 48);
    logoEmblemGeo.rotateX(Math.PI / 2);
    const logoEmblemMat = new THREE.MeshStandardMaterial({
      map: logoTexture,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0x332211,
      emissiveIntensity: 0.5,
    });
    const logoEmblem = new THREE.Mesh(logoEmblemGeo, logoEmblemMat);
    logoEmblem.position.set(0, 1.4, -6.65);
    scene.add(logoEmblem);

    // Glowing Gold Ring Frame around Logo
    const goldRingGeo = new THREE.TorusGeometry(1.35, 0.05, 16, 64);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.position.set(0, 1.4, -6.62);
    scene.add(goldRing);

    // 2. High-Resolution Dynamic Canvas for "Beula Audio" Text Plaque on Stage Wall
    const textCanvas = document.createElement("canvas");
    textCanvas.width = 1024;
    textCanvas.height = 256;
    const ctx = textCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 1024, 256);
      // Gold gradient text fill
      const grad = ctx.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, "#fde68a");
      grad.addColorStop(0.5, "#fbbf24");
      grad.addColorStop(1, "#f59e0b");

      ctx.font = "bold 92px 'Cinzel', serif, Georgia";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = grad;
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 25;
      ctx.fillText("BEULA AUDIO", 512, 128);
    }
    const textTexture = new THREE.CanvasTexture(textCanvas);
    const textGeo = new THREE.PlaneGeometry(3.6, 0.9);
    const textMat = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.set(0, -0.25, -6.65);
    scene.add(textMesh);

    // OVERHEAD TRUSS STRUCTURE
    const trussMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      metalness: 0.85,
      roughness: 0.3,
    });

    // Horizontal Top Truss
    const topTruss = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 0.4), trussMat);
    topTruss.position.set(0, 4.8, -3.2);
    scene.add(topTruss);

    // Mid Rear Truss
    const rearTruss = new THREE.Mesh(new THREE.BoxGeometry(20, 0.35, 0.35), trussMat);
    rearTruss.position.set(0, 5.2, -5.5);
    scene.add(rearTruss);

    // Side Truss Pillars
    const leftTrussPillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7.2, 0.4), trussMat);
    leftTrussPillar.position.set(-9.5, 1.4, -3.2);
    scene.add(leftTrussPillar);

    const rightTrussPillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7.2, 0.4), trussMat);
    rightTrussPillar.position.set(9.5, 1.4, -3.2);
    scene.add(rightTrussPillar);

    // DUAL SPEAKER STACKS (VRX LINE-ARRAY + DUAL SUBWOOFERS)
    const cabMat = new THREE.MeshStandardMaterial({
      color: 0x11131a,
      roughness: 0.75,
      metalness: 0.25,
    });
    const grilleMat = new THREE.MeshStandardMaterial({
      color: 0x1c1e28,
      roughness: 0.5,
      metalness: 0.6,
    });
    const wooferMat = new THREE.MeshStandardMaterial({
      color: 0x090a0f,
      roughness: 0.4,
      metalness: 0.4,
    });

    [-5.8, 5.8].forEach((xPos) => {
      // Subwoofer 1 (Bottom 18" Bass)
      const sub1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.05, 1.3), cabMat);
      sub1.position.set(xPos, -1.3, -1.8);
      scene.add(sub1);
      // Front Grille & Cone 1
      const g1 = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), grilleMat);
      g1.position.set(xPos, -1.3, -1.14);
      scene.add(g1);
      const cone1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.1, 0.12, 24), wooferMat);
      cone1.rotateX(Math.PI / 2);
      cone1.position.set(xPos, -1.3, -1.1);
      scene.add(cone1);

      // Subwoofer 2 (Stacked 18" Bass)
      const sub2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.05, 1.3), cabMat);
      sub2.position.set(xPos, -0.2, -1.8);
      scene.add(sub2);
      const g2 = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), grilleMat);
      g2.position.set(xPos, -0.2, -1.14);
      scene.add(g2);
      const cone2 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.1, 0.12, 24), wooferMat);
      cone2.rotateX(Math.PI / 2);
      cone2.position.set(xPos, -0.2, -1.1);
      scene.add(cone2);

      // VRX 932 Line Array Modules (Curved 3-tier array)
      [0.9, 1.45, 2.0].forEach((vrxY, vIdx) => {
        const vrx = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.45, 0.8), cabMat);
        vrx.position.set(xPos, vrxY, -1.8 + vIdx * 0.08);
        vrx.rotation.x = 0.08 * (vIdx + 1); // Curve array downward
        vrx.rotation.y = xPos > 0 ? -0.15 : 0.15; // Angle inward toward audience
        scene.add(vrx);

        // Acoustic Waveguide Horn
        const horn = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 0.05), grilleMat);
        horn.position.set(xPos, vrxY, -1.38 + vIdx * 0.08);
        horn.rotation.x = 0.08 * (vIdx + 1);
        horn.rotation.y = xPos > 0 ? -0.15 : 0.15;
        scene.add(horn);
      });
    });

    // DJ HONEYCOMB BOOTH & CONSOLE
    // 1. Glowing Hexagonal Honeycomb Rig
    const honeyMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
    });
    const honeycombGroup = new THREE.Group();

    // Array of interconnected hexagonal rings forming the DJ facade & backdrop
    const hexCoords = [
      [-1.8, 2.4, -4.6],
      [0, 2.8, -4.6],
      [1.8, 2.4, -4.6],
      [-0.9, 1.8, -4.6],
      [0.9, 1.8, -4.6],
      [-1.4, -0.8, -1.1],
      [0, -0.8, -1.1],
      [1.4, -0.8, -1.1],
    ];

    hexCoords.forEach(([hx, hy, hz]) => {
      const hex = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.045, 8, 6), honeyMat);
      hex.position.set(hx, hy, hz);
      hex.rotation.z = Math.PI / 6;
      honeycombGroup.add(hex);
    });
    scene.add(honeycombGroup);

    // 2. DJ Booth Table & Front Facade
    const djTable = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.95, 1.1),
      new THREE.MeshStandardMaterial({
        color: 0x0a0c12,
        roughness: 0.8,
        metalness: 0.4,
      })
    );
    djTable.position.set(0, -1.3, -1.8);
    scene.add(djTable);

    // DJ Front Shield Mask with subtle amber ambient light
    const frontMask = new THREE.Mesh(
      new THREE.PlaneGeometry(3.1, 0.85),
      new THREE.MeshStandardMaterial({
        color: 0x13151f,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x271e0c,
      })
    );
    frontMask.position.set(0, -1.3, -1.24);
    scene.add(frontMask);

    // 3. DJ Equipment on Desk: Dual CDJ Players & Mixer
    // CDJ Left & Right
    [-0.8, 0.8].forEach((cdjX) => {
      // CDJ Base
      const cdj = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.1, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x1f2330, roughness: 0.6 })
      );
      cdj.position.set(cdjX, -0.78, -1.75);
      scene.add(cdj);

      // Jog Wheel (Cylinder)
      const jog = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.03, 32),
        new THREE.MeshStandardMaterial({
          color: 0x0d0e14,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0x0284c7,
          emissiveIntensity: 0.4,
        })
      );
      jog.position.set(cdjX, -0.72, -1.75);
      scene.add(jog);
    });

    // DJ Mixer (Center)
    const mixer = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.11, 0.68),
      new THREE.MeshStandardMaterial({
        color: 0x161822,
        roughness: 0.5,
        metalness: 0.5,
      })
    );
    mixer.position.set(0, -0.78, -1.75);
    scene.add(mixer);

    // Stage Floor Wedge Monitors (Foldback speakers)
    const wedgeMat = new THREE.MeshStandardMaterial({ color: 0x13151f, roughness: 0.8 });
    [-2.2, 2.2].forEach((wX) => {
      const wedge = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.4, 0.5), wedgeMat);
      wedge.position.set(wX, -1.6, 0.2);
      wedge.rotation.x = -Math.PI / 4;
      wedge.rotation.y = wX > 0 ? -0.2 : 0.2;
      scene.add(wedge);
    });

    // MOVING HEAD LIGHTS (Mounted on Overhead Truss)
    const movingHeadGroup = new THREE.Group();
    const movingHeads: {
      headMesh: THREE.Mesh;
      lightCone: THREE.Mesh;
      baseX: number;
    }[] = [];

    const movingHeadMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c26,
      metalness: 0.9,
      roughness: 0.2,
    });
    const lensEmissiveMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    [-6.5, -2.8, 2.8, 6.5].forEach((mhX, mIdx) => {
      // Fixture Base (clamped to truss)
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.2, 16), movingHeadMat);
      base.position.set(mhX, 4.65, -3.2);
      movingHeadGroup.add(base);

      // Rotating Yoke & Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), movingHeadMat);
      head.position.set(mhX, 4.35, -3.2);

      // Lens Ring
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), lensEmissiveMat);
      lens.position.set(0, 0, 0.22);
      head.add(lens);

      // Volumetric Light Cone
      const coneGeo = new THREE.ConeGeometry(0.9, 7.0, 16, 1, true);
      coneGeo.translate(0, -3.5, 0);
      coneGeo.rotateX(Math.PI / 2);
      const coneMat = new THREE.MeshBasicMaterial({
        color: mIdx % 2 === 0 ? 0x06b6d4 : 0xf59e0b,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(0, 0, 0.25);
      head.add(cone);

      movingHeadGroup.add(head);
      movingHeads.push({ headMesh: head, lightCone: cone, baseX: mhX });
    });
    scene.add(movingHeadGroup);

    // PARCAN LIGHTS (Warm ambient stage cans)
    const parcanGroup = new THREE.Group();
    [-4.6, -1.0, 1.0, 4.6].forEach((pX) => {
      const parCan = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 0.35, 16),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
      );
      parCan.position.set(pX, 4.65, -3.2);
      parCan.rotation.x = Math.PI / 5;
      parcanGroup.add(parCan);
    });
    scene.add(parcanGroup);

    // LASER LIGHT BEAMS
    const laserGroup = new THREE.Group();
    const laserBeams: THREE.Line[] = [];
    const laserColors = [0x00ffcc, 0xff0055, 0x00e5ff, 0xffaa00];

    [-4.0, -1.5, 1.5, 4.0].forEach((lzX, lIdx) => {
      const lineMat = new THREE.LineBasicMaterial({
        color: laserColors[lIdx % laserColors.length],
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const points = [
        new THREE.Vector3(lzX, 4.8, -3.2),
        new THREE.Vector3(lzX * 1.8, -2.0, 5.0),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const laserLine = new THREE.Line(lineGeo, lineMat);
      laserGroup.add(laserLine);
      laserBeams.push(laserLine);
    });
    scene.add(laserGroup);

    // SMOKE & HAZE PARTICLES
    const smokeCount = 280;
    const smokePos = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount; i++) {
      smokePos[i * 3 + 0] = (Math.random() - 0.5) * 22;
      smokePos[i * 3 + 1] = Math.random() * 5.5 - 1.8;
      smokePos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1.5;
    }
    const smokeGeo = new THREE.BufferGeometry();
    smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.07,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smokeParticles);

    setIsLoaded(true);

    // 5. Resize listener
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 6. Render & Animation loop
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let targetScroll = 0;

    const animate = (time: number) => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      // Interpolate progress smoothly
      const currentProgress = (container as any).__currentScrollProgress || 0;
      targetScroll += (currentProgress - targetScroll) * 0.08;

      if (!prefersReducedMotion) {
        // Move camera closer to every item on stage on scroll down, and reverse on scroll up
        updateCameraForProgress(camera, targetScroll, lookAtTarget, 0.08);

        const t = time * 0.001;

        // Animate Moving Head Lights (Pan & Tilt)
        movingHeads.forEach((mh, idx) => {
          const offset = idx * 1.2;
          mh.headMesh.rotation.y = Math.sin(t * 1.6 + offset) * 0.45;
          mh.headMesh.rotation.x = Math.PI / 4 + Math.cos(t * 1.8 + offset) * 0.25;
        });

        // Animate Lasers Sweeping Across Arena
        laserBeams.forEach((lz, idx) => {
          const positions = lz.geometry.attributes.position.array as Float32Array;
          const sweep = Math.sin(t * 2.2 + idx * 1.5) * 3.5;
          positions[3] = (idx - 1.5) * 4.0 + sweep;
          lz.geometry.attributes.position.needsUpdate = true;
        });

        // Animate Smoke Drift
        const sPositions = smokeGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < smokeCount; i++) {
          sPositions[i * 3 + 1] += 0.004; // subtle rise
          sPositions[i * 3 + 0] += Math.sin(t + i) * 0.003; // gentle drift
          if (sPositions[i * 3 + 1] > 4.5) {
            sPositions[i * 3 + 1] = -1.9;
          }
        }
        smokeGeo.attributes.position.needsUpdate = true;

        // Dynamic Stage Lights Pulsation
        frontSpot.intensity = 3.2 + Math.sin(t * 1.4) * 0.5;
        logoSpot.intensity = 4.0 + Math.cos(t * 2.0) * 0.4;
        leftBlueSpot.position.x = -7 + Math.sin(t * 0.9) * 1.8;
        rightAmberSpot.position.x = 7 - Math.cos(t * 0.9) * 1.8;

        // Honeycomb subtle breathing glow
        honeyMat.opacity = 0.75 + Math.sin(t * 2.5) * 0.2;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      // Clean disposal
      stageFloorGeo.dispose();
      stageFloorMat.dispose();
      backdropGeo.dispose();
      backdropMat.dispose();
      logoEmblemGeo.dispose();
      logoEmblemMat.dispose();
      textGeo.dispose();
      textMat.dispose();
      smokeGeo.dispose();
      smokeMat.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  // Update scroll ref for loop access
  useEffect(() => {
    if (containerRef.current) {
      (containerRef.current as any).__currentScrollProgress = scrollProgress;
    }
  }, [scrollProgress]);

  if (!webGlSupported) {
    return (
      <div className="fixed inset-0 z-0 bg-[#040407] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-amber-900/10 to-[#040407]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    />
  );
}

export default AudioStageScene;
