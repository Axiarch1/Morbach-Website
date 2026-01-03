function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
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

function animateProgressBar(element) {
    const progress = element.dataset.progress;
    setTimeout(() => {
        element.style.width = progress + '%';
    }, 100);
}

function animateCards() {
    const cards = document.querySelectorAll('.card[data-animation]');
    
    cards.forEach(card => {
        const delay = parseInt(card.dataset.delay) || 0;
        
        setTimeout(() => {
            card.classList.add('visible');
        }, delay);
    });
}

function initAnimations() {
    animateCards();
    
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const card = counter.closest('.card');
        const delay = card ? parseInt(card.dataset.delay) || 0 : 0;
        setTimeout(() => {
            animateCounter(counter);
        }, delay);
    });
    
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        setTimeout(() => {
            animateProgressBar(progressBar);
        }, 700);
    }
}

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

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        setTimeout(() => {
            observer.observe(heroSection);
        }, 300);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#') && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

(function() {
  'use strict';

  const CONFIG = {
    stackOffset: 24,
    topOffsetVh: 12,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStackCards);
  } else {
    initStackCards();
  }

  function initStackCards() {
    const wrapper = document.querySelector('[data-stack-cards]');
    
    if (!wrapper) return;

    const cards = Array.from(wrapper.querySelectorAll('.stack-card'));
    
    if (cards.length === 0) return;

    addSpacer(wrapper, cards);

    cards.forEach((card, index) => {
      card.dataset.stackIndex = index;
      card.style.zIndex = index + 1;
    });

    applyStackingStyles(cards);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateSpacerHeight(wrapper, cards);
        
        cards.forEach((card, index) => {
          const topOffsetPx = (window.innerHeight * CONFIG.topOffsetVh / 100) + (index * CONFIG.stackOffset);
          card.style.top = topOffsetPx + 'px';
        });
      }, 100);
    }, { passive: true });
  }

  function addSpacer(wrapper, cards) {
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
    
    const spacerHeight = CONFIG.stackOffset * cards.length;
    spacer.style.height = spacerHeight + 'px';
  }

  function applyStackingStyles(cards) {
    cards.forEach((card, index) => {
      card.style.position = 'sticky';
      
      const topOffsetPx = (window.innerHeight * CONFIG.topOffsetVh / 100) + (index * CONFIG.stackOffset);
      card.style.top = topOffsetPx + 'px';
      
      card.style.zIndex = index + 1;
    });
  }

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