// ===== Navigation Scroll Effect =====
const nav = document.querySelector('.nav');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FAQ Accordion =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== Form Handling =====
const waitlistForm = document.getElementById('waitlist-form');

if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const telegram = formData.get('telegram');
        const name = formData.get('name');
        
        // Validate telegram
        if (!telegram || telegram.trim().length < 3) {
            alert('Пожалуйста, укажи Telegram для связи');
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправляю...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.reset();
                document.getElementById('form-success').style.display = 'block';
                submitBtn.textContent = 'Отправлено ✓';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    document.getElementById('form-success').style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            alert('Не удалось отправить. Напиши напрямую в Telegram: @Kolunpoleno');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== Intersection Observer for animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.problem-card, .benefit-card, .step, .for-whom-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== Counter Animation =====
function animateCounter(element, target, duration = 2000) {
    // Skip if target contains non-numeric characters like "2-3"
    if (isNaN(target) || target === 0) {
        return;
    }
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent.trim();
                // Only animate pure numbers, skip text like "+20%", "3 часа", "−23%"
                if (/^\d+$/.test(text)) {
                    const target = parseInt(text);
                    if (!isNaN(target) && target > 0) {
                        animateCounter(stat, target);
                    }
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => {
    statsObserver.observe(el);
});

// ===== Gallery Lightbox (simple) =====
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        const bgImage = item.style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            // In production, this would open a lightbox
            // For now, just a visual feedback
            item.style.transform = 'scale(0.98)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        }
    });
});

// ===== Parallax Effect for Hero =====
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== Spots Counter Animation =====
const spotsElement = document.querySelector('.cta-spots strong');
if (spotsElement) {
    const originalText = spotsElement.textContent;
    
    // Simulate urgency by occasionally updating (in production, this would be real-time)
    setInterval(() => {
        spotsElement.style.transform = 'scale(1.1)';
        spotsElement.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            spotsElement.style.transform = 'scale(1)';
        }, 300);
    }, 30000);
}

// ===== Console Easter Egg =====
console.log('%c🪓 КОЛУН', 'font-size: 24px; font-weight: bold; color: #8B4513;');
console.log('%cМужской ретрит по колке дров | Нижний Новгород', 'font-size: 14px; color: #666;');
console.log('%cРазбей рутину.', 'font-size: 12px; color: #999;');
