import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// ===== 角色库 =====
const ALL_CHARACTERS = [
  { id: 1, name: '芙宁娜', title: '水神 · 审判', image: '/img/characters/furina.png', imagePosition: 'center 30%', rarity: '★★★★★', color: '#ffd700', description: '"罪人舞步旋，水神之审判永不停歇。"', isPermanent: true },
  { id: 3, name: '琳妮特', title: '魔术助手', image: '/img/characters/linnite.png', imagePosition: 'center 25%', rarity: '★★★★', color: '#81d4fa', description: '"魔术的精髓在于优雅。"', isPermanent: true },
  { id: 4, name: '菲米尼', title: '潜水员', image: '/img/characters/fimini.png', imagePosition: 'center 25%', rarity: '★★★★', color: '#80cbc4', description: '"海露的深处，藏着秘密。"', isPermanent: true },
  { id: 6, name: '克洛琳德', title: '决斗代理人', image: '/img/characters/clorinde.png', imagePosition: 'center 25%', rarity: '★★★★', color: '#a1887f', description: '"决斗的规则，由我来定。"', isPermanent: true },
  { id: 8, name: '史莱姆', title: '普通怪物', image: '/img/characters/shi.png', imagePosition: 'center 50%', rarity: '★★★', color: '#3e2723', description: '"！？区区？！"', isPermanent: true },
  { id: 9, name: '钟离', title: '岩神 · 契约', image: '/img/characters/zhongli.png', imagePosition: 'center 30%', rarity: '★★★★★', color: '#ffb300', description: '"我虽无意逐鹿，却知苍生苦楚。"', isPermanent: false },
  { id: 10, name: '胡桃', title: '往生堂 · 堂主', image: '/img/characters/hutao.png', imagePosition: 'center 20%', rarity: '★★★★★', color: '#ff6b6b', description: '"客官，往生堂了解一下？"', isPermanent: false },
  { id: 11, name: '甘雨', title: '璃月·七星秘书', image: '/img/characters/ganyu.png', imagePosition: 'center 25%', rarity: '★★★★★', color: '#66bb6a', description: '"为了璃月，我愿意付出一切。"', isPermanent: false },
  { id: 12, name: '行秋', title: '飞云商会二少爷', image: '/img/characters/xingqiu.png', imagePosition: 'center 25%', rarity: '★★★★', color: '#4dd0e1', description: '"读书人的事，能算偷么？"', isPermanent: true },
  { id: 13, name: '林尼', title: '魔术师', image: '/img/characters/lyney.png', imagePosition: 'center 25%', rarity: '★★★★', color: '#ce93d8', description: '"表演开始了，请睁大眼睛。"', isPermanent: true },
  { id: 14, name: '七七', title: '僵尸 · 采药', image: '/img/characters/qiqi.png', imagePosition: 'center 25%', rarity: '★★★★★', color: '#80cbc4', description: '"我...是七七..."', isPermanent: false },
];

const POOLS = [
  { id: 'pool_liyue', name: '璃月祈愿', fiveStarIds: [9, 10, 11, 14], fourStarIds: [12, 13] },
  { id: 'pool_fontaine', name: '枫丹祈愿', fiveStarIds: [], fourStarIds: [3,4] },
];

const getCharacterById = (id) => ALL_CHARACTERS.find(c => c.id === id);
const getPermanentByRarity = (rarity) => ALL_CHARACTERS.filter(c => c.isPermanent && c.rarity === rarity);
const getPoolFiveStarExclusive = (poolId) => {
  const pool = POOLS.find(p => p.id === poolId);
  return pool ? pool.fiveStarIds.map(getCharacterById).filter(c => c && c.rarity === '★★★★★') : [];
};
const getPoolFourStarExclusive = (poolId) => {
  const pool = POOLS.find(p => p.id === poolId);
  return pool ? pool.fourStarIds.map(getCharacterById).filter(c => c && c.rarity === '★★★★') : [];
};
const getPoolExclusive = (poolId) => {
  const pool = POOLS.find(p => p.id === poolId);
  if (!pool) return [];
  return [...pool.fiveStarIds, ...pool.fourStarIds].map(getCharacterById).filter(Boolean);
};
const getPoolExclusiveByRarity = (poolId, rarity) => {
  if (rarity === '★★★★★') return getPoolFiveStarExclusive(poolId);
  if (rarity === '★★★★') return getPoolFourStarExclusive(poolId);
  return [];
};

// 粒子系统
let particles = [];
let animationId = null;

