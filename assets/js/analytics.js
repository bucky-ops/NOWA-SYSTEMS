// NOWA Analytics and Performance Monitoring
class NOWAAnalytics {
    constructor() {
        this.config = {
            apiEndpoint: '/api/analytics',
            sessionId: this.generateSessionId(),
            userId: this.getUserId(),
            startTime: Date.now()
        };
        
        this.metrics = {
            pageViews: 0,
            userInteractions: 0,
            errors: 0,
            performance: {},
            userJourney: []
        };
        
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.setupEventListeners();
        this.measurePerformance();
        this.setupErrorTracking();
        this.trackUserJourney();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getUserId() {
        let userId = localStorage.getItem('nowa_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('nowa_user_id', userId);
        }
        return userId;
    }
    
    trackPageView() {
        this.metrics.pageViews++;
        this.recordEvent('page_view', {
            url: window.location.href,
            referrer: document.referrer,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
    }
    
    setupEventListeners() {
        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackUserInteraction('click', {
                element: e.target.tagName,
                id: e.target.id,
                className: e.target.className,
                text: e.target.textContent?.substring(0, 100),
                x: e.clientX,
                y: e.clientY
            });
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackUserInteraction('form_submit', {
                formId: e.target.id,
                formClass: e.target.className,
                action: e.target.action
            });
        });
        
        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                this.recordEvent('scroll_depth', {
                    depth: scrollDepth,
                    timestamp: Date.now()
                });
            }
        });
        
        // Track time on page
        this.trackTimeOnPage();
    }
    
    trackUserInteraction(type, data) {
        this.metrics.userInteractions++;
        this.recordEvent('user_interaction', {
            type,
            data,
            timestamp: Date.now()
        });
    }
    
    measurePerformance() {
        // Wait for page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = this.getPerformanceMetrics();
                this.metrics.performance = perfData;
                this.recordEvent('performance_metrics', perfData);
            }, 1000);
        });
    }
    
    getPerformanceMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        return {
            // Core Web Vitals
            lcp: this.getLCP(),
            fid: this.getFID(),
            cls: this.getCLS(),
            
            // Navigation timing
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalPageLoad: navigation.loadEventEnd - navigation.fetchStart,
            
            // Paint timing
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            
            // Resource timing
            resourceCount: performance.getEntriesByType('resource').length,
            resourceSize: this.getResourceSize(),
            
            // Memory usage (if available)
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };
    }
    
    getLCP() {
        return new Promise((resolve) => {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                resolve(lastEntry.startTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        });
    }
    
    getFID() {
        return new Promise((resolve) => {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    resolve(entry.processingStart - entry.startTime);
                });
            });
            observer.observe({ entryTypes: ['first-input'] });
        });
    }
    
    getCLS() {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        return clsValue;
    }
    
    getResourceSize() {
        const resources = performance.getEntriesByType('resource');
        return resources.reduce((total, resource) => {
            return total + (resource.transferSize || 0);
        }, 0);
    }
    
    setupErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (e) => {
            this.metrics.errors++;
            this.recordEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack,
                timestamp: Date.now()
            });
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.metrics.errors++;
            this.recordEvent('unhandled_promise_rejection', {
                reason: e.reason,
                timestamp: Date.now()
            });
        });
        
        // Resource loading errors
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.recordEvent('resource_error', {
                    src: e.target.src,
                    tagName: e.target.tagName,
                    timestamp: Date.now()
                });
            }
        }, true);
    }
    
    trackUserJourney() {
        // Track section views
        const sections = document.querySelectorAll('section[id]');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.recordEvent('section_view', {
                        sectionId: entry.target.id,
                        timestamp: Date.now()
                    });
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    trackTimeOnPage() {
        let startTime = Date.now();
        
        // Track time on page before leaving
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            this.recordEvent('time_on_page', {
                duration: timeOnPage,
                timestamp: Date.now()
            });
        });
        
        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.recordEvent('page_hidden', {
                    timestamp: Date.now()
                });
            } else {
                this.recordEvent('page_visible', {
                    timestamp: Date.now()
                });
            }
        });
    }
    
    recordEvent(eventType, data) {
        const event = {
            sessionId: this.config.sessionId,
            userId: this.config.userId,
            eventType,
            data,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Store locally for offline sync
        this.storeEventLocally(event);
        
        // Send to analytics endpoint
        this.sendEvent(event);
    }
    
    storeEventLocally(event) {
        try {
            const events = JSON.parse(localStorage.getItem('nowa_analytics_events') || '[]');
            events.push(event);
            
            // Keep only last 100 events to prevent storage bloat
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('nowa_analytics_events', JSON.stringify(events));
        } catch (error) {
            console.warn('Failed to store analytics event locally:', error);
        }
    }
    
    async sendEvent(event) {
        try {
            // Use sendBeacon for reliable delivery
            if (navigator.sendBeacon) {
                navigator.sendBeacon(this.config.apiEndpoint, JSON.stringify(event));
            } else {
                // Fallback to fetch
                await fetch(this.config.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(event)
                });
            }
        } catch (error) {
            console.warn('Failed to send analytics event:', error);
        }
    }
    
    // Public API methods
    trackCustomEvent(eventName, properties = {}) {
        this.recordEvent('custom_event', {
            eventName,
            properties,
            timestamp: Date.now()
        });
    }
    
    setUserProperties(properties) {
        localStorage.setItem('nowa_user_properties', JSON.stringify(properties));
        this.recordEvent('user_properties_set', {
            properties,
            timestamp: Date.now()
        });
    }
    
    trackConversion(conversionType, value = null) {
        this.recordEvent('conversion', {
            conversionType,
            value,
            timestamp: Date.now()
        });
    }
    
    getMetrics() {
        return {
            ...this.metrics,
            sessionDuration: Date.now() - this.config.startTime,
            sessionId: this.config.sessionId,
            userId: this.config.userId
        };
    }
    
    // Export data for debugging
    exportData() {
        return {
            config: this.config,
            metrics: this.metrics,
            localEvents: JSON.parse(localStorage.getItem('nowa_analytics_events') || '[]')
        };
    }
}

// Initialize analytics
const nowaAnalytics = new NOWAAnalytics();

// Make analytics available globally for debugging
window.NOWAAnalytics = nowaAnalytics;

// Track specific NOWA events
document.addEventListener('DOMContentLoaded', () => {
    // Track CTA clicks
    document.querySelectorAll('a[href="#contact"], a[href="#"]').forEach(link => {
        link.addEventListener('click', () => {
            nowaAnalytics.trackCustomEvent('cta_click', {
                ctaText: link.textContent.trim(),
                ctaLocation: link.closest('section')?.id || 'unknown'
            });
        });
    });
    
    // Track form interactions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            nowaAnalytics.trackCustomEvent('form_submit', {
                formId: form.id,
                formAction: form.action
            });
        });
    });
    
    // Track video/audio interactions
    document.querySelectorAll('video, audio').forEach(media => {
        media.addEventListener('play', () => {
            nowaAnalytics.trackCustomEvent('media_play', {
                mediaType: media.tagName.toLowerCase(),
                mediaSrc: media.src
            });
        });
    });
});

// Export for use in other modules
export default nowaAnalytics;
