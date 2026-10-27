/* =========================================================
   L'OUBLIETTE — stolen.js (the stolen wing)
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const O = window.OB;
  const { $, $$ } = O;
  const desktop = () => matchMedia('(min-width: 861px)').matches;

  /* ---------- the thirteen, in the order the night took them ---------- */
  const GARDNER = [
    { what: 'A Lady and Gentleman in Black', who: 'Rembrandt, 1633', pic: 0 },
    { what: 'The Storm on the Sea of Galilee', who: 'Rembrandt, 1633 · his only seascape', pic: 1 },
    { what: 'Self-Portrait', who: 'Rembrandt, 1634 · an etching the size of a stamp', pic: -1 },
    { what: 'The Concert', who: 'Vermeer, c. 1664 · one of 34 known', pic: 2 },
    { what: 'Landscape with an Obelisk', who: 'Govaert Flinck, 1638', pic: 4 },
    { what: 'Chinese gu', who: 'bronze beaker, Shang dynasty', pic: -1 },
    { what: 'La Sortie du pesage', who: 'Degas, pencil and wash', pic: -1 },
    { what: 'Cortège aux environs de Florence', who: 'Degas, pencil and wash', pic: -1 },
    { what: 'Three Mounted Jockeys', who: 'Degas, oil on paper', pic: -1 },
    { what: 'Program for an Artistic Soirée', who: 'Degas, charcoal · first study', pic: -1 },
    { what: 'Program for an Artistic Soirée', who: 'Degas, charcoal · second study', pic: -1 },
    { what: 'Eagle finial', who: "from a flag of Napoleon's Imperial Guard · they tried to take the whole flag first", pic: -1 },
    { what: 'Chez Tortoni', who: 'Manet, c. 1878–80 · the motion sensors never saw anyone go near it', pic: 3 },
  ];

  /* ---------- still missing, as of today ---------- */
  const WANTED = [
    { img: 'img/STOLEN/hero.jpg', pos: '50% 30%', t: 'Portrait of a Young Man', by: 'Raphael', since: 1945, how: 'taken from Kraków by the Nazi governor of Poland. only black and white photographs are left.' },
    { img: 'img/HOME/voles-02.jpg', pos: '50% 40%', t: 'Nativity with St Francis and St Lawrence', by: 'Caravaggio', since: 1969, how: 'cut from its frame in the Oratory of San Lorenzo, Palermo, one rainy October night.' },
    { img: 'img/HOME/wing-stolen.jpg', pos: '50% 50%', t: 'The Concert', by: 'Vermeer', since: 1990, how: 'the most valuable stolen painting in the world. ten million dollars for information.' },
    { img: 'img/HOME/voles-04.jpg', pos: '50% 50%', t: 'View of Auvers-sur-Oise', by: 'Cézanne', since: 1999, how: 'the Ashmolean, Oxford, on New Year\'s Eve. the fireworks covered the noise.' },
    { img: 'img/HOME/voles-05.jpg', pos: '50% 50%', t: 'Poppy Flowers', by: 'Van Gogh', since: 2010, how: 'stolen in Cairo in 1977, found, then stolen from the same museum again in 2010.' },
  ];
  const year = new Date().getFullYear();
  $('#wantList').innerHTML = WANTED.map((w, i) => `
    <li class="wrow" data-cursor="have you seen it?">
      <span class="wrow__rk">${O.pad(i + 1)}</span>
      <div class="slot" data-img="${w.img}" data-pos="${w.pos}" data-label="${w.img.replace('img/', '')} · ${w.by}, ${w.t}"></div>
      <p class="wrow__t">${w.t}<small>${w.by}</small></p>
      <p class="wrow__how">${w.how}</p>
      <p class="wrow__yrs" data-yrs="${year - w.since}">${year - w.since}<small>years missing</small></p>
      <span class="wrow__stamp">missing since ${w.since}</span>
    </li>`).join('');
  O.slots($('#wantList'));

  /* ---------- orbit: dots on the ring ---------- */
  const dotsBox = $('#orbitDots');
  dotsBox.innerHTML = GARDNER.map((g, i) => `<button class="odot" aria-label="${g.what}" data-i="${i}" data-cursor="${O.pad(i + 1)}"></button>`).join('');
  const dots = $$('.odot', dotsBox), pics = $$('.orbit__pic');
  const placeDots = () => {
    const r = dotsBox.clientWidth * .43;
    dots.forEach((d, i) => {
      const a = (i / GARDNER.length) * Math.PI * 2 - Math.PI / 2;
      d.style.left = `calc(50% + ${Math.cos(a) * r}px)`;
      d.style.top = `calc(50% + ${Math.sin(a) * r}px)`;
    });
  };
  placeDots(); addEventListener('resize', placeDots);
  let cur = -1, lastPic = 0;
  const trail = $('.orbit__trail');
  const clock = (i) => { const m = 84 + Math.round((i / (GARDNER.length - 1)) * 81); return `0${Math.floor(m / 60)}:${O.pad(m % 60)}`; };
  const orbitTo = (i) => {
    if (i === cur) return; cur = i;
    const g = GARDNER[i];
    dots.forEach((d, k) => { d.classList.toggle('is-lit', k <= i); d.classList.toggle('is-on', k === i); });
    $('#orbitN').textContent = O.pad(i + 1);
    $('#orbitWho').textContent = g.who;
    $('#orbitClock').textContent = clock(i);
    if (O.motion) O.scramble($('#orbitWhat'), g.what, .5); else $('#orbitWhat').textContent = g.what;
    // drawings and objects have no picture here: the last painting stays, darker
    for (let k = i; k >= 0; k--) if (GARDNER[k].pic >= 0) { lastPic = GARDNER[k].pic; break; }
    pics.forEach((p, k) => p.classList.toggle('is-on', k === lastPic));
    $('.orbit__core').style.filter = g.pic >= 0 ? '' : 'grayscale(1) brightness(.85)';
  };
  orbitTo(0);
  dots.forEach((d) => d.addEventListener('click', () => {
    const i = +d.dataset.i;
    if (O.motion && desktop() && orbitST) O.scrollTo(orbitST.start + (orbitST.end - orbitST.start) * ((i + .5) / GARDNER.length));
    else orbitTo(i);
  }));

  // the cardsharps: each slide zooms on a different pair of hands
  $$('.fing__slide .slot').forEach((s) => s.style.setProperty('--o', s.dataset.pos));

  /* ---------- the poster's halo: rays around the head ---------- */
  const halo = $('.shero__halo');
  const N = 26;
  halo.innerHTML = Array.from({ length: N }, (_, i) => {
    const a = Math.PI + (i / (N - 1)) * Math.PI, len = i % 2 ? 170 : 240, r0 = 120;
    const x1 = 300 + Math.cos(a) * r0, y1 = 300 + Math.sin(a) * r0, x2 = 300 + Math.cos(a) * (r0 + len), y2 = 300 + Math.sin(a) * (r0 + len);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" pathLength="1" />`;
  }).join('');

  const days = $('#monaDays');
  const DAYS = 843; // 21 august 1911 → mid december 1913, roughly
  let orbitST;
  if (!O.motion) { days.textContent = DAYS; return; }

  /* ---------- helpers ---------- */
  const splitIn = (el, opts = {}) => {
    if (O.isScript(el)) { O.ink(el, { scrollTrigger: opts.scrollTrigger || { trigger: el, start: 'top 85%' }, delay: opts.delay || 0 }); return; }
    const chars = O.split(el);
    gsap.from(chars, { yPercent: 100, opacity: 0, rotateX: -60, duration: 1.2, ease: 'expo.out', stagger: .035, scrollTrigger: { trigger: el, start: 'top 85%' }, ...opts });
  };
  const curtain = (el, from = 'inset(100% 0 0 0)') => {
    gsap.from(el, { clipPath: from, duration: 1.5, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } });
    const s = el.querySelector('.slot') || el;
    gsap.fromTo(s, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  };

  /* ---------- 01 hero: the halo flares, the letters spread out across the curtain ---------- */
  const rays = $$('line', halo);
  gsap.set(rays, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set('.shero__title span', { opacity: 0, y: 40, filter: 'blur(16px)' });
  gsap.set('.shero__fig', { opacity: 0, scale: 1.08 });
  gsap.set('.shero__rule i', { scaleX: 0 });
  gsap.set('.shero__top, .shero__rule span, .shero__vol, .shero__no', { opacity: 0 });
  O.ready.then(() => {
    gsap.timeline()
      .to('.shero__fig', { opacity: 1, scale: 1, duration: 2.4, ease: 'expo.out' }, 0)
      .to(rays, { strokeDashoffset: 0, duration: 1.4, ease: 'expo.out', stagger: { each: .03, from: 'center' } }, .4)
      .to('.shero__title span', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'expo.out', stagger: { each: .1, from: 'center' } }, .7)
      .to('.shero__rule i', { scaleX: 1, duration: 1.4, ease: 'power3.inOut' }, 1.1)
      .to('.shero__top, .shero__rule span, .shero__vol, .shero__no', { opacity: 1, duration: 1, stagger: .08 }, 1.3);
    // the halo keeps breathing
    gsap.to(rays, { opacity: .35, duration: 1.6, ease: 'sine.inOut', stagger: { each: .12, from: 'center', repeat: -1, yoyo: true } });
  });
  gsap.timeline({ scrollTrigger: { trigger: '.shero__poster', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.shero__title', { letterSpacing: '.3em', opacity: .2, ease: 'none' }, 0)
    .to('.shero__fig', { yPercent: 10, ease: 'none' }, 0)
    .to('.shero__halo', { scale: 1.25, rotate: 6, opacity: 0, ease: 'none' }, 0);
  gsap.from('.shero__crest rect, .shero__crest path', { opacity: 0, scale: .6, transformOrigin: 'center', stagger: .12, duration: 1.2, ease: 'back.out(2)', scrollTrigger: { trigger: '.shero__band', start: 'top 80%' } });
  gsap.from('.shero__txt', { clipPath: 'inset(0 0 100% 0)', duration: 1.6, ease: 'power3.inOut', scrollTrigger: { trigger: '.shero__band', start: 'top 75%' } });
  gsap.from('.shero__icons li', { y: 30, opacity: 0, rotate: -40, stagger: .12, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: '.shero__icons', start: 'top 90%' } });

  /* ---------- 02 orbit: pinned, the gold trail runs the 81 minutes ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    orbitST = ScrollTrigger.create({
      trigger: '.orbit', start: 'top top', end: '+=260%', pin: '.orbit__pin', scrub: true,
      onUpdate: (s) => {
        trail.style.strokeDashoffset = 1 - s.progress;
        orbitTo(Math.min(GARDNER.length - 1, Math.floor(s.progress * GARDNER.length)));
      },
    });
    gsap.to('.orbit__moon--l', { attr: { cx: 70 }, ease: 'none', scrollTrigger: { trigger: '.orbit', start: 'top top', end: '+=260%', scrub: true } });
    gsap.to('.orbit__moon--r', { attr: { cx: 930 }, ease: 'none', scrollTrigger: { trigger: '.orbit', start: 'top top', end: '+=260%', scrub: true } });
    return () => { orbitST = null; };
  });
  mm.add('(max-width: 860px)', () => {
    // on phones the night plays itself once you get there
    let t;
    ScrollTrigger.create({ trigger: '.orbit__ring', start: 'top 70%', once: true, onEnter: () => {
      let i = 0; t = setInterval(() => { orbitTo(i); trail.style.strokeDashoffset = 1 - (i + 1) / GARDNER.length; if (++i >= GARDNER.length) clearInterval(t); }, 900);
    } });
    return () => clearInterval(t);
  });
  gsap.set(dots, { scale: 0 });
  ScrollTrigger.create({ trigger: '.orbit', start: 'top 60%', once: true, onEnter: () => gsap.to(dots, { scale: 1, duration: .8, ease: 'back.out(3)', stagger: .05, clearProps: 'transform' }) });
  gsap.from('.orbit__core', { scale: .6, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.orbit', start: 'top 60%' } });
  gsap.from('.orbit__side, .orbit__c', { opacity: 0, y: 20, stagger: .08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.orbit', start: 'top 50%' } });

  /* ---------- 03 wanted: gold title, the rows slide in like file cards ---------- */
  gsap.fromTo('.want__band .slot', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.want__band', start: 'top bottom', end: 'bottom top', scrub: true } });
  curtain($('.want__band'), 'inset(0 50% 0 50%)');
  gsap.from('.want__title', { opacity: 0, scale: 1.25, letterSpacing: '.3em', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.want__band', start: 'top 60%' } });
  $$('.wrow').forEach((r) => {
    gsap.from(r, { opacity: 0, x: -60, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 90%' } });
    const y = $('.wrow__yrs', r), n = +y.dataset.yrs, o = { v: 0 };
    gsap.to(o, { v: n, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: r, start: 'top 90%' }, onUpdate: () => (y.firstChild.textContent = Math.round(o.v)) });
    gsap.from($('.wrow__stamp', r), { scale: 2.4, opacity: 0, rotate: -30, duration: .5, ease: 'power4.in', delay: .5, scrollTrigger: { trigger: r, start: 'top 90%' } });
  });

  /* ---------- 04 la joconde: the hooks wait, the days count, then she comes back ---------- */
  const d = { v: 0 };
  gsap.timeline({ scrollTrigger: { trigger: '.mona__frame', start: 'top 75%', end: 'center 35%', scrub: 1 } })
    .fromTo('.mona__pic', { yPercent: 130, opacity: 0, rotate: 6 }, { yPercent: 0, opacity: 1, rotate: 0, ease: 'power2.out', duration: .35 }, .65)
    .to(d, { v: DAYS, ease: 'none', duration: .8, onUpdate: () => (days.textContent = Math.round(d.v)) }, 0);
  gsap.from('.mona__frame', { clipPath: 'inset(50% 0 50% 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.mona__frame', start: 'top 85%' } });
  gsap.from('.mona__names span, .mona__vert, .mona__tag', { opacity: 0, letterSpacing: '.8em', stagger: .1, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.mona', start: 'top 60%' } });
  gsap.from('.mona__title .sc', { opacity: 0, y: 40, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.mona__frame', start: 'center 80%' } });
  O.ink($('.mona__title .script'), { scrollTrigger: { trigger: '.mona__frame', start: 'center 75%' }, delay: .3 });
  gsap.from('.mona__txt p', { opacity: 0, y: 30, stagger: .15, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.mona__txt', start: 'top 88%' } });

  /* ---------- 05 light fingers: slides drop onto the table one by one ---------- */
  gsap.from('.fing__title > *', { opacity: 0, y: 50, stagger: .2, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.fing', start: 'top 60%' } });
  $$('.fing__slide').forEach((s, i) => {
    gsap.from(s, { y: 120, rotate: i % 2 ? 3 : -3, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%' } });
    gsap.fromTo($('.slot', s), { '--px': i % 2 ? '4%' : '-4%' }, { '--px': i % 2 ? '-4%' : '4%', ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from($$('.fing__name, .fing__meta span', s), { opacity: 0, x: -30, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 70%' } });
  });
  gsap.from('.fing__more li', { opacity: 0, y: 30, stagger: .12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.fing__more', start: 'top 90%' } });

  /* ---------- 06 next wing ---------- */
  gsap.from('.next__arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: '.next', start: 'top 70%' } });
  splitIn($('.next__word'));

  /* ---------- footer ---------- */
  curtain($('.ft__pic'), 'inset(0 100% 0 0)');
  gsap.from('.ft__word', { clipPath: 'inset(0 0 100% 0)', duration: 2, ease: 'power3.inOut', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
  gsap.from('.ft__side li', { opacity: 0, y: 30, stagger: .05, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.ft__poster', start: 'top 55%' } });
  gsap.from('.ft__star', { scale: 0, rotate: 180, duration: 1.4, stagger: .2, ease: 'back.out(2.5)', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
})();
