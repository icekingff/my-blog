import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const CARDS = [
  {
    id: 1,
    name: '芙宁娜',
    title: '水神 · 审判',
    emoji: '👑',
    rarity: '★★★★★',
    color: '#ffd700',
    description: '"罪人舞步旋，水神之审判永不停歇。"',
  },
  {
    id: 2,
    name: '那维莱特',
    title: '最高审判官',
    emoji: '⚖️',
    rarity: '★★★★★',
    color: '#4fc3f7',
    description: '"枫丹的律法，便是我的意志。"',
  },
  {
    id: 3,
    name: '琳妮特',
    title: '魔术助手',
    emoji: '🎭',
    rarity: '★★★★',
    color: '#81d4fa',
    description: '"魔术的精髓在于优雅。"',
  },
  {
    id: 4,
    name: '菲米尼',
    title: '潜水员',
    emoji: '🐧',
    rarity: '★★★★',
    color: '#80cbc4',
    description: '"海露的深处，藏着秘密。"',
  },
  {
    id: 5,
    name: '林尼',
    title: '魔术师',
    emoji: '🎩',
    rarity: '★★★★',
    color: '#ce93d8',
    description: '"表演开始了，请睁大眼睛。"',
  },
  {
    id: 6,
    name: '娜维娅',
    title: '刺玫会会长',
    emoji: '🌹',
    rarity: '★★★★★',
    color: '#ffb74d',
    description: '"刺玫会的大门永远为你敞开。"',
  },
  {
    id: 7,
    name: '克洛琳德',
    title: '决斗代理人',
    emoji: '⚔️',
    rarity: '★★★★',
    color: '#a1887f',
    description: '"决斗的规则，由我来定。"',
  },
  {
    id: 8,
    name: '水史莱姆',
    title: '普通怪物',
    emoji: '💧',
    rarity: '★★★',
    color: '#4dd0e1',
    description: '"咕噜咕噜..."',
  },
  {
    id: 9,
    name: '芙卡洛斯',
    title: '水神 · 原初',
    emoji: '🌟',
    rarity: '★★★★★',
    color: '#ff6b6b',
    description: '"她真的很了不起，这五百年来..."',
  },
];

// 全局粒子数组
let particles = [];
let animationId = null;

// ===== 统一使用金色 =====
const getStarColors = (stars) => {
  return {
    primary: '#ffd700',
    secondary: '#fff8dc',
    glow: 'rgba(255, 215, 0, 0.6)',
    border: 'rgba(255, 215, 0, 0.4)',
    text: '✦ 星轨汇聚中 ✦',
    label: stars || '★★★★★',
    colors: ['#ffd700', '#fff8dc', '#ffc107', '#ffffff', '#ffab00', '#ffd740']
  };
};

