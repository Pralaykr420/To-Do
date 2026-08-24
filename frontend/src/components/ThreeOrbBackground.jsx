import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Orbit — the visual centerpiece of the app.
 * A wireframe icosahedron floats behind the task list, orbited by a thin ring
 * of particles. Its rotation speed and glow respond to how much of the list
 * is complete: an empty list drifts slowly, a fully-completed list spins up
 * and glows brighter. This is a live reflection of the user's progress,
 * not decoration.
 */
export default function ThreeOrbBackground({ progress = 0 }) {
  const mountRef = useRef(null);
  const progressRef = useRef(progress);

  // keep the render loop in sync with the latest progress without
  // tearing down and rebuilding the whole scene on every task change
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Central wireframe icosahedron ---
    const coreGeometry = new THREE.IcosahedronGeometry(2.4, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x7c5cfc,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // faint inner glow shell
    const glowGeometry = new THREE.IcosahedronGeometry(2.1, 1);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x34e7e4,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // --- Ambient starfield particles ---
    const starCount = 500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 40;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xe8ecf6,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // --- Thin orbiting ring of particles around the core ---
    const ringCount = 120;
    const ringGeometry = new THREE.BufferGeometry();
    const ringPositions = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const radius = 3.4 + Math.random() * 0.3;
      ringPositions[i * 3] = Math.cos(angle) * radius;
      ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      ringPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    ringGeometry.setAttribute("position", new THREE.BufferAttribute(ringPositions, 3));
    const ringMaterial = new THREE.PointsMaterial({
      color: 0x34e7e4,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Points(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.6;
    scene.add(ring);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const p = progressRef.current; // 0..1

      // base drift speed + boost proportional to completion progress
      const speed = 0.15 + p * 0.6;
      core.rotation.y += delta * speed;
      core.rotation.x += delta * speed * 0.4;
      glow.rotation.y -= delta * speed * 0.6;

      // glow brightens as more tasks are completed
      coreMaterial.opacity = 0.4 + p * 0.4;
      glowMaterial.opacity = 0.08 + p * 0.25;

      ring.rotation.y += delta * (0.1 + p * 0.3);
      stars.rotation.y += delta * 0.01;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      coreGeometry.dispose();
      coreMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-80"
    />
  );
}
