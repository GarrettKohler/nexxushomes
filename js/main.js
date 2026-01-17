/**
 * Nexxus Homes - Main JavaScript
 * Premium Smart Home Solutions for Metro Detroit
 */

(function() {
    'use strict';

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    function openMenu() {
        navMenu.classList.add('show-menu');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('show-menu');
        document.body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', openMenu);
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show-menu') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
            closeMenu();
        }
    });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    let lastScroll = 0;
    const scrollThreshold = 100;

    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ============================================
    // ACTIVE NAVIGATION LINK
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink, { passive: true });

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // CONTACT FORM HANDLING
    // ============================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            if (!data.name || !data.email || !data.type) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission (replace with actual endpoint)
            simulateFormSubmission(data);
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function simulateFormSubmission(data) {
        // Add loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading">Sending...</span>';
        submitBtn.disabled = true;

        // Email recipients configuration
        // To enable email sending, set up Formspree (https://formspree.io) or similar service
        // Recipients: garrett@nexxushome.com, contact@nexxushome.com, garrettkohler1@gmail.com
        const formspreeEndpoint = 'https://formspree.io/f/your-form-id'; // Replace with actual Formspree ID

        // Add recipient info to form data
        data._recipients = 'garrett@nexxushome.com, contact@nexxushome.com, garrettkohler1@gmail.com';
        data._subject = 'New Nexxus Homes Inquiry from ' + data.name;

        // For production, replace the setTimeout with actual fetch:
        // fetch(formspreeEndpoint, {
        //     method: 'POST',
        //     body: JSON.stringify(data),
        //     headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        // }).then(response => { ... })

        // Simulate API call (replace with actual fetch for production)
        setTimeout(() => {
            // Show success state
            contactForm.style.display = 'none';
            formSuccess.classList.add('show');

            // Log form data (for demo purposes)
            console.log('Form submitted:', data);
            console.log('Would send to: garrett@nexxushome.com, contact@nexxushome.com, garrettkohler1@gmail.com');

            // Reset form
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Optional: Reset after 5 seconds
            setTimeout(() => {
                formSuccess.classList.remove('show');
                contactForm.style.display = 'block';
            }, 5000);
        }, 1500);
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification__close" aria-label="Close notification">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'error' ? '#dc2626' : '#059669'};
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 16px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        `;

        // Add close button styles
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Add keyframe animation
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Close button handler
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    const animatedElements = document.querySelectorAll('.package, .partner-card, .about__feature, .testimonial');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Set initial states and observe
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // ============================================
    // PHONE NUMBER FORMATTING
    // ============================================
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }

            e.target.value = value;
        });
    }

    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================
    const stats = document.querySelectorAll('.stat__number');

    function animateValue(element, start, end, duration, isYear = false) {
        const isPercentage = element.textContent.includes('%');

        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);

            if (isPercentage) {
                element.textContent = current + '%';
            } else if (isYear) {
                element.textContent = current;
            } else if (element.textContent.includes('/')) {
                element.textContent = '24/7';
            } else {
                element.textContent = current + '+';
            }

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;

                if (text.includes('2013')) {
                    animateValue(element, 2000, 2013, 2000, true);
                } else if (text.includes('99')) {
                    animateValue(element, 0, 99, 2000);
                }

                statsObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ============================================
    // KEYBOARD ACCESSIBILITY
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Tab trap for mobile menu
        if (navMenu.classList.contains('show-menu')) {
            const focusableElements = navMenu.querySelectorAll(
                'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }
    });

    // ============================================
    // PRELOAD CRITICAL RESOURCES
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        // Mark page as loaded
        document.body.classList.add('loaded');

        // Initialize header state
        handleHeaderScroll();
        highlightActiveLink();
    });

    // ============================================
    // PACKAGE HOVER EFFECTS
    // ============================================
    const packages = document.querySelectorAll('.package');

    packages.forEach(pkg => {
        pkg.addEventListener('mouseenter', function() {
            // Add subtle glow effect with blue theme
            this.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.15)';
        });

        pkg.addEventListener('mouseleave', function() {
            if (!this.classList.contains('package--featured')) {
                this.style.boxShadow = '';
            }
        });
    });

    // ============================================
    // LAZY LOADING IMAGES (Future Enhancement)
    // ============================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

})();
