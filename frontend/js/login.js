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
      alert('Please fill in all fields');
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
      alert(error.message);
    }
  });

  // Google button (demo)
  document.querySelector('.btn-google').addEventListener('click', () => {
    alert('Google sign-in flow goes here.');
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
`;

const loginStyleSheet = document.createElement('style');
loginStyleSheet.textContent = errorStyles;
document.head.appendChild(loginStyleSheet);