// CLEAR-4 CORE
// Navigation, Smooth Scroll, Section Reveal, Active States

(() => {
  const header = document.querySelector(".site-header");
  const main = document.querySelector("main");
  const mobileToggle = document.querySelector("[data-nav-toggle]");
  const mobilePanel = document.querySelector("[data-nav-panel]");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const sections = document.querySelectorAll("[data-section-id]");
  const revealElems = document.querySelectorAll(".reveal-on-scroll");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Smooth Anchor Scroll with offset --- */
  function handleAnchorClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    const headerOffset = header ? header.offsetHeight + 12 : 80;
    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetTop = rect.top + scrollTop - headerOffset;

    if (prefersReducedMotion) {
      window.scrollTo(0, targetTop);
    } else {
      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", handleAnchorClick);
  });

  /* --- Header Shrink on Scroll --- */

  let lastScrollY = window.scrollY;

  function updateHeader() {
    const currentY = window.scrollY;
    if (!header) return;

    if (currentY > 10) {
      header.classList.add("site-header--scrolled");
    } else {
      header.classList.remove("site-header--scrolled");
    }

    lastScrollY = currentY;
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader);

  /* --- Mobile Navigation --- */

  function closeMobileNav() {
    if (!mobileToggle || !mobilePanel) return;
    mobileToggle.setAttribute("aria-expanded", "false");
    mobilePanel.classList.remove("nav__mobile-panel--open");
  }

  function toggleMobileNav() {
    if (!mobileToggle || !mobilePanel) return;

    const isOpen = mobileToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMobileNav();
    } else {
      mobileToggle.setAttribute("aria-expanded", "true");
      mobilePanel.classList.add("nav__mobile-panel--open");
    }
  }

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener("click", toggleMobileNav);

    mobilePanel.addEventListener("click", (event) => {
      const target = event.target;
      if (target.matches("a")) {
        closeMobileNav();
      }
    });
  }

  /* --- Active Navigation (per page) --- */

  function setActiveNav() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive =
        (currentPath === "" && href === "index.html") ||
        (href && currentPath === href);

      if (isActive) {
        link.classList.add("nav__link--active");
      } else {
        link.classList.remove("nav__link--active");
      }
    });

    // Mobile
    const mobileLinks = document.querySelectorAll("[data-nav-link-mobile]");
    mobileLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive =
        (currentPath === "" && href === "index.html") ||
        (href && currentPath === href);
      if (isActive) {
        link.classList.add("nav__mobile-link--active");
      } else {
        link.classList.remove("nav__mobile-link--active");
      }
    });
  }

  setActiveNav();

  /* --- Section Reveal --- */

  if ("IntersectionObserver" in window && revealElems.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-on-scroll--visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1,
      }
    );

    revealElems.forEach((elem) => revealObserver.observe(elem));
  } else {
    // Fallback
    revealElems.forEach((elem) =>
      elem.classList.add("reveal-on-scroll--visible")
    );
  }

  /* --- Scroll-Spy Active Section (only on long pages) --- */

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("data-section-id");
          if (!id) return;

          navLinks.forEach((link) => {
            const sectionTarget = link.getAttribute("data-section-target");
            if (sectionTarget === id) {
              link.classList.add("nav__link--active");
            } else if (!link.href.endsWith(".html")) {
              // nur auf OnePager-ähnlichen Seiten überschreiben
              link.classList.remove("nav__link--active");
            }
          });
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0.2,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* --- Current Year in Footer --- */

  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
})();
