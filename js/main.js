/* AFTERBURNER — main.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Search overlay ── */
  const searchBtn   = document.getElementById('searchBtn');
  const searchClose = document.getElementById('searchClose');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput   = document.getElementById('searchInput');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('open');
      setTimeout(() => searchInput && searchInput.focus(), 100);
    });
    searchClose.addEventListener('click', () => searchOverlay.classList.remove('open'));
    searchOverlay.addEventListener('click', e => {
      if (e.target === searchOverlay) searchOverlay.classList.remove('open');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') searchOverlay.classList.remove('open');
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchOverlay.classList.add('open');
        setTimeout(() => searchInput && searchInput.focus(), 100);
      }
    });
  }

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.style.display === 'flex';
      navLinks.style.display = open ? 'none' : 'flex';
      if (!open) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '68px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(6,10,20,0.98)';
        navLinks.style.padding = '16px 24px';
        navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.07)';
        navLinks.style.zIndex = '999';
        navLinks.style.backdropFilter = 'blur(12px)';
      }
    });
  }

  /* ── Back to top ── */
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 400);
    });
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Newsletter form ── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value.includes('@')) {
        showToast('🚀 Welcome aboard! First briefing lands in your inbox soon.');
        input.value = '';
      } else {
        showToast('Please enter a valid email address.');
      }
    });
  });

  /* ── Filter buttons ── */
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  /* ── Animate stats on scroll ── */
  const stats = document.querySelectorAll('[data-count]');
  if (stats.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(el => observer.observe(el));
  }

  /* ── Animate chart bars on scroll ── */
  const bars = document.querySelectorAll('.chart-bar-fill');
  if (bars.length) {
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.width;
          entry.target.style.width = target;
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(bar => {
      const w = bar.style.width;
      bar.dataset.width = w;
      bar.style.width = '0';
      barObserver.observe(bar);
    });
  }

  /* ── Card click ripple ── */
  document.querySelectorAll('.card, .video-card, .podcast-card, .pres-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const href = this.dataset.href;
      if (href) window.location.href = href;
    });
  });

  /* ── Ticker duplicate for infinite loop ── */
  const track = document.querySelector('.ticker-track');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ── Dark mode preference (already dark, but future toggle) ── */
  const savedTheme = localStorage.getItem('ab-theme') || 'dark';
  document.documentElement.dataset.theme = savedTheme;

  /* ── Smooth image loading ── */
  document.querySelectorAll('img[data-src]').forEach(img => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.src = e.target.dataset.src;
          io.unobserve(e.target);
        }
      });
    });
    io.observe(img);
  });

});

/* ── Helpers ── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Exposed globally for inline use ── */
window.showToast = showToast;
