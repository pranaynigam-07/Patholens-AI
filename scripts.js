/* =========================
   PathoLens AI — Full JS
   - Mobile nav toggle
   - Tabs interactivity
   - Animated counters & bars
   - Contact form validation (Netlify-ready)
   - Year in footer
   ========================= */

// Utility selectors
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ========== MOBILE NAVIGATION ========== */
const navToggle = $('.nav-toggle');
const nav       = $('#primary-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  $$('#primary-nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ========== TABS INTERACTIVITY ========== */
const tabButtons = $$('.tab-btn');
const tabPanels  = $$('.tab-panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.tab;

    tabButtons.forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });

    tabPanels.forEach(panel => {
      const match = panel.id === targetId;
      panel.hidden = !match;
      panel.classList.toggle('active', match);
    });
  });
});

/* ========== ANIMATED COUNTERS + PROGRESS BARS ========== */
const counters = $$('.counter');
const bars     = $$('.progress .bar');

function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseFloat(el.dataset.target || '0');
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();
    const dur    = 1400;

    function step(now) {
      const p   = Math.min(1, (now - start) / dur);
      const val = target * (0.2 + 0.8 * easeOutCubic(p));
      const formatted = suffix.includes('min')
        ? (target < 10 ? val.toFixed(1) : Math.round(val))
        : Math.round(val);
      el.textContent = suffix.includes('min') ? `${formatted} min` : `${formatted}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    // Related progress bar
    const siblingBar = el.parentElement?.querySelector('.progress .bar');
    if (siblingBar?.dataset.width) {
      siblingBar.style.width = siblingBar.dataset.width + '%';
    }

    obs.unobserve(el);
  });
}, { threshold: 0.35 });

counters.forEach(c => obs.observe(c));

// Standalone bars
const barObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const w = entry.target.dataset.width;
      if (w) entry.target.style.width = w + '%';
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.35 });

bars.forEach(b => barObs.observe(b));

/* ========== CONTACT FORM VALIDATION + NETLIFY ========== */
const form = $('#contact-form');
if (form) {
  form.addEventListener('submit', e => {
    const name    = $('#name');
    const email   = $('#email');
    const message = $('#message');
    const status  = $('#form-status');

    let valid = true;

    // Name
    if (!name.value.trim()) {
      setError(name, 'Please enter your name.');
      valid = false;
    } else clearError(name);

    // Email
    const emailVal = email.value.trim();
    if (!emailVal || !/^\S+@\S+\.\S+$/.test(emailVal)) {
      setError(email, 'Please enter a valid email.');
      valid = false;
    } else clearError(email);

    // Message
    if (!message.value.trim() || message.value.trim().length < 10) {
      setError(message, 'Please include a short message (10+ chars).');
      valid = false;
    } else clearError(message);

    if (!valid) {
      e.preventDefault(); // prevent Netlify submission if invalid
      status.textContent = '';
      return;
    }

    // If using Netlify, allow the form to POST normally
    if (form.hasAttribute('data-netlify')) {
      status.textContent = 'Sending...';
      // Let browser submit to Netlify — remove preventDefault
    } else {
      // If no backend, simulate
      e.preventDefault();
      status.textContent = 'Thanks! Your message has been sent.';
      form.reset();
      setTimeout(() => status.textContent = '', 5000);
    }
  });

  function setError(input, msg){
    const field = input.closest('.form-field');
    const err = field.querySelector('.error');
    if (err) err.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }
  function clearError(input){
    const field = input.closest('.form-field');
    const err = field.querySelector('.error');
    if (err) err.textContent = '';
    input.removeAttribute('aria-invalid');
  }
}

/* ========== FOOTER YEAR ========== */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
