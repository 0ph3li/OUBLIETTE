/* =========================================================
   L'OUBLIETTE — visit.js (the visit)
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const O = window.OB;
  const { $, $$ } = O;

  /* ---------- paris time: the door opens at 22:00, closes at 06:00 ---------- */
  const paris = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  const isOpen = (d) => d.getHours() >= 22 || d.getHours() < 6;
  const span = (min) => { const h = Math.floor(min / 60), m = min % 60; return h ? `${h} h ${O.pad(m)} min` : `${m} min`; };
  const door = () => {
    const d = paris(), now = d.getHours() * 60 + d.getMinutes(), open = isOpen(d);
    const left = open ? (now < 360 ? 360 - now : 1800 - now) : 1320 - now;
    $('#doorState').textContent = open ? 'open' : 'closed';
    $('#flame').classList.toggle('is-out', !open);
    $('#hoursLeft').textContent = open
      ? `the candles go out in ${span(left)}. last descent at 05:00.`
      : `the keepers are asleep. the door opens in ${span(left)}.`;
    $('#vNow').textContent = open ? 'open now' : 'opens at 22:00';
  };
  door(); setInterval(door, 30000);

  /* ---------- the ticket: a night, a keeper, how many ---------- */
  const NUM = ['one', 'two', 'three', 'four', 'five', 'six'];
  const tk = { night: 0, keeper: 'Oubli', qty: 1, no: 0 };
  const nights = [];
  const today = paris();
  for (let i = 0; i < 7; i++) nights.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
  const fmtDay = (d) => d.toLocaleDateString('en-GB', { weekday: 'short' });
  const fmtLong = (d) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#nights').innerHTML = nights.map((d, i) => `<button role="radio" aria-checked="${i === 0}" class="${i === 0 ? 'is-on' : ''}" data-n="${i}">${i === 0 ? 'tonight' : fmtDay(d)}<b>${d.getDate()}</b></button>`).join('');
  const pick = (group, btn) => $$('button', group).forEach((b) => { b.classList.toggle('is-on', b === btn); b.setAttribute('aria-checked', b === btn); });
  const newNo = () => { tk.no = 1000 + Math.floor(Math.random() * 8999); };
  const print = () => {
    const d = nights[tk.night];
    $('#tkNight').textContent = tk.night === 0 ? `tonight, ${d.getDate()} ${d.toLocaleDateString('en-GB', { month: 'long' })}` : fmtLong(d);
    $('#tkKeeper').textContent = tk.keeper;
    $('#tkQty').textContent = NUM[tk.qty - 1];
    $('#qty').textContent = tk.qty;
    $('#tkNo').textContent = $('#tkNo2').textContent = `${O.pad(tk.night + 1)}-${tk.no}`;
    if (O.motion) gsap.fromTo('.vtix__main > *', { opacity: .3 }, { opacity: 1, duration: .5, stagger: .03 });
  };
  $('#nights').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; tk.night = +b.dataset.n; pick($('#nights'), b); untear(); print(); });
  $('.vtix__keepers').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; tk.keeper = b.dataset.k; pick($('.vtix__keepers'), b); untear(); print(); });
  $('#qtyDn').addEventListener('click', () => { tk.qty = Math.max(1, tk.qty - 1); untear(); print(); });
  $('#qtyUp').addEventListener('click', () => {
    if (tk.qty === 6) { O.toast('six is the most the stairs will take. the seventh always falls.'); return; }
    tk.qty++; untear(); print();
  });

  // tearing: the stub drops away, the number is kept (and promptly forgotten)
  let torn = false;
  const stub = $('#tkStub'), tear = $('#tear'), done = $('#tkDone');
  const untear = () => {
    if (!torn) return; torn = false; newNo();
    $('#tk').classList.remove('is-torn');
    if (O.motion) gsap.fromTo(stub, { opacity: 0, x: 30, rotate: 0, y: 0 }, { opacity: 1, x: 0, duration: .8, ease: 'expo.out' });
    else gsap.set(stub, { clearProps: 'all' });
    tear.querySelector('span').textContent = 'Tear the stub'; done.textContent = '';
  };
  tear.addEventListener('click', () => {
    if (torn) { untear(); print(); return; }
    torn = true;
    $('#tk').classList.add('is-torn');
    if (O.motion) gsap.timeline()
      .to(stub, { rotate: 8, x: 6, duration: .25, ease: 'power2.out' })
      .to(stub, { rotate: 38, x: 60, y: '120%', opacity: 0, duration: 1.1, ease: 'power3.in' });
    else gsap.set(stub, { opacity: 0 });
    O.store.set('ticket', JSON.stringify({ ...tk, at: Date.now() }));
    done.textContent = `stub Nº ${O.pad(tk.night + 1)}-${tk.no} kept. show it to ${tk.keeper} at the bottom of the stairs, if you still remember where you put it.`;
    tear.querySelector('span').textContent = 'Print another';
  });
  // someone already tore one on a previous visit
  try {
    const old = JSON.parse(O.store.get('ticket') || 'null');
    if (old && old.no) done.textContent = `you tore stub Nº ${O.pad(old.night + 1)}-${old.no} on a previous visit. you have, very sensibly, forgotten it.`;
  } catch (e) {}
  newNo(); print();

  /* ---------- 03 hours: a candle-sized circle of the painting follows you ---------- */
  const hours = $('.vhours'), lamp = $('#lamp');
  let mx = .7, my = .4, tx = .7, ty = .4, lastMove = 0;
  hours.addEventListener('pointermove', (e) => {
    const r = lamp.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; lastMove = performance.now();
  });
  const lampTick = (t) => {
    if (performance.now() - lastMove > 2500) { tx = .62 + Math.sin(t / 2400) * .2; ty = .42 + Math.cos(t / 3100) * .18; }
    mx += (tx - mx) * .07; my += (ty - my) * .07;
    lamp.style.setProperty('--mx', `${(mx * 100).toFixed(2)}%`); lamp.style.setProperty('--my', `${(my * 100).toFixed(2)}%`);
  };
  if (O.motion) gsap.ticker.add(() => lampTick(performance.now()));
  else lampTick(0);

  /* ---------- 04 the plan: drag the city, the pin stays on the courtyard ---------- */
  const map = $('.vmap__map'), plan = $('#plan'), pin = $('.vmap__pin');
  const pos = { x: 0, y: 0 };
  const bounds = () => ({ minX: map.clientWidth - plan.offsetWidth, minY: map.clientHeight - plan.offsetHeight });
  const place = () => {
    const b = bounds();
    pos.x = O.clamp(pos.x, b.minX, 0); pos.y = O.clamp(pos.y, b.minY, 0);
    plan.style.transform = `translate(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px)`;
  };
  const centre = () => {
    const px = parseFloat(pin.style.getPropertyValue('--x')) / 100, py = parseFloat(pin.style.getPropertyValue('--y')) / 100;
    pos.x = map.clientWidth * .5 - plan.offsetWidth * px;
    pos.y = map.clientHeight * .55 - plan.offsetHeight * py;
    place();
  };
  let drag = null;
  map.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return; // on phones the page scrolls, the map stays put
    drag = { x: e.clientX - pos.x, y: e.clientY - pos.y }; map.classList.add('is-drag'); map.setPointerCapture(e.pointerId);
  });
  map.addEventListener('pointermove', (e) => { if (!drag) return; pos.x = e.clientX - drag.x; pos.y = e.clientY - drag.y; place(); });
  const drop = () => { drag = null; map.classList.remove('is-drag'); };
  map.addEventListener('pointerup', drop); map.addEventListener('pointercancel', drop);
  addEventListener('resize', centre);
  centre();

  if (!O.motion) {
    $('.vmap__route path').style.strokeDashoffset = 0;
    $$('.vdown__steps li').forEach((li) => li.classList.add('is-on'));
    $('#stepN').textContent = '63';
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

  /* ---------- 01 hero: the cover lights up, the gallery sinks ---------- */
  const title = $('.vhero__title'), tChars = O.split(title);
  gsap.set(tChars, { yPercent: 110, opacity: 0 });
  gsap.set('.vhero__pre, .vhero__sub, .vhero__dates, .vhero__links a, .vhero__cap', { opacity: 0, y: 20 });
  gsap.set('.vhero__bg', { scale: 1.18, filter: 'brightness(0)' });
  gsap.set('.vhero__ghost', { yPercent: 60 });
  O.ready.then(() => {
    gsap.timeline()
      .to('.vhero__bg', { scale: 1.04, filter: 'brightness(1)', duration: 3, ease: 'power2.out' }, 0)
      .to('.vhero__pre', { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' }, .5)
      .to(tChars, { yPercent: 0, opacity: 1, duration: 1.4, ease: 'expo.out', stagger: .06 }, .6)
      .to('.vhero__sub, .vhero__dates', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .12 }, 1.2)
      .to('.vhero__links a', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .1 }, 1.5)
      .to('.vhero__cap', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 1.8)
      .to('.vhero__ghost', { yPercent: 0, duration: 1.8, ease: 'expo.out' }, 1.6);
  });
  gsap.timeline({ scrollTrigger: { trigger: '.vhero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.vhero__bg .slot', { yPercent: 18, scale: 1.12, ease: 'none' }, 0)
    .to('.vhero__c', { yPercent: -30, opacity: 0, ease: 'none' }, 0)
    .to('.vhero__ghost', { yPercent: -60, ease: 'none' }, 0);

  /* ---------- 02 getting down: each step lights up, the counter follows ---------- */
  splitIn($('.vdown__title'));
  gsap.from('.vdown__lead', { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.vdown__lead', start: 'top 85%' } });
  const steps = $$('.vdown__steps li'), cnt = { n: 0 };
  const countTo = (n) => gsap.to(cnt, { n, duration: 1, ease: 'power3.out', overwrite: true, onUpdate: () => ($('#stepN').textContent = O.pad(cnt.n)) });
  steps.forEach((li, i) => ScrollTrigger.create({
    trigger: li, start: 'top 62%', end: 'bottom 62%',
    onToggle: (s) => { li.classList.toggle('is-on', s.isActive || (i === steps.length - 1 && s.progress === 1)); if (s.isActive) countTo(+li.dataset.n); },
    onLeaveBack: () => { if (i === 0) countTo(0); },
  }));
  gsap.fromTo('.vdown__sticky .slot', { scale: 1.25, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.vdown', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.vdown__name, .vdown__yrs, .vdown__count', { opacity: 0, y: 30, stagger: .1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.vdown', start: 'top 60%' } });

  /* ---------- 03 hours ---------- */
  curtain($('.vhours__card'));
  splitIn($('.vhours__title'));
  gsap.from('.vhours__k, .vhours__status, .vhours__body, .vhours__table tr, .vhours__aside', { opacity: 0, y: 24, stagger: .07, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.vhours__txt', start: 'top 70%' } });
  gsap.from('.vhours__bleed', { opacity: 0, duration: 2.4, ease: 'power2.out', scrollTrigger: { trigger: '.vhours', start: 'top 60%' } });

  /* ---------- 04 contacts: the route draws itself to the courtyard ---------- */
  splitIn($('.vmap__title'));
  gsap.from('.vmap__where, .vmap__info > div', { opacity: 0, y: 24, stagger: .08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.vmap__side', start: 'top 60%' } });
  gsap.from('.vmap__map', { clipPath: 'inset(0 0 0 100%)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: '.vmap', start: 'top 70%' } });
  gsap.to('.vmap__route path', { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', scrollTrigger: { trigger: '.vmap', start: 'top 45%' } });
  gsap.from('.vmap__pin', { y: -60, opacity: 0, duration: 1.2, ease: 'bounce.out', delay: 1.6, scrollTrigger: { trigger: '.vmap', start: 'top 45%' } });

  /* ---------- 05 ticket ---------- */
  splitIn($('.vtix__title .script'));
  gsap.from('.vtix__lead, .vtix__form > *', { opacity: 0, y: 24, stagger: .05, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.vtix', start: 'top 55%' } });
  gsap.from('.vtix__ticket', { y: 80, rotate: -6, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.vtix__grid', start: 'top 75%' } });

  /* ---------- 06 thanks: the phone rises out of the dark band ---------- */
  gsap.from('.vthx__phone', { y: 120, rotate: 4, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.vthx', start: 'top 75%' } });
  splitIn($('.vthx__title'));

  /* ---------- footer ---------- */
  curtain($('.ft__pic'), 'inset(0 100% 0 0)');
  gsap.from('.ft__word', { clipPath: 'inset(0 0 100% 0)', duration: 2, ease: 'power3.inOut', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
  gsap.from('.ft__side li', { opacity: 0, y: 30, stagger: .05, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.ft__poster', start: 'top 55%' } });
  gsap.from('.ft__star', { scale: 0, rotate: 180, duration: 1.4, stagger: .2, ease: 'back.out(2.5)', scrollTrigger: { trigger: '.ft__poster', start: 'top 60%' } });
})();
