// ============================================
// NAVBAR FUNCTIONALITY
// ============================================

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

/**
 * Scroll event listener for navbar background
 * Changes background from transparent to white when scrolling
 */
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white', 'shadow-md');
        navbar.classList.remove('bg-transparent');
    } else {
        navbar.classList.remove('bg-white', 'shadow-md');
        navbar.classList.add('bg-transparent');
    }
});

/**
 * Mobile menu toggle
 * Opens/closes mobile navigation menu
 */
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

/**
 * Handle navigation link clicks
 * Removes active class from all links and adds it to clicked link
 * Closes mobile menu after selection
 * @param {NodeList} links - Navigation links to attach listeners to
 */
function handleNavClick(links) {
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            links.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');

            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });
}

handleNavClick(navLinks);
handleNavClick(mobileNavLinks);

// ============================================
// HERO VIDEO PARALLAX & FADE EFFECT
// ============================================

const heroContainer = document.querySelector('.hero-video-container');
const heroContent = document.getElementById('hero-content');
const heroOverlay = document.getElementById('hero-overlay');
const heroVideo = document.getElementById('hero-video');
const heroBannerContent = document.querySelector('.hero-banner-content');

if (heroBannerContent) {
    window.addEventListener('DOMContentLoaded', () => {
        heroBannerContent.classList.add('hero-visible');
    });
}

/**
 * Hero video parallax and fade animation
 * Creates smooth fade-out and parallax effect as user scrolls
 */
window.addEventListener('scroll', () => {
    if (heroContainer && heroContent && heroOverlay && heroVideo) {
        const scrollY = window.scrollY;
        const heroHeight = heroContainer.offsetHeight;
        
        // Calculate fade progress (0 to 1)
        const fadeProgress = Math.min(scrollY / (heroHeight * 0.5), 1);
        
        // Fade out hero content
        heroContent.style.opacity = 1 - fadeProgress;
        heroContent.style.transform = `translateY(${fadeProgress * 30}px)`;
        
        // Fade out overlay
        heroOverlay.style.opacity = 0.5 - (fadeProgress * 0.5);

        // Fade out the hero video itself
        heroVideo.style.opacity = 1 - fadeProgress;
        
        // Parallax effect for video (moves slower than scroll)
        heroVideo.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
});

// ============================================
// ACTIVE LINK HIGHLIGHTING BASED ON CURRENT PAGE
// ============================================

/**
 * Resolve a navigation link to a normalized key used for highlighting.
 */
function getNavLinkKey(linkUrl) {
    const pathname = linkUrl.pathname.replace(/\/$/, '');
    if (pathname.includes('/products/')) return 'products';
    if (pathname.includes('/clients/')) return 'clients';
    if (pathname === '' || pathname.endsWith('/index.html')) return 'home';
    if (pathname.endsWith('/about.html')) return 'about';
    if (pathname.endsWith('/contact.html')) return 'contact';
    if (pathname.endsWith('/clients.html')) return 'clients';
    if (pathname.endsWith('/products.html')) return 'products';
    return null;
}

/**
 * Determine the current page key for the active navbar item.
 */
function getCurrentPageKey() {
    const pathname = window.location.pathname.replace(/\/$/, '');
    if (pathname.includes('/products/')) return 'products';
    if (pathname.includes('/clients/')) return 'clients';
    if (pathname === '' || pathname.endsWith('/index.html')) return 'home';
    if (pathname.endsWith('/about.html')) return 'about';
    if (pathname.endsWith('/contact.html')) return 'contact';
    if (pathname.endsWith('/clients.html')) return 'clients';
    if (pathname.endsWith('/products.html')) return 'products';
    return null;
}

/**
 * Set the active navbar link based on the current page path.
 */
function setActiveLinkByPage() {
    const currentKey = getCurrentPageKey();
    if (!currentKey) return;

    const allLinks = [...navLinks, ...mobileNavLinks];
    allLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (!href) return;

        try {
            const linkUrl = new URL(href, window.location.href);
            if (getNavLinkKey(linkUrl) === currentKey) {
                link.classList.add('active');
            }
        } catch (error) {
            // Ignore invalid href values
        }
    });
}

