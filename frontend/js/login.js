  // Form handler demo
  document.getElementById('loginForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    alert(`Welcome back, ${email}! (demo only)`);
  });

  // Google button (demo)
  document.querySelector('.btn-google').addEventListener('click',()=>{
    alert('Google sign-in flow goes here.');
  });