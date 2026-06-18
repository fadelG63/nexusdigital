(function() {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const isTouch = !window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!isTouch) {
    const cursorEl = $('#cursor');
    const ringEl = $('#cursorRing');
    if (cursorEl && ringEl) {
      let mx = 0, my = 0, rx = 0, ry = 0;
      document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursorEl.style.left = mx - 6 + 'px';
        cursorEl.style.top  = my - 6 + 'px';
      });
      (function animate() {
        rx += (mx - rx - 18) * .12;
        ry += (my - ry - 18) * .12;
        ringEl.style.left = rx + 'px';
        ringEl.style.top  = ry + 'px';
        requestAnimationFrame(animate);
      })();
      $$('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorEl.style.transform = 'scale(2.5)';
          ringEl.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
          cursorEl.style.transform = 'scale(1)';
          ringEl.style.transform = 'scale(1)';
        });
      });
    }
  }

  const siteNav = $('#siteNav');
  const burger  = $('#navBurger');
  const mobileMenu = $('#navMobile');
  const navOverlay = $('#navOverlay');

  window.addEventListener('scroll', () => {
    siteNav.classList.toggle('scrolled', window.scrollY > 40);
  }, {passive: true});

  function openMenu() {
    mobileMenu.classList.add('open');
    navOverlay.classList.add('visible');
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    navOverlay.classList.remove('visible');
  }

  burger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  $$('a', mobileMenu).forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  navOverlay.addEventListener('click', closeMenu);

  document.addEventListener('click', e => {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !burger.contains(e.target)) {
      closeMenu();
    }
  });

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href !== '#' && href.length > 1) {
        const target = $(href);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), idx * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  const popup = $('#auditPopup');
  const popupClose = $('#auditPopupClose');
  const step1 = $('#popupStep1');
  const step2 = $('#popupStep2');
  const form = $('#auditForm');
  const whatsappLink = $('#whatsappLink');
  const emailLink = $('#emailLink');
  const backdrop = $('.audit-popup-backdrop', popup);
  const formError = $('#formError');
  const submitBtn = $('#submitFormBtn');

  let formData = { company: '', sector: '', objectives: '' };
  let isSubmitting = false;

  function openPopup() {
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
    step1.classList.add('active');
    step2.classList.remove('active');
    form.reset();
    formData = { company: '', sector: '', objectives: '' };
    if (formError) formError.style.display = 'none';
    isSubmitting = false;
    const firstInput = $('#companyName');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closePopup() {
    popup.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (popupClose) popupClose.addEventListener('click', closePopup);
  if (backdrop) backdrop.addEventListener('click', closePopup);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup.classList.contains('open')) {
      closePopup();
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (isSubmitting) return;
    const company = $('#companyName').value.trim();
    const sector = $('#sector').value.trim();
    const objectives = $('#objectives').value.trim();

    if (!company || !sector || !objectives) {
      if (formError) formError.style.display = 'block';
      return;
    }
    if (formError) formError.style.display = 'none';
    isSubmitting = true;
    submitBtn.disabled = true;

    formData.company = company;
    formData.sector = sector;
    formData.objectives = objectives;

    const encCompany = encodeURIComponent(company);
    const encSector = encodeURIComponent(sector);
    const encObjectives = encodeURIComponent(objectives);

    const whatsappMessage = `Bonjour,%0AJe souhaite un audit gratuit.%0A%0ANom de l'entreprise : ${encCompany}%0ASecteur : ${encSector}%0AObjectifs : ${encObjectives}`;
    const emailSubject = `Demande d'audit gratuit - Nexus`;
    const emailBody = `Bonjour,%0D%0A%0D%0AJe souhaite un audit gratuit.%0D%0A%0D%0ANom de l'entreprise : ${encCompany}%0D%0ASecteur : ${encSector}%0D%0AObjectifs : ${encObjectives}%0D%0A%0D%0ACordialement`;

    whatsappLink.href = `https://wa.me/22607890083?text=${whatsappMessage}`;
    emailLink.href = `mailto:nexusdigital63@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`;

    step1.classList.remove('active');
    step2.classList.add('active');

    setTimeout(() => {
      isSubmitting = false;
      submitBtn.disabled = false;
    }, 800);
  });

  $$('[data-popup-trigger]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openPopup();
    });
  });

  console.log('Nexus — site optimisé avec popup 3 étapes fiabilisé.');
})();