/**
 * Update active link based on current scroll position for anchor links.
 */
function updateActiveLink() {
    setActiveLinkByPage();

    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    if (!currentSection) return;

    const anchorLinks = [...navLinks, ...mobileNavLinks].filter(link => {
        const href = link.getAttribute('href');
        return href && href.startsWith('#');
    });

    anchorLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('DOMContentLoaded', setActiveLinkByPage);
window.addEventListener('scroll', updateActiveLink);

// ============================================
// MOBILE MENU CLOSE ON OUTSIDE CLICK
// ============================================

/**
 * Close mobile menu when clicking outside
 */
document.addEventListener('click', (e) => {
    const isClickInsideMenu = mobileMenu.contains(e.target);
    const isClickOnButton = mobileMenuBtn.contains(e.target);

    if (!isClickInsideMenu && !isClickOnButton && mobileMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// ============================================
// SMOOTH SCROLL BEHAVIOR FOR OLDER BROWSERS
// ============================================

/**
 * Polyfill for smooth scroll behavior
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

/**
 * Close mobile menu on window resize to larger screen
 */
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// ============================================
// LOGO & TAGLINE REVEAL - INTERSECTION & SCROLL
// ============================================

const logoRevealSection = document.getElementById('logo-reveal');
const logoRevealContent = document.querySelector('.logo-reveal-content');

if (logoRevealSection && logoRevealContent) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    logoRevealContent.classList.add('visible');
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -25% 0px' });

        observer.observe(logoRevealSection);
    } else {
        // Fallback for older browsers: show when script loads
        logoRevealContent.classList.add('visible');
    }
}

// Fade out logo section once when scrolled past
window.addEventListener('scroll', () => {
    if (!logoRevealSection || !logoRevealContent || logoRevealSection.dataset.collapsed === 'true') return;
    const rect = logoRevealSection.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    if (rect.bottom < vh * 0.15) {
        window.requestAnimationFrame(() => {
            logoRevealContent.classList.add('fading');
            logoRevealSection.classList.add('collapsed');
            logoRevealSection.dataset.collapsed = 'true';
        });
    }
});

// ============================================
// TYPEWRITER TAGLINE
// ============================================

const typewriterTitle = document.getElementById('typewriter-title');
const typewriter = document.getElementById('typewriter');
const typewriterContent = document.querySelector('.logo-reveal-content');
const typewriterTitleText = 'Gadgets 4 Lifestyle';
const typewriterTexts = [
    'Your Green Gadgets for Your Sustainable Lifestyle'
];
let typewriterIndex = 0;
let currentChar = 0;

const TYPEWRITER_HOLD_MS = 1800;
const TYPEWRITER_FADE_MS = 700;

function resetTypewriter() {
    currentChar = 0;
    if (typewriterTitle) typewriterTitle.textContent = '';
    if (typewriter) typewriter.textContent = '';
    if (typewriterContent) typewriterContent.classList.remove('typewriter-fading');
}

function runTypewriter() {
    if (!typewriterTitle || !typewriter || !typewriterContent) return;

    const currentText = typewriterTexts[typewriterIndex];
    const maxLength = Math.max(typewriterTitleText.length, currentText.length);

    typewriterTitle.textContent = typewriterTitleText.slice(0, Math.min(currentChar + 1, typewriterTitleText.length));
    typewriter.textContent = currentText.slice(0, Math.min(currentChar + 1, currentText.length));
    currentChar += 1;

    if (currentChar >= maxLength) {
        setTimeout(() => {
            typewriterContent.classList.add('typewriter-fading');

            setTimeout(() => {
                typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
                resetTypewriter();
                runTypewriter();
            }, TYPEWRITER_FADE_MS);
        }, TYPEWRITER_HOLD_MS);
        return;
    }

    setTimeout(runTypewriter, 70);
}

document.addEventListener('DOMContentLoaded', runTypewriter);

// ============================================
// FADE-UP SECTIONS (generic)
// ============================================

const fadeUpElems = document.querySelectorAll('.fade-up-content, .fade-left-content, .fade-right-content');
if ('IntersectionObserver' in window && fadeUpElems.length) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeUpElems.forEach(el => fadeObserver.observe(el));
} else {
    // Fallback: reveal immediately
    fadeUpElems.forEach(el => el.classList.add('visible'));
}

// ============================================
// CLIENT GALLERY CAROUSEL FUNCTIONALITY
// ============================================

function initGalleryCarousels() {
    const carousels = document.querySelectorAll('.clients-gallery-carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.gallery-track');
        const slides = carousel.querySelectorAll('.gallery-slide');
        const prevBtn = carousel.querySelector('.gallery-prev');
        const nextBtn = carousel.querySelector('.gallery-next');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });
        
        updateCarousel();
    });
}

