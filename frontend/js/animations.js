// Animation utilities for Eventra
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupHoverAnimations();
    this.setupLoadingAnimations();
  }

  // Scroll-triggered animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });
  }

  // Hover animations for cards and buttons
  setupHoverAnimations() {
    // Card hover effects
    document.querySelectorAll('.card, .product-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px -15px rgba(0,0,0,0.3)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
      });
    });

    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
      });
    });
  }

  // Loading animations
  setupLoadingAnimations() {
    // Stagger animation for cards
    const cards = document.querySelectorAll('.card, .product-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('fade-in-up');
    });
  }

  // Smooth scroll to element
  scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Add bounce animation to element
  bounceElement(element) {
    element.style.animation = 'bounce 0.6s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 600);
  }

  // Fade in animation
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  }

  // Slide in animation
  slideIn(element, direction = 'left', duration = 400) {
    const translateValue = direction === 'left' ? '-100%' : '100%';
    element.style.transform = `translateX(${translateValue})`;
    element.style.transition = `transform ${duration}ms ease-out`;
    
    setTimeout(() => {
      element.style.transform = 'translateX(0)';
    }, 10);
  }
}

// Initialize animation manager
window.animationManager = new AnimationManager();

// Add CSS animations
const animationStyles = `
  .fade-in-up {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.6s ease-out forwards;
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-in {
    animation: slideInFromBottom 0.8s ease-out forwards;
  }

  @keyframes slideInFromBottom {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0,0,0);
    }
    40%, 43% {
      transform: translate3d(0,-15px,0);
    }
    70% {
      transform: translate3d(0,-7px,0);
    }
    90% {
      transform: translate3d(0,-2px,0);
    }
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  .card, .product-card {
    transition: all 0.3s ease;
  }

  .btn {
    transition: all 0.2s ease;
  }

  .loading-spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);