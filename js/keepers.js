/* =========================================================
   L'OUBLIETTE — keepers.js (the keepers)
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const O = window.OB;
  const { $, $$ } = O;

  /* ---------- the three keepers, four things each ---------- */
  const KEEPERS = [
    { n: 'Oubli', r: 'head keeper · since 2017',
      aside: 'Oubli has slept on the green armchair since 2017. The armchair belonged to a curator who forgot it here.',
      tabs: [
        ['“There is only one way into the oubliette, and it is down. There is only one way out, and it is to forget.”', '(she has never said this. she looks like she would.)'],
        ['Walks every visitor back up the sixty-three steps and sniffs them at the top. Whatever she smells on you, you will not remember by the time you reach the métro.', 'she has never let anyone keep a memory. not even the director.'],
        ['Sleeps fourteen hours a day, all of them on velvet. Will not lie on anything Baroque. Ignores the Fountain completely.', 'refuses the stairs on Mondays.'],
        ['Came down one January through the service door, during a power cut, and refused to go back up. The museum had no rule against it, so it made her the rule.', 'nobody remembers who let her in. this is considered a good sign.'],
      ] },
    { n: 'Rancune', r: 'night keeper · since 2019',
      aside: 'Rancune works nights and sleeps days, on a cushion nobody remembers buying.',
      tabs: [
        ['“I forgive nothing. I simply wait for Oubli to finish.”', '(he has a long memory for a museum that sells forgetting.)'],
        ['Watches the stolen wing from ten at night to six in the morning. Growls at empty frames, just in case.', 'has never caught a thief. has never met one either.'],
        ['Remembers every visitor who ever said “my kid could do that”. Sits next to them, very close, for the rest of the visit.', 'eats only the crusts.'],
        ['Arrived the night of a gala, under a tablecloth, and stayed under it until 2020.', 'he still prefers tables.'],
      ] },
    { n: 'Pardon', r: 'the apprentice · since 2023',
      aside: 'Pardon is two borzois. Nobody has managed to separate them long enough to ask which one is the apprentice.',
      tabs: [
        ['“Oh, it’s fine. Come in. Bring the Duchamp.”', '(the apprentice forgives everything. it is still in training.)'],
        ['Greets visitors at the bottom of the stairs, leans on them until they sit down, and forgives them for whatever they came to forget.', 'cannot be left alone with sandwiches.'],
        ['Shares everything: the bed, the bowl, the one blanket. Has tried to share the Rokeby Venus.', 'is not allowed in the hidden wing anymore.'],
        ['Came as one puppy in a crate marked “return to sender”. The second one was in the same crate. The sender has never answered.', 'both are called Pardon. both answer.'],
      ] },
  ];
  let k = 0, tab = 0;
  const pics = $$('.kroom__pic'), ths = $$('.kroom__th'), tabs = $$('.kroom__tabs button');
  const write = (el, txt) => { if (O.motion) gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .7, ease: 'expo.out', onStart: () => (el.textContent = txt) }); else el.textContent = txt; };
  const showTab = (t) => {
    tab = t;
    tabs.forEach((b, i) => b.classList.toggle('is-on', i === t));
    const [body, sub] = KEEPERS[k].tabs[t];
    write($('#kBody'), body); write($('#kSub'), sub);
  };
  const showKeeper = (i) => {
    k = (i + KEEPERS.length) % KEEPERS.length;
    const K = KEEPERS[k];
    pics.forEach((p, n) => p.classList.toggle('is-on', n === k));
    ths.forEach((b, n) => b.classList.toggle('is-on', n === k));
    if (O.motion) O.scramble($('#kName'), K.n, .6); else $('#kName').textContent = K.n;
    write($('#kRole'), K.r); write($('#kAside'), K.aside);
    showTab(tab);
    if (O.motion) gsap.fromTo('.kroom__ring', { rotate: -40 }, { rotate: 0, duration: 1.4, ease: 'expo.out' });
  };
  tabs.forEach((b, i) => b.addEventListener('click', () => showTab(i)));
  ths.forEach((b, i) => b.addEventListener('click', () => showKeeper(i)));
  $('#kUp').addEventListener('click', () => showKeeper(k - 1));
  $('#kDown').addEventListener('click', () => showKeeper(k + 1));

  /* ---------- the night shift: who is on watch right now, Paris time ---------- */
  const halves = $$('.night__half');
  const watch = () => {
    const h = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/Paris' }).format(new Date());
    const night = h >= 22 || h < 6;
    const a = h % 2 === 0;
    halves[0].classList.toggle('is-watch', a); halves[1].classList.toggle('is-watch', !a);
    $('.night__half--a .night__k').textContent = a ? 'on watch' : 'asleep';
    $('.night__half--b .night__k').textContent = a ? 'asleep' : 'on watch';
    $('#nightWho').textContent = night ? (a ? 'Rancune' : 'Rancune, upside down') : 'nobody. it is daytime, they are both asleep';
  };
  watch(); setInterval(watch, 60000);

  /* ---------- ancestors: each painting starts too close ---------- */
  const ANC = [
    { t: 'Two Borzoi Dogs in an Interior', by: 'Philip Eustace Stretton, English, c. 1900', note: 'one of them is lying on a bearskin. the bear was not consulted.' },
    { t: 'Two Borzois on a Terrace', by: 'Otto Eerelman, Dutch, 1839–1926', note: 'a terrace, a rug laid out on the stone, and two dogs who expected nothing less.' },
    { t: 'Borzoi', by: 'Frances C. Fairman, English, 1836–1923', note: 'a head in soft blue. he is looking at something more interesting than you.' },
    { t: 'A Borzoi Dog', by: 'Philip de László, 1869–1937', note: 'a sketch, left unfinished. the borzoi lost interest before the painter did.' },
    { t: 'Wolf Hunt with Borzois', by: 'Tikhmenev, Russian, 1904', note: 'what they were bred for. ours prefer velvet.' },
  ];
  const figs = $$('.anc__fig');
  const fit = () => figs.forEach((f) => {
    const img = $('img', f); if (!img || !img.naturalWidth) return;
    const ar = img.naturalWidth / img.naturalHeight, vw = innerWidth, vh = innerHeight * (vw < 861 ? .5 : .66);
    const w = Math.min(vw * (vw < 861 ? .88 : .62), vh * ar);
    f.style.setProperty('--ar', ar); f.style.setProperty('--fw', `${w}px`);
    f.dataset.w = w; f.dataset.h = w / ar;
  });
  figs.forEach((f) => { f.style.setProperty('--o', f.dataset.o); });
  const ZOOM = 4;
  const frame = (f, z) => { // z: 1 = too close, 0 = the whole painting
    const [ox, oy] = f.dataset.o.split(' ').map((v) => parseFloat(v) / 100);
    const w = +f.dataset.w || f.offsetWidth, h = +f.dataset.h || f.offsetHeight;
    const s = 1 + (ZOOM - 1) * z;
    f.style.transform = `translate(-50%, -50%) translate(${((.5 - ox) * w * z).toFixed(1)}px, ${((.5 - oy) * h * z).toFixed(1)}px) scale(${s.toFixed(3)})`;
  };
  let ai = -1;
  const ancTo = (i) => {
    if (i === ai) return; ai = i;
    figs.forEach((f, n) => f.classList.toggle('is-on', n === i));
    $('#ancN').textContent = O.pad(i + 1);
    if (O.motion) O.scramble($('#ancT'), ANC[i].t, .5); else $('#ancT').textContent = ANC[i].t;
    $('#ancBy').textContent = ANC[i].by; $('#ancNote').textContent = ANC[i].note;
  };
  const anc = (p) => {
    const n = figs.length, i = Math.min(n - 1, Math.floor(p * n)), t = p * n - i;
    ancTo(i);
    figs.forEach((f, m) => frame(f, m < i ? 0 : m > i ? 1 : 1 - Math.min(1, t / .65)));
  };
  // the figures need the paintings' sizes before they can frame them
  const ancReady = () => { fit(); anc(ancST ? ancST.progress : 0); };
  let ancST;
  figs.forEach((f) => { const s = $('.slot', f); new MutationObserver(ancReady).observe(s, { childList: true }); });
  addEventListener('resize', ancReady);
  ancReady();

  if (!O.motion) return;

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

  /* ---------- 01 hero: down the spiral, the collage pins itself on ---------- */
  const swash = $$('.khero__swash path');
  gsap.set(swash, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set('.khero__card--top', { clipPath: 'inset(0 0 100% 0)' });
  gsap.set('.khero__card--low', { clipPath: 'inset(0 100% 0 0)' });
  gsap.set('.khero__key', { opacity: 0, y: -60, rotate: -40 });
  gsap.set('.khero__rest, .khero__txt, .khero__depth', { opacity: 0, y: 24 });
  gsap.set('.khero__stair', { scale: 1.25, rotate: -12 });
  O.ready.then(() => {
    gsap.timeline()
      .to('.khero__stair', { scale: 1, rotate: 0, duration: 2.6, ease: 'expo.out' }, 0)
      .to('.khero__card--top', { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.inOut' }, .3)
      .to('.khero__card--low', { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power4.inOut' }, .5)
      .to(swash, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: .3 }, .8)
      .to('.khero__key', { opacity: 1, y: 0, rotate: -14, duration: 1.6, ease: 'elastic.out(1, .5)' }, 1.1)
      .to('.khero__rest', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 1.2)
      .to('.khero__txt, .khero__depth', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .12 }, 1.5);
    O.ink($('.khero__title .script'), { scrollTrigger: null, delay: 1 });
    // the key keeps swinging a little on its ring
    gsap.to('.khero__key', { rotate: -8, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3 });
  });
  const dep = { m: 14 };
  gsap.timeline({ scrollTrigger: { trigger: '.khero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.khero__stair', { rotate: 18, scale: 1.2, ease: 'none' }, 0)
    .to('.khero__card--top', { yPercent: -18, ease: 'none' }, 0)
    .to('.khero__card--low', { yPercent: -6, ease: 'none' }, 0)
    .to(dep, { m: 0, ease: 'none', onUpdate: () => ($('#kDepth').textContent = '−' + O.pad(dep.m)) }, 0);

  /* ---------- 02 the room ---------- */
  const lines = $$('.kroom__lines path');
  gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.to(lines, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', stagger: .2, scrollTrigger: { trigger: '.kroom', start: 'top 60%' } });
  gsap.from('.kroom__orb', { scale: .7, opacity: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.kroom', start: 'top 60%' } });
  gsap.from('.kroom__logo, .kroom__tabs button, .kroom__name, .kroom__role, .kroom__body, .kroom__sub, .kroom__thumbs > *, .kroom__aside', { opacity: 0, y: 24, stagger: .06, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.kroom', start: 'top 50%' } });
  gsap.to('.kroom__ring', { rotate: 360, duration: 60, ease: 'none', repeat: -1 });

  /* ---------- 03 night shift: the halves drift apart in opposite directions ---------- */
  gsap.fromTo('.night__half--a .slot', { xPercent: -5 }, { xPercent: 5, ease: 'none', scrollTrigger: { trigger: '.night', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.night__half--b .slot', { xPercent: 5 }, { xPercent: -5, ease: 'none', scrollTrigger: { trigger: '.night', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.night__half--a', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: '.night', start: 'top 75%' } });
  gsap.from('.night__half--b', { clipPath: 'inset(0 0 100% 0)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: '.night', start: 'top 45%' } });
  gsap.from('.night__mid', { opacity: 0, scale: .92, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.night__mid', start: 'top 80%' } });
  O.ink($('.night__title .script'), { scrollTrigger: { trigger: '.night__mid', start: 'top 75%' }, delay: .3 });

  /* ---------- 04 ancestors: pinned, each painting steps back ---------- */
  ancST = ScrollTrigger.create({ trigger: '.anc', start: 'top top', end: `+=${figs.length * 90}%`, pin: '.anc__pin', scrub: true, onUpdate: (s) => anc(s.progress), onRefresh: ancReady });
  gsap.from('.anc__cap, .anc__k, .anc__hint', { opacity: 0, y: 24, stagger: .1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.anc', start: 'top 60%' } });

  /* ---------- 05 next wing ---------- */
  gsap.from('.next__arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: '.next', start: 'top 70%' } });
  splitIn($('.next__word'));

  /* ---------- footer ---------- */
  curtain($('.ft__pic'), 'inset(0 100% 0 0)');
  gsap.from('.ft__word', { clipPath: 'inset(0 0 100% 0)', duration: 2, ease: 'power3.inOut', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
  gsap.from('.ft__side li', { opacity: 0, y: 30, stagger: .05, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.ft__poster', start: 'top 55%' } });
  gsap.from('.ft__star', { scale: 0, rotate: 180, duration: 1.4, stagger: .2, ease: 'back.out(2.5)', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
})();