export default function GachaPage() {
  const [currentCard, setCurrentCard] = useState(null);
  const [history, setHistory] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // ===== 保底相关状态 =====
  const [pityCounter, setPityCounter] = useState(0);
  const [totalPulls, setTotalPulls] = useState(0);
  
  // ===== 出金后20抽计数器 =====
  const [pullsSinceFiveStar, setPullsSinceFiveStar] = useState(0);
  
  // ===== 十连相关状态 =====
  const [isTenPull, setIsTenPull] = useState(false);
  const [tenPullResults, setTenPullResults] = useState([]);
  
  // 动画阶段控制
  const [phase, setPhase] = useState('idle');
  const [previewEmoji, setPreviewEmoji] = useState('✨');
  const [showCloseBtn, setShowCloseBtn] = useState(false);
  const [goldenParticles, setGoldenParticles] = useState([]);
  const [currentStarScheme, setCurrentStarScheme] = useState(null);

  // ===== 概率配置 =====
  const FIVE_STAR_BASE_RATE = 0.6;        // 五星基础概率 0.6%
  const FOUR_STAR_BASE_RATE = 5.0;         // 四星基础概率 5.0%
  const HARD_PITY = 80;                    // 硬保底：80抽必出五星
  const SOFT_PITY_START = 73;              // 软保底开始：73抽后概率提升
  const SOFT_PITY_INCREASE = 6;            // 软保底每抽增加 6%
  const FOUR_STAR_PITY = 10;               // 四星保底：10抽必出四星或以上
  
  // ===== 出金后20抽内概率加成 =====
  const RECENT_FIVE_STAR_BONUS_RATE = 0.3;   // 额外加成概率 0.3%
  const RECENT_FIVE_STAR_WINDOW = 20;        // 加成持续20抽

  // ===== 计算实际五星概率 =====
  const getFiveStarRate = (pity, pullsSinceFive) => {
    // 1. 硬保底
    if (pity >= HARD_PITY) return 100;
    
    // 2. 软保底（73抽后递增）
    let rate = FIVE_STAR_BASE_RATE;
    if (pity >= SOFT_PITY_START) {
      const extra = (pity - SOFT_PITY_START + 1) * SOFT_PITY_INCREASE;
      rate = Math.min(FIVE_STAR_BASE_RATE + extra, 100);
    }
    
    // 3. 出金后20抽内轻微加成（仅当不在软保底区间时生效）
    if (pullsSinceFive <= RECENT_FIVE_STAR_WINDOW && pullsSinceFive > 0 && pity < SOFT_PITY_START) {
      let bonus = RECENT_FIVE_STAR_BONUS_RATE;
      if (pullsSinceFive > 10) {
        bonus = RECENT_FIVE_STAR_BONUS_RATE * (1 - (pullsSinceFive - 10) / 10);
      }
      rate = Math.min(rate + bonus, 100);
    }
    
    return rate;
  };

  // 金色粒子Canvas
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'golden-particles-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10000;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles = particles.filter(p => p.life > 0);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life -= p.decay;
        p.size *= 0.998;
        
        const alpha = Math.max(0, p.life);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        if (p.isStar) {
          const s = p.size;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation || 0);
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const r = s;
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            const angle2 = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
            const r2 = s * 0.4;
            ctx.lineTo(Math.cos(angle2) * r2, Math.sin(angle2) * r2);
          }
          ctx.closePath();
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        }
      });
      
      setGoldenParticles([...particles]);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      const el = document.getElementById('golden-particles-canvas');
      if (el) el.remove();
    };
  }, []);

  // 生成粒子
  const spawnParticles = (count = 60, isResult = false, colorScheme = null) => {
    const defaultColors = ['#ffd700', '#fff8dc', '#ffc107', '#ffffff', '#ffab00', '#ffd740'];
    const colors = colorScheme ? colorScheme.colors : defaultColors;
    const total = isResult ? 80 : count;
    
    for (let i = 0; i < total; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 150 + 50) * (isResult ? 2 : 1.5);
      const x = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
      const y = window.innerHeight / 2 + (Math.random() - 0.5) * 100;
      
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed * (0.3 + Math.random() * 0.7),
        vy: Math.sin(angle) * speed * (0.3 + Math.random() * 0.7) - 30,
        size: Math.random() * 10 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.005 + Math.random() * 0.015,
        isStar: Math.random() > 0.6,
        rotation: Math.random() * 360,
      });
    }
  };

  // ===== 单抽逻辑 =====
  const drawCard = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setIsTenPull(false);
    setTenPullResults([]);

    // 计算当前实际概率
    const fiveStarRate = getFiveStarRate(pityCounter, pullsSinceFiveStar);
    const roll = Math.random() * 100;
    
    let starLevel;
    
    // 判断五星
    if (roll < fiveStarRate || pityCounter >= HARD_PITY) {
      starLevel = 5;
      setPullsSinceFiveStar(0);
    } else {
      setPullsSinceFiveStar(prev => prev + 1);
      
      // 四星保底逻辑
      const fourStarPity = (pityCounter + pullsSinceFiveStar) % FOUR_STAR_PITY;
      const isFourStarGuaranteed = fourStarPity === 9;
      
      if (isFourStarGuaranteed) {
        starLevel = 4;
      } else if (roll < fiveStarRate + FOUR_STAR_BASE_RATE) {
        starLevel = 4;
      } else {
        starLevel = 3;
      }
    }

    // 更新保底计数
    if (starLevel === 5) {
      setPityCounter(0);
    } else {
      setPityCounter(prev => prev + 1);
    }
    setTotalPulls(prev => prev + 1);

    // 从对应星级卡池抽取
    const starMap = { 5: '★★★★★', 4: '★★★★', 3: '★★★' };
    const targetRarity = starMap[starLevel];
    const filtered = CARDS.filter(c => c.rarity === targetRarity);
    const card = filtered.length > 0 
      ? filtered[Math.floor(Math.random() * filtered.length)]
      : CARDS[Math.floor(Math.random() * CARDS.length)];

    // 后续动画逻辑
    setCurrentCard(card);
    const scheme = getStarColors(card.rarity);
    setCurrentStarScheme(scheme);
    setHistory(prev => [card, ...prev].slice(0, 20));

    setPhase('preview');
    setShowCloseBtn(false);
    setPreviewEmoji(card.emoji);
    setIsOpen(true);
    particles = [];
    
    spawnParticles(starLevel === 5 ? 60 : 40, false, scheme);
    
    setTimeout(() => {
      setPhase('transition');
      spawnParticles(starLevel === 5 ? 40 : 30, false, scheme);
    }, 1500);
    
    setTimeout(() => {
      setPhase('reveal');
      setShowCloseBtn(true);
      spawnParticles(starLevel === 5 ? 70 : 50, true, scheme);
      setIsDrawing(false);
    }, 2500);
  };

  // ===== 十连抽逻辑 =====
  const drawTenCards = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setIsTenPull(true);

    const results = [];
    let pity = pityCounter;
    let pullsSinceFive = pullsSinceFiveStar;
    let fiveStarCount = 0;
    let fourStarCount = 0;
    let fourStarPityCounter = 0;

    for (let i = 0; i < 10; i++) {
      const fiveStarRate = getFiveStarRate(pity, pullsSinceFive);
      const roll = Math.random() * 100;
      
      let starLevel;
      
      if (roll < fiveStarRate || pity >= HARD_PITY) {
        starLevel = 5;
        fiveStarCount++;
        pity = 0;
        pullsSinceFive = 0;
        fourStarPityCounter = 0;
      } else {
        pullsSinceFive++;
        
        const isFourStarGuaranteed = fourStarPityCounter >= 9;
        if (isFourStarGuaranteed) {
          starLevel = 4;
          fourStarCount++;
          fourStarPityCounter = 0;
        } else if (roll < fiveStarRate + FOUR_STAR_BASE_RATE) {
          starLevel = 4;
          fourStarCount++;
          fourStarPityCounter = 0;
        } else {
          starLevel = 3;
          fourStarPityCounter++;
          pity++;
        }
      }

      const starMap = { 5: '★★★★★', 4: '★★★★', 3: '★★★' };
      const targetRarity = starMap[starLevel];
      const filtered = CARDS.filter(c => c.rarity === targetRarity);
      const card = filtered.length > 0 
        ? filtered[Math.floor(Math.random() * filtered.length)]
        : CARDS[Math.floor(Math.random() * CARDS.length)];
      
      results.push(card);
    }

    // 更新保底和总抽数
    setPityCounter(pity);
    setPullsSinceFiveStar(pullsSinceFive);
    setTotalPulls(prev => prev + 10);
    setHistory(prev => [...results, ...prev].slice(0, 20));
    setTenPullResults(results);

    // 选择主卡片
    const mainCard = results.find(c => c.rarity === '★★★★★') 
      || results.find(c => c.rarity === '★★★★')
      || results[0];
    
    setCurrentCard(mainCard);
    const scheme = getStarColors(mainCard.rarity);
    setCurrentStarScheme(scheme);
    setPreviewEmoji(mainCard.emoji);
    setIsOpen(true);
    particles = [];
    
    const hasFiveStar = results.some(c => c.rarity === '★★★★★');
    spawnParticles(hasFiveStar ? 80 : 50, true, scheme);
    
    setPhase('preview');
    setTimeout(() => setPhase('transition'), 1500);
    setTimeout(() => {
      setPhase('reveal');
      setShowCloseBtn(true);
      setIsDrawing(false);
    }, 2500);
  };

  const closeCard = () => {
    setIsOpen(false);
    setPhase('idle');
    setShowCloseBtn(false);
    particles = [];
    setTimeout(() => setCurrentCard(null), 300);
  };

  // ===== 清空所有数据 =====
  const clearAllData = () => {
    if (window.confirm('确定要清空所有抽卡记录吗？')) {
      setHistory([]);
      setTotalPulls(0);
      setPityCounter(0);
      setPullsSinceFiveStar(0);
      setTenPullResults([]);
    }
  };

  // ===== 渲染不同阶段内容 =====
  const renderContent = () => {
    if (!currentCard) return null;

    const scheme = currentStarScheme || getStarColors(currentCard.rarity);

    if (phase === 'preview') {
      return (
        <div 
          className={styles.previewContainer}
          style={{
            borderColor: scheme.border,
            boxShadow: `0 0 80px ${scheme.glow}`
          }}
        >
          <div 
            className={styles.rotatingGlow}
            style={{
              background: `conic-gradient(
                from 0deg, 
                transparent, 
                ${scheme.primary}33, 
                transparent, 
                ${scheme.primary}55, 
                transparent
              )`
            }}
          ></div>
          <div 
            className={styles.previewEmoji}
            style={{
              filter: `drop-shadow(0 0 60px ${scheme.glow})`
            }}
          >
            {previewEmoji}
          </div>
          <div 
            className={styles.previewHint}
            style={{ color: scheme.primary }}
          >
            ✦ 星轨汇聚中 ✦
          </div>
          <div className={styles.previewSubHint}>
            水神之谕 · 降临
          </div>
        </div>
      );
    }

    if (phase === 'transition') {
      return (
        <div 
          className={styles.transitionContainer}
          style={{
            background: `radial-gradient(ellipse at center, ${scheme.primary}15 0%, transparent 70%)`
          }}
        >
          <div 
            className={styles.transitionGlow}
            style={{
              background: `radial-gradient(circle, ${scheme.primary}30 0%, transparent 60%)`
            }}
          ></div>
          <div 
            className={styles.transitionBurst}
            style={{ color: scheme.primary }}
          >
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>
          <div 
            className={styles.transitionText}
            style={{ color: scheme.primary }}
          >
            · 光芒汇聚 ·
          </div>
        </div>
      );
    }

    if (phase === 'reveal') {
      const hasFiveStar = tenPullResults.some(c => c.rarity === '★★★★★');
      return (
        <div 
          className={styles.cardBorder}
          style={{ borderColor: currentCard.color, boxShadow: `0 0 80px ${currentCard.color}60` }}
        >
          <div className={styles.cardRarity}>{currentCard.rarity}</div>
          <div className={styles.cardEmoji}>{currentCard.emoji}</div>
          <div className={styles.cardName} style={{ color: currentCard.color }}>
            {currentCard.name}
          </div>
          <div className={styles.cardTitle}>{currentCard.title}</div>
          <div className={styles.cardDescription}>"{currentCard.description}"</div>
          
          {isTenPull && tenPullResults.length > 1 && (
            <div className={styles.tenPullList}>
              {tenPullResults.map((card, idx) => (
                <span key={idx} className={styles.tenPullItem}>
                  {card.emoji}
                </span>
              ))}
            </div>
          )}
          
          <div className={styles.cardWatermark}>
            {isTenPull 
              ? (hasFiveStar ? '✦ 十连 · 出金！ ✦' : '✦ 十连 · 下次一定 ✦')
              : '✦ 水神赐福 ✦'}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title="水神之谕 · 抽卡"
      description="抽取属于你的枫丹角色"
    >
      <div className={styles.gachaPage}>
        <div className={styles.backgroundGlow}></div>
        <div className={styles.backgroundGlow2}></div>

        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>💧</span>
            水神之谕 · 抽卡
          </h1>
          <p className={styles.subtitle}>
            以水神之名，抽取属于你的枫丹角色
          </p>
        </div>

        <div className={styles.gachaContainer}>
          <div className={styles.buttonGroup}>
            <button 
              className={styles.drawButton} 
              onClick={drawCard}
              disabled={isDrawing}
            >
              <span className={styles.buttonIcon}>💧</span>
              {isDrawing ? '抽卡中...' : '✦ 单抽 ✦'}
              <span className={styles.buttonGlow}></span>
            </button>
            
            <button 
              className={styles.drawTenButton} 
              onClick={drawTenCards}
              disabled={isDrawing}
            >
              <span className={styles.buttonIcon}>🌟</span>
              {isDrawing ? '抽卡中...' : '✦ 十连 ✦'}
              <span className={styles.buttonGlow}></span>
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.statsLeft}>
              <span>🎴 已抽 {totalPulls} 次</span>
              <span className={styles.pityInfo}>💫 {pityCounter}/{HARD_PITY}</span>
            </div>
            <div className={styles.statsButtons}>
              <button 
                className={styles.historyToggle}
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? '📜 收起记录' : '📜 查看记录'}
              </button>
              {history.length > 0 && (
                <button 
                  className={styles.clearButton}
                  onClick={clearAllData}
                >
                  🗑️ 清空
                </button>
              )}
            </div>
          </div>

          {showHistory && (
            <div className={styles.historyContainer}>
              {history.length === 0 ? (
                <div className={styles.emptyHistory}>还没有抽卡记录，快来试试吧！</div>
              ) : (
                <div className={styles.historyList}>
                  {history.map((card, index) => (
                    <div key={index} className={styles.historyItem}>
                      <span className={styles.historyEmoji}>{card.emoji}</span>
                      <span className={styles.historyName} style={{ color: card.color }}>
                        {card.name}
                      </span>
                      <span className={styles.historyRarity}>{card.rarity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.previewSection}>
          <h3 className={styles.previewTitle}>✦ 可获得的角色 ✦</h3>
          <div className={styles.previewGrid}>
            {CARDS.map(card => (
              <div key={card.id} className={styles.previewCard}>
                <div className={styles.previewEmoji}>{card.emoji}</div>
                <div className={styles.previewName} style={{ color: card.color }}>
                  {card.name}
                </div>
                <div className={styles.previewRarity}>{card.rarity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && currentCard && (
        <div className={styles.overlay} onClick={phase === 'reveal' ? closeCard : undefined}>
          <div className={styles.cardModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cardWrapper}>
              {renderContent()}
            </div>
            {showCloseBtn && (
              <button className={styles.closeButton} onClick={closeCard}>✕</button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}