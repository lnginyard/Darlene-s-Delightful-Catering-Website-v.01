// Mobile menu toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Helper: create or return lightbox element
function ensureLightbox() {
    let lb = document.querySelector('.lightbox');
    if (!lb) {
        lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.innerHTML = `
            <span class="close" aria-label="Close">&times;</span>
            <img src="" alt="">
        `;
        document.body.appendChild(lb);

        lb.addEventListener('click', (e) => {
            if (e.target === lb || e.target.classList.contains('close')) {
                lb.classList.remove('visible');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') lb.classList.remove('visible');
        });
    }
    return lb;
}

// Open lightbox with image
function openLightbox(src, alt = '') {
    const lb = ensureLightbox();
    const img = lb.querySelector('img');
    img.src = src;
    img.alt = alt;
    lb.classList.add('visible');
}

// Menu filtering
function initMenuFilter() {
    const filters = document.querySelectorAll('.filter-btn');
    if (!filters.length) return;
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter || 'all';
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.img-card').forEach(card => {
                const cat = card.dataset.category || 'all';
                if (filter === 'all' || filter === cat) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Testimonials carousel (basic)
function initTestimonialCarousel() {
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;

    // Wrap children into track
    const cards = Array.from(grid.children);
    const carousel = document.createElement('div');
    carousel.className = 'testimonial-carousel';
    const track = document.createElement('div');
    track.className = 'carousel-track';

    cards.forEach(card => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.appendChild(card);
        track.appendChild(item);
    });

    carousel.appendChild(track);

    // Dots
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    const dots = cards.map((c,i)=>{
        const d = document.createElement('div'); d.className='carousel-dot';
        d.addEventListener('click', ()=>{ moveTo(i); resetAutoplay(); });
        controls.appendChild(d);
        return d;
    });

    grid.replaceWith(carousel);
    carousel.appendChild(controls);

    let index = 0;
    const moveTo = (i) => {
        index = (i + cards.length) % cards.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d,ii)=>d.classList.toggle('active', ii===index));
    };

    let autoplay = setInterval(()=>{ moveTo(index+1); }, 5000);
    const resetAutoplay = ()=>{ clearInterval(autoplay); autoplay = setInterval(()=>{ moveTo(index+1); }, 5000); };

    // Start
    moveTo(0);
}

// Initialize gallery images to use lightbox
function initGalleryLightbox() {
    document.querySelectorAll('.gallery-item, .img-card').forEach(el => {
        const img = el.querySelector('img');
        if (img) {
            img.setAttribute('loading','lazy');
            el.addEventListener('click', () => openLightbox(img.src, img.alt || ''));
        }
    });
}

// Smooth-scrolling for internal anchors
function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e){
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Parallax effect on scroll
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        hero.style.backgroundPosition = `center ${scrollPos * 0.5}px`;
    });
}

// Add animation to elements on viewport entry
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Observe event cards for staggered animation
    document.querySelectorAll('.event-card').forEach(el => {
        if (!el.style.animationDelay) {
            observer.observe(el);
        }
    });

    // Observe image cards
    document.querySelectorAll('.img-card').forEach(el => {
        observer.observe(el);
    });

    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const nav = document.getElementById('navLinks');
            if (nav) nav.classList.remove('active');
        });
    });

    // Set active navigation based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Initialize new features (if elements exist)
    initGalleryLightbox();
    initMenuFilter();
    initTestimonialCarousel();
    initSmoothAnchors();
    initParallaxEffect();
    initScrollAnimations();
});
