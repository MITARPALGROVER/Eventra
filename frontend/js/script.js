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

      // Availability form (demo)
      document.getElementById('availabilityForm').addEventListener('submit', (e)=>{
        e.preventDefault();
        const date = document.getElementById('date').value;
        const email = document.getElementById('email').value.trim();
        if(!date){ alert('Please choose your event date.'); return; }
        alert(`Thanks! We’ll check availability for ${date}${email ? ' and email you at ' + email : ''}.`);
      });

      // Example sign-in click (demo)
      document.getElementById('loginBtn').addEventListener('click', ()=>{
        alert('Sign-in flow goes here.');
      });