// Initialize gallery carousels and product carousels on page load
document.addEventListener('DOMContentLoaded', () => {
    initGalleryCarousels();
    // initialize general carousels (arrows, lightbox triggers)
    if (typeof initCarousel === 'function') initCarousel();
});

// ============================================
// LIGHTBOX FOR CLIENT GALLERIES
// ============================================

let clientGalleryImages = [];
let clientGalleryCurrentIndex = 0;

function openClientGallery(imgElement) {
    const carousel = imgElement.closest('.clients-gallery-carousel');
    if (carousel) {
        clientGalleryImages = Array.from(carousel.querySelectorAll('.gallery-slide img')).map(img => img.src);
    } else {
        clientGalleryImages = [imgElement.src];
    }

    clientGalleryCurrentIndex = clientGalleryImages.indexOf(imgElement.src);
    if (clientGalleryCurrentIndex === -1) clientGalleryCurrentIndex = 0;

    showClientLightboxImage();
    const lightbox = document.getElementById('lightboxOverlay');
    if (lightbox) {
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function showClientLightboxImage() {
    const img = document.getElementById('lightboxImage');
    if (img && clientGalleryImages[clientGalleryCurrentIndex]) {
        img.src = clientGalleryImages[clientGalleryCurrentIndex];
    }
}

function closeClientLightbox() {
    const lightbox = document.getElementById('lightboxOverlay');
    if (lightbox) {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Lightbox event listeners
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightboxOverlay');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeClientLightbox);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clientGalleryCurrentIndex = (clientGalleryCurrentIndex - 1 + clientGalleryImages.length) % clientGalleryImages.length;
            showClientLightboxImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clientGalleryCurrentIndex = (clientGalleryCurrentIndex + 1) % clientGalleryImages.length;
            showClientLightboxImage();
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeClientLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (lightbox && !lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                closeClientLightbox();
            } else if (e.key === 'ArrowLeft') {
                clientGalleryCurrentIndex = (clientGalleryCurrentIndex - 1 + clientGalleryImages.length) % clientGalleryImages.length;
                showClientLightboxImage();
            } else if (e.key === 'ArrowRight') {
                clientGalleryCurrentIndex = (clientGalleryCurrentIndex + 1) % clientGalleryImages.length;
                showClientLightboxImage();
            }
        }
    });
});

// ============================================
// CAROUSEL + LIGHTBOX
// ============================================

