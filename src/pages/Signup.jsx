import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const Signup = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState('customer');

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  const password = watch('password');

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@#_-]/.test(password),
      noSpaces: !password.includes(' ')
    };
  };

  const passwordValidation = password ? validatePassword(password) : null;

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match',
        });
        setIsLoading(false);
        return;
      }

      // Check password requirements
      const validation = validatePassword(data.password);
      if (!Object.values(validation).every(v => v)) {
        setError('password', {
          type: 'manual',
          message: 'Password does not meet all requirements',
        });
        setIsLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      const userData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        accountType: accountType
      };

      register(userData);

      toast.success('Account created successfully!', {
        icon: '🎉',
        duration: 3000,
      });

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || 'Registration failed. Please try again.', {
        duration: 4000,
      });
    }
  };

  const handleGoogleSignup = () => {
    toast.info('Google sign-up not implemented yet', {
      duration: 3000,
    });
  };

  return (
    <div className="login-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="card auth-card">
        <div className="logo">
          <h2>Eventra</h2>
        </div>

        <h1>Create Account</h1>
        <p className="sub">Join Eventra and start planning amazing events</p>

        {/* Account Type Toggle */}
        <div className="account-types" style={{ marginBottom: '20px' }}>
          <button
            type="button"
            className={`account-type-btn ${accountType === 'customer' ? 'active' : ''}`}
            onClick={() => setAccountType('customer')}
            style={{
              flex: 1,
              padding: '12px',
              border: `2px solid ${accountType === 'customer' ? 'var(--primary)' : '#ddd'}`,
              background: accountType === 'customer' ? 'var(--primary)' : '#fff',
              color: accountType === 'customer' ? 'var(--primary-ink)' : '#111',
              borderRadius: '8px 0 0 8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Customer
          </button>
          <button
            type="button"
            className={`account-type-btn ${accountType === 'vendor' ? 'active' : ''}`}
            onClick={() => setAccountType('vendor')}
            style={{
              flex: 1,
              padding: '12px',
              border: `2px solid ${accountType === 'vendor' ? 'var(--primary)' : '#ddd'}`,
              background: accountType === 'vendor' ? 'var(--primary)' : '#fff',
              color: accountType === 'vendor' ? 'var(--primary-ink)' : '#111',
              borderRadius: '0 8px 8px 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Vendor
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="First name"
                className={errors.firstName ? 'error' : ''}
                {...registerField('firstName', {
                  required: 'First name is required',
                })}
              />
              {errors.firstName && (
                <div className="error-message show">{errors.firstName.message}</div>
              )}
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Last name"
                className={errors.lastName ? 'error' : ''}
                {...registerField('lastName', {
                  required: 'Last name is required',
                })}
              />
              {errors.lastName && (
                <div className="error-message show">{errors.lastName.message}</div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
              {...registerField('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
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
                placeholder="Create a password"
                className={errors.password ? 'error' : ''}
                {...registerField('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <div className="error-message show">{errors.password.message}</div>
            )}
          </div>

          {/* Password Requirements */}
          {passwordValidation && (
            <div style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: '#444' }}>
                Password must contain:
              </div>
              <div style={{ display: 'grid', gap: '4px' }}>
                <div style={{ color: passwordValidation.length ? '#10b981' : '#6b7280' }}>
                  {passwordValidation.length ? '✓' : '○'} At least 8 characters
                </div>
                <div style={{ color: passwordValidation.uppercase ? '#10b981' : '#6b7280' }}>
                  {passwordValidation.uppercase ? '✓' : '○'} One uppercase letter
                </div>
                <div style={{ color: passwordValidation.lowercase ? '#10b981' : '#6b7280' }}>
                  {passwordValidation.lowercase ? '✓' : '○'} One lowercase letter
                </div>
                <div style={{ color: passwordValidation.number ? '#10b981' : '#6b7280' }}>
                  {passwordValidation.number ? '✓' : '○'} One number
                </div>
                <div style={{ color: passwordValidation.special ? '#10b981' : '#6b7280' }}>
                  {passwordValidation.special ? '✓' : '○'} One special character (@, #, _, -)
                </div>
                <div style={{ color: passwordValidation.noSpaces ? '#10b981' : '#6b7280' }}>
                  {passwordValidation.noSpaces ? '✓' : '○'} No spaces
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="passwordBox">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
                {...registerField('confirmPassword', {
                  required: 'Please confirm your password',
                })}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message show">{errors.confirmPassword.message}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="divider">OR CONTINUE WITH</div>

        <button className="btn-google" onClick={handleGoogleSignup}>
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            style={{ width: '20px', height: '20px' }}
          />
          Continue with Google
        </button>

        <div className="footer-links">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
