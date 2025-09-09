// Custom Popup Modal System for Eventra
class PopupModal {
  constructor() {
    this.modal = null;
    this.isVisible = false;
    this.injectStyles();
  }

  show(message, type = 'info', title = null, options = {}) {
    if (this.isVisible) {
      this.hide();
    }

    const modalType = type;
    const modalTitle = title || this.getDefaultTitle(type);
    const duration = options.duration || 3000;
    const showCloseButton = options.showCloseButton !== false;
    const callback = options.callback;

    // Create modal HTML
    this.modal = document.createElement('div');
    this.modal.className = 'popup-modal-overlay';
    this.modal.innerHTML = `
      <div class="popup-modal popup-modal-${modalType}">
        <div class="popup-modal-header">
          <div class="popup-modal-icon">${this.getIcon(type)}</div>
          <h3 class="popup-modal-title">${modalTitle}</h3>
          ${showCloseButton ? '<button class="popup-modal-close">&times;</button>' : ''}
        </div>
        <div class="popup-modal-body">
          <p class="popup-modal-message">${message}</p>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);
    this.isVisible = true;

    // Add event listeners
    this.addEventListeners();

    // Show modal with animation
    setTimeout(() => {
      this.modal.classList.add('show');
    }, 10);

    // Auto hide after duration
    if (duration > 0) {
      setTimeout(() => {
        this.hide(callback);
      }, duration);
    }

    return this;
  }

  hide(callback = null) {
    if (!this.isVisible || !this.modal) return;

    this.modal.classList.remove('show');
    
    setTimeout(() => {
      if (this.modal && this.modal.parentNode) {
        this.modal.parentNode.removeChild(this.modal);
      }
      this.modal = null;
      this.isVisible = false;
      
      if (callback && typeof callback === 'function') {
        callback();
      }
    }, 300);
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

  addEventListeners() {
    if (!this.modal) return;

    // Close button
    const closeButton = this.modal.querySelector('.popup-modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hide());
    }

    // Click outside to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });

    // Escape key to close
    const handleEscape = (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  injectStyles() {
    // Check if styles already injected
    if (document.querySelector('#popup-modal-styles')) return;

    const styles = `
      .popup-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .popup-modal-overlay.show {
        opacity: 1;
        visibility: visible;
      }

      .popup-modal {
        background: white;
        border-radius: 12px;
        min-width: 320px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        transform: scale(0.7) translateY(50px);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        overflow: hidden;
      }

      .popup-modal-overlay.show .popup-modal {
        transform: scale(1) translateY(0);
      }

      .popup-modal-header {
        padding: 20px 20px 10px;
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
      }

      .popup-modal-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        color: white;
        flex-shrink: 0;
      }

      .popup-modal-success .popup-modal-icon {
        background: linear-gradient(135deg, #48bb78, #38a169);
      }

      .popup-modal-error .popup-modal-icon {
        background: linear-gradient(135deg, #f56565, #e53e3e);
      }

      .popup-modal-warning .popup-modal-icon {
        background: linear-gradient(135deg, #ed8936, #dd6b20);
      }

      .popup-modal-info .popup-modal-icon {
        background: linear-gradient(135deg, #4299e1, #3182ce);
      }

      .popup-modal-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #2d3748;
        flex: 1;
      }

      .popup-modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        color: #a0aec0;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }

      .popup-modal-close:hover {
        background: #edf2f7;
        color: #4a5568;
      }

      .popup-modal-body {
        padding: 0 20px 20px;
      }

      .popup-modal-message {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: #4a5568;
      }

      /* Border accent colors */
      .popup-modal-success {
        border-top: 4px solid #48bb78;
      }

      .popup-modal-error {
        border-top: 4px solid #f56565;
      }

      .popup-modal-warning {
        border-top: 4px solid #ed8936;
      }

      .popup-modal-info {
        border-top: 4px solid #4299e1;
      }

      /* Responsive design */
      @media (max-width: 480px) {
        .popup-modal {
          margin: 20px;
          min-width: auto;
        }
        
        .popup-modal-header {
          padding: 15px 15px 8px;
        }
        
        .popup-modal-body {
          padding: 0 15px 15px;
        }
        
        .popup-modal-title {
          font-size: 16px;
        }
        
        .popup-modal-icon {
          width: 35px;
          height: 35px;
          font-size: 18px;
        }
      }

      /* Animation improvements */
      @keyframes modalSlideIn {
        from {
          transform: scale(0.7) translateY(50px);
          opacity: 0;
        }
        to {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
      }

      .popup-modal-overlay.show .popup-modal {
        animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      /* Accessibility improvements */
      .popup-modal-overlay {
        role: dialog;
        aria-modal: true;
      }

      .popup-modal-close {
        aria-label: Close modal;
      }

      /* Focus management */
      .popup-modal:focus {
        outline: 2px solid #4299e1;
        outline-offset: 2px;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'popup-modal-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
}

// Create global instance
window.popupModal = new PopupModal();

// Convenience functions for different types
window.showSuccess = (message, title, options) => window.popupModal.show(message, 'success', title, options);
window.showError = (message, title, options) => window.popupModal.show(message, 'error', title, options);
window.showWarning = (message, title, options) => window.popupModal.show(message, 'warning', title, options);
window.showInfo = (message, title, options) => window.popupModal.show(message, 'info', title, options);
