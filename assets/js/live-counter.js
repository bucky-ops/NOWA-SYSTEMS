// NOWA Live Transaction Counter
class NOWALiveCounter {
  constructor() {
    this.counters = [];
    this.isVisible = false;
    this.init();
  }

  init() {
    this.observeCounters();
    this.startAutoIncrement();
  }

  observeCounters() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isVisible) {
            this.isVisible = true;
            this.animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all counter elements
    document.querySelectorAll('.counter').forEach((counter) => {
      observer.observe(counter);
      this.counters.push({
        element: counter,
        target: parseInt(counter.getAttribute('data-target')) || 0,
        current: 0,
      });
    });
  }

  animateCounters() {
    this.counters.forEach((counter, index) => {
      this.animateCounter(counter, index);
    });
  }

  animateCounter(counter, delay = 0) {
    const { element, target } = counter;
    let current = 0;
    const increment = target / 100; // Animate over 100 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        element.textContent = this.formatNumber(Math.floor(current));
      }, stepTime);
    }, delay * 200); // Stagger animations
  }

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  startAutoIncrement() {
    // Simulate live updates every 30 seconds
    setInterval(() => {
      if (this.isVisible) {
        this.incrementRandomCounter();
      }
    }, 30000);
  }

  incrementRandomCounter() {
    if (this.counters.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.counters.length);
    const counter = this.counters[randomIndex];

    // Increment by 1-5 for realism
    const increment = Math.floor(Math.random() * 5) + 1;
    counter.target += increment;

    // Animate the increment
    this.animateIncrement(counter.element, increment);
  }

  animateIncrement(element, increment) {
    const currentValue = parseInt(element.textContent.replace(/,/g, ''));
    const newValue = currentValue + increment;

    let current = currentValue;
    const step = Math.ceil(increment / 10);

    const interval = setInterval(() => {
      current += step;
      if (current >= newValue) {
        current = newValue;
        clearInterval(interval);
      }
      element.textContent = this.formatNumber(current);
    }, 50);
  }
}

// Initialize counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NOWALiveCounter();
});