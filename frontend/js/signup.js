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

// Signup functionality
document.addEventListener('DOMContentLoaded', () => {
  // Ensure auth system is loaded
  if (window.authSystem && window.authSystem.isLoggedIn()) {
    // Redirect if already logged in
    window.location.href = 'index.html';
    return;
  }

  // Add real-time password validation with inline error messages
  const passwordField = document.getElementById('password');
  const confirmPasswordField = document.getElementById('confirm');
  const emailField = document.getElementById('email');
  
  // Password validation function
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@#_-]/.test(password),
      noSpaces: !password.includes(' ')
    };
    
    return requirements;
  };
  
  // Show/hide error messages
  const showError = (elementId, message) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  };
  
  const hideError = (elementId) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  };
  
  // Update password requirements visual indicators
  const updateRequirements = (requirements) => {
    const reqElements = {
      'length-req': requirements.length,
      'uppercase-req': requirements.uppercase,
      'lowercase-req': requirements.lowercase,
      'number-req': requirements.number,
      'special-req': requirements.special
    };
    
    Object.entries(reqElements).forEach(([id, isValid]) => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.toggle('valid', isValid);
      }
    });
  };
  
  // Real-time validation for password
  if (passwordField) {
    passwordField.addEventListener('input', function(e) {
      let password = e.target.value;
      let passReqBox = document.getElementById('pass-req');
      if (passReqBox) {
        passReqBox.style.display = password ? 'block' : 'none';
      }
      // Remove spaces and show inline error if any were found
      if (password.includes(' ')) {
        password = password.replace(/\s/g, '');
        e.target.value = password;
        showError('password-error', 'Spaces are not allowed in passwords');
      } else {
        hideError('password-error');
      }
      
      // Validate password requirements
      const requirements = validatePassword(password);
      updateRequirements(requirements);
      
      // Check if all requirements are met
      const allValid = Object.values(requirements).every(req => req);
      if (password && !allValid) {
        const missingReqs = [];
        if (!requirements.length) missingReqs.push('8 characters');
        if (!requirements.uppercase) missingReqs.push('uppercase letter');
        if (!requirements.lowercase) missingReqs.push('lowercase letter');
        if (!requirements.number) missingReqs.push('number');
        if (!requirements.special) missingReqs.push('special character (@#_-)');
        
        if (missingReqs.length > 0) {
          showError('password-error', `Missing: ${missingReqs.join(', ')}`);
        }
      } else if (allValid) {
        hideError('password-error');
      }
    });
    
    passwordField.addEventListener('paste', function(e) {
      setTimeout(() => {
        if (e.target.value.includes(' ')) {
          e.target.value = e.target.value.replace(/\s/g, '');
          showError('password-error', 'Spaces have been removed from your password');
        }
      }, 10);
    });
  }
  
  // Real-time validation for confirm password
  if (confirmPasswordField) {
    confirmPasswordField.addEventListener('input', function(e) {
      let confirmPassword = e.target.value;
      
      // Remove spaces and show inline error
      if (confirmPassword.includes(' ')) {
        confirmPassword = confirmPassword.replace(/\s/g, '');
        e.target.value = confirmPassword;
        showError('confirm-error', 'Spaces are not allowed in passwords');
      } else if (passwordField.value && confirmPassword !== passwordField.value) {
        showError('confirm-error', 'Passwords do not match');
      } else {
        hideError('confirm-error');
      }
    });
    
    confirmPasswordField.addEventListener('paste', function(e) {
      setTimeout(() => {
        if (e.target.value.includes(' ')) {
          e.target.value = e.target.value.replace(/\s/g, '');
          showError('confirm-error', 'Spaces have been removed from your password');
        }
      }, 10);
    });
  }
  
  // Email validation
  if (emailField) {
    emailField.addEventListener('blur', function(e) {
      const email = e.target.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (email && !emailRegex.test(email)) {
        showError('email-error', 'Please enter a valid email address');
      } else {
        hideError('email-error');
      }
    });
  }

  // Account type selection
  const accountTypes = document.querySelectorAll('.account-types .option');
  let selectedAccountType = 'customer';

  accountTypes.forEach(option => {
    option.addEventListener('click', function() {
      accountTypes.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      selectedAccountType = this.getAttribute('data-type');
    });
  });

  // Form handler
  document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('first').value.trim();
    const lastName = document.getElementById('last').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm').value;

    // Comprehensive validation
    if (!firstName || !lastName || !email || !password) {
      showError('password-error', 'Please fill in all required fields');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('email-error', 'Please enter a valid email address');
      return;
    }

    // Strong password validation
    const passwordRequirements = validatePassword(password);
    if (!passwordRequirements.length) {
      showError('password-error', 'Password must be at least 8 characters long');
      return;
    }
    if (!passwordRequirements.uppercase) {
      showError('password-error', 'Password must contain at least one uppercase letter');
      return;
    }
    if (!passwordRequirements.lowercase) {
      showError('password-error', 'Password must contain at least one lowercase letter');
      return;
    }
    if (!passwordRequirements.number) {
      showError('password-error', 'Password must contain at least one number');
      return;
    }
    if (!passwordRequirements.special) {
      showError('password-error', 'Password must contain at least one special character (@#_-)');
      return;
    }
    if (!passwordRequirements.noSpaces) {
      showError('password-error', 'Password cannot contain spaces');
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      showError('confirm-error', 'Passwords do not match');
      return;
    }

    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Creating account...';
      submitBtn.disabled = true;

      // Simulate loading delay
      setTimeout(() => {
        try {
          const newUser = window.authSystem.register({
            firstName,
            lastName,
            email,
            password,
            accountType: selectedAccountType
          });
          
          // Success animation
          submitBtn.textContent = '✓ Account Created!';
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
          
          const form = document.getElementById('signupForm');
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
      popupModal.show(error.message, 'error', 'Registration Failed');
    }
  });

  // Google signup would be implemented here in a real application
  document.querySelector('.btn-google').addEventListener('click', () => {
    popupModal.show('Google sign-up integration not implimented yet', 'info', 'Google Sign-Up');
  });

  // Password toggle functionality
  const passwordToggles = document.querySelectorAll('.show-password-btn');
  
  passwordToggles.forEach((toggle, index) => {
    toggle.addEventListener('click', () => {
      // Find the password input in the same passwordBox container
      const passwordBox = toggle.closest('.passwordBox');
      const passwordInput = passwordBox.querySelector('input[type="password"], input[type="text"]');
      const eyeIcon = toggle.querySelector('.show-password-icon');
      
      if (passwordInput.type === 'password') {
        // Show password
        passwordInput.type = 'text';
        // Update icon to "hide" state (eye with slash)
        eyeIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.757 6.757m3.121 3.121l4.242 4.242m0 0L17.243 17.243m-3.121-3.121a3.003 3.003 0 01-4.243-4.243m4.243 4.243L6.757 6.757"/>
        `;
      } else {
        // Hide password
        passwordInput.type = 'password';
        // Update icon to "show" state (normal eye)
        eyeIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        `;
      }
    });
  });
});

// Add popup modal styles
const popupStyles = `
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

const signupStyleSheet = document.createElement('style');
signupStyleSheet.textContent = popupStyles;
document.head.appendChild(signupStyleSheet);