export default function GachaPage() {
  const [currentPoolId, setCurrentPoolId] = useState(POOLS[0].id);
  const exclusiveCharacters = getPoolExclusive(currentPoolId);
  
  const [history, setHistory] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const [pityCounter, setPityCounter] = useState(0);
  const [totalPulls, setTotalPulls] = useState(0);
  const [pullsSinceFiveStar, setPullsSinceFiveStar] = useState(0);
  const [fourStarPityCounter, setFourStarPityCounter] = useState(0);
  const [lastFiveStarIsPermanent, setLastFiveStarIsPermanent] = useState(false);
  const [lastFourStarIsPermanent, setLastFourStarIsPermanent] = useState(false);
  
  const [drawResults, setDrawResults] = useState([]);
  const [drawMode, setDrawMode] = useState('single');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealMode, setIsRevealMode] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const [isFlipping, setIsFlipping] = useState(false);
  
  const [phase, setPhase] = useState('idle');
  const [goldenFlash, setGoldenFlash] = useState(false);

  const FIVE_STAR_BASE_RATE = 0.6;
  const FOUR_STAR_BASE_RATE = 5.0;
  const HARD_PITY = 80;
  const SOFT_PITY_START = 73;
  const SOFT_PITY_INCREASE = 6;
  const FOUR_STAR_HARD_PITY = 10;
  const RECENT_FIVE_STAR_BONUS_RATE = 0.3;
  const RECENT_FIVE_STAR_WINDOW = 20;

  const getFiveStarRate = (pity, pullsSinceFive) => {
    if (pity >= HARD_PITY) return 100;
    let rate = FIVE_STAR_BASE_RATE;
    if (pity >= SOFT_PITY_START) {
      const extra = (pity - SOFT_PITY_START + 1) * SOFT_PITY_INCREASE;
      rate = Math.min(FIVE_STAR_BASE_RATE + extra, 100);
    }
    if (pullsSinceFive <= RECENT_FIVE_STAR_WINDOW && pullsSinceFive > 0 && pity < SOFT_PITY_START) {
      let bonus = RECENT_FIVE_STAR_BONUS_RATE;
      if (pullsSinceFive > 10) {
        bonus = RECENT_FIVE_STAR_BONUS_RATE * (1 - (pullsSinceFive - 10) / 10);
      }
      rate = Math.min(rate + bonus, 100);
    }
    return rate;
  };

  const drawOneCard = (starLevel, poolId, lastFive, lastFour) => {
    const rarityMap = { 5: '★★★★★', 4: '★★★★', 3: '★★★' };
    const targetRarity = rarityMap[starLevel];
    
    if (starLevel === 3) {
      const pool = getPermanentByRarity(targetRarity);
      const card = pool[Math.floor(Math.random() * pool.length)] || ALL_CHARACTERS[0];
      return { card, isPermanent: false };
    }
    
    const exclusivePool = getPoolExclusiveByRarity(poolId, targetRarity);
    if (exclusivePool.length === 0) {
      const pool = getPermanentByRarity(targetRarity);
      const card = pool[Math.floor(Math.random() * pool.length)] || ALL_CHARACTERS[0];
      return { card, isPermanent: false };
    }
    
    let usePermanent = false;
    const lastPermanent = starLevel === 5 ? lastFive : lastFour;
    if (lastPermanent === true) {
      usePermanent = false;
    } else {
      usePermanent = Math.random() < 0.5;
    }
    
    let card;
    if (usePermanent) {
      const pool = getPermanentByRarity(targetRarity);
      card = pool[Math.floor(Math.random() * pool.length)] || ALL_CHARACTERS[0];
    } else {
      card = exclusivePool[Math.floor(Math.random() * exclusivePool.length)];
    }
    
    return { card, isPermanent: usePermanent };
  };

  const doDraw = (count) => {
    if (isDrawing) return;
    setIsDrawing(true);
    setPhase('rolling');
    setDrawMode(count === 1 ? 'single' : 'ten');
    setShowResult(false);
    setIsRevealMode(false);
    setDrawResults([]);
    
    const results = [];
    let pity = pityCounter;
    let pullsSinceFive = pullsSinceFiveStar;
    let fourStarPity = fourStarPityCounter;
    let localLastFive = lastFiveStarIsPermanent;
    let localLastFour = lastFourStarIsPermanent;
    
    for (let i = 0; i < count; i++) {
      const fiveStarRate = getFiveStarRate(pity, pullsSinceFive);
      const roll = Math.random() * 100;
      let starLevel;
      
      if (roll < fiveStarRate || pity >= HARD_PITY) {
        starLevel = 5;
        pity = 0;
        pullsSinceFive = 0;
        fourStarPity = 0;
      } else {
        pity++;
        pullsSinceFive++;
        
        const isFourStarGuaranteed = fourStarPity >= FOUR_STAR_HARD_PITY - 1;
        if (isFourStarGuaranteed) {
          starLevel = 4;
          fourStarPity = 0;
        } else if (roll < fiveStarRate + FOUR_STAR_BASE_RATE) {
          starLevel = 4;
          fourStarPity = 0;
        } else {
          starLevel = 3;
          fourStarPity++;
        }
      }
      
      const { card, isPermanent } = drawOneCard(starLevel, currentPoolId, localLastFive, localLastFour);
      results.push(card);
      
      if (starLevel === 5) localLastFive = isPermanent;
      else if (starLevel === 4) localLastFour = isPermanent;
    }
    
    setPityCounter(pity);
    setPullsSinceFiveStar(pullsSinceFive);
    setFourStarPityCounter(fourStarPity);
    setLastFiveStarIsPermanent(localLastFive);
    setLastFourStarIsPermanent(localLastFour);
    setTotalPulls(prev => prev + count);
    setHistory(prev => [...results, ...prev].slice(0, 50));
    setDrawResults(results);
    
    // ✅ 大幅减少粒子数量
    const hasFiveStar = results.some(c => c.rarity === '★★★★★');
    if (hasFiveStar) {
      triggerGoldenFlash();
      spawnParticles(30, true);
    } else {
      spawnParticles(15, false);
    }
    
    setTimeout(() => {
      setPhase('reveal');
      setCurrentIndex(0);
      setIsRevealMode(true);
      setIsOpen(true);
      setIsDrawing(false);
      setIsFlipping(true);
      setTimeout(() => setIsFlipping(false), 500);
    }, 1000);
  };

  const triggerGoldenFlash = () => {
    setGoldenFlash(true);
    setTimeout(() => setGoldenFlash(false), 800);
  };

  // ===== ✅ 优化后的粒子系统 =====
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'gacha-particles';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10000;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    const resize = () => { 
      canvas.width = window.innerWidth; 
      canvas.height = window.innerHeight; 
    };
    resize();
    window.addEventListener('resize', resize);
    
    let lastTime = 0;
    const animate = (time) => {
      // ✅ 限制帧率为 30fps，减少 CPU/GPU 压力
      if (time - lastTime < 33) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > 0);
      
      // ✅ 限制同时存在的粒子数
      if (particles.length > 80) {
        particles = particles.slice(-80);
      }
      
      particles.forEach(p => {
        p.x += p.vx; 
        p.y += p.vy; 
        p.vy += 0.08;      // ✅ 加快重力，粒子更快消失
        p.life -= p.decay; 
        p.size *= 0.99;    // ✅ 加快缩小
        
        const alpha = Math.max(0, p.life);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        
        // ✅ 简化绘制：去掉 shadowBlur（最耗性能的部分）
        if (p.isStar) {
          const s = p.size;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation || 0);
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2;
            ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
            const a2 = ((i + 0.5) / 4) * Math.PI * 2;
            ctx.lineTo(Math.cos(a2) * s * 0.4, Math.sin(a2) * s * 0.4);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      const el = document.getElementById('gacha-particles');
      if (el) el.remove();
    };
  }, []);

  const spawnParticles = (count, isFiveStar) => {
    const colors = isFiveStar
      ? ['#ffd700', '#fff8dc', '#ffc107', '#ffffff']
      : ['#4fc3f7', '#81d4fa', '#b3e5fc'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 150 + 40) * (isFiveStar ? 1.5 : 1);
      particles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 150,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 150,
        vx: Math.cos(angle) * speed * (0.3 + Math.random() * 0.7),
        vy: Math.sin(angle) * speed * (0.3 + Math.random() * 0.7) - 40,
        size: Math.random() * (isFiveStar ? 8 : 5) + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.015 + Math.random() * 0.015,   // ✅ 更快衰减
        isStar: Math.random() > 0.6,
        rotation: Math.random() * 360,
      });
    }
  };

  const handleNext = () => {
    if (isFlipping) return;
    
    if (currentIndex < drawResults.length - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipping(false);
        const nextCard = drawResults[currentIndex + 1];
        // ✅ 大幅减少切换时的粒子
        if (nextCard && nextCard.rarity === '★★★★★') {
          spawnParticles(20, true);
          triggerGoldenFlash();
        } else if (nextCard && nextCard.rarity === '★★★★') {
          spawnParticles(10, false);
        }
      }, 300);
    } else {
      setShowResult(true);
      setIsRevealMode(false);
    }
  };

  const handleShowAll = () => {
    setShowResult(true);
    setIsRevealMode(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPhase('idle');
    setIsRevealMode(false);
    setShowResult(false);
    setDrawResults([]);
    setCurrentIndex(0);
    setIsFlipping(false);
  };

  const handlePoolChange = (poolId) => {
    if (isDrawing) return;
    setCurrentPoolId(poolId);
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  return (
    <Layout title="祈愿 · 抽卡" description="水神之谕 · 祈愿系统">
      <div className={styles.gachaPage}>
        {goldenFlash && <div className={styles.goldenFlash} />}
        
        <div className={styles.bgDecor1}></div>
        <div className={styles.bgDecor2}></div>
        <div className={styles.bgStars}></div>

        <div className={styles.header}>
          <h1 className={styles.title}>祈 愿</h1>
          <p className={styles.subtitle}>以水神之名 · 召唤命运中的同伴</p>
        </div>

        <div className={styles.poolSelector}>
          {POOLS.map(pool => (
            <button
              key={pool.id}
              className={`${styles.poolButton} ${currentPoolId === pool.id ? styles.poolButtonActive : ''}`}
              onClick={() => handlePoolChange(pool.id)}
              disabled={isDrawing}
            >
              {pool.name}
            </button>
          ))}
        </div>

        <div className={styles.pityBar}>
          <div className={styles.pityLabel}>
            <span>💫 保底进度</span>
            <span>{pityCounter} / {HARD_PITY}</span>
          </div>
          <div className={styles.pityTrack}>
            <div 
              className={styles.pityFill}
              style={{ 
                width: `${Math.min((pityCounter / HARD_PITY) * 100, 100)}%`,
                background: pityCounter >= SOFT_PITY_START 
                  ? 'linear-gradient(90deg, #ffd700, #ffab00)' 
                  : 'linear-gradient(90deg, #4fc3f7, #0288d1)'
              }}
            ></div>
          </div>
          <div className={styles.pityStats}>
            <span>已抽 {totalPulls} 次</span>
            <button onClick={() => setShowHistory(!showHistory)} className={styles.historyBtn}>
              {showHistory ? '收起记录' : '查看记录'}
            </button>
          </div>
        </div>

        {showHistory && (
          <div className={styles.historyPanel}>
            {history.length === 0 ? (
              <div className={styles.emptyHistory}>暂无抽卡记录</div>
            ) : (
              history.slice(0, 20).map((card, i) => (
                <div key={i} className={styles.historyItem}>
                  <img className={styles.historyImg} src={card.image} alt={card.name} />
                  <span className={styles.historyName} style={{ color: card.color }}>{card.name}</span>
                  <span className={styles.historyRarity}>{card.rarity}</span>
                </div>
              ))
            )}
          </div>
        )}

        <div className={styles.drawButtons}>
          <button 
            className={`${styles.drawBtn} ${styles.singleBtn}`}
            onClick={() => doDraw(1)}
            disabled={isDrawing}
          >
            <span className={styles.btnIcon}>✦</span>
            <span className={styles.btnText}>单抽</span>
          </button>
          
          <button 
            className={`${styles.drawBtn} ${styles.tenBtn}`}
            onClick={() => doDraw(10)}
            disabled={isDrawing}
          >
            <span className={styles.btnIcon}>✦✦</span>
            <span className={styles.btnText}>十连</span>
          </button>
        </div>

        <div className={styles.rateInfo}>
          <span>★★★★★ 0.6% | ★★★★ 5.1% | ★★★ 94.3%</span>
        </div>

        <div className={styles.previewSection}>
          <h3 className={styles.previewTitle}>✦ 本期祈愿角色 ✦</h3>
          <div className={styles.previewGrid}>
            {exclusiveCharacters.map(card => (
              <div key={card.id} className={styles.previewCard}>
                <div className={styles.previewImg}>
                  <img 
                    src={card.image} 
                    alt={card.name}
                    style={{ objectPosition: card.imagePosition || 'center 30%' }}
                  />
                </div>
                <div className={styles.previewName} style={{ color: card.rarity === '★★★★★' ? '#ffd700' : card.color }}>
                  {card.name}
                </div>
                <div className={styles.previewRarity}>{card.rarity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className={styles.resultOverlay}>
          {isRevealMode && drawResults[currentIndex] && (
            <div className={styles.revealContainer} onClick={handleNext}>
              {drawResults[currentIndex].rarity === '★★★★★' && (
                <div className={styles.goldenBurst}></div>
              )}
              {drawResults[currentIndex].rarity === '★★★★' && (
                <div className={styles.purpleBurst}></div>
              )}
              
              <div 
                className={`
                  ${styles.revealCard}
                  ${drawResults[currentIndex].rarity === '★★★★★' ? styles.revealFiveStar : ''}
                  ${drawResults[currentIndex].rarity === '★★★★' ? styles.revealFourStar : ''}
                  ${drawResults[currentIndex].rarity === '★★★' ? styles.revealThreeStar : ''}
                  ${isFlipping ? styles.cardFlipping : ''}
                `}
                style={{ 
                  borderColor: drawResults[currentIndex].rarity === '★★★★★' ? '#ffd700' 
                    : drawResults[currentIndex].rarity === '★★★★' ? '#ab47bc' 
                    : '#4fc3f7',
                }}
              >
                <div 
                  className={styles.cardStars}
                  style={{
                    color: drawResults[currentIndex].rarity === '★★★★★' ? '#ffd700' 
                      : drawResults[currentIndex].rarity === '★★★★' ? '#ab47bc' 
                      : '#4fc3f7'
                  }}
                >
                  {drawResults[currentIndex].rarity}
                </div>
                
                <div className={styles.revealImage}>
                  <img 
                    key={drawResults[currentIndex].id}
                    src={drawResults[currentIndex].image} 
                    alt={drawResults[currentIndex].name}
                    style={{
                      objectPosition: drawResults[currentIndex].imagePosition || 'center 30%'
                    }}
                  />
                  <div className={styles.imageGradient}></div>
                </div>
                
                <div className={styles.revealInfo}>
                  <div className={styles.revealName}>
                    {drawResults[currentIndex].name}
                  </div>
                  <div className={styles.revealTitle}>
                    {drawResults[currentIndex].title}
                  </div>
                </div>
                
                <div className={styles.cardFooter}>
                  ✦ 水神赐福 ✦
                </div>
              </div>

              <div className={styles.revealFooter}>
                <span className={styles.revealProgress}>
                  {currentIndex + 1} / {drawResults.length}
                </span>
                <span className={styles.revealHint}>点击继续</span>
                {drawResults.length > 1 && (
                  <button 
                    className={styles.showAllBtn} 
                    onClick={(e) => { e.stopPropagation(); handleShowAll(); }}
                  >
                    全部展示
                  </button>
                )}
              </div>
            </div>
          )}

          {showResult && (
            <div className={styles.resultContainer}>
              <div className={styles.resultHeader}>
                <h2 className={styles.resultTitle}>
                  {drawMode === 'single' ? '单抽结果' : '十连结果'}
                </h2>
                <div className={styles.resultStats}>
                  <span className={styles.star5Count}>
                    ★★★★★ {drawResults.filter(c => c.rarity === '★★★★★').length}
                  </span>
                  <span className={styles.star4Count}>
                    ★★★★ {drawResults.filter(c => c.rarity === '★★★★').length}
                  </span>
                  <span className={styles.star3Count}>
                    ★★★ {drawResults.filter(c => c.rarity === '★★★').length}
                  </span>
                </div>
              </div>
              
              <div className={`${styles.resultGrid} ${drawMode === 'single' ? styles.resultGridSingle : ''}`}>
                {drawResults.map((card, i) => (
                  <div 
                    key={i} 
                    className={`${styles.resultCard} ${card.rarity === '★★★★★' ? styles.resultFiveStar : ''}`}
                    style={{ 
                      borderColor: card.rarity === '★★★★★' ? '#ffd700' : card.color,
                      boxShadow: card.rarity === '★★★★★' 
                        ? '0 0 40px rgba(255,215,0,0.6)' 
                        : `0 0 20px ${card.color}40`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  >
                    <div className={styles.resultImage}>
                      <img 
                        src={card.image} 
                        alt={card.name}
                        style={{ objectPosition: card.imagePosition || 'center 30%' }}
                      />
                    </div>
                    <div className={styles.resultName} style={{ color: card.rarity === '★★★★★' ? '#ffd700' : card.color }}>
                      {card.name}
                    </div>
                    <div className={styles.resultRarity}>{card.rarity}</div>
                  </div>
                ))}
              </div>

              <button className={styles.closeResultBtn} onClick={handleClose}>
                ✕ 关闭
              </button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}