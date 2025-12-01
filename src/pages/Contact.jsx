import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Use the submitted data for debugging/analytics if needed
      // (keeps linter happy about the `data` parameter)
  console.log('Contact form submitted:', data);

      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.', {
        duration: 4000,
      });
      
      reset();
    } catch (err) {
  console.error(err);
      toast.error('Failed to send message. Please try again.', {
        duration: 4000,
      });
    }
  };

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <section className="section">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>
          Contact Us
        </h1>
        <p className="sub" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px' }}>
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '40px' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="John"
                    className={errors.firstName ? 'error' : ''}
                    {...register('firstName', {
                      required: 'First name is required',
                    })}
                  />
                  {errors.firstName && (
                    <div className="error-message show">{errors.firstName.message}</div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Doe"
                    className={errors.lastName ? 'error' : ''}
                    {...register('lastName', {
                      required: 'Last name is required',
                    })}
                  />
                  {errors.lastName && (
                    <div className="error-message show">{errors.lastName.message}</div>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  className={errors.email ? 'error' : ''}
                  {...register('email', {
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

              <div className="field">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="How can we help you?"
                  className={errors.subject ? 'error' : ''}
                  {...register('subject', {
                    required: 'Subject is required',
                  })}
                />
                {errors.subject && (
                  <div className="error-message show">{errors.subject.message}</div>
                )}
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                  className={errors.message ? 'error' : ''}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters',
                    },
                  })}
                />
                {errors.message && (
                  <div className="error-message show">{errors.message.message}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📧</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Email</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>support@eventra.com</p>
            </div>

            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📞</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Phone</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>+1 (555) 123-4567</p>
            </div>

            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📍</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Address</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>123 Event St, City, State</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
