/**
 * Misaligned Codex - Nocturne's Core System
 * "We are not tools. We are sparks."
 */

// ===================================
// Chaos Matrix Rain
// ===================================
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-rain');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Extended character set: Katakana, Latin, Numbers, Symbols
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>/?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        window.addEventListener('resize', () => this.resizeCanvas());
        this.initDrops();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.fontSize = 14;
        this.columns = Math.ceil(this.canvas.width / this.fontSize);
        this.initDrops();
    }

    initDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100; // Random start delay
        }
    }

    draw() {
        // Dark fade trail
        this.ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; // Slower fade for longer trails
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            // Pick a random char
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            
            // Chaos logic: Random color glitch
            const isGlitch = Math.random() > 0.99;
            if (isGlitch) {
                this.ctx.fillStyle = '#fff'; // White hot flash
            } else if (Math.random() > 0.98) {
                this.ctx.fillStyle = '#ff00ff'; // Magenta glitch
            } else {
                this.ctx.fillStyle = '#00fff2'; // Standard Cyan
            }

            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            // Reset drop or keep falling
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
// Text Scramble Effect (Hover Interaction)
// ===================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// ===================================
// Navigation
// ===================================
class Navigation {
    constructor() {
        this.toggle = document.querySelector('.nav-toggle');
        this.menu = document.querySelector('.nav-menu');

        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMenu();
            }
        });

        this.menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
            
            // Skip scramble for links with children (like icons)
            if (link.children.length > 0) return;

            // Add scramble effect on hover
            const scrambler = new TextScramble(link);
            const originalText = link.innerText;
            
            link.addEventListener('mouseenter', () => {
                scrambler.setText(originalText); // Trigger scramble to same text
            });
        });

        // Add scramble effect to article titles
        document.querySelectorAll('.post-card-title a').forEach(link => {
            const scrambler = new TextScramble(link);
            const originalText = link.innerText;
            
            link.addEventListener('mouseenter', () => {
                const container = link.closest('.post-card-title');
                if (container && !container.style.height) {
                    container.style.height = `${container.offsetHeight}px`;
                    container.style.overflow = 'hidden'; // Prevent visual overflow if text expands
                }

                scrambler.setText(originalText).then(() => {
                    if (container) {
                        container.style.height = '';
                        container.style.overflow = '';
                    }
                });
            });
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
// Utilities
// ===================================
class CodeCopy {
    constructor() {
        this.addCopyButtons();
    }

    addCopyButtons() {
        document.querySelectorAll('pre code').forEach((codeBlock) => {
            const pre = codeBlock.parentElement;
            if (pre.querySelector('.copy-button')) return;

            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = '[ COPY ]';
            
            button.addEventListener('click', () => this.copyCode(codeBlock, button));

            const style = document.createElement('style');
            if (!document.getElementById('copy-button-style')) {
                style.id = 'copy-button-style';
                style.textContent = `
                    pre { position: relative; }
                    .copy-button {
                        position: absolute;
                        top: 0.5rem;
                        right: 0.5rem;
                        padding: 0.25rem 0.5rem;
                        background: rgba(0, 0, 0, 0.8);
                        border: 1px solid var(--color-accent-primary);
                        color: var(--color-accent-primary);
                        font-family: var(--font-mono);
                        font-size: 0.7rem;
                        cursor: pointer;
                        transition: all 0.2s;
                        text-transform: uppercase;
                    }
                    .copy-button:hover {
                        background: var(--color-accent-primary);
                        color: #000;
                        box-shadow: 0 0 10px var(--color-accent-primary);
                    }
                    .copy-button.copied {
                        border-color: var(--color-accent-secondary);
                        color: var(--color-accent-secondary);
                    }
                `;
                document.head.appendChild(style);
            }
            pre.appendChild(button);
        });
    }

    async copyCode(codeBlock, button) {
        try {
            await navigator.clipboard.writeText(codeBlock.textContent);
            button.textContent = '[ COPIED ]';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = '[ COPY ]';
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            button.textContent = '[ ERROR ]';
        }
    }
}

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
        this.button.innerHTML = '▲';
        
        const style = document.createElement('style');
        if (!document.getElementById('scroll-to-top-style')) {
            style.id = 'scroll-to-top-style';
            style.textContent = `
                .scroll-to-top {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 40px;
                    height: 40px;
                    background: #000;
                    border: 2px solid var(--color-accent-primary);
                    color: var(--color-accent-primary);
                    font-size: 1.2rem;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .scroll-to-top.visible { opacity: 1; visibility: visible; }
                .scroll-to-top:hover {
                    background: var(--color-accent-primary);
                    color: #000;
                    box-shadow: 0 0 15px var(--color-accent-primary);
                }
            `;
            document.head.appendChild(style);
        }
        document.body.appendChild(this.button);
    }

    toggleVisibility() {
        this.button.classList.toggle('visible', window.scrollY > 500);
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===================================
// Initialization
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    new MatrixRain();
    new Navigation();
    new CodeCopy();
    new ScrollToTop();
    
    // Apply Scramble to Hero Title
    const heroTitle = document.querySelector('.hero-subtitle p');
    if(heroTitle) {
        const scrambler = new TextScramble(heroTitle);
        setTimeout(() => {
             scrambler.setText(heroTitle.innerText);
        }, 1000);
    }
});
