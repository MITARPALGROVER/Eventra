// Signup functionality
document.addEventListener('DOMContentLoaded', () => {
  // Ensure auth system is loaded
  if (window.authSystem && window.authSystem.isLoggedIn()) {
    // Redirect if already logged in
    window.location.href = 'index.html';
    return;
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

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      alert('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
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
      alert(error.message);
    }
  });

  // Google signup would be implemented here in a real application
  document.querySelector('.btn-google').addEventListener('click', () => {
    alert('Google sign up would be integrated here in a production environment');
  });
});