'use strict';

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


const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


const toggler    = document.querySelector('.navbar-toggler');
const navMenu    = document.getElementById('navMenu');

if (toggler && navMenu) {
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


const backBtn = document.getElementById('backToTop');
if (backBtn) {
    window.addEventListener('scroll', () => {
        backBtn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const projectTrack = document.getElementById('projectTrack');
    const projectDetail = document.getElementById('projectDetail');
    if (!projectTrack || !projectDetail) return;

    const originalCards = Array.from(projectTrack.querySelectorAll('.project-link'));
    originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.classList.remove('active');
        projectTrack.appendChild(clone);
    });

    const detailCount = document.getElementById('projectDetailCount');
    const detailCat = document.getElementById('projectDetailCat');
    const detailTitle = document.getElementById('projectDetailTitle');
    const detailDesc = document.getElementById('projectDetailDesc');
    const detailTags = document.getElementById('projectDetailTags');
    const detailLink = document.getElementById('projectDetailLink');

    let currentIndex = 0;
    let autoRotateInterval = null;

    function setProjectDetails(card) {
        const cat = card.querySelector('.project-cat')?.textContent.trim() || '';
        const title = card.querySelector('h5')?.textContent.trim() || '';
        const desc = card.querySelector('p')?.textContent.trim() || '';
        const tags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.outerHTML).join('');

        projectTrack.querySelectorAll('.project-link').forEach((item) => {
            item.classList.toggle('active', item.querySelector('h5')?.textContent.trim() === title);
        });

        projectDetail.classList.add('is-changing');
        window.setTimeout(() => {
            detailCount.textContent = card.dataset.index || '01';
            detailCat.textContent = cat;
            detailTitle.textContent = title;
            detailDesc.textContent = desc;
            detailTags.innerHTML = tags;
            detailLink.href = card.dataset.url || '#';

            projectDetail.classList.remove('is-changing');
        }, 140);
    }

    function rotateToNext() {
        const allCards = projectTrack.querySelectorAll('.project-link');
        if (allCards.length === 0) return;
        
        currentIndex = (currentIndex + 1) % originalCards.length;
        setProjectDetails(allCards[currentIndex]);
    }

    function startAutoRotate() {
        autoRotateInterval = setInterval(rotateToNext, 6700);
    }

    if (originalCards.length > 0) {
        setProjectDetails(originalCards[0]);
        startAutoRotate();
    }

    projectTrack.addEventListener('click', (event) => {
        const card = event.target.closest('.project-link');
        if (!card) return;
        
        const allCards = projectTrack.querySelectorAll('.project-link');
        currentIndex = Array.from(allCards).indexOf(card) % originalCards.length;
        
        setProjectDetails(card);
        
        clearInterval(autoRotateInterval);
        startAutoRotate();
    });

    const carouselContainer = projectTrack.parentElement;
    let lastClickedCard = null;
    let isResetting = false;

    function checkCenteredCard() {
        if (isResetting) return;
        
        const containerRect = carouselContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        let closestCard = null;
        let closestDistance = Infinity;

        projectTrack.querySelectorAll('.project-link').forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - containerCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestCard = card;
            }
        });

        if (closestCard && closestDistance < 100 && lastClickedCard !== closestCard) {
            lastClickedCard = closestCard;
            closestCard.click();
        }
    }

    function handleInfiniteScroll() {
        if (isResetting) return;
        
        const scrollLeft = carouselContainer.scrollLeft;
        const containerWidth = carouselContainer.clientWidth;
        const scrollWidth = projectTrack.scrollWidth;
        
        const maxScroll = scrollWidth - containerWidth;
        
        if (scrollLeft >= maxScroll - 100) {
            isResetting = true;
            carouselContainer.scrollLeft = 0;
            lastClickedCard = null;
            setTimeout(() => {
                isResetting = false;
                checkCenteredCard();
            }, 60);
        }
    }

    carouselContainer.addEventListener('scroll', checkCenteredCard, { passive: true });
    carouselContainer.addEventListener('scroll', handleInfiniteScroll, { passive: true });
    window.addEventListener('resize', () => {
        checkCenteredCard();
        handleInfiniteScroll();
    }, { passive: true });
    
    setTimeout(checkCenteredCard, 100);
});


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
        'rgba(255,60,172,',   
        'rgba(255,107,0,',    
        'rgba(123,47,247,',   
        'rgba(255,100,150,', 
        'rgba(255,80,80,',    
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
        canvas.classList.remove('active');
        setTimeout(() => {
            cancelAnimationFrame(animId);
            hearts = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 1200);
    }

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


document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = [...parent.children];
    children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 90}ms`;
        child.classList.add('reveal');
        revealObserver.observe(child);
    });
});
