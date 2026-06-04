const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const onScroll = () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
};
window.addEventListener('scroll', onScroll, { passive: true });

const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}, { passive: true });

// SCROLL
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
            const idx = siblings.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, idx * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// GO BACK BTN
const btn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// CAROUSEL
document.addEventListener("DOMContentLoaded", () => {
    const projectTrack = document.getElementById('projectTrack');

    if (projectTrack) {
        const originalContent = projectTrack.innerHTML;
        projectTrack.innerHTML += originalContent;
    }
});

(function () {
    const gridItems = document.querySelectorAll('.si-grid-item');

    if (!gridItems.length) return;

    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const items = [...document.querySelectorAll('.si-grid-item')];
                const idx = items.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('si-grid-visible');
                }, idx * 120);
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    gridItems.forEach(el => gridObserver.observe(el));
})();

(function () {
    const siName = document.querySelector('.si-name');
    if (!siName) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const section = document.getElementById('social-intro');
                if (!section) return;
                const rect = section.getBoundingClientRect();
                const progress = -rect.top / (rect.height || 1);
                const offset = Math.min(Math.max(progress * 18, -8), 8);
                siName.style.transform = `translateY(${offset}px)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// Parallax Scrolling Engine for Display Typography
(function () {
    const siName = document.querySelector('.si-name');
    if (!siName) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const section = document.getElementById('social-intro');
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // Detect viewport status coordinates
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const speed = 0.08;
                        const yPos = -(rect.top * speed);
                        siName.style.transform = `translateY(${yPos}px)`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})(); 