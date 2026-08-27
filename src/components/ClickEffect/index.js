import React, { useEffect, useRef } from 'react';
import styles from './index.module.css';

export default function ClickEffect() {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 点击事件 - 生成水花爆炸效果
    const onClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const count = 30; // 粒子数量

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        const size = Math.random() * 6 + 2;
        const colors = [
          'rgba(79, 195, 247, ',
          'rgba(129, 212, 250, ',
          'rgba(179, 229, 252, ',
          'rgba(255, 255, 255, ',
          'rgba(77, 208, 225, ',
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        particles.current.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: size,
          life: 1,
          decay: Math.random() * 0.015 + 0.005,
          color: color,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        });
      }
    };

    document.addEventListener('click', onClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((p) => p.life > 0);

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // 重力
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.life -= p.decay;
        p.size *= 0.995;
        p.rotation += p.rotationSpeed;

        // 绘制粒子
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        // 绘制水滴形状
        const alpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.fill();

        // 发光效果
        ctx.shadowColor = 'rgba(79, 195, 247, ' + alpha * 0.3 + ')';
        ctx.shadowBlur = 15;

        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.clickCanvas} />;
}