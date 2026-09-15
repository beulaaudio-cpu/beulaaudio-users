"use client";

import * as THREE from "three";

export interface CameraWaypoint {
  progress: number;
  camPos: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

/**
 * Camera Timeline precisely matching user specification:
 * 1. Wide stage overview
 * 2. Close to Speaker Box (VRX + Subs)
 * 3. Close to Moving Lights, Parcans & Lasers (Overhead Truss)
 * 4. Close to DJ Console (Players, Mixer, Deck)
 * 5. Close to Honeycomb Booth (Hexagonal Glowing Rig)
 * 6. Finally on Stage Wall to show Logo and Name of Company ("Beula Audio")
 */
export const STAGE_CAMERA_TIMELINE: CameraWaypoint[] = [
  // 1. Wide stage overview (Hero)
  {
    progress: 0.0,
    camPos: [0, 0.2, 8.6],
    target: [0, 0.5, -2.0],
  },
  {
    progress: 0.12,
    camPos: [-1.2, 0.0, 6.8],
    target: [-2.0, 0.3, -2.0],
  },
  // 2. Fly in close to Speaker Box (VRX curved line-array & Subwoofers)
  {
    progress: 0.28,
    camPos: [-4.2, -0.4, 1.5],
    target: [-5.6, 0.1, -2.0],
  },
  // 3. Move closer to Lights (Truss Moving Heads, Parcans & Lasers)
  {
    progress: 0.48,
    camPos: [2.0, 3.6, 0.2],
    target: [0.0, 4.0, -3.8],
  },
  // 4. Move closer to DJ Console (Players, Mixer, Crossfader)
  {
    progress: 0.66,
    camPos: [0.1, -0.5, 0.85],
    target: [0.0, -1.1, -1.6],
  },
  // 5. Move closer to Honeycomb Booth (Architectural Glowing Hexagons)
  {
    progress: 0.82,
    camPos: [1.2, -0.1, 1.4],
    target: [0.0, -0.3, -2.6],
  },
  // 6. Finally on Stage Wall to show Beula Audio Logo & Company Name
  {
    progress: 1.0,
    camPos: [0.0, 1.05, -2.5],
    target: [0.0, 1.05, -6.8],
  },
];

/**
 * Updates camera position and look-at target by interpolating along the timeline
 */
export function updateCameraForProgress(
  camera: THREE.PerspectiveCamera,
  progress: number,
  targetObj: THREE.Vector3,
  smoothFactor = 0.08
) {
  const p = Math.max(0, Math.min(1, progress));

  // Find bounding keyframes
  let idx = 0;
  for (let i = 0; i < STAGE_CAMERA_TIMELINE.length - 1; i++) {
    if (
      p >= STAGE_CAMERA_TIMELINE[i].progress &&
      p <= STAGE_CAMERA_TIMELINE[i + 1].progress
    ) {
      idx = i;
      break;
    }
  }

  const k1 = STAGE_CAMERA_TIMELINE[idx];
  const k2 = STAGE_CAMERA_TIMELINE[idx + 1] || k1;
  const range = k2.progress - k1.progress || 1;
  const localP = (p - k1.progress) / range;

  // Cubic Hermite easing (smoothstep)
  const ease = localP * localP * (3 - 2 * localP);

  const desiredX = k1.camPos[0] + (k2.camPos[0] - k1.camPos[0]) * ease;
  const desiredY = k1.camPos[1] + (k2.camPos[1] - k1.camPos[1]) * ease;
  const desiredZ = k1.camPos[2] + (k2.camPos[2] - k1.camPos[2]) * ease;

  const targetX = k1.target[0] + (k2.target[0] - k1.target[0]) * ease;
  const targetY = k1.target[1] + (k2.target[1] - k1.target[1]) * ease;
  const targetZ = k1.target[2] + (k2.target[2] - k1.target[2]) * ease;

  // Damped interpolation
  camera.position.x += (desiredX - camera.position.x) * smoothFactor;
  camera.position.y += (desiredY - camera.position.y) * smoothFactor;
  camera.position.z += (desiredZ - camera.position.z) * smoothFactor;

  targetObj.x += (targetX - targetObj.x) * smoothFactor;
  targetObj.y += (targetY - targetObj.y) * smoothFactor;
  targetObj.z += (targetZ - targetObj.z) * smoothFactor;

  camera.lookAt(targetObj);
}
