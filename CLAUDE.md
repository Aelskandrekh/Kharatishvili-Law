# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Requirements

- Always ensure mobile responsiveness when making changes
- Maintain professional law firm aesthetic and branding
- Preserve SEO optimizations and canonical URL structure
- Test all changes across mobile, tablet, and desktop breakpoints

## Architecture Overview

This is a static law firm website with a sophisticated dark-themed header and professional content sections. The site uses a mobile-first responsive design approach.

### Core Structure
- **Static HTML pages** (index.html, about.html, services.html, team.html, resources.html, contact.html)
- **Single CSS file** (styles.css) with mobile-first responsive design
- **Enhanced JavaScript** (script.js) for animations, mobile menu, and form handling
- **SEO configuration** with canonical URLs, sitemap.xml, robots.txt

### Key Design Elements
- **Dark navigation header** with sophisticated gradients and white typography
- **Mobile hamburger menu** with slide-down animation
- **Professional typography** using 'Crimson Text' for headings and 'Inter' for body text
- **Responsive grid layouts** that stack properly on mobile devices
- **Touch-optimized buttons** with minimum 44px touch targets

## Development Commands

### Deployment
```bash
./deploy.sh  # Deploy to Vercel with automated setup
```

### Local Development
- No build process required - direct HTML/CSS/JS
- Open any HTML file directly in browser for testing
- Use browser dev tools for responsive testing

## Mobile Responsiveness Architecture

The site uses cascading breakpoints:
- **480px and below**: Ultra-small screens with heavily optimized typography
- **768px and below**: Mobile devices with hamburger navigation
- **1024px and below**: Tablet layout with 2-column grids
- **Above 1024px**: Desktop layout with full feature set

### Navigation System
- **Desktop**: Horizontal navigation with hover effects and underline animations
- **Mobile**: Hamburger menu that slides down from top with dark theme consistency
- **JavaScript handles**: Menu toggle, outside clicks, keyboard navigation, window resize

## Contact Form Integration

Uses **Formspree** service (https://formspree.io/f/xwpqgkka) for form submissions:
- Form redirects to `/contact.html?success=true` on successful submission
- JavaScript displays success message and clears URL parameters
- All form inputs include proper validation and accessibility attributes

## SEO and URL Structure

### Domain Configuration
- **Primary domain**: `kharatishvili-law.com` (without www)
- **Canonical URLs**: All pages include canonical tags pointing to non-www domain
- **Redirects**: Configured for www → non-www and /index.html → root
- **Sitemap**: Maintained at `/sitemap.xml` with current dates

### Redirect Files
- **`.htaccess`**: Apache server redirects
- **`_redirects`**: Netlify-style redirects  
- **`404.html`**: JavaScript-based redirects for GitHub Pages

## Styling Architecture

### CSS Organization
- **Reset and base styles**: Global typography and layout foundations
- **Component-specific styles**: Navigation, hero, cards, forms, footer
- **Responsive breakpoints**: Mobile-first media queries
- **Dark theme implementation**: Sophisticated gradients and white typography for header

### Key CSS Classes
- `.navigation`: Fixed dark header with blur effects
- `.hero`: Dark gradient background with elegant white text
- `.mobile-menu-toggle`: Hamburger menu button (hidden on desktop)
- `.service-card`, `.benefit-item`: Responsive card components
- `.cta-button.primary/.secondary`: Styled buttons optimized for dark theme

### Typography Scale
- **Hero title**: 4.5rem desktop → 2.2rem mobile
- **Page headers**: 3.5rem desktop → 2rem mobile  
- **Section headers**: 2.25rem desktop → 1.6rem mobile
- **All text includes shadows and proper contrast** for dark theme readability

## JavaScript Functionality

### Core Features
- **Mobile menu management**: Toggle, keyboard, and outside click handling
- **Smooth page transitions**: Fade animations between pages  
- **Enhanced interactions**: Hover effects, button animations, scroll triggers
- **Form handling**: Success message display and URL parameter management
- **Responsive behavior**: Window resize handling and mobile/desktop feature detection

### Animation System
- **CSS transitions**: Cubic bezier easing for professional feel
- **Intersection Observer**: Scroll-triggered animations for content sections
- **Touch device detection**: Disables hover effects on touch devices
- **Performance optimized**: Debounced scroll events and efficient DOM manipulation

## File Structure Notes

- **Google verification**: `google6d677229bc586536.html` for Search Console
- **LLM instructions**: `llms.txt` for AI crawling guidelines  
- **Package.json**: Minimal configuration, primarily for repository metadata
- **No build tools**: Direct file editing and deployment model

always ensure mobile responsiveness when updating the code