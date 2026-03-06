const introOverlay = document.getElementById('intro-overlay');
const videoOverlay = document.getElementById('video-overlay');
const mainSite     = document.getElementById('main-site');
const introVideo   = document.getElementById('intro-video');
const enterBtn     = document.getElementById('enter-btn');
const skipBtn      = document.getElementById('skip-btn');

// Keep intro video silent on all devices/browsers.
introVideo.muted = true;
introVideo.playsInline = true;
introVideo.setAttribute('playsinline', '');
introVideo.setAttribute('webkit-playsinline', '');

let hasRevealedMainSite = false;

function revealMainSite() {
    if (hasRevealedMainSite) return;
    hasRevealedMainSite = true;

    videoOverlay.classList.remove('visible');
    videoOverlay.classList.add('hidden');
    mainSite.classList.add('visible');
    // Remember for this session so the intro doesn't repeat on refresh
    sessionStorage.setItem('skipIntro', 'true');
}

// If the user already watched the intro this session, skip straight to the site
if (sessionStorage.getItem('skipIntro')) {
    introOverlay.style.display = 'none';
    videoOverlay.style.display = 'none';
    mainSite.classList.add('visible');
} else {
    // "Click Here" button — start video immediately behind intro, then fade intro out
    enterBtn.addEventListener('click', () => {
        // Show video overlay and start playing straight away (hidden behind intro)
        videoOverlay.classList.add('visible');
        introVideo.currentTime = 0;
        introVideo.play().catch(() => {
            // Retry once muted if an Android browser blocks first attempt.
            introVideo.muted = true;
            introVideo.play();
        });

        // Fade intro out at the same time — video has the full fade duration to buffer
        introOverlay.classList.add('hidden');
    });

    // Video ends naturally
    introVideo.addEventListener('ended', revealMainSite);

    // Some Android browsers occasionally miss the ended event; fall back near the end.
    introVideo.addEventListener('timeupdate', () => {
        if (introVideo.duration && introVideo.currentTime >= introVideo.duration - 0.2) {
            revealMainSite();
        }
    });

    // If playback fails for any reason, continue into the site.
    introVideo.addEventListener('error', revealMainSite);

    // Skip button
    skipBtn.addEventListener('click', () => {
        introVideo.pause();
        revealMainSite();
    });
}



const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.text').forEach(el => revealObserver.observe(el));

// ── Smooth scroll to top on Home button click ──
const homeBtn = document.getElementById('home-btn');
if (homeBtn) {
    homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── Carousel ──
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const dotsContainer = document.getElementById('carousel-dots');

let currentIndex = 0;
const totalSlides = carouselSlides.length;
let autoplayInterval;

// Create dots
carouselSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.carousel-dot');

function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetAutoplay();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
}

function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
}

// Event listeners
prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay();
    }
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
        nextSlide();
        resetAutoplay();
    } else if (touchEndX - touchStartX > 50) {
        prevSlide();
        resetAutoplay();
    }
}

// Start autoplay
startAutoplay();
