// SMOOTH COUNTER ANIMATION
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, duration / steps);
}

// PROGRESS BAR ANIMATION
function animateProgressBar(element) {
    const progress = element.dataset.progress;
    setTimeout(() => {
        element.style.width = progress + '%';
    }, 100);
}

// CARD ENTRANCE ANIMATIONS
function animateCards() {
    const cards = document.querySelectorAll('.card[data-animation]');
    
    cards.forEach(card => {
        const delay = parseInt(card.dataset.delay) || 0;
        
        setTimeout(() => {
            card.classList.add('visible');
        }, delay);
    });
}

// TRIGGER ALL ANIMATIONS ON LOAD
function initAnimations() {
    // Animate cards with staggered delays
    animateCards();
    
    // Animate counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        setTimeout(() => {
            animateCounter(counter);
        }, parseInt(counter.closest('.card').dataset.delay) || 0);
    });
    
    // Animate progress bar
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        setTimeout(() => {
            animateProgressBar(progressBar);
        }, 700);
    }
}

// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initAnimations();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// INITIALIZE ON PAGE LOAD
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        // Small delay for better visual effect
        setTimeout(() => {
            observer.observe(heroSection);
        }, 300);
    }
});

// SMOOTH SCROLL FOR NAVIGATION
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// STACK CARDS SCROLL ANIMATION
// ==========================================
(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    stackOffset: 24, // Gap between stacked cards in pixels
    topOffsetVh: 12, // Distance from top when stacked (in vh)
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStackCards);
  } else {
    initStackCards();
  }

  function initStackCards() {
    const wrapper = document.querySelector('[data-stack-cards]');
    
    if (!wrapper) {
      return;
    }

    const cards = Array.from(wrapper.querySelectorAll('.stack-card'));
    
    if (cards.length === 0) {
      return;
    }

    // Add spacer element after the last card to give it room to fully stack
    addSpacer(wrapper, cards);

    // Set up each card with its specific sticky top position
    cards.forEach((card, index) => {
      card.dataset.stackIndex = index;
      
      // Set z-index so later cards appear on top
      card.style.zIndex = index + 1;
    });

    // Apply CSS-based sticky positioning
    applyStackingStyles(cards);

    // Recalculate on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Update spacer height
        updateSpacerHeight(wrapper, cards);
        
        // Recalculate sticky tops based on new viewport
        cards.forEach((card, index) => {
          const topOffsetPx = (window.innerHeight * CONFIG.topOffsetVh / 100) + (index * CONFIG.stackOffset);
          card.style.top = topOffsetPx + 'px';
        });
      }, 100);
    }, { passive: true });
  }

  function addSpacer(wrapper, cards) {
    // Check if spacer already exists
    let spacer = wrapper.querySelector('.stack-cards-spacer');
    
    if (!spacer) {
      spacer = document.createElement('div');
      spacer.className = 'stack-cards-spacer';
      spacer.style.pointerEvents = 'none';
      wrapper.appendChild(spacer);
    }
    
    updateSpacerHeight(wrapper, cards);
  }

  function updateSpacerHeight(wrapper, cards) {
    const spacer = wrapper.querySelector('.stack-cards-spacer');
    if (!spacer || cards.length === 0) return;
    
    // The spacer only needs to be tall enough for the last card to fully stick
    // This is just a small amount - roughly the stack offset itself
    const spacerHeight = CONFIG.stackOffset;
    
    spacer.style.height = spacerHeight + 'px';
  }

  function applyStackingStyles(cards) {
    cards.forEach((card, index) => {
      // Make all cards sticky from the start
      card.style.position = 'sticky';
      
      // Each card has its own top value based on its index
      const topOffsetPx = (window.innerHeight * CONFIG.topOffsetVh / 100) + (index * CONFIG.stackOffset);
      card.style.top = topOffsetPx + 'px';
      
      // Z-index ensures later cards stack on top
      card.style.zIndex = index + 1;
    });
  }

  // Expose for external use if needed
  window.StackCards = {
    refresh: function() {
      const wrapper = document.querySelector('[data-stack-cards]');
      if (wrapper) {
        const cards = Array.from(wrapper.querySelectorAll('.stack-card'));
        updateSpacerHeight(wrapper, cards);
        applyStackingStyles(cards);
      }
    }
  };

})();