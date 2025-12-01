import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const currentUser = useAuthStore((state) => state.currentUser);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Validate email format
      if (!validateEmail(data.email)) {
        setError('email', {
          type: 'manual',
          message: 'Please enter a valid email address',
        });
        setIsLoading(false);
        return;
      }

      // Check for spaces in password
      if (data.password.includes(' ')) {
        setError('password', {
          type: 'manual',
          message: 'Password cannot contain spaces',
        });
        setIsLoading(false);
        return;
      }

      // Simulate loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Attempt login
      const user = login(data.email, data.password);

      // Success
      toast.success(`Welcome back, ${user.name}!`, {
        icon: '👋',
        duration: 3000,
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || 'Login failed. Please try again.', {
        duration: 4000,
      });
      
      // Set form errors
      setError('email', {
        type: 'manual',
        message: error.message,
      });
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google sign-in not implemented yet', {
      duration: 3000,
    });
  };

  return (
    <div className="login-page">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Login Card */}
      <div className="card auth-card">
        {/* Logo */}
        <div className="logo">
          <h2>Eventra</h2>
        </div>

        <h1>Welcome Back</h1>
        <p className="sub">Sign in to your Eventra account</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
              {...register('email', {
                required: 'Email is required',
                validate: (value) =>
                  validateEmail(value) || 'Please enter a valid email address',
              })}
            />
            {errors.email && (
              <div className="error-message show">{errors.email.message}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="passwordBox">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  validate: (value) =>
                    !value.includes(' ') || 'Password cannot contain spaces',
                })}
                onPaste={(e) => {
                  setTimeout(() => {
                    const input = e.target;
                    if (input.value.includes(' ')) {
                      input.value = input.value.replace(/\s/g, '');
                      toast.error('Spaces have been removed from your password');
                    }
                  }, 10);
                }}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <div className="error-message show">{errors.password.message}</div>
            )}
          </div>

          {/* Options */}
          <div className="options">
            <label>
              <input type="checkbox" id="rememberMe" />
              Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">OR CONTINUE WITH</div>

        {/* Google Button */}
        <button className="btn-google" onClick={handleGoogleLogin}>
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            style={{ width: '20px', height: '20px' }}
          />
          Continue with Google
        </button>

        {/* Footer Links */}
        <div className="footer-links">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
