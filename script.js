const introOverlay = document.getElementById('intro-overlay');
const videoOverlay = document.getElementById('video-overlay');
const mainSite     = document.getElementById('main-site');
const introVideo   = document.getElementById('intro-video');
const enterBtn     = document.getElementById('enter-btn');
const skipBtn      = document.getElementById('skip-btn');

function revealMainSite() {
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
    // "Click Here" button — fade out intro, play video
    enterBtn.addEventListener('click', () => {
        introOverlay.classList.add('hidden');

        // Wait for intro fade to finish before showing video
        introOverlay.addEventListener('transitionend', () => {
            videoOverlay.classList.add('visible');
            introVideo.play();
        }, { once: true });
    });

    // Video ends naturally
    introVideo.addEventListener('ended', revealMainSite);

    // Skip button
    skipBtn.addEventListener('click', () => {
        introVideo.pause();
        revealMainSite();
    });
}

// ── Scroll reveal for .text blocks ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.text').forEach(el => revealObserver.observe(el));
