// Enhanced Navigation and Page Transitions
document.addEventListener('DOMContentLoaded', function() {
    
    // Enhanced Navigation Hover Effects
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Enhanced click animation
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').endsWith('.html')) {
                e.preventDefault();
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                this.style.transition = 'transform 0.1s ease';
                
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
                
                // Page transition
                fadeOutAndNavigate(this.getAttribute('href'));
            }
        });
    });
    
    // Smooth Page Transitions
    function fadeOutAndNavigate(url) {
        const mainContent = document.querySelector('.main-content');
        
        // Fade out current content
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(-20px)';
        mainContent.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    }
    
    // Enhanced Button Hover Effects
    const buttons = document.querySelectorAll('.cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            if (this.classList.contains('primary')) {
                this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            if (this.classList.contains('primary')) {
                this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
    });
    
    // Enhanced Service Card Interactions
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Enhanced Team Member Card Interactions
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotate(0.5deg)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.12)';
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Enhanced Resource Item Interactions
    const resourceItems = document.querySelectorAll('.resource-item');
    
    resourceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Scroll-triggered Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    }, observerOptions);
    
    // Apply scroll animations to elements
    const animatedElements = document.querySelectorAll('.service-card, .benefit-item, .value-item, .team-member, .resource-category');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'none';
        
        // Stagger the animations
        setTimeout(() => {
            observer.observe(el);
        }, index * 100);
    });
    
    // Enhanced Form Interactions
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Contact Form Enhancement
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Animate button
            submitButton.textContent = 'Sending...';
            submitButton.style.transform = 'scale(0.95)';
            submitButton.style.opacity = '0.7';
            submitButton.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                submitButton.textContent = 'Message Sent!';
                submitButton.style.background = '#28a745';
                submitButton.style.transform = 'scale(1)';
                submitButton.style.opacity = '1';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }
    
    // Enhanced Logo Animation
    const logo = document.querySelector('.logo h1');
    
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Parallax Effect for Hero Section
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Mobile menu toggle (if needed)
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    
    // Add mobile responsiveness
    function handleResize() {
        if (window.innerWidth <= 768) {
            navMenu.style.flexDirection = 'column';
            navMenu.style.gap = '1rem';
        } else {
            navMenu.style.flexDirection = 'row';
            navMenu.style.gap = '2.5rem';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial load
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', function(e) {
        document.body.classList.remove('using-keyboard');
    });
    
    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    
    function debounce(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(scrollTimeout);
                func(...args);
            };
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(later, wait);
        };
    }
    
    const debouncedScroll = debounce(function() {
        // Any scroll-based animations go here
    }, 16); // ~60fps
    
    window.addEventListener('scroll', debouncedScroll);
});

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .using-keyboard *:focus {
        outline: 2px solid #1a1a1a !important;
        outline-offset: 2px !important;
    }
    
    body:not(.using-keyboard) *:focus {
        outline: none !important;
    }
`;
document.head.appendChild(style);