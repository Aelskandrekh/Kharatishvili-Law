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
    
    // Check if page loaded with success parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.innerHTML = `
            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 1rem; border-radius: 4px; margin: 1rem 0; text-align: center;">
                <h4>✅ Message Sent Successfully!</h4>
                <p>Thank you for your consultation request. Aleksandre Kharatishvili will respond to you within 24 hours.</p>
            </div>
        `;
        
        const formContainer = document.querySelector('.contact-form-container');
        if (formContainer) {
            formContainer.insertBefore(successMessage, contactForm);
        }
        
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Animate button during submission
            submitButton.textContent = 'Sending...';
            submitButton.style.transform = 'scale(0.95)';
            submitButton.style.opacity = '0.7';
            submitButton.disabled = true;
            
            // The form will be submitted to Formspree
            // Formspree will handle the redirect back with success parameter
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
    
    // Navigation dropdown functionality
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    
    navDropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.nav-dropdown-menu');
        
        // Desktop hover functionality
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.classList.add('active');
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.classList.remove('active');
            }
        });
        
        // Mobile click functionality
        const serviceLink = dropdown.querySelector('.nav-item');
        serviceLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileMenuToggle && navMenu) {
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navContainer.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Handle window resize
        function handleResize() {
            if (window.innerWidth > 768) {
                // Reset mobile menu state on larger screens
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        window.addEventListener('resize', handleResize);
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', function(e) {
        document.body.classList.remove('using-keyboard');
    });
    
    // Language Switcher Enhancement - DISABLED
    /*
    const languageSwitcher = document.querySelector('.language-switcher');
    
    if (languageSwitcher) {
        const langLinks = languageSwitcher.querySelectorAll('.lang-link');
        
        langLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
                this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            link.addEventListener('click', function(e) {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
                
                // Optional: Store language preference in localStorage
                const isGeorgian = this.getAttribute('href').includes('-ka.html');
                localStorage.setItem('preferredLanguage', isGeorgian ? 'ka' : 'en');
            });
        });
    }
    
    // Auto-redirect based on stored language preference (optional)
    function checkLanguagePreference() {
        const preferredLang = localStorage.getItem('preferredLanguage');
        const currentPath = window.location.pathname;
        
        // Only redirect on the home page to avoid confusion
        if (preferredLang && (currentPath === '/' || currentPath === '/index.html')) {
            if (preferredLang === 'ka' && !currentPath.includes('-ka')) {
                window.location.href = 'index-ka.html';
            }
        }
    }
    */
    
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
    
    // Load Dynamic News Articles
    loadNewsArticles();
    
    // Listen for updates from admin console
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'articlesUpdated') {
            loadNewsArticles();
        }
    });

    function getPracticeAreaInfo(practiceArea) {
        const practiceAreas = {
            'immigration': {
                label: 'Immigration',
                color: '#3498db',
                bgColor: 'rgba(52, 152, 219, 0.1)'
            },
            'corporate': {
                label: 'Corporate & Commercial',
                color: '#27ae60',
                bgColor: 'rgba(39, 174, 96, 0.1)'
            },
            'real-estate': {
                label: 'Real Estate',
                color: '#f1c40f',
                bgColor: 'rgba(241, 196, 15, 0.1)'
            },
            'litigation': {
                label: 'Litigation & Arbitration',
                color: '#e74c3c',
                bgColor: 'rgba(231, 76, 60, 0.1)'
            },
            'tax-regulatory': {
                label: 'Tax & Regulatory',
                color: '#7f8c8d',
                bgColor: 'rgba(127, 140, 141, 0.1)'
            },
            'intellectual-property': {
                label: 'Intellectual Property',
                color: '#9b59b6',
                bgColor: 'rgba(155, 89, 182, 0.1)'
            }
        };
        
        return practiceAreas[practiceArea] || {
            label: 'General',
            color: '#7f8c8d',
            bgColor: 'rgba(127, 140, 141, 0.1)'
        };
    }
    
    function loadNewsArticles() {
        const newsGrid = document.querySelector('.news-grid');
        if (!newsGrid) return;
        
        const publishedArticles = JSON.parse(localStorage.getItem('publishedArticles') || '[]');
        
        if (publishedArticles.length === 0) {
            // Use default articles if no published articles exist
            return;
        }
        
        // Clear existing articles
        newsGrid.innerHTML = '';
        
        // Show latest 3 articles
        const articlesToShow = publishedArticles.slice(0, 3);
        
        articlesToShow.forEach(article => {
            const articleDate = formatDateForDisplay(article.date);
            const practiceInfo = getPracticeAreaInfo(article.practiceArea);
            const articleElement = document.createElement('article');
            articleElement.className = 'news-item';
            articleElement.innerHTML = `
                <div class="news-date">
                    <span class="date-day">${articleDate.day}</span>
                    <span class="date-month">${articleDate.month}</span>
                    <span class="date-year">${articleDate.year}</span>
                </div>
                <div class="news-content">
                    <div class="news-header">
                        <h3>${article.title}</h3>
                        ${article.practiceArea ? `<span class="practice-badge-news" style="background-color: ${practiceInfo.bgColor}; color: ${practiceInfo.color}; border: 1px solid ${practiceInfo.color};">${practiceInfo.label}</span>` : ''}
                    </div>
                    <p>${article.summary}</p>
                    <a href="article.html?id=${article.id}" class="news-link">Read More →</a>
                </div>
            `;
            
            // Make entire card clickable
            articleElement.addEventListener('click', function(e) {
                // Don't trigger if clicking the "Read More" link directly
                if (e.target.classList.contains('news-link')) {
                    return;
                }
                window.location.href = `article.html?id=${article.id}`;
            });
            
            newsGrid.appendChild(articleElement);
        });
    }
    
    function formatDateForDisplay(dateString) {
        const date = new Date(dateString);
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            year: date.getFullYear().toString()
        };
    }
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