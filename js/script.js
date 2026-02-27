// Nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
function closeMenu() { navLinks.classList.remove('open'); }

// Nav scroll
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', scrollY > 30);
});

// Scroll reveal
const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('vis'), i * 80);
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

// Skill bars animation
const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-bar').forEach(bar => {
                bar.style.width = bar.dataset.w;
            });
            barObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-cat').forEach(el => barObs.observe(el));

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Message envoyé !';
    btn.style.background = '#22c55e';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; e.target.reset(); }, 2500);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// === CAROUSEL: auto-scroll + buttons + drag ===
(function() {
    const track = document.getElementById('carouselTrack');
    const container = document.getElementById('carouselContainer');
    if (!track || !container) return;

    // Duplicate cards for seamless infinite loop
    const original = track.innerHTML;
    track.innerHTML = original + original;

    const gap = 24;
    const cardW = 380 + gap;
    const totalCards = track.children.length / 2; // original count
    const halfWidth = totalCards * cardW;

    let pos = 0;             // current translateX position
    let speed = 0.6;         // pixels per frame (auto-scroll)
    let autoPlay = true;
    let isDrag = false;
    let startX = 0;
    let dragStartPos = 0;
    let rafId = null;
    let pauseTimer = null;

    function setPos(x) {
        pos = x;
        // Loop: when we've scrolled past the first set, jump back
        if (pos <= -halfWidth) pos += halfWidth;
        if (pos > 0) pos -= halfWidth;
        track.style.transform = 'translateX(' + pos + 'px)';
    }

    // Animation loop
    function tick() {
        if (autoPlay && !isDrag) {
            setPos(pos - speed);
        }
        rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    // Pause auto-scroll temporarily
    function pauseAuto() {
        autoPlay = false;
        clearTimeout(pauseTimer);
    }
    function resumeAutoAfter(ms) {
        clearTimeout(pauseTimer);
        pauseTimer = setTimeout(() => { autoPlay = true; }, ms || 3000);
    }

    // Smooth scroll by amount
    function smoothScroll(amount) {
        pauseAuto();
        const start = pos;
        const target = pos + amount;
        const duration = 400;
        let startTime = null;

        function animate(time) {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setPos(start + (target - start) * ease);
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resumeAutoAfter(3000);
            }
        }
        requestAnimationFrame(animate);
    }

    // Buttons
    document.getElementById('carouselPrev').addEventListener('click', () => smoothScroll(cardW));
    document.getElementById('carouselNext').addEventListener('click', () => smoothScroll(-cardW));

    // Mouse drag
    container.addEventListener('mousedown', (e) => {
        isDrag = true; startX = e.pageX; dragStartPos = pos; pauseAuto();
        e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDrag) return;
        setPos(dragStartPos + (e.pageX - startX));
    });
    window.addEventListener('mouseup', () => {
        if (!isDrag) return;
        isDrag = false;
        resumeAutoAfter(3000);
    });

    // Touch drag
    container.addEventListener('touchstart', (e) => {
        isDrag = true; startX = e.touches[0].pageX; dragStartPos = pos; pauseAuto();
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
        if (!isDrag) return;
        setPos(dragStartPos + (e.touches[0].pageX - startX));
    }, { passive: true });
    window.addEventListener('touchend', () => {
        if (!isDrag) return;
        isDrag = false;
        resumeAutoAfter(3000);
    });

    // Pause on hover
    container.addEventListener('mouseenter', () => { if (!isDrag) pauseAuto(); });
    container.addEventListener('mouseleave', () => { if (!isDrag) resumeAutoAfter(800); });
})();
