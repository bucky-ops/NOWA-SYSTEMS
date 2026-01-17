// NOWA Security and Content Security Policy
class NOWASecurity {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCSP();
        this.setupSecurityHeaders();
        this.setupInputSanitization();
        this.setupXSSProtection();
        this.setupCSRFProtection();
        this.setupClickjackingProtection();
        this.setupSecureStorage();
    }
    
    setupCSP() {
        // Content Security Policy
        const csp = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https: wss:",
            "media-src 'self' https: blob:",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "upgrade-insecure-requests"
        ].join('; ');
        
        // Apply CSP via meta tag
        const metaCSP = document.createElement('meta');
        metaCSP.setAttribute('http-equiv', 'Content-Security-Policy');
        metaCSP.setAttribute('content', csp);
        document.head.appendChild(metaCSP);
    }
    
    setupSecurityHeaders() {
        // Add security headers via meta tags
        const securityHeaders = [
            { name: 'X-Content-Type-Options', value: 'nosniff' },
            { name: 'X-Frame-Options', value: 'DENY' },
            { name: 'X-XSS-Protection', value: '1; mode=block' },
            { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { name: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ];
        
        securityHeaders.forEach(header => {
            const meta = document.createElement('meta');
            meta.setAttribute('http-equiv', header.name);
            meta.setAttribute('content', header.value);
            document.head.appendChild(meta);
        });
    }
    
    setupInputSanitization() {
        // Sanitize all user inputs
        this.sanitizeInputs();
        
        // Monitor for new inputs
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.sanitizeElement(node);
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    sanitizeInputs() {
        document.querySelectorAll('input, textarea, select').forEach(input => {
            this.sanitizeElement(input);
        });
    }
    
    sanitizeElement(element) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.addEventListener('input', (e) => {
                e.target.value = this.sanitizeString(e.target.value);
            });
        }
    }
    
    sanitizeString(str) {
        if (typeof str !== 'string') return str;
        
        return str
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }
    
    setupXSSProtection() {
        // Override innerHTML to prevent XSS
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                const sanitized = this.sanitizeHTML(value);
                originalInnerHTML.set.call(this, sanitized);
            },
            get: originalInnerHTML.get
        });
        
        // Override document.write
        const originalWrite = document.write;
        document.write = function(content) {
            const sanitized = this.sanitizeHTML(content);
            originalWrite.call(document, sanitized);
        };
    }
    
    sanitizeHTML(html) {
        if (typeof html !== 'string') return html;
        
        // Create a temporary div to parse HTML
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }
    
    setupCSRFProtection() {
        // Generate CSRF token
        const csrfToken = this.generateCSRFToken();
        localStorage.setItem('nowa_csrf_token', csrfToken);
        
        // Add token to all forms
        document.querySelectorAll('form').forEach(form => {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'csrf_token';
            tokenInput.value = csrfToken;
            form.appendChild(tokenInput);
        });
        
        // Validate token on form submission
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const tokenInput = form.querySelector('input[name="csrf_token"]');
            
            if (tokenInput && tokenInput.value !== csrfToken) {
                e.preventDefault();
                this.logSecurityEvent('csrf_attack_prevented', {
                    form: form.id || form.className,
                    timestamp: Date.now()
                });
            }
        });
    }
    
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    setupClickjackingProtection() {
        // Check if page is in iframe
        if (window.top !== window.self) {
            this.logSecurityEvent('clickjacking_attempt', {
                timestamp: Date.now(),
                referrer: document.referrer
            });
            
            // Redirect to main page
            window.top.location = window.location;
        }
    }
    
    setupSecureStorage() {
        // Encrypt sensitive data in localStorage
        this.encryptStorage();
        
        // Monitor for suspicious storage access
        this.monitorStorageAccess();
    }
    
    encryptStorage() {
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        
        localStorage.setItem = function(key, value) {
            if (key.startsWith('nowa_secure_')) {
                const encrypted = this.encryptData(value);
                originalSetItem.call(localStorage, key, encrypted);
            } else {
                originalSetItem.call(localStorage, key, value);
            }
        }.bind(this);
        
        localStorage.getItem = function(key) {
            const value = originalGetItem.call(localStorage, key);
            if (key.startsWith('nowa_secure_') && value) {
                return this.decryptData(value);
            }
            return value;
        }.bind(this);
    }
    
    encryptData(data) {
        // Simple encryption for demo purposes
        // In production, use proper encryption libraries
        const key = this.getEncryptionKey();
        const encrypted = btoa(JSON.stringify(data) + key);
        return encrypted;
    }
    
    decryptData(encryptedData) {
        try {
            const key = this.getEncryptionKey();
            const decrypted = atob(encryptedData);
            const data = decrypted.replace(key, '');
            return JSON.parse(data);
        } catch (error) {
            console.warn('Failed to decrypt data:', error);
            return null;
        }
    }
    
    getEncryptionKey() {
        let key = localStorage.getItem('nowa_encryption_key');
        if (!key) {
            key = this.generateEncryptionKey();
            localStorage.setItem('nowa_encryption_key', key);
        }
        return key;
    }
    
    generateEncryptionKey() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    monitorStorageAccess() {
        // Monitor for suspicious storage patterns
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        
        localStorage.setItem = function(key, value) {
            this.logStorageAccess('set', key, value);
            originalSetItem.call(localStorage, key, value);
        }.bind(this);
        
        localStorage.getItem = function(key) {
            this.logStorageAccess('get', key);
            return originalGetItem.call(localStorage, key);
        }.bind(this);
    }
    
    logStorageAccess(operation, key, value = null) {
        // Log suspicious storage access patterns
        if (key.includes('password') || key.includes('token') || key.includes('secret')) {
            this.logSecurityEvent('sensitive_storage_access', {
                operation,
                key,
                timestamp: Date.now()
            });
        }
    }
    
    logSecurityEvent(eventType, data) {
        console.warn('Security Event:', eventType, data);
        
        // Send to security monitoring endpoint
        this.sendSecurityEvent(eventType, data);
    }
    
    async sendSecurityEvent(eventType, data) {
        try {
            await fetch('/api/security', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eventType,
                    data,
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                })
            });
        } catch (error) {
            console.warn('Failed to send security event:', error);
        }
    }
    
    // Public security methods
    validateInput(input, type = 'text') {
        const validators = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\+]?[1-9][\d]{0,15}$/,
            url: /^https?:\/\/.+/,
            text: /^[a-zA-Z0-9\s\-_.,!?]+$/
        };
        
        const validator = validators[type] || validators.text;
        return validator.test(input);
    }
    
    sanitizeURL(url) {
        try {
            const urlObj = new URL(url);
            // Only allow https and http protocols
            if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
                return null;
            }
            return urlObj.toString();
        } catch (error) {
            return null;
        }
    }
    
    generateSecurePassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        return password;
    }
    
    // Security headers for API responses
    getSecurityHeaders() {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
        };
    }
}

// Initialize security
const nowaSecurity = new NOWASecurity();

// Make security available globally
window.NOWASecurity = nowaSecurity;

// Export for use in other modules
export default nowaSecurity;
