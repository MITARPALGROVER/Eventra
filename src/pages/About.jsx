const About = () => {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <section className="section">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>
          About Eventra
        </h1>
        <p className="sub" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          Your trusted partner for premium event rentals
        </p>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '40px', marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Our Story</h2>
            <p style={{ lineHeight: '1.8', color: '#444', marginBottom: '20px' }}>
              Eventra was founded with a simple mission: to make event planning easier and more accessible
              for everyone. We understand that creating memorable events requires the right equipment,
              reliable service, and attention to detail.
            </p>
            <p style={{ lineHeight: '1.8', color: '#444' }}>
              From small gatherings to large corporate events, we provide premium rental equipment
              and exceptional service to ensure your event is a success.
            </p>
          </div>

          <div className="card" style={{ padding: '40px', marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>What We Offer</h2>
            <ul style={{ lineHeight: '2', color: '#444', paddingLeft: '20px' }}>
              <li>Premium furniture rentals for any occasion</li>
              <li>Professional sound systems and audio equipment</li>
              <li>Stunning lighting solutions</li>
              <li>Beautiful décor and accessories</li>
              <li>Reliable catering equipment</li>
              <li>Delivery, setup, and teardown services</li>
            </ul>
          </div>

          <div className="card" style={{ padding: '40px' }}>
            <h2 style={{ marginBottom: '20px' }}>Why Choose Eventra?</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Quality Equipment</h3>
                <p style={{ color: '#444', lineHeight: '1.6' }}>
                  All our rental items are maintained to the highest standards
                </p>
              </div>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Flexible Rental Periods</h3>
                <p style={{ color: '#444', lineHeight: '1.6' }}>
                  Rent for a day, a week, or longer - we're flexible to your needs
                </p>
              </div>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Professional Service</h3>
                <p style={{ color: '#444', lineHeight: '1.6' }}>
                  Our team ensures timely delivery and expert setup
                </p>
              </div>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Competitive Pricing</h3>
                <p style={{ color: '#444', lineHeight: '1.6' }}>
                  Get premium quality at affordable rates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
