import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// ===== 角色库 =====
const ALL_CHARACTERS = [
  // ===== 常驻角色（包含三星、四星、五星） =====
  // 五星常驻
  { id: 1, name: '芙宁娜', title: '水神 · 审判', emoji: '👑', rarity: '★★★★★', color: '#ffd700', description: '"罪人舞步旋，水神之审判永不停歇。"', isPermanent: false },
  { id: 2, name: '那维莱特', title: '最高审判官', emoji: '⚖️', rarity: '★★★★★', color: '#4fc3f7', description: '"枫丹的律法，便是我的意志。"', isPermanent: false },
  { id: 5, name: '娜维娅', title: '刺玫会会长', emoji: '🌹', rarity: '★★★★★', color: '#ffb74d', description: '"刺玫会的大门永远为你敞开。"', isPermanent: false },
  { id: 7, name: '芙卡洛斯', title: '水神 · 原初', emoji: '🌟', rarity: '★★★★★', color: '#ff6b6b', description: '"她真的很了不起，这五百年来..."', isPermanent: false },
  { id: 14, name: '七七', title: '不卜庐 · 吉祥物', emoji: '🧊', rarity: '★★★★★', color: '#ffd700', description: '"我叫七七，是个僵尸"', isPermanent: true },
  // ===== 四星默认全部为常驻 =====
  { id: 3, name: '琳妮特', title: '魔术助手', emoji: '🎭', rarity: '★★★★', color: '#81d4fa', description: '"魔术的精髓在于优雅。"', isPermanent: true },
  { id: 4, name: '菲米尼', title: '潜水员', emoji: '🐧', rarity: '★★★★', color: '#80cbc4', description: '"海露的深处，藏着秘密。"', isPermanent: true },
  { id: 6, name: '克洛琳德', title: '决斗代理人', emoji: '⚔️', rarity: '★★★★', color: '#a1887f', description: '"决斗的规则，由我来定。"', isPermanent: true },
  { id: 12, name: '行秋', title: '飞云商会二少爷', emoji: '📖', rarity: '★★★★', color: '#4dd0e1', description: '"读书人的事，能算偷么？"', isPermanent: true },
  { id: 13, name: '林尼', title: '魔术师', emoji: '🎩', rarity: '★★★★', color: '#ce93d8', description: '"表演开始了，请睁大眼睛。"', isPermanent: true },
  // 常驻三星
  { id: 8, name: '大便', title: '厕所里的', emoji: '💩', rarity: '★★★', color: '#3e2723', description: '"！？区区？！"', isPermanent: true },
  // ===== 限定五星角色 =====
  { id: 9, name: '钟离', title: '岩神 · 契约', emoji: '🗿', rarity: '★★★★★', color: '#ffb300', description: '"我虽无意逐鹿，却知苍生苦楚。"', isPermanent: false },
  { id: 10, name: '胡桃', title: '往生堂 · 堂主', emoji: '🔥', rarity: '★★★★★', color: '#ff6b6b', description: '"客官，往生堂了解一下？"', isPermanent: false },
  { id: 11, name: '甘雨', title: '璃月·七星秘书', emoji: '🌿', rarity: '★★★★★', color: '#66bb6a', description: '"为了璃月，我愿意付出一切。"', isPermanent: false },
  // ===== 限定四星角色（在卡池中指定） =====
  // 注意：这些角色在全局中 isPermanent 仍为 true，但在卡池中被标记为限定
  // 我们在卡池中通过 fourStarIds 来指定哪些四星在该卡池中为限定
];
// ===== 卡池定义 =====
// ✅ 新增 fourStarIds 字段：指定该卡池的限定四星角色
const POOLS = [
  {
    id: 'test',
    name: '测试卡池',
    fiveStarIds: [1,7,9],          // 暂无五星限定
    fourStarIds: [3,4,12],          // 暂无四星限定
  },
];

// 将限定四星角色添加到全局角色库中（但标记为常驻，在卡池中通过 fourStarIds 指定）
// 注意：这些角色在全局中 isPermanent: true，但在抽卡时会被识别为限定
ALL_CHARACTERS.push(
  
);

// ===== 辅助函数 =====
const getCharacterById = (id) => ALL_CHARACTERS.find(c => c.id === id);

