/* =========================================================
   🔮 JS V55: ALIGNED SYNC + TOUCH SUPPORT
   ========================================================= */
const nextBtn = document.querySelector('#next');
const prevBtn = document.querySelector('#prev');
const carousel = document.querySelector('.carousel');
const listItem = document.querySelector('.carousel .list');
const thumbnailContainer = document.querySelector('.carousel .thumbnail');

const timeAutoNext = 8000; 

function showSlider(type) {
    const itemSlider = document.querySelectorAll('.carousel .list .item');
    const itemThumbnail = document.querySelectorAll('.carousel .thumbnail .item');

    carousel.classList.remove('next');
    carousel.classList.remove('prev');
    void carousel.offsetWidth; 

    if (type === 'next') {
        listItem.appendChild(itemSlider[0]);
        thumbnailContainer.appendChild(itemThumbnail[0]);
        carousel.classList.add('next');
    } else {
        listItem.prepend(itemSlider[itemSlider.length - 1]);
        thumbnailContainer.prepend(itemThumbnail[itemThumbnail.length - 1]);
        carousel.classList.add('prev');
    }
    resetAutoPlay();
}

thumbnailContainer.addEventListener('click', (e) => {
    const clickedItem = e.target.closest('.item');
    if (!clickedItem) return;
    const currentThumbs = Array.from(thumbnailContainer.querySelectorAll('.item'));
    const targetIndex = currentThumbs.indexOf(clickedItem);

    if (targetIndex >= 0) {
        for (let i = 0; i <= targetIndex; i++) {
            setTimeout(() => { showSlider('next'); }, i * 150); 
        }
    }
});

nextBtn.onclick = () => showSlider('next');
prevBtn.onclick = () => showSlider('prev');

let runAutoRun;
function resetAutoPlay() {
    clearTimeout(runAutoRun);
    runAutoRun = setTimeout(() => { nextBtn.click(); }, timeAutoNext);
}

/* =========================================================
   ADICIONANDO SUPORTE A TOUCH (SWIPE)
   ========================================================= */
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50; // Sensibilidade do deslize
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Deslizou para a esquerda (próximo)
        showSlider('next');
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Deslizou para a direita (anterior)
        showSlider('prev');
    }
}

// Inicializa o autoplay
resetAutoPlay();