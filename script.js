/* =========================================================
   IRONPULSE — interactions
   ========================================================= */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header, scroll progress, back to top ---------- */
  const header = $("#siteHeader");
  const scrollBar = $("#scrollBar");
  const toTop = $("#toTop");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 20);
    toTop.classList.toggle("is-visible", y > 600);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = `${max > 0 ? Math.min((y / max) * 100, 100) : 0}%`;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  /* ---------- Mobile navigation ---------- */
  const nav = $("#nav");
  const navToggle = $("#navToggle");

  const closeNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("no-scroll");
  };

  navToggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("no-scroll", open);
  });

  $$("a", nav).forEach((link) => link.addEventListener("click", closeNav));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeNav();
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");

  if ("IntersectionObserver" in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$(".count");
  const numberFormat = new Intl.NumberFormat("en-US");

  const animateCounter = (el) => {
    const target = Number(el.dataset.count) || 0;

    if (prefersReduced) {
      el.textContent = numberFormat.format(target);
      return;
    }

    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = numberFormat.format(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              counters.forEach(animateCounter);
              obs.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      statsObserver.observe($(".hero__stats"));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- Pricing toggle ---------- */
  const billingSwitch = $("#billingSwitch");
  const priceValues = $$(".price-card__value");
  const billingNotes = $$(".price-card__billing");
  const billingLabels = $$("[data-billing-label]");
  let annual = false;

  const renderPricing = () => {
    billingSwitch.setAttribute("aria-checked", String(annual));

    billingLabels.forEach((label) => {
      label.classList.toggle(
        "is-active",
        label.dataset.billingLabel === (annual ? "annual" : "monthly")
      );
    });

    priceValues.forEach((el) => {
      el.textContent = annual ? el.dataset.annual : el.dataset.monthly;

      if (!prefersReduced) {
        el.animate(
          [
            { opacity: 0, transform: "translateY(7px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 260, easing: "ease-out" }
        );
      }
    });

    billingNotes.forEach((note) => {
      note.textContent = annual ? "billed annually · save 20%" : "billed monthly";
    });
  };

  billingSwitch.addEventListener("click", () => {
    annual = !annual;
    renderPricing();
  });

  renderPricing();

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav__list a");
  const sectionIds = navLinks
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("#"));

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const section = $(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- Trial form ---------- */
  const form = $("#trialForm");
  const success = $("#formSuccess");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (field) => {
    const value = field.value.trim();
    let valid = value !== "";
    if (field.type === "email") valid = emailPattern.test(value);
    field.closest(".field").classList.toggle("is-invalid", !valid);
    return valid;
  };

  if (form) {
    const fields = $$("input, select", form);

    fields.forEach((field) => {
      const eventName = field.tagName === "SELECT" ? "change" : "input";
      field.addEventListener(eventName, () => {
        if (field.closest(".field").classList.contains("is-invalid")) {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const invalid = fields.filter((field) => !validateField(field));

      if (invalid.length) {
        success.classList.remove("is-visible");
        invalid[0].focus();
        return;
      }

      const submitBtn = $('button[type="submit"]', form);
      const originalLabel = submitBtn.textContent;

      form.reset();
      fields.forEach((field) => field.closest(".field").classList.remove("is-invalid"));
      success.classList.add("is-visible");
      success.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });

      submitBtn.textContent = "Request sent ✓";
      submitBtn.disabled = true;

      window.setTimeout(() => {
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      }, 3200);
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
