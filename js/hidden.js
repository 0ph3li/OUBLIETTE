/* =========================================================
   L'OUBLIETTE — hidden.js (the hidden wing)
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const O = window.OB;
  const { $, $$ } = O;

  /* ---------- 01 the x-ray lamp: follows the cursor, wanders by itself on phones ---------- */
  const hero = $('#chero'), pic = $('#cheroPic');
  const lamp = { x: .58, y: .42, tx: .58, ty: .42 };
  let lampHand = false;
  pic.addEventListener('pointermove', (e) => {
    const r = pic.getBoundingClientRect();
    lamp.tx = (e.clientX - r.left) / r.width; lamp.ty = (e.clientY - r.top) / r.height; lampHand = true;
  });
  pic.addEventListener('pointerleave', () => { lampHand = false; });
  const lampTick = (t) => {
    if (!lampHand) { lamp.tx = .5 + Math.sin(t / 2300) * .22; lamp.ty = .48 + Math.sin(t / 1700) * .2; }
    lamp.x += (lamp.tx - lamp.x) * .08; lamp.y += (lamp.ty - lamp.y) * .08;
    hero.style.setProperty('--mx', `${(lamp.x * 100).toFixed(2)}%`);
    hero.style.setProperty('--my', `${(lamp.y * 100).toFixed(2)}%`);
    requestAnimationFrame(lampTick);
  };
  // the mask lives on .chero__xray, which reads the vars from the hero
  if (!O.reduced) requestAnimationFrame(lampTick);

  /* ---------- 03 the scalpel ---------- */
  const scrape = $('#scrape'), range = $('.scrape__range', scrape);
  const setCut = (v) => scrape.style.setProperty('--c', `${v}%`);
  range.addEventListener('input', () => setCut(range.value));
  setCut(range.value);

  /* ---------- 04 the drill holes ---------- */
  const drill = $('#drill');
  const HOLES = [[22, 30], [38, 62], [55, 26], [64, 70], [78, 44], [30, 82]];
  drill.insertAdjacentHTML('beforeend', HOLES.map(([x, y]) => `<i class="drill__hole" style="left:${x}%;top:${y}%"></i>`).join(''));

  /* ---------- 02 the skull: compress the painting along the smear ---------- */
  const vImg = $('#vaniImg');
  const A = 24.7, K = .14, S = 6; // the smear's angle, how much to squeeze it, how close to get
  const look = (p) => {
    const e = p * p * (3 - 2 * p), w = vImg.offsetWidth;
    const k = 1 + (K - 1) * e, s = 1 + (S - 1) * Math.pow(e, 1.6);
    vImg.style.transform = `translate(${(w * .027 * e).toFixed(1)}px, ${(-w * .37 * e).toFixed(1)}px) scale(${s.toFixed(3)}) rotate(${-A}deg) scaleX(${k.toFixed(3)}) rotate(${A}deg)`;
  };

  const rageCount = $('#rageCount');
  const cuts = $$('.rage__cuts path');
  if (!O.motion) {
    look(1); rageCount.textContent = 7;
    scrape.style.setProperty('--c', '60%'); $('#wcard').style.setProperty('--c', '100%');
    return;
  }

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
  const mm = gsap.matchMedia();

  /* ---------- 01 hero: the word rises behind the flowers ---------- */
  gsap.set('.chero__word', { yPercent: 40, opacity: 0 });
  gsap.set('.chero__pic', { opacity: 0, scale: 1.06 });
  gsap.set('.chero__brand, .chero__nav a, .chero__cap, .chero__hint', { opacity: 0, y: 16 });
  O.ready.then(() => {
    gsap.timeline()
      .to('.chero__pic', { opacity: 1, scale: 1, duration: 2.6, ease: 'expo.out' }, 0)
      .to('.chero__word', { yPercent: 0, opacity: 1, duration: 2.2, ease: 'expo.out' }, .3)
      .to('.chero__brand', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, .7)
      .to('.chero__nav a', { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .1 }, .9)
      .to('.chero__cap, .chero__hint', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .12 }, 1.3);
  });
  gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
    .to('.chero__word', { yPercent: -18, letterSpacing: '.06em', ease: 'none' }, 0)
    .to('.chero__pic', { yPercent: 8, ease: 'none' }, 0);

  /* ---------- 02 vanitas: pinned, you walk to the side of the painting ---------- */
  look(0);
  const lookTl = (st) => ({ trigger: '.vani', scrub: true, ...st, onUpdate: (s) => look(s.progress) });
  mm.add('(min-width: 861px)', () => {
    ScrollTrigger.create(lookTl({ start: 'top top', end: '+=180%', pin: '.vani__pin' }));
    gsap.timeline({ scrollTrigger: { trigger: '.vani', start: 'top top', end: '+=180%', scrub: true } })
      .to('.vani__title', { opacity: .18, yPercent: -10, ease: 'none', duration: .6 }, .2)
      .to('.vani__ring', { opacity: 1, scale: 1, ease: 'power2.out', duration: .2 }, .8);
  });
  mm.add('(max-width: 860px)', () => {
    ScrollTrigger.create(lookTl({ trigger: '.vani__stage', start: 'top 75%', end: 'bottom 30%' }));
    gsap.to('.vani__ring', { opacity: 1, scale: 1, scrollTrigger: { trigger: '.vani__stage', start: 'center 45%', end: 'bottom 30%', scrub: true } });
  });
  O.ink($('.vani__title'), { scrollTrigger: { trigger: '.vani', start: 'top 70%' } });
  gsap.from('.vani__star', { scale: 0, rotate: 180, duration: 1.4, ease: 'back.out(2.5)', stagger: .2, scrollTrigger: { trigger: '.vani', start: 'top 60%' } });
  gsap.from('.vani__label, .vani__glyph, .vani__cap, .vani__emblem', { opacity: 0, y: 20, stagger: .1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.vani', start: 'top 50%' } });
  gsap.from('.vani__bar', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: '.vani', start: 'top 50%' } });

  /* ---------- 03 cupid: the deck slides lay themselves down ---------- */
  curtain($('.cupi__banner'), 'inset(0 0 100% 0)');
  gsap.from('.cupi__title', { opacity: 0, y: 60, letterSpacing: '.2em', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.cupi__banner', start: 'top 60%' } });
  gsap.from('.cupi__sub', { opacity: 0, duration: 1.4, delay: .4, scrollTrigger: { trigger: '.cupi__banner', start: 'top 60%' } });
  $$('.cslide').forEach((s, i) => {
    gsap.from(s, { y: 90, opacity: 0, rotate: i % 2 ? 1.5 : -1.5, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 92%' } });
  });
  gsap.from('.cslide__toc li', { opacity: 0, x: 30, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.cslide--toc', start: 'top 75%' } });
  gsap.from('.ctime__line', { scaleX: 0, duration: 1.6, ease: 'power3.inOut', scrollTrigger: { trigger: '.cslide--time', start: 'top 75%' } });
  gsap.from('.ctime__n', { opacity: 0, y: (i) => (i % 2 ? 20 : -20), stagger: .18, duration: 1, ease: 'expo.out', delay: .4, scrollTrigger: { trigger: '.cslide--time', start: 'top 75%' } });
  // the blade sweeps once on its own to show it moves, then it's yours
  const blade = { v: 12 };
  gsap.to(blade, { v: 58, duration: 2.2, ease: 'power2.inOut', yoyo: true, repeat: 1, repeatDelay: .3,
    scrollTrigger: { trigger: scrape, start: 'top 70%', once: true },
    onUpdate: () => { if (!scrape.dataset.touched) { setCut(blade.v); range.value = blade.v; } } });
  range.addEventListener('pointerdown', () => (scrape.dataset.touched = 1));
  $$('.cnums b').forEach((b) => {
    const n = +b.dataset.count, o = { v: n > 100 ? 1600 : 0 };
    gsap.to(o, { v: n, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: b, start: 'top 88%' }, onUpdate: () => (b.textContent = Math.round(o.v)) });
  });

  /* ---------- 04 cerca trova: the deck, the ellipse, the holes ---------- */
  gsap.fromTo('.cerca__bg img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.cerca', start: 'top bottom', end: 'bottom top', scrub: true } });
  $$('.dslide').forEach((s) => gsap.from(s, { y: 100, opacity: 0, scale: .96, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 90%' } }));
  gsap.from('.dslide__cover .sc', { opacity: 0, letterSpacing: '.8em', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.dslide--cover', start: 'top 65%' } });
  O.ink($('.dslide__cover .script'), { scrollTrigger: { trigger: '.dslide--cover', start: 'top 60%' }, delay: .3 });
  const map = gsap.timeline({ scrollTrigger: { trigger: '.dslide--map', start: 'top 70%' } });
  map.fromTo('.dmap__ring', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0)
    .fromTo('.dmap__axis', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, .3)
    .from('.dmap__head, .dmap__dot--r', { opacity: 0, duration: .4 }, 1.6)
    .from('.dslide__vert', { opacity: 0, y: (i) => (i ? -40 : 40), duration: 1.2, ease: 'expo.out' }, .2)
    .from('.dmap__col', { opacity: 0, y: 20, stagger: .2, duration: 1, ease: 'expo.out' }, .8)
    .from('.dslide--map .dslide__t', { opacity: 0, x: -30, duration: 1.2, ease: 'expo.out' }, 0);
  gsap.from('.dslide__glass', { opacity: 0, y: 30, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.dslide--copy', start: 'top 60%' } });
  gsap.from('.dslide__big', { opacity: 0, letterSpacing: '.3em', duration: 2, ease: 'expo.out', scrollTrigger: { trigger: '.dslide--word', start: 'top 70%' } });
  gsap.from('.drill__hole', { scale: 0, opacity: 0, duration: .35, ease: 'back.out(3)', stagger: .35, scrollTrigger: { trigger: drill, start: 'top 75%' } });
  gsap.from('.dslide__cols p', { opacity: 0, y: 20, stagger: .15, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.dslide__cols', start: 'top 92%' } });

  /* ---------- 05 rage: seven cuts, one at a time, then the stitches ---------- */
  gsap.set(cuts, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.from('.rage__poster', { clipPath: 'inset(50% 0 50% 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.rage__poster', start: 'top 80%' } });
  gsap.from('.rage__title', { opacity: 0, scale: 1.2, filter: 'blur(14px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.rage__poster', start: 'top 60%' } });
  gsap.from('.rage__knob', { scaleX: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.rage__poster', start: 'top 70%' } });
  const rage = gsap.timeline({ scrollTrigger: { trigger: '.rage__pic', start: 'top 45%', end: 'bottom 55%', scrub: .6 } });
  cuts.forEach((c, i) => rage.to(c, { strokeDashoffset: 0, duration: .1, ease: 'power4.in', onUpdate: () => (rageCount.textContent = cuts.filter((p) => +gsap.getProperty(p, 'strokeDashoffset') < .5).length) }, i * .1));
  // mended: the cuts turn into stitches and sink under the retouching
  rage.to('.rage__star', { rotate: 45, scale: 1.3, opacity: .3, duration: .3 }, 0)
    .to(cuts, { opacity: .5, duration: .25 }, .8)
    .call(() => $('.rage__cuts').classList.toggle('is-mended', rage.scrollTrigger.direction > 0), null, .8);
  gsap.from('.rage__ev', { y: 120, rotate: 20, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.rage__poster', start: 'center 70%' } });
  gsap.from('.rage__tag, .rage__txt, .rage__by', { opacity: 0, y: 16, stagger: .12, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.rage__poster', start: 'top 50%' } });

  /* ---------- 06 the whale: the swab cleans the top card as you scroll ---------- */
  const wc = $('#wcard');
  gsap.fromTo(wc, { '--c': '0%' }, { '--c': '100%', ease: 'none', scrollTrigger: { trigger: wc, start: 'top 70%', end: 'bottom 25%', scrub: .5 } });
  gsap.from('.wcard', { y: 80, rotate: (i) => (i ? 3 : -3), opacity: 0, duration: 1.4, ease: 'expo.out', stagger: .2, scrollTrigger: { trigger: '.whale', start: 'top 70%' } });
  gsap.fromTo('.wcard--zoom .slot', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.wcard--zoom', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.whale__side', { opacity: 0, x: (i) => (i ? 40 : -40), duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.whale', start: 'top 60%' } });

  /* ---------- 07 next wing ---------- */
  gsap.from('.next__arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: '.next', start: 'top 70%' } });
  splitIn($('.next__word'));

  /* ---------- footer ---------- */
  curtain($('.ft__pic'), 'inset(0 100% 0 0)');
  gsap.from('.ft__word', { clipPath: 'inset(0 0 100% 0)', duration: 2, ease: 'power3.inOut', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
  gsap.from('.ft__side li', { opacity: 0, y: 30, stagger: .05, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.ft__poster', start: 'top 55%' } });
  gsap.from('.ft__star', { scale: 0, rotate: 180, duration: 1.4, stagger: .2, ease: 'back.out(2.5)', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
})();
