'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const starCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const colorPalette = [
      new THREE.Color(0xff69b4),
      new THREE.Color(0x87ceeb),
      new THREE.Color(0xffd700),
      new THREE.Color(0xba55d3),
      new THREE.Color(0x32cd32),
      new THREE.Color(0xff8c00),
      new THREE.Color(0x00ffff),
      new THREE.Color(0xffc0cb),
      new THREE.Color(0x9400d3),
      new THREE.Color(0xffff00),
      new THREE.Color(0x00bfff),
      new THREE.Color(0xff4500),
      new THREE.Color(0xff1493),
      new THREE.Color(0x7b68ee),
      new THREE.Color(0x00ff7f),
      new THREE.Color(0xffa500),
      new THREE.Color(0x40e0d0),
      new THREE.Color(0xee82ee),
      new THREE.Color(0x8a2be2),
      new THREE.Color(0x48d1cc),
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      positions[i3] = (Math.random() - 0.5) * 200;
      positions[i3 + 1] = (Math.random() - 0.5) * 200;
      positions[i3 + 2] = -Math.random() * 100 - 20;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    const smallStarCount = 2000;
    const smallGeometry = new THREE.BufferGeometry();
    const smallPositions = new Float32Array(smallStarCount * 3);
    const smallColors = new Float32Array(smallStarCount * 3);

    for (let i = 0; i < smallStarCount; i++) {
      const i3 = i * 3;
      
      smallPositions[i3] = (Math.random() - 0.5) * 250;
      smallPositions[i3 + 1] = (Math.random() - 0.5) * 250;
      smallPositions[i3 + 2] = -Math.random() * 80 - 120;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      smallColors[i3] = color.r;
      smallColors[i3 + 1] = color.g;
      smallColors[i3 + 2] = color.b;
    }

    smallGeometry.setAttribute('position', new THREE.BufferAttribute(smallPositions, 3));
    smallGeometry.setAttribute('color', new THREE.BufferAttribute(smallColors, 3));

    const smallMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const smallStars = new THREE.Points(smallGeometry, smallMaterial);
    scene.add(smallStars);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.001;

      stars.rotation.y = time * 0.05;
      stars.rotation.x = time * 0.02;
      
      smallStars.rotation.y = time * -0.03;
      smallStars.rotation.x = time * -0.015;

      const sizes = geometry.attributes.size.array;
      
      for (let i = 0; i < starCount; i++) {
        sizes[i] = (Math.random() * 1.5 + 0.5) * (1 + Math.sin(time * 3 + i * 0.1) * 0.3);
      }
      
      geometry.attributes.size.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      smallGeometry.dispose();
      smallMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
