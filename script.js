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
    // "Click Here" button — start video immediately behind intro, then fade intro out
    enterBtn.addEventListener('click', () => {
        // Show video overlay and start playing straight away (hidden behind intro)
        videoOverlay.classList.add('visible');
        introVideo.play().catch(() => {
            // Autoplay blocked — mute and retry (user can unmute)
            introVideo.muted = true;
            introVideo.play();
        });

        // Fade intro out at the same time — video has the full fade duration to buffer
        introOverlay.classList.add('hidden');
    });

    // Video ends naturally
    introVideo.addEventListener('ended', revealMainSite);

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
