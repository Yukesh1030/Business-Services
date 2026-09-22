// Remove data-aos from cards and images before AOS init to prevent conflict with GSAP
document.querySelectorAll('.service-card, .impact-card, .testimonial-card, .cta-img-container, .cta-floating-card').forEach(el => {
    el.removeAttribute('data-aos');
    el.removeAttribute('data-aos-delay');
});

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const icon = hamburger.querySelector('i');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    if(nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Smooth row hover animation for what-we-do
document.querySelectorAll('.wwd-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
        gsap.to(row.querySelector('.wwd-arrow'), { x: 3, y: 3, duration: 0.2 });
    });
    row.addEventListener('mouseleave', () => {
        gsap.to(row.querySelector('.wwd-arrow'), { x: 0, y: 0, duration: 0.2 });
    });
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Ambient floating animations for badges and cards
    gsap.to('.badge-coral', { y: -7, duration: 2.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to('.badge-cyan', { y: 6, duration: 2.7, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.3 });
    gsap.to('.badge-lime', { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.6 });
    gsap.to('.card-investments', { y: -5, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to('.card-wave', { y: 5, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.4 });

    // Parallax effect for hero floating elements on mouse move
    document.addEventListener("mousemove", (e) => {
        document.querySelectorAll('.gs-anim').forEach(elem => {
            const speed = elem.getAttribute('data-speed') || 1;
            const x = (window.innerWidth / 2 - e.pageX) * speed / 40;
            const y = (window.innerHeight / 2 - e.pageY) * speed / 40;

            gsap.to(elem, {
                x: x,
                y: y,
                duration: 1.2,
                ease: "power1.out"
            });
        });
    });
    
    // Animate stats on scroll if stats-section exists
    const statsSection = document.querySelector('.stats-section');
    let animated = false;

    if (statsSection) {
        window.addEventListener('scroll', () => {
            if(animated) return;
            
            const rect = statsSection.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                animated = true;
                
                const stats = document.querySelectorAll('.stat-num');
                stats.forEach(stat => {
                    const targetText = stat.innerText;
                    const isPercentage = targetText.includes('%');
                    const isPlus = targetText.includes('+');
                    const target = parseInt(targetText.replace(/\D/g, ''));
                    
                    let obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: function() {
                            let finalStr = Math.floor(obj.val);
                            if(isPlus) finalStr += '+';
                            if(isPercentage) finalStr += '%';
                            stat.innerText = finalStr;
                        }
                    });
                });
            }
        });
    }

    // GSAP Slow Right/Left Flip Open Animation for Images and Cards
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.batch(".service-card, .impact-card, .testimonial-card, .cta-img-container, .cta-floating-card", {
        interval: 0.1, 
        batchMax: 3,
        onEnter: batch => {
            // Disable CSS transitions during GSAP animation to prevent glitches
            gsap.set(batch, { transition: "none" });
            
            gsap.from(batch, {
                opacity: 0, 
                rotationY: 90, 
                scale: 0.95,
                transformPerspective: 4000,
                transformOrigin: "center center", 
                stagger: 0.1, 
                duration: 0.8, 
                ease: "power2.out",
                clearProps: "all"
            });
        },
        start: "top 85%",
        once: true
    });
});
