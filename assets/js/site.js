document.documentElement.classList.add("js");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');

function setMenu(open) {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1020) setMenu(false);
});

const normalizePath = (value) => {
  const path = String(value || "/").split("#")[0].split("?")[0].replace(/\.html$/, "");
  return path === "/index" || path === "index" || path === "" ? "/" : (path.startsWith("/") ? path : `/${path}`);
};
const currentPath = normalizePath(window.location.pathname);
document.querySelectorAll(".desktop-nav a, .mobile-menu a").forEach((link) => {
  const href = normalizePath(link.getAttribute("href"));
  if (href === currentPath) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
});

const header = document.querySelector('[data-header]');
window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 12), { passive: true });

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});

const enquiryForm = document.querySelector("[data-enquiry-form]");
const formStart = enquiryForm?.querySelector("[data-form-start]");
if (formStart) formStart.value = String(Date.now());

function enquiryMailto(data) {
  const subject = "Website enquiry: " + String(data.get("service") || "General legal matter");
  const body = [
    "Name: " + String(data.get("name") || ""),
    "Email: " + String(data.get("email") || ""),
    "Telephone: " + String(data.get("telephone") || ""),
    "Preferred contact: " + String(data.get("preferred_contact") || "Email"),
    "Practice area: " + String(data.get("service") || "Not specified"),
    "",
    "Enquiry:",
    String(data.get("enquiry") || "")
  ].join("\n");
  return "mailto:michaelmuchoki7@gmail.com?" + new URLSearchParams({ subject, body }).toString();
}

enquiryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;

  const data = new FormData(enquiryForm);
  const button = enquiryForm.querySelector('button[type="submit"]');
  const status = enquiryForm.querySelector("[data-form-status]");
  const originalButton = button?.innerHTML;
  if (button) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = "Sending…";
  }
  if (status) status.textContent = "Sending your enquiry securely…";

  const payload = Object.fromEntries(data.entries());
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "accept": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.code || result.message || "DELIVERY_FAILED");

    enquiryForm.reset();
    if (formStart) formStart.value = String(Date.now());
    if (status) status.textContent = result.message || "Thank you. Your enquiry has been sent successfully.";
  } catch (error) {
    const fallback = enquiryMailto(data);
    if (status) status.textContent = "Web delivery is unavailable right now. Opening your email application as a backup…";
    window.setTimeout(() => { window.location.href = fallback; }, 350);
  } finally {
    if (button) {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.innerHTML = originalButton || "Send confidential enquiry <span>↗</span>";
    }
  }
});

const brandFilm = document.querySelector("[data-brand-film]");
const motionToggle = document.querySelector("[data-motion-toggle]");
const motionLabel = document.querySelector("[data-motion-label]");
const reduceMotion = prefersReducedMotion;
let motionPausedByUser = reduceMotion;

function setMotionButton(paused) {
  if (!motionToggle || !motionLabel) return;
  motionToggle.setAttribute("aria-pressed", String(paused));
  motionLabel.textContent = paused ? "Play animation" : "Pause animation";
  const icon = motionToggle.querySelector(".motion-control-icon");
  if (icon) icon.textContent = paused ? "▶" : "Ⅱ";
}

if (brandFilm) {
  setMotionButton(reduceMotion);
  if ("IntersectionObserver" in window) {
    const motionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !motionPausedByUser) {
        brandFilm.play().catch(() => setMotionButton(true));
      } else {
        brandFilm.pause();
      }
    }, { threshold: 0.35 });
    motionObserver.observe(brandFilm);
  } else if (!reduceMotion) {
    brandFilm.play().catch(() => setMotionButton(true));
  }
}

motionToggle?.addEventListener("click", () => {
  if (!brandFilm) return;
  if (brandFilm.paused) {
    motionPausedByUser = false;
    brandFilm.play().then(() => setMotionButton(false)).catch(() => setMotionButton(true));
  } else {
    motionPausedByUser = true;
    brandFilm.pause();
    setMotionButton(true);
  }
});

const contactRail = document.createElement('aside');
contactRail.className = 'contact-rail';
contactRail.id = 'contact-rail';
contactRail.setAttribute('aria-label', 'Quick contact actions');
contactRail.innerHTML = `
  <button class="rail-action rail-toggle" type="button" aria-expanded="true" aria-controls="rail-contact-actions" aria-label="Tuck away quick contact" title="Tuck away quick contact">
    <svg class="rail-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
  </button>
  <div class="rail-contact-actions" id="rail-contact-actions">
    <a class="rail-action rail-whatsapp" href="https://wa.me/254713486035?text=Hello%20Kuria%20Muchoki%20%26%20Co.%20Advocates%2C%20I%20would%20like%20to%20make%20an%20enquiry." target="_blank" rel="noopener noreferrer" aria-label="Chat with Kuria Muchoki and Company Advocates on WhatsApp" title="WhatsApp">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" /><path d="M9 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .3.1.4.4l.6 1.4c.1.2.1.4-.1.6l-.5.6c.6 1.1 1.5 1.8 2.6 2.3l.6-.6c.2-.2.4-.2.6-.1l1.3.6c.3.1.4.3.3.6-.2.7-.8 1.2-1.5 1.3-1.2.1-2.7-.6-4.1-1.8-1.2-1-2.2-2.5-2.6-3.5-.3-.7-.2-1 .2-1.4Z" /></svg>
    </a>
    <a class="rail-action rail-phone" href="tel:+254713486035" aria-label="Call Kuria Muchoki and Company Advocates on +254 713 486 035" title="Call +254 713 486 035">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5 9.5 4l1.3 4-1.8 1.5a12 12 0 0 0 5.5 5.5l1.5-1.8 4 1.3-.5 2.5c-.2 1-1 1.6-2 1.5C10 17.8 6.2 14 5 6.5c-.1-1 .5-1.8 1.5-2Z" /></svg>
    </a>
  </div>`;
const contactRailHost = document.querySelector('.hero, .page-hero');
if (contactRailHost) {
  document.body.append(contactRail);
  const railToggle = contactRail.querySelector('.rail-toggle');
  const setRailCollapsed = (collapsed) => {
    contactRail.classList.toggle('is-collapsed', collapsed);
    railToggle?.setAttribute('aria-expanded', String(!collapsed));
    railToggle?.setAttribute('aria-label', collapsed ? 'Show quick contact' : 'Tuck away quick contact');
    railToggle?.setAttribute('title', collapsed ? 'Show quick contact' : 'Tuck away quick contact');
  };
  railToggle?.addEventListener('click', () => setRailCollapsed(!contactRail.classList.contains('is-collapsed')));
}
