const menuButton = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

function setMenu(open) {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileMenu.hidden = !open;
  document.body.classList.toggle("menu-open", open);
}

menuButton?.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const header = document.querySelector("[data-header]");
window.addEventListener(
  "scroll",
  () => header?.classList.toggle("is-scrolled", window.scrollY > 12),
  { passive: true },
);

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -35px" },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const brandFilm = document.querySelector("[data-brand-film]");
const filmToggle = document.querySelector("[data-film-toggle]");
const filmLabel = document.querySelector("[data-film-label]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let filmPausedByUser = prefersReducedMotion;

function updateFilmControl(paused) {
  if (!filmToggle || !filmLabel) return;
  filmToggle.setAttribute("aria-pressed", String(paused));
  filmLabel.textContent = paused ? "Play identity film" : "Pause identity film";
  const icon = filmToggle.querySelector("[data-film-icon]");
  if (icon) icon.textContent = paused ? "▶" : "Ⅱ";
}

if (brandFilm) {
  updateFilmControl(prefersReducedMotion);
  const playWhenVisible = (visible) => {
    if (visible && !filmPausedByUser) {
      brandFilm.play().catch(() => updateFilmControl(true));
    } else {
      brandFilm.pause();
    }
  };

  if ("IntersectionObserver" in window) {
    const filmObserver = new IntersectionObserver(
      ([entry]) => playWhenVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    filmObserver.observe(brandFilm);
  } else {
    playWhenVisible(true);
  }
}

filmToggle?.addEventListener("click", () => {
  if (!brandFilm) return;
  if (brandFilm.paused) {
    filmPausedByUser = false;
    brandFilm.play().then(() => updateFilmControl(false)).catch(() => updateFilmControl(true));
  } else {
    filmPausedByUser = true;
    brandFilm.pause();
    updateFilmControl(true);
  }
});

const enquiryForm = document.querySelector("[data-mail-form]");
enquiryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;

  const data = new FormData(enquiryForm);
  const name = String(data.get("name") || "").trim();
  const replyTo = String(data.get("reply_to") || "").trim();
  const telephone = String(data.get("telephone") || "").trim();
  const practiceArea = String(data.get("practice_area") || "General enquiry").trim();
  const message = String(data.get("message") || "").trim();
  const subject = `Website enquiry: ${practiceArea}`;
  const body = [
    `Name: ${name}`,
    `Reply email: ${replyTo}`,
    `Telephone: ${telephone || "Not supplied"}`,
    `Practice area: ${practiceArea}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const status = enquiryForm.querySelector("[data-form-status]");
  if (status) status.textContent = "Opening your email application. Your details are not stored by this website.";
  window.location.href = `mailto:michaelmuchoki7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const contactRail = document.createElement("aside");
contactRail.className = "contact-rail";
contactRail.setAttribute("aria-label", "Quick contact");
contactRail.innerHTML = `
  <a class="rail-action" href="tel:+254713486035" aria-label="Call Kuria Muchoki and Company" title="Call">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5 9.5 4l1.3 4-1.8 1.5a12 12 0 0 0 5.5 5.5l1.5-1.8 4 1.3-.5 2.5c-.2 1-1 1.6-2 1.5C10 17.8 6.2 14 5 6.5c-.1-1 .5-1.8 1.5-2Z" /></svg>
  </a>
  <a class="rail-action" href="https://wa.me/254713486035?text=Hello%20Kuria%20Muchoki%20%26%20Co.%20Advocates%2C%20I%20would%20like%20to%20make%20an%20enquiry." target="_blank" rel="noopener noreferrer" aria-label="Message the firm on WhatsApp" title="WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" /><path d="M9 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .3.1.4.4l.6 1.4c.1.2.1.4-.1.6l-.5.6c.6 1.1 1.5 1.8 2.6 2.3l.6-.6c.2-.2.4-.2.6-.1l1.3.6c.3.1.4.3.3.6-.2.7-.8 1.2-1.5 1.3-1.2.1-2.7-.6-4.1-1.8-1.2-1-2.2-2.5-2.6-3.5-.3-.7-.2-1 .2-1.4Z" /></svg>
  </a>
  <a class="rail-action" href="mailto:michaelmuchoki7@gmail.com" aria-label="Email Kuria Muchoki and Company" title="Email">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z" /><path d="m5 7 7 6 7-6" /></svg>
  </a>
`;
document.body.append(contactRail);
