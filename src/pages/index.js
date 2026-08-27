import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import WaterTrail from '@site/src/components/WaterTrail';
import ClickEffect from '@site/src/components/ClickEffect';

// 主页英雄区（Hero）
function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  
  // ✅ 使用 useState 和 useEffect 监听主题变化
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检查当前主题
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme === 'dark');
    };

    // 初始检查
    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <span className={styles.waveDecoration}>〜 〜 〜 〜 〜</span>
      <div className="container">
        {/* 芙宁娜的象征：水神之冠 */}
        <div className={styles.crownEmoji}>👑</div>
        <h1 className={clsx('hero__title', styles.heroTitle)}>
          {/* ✅ 深色显示"罪人舞步旋"，浅色显示"宣布无人罪" */}
          {isDark ? (
            <>
              <span className={styles.sinnerText}>罪</span>人舞步旋
            </>
          ) : (
            '宣布无人罪'
          )}
        </h1>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          {isDark ? '"头悬剑，翩起舞，罪人舞步旋"' : '"神座崩，终成人，宣布无人罪"'}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/blog">
            ✦ 进入枫丹 ✦
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            📜 审判庭日志
          </Link>
        </div>
      </div>
    </header>
  );
}

// 主页特色区块
const FeatureList = [
  {
    title: '水之审判',
    icon: '⚖️',
    description: (
      <>
        以水神之名，审判世间万物。<br />
        每一篇文章都是一场公正的裁决。
      </>
    ),
  },
  {
    title: '歌剧与艺术',
    icon: '🎭',
    description: (
      <>
        枫丹的歌剧院永不落幕。<br />
        技术文档也能拥有艺术的灵魂。
      </>
    ),
  },
  {
    title: '原神·枫丹',
    icon: '💧',
    description: (
      <>
        水神芙宁娜的国度。<br />
        技术与艺术在此交汇，如同海露与阳光。
      </>
    ),
  },
];

function Feature({icon, title, description}) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{description}</p>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="iceking的blog"
      description="一个芙宁娜单推人的blog网站">
      <WaterTrail /> 
      <ClickEffect />
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        {/* 芙宁娜专属装饰区块 */}
        <section className={styles.furinaSection}>
          <div className="container">
            <div className={styles.furinaQuote}>
              <span className={styles.quoteMark}>"</span>
              她真的很了不起，这五百年来，但凡她的意志有丝毫松懈，枫丹都只会剩下最糟糕的结局
              <span className={styles.quoteMark}>"</span>
              <div className={styles.quoteAuthor}>—— 尘世七执政 · 芙卡洛斯</div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}