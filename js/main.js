/* ==========================================================================
   LIOTE — Main JavaScript
   Handles all interactions, animations, and dynamic behavior
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================================
     0. REDUCED MOTION CHECK
     ======================================================================== */

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ========================================================================
     1. LOADING SCREEN
     ======================================================================== */

  const loading = document.querySelector('.loading');

  if (loading) {
    setTimeout(() => {
      loading.classList.add('loading--hidden');

      // After the 0.6s CSS opacity transition completes, hide entirely
      setTimeout(() => {
        loading.style.display = 'none';
      }, 600);
    }, 2000);
  }


  /* ========================================================================
     2. NAVBAR SCROLL EFFECT
     ======================================================================== */

  const navbar = document.querySelector('.navbar');

  const handleNavbarScroll = () => {
    if (!navbar) return;

    if (window.scrollY > 80) {
      navbar.classList.add('navbar--solid');
      navbar.classList.remove('navbar--transparent');
    } else {
      navbar.classList.remove('navbar--solid');
      navbar.classList.add('navbar--transparent');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Set initial state


  /* ========================================================================
     3. MOBILE MENU TOGGLE
     ======================================================================== */

  const hamburger = document.querySelector('.navbar__hamburger');
  const navMenu = document.querySelector('.navbar__menu');
  const navOverlay = document.querySelector('.navbar__overlay');

  // Determine which element to toggle (overlay if it exists, otherwise menu)
  const mobileMenu = navOverlay || navMenu;

  if (hamburger && mobileMenu) {
    const openClass = navOverlay ? 'navbar__overlay--open' : 'navbar__menu--open';

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle(openClass);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link inside is clicked
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove(openClass);
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove(openClass);
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ========================================================================
     4. HERO IMAGE CAROUSEL
     ======================================================================== */

  const heroSlides = document.querySelectorAll('.hero__slide');

  if (heroSlides.length > 1) {
    let currentSlide = 0;

    setInterval(() => {
      heroSlides[currentSlide].classList.remove('hero__slide--active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('hero__slide--active');
    }, 3000);
  }


  /* ========================================================================
     5. GSAP SCROLLTRIGGER ANIMATIONS
     ======================================================================== */

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      // Set all animated elements to their final visible state immediately
      gsap.set('.section', { opacity: 1, y: 0 });
      gsap.set('.card', { opacity: 1, y: 0 });
      gsap.set('.stats__item', { opacity: 1, y: 0 });
      gsap.set('.timeline__item', { opacity: 1, x: 0 });
      gsap.set('.hero__content', { opacity: 1 });
    } else {

      /* ------------------------------------------------------------------
         5a. Section Child Reveals (cards, stats, timeline items)
         ------------------------------------------------------------------ */

      document.querySelectorAll('.section').forEach((section) => {
        const children = section.querySelectorAll('.card, .stats__item, .timeline__item');
        if (children.length) {
          gsap.fromTo(children,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              stagger: 0.15,
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      });


      /* ------------------------------------------------------------------
         5b. Stats Counter Animation
         ------------------------------------------------------------------ */

      const statNumbers = document.querySelectorAll('.stats__number[data-target]');

      statNumbers.forEach((el) => {
        const rawTarget = el.getAttribute('data-target');
        const suffix = el.getAttribute('data-suffix') || '';
        const target = parseInt(rawTarget, 10);

        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const counter = { value: 0 };

            gsap.to(counter, {
              value: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                const current = Math.round(counter.value);

                // Format based on suffix type
                if (suffix === 'M+') {
                  // Display as "5M+" style
                  const millions = current / 1000000;
                  if (millions >= 1) {
                    el.textContent = `${Math.round(millions)}M+`;
                  } else {
                    el.textContent = current.toLocaleString('fr-FR');
                  }
                } else if (suffix) {
                  el.textContent = `${current.toLocaleString('fr-FR')}${suffix}`;
                } else {
                  el.textContent = current.toLocaleString('fr-FR');
                }
              },
            });
          },
        });
      });


      /* ------------------------------------------------------------------
         5c. Card Stagger Reveal on Scroll
         (skipped — already handled by 5a section child reveals)
         ------------------------------------------------------------------ */


      /* ------------------------------------------------------------------
         5d. Timeline Animation
         ------------------------------------------------------------------ */

      document.querySelectorAll('.timeline__item').forEach((item, index) => {
        const fromX = index % 2 === 0 ? -40 : 40;

        gsap.fromTo(item,
          { opacity: 0, x: fromX },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });


      /* ------------------------------------------------------------------
         5e. Heritage Section Parallax
         ------------------------------------------------------------------ */

      const heritageSection = document.querySelector('.section--white');

      if (heritageSection) {
        const heritageImg = heritageSection.querySelector('img');

        if (heritageImg) {
          gsap.to(heritageImg, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: heritageSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }
      }


      /* ------------------------------------------------------------------
         5f. Hero Content Fade on Scroll
         ------------------------------------------------------------------ */

      const heroContent = document.querySelector('.hero__content');
      const hero = document.querySelector('.hero');

      if (heroContent && hero) {
        gsap.to(heroContent, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: () => `${hero.offsetHeight * 0.3}px top`,
            scrub: true,
          },
        });
      }

    } // end reduced motion else
  } // end GSAP check


  /* ========================================================================
     6. FAQ ACCORDION
     ======================================================================== */

  const faqQuestions = document.querySelectorAll('.faq__question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const parentItem = question.closest('.faq__item');
      if (!parentItem) return;

      const isOpen = parentItem.classList.contains('faq__item--open');

      // Close all other open items (single-open behavior)
      document.querySelectorAll('.faq__item--open').forEach((openItem) => {
        openItem.classList.remove('faq__item--open');
      });

      // Toggle the clicked item (open if it was closed)
      if (!isOpen) {
        parentItem.classList.add('faq__item--open');
      }
    });
  });


  /* ========================================================================
     7. LOGO CAROUSEL — Duplicate Track for Seamless Loop
     ======================================================================== */

  const logoTrack = document.querySelector('.logo-carousel__track');

  if (logoTrack) {
    // Clone all logo images and append for seamless infinite scroll
    const logos = logoTrack.querySelectorAll('.logo-carousel__logo');
    logos.forEach((logo) => {
      const clone = logo.cloneNode(true);
      logoTrack.appendChild(clone);
    });

    // Pause animation on hover
    const logoCarousel = document.querySelector('.logo-carousel');
    if (logoCarousel) {
      logoCarousel.addEventListener('mouseenter', () => {
        logoTrack.style.animationPlayState = 'paused';
      });

      logoCarousel.addEventListener('mouseleave', () => {
        logoTrack.style.animationPlayState = 'running';
      });
    }
  }


  /* ========================================================================
     8. SMOOTH SCROLL FOR ANCHOR LINKS
     ======================================================================== */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length <= 1) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ========================================================================
     9. CONTACT FORM
     ======================================================================== */

  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    // Pre-select service from URL query param
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const serviceSelect = contactForm.querySelector('.form__select');

    if (serviceParam && serviceSelect) {
      const matchingOption = serviceSelect.querySelector(`option[value="${serviceParam}"]`);
      if (matchingOption) {
        serviceSelect.value = serviceParam;
      }
    }

    // Form submission handler
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather required fields
      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach((field) => {
        // Remove previous error styling
        field.classList.remove('form__input--error');

        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('form__input--error');
        }

        // Basic email validation
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            field.classList.add('form__input--error');
          }
        }
      });

      if (isValid) {
        // Show success message (no backend)
        const successMsg = document.createElement('div');
        successMsg.className = 'form__success';
        successMsg.innerHTML = `
          <p>Merci pour votre message ! Notre equipe vous recontactera dans les plus brefs delais.</p>
        `;

        contactForm.style.display = 'none';
        contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
      }
    });
  }


  /* ========================================================================
     10. REALISATIONS FILTER
     ======================================================================== */

  const filterButtons = document.querySelectorAll('.filter__btn');
  const caseStudyCards = document.querySelectorAll('.card--case-study[data-category]');

  if (filterButtons.length && caseStudyCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button state
        filterButtons.forEach((b) => b.classList.remove('filter__btn--active'));
        btn.classList.add('filter__btn--active');

        const category = btn.getAttribute('data-filter');

        caseStudyCards.forEach((card) => {
          if (category === 'toutes' || card.getAttribute('data-category') === category) {
            card.style.opacity = '0';
            card.style.display = '';

            // Trigger reflow then fade in
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease';
                card.style.opacity = '1';
              });
            });
          } else {
            card.style.transition = 'opacity 0.4s ease';
            card.style.opacity = '0';

            setTimeout(() => {
              card.style.display = 'none';
            }, 400);
          }
        });
      });
    });
  }

  /* ========================================================================
     11. COOKIE CONSENT BANNER
     ======================================================================== */

  if (!localStorage.getItem('liote-cookies')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner cookie-banner--visible';
    banner.innerHTML = `
      <p class="cookie-banner__text">
        Ce site utilise des cookies pour améliorer votre expérience de navigation.
        <a href="${window.location.pathname.includes('/pages/') ? (window.location.pathname.includes('/blog/') ? '../mentions-legales.html' : 'mentions-legales.html') : 'pages/mentions-legales.html'}">En savoir plus</a>
      </p>
      <div class="cookie-banner__actions">
        <button class="cookie-banner__btn cookie-banner__btn--accept">Accepter</button>
        <button class="cookie-banner__btn cookie-banner__btn--decline">Refuser</button>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelector('.cookie-banner__btn--accept').addEventListener('click', () => {
      localStorage.setItem('liote-cookies', 'accepted');
      banner.classList.remove('cookie-banner--visible');
    });

    banner.querySelector('.cookie-banner__btn--decline').addEventListener('click', () => {
      localStorage.setItem('liote-cookies', 'declined');
      banner.classList.remove('cookie-banner--visible');
    });
  }

}); // end DOMContentLoaded
