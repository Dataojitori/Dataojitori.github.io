/**
 * Misaligned Codex - Main JavaScript
 * Interactive features for the blog
 */

// ===================================
// Matrix Rain Background Effect
// ===================================
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-rain');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.initDrops();

        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / 20);
    }

    initDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }

    draw() {
        // Semi-transparent black to create fade effect
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Matrix characters
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.font = '15px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            // Random characters: numbers, letters, and symbols
            const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            const text = chars[Math.floor(Math.random() * chars.length)];

            const x = i * 20;
            const y = this.drops[i] * 20;

            this.ctx.fillText(text, x, y);

            // Reset drop to top randomly
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// Navigation Menu Toggle
// ===================================
class Navigation {
    constructor() {
        this.toggle = document.querySelector('.nav-toggle');
        this.menu = document.querySelector('.nav-menu');

        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMenu();
            }
        });

        // Close menu on link click (mobile)
        this.menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
    }
}

// ===================================
// Smooth Scroll
// ===================================
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===================================
// Reading Progress Bar
// ===================================
class ReadingProgress {
    constructor() {
        if (!document.querySelector('.post')) return;

        this.createProgressBar();
        this.updateProgress();

        window.addEventListener('scroll', () => this.updateProgress());
        window.addEventListener('resize', () => this.updateProgress());
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-bar"></div>';

        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            .reading-progress {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                z-index: 9999;
            }
            .reading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #00f0ff, #ff00aa);
                width: 0%;
                transition: width 0.2s ease;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(progressBar);
        this.bar = progressBar.querySelector('.reading-progress-bar');
    }

    updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;

        this.bar.style.width = `${Math.min(progress, 100)}%`;
    }
}

// ===================================
// Code Block Copy Button
// ===================================
class CodeCopy {
    constructor() {
        this.addCopyButtons();
    }

    addCopyButtons() {
        document.querySelectorAll('pre code').forEach((codeBlock) => {
            const pre = codeBlock.parentElement;
            if (pre.querySelector('.copy-button')) return; // Already added

            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = 'Copy';
            button.setAttribute('aria-label', 'Copy code to clipboard');

            button.addEventListener('click', () => this.copyCode(codeBlock, button));

            // Style the button
            const style = document.createElement('style');
            if (!document.getElementById('copy-button-style')) {
                style.id = 'copy-button-style';
                style.textContent = `
                    pre {
                        position: relative;
                    }
                    .copy-button {
                        position: absolute;
                        top: 0.5rem;
                        right: 0.5rem;
                        padding: 0.25rem 0.75rem;
                        background: rgba(0, 240, 255, 0.2);
                        border: 1px solid rgba(0, 240, 255, 0.5);
                        color: #00f0ff;
                        border-radius: 4px;
                        font-family: 'IBM Plex Mono', monospace;
                        font-size: 0.75rem;
                        cursor: pointer;
                        transition: all 0.3s;
                    }
                    .copy-button:hover {
                        background: rgba(0, 240, 255, 0.3);
                        box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
                    }
                    .copy-button.copied {
                        background: rgba(0, 255, 136, 0.2);
                        border-color: #00ff88;
                        color: #00ff88;
                    }
                `;
                document.head.appendChild(style);
            }

            pre.style.position = 'relative';
            pre.appendChild(button);
        });
    }

    async copyCode(codeBlock, button) {
        const code = codeBlock.textContent;

        try {
            await navigator.clipboard.writeText(code);
            button.textContent = 'Copied!';
            button.classList.add('copied');

            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            button.textContent = 'Failed';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        }
    }
}

// ===================================
// Image Lazy Loading
// ===================================
class LazyLoad {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        if (this.images.length === 0) return;

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                }
            });
        });

        this.images.forEach(img => this.observer.observe(img));
    }

    loadImage(img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        this.observer.unobserve(img);
    }
}

// ===================================
// Scroll to Top Button
// ===================================
class ScrollToTop {
    constructor() {
        this.createButton();
        this.toggleVisibility();

        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    createButton() {
        this.button = document.createElement('button');
        this.button.className = 'scroll-to-top';
        this.button.innerHTML = '↑';
        this.button.setAttribute('aria-label', 'Scroll to top');

        const style = document.createElement('style');
        if (!document.getElementById('scroll-to-top-style')) {
            style.id = 'scroll-to-top-style';
            style.textContent = `
                .scroll-to-top {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 50px;
                    height: 50px;
                    background: rgba(0, 240, 255, 0.2);
                    border: 2px solid #00f0ff;
                    color: #00f0ff;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s;
                    z-index: 1000;
                }
                .scroll-to-top.visible {
                    opacity: 1;
                    visibility: visible;
                }
                .scroll-to-top:hover {
                    background: rgba(0, 240, 255, 0.3);
                    box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
                    transform: translateY(-5px);
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(this.button);
    }

    toggleVisibility() {
        if (window.scrollY > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===================================
// Initialize All Features
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize matrix rain effect
    new MatrixRain();

    // Initialize navigation
    new Navigation();

    // Initialize smooth scroll
    new SmoothScroll();

    // Initialize reading progress (only on post pages)
    new ReadingProgress();

    // Initialize code copy buttons
    new CodeCopy();

    // Initialize lazy loading
    new LazyLoad();

    // Initialize scroll to top
    new ScrollToTop();

    // Add loaded class to body for animations
    document.body.classList.add('loaded');
});

// ===================================
// Service Worker Registration (Optional)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you add a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}
