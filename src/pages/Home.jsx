import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1522156373667-4c7234bbd804?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1400&auto=format&fit=crop"
  ];

  const plannerProfiles = [
    { name: "Aarav Sharma", image: "https://images.unsplash.com/photo-1618568221633-0a45dd10ecf7?q=80&w=400&auto=format&fit=crop" },
    { name: "Priya Patel", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60" },
    { name: "Arjun Singh", image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop" },
    { name: "Ananya Mehta", image: "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?q=80&w=400&auto=format&fit=crop" },
    { name: "Vivaan Reddy", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" },
    { name: "Diya Kapoor", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
    { name: "Vihaan Gupta", image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=400&auto=format&fit=crop" },
    { name: "Aanya Verma", image: "https://images.unsplash.com/photo-1564923630403-2284b87c0041?q=80&w=400&auto=format&fit=crop" },
    { name: "Reyansh Kumar", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" },
    { name: "Ishita Malhotra", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" }
  ];

  const reviews = [
    "Amazing service! Made our wedding sangeet stress-free.",
    "Highly recommend for any occasion, especially Diwali parties.",
    "The decor was beautiful with perfect blend of traditional and modern.",
    "Professional team that understands Indian events perfectly!",
    "Everything was perfect for our engagement ceremony.",
    "Great value and top-notch quality for our Holi celebration.",
    "Will book again for our next family function!",
    "Exceeded all expectations for our mehendi ceremony, truly magnificent!",
    "The catering for our Navratri event was outstanding.",
    "Best event planners for Indian festivities in the city!"
  ];

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(imageInterval);
  }, [heroImages.length]);

  useEffect(() => {
    const profileInterval = setInterval(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % plannerProfiles.length);
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 7000);

    return () => clearInterval(profileInterval);
  }, [plannerProfiles.length, reviews.length]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollElements = document.querySelectorAll('.scroll-section');
      scrollElements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          el.classList.add('animate-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">
              Premium Event Rentals <span className="accent-pill">↗</span>
            </span>
            <h1>Turn Your Event<br />Into Memories</h1>
            <p className="sub">
              Rent elegant <b>furniture</b>, professional <b>sound systems</b>,
              dazzling <b>lighting</b>, premium <b>decor</b>, and reliable
              <b> catering equipment</b>—all in one place.
            </p>

            <div className="cta-row">
              <button 
                className="btn btn-primary btn-lg" 
                onClick={() => navigate('/categories')}
              >
                Browse catalog
              </button>
              <button className="btn btn-ghost btn-lg">Become a Vendor</button>
            </div>

            <div className="stats">
              <div className="stat">
                <div className="big">500+</div>
                <div className="muted">Events Served</div>
              </div>
              <div className="stat">
                <div className="big">120+</div>
                <div className="muted">Rental Products</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-container glass-card hero-card">
              <div className="hero-image-slider">
                {heroImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Event Hero ${index + 1}`}
                    style={{ display: index === currentImageIndex ? 'block' : 'none' }}
                  />
                ))}
              </div>
            </div>
            <div className="glass-card planner-card">
              <img
                src={plannerProfiles[currentProfileIndex].image}
                alt="Profile"
              />
              <div className="planner-content">
                <div className="planner-title">{plannerProfiles[currentProfileIndex].name}</div>
                <div className="planner-stars">★ ★ ★ ★ ★</div>
                <div className="planner-review">{reviews[currentReviewIndex]}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM CATEGORIES */}
      <section className="section container scroll-section scroll-animate" id="categories">
        <h2>Premium Categories</h2>
        <div className="cards">
          <article className="card" onClick={() => navigate('/category/furniture')}>
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop"
              alt="Furniture"
            />
            <div className="body">
              <h3>Furniture</h3>
              <p>Elegant seating, tables, and staging.</p>
            </div>
          </article>

          <article className="card" onClick={() => navigate('/category/decor')}>
            <img
              src="https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80&auto=format&fit=crop"
              alt="Decor"
            />
            <div className="body">
              <h3>Décor</h3>
              <p>Backdrops, centerpieces, and accents.</p>
            </div>
          </article>

          <article className="card" onClick={() => navigate('/category/lighting')}>
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1400&auto=format&fit=crop"
              alt="Lighting"
            />
            <div className="body">
              <h3>Lighting</h3>
              <p>Ambience, stage, and spotlight kits.</p>
            </div>
          </article>

          <article className="card" onClick={() => navigate('/category/appliances')}>
            <img
              src="https://plus.unsplash.com/premium_photo-1673439305380-79947d273735?q=80&w=687&auto=format&fit=crop"
              alt="Catering"
            />
            <div className="body">
              <h3>Event Electric Appliances</h3>
              <p>Reliable appliances and event essentials.</p>
            </div>
          </article>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section scroll-section scroll-animate" id="testimonials">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div className="testimonials">
            <div className="testimonial">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Eventra made organizing my daughter's wedding so much easier. The
                quality of their furniture and decor items exceeded our
                expectations."
              </p>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>Wedding Planner</span>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "As a vendor, joining Eventra has boosted my business
                significantly. Their platform makes it simple to showcase my
                inventory and manage bookings."
              </p>
              <div className="testimonial-author">
                <strong>Michael Rodriguez</strong>
                <span>Sound Equipment Vendor</span>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The variety of options and the ease of booking made Eventra our
                go-to for corporate events. Their customer service is
                outstanding."
              </p>
              <div className="testimonial-author">
                <strong>Emily Chen</strong>
                <span>Corporate Event Coordinator</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section container scroll-section scroll-animate" id="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          <details className="faq-item">
            <summary>How does the rental process work?</summary>
            <p>
              Browse our catalog, select the items you need, choose your rental
              dates, and complete your booking. We'll confirm availability and
              handle delivery and setup at your event location on the agreed date.
            </p>
          </details>

          <details className="faq-item">
            <summary>What is your cancellation policy?</summary>
            <p>
              Cancellations made 7+ days before the event receive a full refund.
              Cancellations 3-6 days before receive a 50% refund. Cancellations
              less than 72 hours before the event are non-refundable.
            </p>
          </details>

          <details className="faq-item">
            <summary>Do you offer delivery and setup services?</summary>
            <p>
              Yes, we offer delivery and professional setup for all orders.
              Delivery fees depend on your location and the size of your order.
              Setup and teardown services are included for larger orders.
            </p>
          </details>

          <details className="faq-item">
            <summary>How do I become a vendor on Eventra?</summary>
            <p>
              Click on "Become a Vendor" and complete our application form. Our
              team will review your submission and contact you within 2-3 business
              days to discuss the next steps and onboarding process.
            </p>
          </details>

          <details className="faq-item">
            <summary>What happens if equipment is damaged?</summary>
            <p>
              All rentals include standard insurance. Minor wear and tear is
              expected, but significant damage will be assessed after the event.
              Customers are responsible for costs beyond normal wear and tear.
            </p>
          </details>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section container scroll-section scroll-animate">
        <div className="cta-box">
          <h2>Ready to Create Unforgettable Events?</h2>
          <p>
            Join thousands of event planners and vendors who trust Eventra for
            their needs.
          </p>
          <div className="cta-buttons">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/categories')}
            >
              Browse Catalog
            </button>
            <button className="btn btn-ghost btn-lg">Become a Vendor</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
