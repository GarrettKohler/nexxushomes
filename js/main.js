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

    // ============================================
    // PRODUCT MODAL & HARDWARE SUITES
    // ============================================
    const productData = {
        'philips-hue': {
            name: 'Philips Hue',
            products: [
                { id: 'hue-bridge-pro', name: 'Hue Bridge Pro', description: 'Control up to 150 lights, 70% faster processor', price: 89.99 },
                { id: 'hue-starter-kit', name: 'White & Color Starter Kit (3 bulbs + Bridge)', description: '3 A19 bulbs with 16 million colors', price: 109.99 },
                { id: 'hue-essential-4pack', name: 'Essential Bulbs 4-Pack', description: 'Color ambiance bulbs, budget-friendly', price: 59.99 },
                { id: 'hue-lightstrip', name: 'Lightstrip Plus (6.6ft)', description: 'Flexible LED strip for ambient lighting', price: 79.99 },
                { id: 'hue-dimmer', name: 'Dimmer Switch', description: 'Wireless wall switch, no wiring needed', price: 27.99 },
                { id: 'hue-motion-sensor', name: 'Motion Sensor', description: 'Automatic lights on motion detection', price: 39.99 },
                { id: 'hue-play-bar', name: 'Play Light Bar (2-pack)', description: 'Bias lighting for TV or monitor', price: 129.99 },
                { id: 'hue-secure-doorbell', name: 'Secure Video Doorbell', description: '2K fisheye camera, 24hr history included', price: 169.99 },
                { id: 'hue-outdoor-spot', name: 'Outdoor Lily Spot Light', description: 'Weather-resistant garden spotlights', price: 139.99 },
                { id: 'hue-secure-sub', name: 'Secure Plus (1 year)', description: '60-day cloud storage for cameras', price: 119.99 }
            ]
        },
        'google-nest': {
            name: 'Google Nest',
            products: [
                { id: 'nest-thermostat', name: 'Nest Thermostat', description: 'Energy-saving smart thermostat', price: 129.99 },
                { id: 'nest-learning', name: 'Nest Learning Thermostat (4th Gen)', description: 'Learns your schedule, maximum savings', price: 279.99 },
                { id: 'nest-doorbell', name: 'Nest Doorbell (Wired, 3rd Gen)', description: '2K HDR video with Gemini AI', price: 179.99 },
                { id: 'nest-cam-indoor', name: 'Nest Cam (Indoor, Wired)', description: '1080p HDR, 24/7 recording ready', price: 99.99 },
                { id: 'nest-cam-outdoor', name: 'Nest Cam (Outdoor, Battery)', description: 'Wire-free, weather-resistant', price: 179.99 },
                { id: 'nest-cam-2pack', name: 'Nest Cam 2-Pack (Indoor/Outdoor)', description: 'Bundle savings on cameras', price: 279.99 },
                { id: 'nest-hub', name: 'Nest Hub (2nd Gen)', description: '7" smart display with sleep sensing', price: 99.99 },
                { id: 'nest-audio', name: 'Nest Audio', description: 'Premium smart speaker', price: 99.99 },
                { id: 'nest-mini', name: 'Nest Mini (2nd Gen)', description: 'Compact smart speaker', price: 49.99 },
                { id: 'nest-temp-sensor', name: 'Temperature Sensor (2nd Gen)', description: 'Room-specific climate control', price: 39.99 },
                { id: 'nest-aware-annual', name: 'Google Home Premium (1 year)', description: '30-day video history, Gemini features', price: 100.00 }
            ]
        },
        'ring': {
            name: 'Ring',
            products: [
                { id: 'ring-doorbell-4', name: 'Ring Video Doorbell 4', description: '1080p HD, color night vision', price: 199.99 },
                { id: 'ring-doorbell-pro2', name: 'Ring Video Doorbell Pro 2', description: '1536p HD, 3D motion detection', price: 249.99 },
                { id: 'ring-indoor-cam', name: 'Indoor Cam Plus', description: 'Compact 1080p indoor camera', price: 59.99 },
                { id: 'ring-outdoor-cam', name: 'Outdoor Cam Plus (Battery)', description: 'Wire-free outdoor security', price: 99.99 },
                { id: 'ring-floodlight-pro', name: 'Floodlight Cam Pro 4K', description: '4K video with bird\'s eye view', price: 279.99 },
                { id: 'ring-alarm-5', name: 'Alarm Security Kit (5-piece)', description: 'Base station, keypad, sensors', price: 199.99 },
                { id: 'ring-alarm-8', name: 'Alarm Security Kit (8-piece)', description: 'Extended coverage package', price: 249.99 },
                { id: 'ring-alarm-pro', name: 'Alarm Pro Security Kit', description: 'Built-in Wi-Fi router, local storage', price: 349.99 },
                { id: 'ring-contact-sensor', name: 'Contact Sensor (2-pack)', description: 'Door/window monitoring', price: 39.99 },
                { id: 'ring-motion-sensor', name: 'Motion Detector', description: 'PIR motion detection for alarm', price: 29.99 },
                { id: 'ring-protect-plus', name: 'Ring Protect Plus (1 year)', description: '180-day history, all devices', price: 100.00 }
            ]
        },
        'blink': {
            name: 'Blink',
            products: [
                { id: 'blink-mini-2', name: 'Blink Mini 2', description: 'Indoor plug-in camera', price: 39.99 },
                { id: 'blink-mini-3pack', name: 'Blink Mini 2 (3-pack)', description: 'Bundle savings on indoor cams', price: 69.99 },
                { id: 'blink-outdoor-4', name: 'Blink Outdoor 4', description: '2-year battery, wire-free', price: 99.99 },
                { id: 'blink-outdoor-3cam', name: 'Blink Outdoor 4 (3-camera)', description: 'Multi-camera bundle with sync module', price: 189.99 },
                { id: 'blink-outdoor-5cam', name: 'Blink Outdoor 4 (5-camera)', description: 'Complete home coverage', price: 299.99 },
                { id: 'blink-doorbell', name: 'Blink Video Doorbell', description: 'Wire-free doorbell, 2-year battery', price: 49.99 },
                { id: 'blink-floodlight', name: 'Blink Wired Floodlight Camera', description: '2600 lumens LED floodlight + camera', price: 99.99 },
                { id: 'blink-sync-module', name: 'Sync Module 2', description: 'Hub for Blink cameras with local storage', price: 34.99 },
                { id: 'blink-solar-panel', name: 'Solar Panel Mount', description: 'Keep outdoor cameras charged', price: 29.99 },
                { id: 'blink-sub-plus', name: 'Blink Subscription Plus (1 year)', description: 'Cloud storage, all devices', price: 100.00 }
            ]
        },
        'smartthings': {
            name: 'Samsung SmartThings',
            products: [
                { id: 'st-hub-2', name: 'Aeotec Smart Home Hub 2', description: 'Matter-certified, Zigbee + Thread', price: 119.99 },
                { id: 'st-station', name: 'SmartThings Station', description: 'Hub + wireless charger combo', price: 59.99 },
                { id: 'st-button', name: 'SmartThings Button', description: 'Trigger automations with one press', price: 19.99 },
                { id: 'st-motion', name: 'SmartThings Motion Sensor', description: 'Detect motion and temperature', price: 24.99 },
                { id: 'st-multipurpose', name: 'Multipurpose Sensor', description: 'Door/window, vibration, temperature', price: 24.99 },
                { id: 'st-water-leak', name: 'Water Leak Sensor', description: 'Flood detection alerts', price: 19.99 },
                { id: 'st-outlet', name: 'Smart Outlet', description: 'Turn any outlet into smart outlet', price: 24.99 },
                { id: 'st-cam-indoor', name: 'SmartThings Indoor Cam', description: '1080p with person detection', price: 89.99 },
                { id: 'st-cam-outdoor', name: 'SmartThings Outdoor Cam', description: 'Weather-resistant security', price: 89.99 },
                { id: 'st-tracker', name: 'SmartThings Tracker', description: 'GPS tracking for pets, kids, items', price: 99.99 }
            ]
        }
    };

    // Modal DOM elements
    const productModal = document.getElementById('product-modal');
    const productList = document.getElementById('product-list');
    const modalTotal = document.getElementById('modal-total');
    const modalClose = document.querySelector('.product-modal__close');
    const modalOverlay = document.querySelector('.product-modal__overlay');
    const modalClear = document.getElementById('modal-clear');
    const modalQuote = document.getElementById('modal-quote');
    const modalTitle = document.querySelector('.product-modal__title');

    let selectedProducts = [];
    let currentSuite = null;

    // Open modal with products
    function openProductModal(suiteId) {
        const suite = productData[suiteId];
        if (!suite) return;

        currentSuite = suiteId;
        selectedProducts = [];

        // Update modal title
        modalTitle.textContent = suite.name + ' Products';

        // Render products
        renderProducts(suite.products);
        updateTotal();

        // Show modal
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeProductModal() {
        productModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Render products in modal
    function renderProducts(products) {
        productList.innerHTML = products.map(product => `
            <div class="product-item" data-id="${product.id}" data-price="${product.price}">
                <div class="product-item__checkbox">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
                <div class="product-item__info">
                    <div class="product-item__name">${product.name}</div>
                    <div class="product-item__description">${product.description}</div>
                </div>
                <div class="product-item__price">$${product.price.toFixed(2)}</div>
            </div>
        `).join('');

        // Add click handlers
        productList.querySelectorAll('.product-item').forEach(item => {
            item.addEventListener('click', () => {
                toggleProduct(item);
            });
        });
    }

    // Toggle product selection
    function toggleProduct(item) {
        const productId = item.dataset.id;
        const price = parseFloat(item.dataset.price);

        if (item.classList.contains('selected')) {
            item.classList.remove('selected');
            selectedProducts = selectedProducts.filter(p => p.id !== productId);
        } else {
            item.classList.add('selected');
            selectedProducts.push({ id: productId, price });
        }

        updateTotal();
    }

    // Update total price
    function updateTotal() {
        const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);
        modalTotal.textContent = '$' + total.toFixed(2);
    }

    // Clear selection
    function clearSelection() {
        selectedProducts = [];
        productList.querySelectorAll('.product-item').forEach(item => {
            item.classList.remove('selected');
        });
        updateTotal();
    }

    // Event listeners for hardware suite buttons
    document.querySelectorAll('.hardware-suite__btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const suiteId = this.dataset.suite;
            openProductModal(suiteId);
        });
    });

    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeProductModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeProductModal);
    }

    if (modalClear) {
        modalClear.addEventListener('click', clearSelection);
    }

    // Close modal on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && productModal.classList.contains('active')) {
            closeProductModal();
        }
    });

    // Quote button - close modal and scroll to contact
    if (modalQuote) {
        modalQuote.addEventListener('click', function(e) {
            if (selectedProducts.length > 0) {
                // Store selection in session for contact form
                const selectedInfo = selectedProducts.map(p => {
                    const suite = productData[currentSuite];
                    const product = suite.products.find(prod => prod.id === p.id);
                    return product ? product.name : p.id;
                }).join(', ');

                // Pre-fill message if contact form exists
                const messageField = document.getElementById('message');
                if (messageField && messageField.value === '') {
                    const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);
                    messageField.value = `Interested in ${productData[currentSuite].name} products:\n\n${selectedInfo}\n\nEstimated hardware: $${total.toFixed(2)}\n\nPlease provide a quote including installation.`;
                }
            }
            closeProductModal();
        });
    }

    // Add scroll animation to management options
    const managementOptions = document.querySelectorAll('.management-option');
    managementOptions.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // ============================================
    // HARDWARE CAROUSEL
    // ============================================
    const carousel = document.getElementById('hardware-carousel');
    const carouselTrack = carousel ? carousel.querySelector('.carousel__track') : null;
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const carouselDotsContainer = document.getElementById('carousel-dots');
    const carouselSlides = carousel ? carousel.querySelectorAll('.hardware-suite') : [];

    let currentSlide = 0;
    let slidesPerView = 3;
    let totalSlides = carouselSlides.length;

    function updateSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 768) {
            slidesPerView = 1;
        } else if (width <= 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
    }

    function getMaxSlide() {
        return Math.max(0, totalSlides - slidesPerView);
    }

    function updateCarousel() {
        if (!carouselTrack) return;

        const slideWidth = carouselSlides[0].offsetWidth;
        const gap = 24; // var(--space-xl) = 1.5rem = 24px
        const offset = currentSlide * (slideWidth + gap);
        carouselTrack.style.transform = `translateX(-${offset}px)`;

        // Update button states
        if (carouselPrev) {
            carouselPrev.disabled = currentSlide === 0;
        }
        if (carouselNext) {
            carouselNext.disabled = currentSlide >= getMaxSlide();
        }

        // Update dots
        updateDots();
    }

    function createDots() {
        if (!carouselDotsContainer) return;

        carouselDotsContainer.innerHTML = '';
        const numDots = getMaxSlide() + 1;

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel__dot ${i === currentSlide ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateCarousel();
            });
            carouselDotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!carouselDotsContainer) return;

        const dots = carouselDotsContainer.querySelectorAll('.carousel__dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        if (currentSlide < getMaxSlide()) {
            currentSlide++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }

    // Initialize carousel
    if (carousel && carouselSlides.length > 0) {
        updateSlidesPerView();
        createDots();
        updateCarousel();

        // Event listeners
        if (carouselNext) {
            carouselNext.addEventListener('click', nextSlide);
        }
        if (carouselPrev) {
            carouselPrev.addEventListener('click', prevSlide);
        }

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateSlidesPerView();
                currentSlide = Math.min(currentSlide, getMaxSlide());
                createDots();
                updateCarousel();
            }, 150);
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (diff > swipeThreshold) {
                nextSlide();
            } else if (diff < -swipeThreshold) {
                prevSlide();
            }
        }
    }

})();
