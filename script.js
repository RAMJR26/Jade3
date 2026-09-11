document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================
     1. Navegación entre slides
     ========================================== */
  const slides = Array.from(document.querySelectorAll(".slide"));
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsWrap = document.getElementById("dots");
  const heartsLayer = document.getElementById("heartsLayer");
  let current = 0;

  // Crea los puntos indicadores
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("is-active");
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");

    current = index;

    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");

    backBtn.disabled = current === 0;
    nextBtn.textContent = current === slides.length - 1 ? "De nuevo" : "Next";

    if (current === slides.length - 1) {
      launchHearts();
    }
  }

  nextBtn.addEventListener("click", () => {
    if (current === slides.length - 1) {
      goTo(0);
    } else {
      goTo(current + 1);
    }
  });
  backBtn.addEventListener("click", () => goTo(current - 1));

  document.getElementById("replayBtn").addEventListener("click", () => goTo(0));

  // Navegación con teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "ArrowLeft") backBtn.click();
  });

  // Swipe en móvil
  const card = document.getElementById("card");
  let touchStartX = 0;
  card.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  card.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) nextBtn.click();
    else backBtn.click();
  }, { passive: true });

  goTo(0);

  /* ==========================================
     2. Calendario de septiembre
     ========================================== */
  const grid = document.getElementById("calendarGrid");
  const weekdayLabels = ["D", "L", "M", "M", "J", "V", "S"];
  const daysInSeptember2026 = 30;
  const firstWeekday = 2; // 1 de septiembre 2026 cae en martes (0=domingo)
  const highlightDay = 15;

  weekdayLabels.forEach((label) => {
    const el = document.createElement("span");
    el.textContent = label;
    el.style.opacity = "0.7";
    el.style.borderBottom = "none";
    grid.appendChild(el);
  });

  for (let i = 0; i < firstWeekday; i++) {
    const empty = document.createElement("span");
    empty.classList.add("is-empty");
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInSeptember2026; day++) {
    const el = document.createElement("span");
    el.textContent = day;
    if (day === highlightDay) el.classList.add("is-today");
    grid.appendChild(el);
  }

  /* ==========================================
     3. Sobre / carta
     ========================================== */
  const envelope = document.getElementById("envelope");
  const envelopeHint = document.getElementById("envelopeHint");

  envelope.addEventListener("click", () => {
    const isOpen = envelope.classList.toggle("is-open");
    envelopeHint.textContent = isOpen ? "toca para cerrar" : "toca para abrir";
  });

  /* ==========================================
     5. Contador de tiempo juntos
     ========================================== */
  const startDate = new Date(2026, 5, 15, 0, 0, 0); // 15 de junio de 2026
  const elDays = document.getElementById("cDays");
  const elHours = document.getElementById("cHours");
  const elMinutes = document.getElementById("cMinutes");
  const elSeconds = document.getElementById("cSeconds");

  function pad(n) { return String(n).padStart(2, "0"); }

  function updateCounter() {
    if (!elDays) return;
    const now = new Date();
    let diff = Math.max(0, now - startDate);

    const oneSecond = 1000, oneMinute = oneSecond * 60, oneHour = oneMinute * 60, oneDay = oneHour * 24;

    const days = Math.floor(diff / oneDay);
    diff -= days * oneDay;
    const hours = Math.floor(diff / oneHour);
    diff -= hours * oneHour;
    const minutes = Math.floor(diff / oneMinute);
    diff -= minutes * oneMinute;
    const seconds = Math.floor(diff / oneSecond);

    elDays.textContent = days;
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  updateCounter();
  setInterval(updateCounter, 1000);

  /* ==========================================
     6. Corazones flotantes en el cierre
     ========================================== */
  function launchHearts() {
    if (launchHearts.done) return;
    launchHearts.done = true;

    const total = 18;
    for (let i = 0; i < total; i++) {
      setTimeout(() => {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = "♥";
        heart.style.left = Math.random() * 100 + "%";
        heart.style.fontSize = 0.9 + Math.random() * 1.1 + "rem";
        heart.style.animationDuration = 5 + Math.random() * 4 + "s";
        heartsLayer.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
      }, i * 220);
    }
  }
});
