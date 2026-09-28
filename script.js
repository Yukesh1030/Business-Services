// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hide');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Remove data-aos from cards, images, and hero titles before AOS init to prevent conflict with GSAP
document.querySelectorAll('.service-card, .impact-card, .testimonial-card, .cta-img-container, .cta-floating-card, .hero-title, .shn-title, .ch-title, .bh-title, .ah-title').forEach(el => {
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

if (hamburger && nav) {
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
}

// Smooth row hover animation for what-we-do
document.querySelectorAll('.wwd-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
        if (typeof gsap !== 'undefined') gsap.to(row.querySelector('.wwd-arrow'), { x: 3, y: 3, duration: 0.2 });
    });
    row.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') gsap.to(row.querySelector('.wwd-arrow'), { x: 0, y: 0, duration: 0.2 });
    });
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        // Ambient floating animations for badges and cards
    gsap.to('.badge-coral', { y: -7, duration: 2.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to('.badge-cyan', { y: 6, duration: 2.7, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.3 });
    gsap.to('.badge-lime', { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.6 });
    gsap.to('.card-investments', { y: -5, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to('.card-wave', { y: 5, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.4 });

    // GSAP Text Animation for Hero Fonts
    const heroTitles = document.querySelectorAll('.hero-title, .shn-title, .ch-title, .bh-title, .ah-title');
    if (heroTitles.length > 0) {
        // Function to split text nodes into characters safely
        function splitTextNodes(node) {
            if (node.nodeType === 3) { // Text node
                const text = node.nodeValue;
                if (text.trim() !== '') {
                    const wrapper = document.createDocumentFragment();
                    for (let i = 0; i < text.length; i++) {
                        const char = text[i];
                        if (char === ' ' || char === '\n' || char === '\t') {
                            wrapper.appendChild(document.createTextNode(char));
                        } else {
                            const span = document.createElement('span');
                            span.textContent = char;
                            span.style.display = 'inline-block';
                            span.classList.add('gsap-char');
                            wrapper.appendChild(span);
                        }
                    }
                    node.parentNode.replaceChild(wrapper, node);
                }
            } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
                Array.from(node.childNodes).forEach(child => splitTextNodes(child));
            }
        }

        heroTitles.forEach(title => {
            // Apply split to each title
            Array.from(title.childNodes).forEach(child => splitTextNodes(child));
            
            // Set initial state
            gsap.set(title, { opacity: 1 });
            
            // Animate characters
            gsap.from(title.querySelectorAll('.gsap-char'), {
                opacity: 0,
                y: 30,
                rotationX: -90,
                transformOrigin: "0% 50% -50",
                stagger: 0.02,
                duration: 0.8,
                ease: "back.out(1.5)",
                delay: 0.1
            });
        });
    }

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
    
    // GSAP Counter Animations (using ScrollTrigger for multiple sections)
    gsap.registerPlugin(ScrollTrigger);
    const statsElements = document.querySelectorAll('.stat-num, .ob-stat h3, .as-val, .bi-metrics strong');
    if (statsElements.length > 0) {
        statsElements.forEach(stat => {
            const targetText = stat.innerText.trim();
            // Match prefixes (non-digits), number (with optional decimals), and suffixes
            const match = targetText.match(/^([^\d]*)(\d+(?:\.\d+)?)([^\d]*)$/);
            
            if (match) {
                const prefix = match[1] || '';
                const targetNum = parseFloat(match[2]);
                const suffix = match[3] || '';
                const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
                
                let obj = { val: 0 };
                
                gsap.to(obj, {
                    val: targetNum,
                    duration: 2.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: stat,
                        start: "top 90%",
                        once: true
                    },
                    onUpdate: function() {
                        stat.innerText = prefix + obj.val.toFixed(decimals) + suffix;
                    }
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
    }

    // Global Link and Form Redirection Logic for 404 page
    
    // 1. Redirect all links to 404.html except navbar links, dashboard links, and footer links
    document.querySelectorAll('a').forEach(link => {
        // Exclude links inside the header area, sidebar, and footer
        if (!link.closest('.header') && !link.closest('.dashboard-sidebar') && !link.closest('.footer')) {
            link.addEventListener('click', (e) => {
                // Don't redirect dashboard internal links either
                if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) return;
                e.preventDefault();
                window.location.href = '404.html';
            });
        }
    });

    // 2. Add validation to forms and redirect to 404.html
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Check HTML5 validation
            if (form.checkValidity()) {
                window.location.href = '404.html';
            } else {
                form.reportValidity();
            }
        });
    });

    // Dashboard Interactions
    // Mobile Sidebar Toggle
    const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // Dashboard Section Switching logic removed for multi-page approach
    const dashLinks = document.querySelectorAll('.sidebar-menu-list .sidebar-link');
    
    dashLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile sidebar if open
            if (window.innerWidth <= 992 && sidebar) {
                sidebar.classList.remove('show');
            }
        });
    });

    // Blog Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.b-card');

    if (filterBtns.length > 0 && blogCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterText = btn.textContent.trim();

                blogCards.forEach(card => {
                    if (filterText === 'All') {
                        card.style.display = 'block';
                    } else {
                        // Tag matching logic
                        const tagMapping = {
                            'Architecture': 'INFRASTRUCTURE',
                            'Strategy': 'STRATEGY',
                            'Data & AI': 'DATA & AI',
                            'Cloud': 'CLOUD',
                            'Operating': 'OPERATING'
                        };

                        const cardTag = card.querySelector('.b-card-tag') ? card.querySelector('.b-card-tag').textContent.trim() : '';
                        const cardTitle = card.querySelector('.b-card-title') ? card.querySelector('.b-card-title').textContent.trim() : '';
                        const cardDesc = card.querySelector('.b-card-desc') ? card.querySelector('.b-card-desc').textContent.trim() : '';
                        
                        let isMatch = false;
                        
                        if (tagMapping[filterText] && cardTag.includes(tagMapping[filterText])) {
                            isMatch = true;
                        } else if (cardTag.toLowerCase().includes(filterText.toLowerCase())) {
                            isMatch = true;
                        } else if (cardTitle.toLowerCase().includes(filterText.toLowerCase())) {
                            isMatch = true;
                        } else if (cardDesc.toLowerCase().includes(filterText.toLowerCase())) {
                            isMatch = true;
                        }

                        if (isMatch) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // FAQ Accordion Logic with GSAP
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0 && typeof gsap !== 'undefined') {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        gsap.to(otherItem.querySelector('.faq-answer'), {
                            height: 0,
                            duration: 0.4,
                            ease: 'power2.inOut'
                        });
                        gsap.to(otherItem.querySelector('.faq-icon'), {
                            rotation: 0,
                            duration: 0.3,
                            ease: 'power1.inOut'
                        });
                    }
                });

                // Toggle current item
                if (isOpen) {
                    item.classList.remove('active');
                    gsap.to(answer, {
                        height: 0,
                        duration: 0.4,
                        ease: 'power2.inOut'
                    });
                    gsap.to(icon, {
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power1.inOut'
                    });
                } else {
                    item.classList.add('active');
                    gsap.set(answer, { height: 'auto' });
                    const targetHeight = answer.offsetHeight;
                    gsap.set(answer, { height: 0 });
                    gsap.to(answer, {
                        height: targetHeight,
                        duration: 0.4,
                        ease: 'power2.inOut'
                    });
                    gsap.to(icon, {
                        rotation: 45,
                        duration: 0.3,
                        ease: 'power1.inOut'
                    });
                }
            });
        });
    }
});

// Dynamic Username Update for Dashboards
document.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('syncy_username');
    if (savedUsername) {
        const userNameElems = document.querySelectorAll('.user-name');
        const userAvatarElems = document.querySelectorAll('.user-avatar');
        
        userNameElems.forEach(elem => {
            elem.textContent = savedUsername;
        });
        
        userAvatarElems.forEach(elem => {
            const parts = savedUsername.trim().split(' ');
            let initials = '';
            if (parts.length >= 2) {
                initials = parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
            } else if (parts.length === 1 && parts[0].length >= 2) {
                initials = parts[0].substring(0, 2).toUpperCase();
            } else if (parts[0].length > 0) {
                initials = parts[0].charAt(0).toUpperCase();
            }
            elem.textContent = initials;
        });
    }
});
