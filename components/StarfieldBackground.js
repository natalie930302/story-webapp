'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 场景设置
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

    // 创建星星粒子系统
    const starCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    // 七彩颜色数组
    const colorPalette = [
      new THREE.Color(0xff69b4), // 粉红
      new THREE.Color(0x87ceeb), // 天蓝
      new THREE.Color(0xffd700), // 金色
      new THREE.Color(0xba55d3), // 紫色
      new THREE.Color(0x32cd32), // 绿色
      new THREE.Color(0xff8c00), // 橙色
      new THREE.Color(0x00ffff), // 青色
      new THREE.Color(0xffc0cb), // 浅粉
      new THREE.Color(0x9400d3), // 深紫
      new THREE.Color(0xffff00), // 黄色
      new THREE.Color(0x00bfff), // 深蓝
      new THREE.Color(0xff4500), // 橙红
      new THREE.Color(0xff1493), // 深粉
      new THREE.Color(0x7b68ee), // 中紫
      new THREE.Color(0x00ff7f), // 春绿
      new THREE.Color(0xffa500), // 橙
      new THREE.Color(0x40e0d0), // 绿松石
      new THREE.Color(0xee82ee), // 紫罗兰
      new THREE.Color(0x8a2be2), // 蓝紫
      new THREE.Color(0x48d1cc), // 中绿松石
    ];

    // 随机生成星星位置、颜色和大小
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // 位置：均匀分布在屏幕空间的背景深处
      positions[i3] = (Math.random() - 0.5) * 200; // x: -100 到 100
      positions[i3 + 1] = (Math.random() - 0.5) * 200; // y: -100 到 100
      positions[i3 + 2] = -Math.random() * 100 - 20; // z: -20 到 -120（永远在摄像机后面）

      // 颜色：从调色板中随机选择
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // 大小：随机大小
      sizes[i] = Math.random() * 2 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // 创建粒子材质
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

    // 添加第二层星星（更远更小的星星）
    const smallStarCount = 2000;
    const smallGeometry = new THREE.BufferGeometry();
    const smallPositions = new Float32Array(smallStarCount * 3);
    const smallColors = new Float32Array(smallStarCount * 3);

    for (let i = 0; i < smallStarCount; i++) {
      const i3 = i * 3;
      
      // 第二层星星：更远的背景
      smallPositions[i3] = (Math.random() - 0.5) * 250; // x: -125 到 125
      smallPositions[i3 + 1] = (Math.random() - 0.5) * 250; // y: -125 到 125
      smallPositions[i3 + 2] = -Math.random() * 80 - 120; // z: -120 到 -200（更远）

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

    // 动画
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.001;

      // 旋转星空
      stars.rotation.y = time * 0.05;
      stars.rotation.x = time * 0.02;
      
      smallStars.rotation.y = time * -0.03;
      smallStars.rotation.x = time * -0.015;

      // 闪烁效果（只改变大小，不改变位置）
      const sizes = geometry.attributes.size.array;
      
      for (let i = 0; i < starCount; i++) {
        // 大小闪烁
        sizes[i] = (Math.random() * 1.5 + 0.5) * (1 + Math.sin(time * 3 + i * 0.1) * 0.3);
      }
      
      geometry.attributes.size.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 响应窗口大小变化
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 清理
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
