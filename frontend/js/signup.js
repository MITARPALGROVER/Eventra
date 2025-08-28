  // Account type toggle
  document.querySelectorAll('.option').forEach(opt=>{
    opt.addEventListener('click',()=>{
      document.querySelectorAll('.option').forEach(o=>o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Form handler demo
  document.getElementById('signupForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    const first = document.getElementById('first').value;
    const last = document.getElementById('last').value;
    alert(`Welcome ${first} ${last}! (demo only)`);
  });

  // Google button (demo)
  document.querySelector('.btn-google').addEventListener('click',()=>{
    alert('Google sign-in flow goes here.');
  });