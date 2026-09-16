/* ============================================================
   碎集 · main.js
   无依赖。所有动画都遵守 prefers-reduced-motion。
   ============================================================ */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const rnd = (a, b) => a + Math.random() * (b - a);

  if (canHover) document.body.classList.add('has-pointer');

  /* ── 年份 ───────────────────────────────────────────── */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── 明暗主题 ───────────────────────────────────────── */
  const themeBtn = $('#theme-toggle');
  const rootEl = document.documentElement;

  const readTheme = () => {
    try {
      const saved = localStorage.getItem('sui-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) { /* 隐私模式下忽略 */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const applyTheme = (mode) => {
    rootEl.setAttribute('data-theme', mode);
    themeBtn?.setAttribute('aria-pressed', String(mode === 'dark'));
    document.dispatchEvent(new CustomEvent('theme:change', { detail: mode }));
  };
  applyTheme(readTheme());
  themeBtn?.addEventListener('click', () => {
    const next = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('sui-theme', next); } catch (_) {}
  });

  /* ── 首屏标题：碎开，再聚回来 ───────────────────────── */
  const title = $('#hero-title');
  let chars = [];

  if (title) {
    const text = title.textContent.trim();
    title.textContent = '';
    chars = Array.from(text).map((c) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = c === ' ' ? '\u00a0' : c;
      title.appendChild(span);
      return span;
    });

    let rects = [];
    let measureRaf = 0;
    const measure = () => {
      rects = chars.map((el) => {
        const r = el.getBoundingClientRect();
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });
    };
    const measureSoon = () => {
      if (measureRaf) return;
      measureRaf = requestAnimationFrame(() => { measureRaf = 0; measure(); });
    };

    const reset = (el) => {
      el.style.setProperty('--x', '0px');
      el.style.setProperty('--y', '0px');
      el.style.setProperty('--r', '0deg');
      el.style.setProperty('--b', '0px');
      el.classList.remove('is-off');
    };

    if (canHover && !reduce) {
      measure();
      document.fonts?.ready.then(measureSoon);
      window.addEventListener('resize', measureSoon, { passive: true });
      window.addEventListener('scroll', measureSoon, { passive: true });

      let raf = 0;
      let px = 0, py = 0;
      const RADIUS = 110;

      const paint = () => {
        raf = 0;
        chars.forEach((el, i) => {
          const base = rects[i];
          if (!base) return;
          const dx = base.cx - px;
          const dy = base.cy - py;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS) {
            const force = (1 - d / RADIUS) * 22;
            const nx = d ? dx / d : 0;
            const ny = d ? dy / d : 0;
            el.style.setProperty('--x', (nx * force).toFixed(2) + 'px');
            el.style.setProperty('--y', (ny * force * 0.7).toFixed(2) + 'px');
            el.style.setProperty('--r', (nx * force * 0.55).toFixed(2) + 'deg');
            el.style.setProperty('--b', (force * 0.06).toFixed(2) + 'px');
            el.classList.add('is-off');
          } else if (el.classList.contains('is-off')) {
            reset(el);
          }
        });
      };

      title.addEventListener('pointermove', (e) => {
        px = e.clientX;
        py = e.clientY;
        if (!raf) raf = requestAnimationFrame(paint);
      });
      title.addEventListener('pointerleave', () => chars.forEach(reset));

      // 点一下：整块碎开，然后自己长回来
      const shatter = () => {
        chars.forEach((el) => {
          el.style.transitionDuration = '.22s, .3s, .3s';
          el.style.setProperty('--x', rnd(-26, 26).toFixed(1) + 'px');
          el.style.setProperty('--y', rnd(-18, 18).toFixed(1) + 'px');
          el.style.setProperty('--r', rnd(-14, 14).toFixed(1) + 'deg');
          el.style.setProperty('--b', rnd(0.4, 2.2).toFixed(2) + 'px');
          el.classList.add('is-off');
        });
        window.setTimeout(() => {
          chars.forEach((el) => {
            el.style.transitionDuration = '';
            reset(el);
          });
        }, 340);
      };
      title.addEventListener('click', shatter);
      title.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          shatter();
        }
      });
    }
  }

  /* ── 首屏诗句：换一句 ───────────────────────────────── */
  const lines = [
    '我们只是路过了彼此的光。',
    '夜里所有的碎片都在开花。',
    '把沉默折好，放进衣袋。',
    '风穿过裂缝，像穿过一句没说完的话。',
    '我把自己拆开，才看见光。',
    '雨落在铁皮棚上，像有人在替我说话。',
    '天亮了，我把梦扫到墙角。',
    '完整是一种太用力的说法。'
  ];
  const lineEl = $('#poem-line');
  const lineBtn = $('#poem-switch');
  let lastIdx = 0;

  if (lineEl && lineBtn) {
    lineBtn.addEventListener('click', () => {
      let i = lastIdx;
      while (i === lastIdx && lines.length > 1) i = Math.floor(Math.random() * lines.length);
      lastIdx = i;
      if (reduce) { lineEl.textContent = lines[i]; return; }
      lineEl.classList.add('is-out');
      window.setTimeout(() => {
        lineEl.textContent = lines[i];
        lineEl.classList.remove('is-out');
      }, 380);
    });
  }

  /* ── 背景尘埃 ───────────────────────────────────────── */
  const canvas = $('#dust');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, dust = [], dustColor = '#17161a', raf = 0, running = true;

    const readColor = () => {
      dustColor = getComputedStyle(rootEl).getPropertyValue('--ink').trim() || '#17161a';
    };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(64, Math.max(18, Math.round((w * h) / 30000)));
      dust = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rnd(0.4, 1.5),
        vy: rnd(-0.16, -0.04),
        vx: rnd(-0.12, 0.12),
        a: rnd(0.08, 0.4),
        ph: Math.random() * Math.PI * 2,
        sp: rnd(0.006, 0.02)
      }));
    };

    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = dustColor;
      for (const p of dust) {
        p.ph += p.sp;
        p.x += p.vx + Math.sin(p.ph) * 0.18;
        p.y += p.vy;
        if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
        if (p.x < -6) p.x = w + 6;
        if (p.x > w + 6) p.x = -6;
        ctx.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(p.ph));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    build();
    readColor();
    raf = requestAnimationFrame(frame);

    let rt = 0;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = window.setTimeout(build, 180);
    }, { passive: true });

    document.addEventListener('theme:change', readColor);
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) { raf = requestAnimationFrame(frame); }
      else cancelAnimationFrame(raf);
    });
  }

  /* ── 指针微光 ───────────────────────────────────────── */
  const glow = $('#glow');
  if (glow && canHover && !reduce) {
    let tx = window.innerWidth / 2, ty = window.innerHeight / 3;
    let cx = tx, cy = ty, raf = 0, started = false;

    const loop = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      glow.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.4 ? requestAnimationFrame(loop) : 0;
    };
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!started) {
        started = true;
        cx = tx; cy = ty;
        glow.classList.add('is-on');
      }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* ── 滚动：进度、状态、导航高亮 ─────────────────────── */
  const progress = $('#progress');
  const sections = $$('main .section[id]');
  const navLinks = $$('.nav a');

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(top / max, 1) : 0})`;
      document.body.classList.toggle('is-scrolled', top > 24);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ── 入场显现（首屏由 CSS 负责，这里只管首屏以下） ─── */
  const revealItems = $$('[data-reveal]');
  const revealAll = () => revealItems.forEach((el) => el.classList.add('is-in'));

  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    let alive = false;
    const io = new IntersectionObserver((entries, obs) => {
      alive = true;
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealItems.forEach((el, i) => {
      el.style.transitionDelay = Math.min(i % 6, 5) * 70 + 'ms';
      io.observe(el);
    });

    // 兜底：万一观察器一次也没回调，别让内容永远藏着
    window.setTimeout(() => { if (!alive) revealAll(); }, 1600);
  }

  /* ── 作品手风琴 ─────────────────────────────────────── */
  $$('.work').forEach((item) => {
    const head = $('.work__head', item);
    const body = $('.work__body', item);
    if (!head || !body) return;

    const open = () => {
      item.classList.add('is-open');
      head.setAttribute('aria-expanded', 'true');
      body.style.height = body.scrollHeight + 'px';
    };
    const close = () => {
      item.classList.remove('is-open');
      head.setAttribute('aria-expanded', 'false');
      body.style.height = body.scrollHeight + 'px';
      void body.offsetHeight; // 强制回流，让 0 也能过渡
      body.style.height = '0px';
    };

    head.addEventListener('click', () => {
      item.classList.contains('is-open') ? close() : open();
    });

    body.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'height') return;
      if (item.classList.contains('is-open')) body.style.height = 'auto';
    });

    window.addEventListener('resize', () => {
      if (item.classList.contains('is-open')) {
        body.style.height = 'auto';
        body.style.height = body.scrollHeight + 'px';
      }
    }, { passive: true });
  });

  /* ── 复制邮箱 ───────────────────────────────────────── */
  const mailBtn = $('#copy-mail');
  const mailState = $('#copy-state');
  if (mailBtn) {
    const address = mailBtn.dataset.mail || '';
    const fallbackCopy = () => {
      const ta = document.createElement('textarea');
      ta.value = address;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:absolute;left:-9999px;top:0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    };

    mailBtn.addEventListener('click', async () => {
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(address);
          ok = true;
        } else {
          ok = fallbackCopy();
        }
      } catch (_) {
        ok = fallbackCopy();
      }
      mailBtn.classList.add('is-copied');
      if (mailState) mailState.textContent = ok ? '已复制 · 等你写信' : address;
      window.setTimeout(() => {
        mailBtn.classList.remove('is-copied');
        if (mailState) mailState.textContent = '点击复制';
      }, 2400);
    });
  }

  /* ── 平滑锚点（带顶栏偏移，尊重减动效） ─────────────── */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = id === '#top' ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      const y = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - 8;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });
})();
