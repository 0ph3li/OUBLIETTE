/* =========================================================
   L'OUBLIETTE — home.js
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const O = window.OB;
  const { $, $$ } = O;

  /* ---------- 02 refusés: seven real works, seven real refusals ---------- */
  const REFUSED = [
    { img: 'muse-01.jpg', t: 'The Absinthe Drinker', by: 'Édouard Manet', y: '1859', why: 'refused by the Salon. a drunk is not a subject.' },
    { img: 'muse-02.jpg', t: 'Women in the Garden', by: 'Claude Monet', y: '1866', why: 'refused by the Salon of 1867. too bright, no story.' },
    { img: 'muse-03.jpg', t: 'Portrait of Achille Emperaire', by: 'Paul Cézanne', y: '1868', why: 'refused in 1870, as he was every year he tried.' },
    { img: 'muse-04.jpg', t: 'The Floor Scrapers', by: 'Gustave Caillebotte', y: '1875', why: 'refused. workmen on their knees were “vulgar”.' },
    { img: 'muse-05.jpg', t: 'Monument to Balzac', by: 'Auguste Rodin', y: '1898', why: 'refused by the writers who ordered it. “a sack of coal.”' },
    { img: 'muse-06.jpg', t: 'Nude Descending a Staircase', by: 'Marcel Duchamp', y: '1912', why: 'withdrawn on request. a nude does not descend.' },
    { img: 'muse-07.jpg', t: 'Fountain', by: 'Marcel Duchamp', y: '1917', why: 'hidden behind a partition. the original is lost.' },
  ];
  const track = $('#museTrack');
  track.innerHTML = REFUSED.map((r) => `
    <article class="card" data-cursor="refused, ${r.y}">
      <div class="slot" data-img="img/HOME/${r.img}" data-label="HOME/${r.img} · ${r.by}, ${r.t}, ${r.y}"></div>
      <span class="card__t">${r.t}</span>
      <span class="card__y">${r.by}, ${r.y}</span>
      <span class="card__why">${r.why}</span>
    </article>`).join('');
  O.slots(track);

  /* ---------- 07 painters: the ones who were told no ---------- */
  const PAINTERS = [
    { n: 'Michelangelo\nMerisi', y: '1571–1610', f: 'it' },
    { n: 'Édouard\nManet', y: '1832–1883', f: 'fr' },
    { n: 'James\nWhistler', y: '1834–1903', f: 'us' },
    { n: 'Gustave\nCourbet', y: '1819–1877', f: 'fr' },
    { n: 'Paul\nCézanne', y: '1839–1906', f: 'fr' },
    { n: 'Gustav\nKlimt', y: '1862–1918', f: 'at' },
    { n: 'Marcel\nDuchamp', y: '1887–1968', f: 'fr' },
  ];
  const pTrack = $('#pTrack');
  pTrack.innerHTML = PAINTERS.map((p) => `<div class="pname" data-f="${p.f}"><h3>${p.n}</h3><p>${p.y}</p></div>`).join('');
  $('#pFilters').addEventListener('click', (e) => {
    const li = e.target.closest('li'); if (!li) return;
    $$('#pFilters li').forEach((l) => l.classList.toggle('is-on', l === li));
    $$('.pname').forEach((p) => p.classList.toggle('is-out', li.dataset.f !== 'all' && p.dataset.f !== li.dataset.f));
    if (O.motion) gsap.fromTo('.pname:not(.is-out) h3', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .05, duration: .9, ease: 'expo.out' });
  });

  /* ---------- 04 featured: three refusals, one "next" button ---------- */
  const FEAT = [
    { who: 'Courbet', city: 'Ornans', what: "L'Atelier", yr: 'XIX', why: 'refused in 1855. so he built his own pavilion next door.' },
    { who: 'Whistler', city: 'London', what: 'Symphony in White', yr: 'XIX', why: 'refused twice in two years. too white.' },
    { who: 'Klimt', city: 'Wien', what: 'Philosophy', yr: 'XX', why: 'eighty-seven professors signed against her. she burned in 1945.' },
  ];
  const featPics = $$('.feat__pic');
  let fi = 0, featBusy = false;
  const setFeat = (i) => {
    const f = FEAT[i];
    $('#featWho').textContent = f.who; $('#featCity').textContent = f.city;
    $('#featWhat').textContent = f.what; $('#featYr').textContent = f.yr; $('#featWhy').textContent = f.why;
    $('#featN').textContent = O.pad(i + 1);
  };
  $('#featNext').addEventListener('click', () => {
    if (featBusy) return;
    fi = (fi + 1) % FEAT.length;
    if (!O.motion) { featPics.forEach((p, k) => p.classList.toggle('is-on', k === fi)); setFeat(fi); return; }
    featBusy = true;
    // a frosted pane crosses the painting and leaves a different one behind
    gsap.timeline({ onComplete: () => (featBusy = false) })
      .to(['.feat__l > *', '.feat__r > *'], { opacity: 0, y: -14, stagger: .03, duration: .35, ease: 'power2.in' }, 0)
      .fromTo('.feat__glass', { xPercent: -120 }, { xPercent: 330, duration: 1.5, ease: 'power2.inOut' }, 0)
      .call(() => { setFeat(fi); featPics.forEach((p, k) => p.classList.toggle('is-on', k === fi)); }, null, .7)
      .fromTo(featPics[fi].querySelector('.slot'), { scale: 1.15, filter: 'blur(8px)' }, { scale: 1, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out' }, .7)
      .fromTo(['.feat__l > *', '.feat__r > *'], { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .05, duration: .8, ease: 'expo.out' }, .9);
  });

  /* ---------- 08 keepers: the frosted pane sweeps over, a new borzoi sits behind it ---------- */
  const KEEP = [
    { m: 'Borzoi on green velvet', n: 'Oubli, head keeper', w: "L'Oubliette", wh: 'Paris, fourteen metres down', y: ['2017', '2026'] },
    { m: 'Borzoi on black', n: 'Rancune, night keeper', w: 'Remembers every visitor', wh: 'who ever said “my kid could do that”', y: ['2019', '2026'] },
    { m: 'Two borzois, leaning', n: 'Pardon, the apprentice', w: 'Forgives everything', wh: 'including Duchamp', y: ['2023', '2026'] },
  ];
  const keepPin = $('.keep__pin'), keepPics = $$('.keep__pic');
  const paneW = () => (matchMedia('(max-width: 860px)').matches ? '50%' : '46%');
  let ki = 0, kTl;
  const setKeepTxt = (i) => {
    const k = KEEP[i];
    $('#keepMedium').textContent = k.m; $('#keepName').textContent = k.n;
    $('#keepWho').textContent = k.w; $('#keepWhere').textContent = k.wh;
    $('#keepYrs').innerHTML = `<span>${k.y[0]}</span><span>${k.y[1]}</span>`;
    $('#keepN').textContent = O.pad(i + 1);
    keepPics.forEach((p, j) => p.classList.toggle('is-on', j === i));
  };
  const showKeeper = (i) => {
    if (i === ki) return;
    ki = i;
    if (!O.motion) { setKeepTxt(i); return; }
    kTl?.kill();
    kTl = gsap.timeline()
      .to(keepPin, { '--gw': '100%', duration: .6, ease: 'power3.in' }, 0)
      .to('.keep__txt > *', { opacity: 0, x: -10, duration: .3, stagger: .03 }, 0)
      .call(() => setKeepTxt(i))
      .fromTo(keepPics[i].querySelector('.slot'), { scale: 1.14 }, { scale: 1, duration: 1.6, ease: 'expo.out' })
      .to(keepPin, { '--gw': paneW(), duration: 1.1, ease: 'expo.out' }, '<')
      .fromTo('.keep__txt > *, .keep__yrs span', { opacity: 0, x: -14 }, { opacity: 1, x: 0, stagger: .06, duration: .9, ease: 'expo.out' }, '<.2');
  };

  if (!O.motion) {
    // no motion: the keepers take turns on a timer instead of on scroll
    setInterval(() => showKeeper((ki + 1) % 3), 4000);
    return;
  }

  /* ---------- shared reveals ---------- */
  // split titles rise letter by letter when they come into view
  const splitIn = (el, opts = {}) => {
    if (O.isScript(el)) { O.ink(el, { scrollTrigger: opts.scrollTrigger || { trigger: el, start: 'top 85%' }, delay: opts.delay || 0 }); return; }
    const chars = O.split(el);
    gsap.from(chars, { yPercent: 100, opacity: 0, rotateX: -60, duration: 1.2, ease: 'expo.out', stagger: .035, scrollTrigger: { trigger: el, start: 'top 85%' }, ...opts });
  };
  // every slot outside the pinned rooms opens like a curtain, then drifts
  const curtain = (el, from = 'inset(100% 0 0 0)') => {
    gsap.from(el, { clipPath: from, duration: 1.5, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } });
    const s = el.querySelector('.slot') || el;
    gsap.fromTo(s, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  };

  /* ---------- the gallery leans when you scroll fast (lenis velocity → skew) ---------- */
  if (O.lenis) {
    const skewTo = gsap.quickTo($$('.card, .pname'), 'skewX', { duration: .6, ease: 'power3.out' });
    O.lenis.on('scroll', ({ velocity }) => skewTo(O.clamp(velocity * -.3, -10, 10)));
  }

  /* ---------- refusés cards tilt toward the cursor, a glare slides over the varnish ---------- */
  if (O.fine) $$('.card').forEach((c) => {
    const s = c.querySelector('.slot');
    c.addEventListener('pointermove', (e) => {
      const r = s.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      gsap.to(s, { rotateY: (x - .5) * 16, rotateX: (.5 - y) * 12, transformPerspective: 900, duration: .6, ease: 'power3.out' });
      s.style.setProperty('--gx', `${x * 100}%`); s.style.setProperty('--gy', `${y * 100}%`);
    });
    c.addEventListener('pointerleave', () => gsap.to(s, { rotateY: 0, rotateX: 0, duration: 1.2, ease: 'elastic.out(1, .4)' }));
  });

  /* ---------- cream pages arrive through an arch, like walking into the next room ---------- */
  ['.sheet'].forEach((sel) => gsap.fromTo(sel,
    { clipPath: 'inset(12% 20% 0% 20% round 46vw 46vw 0px 0px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 0vw 0vw 0px 0px)', ease: 'none', scrollTrigger: { trigger: sel, start: 'top bottom', end: 'top 10%', scrub: true } }));

  /* ---------- keepers: the pane slides in from the right the first time ---------- */
  gsap.fromTo(keepPin, { '--gw': '100%' }, { '--gw': paneW(), duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.keep', start: 'top 55%' } });
  gsap.from('.keep__txt > *, .keep__yrs span', { opacity: 0, x: -20, stagger: .08, duration: 1.1, delay: .8, ease: 'expo.out', scrollTrigger: { trigger: '.keep', start: 'top 55%' } });
  keepPin.addEventListener('pointermove', (e) => {
    const r = keepPin.getBoundingClientRect();
    gsap.to('.keep__pic .slot', { x: ((e.clientX - r.left) / r.width - .5) * -24, y: ((e.clientY - r.top) / r.height - .5) * -16, duration: 1.4, ease: 'power3.out' });
  });

  /* ---------- 01 hero ---------- */
  const heroChars = O.split($('.hero__title'));
  gsap.set(heroChars, { yPercent: 100, opacity: 0 });
  gsap.set('.hero__rule', { scaleX: 0 });
  gsap.set(['.hero__sub', '.hero__links a', '.hero__peek', '.hdr', '.rail'], { opacity: 0 });
  O.ready.then(() => {
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.hero__bg .slot', { scale: 1.3, duration: 2.6 }, 0)
      .to(heroChars, { yPercent: 0, opacity: 1, duration: 1.4, stagger: .05 }, .2)
      .to('.hero__rule', { scaleX: 1, duration: 1.4, ease: 'power3.inOut' }, .6)
      .to('.hero__sub', { opacity: 1, duration: 1 }, .9)
      .to('.hero__links a', { opacity: 1, duration: 1, stagger: .12 }, 1.1)
      .from('.hero__links a', { y: 20, duration: 1.2, stagger: .12 }, 1.1)
      .to(['.hdr', '.rail'], { opacity: 1, duration: 1 }, 1.2)
      .fromTo('.hero__peek', { yPercent: 60 }, { yPercent: 18, opacity: 1, duration: 1.6 }, 1.2)
      .from('.rail__line', { scaleY: 0, duration: 1.4, ease: 'power3.inOut' }, 1.2);
  });
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__bg', { yPercent: 25 }, 0)
    .to('.hero__center', { yPercent: -40, opacity: 0 }, 0)
    .to('.hero__links', { yPercent: -60, opacity: 0 }, 0)
    .to('.hero__peek', { yPercent: -40, scale: 1.1 }, 0);

  /* ---------- 02 refusés: the gallery walks sideways, "refusés" stays behind ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    const dist = () => track.scrollWidth - innerWidth;
    const slide = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.muse', start: 'top top', end: () => '+=' + dist() * 1.1, pin: '.muse__pin', scrub: 1, invalidateOnRefresh: true },
    });
    gsap.to('.muse__bg .slot', { xPercent: -5, ease: 'none', scrollTrigger: { trigger: '.muse', start: 'top top', end: () => '+=' + dist() * 1.1, scrub: true } });
    $$('.card').forEach((c) => {
      gsap.fromTo(c.querySelector('.slot'), { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)', ease: 'none',
        scrollTrigger: { trigger: c, containerAnimation: slide, start: 'left 115%', end: 'left 70%', scrub: true },
      });
    });

    /* ---------- 07 painters: names slide past the light ---------- */
    const pDist = () => pTrack.scrollWidth - innerWidth;
    gsap.to(pTrack, {
      x: () => -pDist(), ease: 'none',
      scrollTrigger: { trigger: '.painters', start: 'top top', end: () => '+=' + pDist(), pin: '.painters__pin', scrub: 1, invalidateOnRefresh: true },
    });
    gsap.to('.painters__bg .slot', { xPercent: -6, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.painters', start: 'top top', end: () => '+=' + pDist(), scrub: true } });

    /* ---------- 08 keepers: pinned, three turns ---------- */
    ScrollTrigger.create({ trigger: '.keep', start: 'top top', end: '+=200%', pin: '.keep__pin', onUpdate: (s) => showKeeper(Math.min(2, Math.floor(s.progress * 3))) });
  });
  mm.add('(max-width: 860px)', () => {
    const t = setInterval(() => showKeeper((ki + 1) % 3), 4000);
    return () => clearInterval(t);
  });
  splitIn($('.muse__word'), { scrollTrigger: { trigger: '.muse', start: 'top 60%' } });

  /* ---------- 03 volés: the cream sheet, everything at its own speed ---------- */
  ['.sheet__a', '.sheet__b', '.sheet__c', '.sheet__d', '.sheet__e'].forEach((s, i) => curtain($(s), i % 2 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)'));
  splitIn($('.sheet__word'));
  mm.add('(min-width: 861px)', () => {
    [['.sheet__a', -60], ['.sheet__b', 50], ['.sheet__c', -30], ['.sheet__d', -90], ['.sheet__e', 70], ['.sheet__ghost-top', 40], ['.sheet__word', -20]].forEach(([s, y]) => {
      gsap.to(s, { y, ease: 'none', scrollTrigger: { trigger: '.sheet', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });
  gsap.fromTo('.sheet__ghost-bot', { yPercent: 70 }, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.sheet', start: 'center bottom', end: 'bottom bottom', scrub: true } });

  /* ---------- 04 featured ---------- */
  gsap.from('.feat__pics', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: '.feat', start: 'top 60%' } });
  gsap.from(['.feat__l > *', '.feat__r > *', '.feat__next', '.feat__count'], { opacity: 0, y: 24, stagger: .06, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.feat', start: 'top 45%' } });

  /* ---------- 05 wings: the arches open from the floor ---------- */
  gsap.from('.arch', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'power4.inOut', stagger: { each: .15, from: 'center' }, scrollTrigger: { trigger: '.wings__arches', start: 'top 75%' } });
  const ww = O.split($('.wings__word'));
  gsap.from(ww, { yPercent: () => O.rand(-90, 90), opacity: 0, filter: 'blur(10px)', duration: 1.4, ease: 'expo.out', stagger: { each: .05, from: 'random' }, scrollTrigger: { trigger: '.wings__arches', start: 'top 50%' } });
  $$('.arch .slot').forEach((s) => gsap.fromTo(s, { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.wings', start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.from('.wings__foot > *', { opacity: 0, y: 14, stagger: .08, duration: .8, scrollTrigger: { trigger: '.wings__foot', start: 'top 95%' } });
  gsap.to('.wings__seal', { rotate: 360, duration: 30, repeat: -1, ease: 'none' });

  /* ---------- 06 about ---------- */
  splitIn($('.about__title'));
  gsap.from('.about__txt p, .about__links a', { opacity: 0, y: 24, stagger: .1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.about__txt', start: 'top 85%' } });
  gsap.fromTo('.about__peek', { yPercent: 80 }, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.about__peek', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* ---------- 07 painters reveals ---------- */
  gsap.from(['.painters__head h2', '.painters__filters li', '.pname', '.painters__cent'], { opacity: 0, y: 30, stagger: .04, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.painters', start: 'top 50%' } });

  /* ---------- volés: fragonard's ribbon unrolls across the cream page ---------- */
  const ribbon = $$('.sheet__ribbon .rb');
  gsap.set(ribbon, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.to(ribbon, { strokeDashoffset: 0, ease: 'none', stagger: .02, scrollTrigger: { trigger: '.sheet', start: 'top 70%', end: 'bottom 60%', scrub: 1 } });

  /* ---------- 09 scandale: pinned; the gold script writes itself, the words light up ---------- */
  const sWord = $('.sedu__word text');
  const sWords = O.words($('.sedu__body'));
  gsap.set(sWord, { strokeDasharray: 3200, strokeDashoffset: 3200, fillOpacity: 0 });
  gsap.timeline({ scrollTrigger: { trigger: '.sedu', start: 'top top', end: '+=200%', pin: '.sedu__stage', scrub: 1 } })
    .fromTo('.sedu__fig', { scale: .55, opacity: 0, filter: 'blur(14px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: .6 }, 0)
    .from('.sedu__top > *, .sedu__col, .sedu__bars i, .sedu__dot, .sedu__rating', { opacity: 0, y: 24, stagger: .04, duration: .4 }, 0)
    .to(sWord, { strokeDashoffset: 0, duration: 1.1, ease: 'none' }, .3)
    .to(sWord, { fillOpacity: 1, duration: .4 }, 1.25)
    .from('.sedu__sub', { opacity: 0, letterSpacing: '.8em', duration: .5 }, 1.3)
    .to(sWords, { opacity: 1, stagger: .035, duration: .1 }, 1.4)
    .to('.sedu__fig', { yPercent: -6, scale: 1.05, duration: 2.4, ease: 'none' }, .6);
  $$('.sedu__spark').forEach((el, i) => gsap.to(el, { opacity: .1, scale: .5, rotate: 90, duration: O.rand(.9, 1.7), repeat: -1, yoyo: true, delay: i * .25, ease: 'sine.inOut' }));
  gsap.to('.sedu__star', { rotate: 360, duration: 16, repeat: -1, ease: 'none' });
  // the red velvet glow follows the cursor
  const stage = $('.sedu__stage');
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    stage.style.background = `radial-gradient(ellipse 55% 50% at ${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%, rgba(142, 22, 22, .6), rgba(7, 3, 3, 0) 72%), #070303`;
  });

  /* ---------- 10 tickets: the frame draws itself, the ceiling drifts, the badge pops ---------- */
  gsap.fromTo('.soc__bg', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.soc', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.soc__bg .slot', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.soc', start: 'top bottom', end: 'center center', scrub: true } });
  gsap.from('.soc__frame', { clipPath: 'inset(50% 50% 50% 50%)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: '.soc__frame', start: 'top 78%' } });
  gsap.from('.soc__corner', { scale: 0, rotate: -90, opacity: 0, duration: 1.2, stagger: .1, ease: 'back.out(2)', scrollTrigger: { trigger: '.soc__frame', start: 'top 55%' } });
  gsap.from('.soc__the', { opacity: 0, x: -60, filter: 'blur(12px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.soc__frame', start: 'top 55%' } });
  $$('.soc__big').forEach((el, i) => splitIn(el, { yPercent: 0, rotateX: 0, opacity: 0, filter: 'blur(14px)', scale: 1.4, stagger: .04, duration: 1.4, delay: i * .25, scrollTrigger: { trigger: '.soc__frame', start: 'top 55%' } }));
  gsap.from('.soc__of, .soc__price, .forget, .forget__count, .soc__info p', { opacity: 0, y: 20, stagger: .08, duration: 1, delay: .6, ease: 'expo.out', scrollTrigger: { trigger: '.soc__frame', start: 'top 45%' } });
  gsap.from('#badge', { scale: 0, duration: 1.4, ease: 'elastic.out(1, .5)', scrollTrigger: { trigger: '.soc__frame', start: 'top 40%' } });
  gsap.to('#badge', { rotate: 220, ease: 'none', scrollTrigger: { trigger: '.soc', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- footer: persephone's column rises, the word writes downward ---------- */
  curtain($('.ft__pic'), 'inset(0 100% 0 0)');
  gsap.from('.ft__word', { clipPath: 'inset(0 0 100% 0)', duration: 2, ease: 'power3.inOut', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
  gsap.from('.ft__side li', { opacity: 0, y: 30, stagger: .05, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.ft__poster', start: 'top 55%' } });
  gsap.from('.ft__star', { scale: 0, rotate: 180, duration: 1.4, stagger: .2, ease: 'back.out(2.5)', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
})();

/* ---------- the price of admission: leave something, watch it sink ---------- */
(() => {
  const O = window.OB;
  const { $ } = O;
  const form = $('#forget'), input = $('#forgetIn'), n = $('#forgotN');
  const BASE = 1208;
  const count = () => +(O.store.get('forgotten') || 0);
  n.textContent = (BASE + count()).toLocaleString('en-US');
  const LINES = ['noted. we have already forgotten it.', "it's down there now, next to the Fountain.", 'Rancune sniffed it. it smells like last year.', 'gone. you may feel lighter for a while.'];
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const txt = input.value.trim();
    if (!txt) { O.toast('the price is one thing. you gave us nothing. (fair, honestly.)'); input.focus(); return; }
    O.store.set('forgotten', count() + 1);
    input.value = '';
    const done = () => { n.textContent = (BASE + count()).toLocaleString('en-US'); O.toast(LINES[count() % LINES.length]); };
    if (!O.motion) { done(); return; }
    // the letters drop toward the pin on the map, fourteen metres down
    const ir = input.getBoundingClientRect(), pr = $('#badge').getBoundingClientRect();
    const span = document.createElement('span');
    span.className = 'falling'; span.textContent = txt;
    span.style.left = `${ir.left}px`; span.style.top = `${ir.top + 8}px`;
    document.body.append(span);
    const chars = O.split(span);
    gsap.timeline({ onComplete: () => { span.remove(); done(); } })
      .to(chars, {
        x: (i, el) => pr.left + pr.width / 2 - el.getBoundingClientRect().left,
        y: pr.top + pr.height / 2 - ir.top - 8,
        rotate: () => O.rand(-180, 180), scale: .1, opacity: 0,
        duration: 1.1, ease: 'power2.in', stagger: { each: .035, from: 'random' },
      });
  });
})();
