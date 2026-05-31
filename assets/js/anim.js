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