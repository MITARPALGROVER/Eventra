      // Initialize auth system when DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
        // Auth system should already be initialized
        if (window.authSystem) {
          window.authSystem.updateUIBasedOnAuth();
        }
      });

      // Mobile menu toggle (simple demo)
      const hamburger = document.getElementById('hamburger');
      const nav = document.querySelector('.menu');
      if(hamburger){
        hamburger.addEventListener('click', () => {
          nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
          nav.style.flexDirection = 'column';
          nav.style.gap = '14px';
          nav.style.position = 'absolute';
          nav.style.top = '68px';
          nav.style.left = '0';
          nav.style.right = '0';
          nav.style.background = 'rgba(255,255,255,.96)';
          nav.style.padding = '16px 20px';
          nav.style.borderBottom = '1px solid #ececf2';
        });
      }

    //   // Availability form (demo)
    //   document.getElementById('availabilityForm').addEventListener('submit', (e)=>{
    //     e.preventDefault();
    //     const date = document.getElementById('date').value;
    //     const email = document.getElementById('email').value.trim();
    //     if(!date){ alert('Please choose your event date.'); return; }
    //     alert(`Thanks! We’ll check availability for ${date}${email ? ' and email you at ' + email : ''}.`);
    //   });

      // Example sign-in click (demo)
      // Login/Signup buttons are now handled by auth system
      // document.getElementById('loginBtn').addEventListener('click', ()=>{
      //   window.location = "login.html";
      // });
      // document.getElementById('signupBtn').addEventListener('click', ()=>{
      //   window.location = "signup.html";
      // });

      // Scroll Animation Observer
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);

            document.getElementById('rentNow').addEventListener('click', ()=>{
        window.location = "categories.html";
      });


      // Observe all scroll sections
      document.addEventListener('DOMContentLoaded', () => {
        // Set up scroll animations
        const scrollSections = document.querySelectorAll('.scroll-section');
        scrollSections.forEach(section => {
          observer.observe(section);
        });
        
        // Set up event handlers for CTA buttons in new sections
        const ctaButtons = document.querySelectorAll('.cta-box .btn-primary');
        ctaButtons.forEach(button => {
          button.addEventListener('click', () => {
            window.location = "categories.html";
          });
        });
        
        const vendorButtons = document.querySelectorAll('.cta-box .btn-ghost, .cta-row .btn-ghost');
        vendorButtons.forEach(button => {
          button.addEventListener('click', () => {
            window.location = "vendor-signup.html";
          });
        });
      });