function initCarousel(containerSelector = '.carousel-container') {
    const containers = document.querySelectorAll(containerSelector);
    containers.forEach(container => {
        const track = container.querySelector('.carousel-track');
        const slides = container.querySelectorAll('.carousel-slide');
        const prev = container.querySelector('.carousel-prev');
        const next = container.querySelector('.carousel-next');
        let idx = 0;

        function update() {
            if (!track) return;
            track.style.transform = `translateX(-${idx * 100}%)`;
        }

        prev && prev.addEventListener('click', () => {
            idx = (idx - 1 + slides.length) % slides.length;
            update();
        });

        next && next.addEventListener('click', () => {
            idx = (idx + 1) % slides.length;
            update();
        });

        // Click to open lightbox
        container.querySelectorAll('.open-lightbox').forEach((img, i) => {
            img.addEventListener('click', () => {
                openLightbox(i, container);
            });
        });

        // responsive: recalc on resize
        window.addEventListener('resize', update);
        update();
    });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
let lbCurrentIndex = 0;
let lbImages = [];

function openLightbox(index, container) {
    const slideImages = container.querySelectorAll('.carousel-slide img');
    if (slideImages.length > 0) {
        lbImages = Array.from(slideImages).map(s => s.getAttribute('src'));
    } else {
        const thumbButtons = container.querySelectorAll('.product-thumb');
        lbImages = Array.from(thumbButtons).map(t => t.dataset.src).filter(Boolean);
        if (lbImages.length === 0) {
            const mainImage = container.querySelector('#product-main-image');
            if (mainImage) lbImages = [mainImage.src];
        }
    }

    lbCurrentIndex = Math.min(index, lbImages.length - 1);
    showLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function showLightboxImage() {
    if (!lightboxImage) return;
    lightboxImage.src = lbImages[lbCurrentIndex];
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
    lbCurrentIndex = (lbCurrentIndex - 1 + lbImages.length) % lbImages.length;
    showLightboxImage();
});
if (lightboxNext) lightboxNext.addEventListener('click', () => {
    lbCurrentIndex = (lbCurrentIndex + 1) % lbImages.length;
    showLightboxImage();
});

// Close on overlay click
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') {
        lbCurrentIndex = (lbCurrentIndex - 1 + lbImages.length) % lbImages.length;
        showLightboxImage();
    } else if (e.key === 'ArrowRight') {
        lbCurrentIndex = (lbCurrentIndex + 1) % lbImages.length;
        showLightboxImage();
    } else if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ============================================
// LGU GRID GALLERY FUNCTIONALITY
// ============================================

function openGallery(index) {
    const gridItems = document.querySelectorAll('[onclick^="openGallery"]');
    const images = Array.from(gridItems).map(item => {
        const img = item.querySelector('img');
        return img ? img.src : '';
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');

    if (images.length === 0 || !lightbox) return;

    let currentIndex = Math.min(index, images.length - 1);
    
    // Set image and counter
    if (lightboxImage) {
        lightboxImage.src = images[currentIndex];
    }
    if (lightboxCurrent) {
        lightboxCurrent.textContent = currentIndex + 1;
    }
    if (lightboxTotal) {
        lightboxTotal.textContent = images.length;
    }

    // Show lightbox
    lightbox.classList.add('open');
    document.body.classList.add('lightbox-open');

    // Navigation functions
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxClose = document.getElementById('lightbox-close');

    function updateImage() {
        if (lightboxImage) {
            lightboxImage.src = images[currentIndex];
        }
        if (lightboxCurrent) {
            lightboxCurrent.textContent = currentIndex + 1;
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.classList.remove('lightbox-open');
        
        // Remove event listeners
        if (lightboxPrev) lightboxPrev.removeEventListener('click', goToPrev);
        if (lightboxNext) lightboxNext.removeEventListener('click', goToNext);
        if (lightboxClose) lightboxClose.removeEventListener('click', closeLightbox);
        lightbox.removeEventListener('click', handleBgClick);
        document.removeEventListener('keydown', handleKeyDown);
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            goToNext();
        } else if (e.key === 'ArrowLeft') {
            goToPrev();
        }
    }

    function handleBgClick(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    }

    // Add event listeners
    if (lightboxPrev) lightboxPrev.addEventListener('click', goToPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', goToNext);
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', handleBgClick);
    document.addEventListener('keydown', handleKeyDown);
}

// ============================================
// LGU CAROUSEL FUNCTIONALITY (LEGACY)
// ============================================

function initLGUCarousel() {
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideCount = slides.length;

    /**
     * Update carousel position and indicators
     */
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update indicator styling
        indicators.forEach((indicator, i) => {
            if (i === currentIndex) {
                indicator.classList.add('!bg-white');
                indicator.classList.remove('bg-white/60');
            } else {
                indicator.classList.remove('!bg-white');
                indicator.classList.add('bg-white/60');
            }
        });

        // Update lightbox total
        const lightboxTotal = document.getElementById('lightbox-total');
        if (lightboxTotal) {
            lightboxTotal.textContent = slideCount;
        }
    }

    /**
     * Go to next slide
     */
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }

    /**
     * Go to previous slide
     */
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
    }

    /**
     * Go to specific slide
     */
    function goToSlide(index) {
        currentIndex = Math.min(Math.max(index, 0), slideCount - 1);
        updateCarousel();
    }

    // Event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Event listeners for pagination indicators
    indicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => goToSlide(i));
    });

    // Click on slide to open lightbox
    slides.forEach((slide, i) => {
        slide.addEventListener('click', () => {
            openLGULightbox(i);
        });
    });

    // Initialize carousel display
    updateCarousel();

    // Optional: Auto-rotate carousel every 8 seconds
    let autoRotateTimer = setInterval(nextSlide, 8000);

    // Pause auto-rotate on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoRotateTimer);
    });

    // Resume auto-rotate on mouse leave
    track.addEventListener('mouseleave', () => {
        autoRotateTimer = setInterval(nextSlide, 8000);
    });

    // Pause auto-rotate if lightbox is open
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (lightbox.classList.contains('hidden')) {
                    autoRotateTimer = setInterval(nextSlide, 8000);
                } else {
                    clearInterval(autoRotateTimer);
                }
            });
        });
        observer.observe(lightbox, { attributes: true });
    }
}

