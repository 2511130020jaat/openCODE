document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initHeader();
  initTypewriter();
  initScrollSpy();
  initReveal();
  initSkillBars();
  initForm();
});

function initMenu() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");

  if (!toggle || !menu) return;

  const closeMenu = () => {
    toggle.classList.remove("open");
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });
}

function initHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const words = ["Web", "Frontend", "Creativo", "Full Stack"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = words[wordIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 100);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
      setTimeout(type, 60);
    }
  }

  type();
}

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

function initSkillBars() {
  const fills = document.querySelectorAll(".skill-fill");

  if (!fills.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    fills.forEach((fill) => {
      fill.style.width = fill.dataset.width || "0%";
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fill = entry.target;
        setTimeout(() => {
          fill.style.width = fill.dataset.width || "0%";
        }, 200);
        obs.unobserve(fill);
      });
    },
    { threshold: 0.4 }
  );

  fills.forEach((fill) => observer.observe(fill));
}

function initForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const fields = {
    nombre: {
      validate: (v) => v.trim().length >= 2 || "Ingresa tu nombre (mínimo 2 caracteres)",
    },
    email: {
      validate: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Ingresa un email válido",
    },
    mensaje: {
      validate: (v) =>
        v.trim().length >= 10 || "El mensaje debe tener al menos 10 caracteres",
    },
  };

  const validateField = (input) => {
    const errorSpan = input.parentElement.querySelector(".form-error");
    const field = fields[input.id];
    if (!field || !errorSpan) return true;

    const result = field.validate(input.value);
    const isValid = result === true;

    input.classList.toggle("invalid", !isValid);
    input.classList.toggle("valid", isValid);
    errorSpan.textContent = isValid ? "" : result;
    return isValid;
  };

  Object.keys(fields).forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) validateField(input);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let formValid = true;
    ["nombre", "email", "mensaje"].forEach((id) => {
      const input = document.getElementById(id);
      if (input && !validateField(input)) formValid = false;
    });

    if (!formValid) {
      const firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const btn = form.querySelector("button[type='submit']");
    const originalHtml = btn.innerHTML;
    btn.innerHTML = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Mensaje enviado';
      btn.classList.add("sent");
      form.reset();
      Object.values(fields).forEach((field, i) => {
        const input = form.querySelectorAll("input, textarea")[i];
        if (input) input.classList.remove("valid", "invalid");
      });

      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        btn.classList.remove("sent");
      }, 3000);
    }, 1500);
  });
}