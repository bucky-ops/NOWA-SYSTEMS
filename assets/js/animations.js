// NOWA Advanced Animations and Micro-interactions
class NOWAAnimations {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
        this.setupMicroInteractions();
        this.setupParallaxEffects();
        this.setupMorphingAnimations();
        this.setupParticleSystem();
    }
    
    setupScrollAnimations() {
        // Advanced scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all elements with animation classes
        document.querySelectorAll('[data-animate]').forEach(el => {
            scrollObserver.observe(el);
        });
    }
    
    animateElement(element) {
        const animationType = element.dataset.animate;
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in');
            
            switch (animationType) {
                case 'fade-up':
                    this.fadeUpAnimation(element);
                    break;
                case 'fade-left':
                    this.fadeLeftAnimation(element);
                    break;
                case 'fade-right':
                    this.fadeRightAnimation(element);
                    break;
                case 'scale-in':
                    this.scaleInAnimation(element);
                    break;
                case 'slide-up':
                    this.slideUpAnimation(element);
                    break;
                case 'rotate-in':
                    this.rotateInAnimation(element);
                    break;
                case 'bounce-in':
                    this.bounceInAnimation(element);
                    break;
                case 'flip-in':
                    this.flipInAnimation(element);
                    break;
            }
        }, delay);
    }
    
    fadeUpAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    fadeLeftAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    fadeRightAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    scaleInAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    slideUpAnimation(element) {
        element.style.transform = 'translateY(100%)';
        element.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateY(0)';
        });
    }
    
    rotateInAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-180deg) scale(0.5)';
        element.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        });
    }
    
    bounceInAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.3)';
        element.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    flipInAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotateY(-90deg)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotateY(0deg)';
        });
    }
    
    setupHoverEffects() {
        // Enhanced hover effects for cards
        document.querySelectorAll('.card-enhanced').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.cardHoverIn(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.cardHoverOut(card);
            });
        });
        
        // Button hover effects
        document.querySelectorAll('button, .btn-primary').forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.buttonHoverIn(button);
            });
            
            button.addEventListener('mouseleave', () => {
                this.buttonHoverOut(button);
            });
        });
    }
    
    cardHoverIn(card) {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    cardHoverOut(card) {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    buttonHoverIn(button) {
        button.style.transform = 'translateY(-2px) scale(1.05)';
        button.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
        button.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    buttonHoverOut(button) {
        button.style.transform = 'translateY(0) scale(1)';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    setupLoadingAnimations() {
        // Skeleton loading animation
        this.createSkeletonLoader();
        
        // Progress bar animation
        this.createProgressBar();
        
        // Spinner animation
        this.createSpinner();
    }
    
    createSkeletonLoader() {
        const skeletonHTML = `
            <div class="skeleton-loader">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-button"></div>
            </div>
        `;
        
        // Add skeleton styles
        const style = document.createElement('style');
        style.textContent = `
            .skeleton-loader {
                animation: skeleton-loading 1.5s ease-in-out infinite;
            }
            
            .skeleton-line {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton-shimmer 1.5s infinite;
                border-radius: 4px;
                margin-bottom: 10px;
            }
            
            .skeleton-title {
                height: 24px;
                width: 60%;
            }
            
            .skeleton-text {
                height: 16px;
                width: 100%;
            }
            
            .skeleton-button {
                height: 40px;
                width: 120px;
                border-radius: 20px;
            }
            
            @keyframes skeleton-shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-fill"></div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .progress-bar {
                width: 100%;
                height: 4px;
                background: #e5e7eb;
                border-radius: 2px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #059669);
                border-radius: 2px;
                animation: progress-fill 2s ease-in-out infinite;
            }
            
            @keyframes progress-fill {
                0% { width: 0%; }
                50% { width: 70%; }
                100% { width: 100%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    createSpinner() {
        const spinnerHTML = `
            <div class="spinner-container">
                <div class="spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .spinner-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100px;
            }
            
            .spinner {
                position: relative;
                width: 40px;
                height: 40px;
            }
            
            .spinner-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 3px solid transparent;
                border-top: 3px solid #10b981;
                border-radius: 50%;
                animation: spinner-rotate 1.2s linear infinite;
            }
            
            .spinner-ring:nth-child(2) {
                animation-delay: -0.4s;
                border-top-color: #059669;
            }
            
            .spinner-ring:nth-child(3) {
                animation-delay: -0.8s;
                border-top-color: #047857;
            }
            
            @keyframes spinner-rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupMicroInteractions() {
        // Ripple effect for buttons
        this.setupRippleEffect();
        
        // Magnetic hover effect
        this.setupMagneticEffect();
        
        // Typing animation
        this.setupTypingAnimation();
    }
    
    setupRippleEffect() {
        document.querySelectorAll('button, .btn-primary').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupMagneticEffect() {
        document.querySelectorAll('.magnetic').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.magneticMove(e, element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.magneticReset(element);
            });
        });
    }
    
    magneticMove(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        element.style.transition = 'transform 0.1s ease-out';
    }
    
    magneticReset(element) {
        element.style.transform = 'translate(0, 0)';
    }
    
    setupTypingAnimation() {
        document.querySelectorAll('.typing-animation').forEach(element => {
            this.typeText(element, element.textContent, 50);
        });
    }
    
    typeText(element, text, speed) {
        element.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, speed);
    }
    
    setupParallaxEffects() {
        // Parallax scrolling for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    setupMorphingAnimations() {
        // Morphing between different states
        document.querySelectorAll('.morph').forEach(element => {
            element.addEventListener('click', () => {
                this.morphElement(element);
            });
        });
    }
    
    morphElement(element) {
        element.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.transform = 'scale(1.1) rotate(5deg)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1) rotate(0deg)';
        }, 250);
    }
    
    setupParticleSystem() {
        // Create particle system for hero section
        this.createParticleSystem();
    }
    
    createParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.appendChild(canvas);
            this.animateParticles(canvas);
        }
    }
    
    animateParticles(canvas) {
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;
        
        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around screen
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // Public animation methods
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    staggerAnimation(elements, animationType = 'fade-up', delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animateElement(element);
            }, index * delay);
        });
    }
    
    // Add ripple effect styles
    addRippleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize animations
const nowaAnimations = new NOWAAnimations();

// Add ripple styles
nowaAnimations.addRippleStyles();

// Make animations available globally
window.NOWAAnimations = nowaAnimations;

// Add back to top button and smooth scroll
class NOWAUXEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addSmoothScroll();
        this.addBackToTopButton();
    }

    addSmoothScroll() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    addBackToTopButton() {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.innerHTML = '<i data-lucide="arrow-up" class="w-5 h-5"></i>';
        button.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(button);

        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        });

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize UX enhancements
const uxEnhancements = new NOWAUXEnhancements();

// Export for use in other modules
export default nowaAnimations;
