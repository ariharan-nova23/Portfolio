/* ============================================
   MATRIX PORTFOLIO — Main Script
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // 1. MATRIX RAIN — Canvas Background
  // ==========================================
  const MatrixRain = (() => {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    // Matrix-style characters: katakana, latin, digits, symbols
    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:<>?/~';
    const charArray = chars.split('');

    let columns = 0;
    let drops = [];
    let fontSize = 14;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      fontSize = window.innerWidth < 480 ? 10 : 14;
      columns = Math.floor(canvas.width / fontSize);

      // Preserve existing drop positions or initialize
      const newDrops = [];
      for (let i = 0; i < columns; i++) {
        newDrops[i] = drops[i] !== undefined ? drops[i] : Math.random() * -100;
      }
      drops = newDrops;
    }

    function draw() {
      // Slight fade for trail effect
      ctx.fillStyle = 'rgba(3, 7, 8, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < columns; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Brightest character at the head
        const brightness = 0.3 + Math.random() * 0.3;
        ctx.fillStyle = `rgba(0, 255, 102, ${brightness})`;
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
        ctx.fillText(char, x, y);

        // Leading bright character
        if (Math.random() > 0.97) {
          ctx.fillStyle = 'rgba(180, 255, 200, 0.9)';
          ctx.fillText(char, x, y);
        }

        // Reset drop randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    function init() {
      resize();
      window.addEventListener('resize', resize);
      setInterval(draw, 45);
    }

    return { init };
  })();

  // ==========================================
  // 2. TYPING EFFECT
  // ==========================================
  const TypingEffect = (() => {
    const element = document.getElementById('typing-text');
    const roles = [
      'Full-Stack Engineer',
      'AI Systems Integrator',
      'DSA Enthusiast',
      'Software Developer',
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId = null;

    const TYPING_SPEED = 80;
    const DELETING_SPEED = 45;
    const PAUSE_AFTER_TYPE = 2200;
    const PAUSE_AFTER_DELETE = 400;

    function tick() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        // Typing forward
        charIndex++;
        element.textContent = currentRole.substring(0, charIndex);

        if (charIndex === currentRole.length) {
          // Finished typing — pause then delete
          isDeleting = true;
          timeoutId = setTimeout(tick, PAUSE_AFTER_TYPE);
          return;
        }
        timeoutId = setTimeout(tick, TYPING_SPEED + Math.random() * 40);
      } else {
        // Deleting
        charIndex--;
        element.textContent = currentRole.substring(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          timeoutId = setTimeout(tick, PAUSE_AFTER_DELETE);
          return;
        }
        timeoutId = setTimeout(tick, DELETING_SPEED);
      }
    }

    function init() {
      // Start after a small delay for the entrance animation
      setTimeout(tick, 1200);
    }

    return { init };
  })();

  // ==========================================
  // 3. WEB AUDIO — Sound Effects
  // ==========================================
  const SoundEngine = (() => {
    let audioCtx = null;
    let enabled = false;

    function getContext() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      return audioCtx;
    }

    function playClick() {
      if (!enabled) return;
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
      } catch (e) {
        // Silent fail
      }
    }

    function playBeep() {
      if (!enabled) return;
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {
        // Silent fail
      }
    }

    function toggle() {
      enabled = !enabled;

      const iconOn = document.getElementById('sound-icon-on');
      const iconOff = document.getElementById('sound-icon-off');

      if (enabled) {
        iconOn.classList.remove('hidden');
        iconOff.classList.add('hidden');
        // Resume context if suspended
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        playBeep();
      } else {
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
      }
    }

    function init() {
      const toggleBtn = document.getElementById('sound-toggle');
      toggleBtn.addEventListener('click', toggle);

      // Attach click sounds to all [data-sound] elements
      document.querySelectorAll('[data-sound]').forEach((el) => {
        el.addEventListener('click', () => {
          playClick();
        });
        el.addEventListener('mouseenter', () => {
          playBeep();
        });
      });
    }

    return { init };
  })();

  // ==========================================
  // 4. TERMINAL REVEAL ANIMATION
  // ==========================================
  const TerminalReveal = (() => {
    function init() {
      const codeEl = document.getElementById('terminal-code');
      if (!codeEl) return;

      const fullHTML = codeEl.innerHTML;
      codeEl.innerHTML = '';
      codeEl.style.opacity = '1';

      // Wait for entrance animation, then reveal line by line
      setTimeout(() => {
        const lines = fullHTML.split('\n');
        let currentLine = 0;

        function revealLine() {
          if (currentLine < lines.length) {
            codeEl.innerHTML += (currentLine > 0 ? '\n' : '') + lines[currentLine];
            currentLine++;
            setTimeout(revealLine, 60 + Math.random() * 30);
          }
        }

        revealLine();
      }, 1600);
    }

    return { init };
  })();

  // ==========================================
  // 5. PARALLAX GLOW (mouse-reactive)
  // ==========================================
  const ParallaxGlow = (() => {
    function init() {
      const hero = document.getElementById('hero');
      if (!hero) return;

      // Only on non-touch devices
      if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;

          hero.style.setProperty('--mouse-x', `${e.clientX}px`);
          hero.style.setProperty('--mouse-y', `${e.clientY}px`);

          // Subtle parallax on name
          const name = hero.querySelector('.hero-name');
          if (name) {
            name.style.transform = `translate(${x * 3}px, ${y * 2}px)`;
          }
        });
      }
    }

    return { init };
  })();

  // ==========================================
  // 6. SMOOTH SCROLL for anchor links
  // ==========================================
  const SmoothScroll = (() => {
    function init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
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
    SoundEngine.init();
    TerminalReveal.init();
    ParallaxGlow.init();
    SmoothScroll.init();
  });
})();
