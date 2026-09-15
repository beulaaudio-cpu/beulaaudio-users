"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

interface HeroStage3DProps {
  className?: string;
  /** Called once the GLB has fully loaded and rendered its first frame */
  onLoaded?: () => void;
  /** When false (scrolled out of home section), WebGL loop and animations pause to eliminate lag */
  isActive?: boolean;
}

export function HeroStage3D({ className = "w-full h-full", onLoaded, isActive = true }: HeroStage3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const activeRef = useRef(isActive);

  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    let animationFrameId: number;
    let isVisible = true;

    // ─── 1. Scene ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // ─── 2. Camera & Right-Biased Placement ────────────────────────────────────
    const width  = container.clientWidth  || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobileOrTablet = width < 1024;

    // Shift model & camera focal point to the right on desktop screens
    const stageOffsetX = isMobileOrTablet ? 0.6 : 3.8;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    const defaultCamPos = new THREE.Vector3(
      stageOffsetX,
      isMobileOrTablet ? 2.6 : 2.7,
      isMobileOrTablet ? 11.5 : 10.2
    );

    camera.position.copy(defaultCamPos);
    const cameraTarget = new THREE.Vector3(stageOffsetX, 2.3, 0.0);
    camera.lookAt(cameraTarget);

    // ─── 3. Renderer — performance tuned ────────────────────────────────────
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,               // Off for perf — saves massive GPU overhead
        alpha: false,
        powerPreference: "high-performance",
        precision: "mediump",           // Lower precision saves GPU bandwidth
      });
      renderer.setSize(width, height);
      // Cap at 1.5× — eliminates the biggest perf drain on Retina/4K displays
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.10;
      renderer.shadowMap.enabled = false;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn("WebGLRenderer failed:", err);
      return;
    }

    // ─── 4. Load GLB ──────────────────────────────────────────────────────────
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    dracoLoader.preload();

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      "/3dmodel/beula-audio-dj-instrument-bg.glb",
      (gltf) => {
        if (isDisposed) return;

        const model = gltf.scene;

        model.traverse((child) => {
          if ((child as THREE.Light).isLight) {
            const light = child as THREE.Light;
            light.intensity = light.intensity / 400;
          }

          if (
            child.name === "concert-stage.main.final.001" ||
            child.name === "concert-stage.main.final" ||
            child.name === "concert-stage.main.final__0"
          ) {
            child.visible = false;
          }

          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            // Freeze matrix for static meshes to skip per-frame matrix math
            if (!gltf.animations?.length) mesh.matrixAutoUpdate = false;
          }
        });

        model.position.set(stageOffsetX, 0, 0);
        modelRef = model;
        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
          });
        }

        setIsLoaded(true);
        onLoaded?.();
      },
      undefined,
      (err) => {
        console.error("GLB load error:", err);
        setIsLoaded(true);
        onLoaded?.();
      }
    );

    let modelRef: THREE.Group | null = null;

    // ─── 5. Page visibility — pause RAF when tab is hidden ───────────────────
    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && activeRef.current) clock.start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // ─── 6. Mouse parallax & Enhanced Rotation Sensitivity ───────────────────
    let mouseX = 0, mouseY = 0, tpx = 0, tpy = 0;
    let rotY = 0, rotX = 0;
    let mouseDirty = false;
    const onMouseMove = (e: MouseEvent) => {
      // Only process when active on hero section
      if (!activeRef.current) return;
      mouseX = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
      mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouseDirty = true;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ─── 7. Resize — debounced ───────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!container || !renderer) return;
        const w = container.clientWidth, h = container.clientHeight;
        const isMob = w < 1024;
        const offX = isMob ? 0.6 : 3.8;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        defaultCamPos.set(offX, isMob ? 2.6 : 2.7, isMob ? 11.5 : 10.2);
        cameraTarget.set(offX, 2.3, 0.0);
        if (modelRef) {
          modelRef.position.set(offX, 0, 0);
        }
      }, 150);
    };
    window.addEventListener("resize", onResize);

    // ─── 8. Animation loop with Pause On Inactive ─────────────────────────────
    let wasActive = true;
    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      // Completely pause render loop and mixer if tab is hidden OR user scrolled out of home section
      if (!isVisible || !activeRef.current) {
        wasActive = false;
        return;
      }

      // If just resuming from pause, reset delta so animations don't jump ahead
      if (!wasActive) {
        clock.getDelta();
        wasActive = true;
      }

      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      // Gentle, subtle cursor parallax & viewing angle (reduced rotation)
      if (mouseDirty) {
        // Subtle camera parallax
        tpx += (mouseX * 0.20 - tpx) * 0.04;
        tpy += (-mouseY * 0.12 - tpy) * 0.04;
        // Subtle 3D stage rotational tilt on cursor movement
        rotY += (mouseX * 0.07 - rotY) * 0.04;
        rotX += (mouseY * 0.03 - rotX) * 0.04;
        mouseDirty = Math.abs(mouseX * 0.20 - tpx) > 0.0001 || Math.abs(-mouseY * 0.12 - tpy) > 0.0001;
      }

      if (modelRef) {
        modelRef.rotation.y = rotY;
        modelRef.rotation.x = rotX;
      }

      camera.position.x = defaultCamPos.x + tpx;
      camera.position.y = defaultCamPos.y + tpy;
      camera.lookAt(cameraTarget);

      if (renderer) renderer.render(scene, camera);
    };
    animationFrameId = requestAnimationFrame(animate);

    // ─── 9. Cleanup ──────────────────────────────────────────────────────────
    return () => {
      isDisposed = true;
      clearTimeout(resizeTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (mixer) mixer.stopAllAction();
      dracoLoader.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          if (m.geometry) m.geometry.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mat) => { if (mat) mat.dispose(); });
        }
      });
      if (renderer) {
        renderer.dispose();
        renderer.domElement?.parentElement?.removeChild(renderer.domElement);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full transition-opacity duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    />
  );
}

export default HeroStage3D;
