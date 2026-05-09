document.addEventListener('DOMContentLoaded', () => {

  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  if (cursor && cursorDot) {
    let mx = 0, my = 0;
    let cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
    });

    const animateCursor = () => {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }

  const nav = document.getElementById('nav');

  const updateNav = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  burger?.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileClose?.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  const revealEls = document.querySelectorAll('.reveal, .fade-up');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const siblings = entry.target.closest('section, .pillars__inner, .team__grid, .menu-grid')
            ?.querySelectorAll('.reveal, .fade-up') || [];
          let delay = 0;
          siblings.forEach((el, idx) => {
            if (el === entry.target) delay = idx * 80;
          });
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  const heroEls = document.querySelectorAll('.hero .fade-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 400 + i * 200);
  });

  const tabs   = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = document.querySelector(`.tab-panel[data-panel="${target}"]`);
      if (activePanel) {
        activePanel.classList.add('active');

        activePanel.querySelectorAll('.reveal').forEach((el, i) => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), i * 60);
        });
      }
    });
  });

  const heroImg = document.querySelector('.hero__img');

  const parallaxHero = () => {
    const sy = window.scrollY;
    if (heroImg && sy < window.innerHeight * 1.5) {
      heroImg.style.transform = `scale(1) translateY(${sy * 0.25}px)`;
    }
  };
  window.addEventListener('scroll', parallaxHero, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  const resForm    = document.getElementById('reservationForm');
  const formSuccess = document.getElementById('formSuccess');

  resForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const required = resForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#c0392b';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });
    if (!valid) return;

    const name     = document.getElementById('res-name').value;
    const email    = document.getElementById('res-email').value;
    const date     = document.getElementById('res-date').value;
    const time     = document.getElementById('res-time').value;
    const guests   = document.getElementById('res-guests').value;
    const occasion = document.getElementById('res-occasion').value;
    const notes    = document.getElementById('res-notes').value;

    const subject = encodeURIComponent(`Reservation Request — ${name} — ${date}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\nOccasion: ${occasion || 'None'}\n\nSpecial Requests:\n${notes || 'None'}`
    );

    window.location.href = `mailto:reservations@chambers.nyc?subject=${subject}&body=${body}`;

    setTimeout(() => {
      resForm.classList.add('hidden');
      formSuccess.classList.add('visible');
    }, 500);
  });

  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transition = 'background 0.25s ease, padding 0.25s ease, margin 0.25s ease';
    });
  });

});