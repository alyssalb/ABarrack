/* shared.js — runs on every page */

// ── SCROLL TO TOP
(function(){
  const btn = document.getElementById('top-btn');
  if(!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, {passive:true});
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();

// ── MOBILE NAV
(function(){
  const hamburger = document.querySelector('.nav-hamburger');
  const links = document.querySelector('.nav-links');
  if(!hamburger || !links) return;
  hamburger.addEventListener('click', () => links.classList.toggle('open'));
})();

// ── SCROLL REVEAL
(function(){
  const els = document.querySelectorAll('.card, .showcase-card, .carousel-slide');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const delay = parseInt(e.target.dataset.delay) || 0;
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          e.target.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
          e.target.classList.add('visible');
        }, delay);
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.08});

  document.querySelectorAll('.card-grid, .showcase-row').forEach(grid => {
    [...grid.children].forEach((el, i) => {
      el.dataset.delay = i * 130;
      obs.observe(el);
    });
  });
  // also observe any standalone cards not in a grid
  els.forEach(el => { if(!el.dataset.delay) obs.observe(el); });
})();

// ── GLITTER CANVAS
(function(){
  const canvas = document.getElementById('glitter');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#E8641A','#4A8C3F','#C4530F','#A8C99E','#F4C9A8','#FDE8F0'];
  const particles = Array.from({length:40}, () => ({
    x: Math.random() * 1400, y: Math.random() * 700,
    r: Math.random() * 2.2 + 0.6,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: Math.random() * 0.35 + 0.1,
    drift: Math.random() * 0.3 - 0.15,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.025 + 0.008,
    isStar: Math.random() > 0.55
  }));

  function drawStar(ctx, x, y, r, color, alpha){
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
    ctx.beginPath();
    for(let i = 0; i < 5; i++){
      const a = (i * 4 * Math.PI / 5) - Math.PI / 2;
      i === 0 ? ctx.moveTo(x + r*Math.cos(a), y + r*Math.sin(a))
              : ctx.lineTo(x + r*Math.cos(a), y + r*Math.sin(a));
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.y -= p.speed; p.x += p.drift;
      p.twinkle += p.twinkleSpeed;
      const alpha = 0.22 + 0.2 * Math.sin(p.twinkle);
      if(p.y < -10) p.y = canvas.height + 10;
      if(p.x < -10) p.x = canvas.width + 10;
      if(p.x > canvas.width + 10) p.x = -10;
      if(p.isStar) drawStar(ctx, p.x, p.y, p.r * 1.6, p.color, alpha);
      else {
        ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill(); ctx.restore();
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── DECORATIVE STAR ACCENTS (hero only)
(function(){
  const hero = document.getElementById('hero');
  if(!hero) return;
  const positions = [
    {top:'18%', right:'6%',  size:20, color:'#4A8C3F', rot:18},
    {top:'62%', right:'2%',  size:13, color:'#E8641A', rot:-22},
    {top:'32%', left:'2%',   size:15, color:'#C4530F', rot:12},
    {top:'78%', left:'5%',   size:10, color:'#4A8C3F', rot:-8},
  ];
  positions.forEach(pos => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width', pos.size); svg.setAttribute('height', pos.size);
    svg.setAttribute('viewBox','0 0 24 24');
    svg.style.cssText = `position:absolute;top:${pos.top||'auto'};bottom:${pos.bottom||'auto'};left:${pos.left||'auto'};right:${pos.right||'auto'};opacity:0.38;transform:rotate(${pos.rot}deg);pointer-events:none;z-index:2`;
    svg.setAttribute('aria-hidden','true');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d','M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z');
    path.setAttribute('fill', pos.color);
    svg.appendChild(path); hero.appendChild(svg);
  });
})();

// ── CAROUSEL
(function(){
  document.querySelectorAll('.carousel-wrap').forEach(wrap => {
    const carousel = wrap.querySelector('.carousel');
    const prev = wrap.querySelector('.carousel-prev');
    const next = wrap.querySelector('.carousel-next');
    if(!carousel) return;
    const slide = () => carousel.querySelector('.carousel-slide');
    const slideW = () => (slide() ? slide().offsetWidth + 16 : 296);
    if(prev) prev.addEventListener('click', () => carousel.scrollBy({left: -slideW(), behavior:'smooth'}));
    if(next) next.addEventListener('click', () => carousel.scrollBy({left:  slideW(), behavior:'smooth'}));
  });
})();
