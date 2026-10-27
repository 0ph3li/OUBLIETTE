/* =========================================================
   L'OUBLIETTE — refused.js (the refused wing)
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const O = window.OB;
  const { $, $$ } = O;

  /* ---------- the jury: five real verdicts ---------- */
  const JURY = [
    { img: 'jury-01.jpg', pos: '50% 30%', what: 'The Fifer', who: 'Édouard Manet, 1866', v: 'no', stamp: 'Refusé', yr: 'salon 1866',
      why: 'refused by the Salon jury. a boy in a red stripe against nothing at all. Zola lost his job at a newspaper for defending it.' },
    { img: 'jury-02.jpg', pos: '50% 50%', what: 'A Burial at Ornans', who: 'Gustave Courbet, 1849–50', v: 'no', stamp: 'Refusé', yr: 'expo 1855',
      why: 'too big, too ugly, too many ordinary people at a funeral. refused for the 1855 world fair, so Courbet built his own pavilion next door.' },
    { img: 'jury-03.jpg', pos: '50% 50%', what: 'The Execution of Maximilian', who: 'Édouard Manet, 1868–69', v: 'no', stamp: 'Interdit', yr: 'salon 1869',
      why: 'the soldiers wore French-looking uniforms. the government quietly let him know it would not be shown, and banned the print too.' },
    { img: 'jury-04.jpg', pos: '50% 50%', what: 'Nocturne in Black and Gold', who: 'James McNeill Whistler, 1875', v: 'no', stamp: 'Un farthing', yr: 'london 1877',
      why: 'Ruskin said Whistler had flung “a pot of paint in the public\'s face.” Whistler sued, won one farthing in damages, and went bankrupt.' },
    { img: 'jury-05.jpg', pos: '50% 20%', what: 'Madame X', who: 'John Singer Sargent, 1884', v: 'yes', stamp: 'Accepté', yr: 'salon 1884',
      why: 'accepted, which was worse. the strap had slipped off her shoulder. Sargent painted it back up and moved to London.' },
  ];

  const stack = $('#juryStack');
  stack.innerHTML = JURY.map((j, i) => `
    <div class="jcard" style="z-index:${JURY.length - i}">
      <div class="slot" data-img="img/REFUSED/${j.img}" data-pos="${j.pos}" data-label="REFUSED/${j.img} · ${j.who}, ${j.what}" data-cursor="your verdict?"></div>
      <span class="jcard__stamp">${j.stamp}<small>${j.yr}</small></span>
    </div>`).join('');
  O.slots(stack);
  const cards = $$('.jcard', stack);
  const btns = $$('.jury__btn');
  const juryN = $('#juryN'), juryWhat = $('#juryWhat'), juryWho = $('#juryWho'), juryWhy = $('#juryWhy'), juryScore = $('#juryScore');
  let at = 0, agreed = 0, busy = false;

  // cards waiting underneath sit a little crooked, like canvases leaning on a wall
  const fan = (animate) => cards.forEach((c, i) => {
    const d = i - at; if (d < 0) return;
    const to = { rotate: d === 0 ? 0 : (d % 2 ? 4 : -3) * Math.min(d, 2), x: d * 14, y: d * -10, scale: 1 - d * .04, opacity: d > 3 ? 0 : 1 };
    if (O.motion && animate) gsap.to(c, { ...to, duration: .9, ease: 'expo.out' });
    else if (O.hasGsap) gsap.set(c, to);
  });
  const show = (i) => {
    const j = JURY[i];
    juryN.textContent = O.pad(i + 1);
    juryWho.textContent = j.who;
    juryWhy.textContent = 'your turn first.';
    if (O.motion) O.scramble(juryWhat, j.what, .7); else juryWhat.textContent = j.what;
    btns.forEach((b) => (b.disabled = false));
  };
  const finish = () => {
    const line = agreed >= 4 ? 'the 1860s would have hired you. we would not.'
      : agreed >= 2 ? 'half a juror. Napoleon III would have liked you.'
      : 'you overruled the jury. you are now banned from the Salon.';
    juryWhat.textContent = 'Verdict';
    juryWho.textContent = `you agreed with history ${agreed} times out of 5.`;
    juryWhy.textContent = line;
    juryScore.innerHTML = '<button class="jury__again" data-cursor="again">judge them again ↺</button>';
    btns.forEach((b) => (b.disabled = true));
    O.store.set('jury', agreed);
  };
  const judge = (v) => {
    if (busy || at >= JURY.length) return;
    busy = true;
    const j = JURY[at], c = cards[at], stamp = $('.jcard__stamp', c);
    const same = v === j.v;
    if (same) agreed++;
    btns.forEach((b) => (b.disabled = true));
    c.classList.add('is-judged');
    juryWhy.textContent = (same ? 'you agreed with them. ' : 'they disagreed with you. ') + j.why;
    juryScore.textContent = `you've judged ${at + 1} of 5.`;
    const next = () => {
      at++; busy = false;
      if (at < JURY.length) { fan(true); show(at); } else finish();
    };
    if (!O.motion) { stamp.style.transform = 'rotate(-14deg)'; setTimeout(next, 2600); return; }
    // the wax stamp slams down, the canvas flinches, then it's carried off
    gsap.timeline({ onComplete: next })
      .fromTo(stamp, { scale: 2.6, opacity: 0, rotate: -40 }, { scale: 1, opacity: 1, rotate: -14, duration: .38, ease: 'power4.in' })
      .to(c, { x: '+=6', y: '+=4', rotate: '+=1.5', duration: .06, yoyo: true, repeat: 3, ease: 'none' })
      .from(juryWhy, { opacity: 0, y: 10, duration: .5 }, '<')
      .to(c, { x: (v === 'no' ? -1.1 : 1.1) * innerWidth, rotate: v === 'no' ? -24 : 24, duration: 1, ease: 'power3.in' }, '+=2.4');
  };
  btns.forEach((b) => b.addEventListener('click', () => judge(b.dataset.v)));
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.jury__again')) return;
    at = 0; agreed = 0;
    cards.forEach((c) => { c.classList.remove('is-judged'); if (O.hasGsap) gsap.set($('.jcard__stamp', c), { clearProps: 'all' }); });
    juryScore.textContent = "you've judged 0 of 5.";
    fan(true); show(0);
  });
  fan(false);
  show(0);

  /* ---------- salon: the counters ---------- */
  const counters = $$('[data-count]');
  const fmt = (n, el) => Math.round(n).toLocaleString('en-US') + (el.dataset.plus !== undefined ? '+' : '');
  if (!O.motion) { counters.forEach((el) => (el.textContent = fmt(+el.dataset.count, el))); }

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

  /* ---------- 01 hero: the title rises behind her, she steps forward out of the dark ---------- */
  const l1 = O.split($('.rhero__l1')), l2 = O.split($('.rhero__l2'));
  gsap.set([l1, l2], { yPercent: 110, opacity: 0 });
  gsap.set('.rhero__fig', { opacity: 0, y: 80, filter: 'blur(18px)' });
  gsap.set('.rhero__pic, .rhero__txt, .rhero__down', { opacity: 0 });
  O.ready.then(() => {
    gsap.timeline()
      .to(l1, { yPercent: 0, opacity: 1, stagger: .05, duration: 1.4, ease: 'expo.out' }, 0)
      .to(l2, { yPercent: 0, opacity: 1, stagger: .035, duration: 1.4, ease: 'expo.out' }, .2)
      .to('.rhero__fig', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2, ease: 'expo.out' }, .5)
      .fromTo('.rhero__pic--l', { opacity: 0, x: -60, rotate: -6 }, { opacity: 1, x: 0, rotate: 0, duration: 1.6, ease: 'expo.out' }, 1)
      .fromTo('.rhero__pic--r', { opacity: 0, x: 60, rotate: 6 }, { opacity: 1, x: 0, rotate: 0, duration: 1.6, ease: 'expo.out' }, 1.1)
      .to('.rhero__txt, .rhero__down', { opacity: 1, stagger: .12, duration: 1.2 }, 1.3);
  });
  // on the way down she comes closer, the title spreads apart and the side pictures drift away
  gsap.timeline({ scrollTrigger: { trigger: '.rhero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.rhero__fig', { scale: 1.18, yPercent: 8, ease: 'none' }, 0)
    .to('.rhero__l1', { xPercent: -14, ease: 'none' }, 0)
    .to('.rhero__l2', { xPercent: 10, ease: 'none' }, 0)
    .to('.rhero__pic--l', { yPercent: -60, ease: 'none' }, 0)
    .to('.rhero__pic--r', { yPercent: -110, ease: 'none' }, 0);
  // the two side pictures lean toward the cursor
  if (O.fine) $('.rhero').addEventListener('pointermove', (e) => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    gsap.to('.rhero__pic--l', { rotateY: x * 18, rotateX: -y * 12, transformPerspective: 800, duration: .8, ease: 'power3.out' });
    gsap.to('.rhero__pic--r', { rotateY: x * -14, rotateX: -y * 10, transformPerspective: 800, duration: .8, ease: 'power3.out' });
    gsap.to('.rhero__fig .slot', { x: x * -18, y: y * -10, duration: 1.2, ease: 'power3.out' });
  });

  /* ---------- 02 1863: the year drops in digit by digit, the numbers count up ---------- */
  curtain($('.salon__pic'), 'inset(0 100% 0 0)');
  splitIn($('.salon__word'), { yPercent: 0, rotateX: 0, opacity: 0, filter: 'blur(12px)', scale: 1.4, stagger: .06, duration: 1.4 });
  gsap.from('.salon__yr span', { yPercent: -120, opacity: 0, rotate: () => O.rand(-20, 20), stagger: .12, duration: 1.3, ease: 'bounce.out', scrollTrigger: { trigger: '.salon', start: 'top 60%' } });
  gsap.from('.salon__txt p', { opacity: 0, y: 30, stagger: .12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.salon__txt', start: 'top 85%' } });
  counters.forEach((el, i) => {
    const o = { n: 0 };
    gsap.to(o, { n: +el.dataset.count, duration: 2.2, delay: i * .2, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(o.n, el)), scrollTrigger: { trigger: '.salon__count', start: 'top 92%' } });
  });
  gsap.to('.salon__yr', { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.salon', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- 03 manet: the portrait rises, the name settles on it ---------- */
  curtain($('.man__pic'));
  splitIn($('.man__name'), { stagger: .06 });
  gsap.from('.man__yrs', { opacity: 0, letterSpacing: '.6em', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.man__name', start: 'top 90%' } });
  gsap.from('.man__txt > *', { opacity: 0, y: 30, stagger: .1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.man__txt', start: 'top 70%' } });
  gsap.from('.man__quote', { rotate: -3, scale: .9, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.man__quote', start: 'top 90%' } });

  /* ---------- 04 the jury enters ---------- */
  gsap.from(cards, { y: 300, rotate: () => O.rand(-20, 20), opacity: 0, stagger: { each: .1, from: 'end' }, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.jury', start: 'top 55%' } });
  gsap.from('.jury__title > *', { yPercent: 80, opacity: 0, stagger: .15, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.jury', start: 'top 60%' } });
  gsap.from('.jury__side > *', { opacity: 0, x: 40, stagger: .07, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.jury', start: 'top 50%' } });
  // the velvet glow follows the cursor, like in the scandale room upstairs
  const jp = $('.jury');
  jp.addEventListener('pointermove', (e) => {
    const r = jp.getBoundingClientRect();
    jp.style.background = `radial-gradient(ellipse 55% 60% at ${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%, #4a1814 0%, #1d0e0c 60%, #0f0807 100%)`;
  });

  /* ---------- 05 victorine: three frames drift at three speeds ---------- */
  splitIn($('.vic__name'), { yPercent: 0, rotateX: 0, opacity: 0, filter: 'blur(14px)', scale: 1.5, stagger: .05, duration: 1.5 });
  gsap.from('.vic__sur', { opacity: 0, letterSpacing: '1em', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.vic', start: 'top 55%' } });
  [['.vic__a', -14], ['.vic__b', -12], ['.vic__c', -26]].forEach(([s, y]) => {
    curtain($(s));
    if (matchMedia('(min-width: 861px)').matches) gsap.to(s, { yPercent: y, ease: 'none', scrollTrigger: { trigger: '.vic', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.vic__label', { opacity: 0, y: 40, scale: .9, stagger: .2, duration: 1.3, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.vic__c', start: 'top 70%' } });
  gsap.from('.vic__txt, .vic__yr', { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.vic__txt', start: 'top 90%' } });

  /* ---------- 06 palafrenieri: the altarpiece swings in on its hinge, then gets taken down ---------- */
  gsap.from('.pala__frame', { rotateY: -70, transformPerspective: 1400, transformOrigin: 'left center', opacity: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.pala', start: 'top 60%' } });
  gsap.to('.pala__frame', { y: 120, rotate: 4, ease: 'none', scrollTrigger: { trigger: '.pala', start: 'center center', end: 'bottom top', scrub: true } });
  gsap.from('.pala__seal', { scale: 0, rotate: -180, duration: 1.2, ease: 'back.out(2.5)', scrollTrigger: { trigger: '.pala', start: 'top 40%' } });
  gsap.from('.pala__days', { clipPath: 'inset(0 100% 0 0)', duration: 1.6, ease: 'power3.inOut', scrollTrigger: { trigger: '.pala__days', start: 'top 85%' } });
  gsap.from('.pala__txt > :not(.pala__days)', { opacity: 0, y: 24, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.pala__txt', start: 'top 75%' } });

  /* ---------- 07 next wing ---------- */
  gsap.from('.next__arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: '.next', start: 'top 70%' } });
  splitIn($('.next__word'), { stagger: .08 });

  /* ---------- footer ---------- */
  curtain($('.ft__pic'), 'inset(0 100% 0 0)');
  gsap.from('.ft__word', { clipPath: 'inset(0 0 100% 0)', duration: 2, ease: 'power3.inOut', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
  gsap.from('.ft__side li', { opacity: 0, y: 30, stagger: .05, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.ft__poster', start: 'top 55%' } });
  gsap.from('.ft__star', { scale: 0, rotate: 180, duration: 1.4, stagger: .2, ease: 'back.out(2.5)', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
})();
