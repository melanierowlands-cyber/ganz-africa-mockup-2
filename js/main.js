/* ============================================================
   GanzAfrica — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ── DOM References ──────────────────────────────────────────
  const header       = document.querySelector('.header');
  const hamburger    = document.querySelector('.hamburger');
  const mobileNav    = document.querySelector('.mobile-nav');
  const mobileLinks  = document.querySelectorAll('.mobile-nav a');

  // ── Sticky Header Shadow on Scroll ──────────────────────────
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── Mobile Navigation Toggle ────────────────────────────────
  function toggleMobileNav() {
    const isOpen = mobileNav.classList.contains('mobile-nav--open');

    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function openMobileNav() {
    mobileNav.style.display = 'block';
    // Force reflow before adding class for transition
    mobileNav.offsetHeight;
    mobileNav.classList.add('mobile-nav--open');
    hamburger.classList.add('hamburger--active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('mobile-nav--open');
    hamburger.classList.remove('hamburger--active');
    document.body.style.overflow = '';

    // Hide after transition completes
    setTimeout(function () {
      if (!mobileNav.classList.contains('mobile-nav--open')) {
        mobileNav.style.display = '';
      }
    }, 300);
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', toggleMobileNav);

    // Close mobile nav when a link is clicked
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // Close mobile nav on escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('mobile-nav--open')) {
      closeMobileNav();
    }
  });

  // Close mobile nav on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && mobileNav && mobileNav.classList.contains('mobile-nav--open')) {
      closeMobileNav();
    }
  });

  // ── Smooth Scroll for Anchor Links ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Intersection Observer for Scroll Animations ─────────────
  const animateElements = document.querySelectorAll('[data-animate]');

  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animateElements.forEach(function (el) {
      observer.observe(el);
    });
  }

})();
