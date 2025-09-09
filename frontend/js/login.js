// Custom Popup Modal System
class PopupModal {
  constructor() {
    this.createPopupContainer();
  }

  createPopupContainer() {
    // Create popup container if it doesn't exist
    if (!document.getElementById('popup-container')) {
      const container = document.createElement('div');
      container.id = 'popup-container';
      container.className = 'popup-container';
      document.body.appendChild(container);
    }
  }

  show(message, type = 'info', title = '') {
    const popup = document.createElement('div');
    popup.className = `popup-modal ${type}`;
    
    const icon = this.getIcon(type);
    const displayTitle = title || this.getDefaultTitle(type);
    
    popup.innerHTML = `
      <div class="popup-overlay"></div>
      <div class="popup-content">
        <div class="popup-header">
          <div class="popup-icon">${icon}</div>
          <h3 class="popup-title">${displayTitle}</h3>
          <button class="popup-close">&times;</button>
        </div>
        <div class="popup-body">
          <p>${message}</p>
        </div>
        <div class="popup-footer">
          <button class="popup-btn popup-btn-primary">OK</button>
        </div>
      </div>
    `;

    document.getElementById('popup-container').appendChild(popup);
    
    // Show popup with animation
    setTimeout(() => {
      popup.classList.add('show');
    }, 10);

    // Add event listeners
    this.addEventListeners(popup);
    
    return popup;
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }

  getDefaultTitle(type) {
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };
    return titles[type] || titles.info;
  }

  addEventListeners(popup) {
    const closeBtn = popup.querySelector('.popup-close');
    const okBtn = popup.querySelector('.popup-btn-primary');
    const overlay = popup.querySelector('.popup-overlay');

    const closePopup = () => {
      popup.classList.remove('show');
      setTimeout(() => {
        popup.remove();
      }, 300);
    };

    closeBtn.addEventListener('click', closePopup);
    okBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
    
    // Close on Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closePopup();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }
}

// Initialize popup system
const popupModal = new PopupModal();

// Import auth system
document.addEventListener('DOMContentLoaded', () => {
  // Ensure auth system is loaded
  if (window.authSystem && window.authSystem.isLoggedIn()) {
    // Redirect if already logged in
    window.location.href = 'index.html';
    return;
  }
});

  // Form handler demo
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked;

    // Basic validation
    if (!email || !password) {
      popupModal.show('Please fill in all fields', 'warning', 'Missing Information');
      return;
    }

    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Signing in...';
      submitBtn.disabled = true;

      // Simulate loading delay
      setTimeout(() => {
        try {
          const user = window.authSystem.login(email, password);
          
          // Success animation
          submitBtn.textContent = '✓ Success!';
          submitBtn.style.background = '#10b981';
          
          // Redirect after short delay
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
          
        } catch (error) {
          // Reset button state
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          
          // Show error with animation
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-message';
          errorDiv.textContent = error.message;
          
          const form = document.getElementById('loginForm');
          form.insertBefore(errorDiv, form.firstChild);
          
          // Remove error after 3 seconds
          setTimeout(() => {
            if (errorDiv.parentElement) {
              errorDiv.remove();
            }
          }, 3000);
        }
      }, 800);
      
    } catch (error) {
      popupModal.show(error.message, 'error', 'Login Failed');
    }
  });

  // Google button (demo)
  document.querySelector('.btn-google').addEventListener('click', () => {
    popupModal.show('Google sign-in not implimented yet', 'info', 'Google Sign-In');
  });

// Add error message styles
const errorStyles = `
  .error-message {
    background: #fee2e2;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    border: 1px solid #fecaca;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Custom Popup Modal Styles */
  .popup-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    pointer-events: none;
  }

  .popup-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: auto;
  }

  .popup-modal.show {
    opacity: 1;
    visibility: visible;
  }

  .popup-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
  }

  .popup-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    background: white;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .popup-modal.show .popup-content {
    transform: translate(-50%, -50%) scale(1);
  }

  .popup-header {
    display: flex;
    align-items: center;
    padding: 24px 24px 16px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .popup-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    margin-right: 12px;
  }

  .popup-modal.success .popup-icon {
    background: #dcfce7;
    color: #16a34a;
  }

  .popup-modal.error .popup-icon {
    background: #fee2e2;
    color: #dc2626;
  }

  .popup-modal.warning .popup-icon {
    background: #fef3c7;
    color: #d97706;
  }

  .popup-modal.info .popup-icon {
    background: #dbeafe;
    color: #2563eb;
  }

  .popup-title {
    flex: 1;
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }

  .popup-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  }

  .popup-close:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .popup-body {
    padding: 16px 24px;
  }

  .popup-body p {
    margin: 0;
    color: #6b7280;
    line-height: 1.5;
  }

  .popup-footer {
    padding: 16px 24px 24px 24px;
    display: flex;
    justify-content: flex-end;
  }

  .popup-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .popup-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  .popup-btn:hover::before {
    left: 100%;
  }

  .popup-btn:hover {
    transform: translateY(-2px);
  }

  .popup-btn-primary {
    background: var(--primary, #f5c518);
    color: var(--primary-ink, #0b0b0c);
    box-shadow: 0 10px 24px -8px rgba(245, 197, 24, 0.4);
  }

  .popup-btn-primary:hover {
    box-shadow: 0 15px 35px -10px rgba(245, 197, 24, 0.6);
  }

  @media (max-width: 480px) {
    .popup-content {
      max-width: 95%;
      margin: 20px;
    }
    
    .popup-header {
      padding: 20px 20px 12px 20px;
    }
    
    .popup-body {
      padding: 12px 20px;
    }
    
    .popup-footer {
      padding: 12px 20px 20px 20px;
    }
  }
`;

const loginStyleSheet = document.createElement('style');
loginStyleSheet.textContent = errorStyles;
document.head.appendChild(loginStyleSheet);