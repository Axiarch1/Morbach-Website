// Products Carousel
(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    autoAdvanceInterval: 2000, // 2 seconds
    transitionDuration: 500, // 0.5 seconds
    cardsToShow: {
      desktop: 3,
      tablet: 1,
      mobile: 1
    }
  };

  // State
  let currentIndex = 0;
  let autoAdvanceTimer = null;
  let totalCards = 0;
  let cardsToShow = 3;

  // DOM Elements
  const carouselTrack = document.querySelector('.carousel-track');
  const allCards = document.querySelectorAll('.review-card');
  const cards = document.querySelectorAll('.review-card:not(.clone-card)');
  const dotsContainer = document.querySelector('.carousel-dots');
  
  if (!carouselTrack || !cards.length || !dotsContainer) {
    console.warn('Products carousel elements not found');
    return;
  }

  totalCards = cards.length;

  // Determine how many cards to show based on screen size
  function getCardsToShow() {
    const width = window.innerWidth;
    if (width <= 768) {
      return CONFIG.cardsToShow.mobile;
    } else if (width <= 1024) {
      return CONFIG.cardsToShow.tablet;
    }
    return CONFIG.cardsToShow.desktop;
  }

  // Update cards to show on resize
  function handleResize() {
    cardsToShow = getCardsToShow();
    updateCarousel(false); // Update without animation on resize
  }

  // Create navigation dots
  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to product ${i + 1}`);
      if (i === currentIndex) {
        dot.classList.add('active');
      }
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Update active dot
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Update card states (center vs side)
  function updateCardStates() {
    allCards.forEach((card) => {
      card.classList.remove('center-card', 'side-card');
      
      // Clone cards should never flip
      if (card.classList.contains('clone-card')) {
        card.classList.add('side-card');
        return;
      }
      
      const cardIndex = parseInt(card.getAttribute('data-index'));
      
      if (cardsToShow === 3) {
        // Desktop: all 3 visible cards can flip
        // Visible cards are: currentIndex-1, currentIndex, currentIndex+1
        const visibleIndices = [
          (currentIndex - 1 + totalCards) % totalCards,
          currentIndex,
          (currentIndex + 1) % totalCards
        ];
        
        if (visibleIndices.includes(cardIndex)) {
          card.classList.add('center-card'); // Actually means "interactive card"
        } else {
          card.classList.add('side-card');
        }
      } else {
        // Mobile/Tablet: only the centered card can flip
        if (cardIndex === currentIndex) {
          card.classList.add('center-card');
        } else {
          card.classList.add('side-card');
        }
      }
    });
  }

  // Calculate carousel position
  function updateCarousel(animate = true) {
    // Temporarily disable transitions for instant updates
    if (!animate) {
      carouselTrack.style.transition = 'none';
    }

    const cardWidth = allCards[0].offsetWidth;
    const gap = 32; // Gap between cards
    const containerWidth = carouselTrack.parentElement.offsetWidth;

    let offset;
    
    if (cardsToShow === 3) {
      // Desktop: center the current card with side cards visible
      const centerOffset = (containerWidth - cardWidth) / 2;
      // Add 1 to currentIndex to account for the clone card at the beginning
      offset = centerOffset - ((currentIndex + 1) * (cardWidth + gap));
    } else {
      // Mobile/Tablet: center single card
      const centerOffset = (containerWidth - cardWidth) / 2;
      // Add 1 to currentIndex to account for the clone card at the beginning
      offset = centerOffset - ((currentIndex + 1) * (cardWidth + gap));
    }

    carouselTrack.style.transform = `translateX(${offset}px)`;

    // Re-enable transitions after instant update
    if (!animate) {
      // Force reflow
      carouselTrack.offsetHeight;
      carouselTrack.style.transition = '';
    }

    updateCardStates();
    updateDots();
  }

  // Go to specific slide
  function goToSlide(index) {
    if (index < 0 || index >= totalCards) return;
    
    currentIndex = index;
    updateCarousel();
    resetAutoAdvance();
  }

  // Go to next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
  }

  // Start auto-advance
  function startAutoAdvance() {
    stopAutoAdvance();
    autoAdvanceTimer = setInterval(nextSlide, CONFIG.autoAdvanceInterval);
  }

  // Stop auto-advance
  function stopAutoAdvance() {
    if (autoAdvanceTimer) {
      clearInterval(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
  }

  // Reset auto-advance (restart timer)
  function resetAutoAdvance() {
    stopAutoAdvance();
    startAutoAdvance();
  }

  // Pause auto-advance on hover
  function handleMouseEnter() {
    stopAutoAdvance();
  }

  // Resume auto-advance on mouse leave
  function handleMouseLeave() {
    startAutoAdvance();
  }

  // Initialize carousel
  function init() {
    cardsToShow = getCardsToShow();
    createDots();
    updateCarousel(false); // Initial position without animation
    startAutoAdvance();

    // Event listeners
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', handleMouseEnter);
      carouselContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    window.addEventListener('resize', handleResize);

    // Pause on tab visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoAdvance();
      } else {
        startAutoAdvance();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();