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
    topOffset: '12vh', // Distance from top when stacked
    stackStartOffset: 0.3, // When to start stacking (0-1, percentage of viewport)
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

    // Set up initial state
    cards.forEach((card, index) => {
      card.dataset.stackIndex = index;
      card.dataset.locked = 'false';
    });

    // Handle scroll
    let ticking = false;
    
    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateCardPositions(cards);
          ticking = false;
        });
        ticking = true;
      }
    }

    // Initial calculation
    updateCardPositions(cards);

    // Listen to scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateCardPositions(cards);
    }, { passive: true });
  }

  function updateCardPositions(cards) {
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    cards.forEach((card, index) => {
      // Skip if card is already locked in stacked position
      if (card.dataset.locked === 'true') {
        return;
      }

      const cardRect = card.getBoundingClientRect();
      const cardTop = cardRect.top + scrollY;
      
      // Calculate the trigger point when card should become sticky
      const triggerOffset = viewportHeight * 0.12; // 12vh in pixels
      const triggerPoint = cardTop - triggerOffset;
      
      // Check if we've scrolled past the trigger point
      if (scrollY >= triggerPoint) {
        // Lock the card in stacked position
        card.dataset.locked = 'true';
        card.classList.add('is-stacking');
        card.style.position = 'sticky';
        card.style.top = CONFIG.topOffset;
        
        // Apply stack offset (each card stacks with offset based on index)
        const stackPosition = index * CONFIG.stackOffset;
        card.style.transform = `translateY(${stackPosition}px)`;
        
        // Z-index: higher index = on top
        card.style.zIndex = index + 1;
        
      } else {
        // Card hasn't reached trigger point - normal flow
        card.dataset.locked = 'false';
        card.classList.remove('is-stacking');
        card.style.position = 'relative';
        card.style.top = 'auto';
        card.style.transform = 'translateY(0)';
        card.style.zIndex = index + 1;
      }
    });
  }

  // Expose for external use if needed
  window.StackCards = {
    refresh: function() {
      const wrapper = document.querySelector('[data-stack-cards]');
      if (wrapper) {
        const cards = Array.from(wrapper.querySelectorAll('.stack-card'));
        updateCardPositions(cards);
      }
    }
  };

})();