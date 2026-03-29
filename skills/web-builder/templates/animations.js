/* TSUNAMI Animation Library
   Drop into any project — add <script src="animations.js"></script>
   Provides scroll-triggered animations, particle backgrounds,
   fluid effects, and interactive elements.

   Extracted patterns from production agentic sites. */

(function() {
  'use strict';

  // ─── Scroll-triggered fade-in ───
  // Add class="animate-on-scroll" to any element
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ─── Particle Background ───
  // Add <canvas id="particles"></canvas> to your page
  function initParticles(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const color = options.color || '#4a9eff';
    const count = options.count || 60;
    const speed = options.speed || 0.5;
    const lineDistance = options.lineDistance || 120;
    const opacity = options.opacity || 0.3;

    canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * 2 + 1
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < lineDistance) {
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / lineDistance) * opacity;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and move particles
      ctx.globalAlpha = opacity + 0.2;
      particles.forEach(p => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    });
  }

  // ─── Fluid Background (WebGL simplified) ───
  // Add <canvas id="fluid"></canvas> to your page
  function initFluid(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const color1 = options.color1 || '#4a9eff';
    const color2 = options.color2 || '#8844ff';
    const color3 = options.color3 || '#ff4a6a';
    const speed = options.speed || 0.002;

    canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;

    let t = 0;
    function draw() {
      const w = canvas.width, h = canvas.height;
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;

      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          const nx = x / w * 3, ny = y / h * 3;
          const v1 = Math.sin(nx * 2 + t) * Math.cos(ny * 1.5 + t * 0.7);
          const v2 = Math.sin(nx * 1.2 - t * 0.8) * Math.cos(ny * 2.2 + t * 0.5);
          const v3 = Math.sin((nx + ny) * 1.5 + t * 0.6);
          const v = (v1 + v2 + v3) / 3;
          const r = Math.floor(30 + v * 20);
          const g = Math.floor(15 + v * 30);
          const b = Math.floor(40 + v * 40);
          const idx = (y * w + x) * 4;
          data[idx] = r; data[idx+1] = g; data[idx+2] = b; data[idx+3] = 255;
          // Fill 2x2 block for performance
          if (x+1 < w) { data[idx+4] = r; data[idx+5] = g; data[idx+6] = b; data[idx+7] = 255; }
          if (y+1 < h) {
            const idx2 = ((y+1) * w + x) * 4;
            data[idx2] = r; data[idx2+1] = g; data[idx2+2] = b; data[idx2+3] = 255;
            if (x+1 < w) { data[idx2+4] = r; data[idx2+5] = g; data[idx2+6] = b; data[idx2+7] = 255; }
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
      t += speed;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ─── Typing Animation ───
  // Add class="typewriter" data-text="Hello World" to any element
  function initTypewriters() {
    document.querySelectorAll('.typewriter').forEach(el => {
      const text = el.dataset.text || el.textContent;
      const speed = parseInt(el.dataset.speed) || 50;
      el.textContent = '';
      let i = 0;
      function type() {
        if (i < text.length) {
          el.textContent += text[i]; i++;
          setTimeout(type, speed);
        }
      }
      // Start when visible
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { type(); obs.disconnect(); }
      });
      obs.observe(el);
    });
  }

  // ─── Counter Animation ───
  // Add class="count-up" data-target="1000" to any element
  function initCounters() {
    document.querySelectorAll('.count-up').forEach(el => {
      const target = parseInt(el.dataset.target) || 0;
      const duration = parseInt(el.dataset.duration) || 2000;
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now();
          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(target * ease).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          obs.disconnect();
        }
      });
      obs.observe(el);
    });
  }

  // ─── Smooth Scroll ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ─── Init on DOM ready ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initTypewriters(); initCounters(); });
  } else {
    initTypewriters(); initCounters();
  }

  // ─── Export for manual init ───
  window.tsunami = window.tsunami || {};
  window.tsunami.particles = initParticles;
  window.tsunami.fluid = initFluid;
  window.tsunami.typewriter = initTypewriters;
  window.tsunami.counter = initCounters;
})();
