// Visionary cards (toggle on click, close on outside click)
const visionaryItems = document.querySelectorAll(".visionary-item");

visionaryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains("is-open");
    visionaryItems.forEach((el) => el.classList.remove("is-open"));
    if (!isOpen) item.classList.add("is-open");
  });
});

document.addEventListener("click", () => {
  visionaryItems.forEach((item) => item.classList.remove("is-open"));
});

// Smooth scroll with fixed header offset
const header = document.querySelector(".site-header");
const headerNav = document.querySelector(".header-nav");

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const headerHeight = header ? header.offsetHeight : 0;
  const top =
    target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
  window.scrollTo({ top, behavior: "smooth" });
}

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href")?.slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    headerNav?.classList.remove("open");
    scrollToSection(id);
  });
});

// Reveal on scroll
const revealSections = document.querySelectorAll(".reveal");

if (!("IntersectionObserver" in window)) {
  revealSections.forEach((s) => s.classList.add("in-view"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -20px 0px" },
  );
  revealSections.forEach((s) => revealObserver.observe(s));
}

// Cursor orb (desktop only)
const cursorOrb = document.querySelector(".cursor-orb");
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

if (cursorOrb && !isTouchDevice) {
  let targetX = -500;
  let targetY = -500;
  let rafId = null;
  let isInsideIframe = false;

  cursorOrb.style.left = "0";
  cursorOrb.style.top = "0";

  function updateOrb() {
    cursorOrb.style.transform = `translate(calc(${targetX}px - 50%), calc(${targetY}px - 50%))`;
    rafId = null;
  }

  function setOrbOpacity(visible) {
    cursorOrb.style.transition = "opacity 0.35s ease";
    cursorOrb.style.opacity = visible ? "0.85" : "0";
  }

  window.addEventListener("mousemove", (e) => {
    if (isInsideIframe) return;
    targetX = e.clientX;
    targetY = e.clientY;
    if (rafId === null) rafId = requestAnimationFrame(updateOrb);
  });

  document.addEventListener("mouseleave", () => setOrbOpacity(false));
  document.addEventListener("mouseenter", () => {
    if (!isInsideIframe) setOrbOpacity(true);
  });

  document.querySelectorAll(".video-wrap").forEach((wrap) => {
    wrap.addEventListener("mouseenter", () => {
      isInsideIframe = true;
      setOrbOpacity(false);
    });
    wrap.addEventListener("mouseleave", (e) => {
      isInsideIframe = false;
      targetX = e.clientX;
      targetY = e.clientY;
      updateOrb();
      setOrbOpacity(true);
    });
  });
}
