document.addEventListener("DOMContentLoaded", () => {
  function initCarousel(sectionSelector, containerSelector, prevId, nextId, cardSelector, dotSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const container = section.querySelector(containerSelector);
    const cards = Array.from(section.querySelectorAll(cardSelector));
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dots = Array.from(section.querySelectorAll(dotSelector));
    const progressFill = section.querySelector(".progress-bar-fill");

    if (!cards.length || !prevBtn || !nextBtn) return;

    let current = 0;
    const total = cards.length;
    let autoplay = null;
    const AUTOPLAY_TIME = 6500;

    function resetProgressBar() {
      if (!progressFill) return;
      progressFill.classList.remove("animate-progress");
      void progressFill.offsetWidth; 
      progressFill.classList.add("animate-progress");
    }

    function startAutoplay() {
      stopAutoplay();
      autoplay = setInterval(goNext, AUTOPLAY_TIME);
      resetProgressBar();
    }

    function stopAutoplay() {
      if (autoplay) clearInterval(autoplay);
      if (progressFill) progressFill.classList.remove("animate-progress");
    }

    function updateCarousel() {
      const prevIdx = (current - 1 + total) % total;
      const nextIdx = (current + 1) % total;
      const winW = window.innerWidth;
      
      // Cálculo de Medidas Adaptativas
      let offset = winW * 0.22; 
      let scaleSide = 0.7;
      let zActive = 120;

      if (winW <= 480) {
        offset = 0;
        scaleSide = 0; 
      } else if (winW < 1100) {
        offset = 180;
        scaleSide = 0.65;
      }

      cards.forEach((card, index) => {
        card.classList.remove("active");
        card.style.pointerEvents = "none";

        if (index === current) {
          card.classList.add("active");
          card.style.transform = `translateX(0) scale(1) translateZ(${zActive}px)`;
          card.style.opacity = "1";
          card.style.visibility = "visible";
          card.style.zIndex = "10";
          card.style.pointerEvents = "auto";
        } 
        else if (index === prevIdx) {
          card.style.transform = `translateX(-${offset}px) scale(${scaleSide}) translateZ(-60px) rotateY(12deg)`;
          card.style.opacity = winW <= 480 ? "0" : "0.45";
          card.style.visibility = winW <= 480 ? "hidden" : "visible";
          card.style.zIndex = "5";
          card.style.pointerEvents = "auto";
          card.onclick = goPrev;
        } 
        else if (index === nextIdx) {
          card.style.transform = `translateX(${offset}px) scale(${scaleSide}) translateZ(-60px) rotateY(-12deg)`;
          card.style.opacity = winW <= 480 ? "0" : "0.45";
          card.style.visibility = winW <= 480 ? "hidden" : "visible";
          card.style.zIndex = "5";
          card.style.pointerEvents = "auto";
          card.onclick = goNext;
        } 
        else {
          card.style.transform = "scale(0.4) translateZ(-500px)";
          card.style.opacity = "0";
          card.style.visibility = "hidden";
        }
      });

      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
      resetProgressBar();
    }

    function goNext() { current = (current + 1) % total; updateCarousel(); }
    function goPrev() { current = (current - 1 + total) % total; updateCarousel(); }

    // Touch Support (Swipe)
    let touchStartX = 0;
    container.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
    container.addEventListener('touchend', e => {
      let touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) { startAutoplay(); goNext(); }
      if (touchEndX > touchStartX + 50) { startAutoplay(); goPrev(); }
    }, {passive: true});

    prevBtn.onclick = (e) => { e.preventDefault(); startAutoplay(); goPrev(); };
    nextBtn.onclick = (e) => { e.preventDefault(); startAutoplay(); goNext(); };

    dots.forEach((dot, i) => {
      dot.onclick = () => { current = i; startAutoplay(); updateCarousel(); };
    });

    window.addEventListener("resize", updateCarousel);
    updateCarousel();
    startAutoplay();
  }

  initCarousel(".frota", ".carousel-container", "prevBtn", "nextBtn", ".card", ".dot");
  initCarousel(".backoffice", ".carousel-container", "backofficePrev", "backofficeNext", ".card", ".dot");
  initCarousel(".faturamento", ".carousel-container", "faturamentoPrev", "faturamentoNext", ".card", ".dot");
  initCarousel(".produtividade", ".carousel-container", "produtividadePrev", "produtividadeNext", ".card", ".dot");
  initCarousel(".sesmt", ".carousel-container", "sesmtPrev", "sesmtNext", ".card", ".dot");


});