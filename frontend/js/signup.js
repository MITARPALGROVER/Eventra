// Import auth system
document.addEventListener('DOMContentLoaded', () => {
  // Ensure auth system is loaded
  if (window.authSystem && window.authSystem.isLoggedIn()) {
    // Redirect if already logged in
    window.location.href = 'index.html';
    return;
  }
});

  // Account type toggle
  document.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Form handler demo
  document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('first').value.trim();
    const lastName = document.getElementById('last').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm').value;
    const accountType = document.querySelector('.option.active').dataset.type;
    const agreeTerms = document.querySelector('input[type="checkbox"][required]').checked;
  });

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert('Please fill in all required fields');
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
      return;
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    }
    if (!agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
  // Google button (demo)
    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Creating account...';
      submitBtn.disabled = true;
  document.querySelector('.btn-google').addEventListener('click', () => {
      // Simulate loading delay
      setTimeout(() => {

// Add error message styles (same as login)
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
`;

const signupStyleSheet = document.createElement('style');
signupStyleSheet.textContent = errorStyles;
document.head.appendChild(signupStyleSheet);
        try {
          const userData = {
            firstName,
            lastName,
            email,
            password,
            accountType
          };
    alert('Google sign-in flow goes here.');
          const user = window.authSystem.register(userData);
          
          // Success animation
          submitBtn.textContent = '✓ Account created!';
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
      }, 1000);
      
    } catch (error) {
      alert(error.message);
    }
  });