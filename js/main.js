/* =========================================================
   L'OUBLIETTE — main.js (shared engine, every page)
   the museum of everything they said no to
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const O = (window.OB = {});
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  O.$ = $; O.$$ = $$;
  O.page = document.body.dataset.page || 'home';
  O.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  O.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  O.hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  O.motion = O.hasGsap && !O.reduced;
  document.documentElement.classList.toggle('motion', O.motion);
  O.rand = (a, b) => a + Math.random() * (b - a);
  O.pad = (n, l = 2) => String(Math.max(0, Math.floor(n))).padStart(l, '0');
  O.clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // storage that never throws
  O.store = {
    get(k) { try { return localStorage.getItem('ob-' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('ob-' + k, v); } catch (e) {} },
  };

  if (O.hasGsap) gsap.registerPlugin(ScrollTrigger);
  // every visit starts at the top of the stairs
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  /* ---------- smooth scroll ---------- */
  if (window.Lenis && !O.reduced) {
    O.lenis = new Lenis({ lerp: .09, smoothWheel: true });
    if (O.hasGsap) {
      O.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => O.lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { O.lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  O.scrollTo = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (O.lenis) O.lenis.scrollTo(el ?? 0, { duration: 1.8 });
    else (el || document.body).scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- toast: a note left on the stairs ---------- */
  const toastEl = $('#toast');
  let toastT;
  O.toast = (msg, ms = 3600) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.remove('is-on'); void toastEl.offsetWidth;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), ms);
  };
  document.addEventListener('click', (e) => { const t = e.target.closest('[data-toast]'); if (t) O.toast(t.dataset.toast); });

  /* ---------- image slots: drop a file at data-img and it shows up ---------- */
  O.slot = (slot) => {
    if (slot.dataset.label && !$('.slot-label', slot)) {
      const [file, ...rest] = slot.dataset.label.split(' · ');
      const lab = document.createElement('span');
      lab.className = 'slot-label';
      lab.innerHTML = `${file}<small>${rest.join(' · ')}</small>`;
      slot.append(lab);
    }
    const src = slot.dataset.img; if (!src || slot.dataset.loaded === src) return;
    slot.dataset.loaded = src;
    const img = new Image();
    img.decoding = 'async'; img.draggable = false;
    img.alt = slot.dataset.alt || (slot.dataset.label || '').split(' · ').slice(1).join(' · ');
    if (slot.dataset.pos) img.style.objectPosition = slot.dataset.pos;
    img.onload = () => {
      if (slot.dataset.img !== src) return;
      $(':scope > img', slot)?.remove();
      slot.prepend(img);
      slot.classList.add('has-img');
    };
    img.src = src;
  };
  O.slots = (root = document) => $$('.slot', root).forEach(O.slot);
  O.slots();
  O.missing = () => console.table($$('.slot:not(.has-img)').map((s) => ({ hang_this_here: s.dataset.img })));

  /* ---------- text helpers ---------- */
  O.split = (el) => {
    if (el._split) return el._split;
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    el._split = [...text].map((p) => {
      if (p === ' ') { el.append(' '); return null; }
      const s = document.createElement('span');
      s.className = 'c'; s.setAttribute('aria-hidden', 'true'); s.textContent = p;
      el.append(s);
      return s;
    }).filter(Boolean);
    return el._split;
  };
  O.words = (el) => {
    if (el._words) return el._words;
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    el._words = words.map((w, i) => {
      const s = document.createElement('span');
      s.className = 'w'; s.textContent = w;
      el.append(s); if (i < words.length - 1) el.append(' ');
      return s;
    });
    return el._words;
  };
  // giant type: make a line exactly as wide as its box
  O.fit = (el) => {
    const p = getComputedStyle(el.parentElement);
    const box = (el.parentElement.clientWidth - parseFloat(p.paddingLeft) - parseFloat(p.paddingRight)) * (+el.dataset.fit || 1);
    el.style.fontSize = '100px';
    const w = el.scrollWidth;
    if (w) el.style.fontSize = `${(100 * box) / w}px`;
  };
  O.fitAll = () => $$('[data-fit]').forEach(O.fit);
  O.fitAll();
  document.fonts?.ready.then(() => { O.fitAll(); if (O.hasGsap) ScrollTrigger.refresh(); });
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(O.fitAll, 80); });

  // script words are joined handwriting: splitting them into letters breaks the joins and stutters,
  // so they are written in whole, left to right, like the pen is still moving
  O.isScript = (el) => getComputedStyle(el).fontFamily.includes('Monsieur');
  O.ink = (el, opts = {}) => gsap.fromTo(el,
    { clipPath: 'inset(-30% 100% -30% -10%)', x: -24, opacity: .2 },
    { clipPath: 'inset(-30% -10% -30% -10%)', x: 0, opacity: 1, duration: 2, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 85%' }, ...opts });

  // scramble: letters shuffle like a catalogue card being reread, then settle
  const GLYPHS = 'oubliette✦†‡§¶·:01789';
  O.scramble = (el, text = el.dataset.text || el.textContent, dur = 1) => {
    if (!el.dataset.text) el.dataset.text = el.textContent;
    if (!O.motion) { el.textContent = text; return; }
    const o = { p: 0 };
    gsap.to(o, {
      p: 1, duration: dur, ease: 'none',
      onUpdate: () => {
        const n = Math.floor(o.p * text.length);
        el.textContent = text.slice(0, n) + [...text.slice(n)].map((c) => (c === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('');
      },
      onComplete: () => (el.textContent = text),
    });
  };
  if (O.motion) {
    $$('.kicker, [data-scramble]').forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => O.scramble(el, el.textContent) });
    });
  }

  /* ---------- cursor: a candle flame with a label ---------- */
  const cur = $('#cursor');
  if (cur && O.fine && O.hasGsap) {
    document.documentElement.classList.add('has-cursor');
    const label = $('#cursorLabel');
    const xTo = gsap.quickTo(cur, 'x', { duration: .35, ease: 'power3.out' });
    const yTo = gsap.quickTo(cur, 'y', { duration: .35, ease: 'power3.out' });
    addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); cur.classList.add('is-on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor], a, button, label');
      const txt = t ? (t.dataset.cursor || '') : '';
      label.textContent = txt;
      cur.classList.toggle('has-label', !!txt);
      cur.classList.toggle('is-hover', !!t);
      // over a painting the ring becomes a lit glass lens
      cur.classList.toggle('is-lens', !!e.target.closest('.slot, .arch'));
    });
  }

  /* ---------- magnetic buttons ---------- */
  O.mag = (root = document) => {
    if (!O.fine || !O.hasGsap) return;
    $$('[data-mag]', root).forEach((b) => {
      if (b._mag) return; b._mag = 1;
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .3, duration: .5, ease: 'power3.out' });
      });
      b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1, .35)' }));
    });
  };
  O.mag();

  /* ---------- clock (paris, upstairs) ---------- */
  const clocks = $$('[data-clock]');
  const tick = () => {
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    clocks.forEach((c) => (c.textContent = `${O.pad(d.getHours())}:${O.pad(d.getMinutes())}`));
    const s = $('#doors'); if (s) { const h = d.getHours(); s.textContent = h >= 9 && h < 18 ? 'the louvre is open upstairs. we can hear it.' : 'the louvre is closed. we are not.'; }
  };
  tick(); setInterval(tick, 10000);

  /* ---------- header hides on the way down ---------- */
  const hdr = $('#hdr');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    hdr?.classList.toggle('is-hidden', y > lastY && y > innerHeight * .6);
    hdr?.classList.toggle('is-scrolled', y > 40);
    lastY = y;
  }, { passive: true });

  /* ---------- links: jumps + rooms still locked ---------- */
  const SOON = {
    'visit.html': 'the visit page is still being swept. bring a candle.',
    'refused.html': 'the refused wing is closed today. it took it personally.',
    'stolen.html': 'the stolen wing is missing. we are looking into it.',
    'hidden.html': 'the hidden wing is, for now, hidden.',
    'keepers.html': 'the keepers are asleep. do not wake the keepers.',
  };
  /* ---------- menu: the cream page drops down, the ghost word slides in ---------- */
  const menu = $('#menu'), menuBtn = $('#menuBtn');
  O.menu = (open) => {
    if (!menu) return;
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn?.setAttribute('aria-expanded', String(open));
    if (open) { menu.classList.add('is-open'); O.lenis?.stop(); }
    else O.lenis?.start();
    if (!O.hasGsap) { menu.style.clipPath = open ? 'none' : ''; if (!open) menu.classList.remove('is-open'); return; }
    gsap.killTweensOf(menu);
    if (open) {
      gsap.timeline()
        .to(menu, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'expo.inOut' })
        .from('.menu__ghost', { xPercent: -12, opacity: 0, duration: 1.2, ease: 'expo.out' }, .35)
        .from('.menu__main li', { yPercent: 60, opacity: 0, stagger: .07, duration: .9, ease: 'expo.out' }, .4)
        .from('.menu__side > *', { opacity: 0, x: 20, stagger: .03, duration: .6 }, .5);
    } else {
      gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .8, ease: 'expo.inOut', onComplete: () => menu.classList.remove('is-open') });
    }
  };
  menuBtn?.addEventListener('click', () => O.menu(true));
  $('#menuClose')?.addEventListener('click', () => O.menu(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.classList.contains('is-open')) O.menu(false); });

  /* ---------- left rail: the name of the room you're standing in ---------- */
  const railName = $('#railName');
  if (railName && O.hasGsap) {
    $$('[data-rail]').forEach((sec) => ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (s) => { if (s.isActive && railName.textContent !== sec.dataset.rail) { railName.textContent = sec.dataset.rail; O.scramble(railName, sec.dataset.rail, .5); } },
    }));
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu]')) O.menu(false);
    const soon = e.target.closest('[data-soon]');
    if (soon) { e.preventDefault(); O.toast(SOON[soon.getAttribute('href')] || 'this room is still locked.'); return; }
    const jump = e.target.closest('[data-jump]');
    if (jump) { e.preventDefault(); O.scrollTo(jump.getAttribute('href')); }
  });

  /* ---------- loader: down the stairs, -00 m to -14 m ---------- */
  O.ready = new Promise((resolve) => {
    const loader = $('#loader');
    const done = () => { document.body.classList.remove('is-loading'); loader?.remove(); resolve(); };
    if (!loader || !O.motion) { done(); return; }
    const depth = $('#ldDepth'), d = { m: 0 };
    gsap.timeline({ onComplete: done })
      .from('.ld-word', { opacity: 0, filter: 'blur(14px)', letterSpacing: '.2em', duration: 1.4, ease: 'power3.out' }, 0)
      .from('.ld-depth', { opacity: 0, y: 10, duration: .7 }, .3)
      .to('#ldBar', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, .3)
      .to(d, { m: 14, duration: 1.5, ease: 'power2.inOut', onUpdate: () => (depth.textContent = '−' + O.pad(d.m)) }, .3)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '+=.2');
  });

  /* ---------- tab title ---------- */
  const baseTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.title = 'forgot us already? 🕯';
    else {
      document.title = 'we remembered you ♥';
      setTimeout(() => (document.title = baseTitle), 2400);
    }
  });

  /* ---------- easter eggs ---------- */
  // konami: lights out. the whole museum goes dark except your candle
  const KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
  let dark;
  O.lightsOut = () => {
    if (!dark) {
      dark = document.createElement('div');
      dark.setAttribute('aria-hidden', 'true');
      dark.style.cssText = 'position:fixed;inset:0;z-index:140;pointer-events:none;transition:opacity .8s;opacity:0;background:radial-gradient(circle at var(--dx,50%) var(--dy,50%),transparent 0,transparent 90px,rgba(0,0,0,.97) 240px)';
      document.body.append(dark);
      addEventListener('pointermove', (e) => { dark.style.setProperty('--dx', e.clientX + 'px'); dark.style.setProperty('--dy', e.clientY + 'px'); }, { passive: true });
    }
    const on = document.documentElement.classList.toggle('dark-room');
    dark.style.opacity = on ? 1 : 0;
    O.toast(on ? 'lights out. this is how the keepers see it every night.' : 'someone found the switch. it was behind the Caravaggio.', 3800);
  };
  let keys = [], typed = '';
  addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    keys = [...keys, e.key].slice(-10);
    if (keys.join(',') === KONAMI) O.lightsOut();
    if (e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-12);
    const hit = (w) => typed.endsWith(w);
    if (hit('mona')) O.toast("she's upstairs. we have her wall.");
    if (hit('louvre')) O.toast('never heard of it.');
    if (hit('fountain')) O.toast('please do not use the fountain.');
    if (hit('woof')) O.toast('Rancune looked up. Rancune went back to sleep. Rancune will remember this.');
    if (hit('ghostly')) O.toast('concept, design & code by ghostly.grl ♥');
    if (hit('meow')) O.toast('/ᐠ｡ꞈ｡ᐟ\\  a cat got in through the drains. the borzois are pretending not to see her.', 4000);
  });

  /* ---------- console ---------- */
  const css = 'font-family:monospace;color:#efe5d3;background:#0c0907;padding:6px 10px;line-height:1.4;border-left:3px solid #c9a35e';
  console.log(`%c
   *    /\\_/\\      ✦
       ( o.o )   <3  ghostly.grl
   ✦    > ^ <   🕯     *

  L'OUBLIETTE — the museum of everything they said no to.
  type oubliette.help() for the keepers' notes`, css);
  O.help = () => {
    console.log("%coubliette.missing()    — which walls are still empty\noubliette.lightsOut()  — konami code: blow the candles out\noubliette.toast(msg)   — leave a note on the stairs\ntype \"mona\", \"louvre\", \"fountain\", \"woof\", \"meow\"", 'font-family:monospace;color:#0c0907;background:#efe5d3;padding:8px');
    return '♥';
  };
  window.oubliette = O;
})();