/**
 * Open lightbox gallery for LGU carousel
 */
function openLGULightbox(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCurrent = document.getElementById('lightbox-current');

    if (slides.length === 0 || !lightbox) return;

    // Get all slide images
    const images = Array.from(slides).map(slide => {
        const img = slide.querySelector('img');
        return img ? img.src : '';
    });

    // Set current image
    let currentLBIndex = Math.min(index, images.length - 1);
    if (lightboxImage) {
        lightboxImage.src = images[currentLBIndex];
    }
    if (lightboxCurrent) {
        lightboxCurrent.textContent = currentLBIndex + 1;
    }

    // Show lightbox
    lightbox.classList.add('open');
    document.body.classList.add('lightbox-open');

    // Lightbox navigation
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxClose = document.getElementById('lightbox-close');

    function updateLightboxImage() {
        if (lightboxImage) {
            lightboxImage.src = images[currentLBIndex];
        }
        if (lightboxCurrent) {
            lightboxCurrent.textContent = currentLBIndex + 1;
        }
    }

    function closeLBGallery() {
        lightbox.classList.remove('open');
        document.body.classList.remove('lightbox-open');
        
        // Remove temporary listeners
        if (lightboxPrev) lightboxPrev.removeEventListener('click', goPrevImage);
        if (lightboxNext) lightboxNext.removeEventListener('click', goNextImage);
        if (lightboxClose) lightboxClose.removeEventListener('click', closeLBGallery);
        lightbox.removeEventListener('click', handleBackgroundClick);
        document.removeEventListener('keydown', handleEscapeKey);
    }

    function goNextImage() {
        currentLBIndex = (currentLBIndex + 1) % images.length;
        updateLightboxImage();
    }

    function goPrevImage() {
        currentLBIndex = (currentLBIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeLBGallery();
        }
    }

    function handleBackgroundClick(e) {
        if (e.target === lightbox) {
            closeLBGallery();
        }
    }

    // Add event listeners
    if (lightboxPrev) lightboxPrev.addEventListener('click', goPrevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', goNextImage);
    if (lightboxClose) lightboxClose.addEventListener('click', closeLBGallery);
    
    // Close on escape key
    document.addEventListener('keydown', handleEscapeKey);

    // Close on background click
    lightbox.addEventListener('click', handleBackgroundClick);
}

// ============================================
// COMING SOON PARALLAX EFFECT
// ============================================

// No JavaScript needed - CSS background-attachment: fixed handles parallax automatically

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Gallery functions are now called via onclick handlers
});
