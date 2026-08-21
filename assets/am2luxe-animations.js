/**
 * AM2LUXE — Premium Interactions
 * Inspired by Avantgarde Artist Agency
 * Kinetic typography · Custom cursor · Scroll reveals · Parallax · Magnetic buttons
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     1. CUSTOM LUXURY CURSOR
     Gold dot that follows the mouse with a trailing ring
  ───────────────────────────────────────────────────────── */
  function initCursor() {
    // Only on desktop (fine pointer)
    if (!window.matchMedia('(any-pointer: fine)').matches) return;

    const dot = document.createElement('div');
    dot.className = 'am2-cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'am2-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let hovering = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Smooth ring follows with lerp
    (function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateRing);
    })();

    // Hover states
    const hoverTargets = 'a, button, .product-card, .collection-card, [data-cursor-hover]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.add('am2-cursor-dot--hover');
        ring.classList.add('am2-cursor-ring--hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.remove('am2-cursor-dot--hover');
        ring.classList.remove('am2-cursor-ring--hover');
      }
    });

    document.addEventListener('mousedown', () => ring.classList.add('am2-cursor-ring--click'));
    document.addEventListener('mouseup', () => ring.classList.remove('am2-cursor-ring--click'));
  }

  /* ─────────────────────────────────────────────────────────
     2. KINETIC TEXT REVEAL
     Splits headings into words, animates them in on scroll
     Words slide up from a clip mask — like Avantgarde's big titles
  ───────────────────────────────────────────────────────── */
  function initKineticText() {
    const selectors = [
      '.hero__title',
      '.section__title',
      '.hero__subtitle',
      'h1', 'h2'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    elements.forEach((el) => {
      // Skip if already processed or inside a data-no-animate attr
      if (el.dataset.amSplit || el.closest('[data-no-animate]')) return;
      el.dataset.amSplit = 'true';

      const text = el.innerHTML;
      // Don't split if it contains HTML tags (images, links with children, etc.)
      if (/<[a-z][\s\S]*>/i.test(text) && !/<br/i.test(text)) return;

      const words = el.textContent.trim().split(/\s+/);
      if (words.length === 0) return;

      el.innerHTML = words.map((word, i) =>
        `<span class="am2-word-wrap" style="--word-i:${i}"><span class="am2-word">${word}</span></span>`
      ).join(' ');

      el.classList.add('am2-split-ready');
    });

    // Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('am2-split-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.am2-split-ready').forEach((el) => observer.observe(el));
  }

  /* ─────────────────────────────────────────────────────────
     3. SCROLL FADE-UP REVEALS
     General elements fade + slide up on scroll
  ───────────────────────────────────────────────────────── */
  function initScrollReveals() {
    const revealSelectors = [
      '.product-card',
      '.collection-card',
      '.media-with-content',
      '.featured-blog-posts-card',
      '.section__description',
      '.button',
      '.hero__content > *',
      '.featured-collection',
      '.resource-card',
    ];

    const elements = document.querySelectorAll(revealSelectors.join(', '));

    elements.forEach((el, i) => {
      if (el.dataset.amReveal) return;
      el.dataset.amReveal = 'pending';
      // Stagger delay based on position within parent
      const siblings = Array.from(el.parentElement?.children || []);
      const sibIndex = siblings.indexOf(el);
      el.style.setProperty('--reveal-delay', `${Math.min(sibIndex * 0.07, 0.4)}s`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.amReveal = 'visible';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('[data-am-reveal="pending"]').forEach((el) => observer.observe(el));
  }

  /* ─────────────────────────────────────────────────────────
     4. PARALLAX ON HERO IMAGES
     Hero/slideshow images shift slightly on scroll — depth effect
  ───────────────────────────────────────────────────────── */
  function initParallax() {
    const parallaxEls = document.querySelectorAll(
      '.hero__image, .slideshow__slide-image, .section-media, .media-with-content__media, .collection-card__image img, .featured-blog-posts-card__image img'
    );

    if (parallaxEls.length === 0) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      parallaxEls.forEach((el) => {
        const rect = el.closest('[class]')?.getBoundingClientRect() || el.getBoundingClientRect();
        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        const shift = centerOffset * 0.08;
        el.style.transform = `translateY(${shift}px) scale(1.06)`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  }

  /* ─────────────────────────────────────────────────────────
     5. MAGNETIC BUTTONS
     Buttons subtly attract to the cursor like Avantgarde
  ───────────────────────────────────────────────────────── */
  function initMagneticButtons() {
    if (!window.matchMedia('(any-pointer: fine)').matches) return;

    const buttons = document.querySelectorAll('.button--primary, .button--secondary, .cart__checkout-button');

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     6. ANIMATED COUNTER NUMBERS
     Numbers count up when they enter the viewport
     (e.g. "20+ years of experience", years in business, etc.)
  ───────────────────────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-am-counter]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.amCounter);
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * target);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => observer.observe(el));
  }

  /* ─────────────────────────────────────────────────────────
     7. MARQUEE GOLD DIVIDER
     Inject a luxury scrolling text divider between sections
  ───────────────────────────────────────────────────────── */
  function injectMarqueeDivider() {
    return; // brand-text marquee removed per request
    // Only inject once, after the first major section
    const main = document.querySelector('main, #MainContent');
    if (!main || document.querySelector('.am2-marquee-divider')) return;

    const sections = main.querySelectorAll('.shopify-section');
    if (sections.length < 2) return;

    const divider = document.createElement('div');
    divider.className = 'am2-marquee-divider';
    divider.setAttribute('aria-hidden', 'true');

    const text = '✦ AM2LUXE ✦ LUXURY NAILS ✦ MOTHER &amp; DAUGHTER COLLECTION ✦ AM2LUXE ✦ LUXURY NAILS ✦ MOTHER &amp; DAUGHTER COLLECTION ✦';
    divider.innerHTML = `<div class="am2-marquee-track"><span>${text}&nbsp;&nbsp;${text}</span></div>`;

    // Insert after second section
    sections[1].insertAdjacentElement('afterend', divider);
  }

  /* ─────────────────────────────────────────────────────────
     8. IMAGE TILT ON HOVER (product cards)
     Subtle 3D tilt as cursor moves over product cards
  ───────────────────────────────────────────────────────── */
  function initTiltCards() {
    if (!window.matchMedia('(any-pointer: fine)').matches) return;

    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.product-card, .collection-card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `perspective(800px) rotateY(${xPct * 6}deg) rotateX(${-yPct * 6}deg) scale(1.015)`;
    });

    document.addEventListener('mouseleave', (e) => {
      const card = e.target.closest('.product-card, .collection-card');
      if (card) {
        card.style.transform = '';
      }
    }, true);
  }

  /* ─────────────────────────────────────────────────────────
     9. SMOOTH SCROLL-LINKED HEADER OPACITY
  ───────────────────────────────────────────────────────── */
  function initHeaderScroll() {
    const header = document.querySelector('.header, header');
    if (!header) return;

    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 80) {
        header.classList.add('am2-header-scrolled');
      } else {
        header.classList.remove('am2-header-scrolled');
      }
      lastY = y;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────
     INIT — wait for DOM
  ───────────────────────────────────────────────────────── */
  function init() {
    initCursor();
    initKineticText();
    initScrollReveals();
    initParallax();
    initMagneticButtons();
    initCounters();
    injectMarqueeDivider();
    initTiltCards();
    initHeaderScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run on Shopify section updates (theme editor)
  document.addEventListener('shopify:section:load', () => {
    initKineticText();
    initScrollReveals();
    initMagneticButtons();
    initTiltCards();
  });

})();
