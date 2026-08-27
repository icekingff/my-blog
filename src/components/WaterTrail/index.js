import React, { useEffect, useRef } from 'react';
import styles from './index.module.css';

export default function WaterTrail() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // 设置画布大小
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 鼠标移动
    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      // 添加新的水粒子
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: mouse.current.x + (Math.random() - 0.5) * 10,
          y: mouse.current.y + (Math.random() - 0.5) * 10,
          size: Math.random() * 6 + 2,
          life: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          color: `rgba(79, 195, 247, ${Math.random() * 0.5 + 0.3})`,
        });
      }
      // 限制粒子数量
      if (particles.current.length > 100) {
        particles.current.splice(0, 20);
      }
    };

    document.addEventListener('mousemove', onMove);

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current = particles.current.filter(p => p.life > 0);
      
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // 轻微重力
        p.life -= 0.008;
        p.size *= 0.995;
        
        // 绘制水滴
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('1)', p.life + ')');
        ctx.fill();
        
        // 发光效果
        ctx.shadowColor = 'rgba(79, 195, 247, 0.3)';
        ctx.shadowBlur = 10;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.trailCanvas} />;
}