const getPermanentByRarity = (rarity) => ALL_CHARACTERS.filter(c => c.isPermanent && c.rarity === rarity);

// ✅ 获取当前卡池的限定五星角色
const getPoolFiveStarExclusive = (poolId) => {
  const pool = POOLS.find(p => p.id === poolId);
  if (!pool) return [];
  return pool.fiveStarIds.map(id => getCharacterById(id)).filter(c => c && c.rarity === '★★★★★');
};

// ✅ 获取当前卡池的限定四星角色
const getPoolFourStarExclusive = (poolId) => {
  const pool = POOLS.find(p => p.id === poolId);
  if (!pool) return [];
  return pool.fourStarIds.map(id => getCharacterById(id)).filter(c => c && c.rarity === '★★★★');
};

// ✅ 获取当前卡池的限定角色（用于预览）
const getPoolExclusive = (poolId) => {
  const pool = POOLS.find(p => p.id === poolId);
  if (!pool) return [];
  const all = [];
  pool.fiveStarIds.forEach(id => { const c = getCharacterById(id); if (c) all.push(c); });
  pool.fourStarIds.forEach(id => { const c = getCharacterById(id); if (c) all.push(c); });
  return all;
};

// ✅ 获取当前卡池的限定角色（按星级分组）
const getPoolExclusiveByRarity = (poolId, rarity) => {
  if (rarity === '★★★★★') {
    return getPoolFiveStarExclusive(poolId);
  } else if (rarity === '★★★★') {
    return getPoolFourStarExclusive(poolId);
  }
  return [];
};

