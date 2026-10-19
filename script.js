/* ============================================
   MATRIX PORTFOLIO — Script
   No audio. No settings. Pure function.
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // 1. MATRIX RAIN — Canvas Background
  // ==========================================
  const MatrixRain = (() => {
    const canvases = document.querySelectorAll('#matrix-canvas, .skills-rain-canvas');

    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' +
      '01001101110100110101';
    const charArray = chars.split('');

    function createRain(canvas) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isViewportCanvas = canvas.id === 'matrix-canvas';
      let columns = 0;
      let drops = [];
      let fontSize = 14;
      let lastTime = 0;
      const FRAME_INTERVAL = 45;

      function resize() {
        const width = isViewportCanvas ? window.innerWidth : canvas.clientWidth;
        const height = isViewportCanvas ? window.innerHeight : canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;
        fontSize = width < 480 ? 10 : 14;
        const newColumns = Math.floor(canvas.width / fontSize);

        const newDrops = [];
        for (let i = 0; i < newColumns; i++) {
          newDrops[i] = drops[i] !== undefined ? drops[i] : Math.random() * -80;
        }
        columns = newColumns;
        drops = newDrops;
      }

      function draw(timestamp) {
        requestAnimationFrame(draw);

        if (timestamp - lastTime < FRAME_INTERVAL) return;
        lastTime = timestamp;

        ctx.fillStyle = 'rgba(3, 7, 8, 0.055)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < columns; i++) {
          const char = charArray[Math.floor(Math.random() * charArray.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillStyle = `rgba(0, 255, 102, ${0.25 + Math.random() * 0.25})`;
          ctx.fillText(char, x, y);

          if (Math.random() > 0.975) {
            ctx.fillStyle = 'rgba(180, 255, 210, 0.85)';
            ctx.fillText(char, x, y);
          }

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      resize();
      window.addEventListener('resize', resize);
      requestAnimationFrame(draw);
    }

    function init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      canvases.forEach(createRain);
    }

    return { init };
  })();

  // ==========================================
  // 2. TYPING EFFECT
  // ==========================================
  const TypingEffect = (() => {
    const el = document.getElementById('role-text');
    if (!el) return { init() {} };

    const roles = [
      'Senior Full-Stack Engineer',
      'AI Solutions Architect',
      'DSA & Systems Strategist',
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const SPEED_TYPE   = 70;
    const SPEED_DELETE = 40;
    const PAUSE_FULL   = 2400;
    const PAUSE_EMPTY  = 350;

    function tick() {
      const role = roles[roleIdx];

      if (!deleting) {
        charIdx++;
        el.textContent = role.substring(0, charIdx);

        if (charIdx === role.length) {
          deleting = true;
          setTimeout(tick, PAUSE_FULL);
          return;
        }
        setTimeout(tick, SPEED_TYPE + Math.random() * 35);
      } else {
        charIdx--;
        el.textContent = role.substring(0, charIdx);

        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(tick, PAUSE_EMPTY);
          return;
        }
        setTimeout(tick, SPEED_DELETE);
      }
    }

    function init() {
      setTimeout(tick, 1000);
    }

    return { init };
  })();

  // ==========================================
  // 3. TERMINAL LINE-BY-LINE REVEAL
  // ==========================================
  const TerminalReveal = (() => {
    const codeEl = document.getElementById('terminal-code');
    if (!codeEl) return { init() {} };

    function init() {
      const fullHTML = codeEl.innerHTML;
      codeEl.innerHTML = '';

      setTimeout(() => {
        const lines = fullHTML.split('\n');
        let i = 0;

        function next() {
          if (i < lines.length) {
            codeEl.innerHTML += (i > 0 ? '\n' : '') + lines[i];
            i++;
            setTimeout(next, 50 + Math.random() * 25);
          }
        }

        next();
      }, 900);
    }

    return { init };
  })();

  // ==========================================
  // 4. COPY JSON BUTTON
  // ==========================================
  const CopyJSON = (() => {
    const btn = document.getElementById('copy-btn');
    if (!btn) return { init() {} };

    const jsonData = JSON.stringify({
      developer: "Ariharan Chandrasekeran",
      title: "Senior Full-Stack & AI Engineer",
      experience: "Senior Architect / Technical Lead",
      stack: {
        frontend: ["React", "Next.js", "TypeScript", "TailwindCSS"],
        backend: ["Node.js", "Python", "Go", "GraphQL", "gRPC"],
        ai_ml: ["LLM Pipelines", "RAG Systems", "AI Agents", "LangChain"],
        dsa_core: ["Graph Theory", "Dynamic Programming", "System Architecture"]
      },
      status: "Ready for Mission-Critical Deployment"
    }, null, 2);

    function init() {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(jsonData);

          const copyIcon = document.getElementById('copy-icon');
          const checkIcon = document.getElementById('check-icon');

          copyIcon.classList.add('hidden');
          checkIcon.classList.remove('hidden');

          setTimeout(() => {
            checkIcon.classList.add('hidden');
            copyIcon.classList.remove('hidden');
          }, 1800);
        } catch (e) {
          // Clipboard API may fail in some contexts — silent fail
        }
      });
    }

    return { init };
  })();

  // ==========================================
  // 5. SUBTLE PARALLAX — Mouse reactive name
  // ==========================================
  const Parallax = (() => {
    function init() {
      if (!window.matchMedia('(hover: hover)').matches) return;

      const name = document.querySelector('.hero-name');
      const terminal = document.querySelector('.terminal');
      if (!name) return;

      document.addEventListener('mousemove', (e) => {
        const cx = (e.clientX / window.innerWidth - 0.5) * 2;
        const cy = (e.clientY / window.innerHeight - 0.5) * 2;

        name.style.transform = `translate(${cx * 4}px, ${cy * 2.5}px)`;

        if (terminal) {
          terminal.style.transform = `translateY(${-4 + cy * -3}px) rotateY(${cx * -1.5}deg) rotateX(${cy * 1}deg)`;
        }
      });
    }

    return { init };
  })();

  // ==========================================
  // 6. SKILLS SECTION ASSEMBLY
  // ==========================================
  const SkillsAssembly = (() => {
    const section = document.querySelector('.skills-section');
    const title = document.getElementById('skills-title');
    const grid = section && section.querySelector('.skills-grid');
    const terminal = section && section.querySelector('.telemetry-terminal');

    if (!section || !title || !grid || !terminal) return { init() {} };

    const titleSegments = Array.from(title.querySelectorAll('[data-decode-text]')).map((element) => ({
      element,
      text: element.textContent
    }));
    const decodeChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const modules = Array.from(grid.querySelectorAll('.skill-module'));
    const clamp = (value) => Math.max(0, Math.min(1, value));
    const mapProgress = (progress, start, end) => clamp((progress - start) / (end - start));

    function init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      section.classList.add('skills-scroll-scrub');

      function updateProgress() {
        const bounds = section.getBoundingClientRect();
        const progress = clamp((window.innerHeight - bounds.top) / (window.innerHeight * 1.2));
        const headerProgress = mapProgress(progress, 0.1, 0.35);
        const topProgress = mapProgress(progress, 0.25, 0.5);
        const lowerProgress = mapProgress(progress, 0.5, 0.75);
        const terminalProgress = mapProgress(progress, 0.75, 1);

        section.style.setProperty('--header-opacity', String(headerProgress));
        section.style.setProperty('--header-y', `${20 * (1 - headerProgress)}px`);
        section.style.setProperty('--terminal-opacity', String(terminalProgress));
        section.style.setProperty('--terminal-y', `${80 * (1 - terminalProgress)}px`);
        titleSegments.forEach(({ element, text }) => {
          const settledChars = Math.floor(headerProgress * text.length);
          element.textContent = Array.from(text, (char, index) => {
            if (char === ' ' || index < settledChars) return char;
            const seed = (index * 17 + text.length * 7) % decodeChars.length;
            return decodeChars[(seed + Math.floor(headerProgress * 5)) % decodeChars.length];
          }).join('');
        });

        modules.forEach((module, index) => {
          const moduleProgress = index < 2 ? topProgress : lowerProgress;
          const entersFromLeft = index % 2 === 0;
          const offset = 150 * (1 - moduleProgress) * (entersFromLeft ? -1 : 1);
          module.style.setProperty('--module-opacity', String(moduleProgress));
          module.style.setProperty('--module-x', `${offset}px`);
          module.inert = moduleProgress < 0.05;
        });

        terminal.inert = terminalProgress < 0.05;
      }

      let updateScheduled = false;
      function scheduleProgressUpdate() {
        if (updateScheduled) return;
        updateScheduled = true;
        requestAnimationFrame(() => {
          updateScheduled = false;
          updateProgress();
        });
      }

      window.addEventListener('scroll', scheduleProgressUpdate, { passive: true });
      document.addEventListener('scroll', scheduleProgressUpdate, { passive: true, capture: true });
      window.addEventListener('resize', scheduleProgressUpdate);
      updateProgress();
    }

    return { init };
  })();

  // ==========================================
  // 7. SKILL NODE TELEMETRY
  // ==========================================
  const SkillTelemetry = (() => {
    const grid = document.querySelector('.skills-grid');
    const nameEl = document.getElementById('telemetry-name');
    const categoryEl = document.getElementById('telemetry-category');
    const descriptionEl = document.getElementById('telemetry-description');

    if (!grid || !nameEl || !categoryEl || !descriptionEl) return { init() {} };

    function init() {
      grid.addEventListener('click', (event) => {
        const node = event.target.closest('.skill-node');
        if (!node || !grid.contains(node)) return;

        grid.querySelectorAll('.skill-node').forEach((skillNode) => {
          const selected = skillNode === node;
          skillNode.classList.toggle('is-selected', selected);
          skillNode.setAttribute('aria-pressed', String(selected));
        });

        nameEl.textContent = node.dataset.name;
        categoryEl.textContent = node.dataset.category;
        descriptionEl.textContent = node.dataset.details;
      });
    }

    return { init };
  })();

  // ==========================================
  // INIT
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    MatrixRain.init();
    TypingEffect.init();
    TerminalReveal.init();
    CopyJSON.init();
    Parallax.init();
    SkillsAssembly.init();
    SkillTelemetry.init();
  });
})();
