/* ═══════════════════════════════════════════════════════════
   ANIM.JS — Scroll, Nav, Hearts, Parallax, Carousel
   Portfolio: Jhody Atinon · @jhy_atnn
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. ACTIVE NAV LINK ON SCROLL
───────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const onNavScroll = () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
};
window.addEventListener('scroll', onNavScroll, { passive: true });


/* ─────────────────────────────────────────
   2. SCROLLED CAPSULE NAV
───────────────────────────────────────── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ─────────────────────────────────────────
   3. MOBILE BURGER — ensure Bootstrap works
───────────────────────────────────────── */
const toggler    = document.querySelector('.navbar-toggler');
const navMenu    = document.getElementById('navMenu');

if (toggler && navMenu) {
    // Close menu when a nav link is clicked (mobile)
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                const bsCollapse = bootstrap.Collapse.getInstance(navMenu)
                    || new bootstrap.Collapse(navMenu, { toggle: false });
                bsCollapse.hide();
            }
        });
    });
}


/* ─────────────────────────────────────────
   4. SCROLL REVEAL (multi-direction)
───────────────────────────────────────── */
const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
const allReveals    = document.querySelectorAll(revealClasses.join(','));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const parent   = entry.target.parentElement;
        const siblings = [...parent.querySelectorAll(revealClasses.join(','))];
        const idx      = siblings.indexOf(entry.target);

        setTimeout(() => {
            entry.target.classList.add('visible');
        }, idx * 85);

        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.10 });

allReveals.forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────
   5. GRID ITEMS (social-intro)
───────────────────────────────────────── */
(function () {
    const gridItems = document.querySelectorAll('.si-grid-item');
    if (!gridItems.length) return;

    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const items = [...document.querySelectorAll('.si-grid-item')];
            const idx   = items.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('si-grid-visible');
            }, idx * 120);
            gridObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    gridItems.forEach(el => gridObserver.observe(el));
})();


/* ─────────────────────────────────────────
   6. PARALLAX on si-name
───────────────────────────────────────── */
(function () {
    const siName  = document.querySelector('.si-name');
    if (!siName) return;
    let ticking   = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const section = document.getElementById('social-intro');
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const speed = 0.08;
                        const yPos  = -(rect.top * speed);
                        siName.style.transform = `translateY(${yPos}px)`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();


/* ─────────────────────────────────────────
   7. BACK TO TOP
───────────────────────────────────────── */
const backBtn = document.getElementById('backToTop');
if (backBtn) {
    window.addEventListener('scroll', () => {
        backBtn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ─────────────────────────────────────────
   8. PROJECT CAROUSEL (infinite clone)
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const projectTrack = document.getElementById('projectTrack');
    if (projectTrack) {
        projectTrack.innerHTML += projectTrack.innerHTML;
    }
});


/* ─────────────────────────────────────────
   9. FALLING HEARTS ENGINE
   Triggered when #social-intro is in view
───────────────────────────────────────── */
(function () {
    const canvas  = document.createElement('canvas');
    canvas.id     = 'hearts-canvas';
    document.body.appendChild(canvas);

    const ctx     = canvas.getContext('2d');
    let   hearts  = [];
    let   running = false;
    let   animId  = null;

    function resize () {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* Heart path helper */
    function drawHeart (ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.3);
        ctx.bezierCurveTo( size * 0.5, -size,       size,       -size * 0.2,  0, size * 0.5);
        ctx.bezierCurveTo(-size,        -size * 0.2, -size * 0.5, -size, 0, -size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    const COLORS = [
        'rgba(255,60,172,',   // pink
        'rgba(255,107,0,',    // orange
        'rgba(123,47,247,',   // purple
        'rgba(255,100,150,',  // rose
        'rgba(255,80,80,',    // red
    ];

    function spawnHeart () {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        hearts.push({
            x:       Math.random() * canvas.width,
            y:       -20,
            size:    8  + Math.random() * 18,
            speed:   1.2 + Math.random() * 2.5,
            wobble:  (Math.random() - 0.5) * 1.5,
            wobbleF: 0.02 + Math.random() * 0.03,
            wobbleT: 0,
            alpha:   0.55 + Math.random() * 0.45,
            color,
            rot:     (Math.random() - 0.5) * 0.4,
        });
    }

    let spawnInterval = null;

    function startHearts () {
        if (running) return;
        running = true;
        canvas.classList.add('active');

        spawnInterval = setInterval(() => {
            if (hearts.length < 40) spawnHeart();
        }, 120);

        function loop () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            hearts = hearts.filter(h => h.y < canvas.height + 40 && h.alpha > 0.02);

            hearts.forEach(h => {
                h.wobbleT += h.wobbleF;
                h.x       += Math.sin(h.wobbleT) * h.wobble;
                h.y       += h.speed;
                h.alpha   -= 0.0018;

                ctx.save();
                ctx.globalAlpha = h.alpha;
                ctx.fillStyle   = `${h.color}${h.alpha})`;
                ctx.rotate(h.rot);
                drawHeart(ctx, h.x, h.y, h.size);
                ctx.restore();
            });

            animId = requestAnimationFrame(loop);
        }
        loop();
    }

    function stopHearts () {
        if (!running) return;
        running = false;

        clearInterval(spawnInterval);
        spawnInterval = null;

        // Fade out canvas
        canvas.classList.remove('active');

        // Let remaining hearts fall out
        setTimeout(() => {
            cancelAnimationFrame(animId);
            hearts = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 1200);
    }

    /* Observe the social-intro section */
    const socialSection = document.getElementById('social-intro');
    if (socialSection) {
        const heartsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startHearts();
                } else {
                    stopHearts();
                }
            });
        }, { threshold: 0.15 });

        heartsObserver.observe(socialSection);
    }
})();


/* ─────────────────────────────────────────
   10. IG "LIKE" BUTTON in social section
───────────────────────────────────────── */
(function () {
    const likeBtn = document.getElementById('igLikeBtn');
    const likeCount = document.getElementById('igLikeCount');
    if (!likeBtn || !likeCount) return;

    let liked = false;
    let count = parseInt(likeCount.textContent, 10) || 2847;

    likeBtn.addEventListener('click', () => {
        liked = !liked;
        likeBtn.classList.toggle('liked', liked);
        count = liked ? count + 1 : count - 1;
        likeCount.textContent = count.toLocaleString();

        // Spawn mini pop heart at click position
        if (liked) {
            const pop = document.createElement('span');
            pop.className = 'si-heart-pop';
            pop.textContent = '❤️';
            pop.style.left   = likeBtn.getBoundingClientRect().left + 'px';
            pop.style.top    = likeBtn.getBoundingClientRect().top + window.scrollY + 'px';
            document.body.appendChild(pop);
            setTimeout(() => pop.remove(), 1300);
        }
    });
})();


/* ─────────────────────────────────────────
   11. SMOOTH SECTION ENTRANCE via CSS class
───────────────────────────────────────── */
// Stagger children of a container that has data-stagger attribute
document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = [...parent.children];
    children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 90}ms`;
        child.classList.add('reveal');
        revealObserver.observe(child);
    });
});