// 全局粒子数组
let particles = [];
let animationId = null;

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
  const [currentPoolId, setCurrentPoolId] = useState(POOLS[0].id);
  const exclusiveCharacters = getPoolExclusive(currentPoolId);
  
  const [currentCard, setCurrentCard] = useState(null);
  const [history, setHistory] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // 保底相关
  const [pityCounter, setPityCounter] = useState(0);
  const [totalPulls, setTotalPulls] = useState(0);
  const [pullsSinceFiveStar, setPullsSinceFiveStar] = useState(0);
  const [fourStarPityCounter, setFourStarPityCounter] = useState(0);
  
  // 大保底状态（独立）
  const [lastFiveStarIsPermanent, setLastFiveStarIsPermanent] = useState(false);
  const [lastFourStarIsPermanent, setLastFourStarIsPermanent] = useState(false);
  
  // 十连相关
  const [isTenPull, setIsTenPull] = useState(false);
  const [tenPullResults, setTenPullResults] = useState([]);
  const [goldenFlash, setGoldenFlash] = useState(false);
  const [isFiveStar, setIsFiveStar] = useState(false);
  const [fiveStarCards, setFiveStarCards] = useState([]);
  const [currentFiveStarIndex, setCurrentFiveStarIndex] = useState(-1);
  const [isFiveStarRevealMode, setIsFiveStarRevealMode] = useState(false);
  
  // 动画阶段
  const [phase, setPhase] = useState('idle');
  const [previewEmoji, setPreviewEmoji] = useState('✨');
  const [showCloseBtn, setShowCloseBtn] = useState(false);
  const [goldenParticles, setGoldenParticles] = useState([]);
  const [currentStarScheme, setCurrentStarScheme] = useState(null);

  // ===== 概率配置 =====
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

  // ===== ✅ 判断角色是否为当前卡池限定（四星或五星） =====
  const isExclusiveInPool = (card, poolId) => {
    if (!card) return false;
    const pool = POOLS.find(p => p.id === poolId);
    if (!pool) return false;
    if (card.rarity === '★★★★★') {
      return pool.fiveStarIds.includes(card.id);
    } else if (card.rarity === '★★★★') {
      return pool.fourStarIds.includes(card.id);
    }
    return false;
  };

  // ===== ✅ 判断角色是否为常驻（在当前卡池中） =====
  const isPermanentInPool = (card, poolId) => {
    return !isExclusiveInPool(card, poolId);
  };

  // ===== 单抽用：根据星级和各自保底状态选择角色 =====
  const getCardByStarLevel = (starLevel, poolId, lastFive, lastFour) => {
    const rarityMap = { 5: '★★★★★', 4: '★★★★', 3: '★★★' };
    const targetRarity = rarityMap[starLevel];

    // 三星：固定常驻
    if (starLevel === 3) {
      const permanentPool = getPermanentByRarity(targetRarity);
      return permanentPool.length > 0 
        ? permanentPool[Math.floor(Math.random() * permanentPool.length)]
        : ALL_CHARACTERS.filter(c => c.isPermanent)[Math.floor(Math.random() * ALL_CHARACTERS.filter(c => c.isPermanent).length)];
    }

    // 四星或五星
    const exclusivePool = getPoolExclusiveByRarity(poolId, targetRarity);
    
    // 如果当前卡池没有该星级限定，直接抽取常驻，且不触发大保底
    if (exclusivePool.length === 0) {
      const permanentPool = getPermanentByRarity(targetRarity);
      const card = permanentPool.length > 0 
        ? permanentPool[Math.floor(Math.random() * permanentPool.length)]
        : ALL_CHARACTERS.filter(c => c.isPermanent)[Math.floor(Math.random() * ALL_CHARACTERS.filter(c => c.isPermanent).length)];
      if (starLevel === 5) setLastFiveStarIsPermanent(false);
      else if (starLevel === 4) setLastFourStarIsPermanent(false);
      return card;
    }

    // 有专属角色，按规则抽取（各自独立）
    let usePermanent = false;
    if (starLevel === 5) {
      if (lastFive === true) {
        usePermanent = false; // 必出限定五星
      } else {
        usePermanent = Math.random() < 0.5;
      }
    } else { // 四星
      if (lastFour === true) {
        usePermanent = false; // 必出限定四星
      } else {
        usePermanent = Math.random() < 0.5;
      }
    }

    let selectedCard = null;
    if (usePermanent) {
      // 抽取常驻
      const permanentPool = getPermanentByRarity(targetRarity);
      selectedCard = permanentPool.length > 0 
        ? permanentPool[Math.floor(Math.random() * permanentPool.length)]
        : ALL_CHARACTERS.filter(c => c.isPermanent)[Math.floor(Math.random() * ALL_CHARACTERS.filter(c => c.isPermanent).length)];
      if (starLevel === 5) setLastFiveStarIsPermanent(true);
      else if (starLevel === 4) setLastFourStarIsPermanent(true);
    } else {
      // 抽取限定
      selectedCard = exclusivePool[Math.floor(Math.random() * exclusivePool.length)];
      if (starLevel === 5) setLastFiveStarIsPermanent(false);
      else if (starLevel === 4) setLastFourStarIsPermanent(false);
    }

    return selectedCard || ALL_CHARACTERS[0];
  };

  // ===== 纯函数版本（十连用） =====
  const getCardByStarLevelPure = (starLevel, poolId, lastFive, lastFour) => {
    const rarityMap = { 5: '★★★★★', 4: '★★★★', 3: '★★★' };
    const targetRarity = rarityMap[starLevel];

    if (starLevel === 3) {
      const permanentPool = getPermanentByRarity(targetRarity);
      const card = permanentPool.length > 0 
        ? permanentPool[Math.floor(Math.random() * permanentPool.length)]
        : ALL_CHARACTERS.filter(c => c.isPermanent)[Math.floor(Math.random() * ALL_CHARACTERS.filter(c => c.isPermanent).length)];
      return { card, isPermanent: false };
    }

    const exclusivePool = getPoolExclusiveByRarity(poolId, targetRarity);
    if (exclusivePool.length === 0) {
      const permanentPool = getPermanentByRarity(targetRarity);
      const card = permanentPool.length > 0 
        ? permanentPool[Math.floor(Math.random() * permanentPool.length)]
        : ALL_CHARACTERS.filter(c => c.isPermanent)[Math.floor(Math.random() * ALL_CHARACTERS.filter(c => c.isPermanent).length)];
      return { card, isPermanent: false };
    }

    let usePermanent = false;
    if (starLevel === 5) {
      if (lastFive === true) {
        usePermanent = false;
      } else {
        usePermanent = Math.random() < 0.5;
      }
    } else { // 四星
      if (lastFour === true) {
        usePermanent = false;
      } else {
        usePermanent = Math.random() < 0.5;
      }
    }

    let card = null;
    let isPermanentFlag = false;
    if (usePermanent) {
      const permanentPool = getPermanentByRarity(targetRarity);
      card = permanentPool.length > 0 
        ? permanentPool[Math.floor(Math.random() * permanentPool.length)]
        : ALL_CHARACTERS.filter(c => c.isPermanent)[Math.floor(Math.random() * ALL_CHARACTERS.filter(c => c.isPermanent).length)];
      isPermanentFlag = true;
    } else {
      card = exclusivePool[Math.floor(Math.random() * exclusivePool.length)];
      isPermanentFlag = false;
    }

    return { card: card || ALL_CHARACTERS[0], isPermanent: isPermanentFlag };
  };

  // ===== 单抽逻辑 =====
  const drawCard = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setIsTenPull(false);
    setTenPullResults([]);
    setIsFiveStarRevealMode(false);
    setFiveStarCards([]);

    const fiveStarRate = getFiveStarRate(pityCounter, pullsSinceFiveStar);
    const roll = Math.random() * 100;
    let starLevel;
    let isFiveStarResult = false;

    if (roll < fiveStarRate || pityCounter >= HARD_PITY) {
      starLevel = 5;
      isFiveStarResult = true;
      setPullsSinceFiveStar(0);
      setPityCounter(0);
      setFourStarPityCounter(0);
    } else {
      setPityCounter(prev => prev + 1);
      setPullsSinceFiveStar(prev => prev + 1);
      
      const isFourStarGuaranteed = fourStarPityCounter >= FOUR_STAR_HARD_PITY - 1;
      if (isFourStarGuaranteed) {
        starLevel = 4;
        setFourStarPityCounter(0);
      } else if (roll < fiveStarRate + FOUR_STAR_BASE_RATE) {
        starLevel = 4;
        setFourStarPityCounter(0);
      } else {
        starLevel = 3;
        setFourStarPityCounter(prev => prev + 1);
      }
    }

    setTotalPulls(prev => prev + 1);

    const card = getCardByStarLevel(starLevel, currentPoolId, lastFiveStarIsPermanent, lastFourStarIsPermanent);

    setCurrentCard(card);
    const scheme = getStarColors(card.rarity);
    setCurrentStarScheme(scheme);
    setHistory(prev => [card, ...prev].slice(0, 20));
    setIsFiveStar(isFiveStarResult);

    setPhase('preview');
    setShowCloseBtn(false);
    setPreviewEmoji(card.emoji);
    setIsOpen(true);
    particles = [];
    
    if (isFiveStarResult) {
      triggerGoldenFlash();
      spawnParticles(100, true, scheme);
      setTimeout(() => spawnParticles(60, true, scheme), 200);
      setTimeout(() => spawnParticles(40, true, scheme), 400);
    } else {
      spawnParticles(40, false, scheme);
    }
    
    setTimeout(() => {
      setPhase('transition');
      if (isFiveStarResult) {
        spawnParticles(60, true, scheme);
      } else {
        spawnParticles(30, false, scheme);
      }
    }, 1500);
    
    setTimeout(() => {
      setPhase('reveal');
      setShowCloseBtn(true);
      if (isFiveStarResult) {
        spawnParticles(70, true, scheme);
      } else {
        spawnParticles(50, true, scheme);
      }
      setIsDrawing(false);
    }, 2500);
  };

  // ===== 十连抽逻辑 =====
  const drawTenCards = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setIsTenPull(true);
    setShowCloseBtn(false);
    setIsFiveStarRevealMode(false);
    setFiveStarCards([]);
    setCurrentFiveStarIndex(-1);

    const results = [];
    let pity = pityCounter;
    let pullsSinceFive = pullsSinceFiveStar;
    let fourStarPity = fourStarPityCounter;
    let fiveStarCount = 0;
    let fourStarCount = 0;
    const fiveStarList = [];

    let localLastFive = lastFiveStarIsPermanent;
    let localLastFour = lastFourStarIsPermanent;

    for (let i = 0; i < 10; i++) {
      const fiveStarRate = getFiveStarRate(pity, pullsSinceFive);
      const roll = Math.random() * 100;
      let starLevel;

      if (roll < fiveStarRate || pity >= HARD_PITY) {
        starLevel = 5;
        fiveStarCount++;
        pity = 0;
        pullsSinceFive = 0;
        fourStarPity = 0;
      } else {
        pity++;
        pullsSinceFive++;
        
        const isFourStarGuaranteed = fourStarPity >= FOUR_STAR_HARD_PITY - 1;
        if (isFourStarGuaranteed) {
          starLevel = 4;
          fourStarCount++;
          fourStarPity = 0;
        } else if (roll < fiveStarRate + FOUR_STAR_BASE_RATE) {
          starLevel = 4;
          fourStarCount++;
          fourStarPity = 0;
        } else {
          starLevel = 3;
          fourStarPity++;
        }
      }

      const { card, isPermanent } = getCardByStarLevelPure(starLevel, currentPoolId, localLastFive, localLastFour);
      
      results.push(card);
      if (starLevel === 5) {
        fiveStarList.push(card);
        localLastFive = isPermanent;
      } else if (starLevel === 4) {
        localLastFour = isPermanent;
      }
    }

    setPityCounter(pity);
    setPullsSinceFiveStar(pullsSinceFive);
    setFourStarPityCounter(fourStarPity);
    setLastFiveStarIsPermanent(localLastFive);
    setLastFourStarIsPermanent(localLastFour);
    setTotalPulls(prev => prev + 10);
    setHistory(prev => [...results, ...prev].slice(0, 20));
    setTenPullResults(results);

    const hasFiveStar = results.some(c => c.rarity === '★★★★★');
    setIsFiveStar(hasFiveStar);

    if (hasFiveStar && fiveStarList.length > 0) {
      setFiveStarCards(fiveStarList);
      setCurrentFiveStarIndex(0);
      setIsFiveStarRevealMode(true);
      setShowCloseBtn(false);
      
      const firstCard = fiveStarList[0];
      setCurrentCard(firstCard);
      const scheme = getStarColors(firstCard.rarity);
      setCurrentStarScheme(scheme);
      setPreviewEmoji(firstCard.emoji);
      setIsOpen(true);
      particles = [];
      
      triggerGoldenFlash();
      spawnParticles(120, true, scheme);
      setTimeout(() => spawnParticles(80, true, scheme), 200);
      setTimeout(() => spawnParticles(50, true, scheme), 400);
      
      setPhase('preview');
      setTimeout(() => setPhase('transition'), 1500);
      setTimeout(() => {
        setPhase('reveal');
        setIsDrawing(false);
      }, 2500);
    } else {
      const mainCard = results.find(c => c.rarity === '★★★★') || results[0];
      setCurrentCard(mainCard);
      const scheme = getStarColors(mainCard.rarity);
      setCurrentStarScheme(scheme);
      setPreviewEmoji(mainCard.emoji);
      setIsOpen(true);
      particles = [];
      spawnParticles(50, true, scheme);
      
      setPhase('preview');
      setTimeout(() => setPhase('transition'), 1500);
      setTimeout(() => {
        setPhase('reveal');
        setShowCloseBtn(true);
        setIsDrawing(false);
      }, 2500);
    }
  };

  // ===== 触发金色闪光 =====
  const triggerGoldenFlash = () => {
    setGoldenFlash(true);
    setTimeout(() => setGoldenFlash(false), 800);
  };

  // ===== 切换卡池 =====
  const handlePoolChange = (poolId) => {
    if (isDrawing) return;
    setCurrentPoolId(poolId);
    closeCard();
  };

  // ===== 弹窗滚动禁用 =====
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

  // ===== 粒子Canvas =====
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

  // ===== 生成粒子 =====
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

  // ===== 点击卡片继续 =====
  const handleCardClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isFiveStarRevealMode) return;
    if (phase !== 'reveal') return;
    if (isDrawing) return;
    
    const nextIndex = currentFiveStarIndex + 1;
    
    if (nextIndex < fiveStarCards.length) {
      setIsDrawing(true);
      const card = fiveStarCards[nextIndex];
      setCurrentFiveStarIndex(nextIndex);
      setCurrentCard(card);
      const scheme = getStarColors(card.rarity);
      setCurrentStarScheme(scheme);
      setPreviewEmoji(card.emoji);
      particles = [];
      
      triggerGoldenFlash();
      spawnParticles(100, true, scheme);
      setTimeout(() => spawnParticles(60, true, scheme), 200);
      
      setPhase('preview');
      setTimeout(() => setPhase('transition'), 1200);
      setTimeout(() => {
        setPhase('reveal');
        setIsDrawing(false);
      }, 2000);
    } else {
      setIsFiveStarRevealMode(false);
      setShowCloseBtn(true);
      setFiveStarCards([]);
      setCurrentFiveStarIndex(-1);
      
      const mainCard = tenPullResults.find(c => c.rarity === '★★★★★') 
        || tenPullResults.find(c => c.rarity === '★★★★')
        || tenPullResults[0];
      setCurrentCard(mainCard);
      const scheme = getStarColors(mainCard.rarity);
      setCurrentStarScheme(scheme);
      setPreviewEmoji(mainCard.emoji);
      
      setPhase('reveal');
      spawnParticles(60, true, scheme);
      setIsDrawing(false);
    }
  };

  const closeCard = () => {
    setIsOpen(false);
    setPhase('idle');
    setShowCloseBtn(false);
    particles = [];
    setIsFiveStar(false);
    setIsFiveStarRevealMode(false);
    setFiveStarCards([]);
    setCurrentFiveStarIndex(-1);
    setTimeout(() => setCurrentCard(null), 300);
  };

  const clearAllData = () => {
    if (window.confirm('确定要清空所有抽卡记录吗？')) {
      setHistory([]);
      setTotalPulls(0);
      setPityCounter(0);
      setPullsSinceFiveStar(0);
      setFourStarPityCounter(0);
      setLastFiveStarIsPermanent(false);
      setLastFourStarIsPermanent(false);
      setTenPullResults([]);
      setIsFiveStar(false);
      setIsFiveStarRevealMode(false);
      setFiveStarCards([]);
      setCurrentFiveStarIndex(-1);
    }
  };

  // ===== 渲染内容 =====
  const renderContent = () => {
    if (!currentCard) return null;

    const scheme = currentStarScheme || getStarColors(currentCard.rarity);
    const isFiveStarCard = currentCard.rarity === '★★★★★';
    const isInRevealMode = isFiveStarRevealMode && fiveStarCards.length > 0;

    if (phase === 'preview') {
      return (
        <div 
          className={styles.previewContainer}
          style={{
            borderColor: isFiveStarCard ? '#ffd700' : scheme.border,
            boxShadow: isFiveStarCard ? `0 0 100px rgba(255,215,0,0.6)` : `0 0 80px ${scheme.glow}`
          }}
        >
          <div 
            className={styles.rotatingGlow}
            style={{
              background: `conic-gradient(
                from 0deg, 
                transparent, 
                ${isFiveStarCard ? 'rgba(255,215,0,0.4)' : scheme.primary + '33'}, 
                transparent, 
                ${isFiveStarCard ? 'rgba(255,215,0,0.6)' : scheme.primary + '55'}, 
                transparent
              )`
            }}
          ></div>
          <div 
            className={styles.previewEmoji}
            style={{
              filter: isFiveStarCard 
                ? `drop-shadow(0 0 80px rgba(255,215,0,0.8))` 
                : `drop-shadow(0 0 60px ${scheme.glow})`
            }}
          >
            {previewEmoji}
          </div>
          <div 
            className={styles.previewHint}
            style={{ color: isFiveStarCard ? '#ffd700' : scheme.primary }}
          >
            {isFiveStarCard ? '✦ 金光降临 ✦' : '✦ 星轨汇聚中 ✦'}
          </div>
          <div className={styles.previewSubHint}>
            {isFiveStarCard ? '⭐ 水神之选 ⭐' : '水神之谕 · 降临'}
          </div>
        </div>
      );
    }

    if (phase === 'transition') {
      return (
        <div 
          className={styles.transitionContainer}
          style={{
            background: isFiveStarCard 
              ? `radial-gradient(ellipse at center, rgba(255,215,0,0.25) 0%, rgba(255,215,0,0.05) 50%, transparent 70%)`
              : `radial-gradient(ellipse at center, ${scheme.primary}15 0%, transparent 70%)`
          }}
        >
          <div 
            className={styles.transitionGlow}
            style={{
              background: isFiveStarCard 
                ? `radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0.1) 60%)`
                : `radial-gradient(circle, ${scheme.primary}30 0%, transparent 60%)`
            }}
          ></div>
          <div 
            className={styles.transitionBurst}
            style={{ color: isFiveStarCard ? '#ffd700' : scheme.primary }}
          >
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>
          <div 
            className={styles.transitionText}
            style={{ color: isFiveStarCard ? '#ffd700' : scheme.primary }}
          >
            {isFiveStarCard ? '· 金光汇聚 ·' : '· 光芒汇聚 ·'}
          </div>
        </div>
      );
    }

    if (phase === 'reveal') {
      const hasFiveStar = tenPullResults.some(c => c.rarity === '★★★★★');
      
      return (
        <div 
          className={`${styles.cardBorder} ${isFiveStarCard ? styles.fiveStar : ''}`}
          style={{ 
            borderColor: isFiveStarCard ? '#ffd700' : currentCard.color, 
            boxShadow: isFiveStarCard 
              ? `0 0 80px rgba(255,215,0,0.6), 0 0 160px rgba(255,215,0,0.2)` 
              : `0 0 80px ${currentCard.color}60` 
          }}
          onPointerDown={isInRevealMode ? handleCardClick : undefined}
          style={{ 
            cursor: isInRevealMode ? 'pointer' : 'default',
            touchAction: isInRevealMode ? 'manipulation' : 'auto',
            borderColor: isFiveStarCard ? '#ffd700' : currentCard.color, 
            boxShadow: isFiveStarCard 
              ? `0 0 80px rgba(255,215,0,0.6), 0 0 160px rgba(255,215,0,0.2)` 
              : `0 0 80px ${currentCard.color}60` 
          }}
        >
          <div className={`${styles.cardRarity} ${isFiveStarCard ? styles.fiveStar : ''}`}>
            {currentCard.rarity}
          </div>
          <div className={styles.cardEmoji}>{currentCard.emoji}</div>
          <div className={`${styles.cardName} ${isFiveStarCard ? styles.fiveStar : ''}`} style={{ color: currentCard.color }}>
            {currentCard.name}
          </div>
          <div className={styles.cardTitle}>{currentCard.title}</div>
          <div className={styles.cardDescription}>"{currentCard.description}"</div>
          
          {isInRevealMode && (
            <div className={styles.clickHint}>✨ 点击继续 ✨</div>
          )}
          
          {!isInRevealMode && isTenPull && tenPullResults.length > 1 && (
            <div className={styles.tenPullList}>
              {tenPullResults.map((card, idx) => (
                <span key={idx} className={styles.tenPullItem}>
                  {card.emoji}
                </span>
              ))}
            </div>
          )}
          
          <div className={`${styles.cardWatermark} ${isFiveStarCard ? styles.fiveStar : ''}`}>
            {isTenPull 
              ? (hasFiveStar ? '✦ 十连 · 出金！ ✦' : '✦ 十连 · 下次一定 ✦')
              : (isFiveStarCard ? '✦ 水神赐福 · 传说 ✦' : '✦ 水神赐福 ✦')}
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
        {goldenFlash && <div className={styles.goldenFlash} />}
        
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
          <h3 className={styles.previewTitle}>
            ✦ 当前卡池专属角色 ({exclusiveCharacters.length}) ✦
          </h3>
          <div className={styles.previewGrid}>
            {exclusiveCharacters.length > 0 ? (
              exclusiveCharacters.map(card => (
                <div key={card.id} className={styles.previewCard}>
                  <div className={styles.previewEmoji}>{card.emoji}</div>
                  <div className={styles.previewName} style={{ color: card.color }}>
                    {card.name}
                  </div>
                  <div className={styles.previewRarity}>{card.rarity}</div>
                </div>
              ))
            ) : (
              <div className={styles.emptyPreview}>该卡池暂无专属角色</div>
            )}
          </div>
          <div className={styles.permanentHint}>
            ⭐ 三星及大部分四星/五星角色来自常驻池
          </div>
        </div>
      </div>

      {isOpen && currentCard && (
        <div className={styles.overlay} onClick={phase === 'reveal' && !isFiveStarRevealMode ? closeCard : undefined}>
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