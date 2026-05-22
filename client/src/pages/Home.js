import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';

/* ── Testimonials data ───────────────────────────────────── */
const testimonials = [
  {
    id: 1,
    name: 'Sarah & James Wilson',
    history: 'Bought a home in Beverly Hills',
    quote: 'EliteHomes made our dream of owning a luxury home a reality. Their agents were incredibly knowledgeable and patient throughout the entire process.',
    img: 'https://i.pravatar.cc/65?img=49',
  },
  {
    id: 2,
    name: 'Michael Chen',
    history: 'Sold condo in Manhattan',
    quote: 'I sold my Manhattan condo 15% above asking price thanks to EliteHomes professional marketing. Couldn\'t be more satisfied with the result.',
    img: 'https://i.pravatar.cc/65?img=12',
  },
  {
    id: 3,
    name: 'Amanda Foster',
    history: 'Investment portfolio, Miami',
    quote: 'As a real estate investor, I need reliable data and expert guidance. EliteHomes provides exactly that — my portfolio has grown 22% this year alone.',
    img: 'https://i.pravatar.cc/65?img=47',
  },
];

/* ── FAQ data ────────────────────────────────────────────── */
const faqs = [
  { q: 'How do I start the home buying process?', a: 'Begin by getting pre-approved for a mortgage to understand your budget. Then work with one of our agents to define your needs and search our listings.' },
  { q: 'What are the additional costs when buying a home?', a: 'Expect closing costs (2–5% of the purchase price), home inspection fees, property taxes, homeowners insurance, and potential HOA fees.' },
  { q: 'How long does the home selling process take?', a: 'On average our listings sell within 21 days. Factors like location, pricing, and market conditions can affect the timeline.' },
  { q: 'Do you offer property management services?', a: 'Yes! Our property management team handles tenant screening, rent collection, maintenance coordination, and full financial reporting.' },
  { q: 'What areas do you serve?', a: 'We operate in major metropolitan areas across the United States including Beverly Hills, New York, Miami, Austin, and San Francisco.' },
];

export default function Home() {
  const navigate  = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);

  /* Search form state */
  const [search, setSearch] = useState({
    city: '', type: '', minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', minSqft: '', maxSqft: '',
  });
  const [searchErrors, setSearchErrors] = useState({});

  useEffect(() => {
    fetch('/api/properties?limit=3')
      .then(r => r.json())
      .then(d => { if (d.success) setFeatured(d.data.slice(0, 3)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleSearchChange(e) {
    const { id, value } = e.target;
    setSearch(prev => ({ ...prev, [id]: value }));
    if (searchErrors[id]) setSearchErrors(prev => ({ ...prev, [id]: '' }));
  }

  function handleSearch() {
    const errors = {};
    if (search.minPrice && isNaN(Number(search.minPrice))) errors.minPrice = 'Must be a number';
    if (search.maxPrice && isNaN(Number(search.maxPrice))) errors.maxPrice = 'Must be a number';
    if (search.minPrice && search.maxPrice && Number(search.minPrice) > Number(search.maxPrice))
      errors.maxPrice = 'Max must be ≥ Min';
    if (Object.keys(errors).length) { setSearchErrors(errors); return; }

    const params = new URLSearchParams();
    Object.entries(search).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/properties?${params.toString()}`);
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="home pb-5" id="home">
        <div className="container">
          <div className="row justify-content-center text-center pt-5">
            <div className="col-xl-8 col-10">
              <h1 className="text-white">Find Your Dream Home</h1>
              <p className="mt-2 mb-5 text-white fs-5">
                Discover exceptional properties in prime locations. From modern condos
                <br className="d-none d-md-block" /> to luxury estates, we help you find the perfect place to call home.
              </p>

              {/* Search Form */}
              <div className="row bg-white rounded-4 p-3 gy-3 text-start">
                {/* Location */}
                <div className="col-xl-6 col-12">
                  <label htmlFor="city">Location</label>
                  <div className="input-group rounded-3 p-2 mt-1">
                    <span className="input-group-text bg-transparent border-0">
                      <i className="fa-solid fa-location-dot text-muted"></i>
                    </span>
                    <input
                      type="text" id="city" value={search.city} onChange={handleSearchChange}
                      className="form-control rounded-2 border-0 shadow-none"
                      placeholder="Enter city, neighborhood, or ZIP code"
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="col-xl-3 col-12">
                  <label htmlFor="type">Property Type</label>
                  <div className="input-group rounded-3 p-2 mt-1">
                    <select id="type" value={search.type} onChange={handleSearchChange} className="form-select border-0 shadow-none">
                      <option value="">All Types</option>
                      <option>House</option><option>Apartment</option><option>Condo</option><option>Townhouse</option>
                    </select>
                  </div>
                </div>

                {/* Price Range */}
                <div className="col-xl-3 col-12">
                  <label htmlFor="maxPrice">Max Price</label>
                  <div className={`input-group rounded-3 p-2 mt-1 ${searchErrors.maxPrice ? 'border-danger' : ''}`}>
                    <span className="input-group-text bg-transparent border-0 text-muted">$</span>
                    <input
                      type="number" id="maxPrice" value={search.maxPrice} onChange={handleSearchChange}
                      className="form-control border-0 shadow-none" placeholder="Any"
                    />
                  </div>
                  {searchErrors.maxPrice && <div className="text-danger small">{searchErrors.maxPrice}</div>}
                </div>

                {/* Bedrooms */}
                <div className="col-xl-3 col-12">
                  <label htmlFor="bedrooms">Bedrooms</label>
                  <div className="input-group rounded-3 p-2 mt-1">
                    <select id="bedrooms" value={search.bedrooms} onChange={handleSearchChange} className="form-select border-0 shadow-none">
                      <option value="">Any</option>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
                    </select>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="col-xl-3 col-12">
                  <label htmlFor="bathrooms">Bathrooms</label>
                  <div className="input-group rounded-3 p-2 mt-1">
                    <select id="bathrooms" value={search.bathrooms} onChange={handleSearchChange} className="form-select border-0 shadow-none">
                      <option value="">Any</option>
                      {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
                    </select>
                  </div>
                </div>

                {/* Min Sqft */}
                <div className="col-xl-3 col-12">
                  <label htmlFor="minSqft">Min Sq Ft</label>
                  <div className="input-group rounded-3 p-2 mt-1">
                    <input type="number" id="minSqft" value={search.minSqft} onChange={handleSearchChange}
                      className="form-control shadow-none border-0" placeholder="1,000" />
                  </div>
                </div>

                {/* Max Sqft */}
                <div className="col-xl-3 col-12">
                  <label htmlFor="maxSqft">Max Sq Ft</label>
                  <div className="input-group rounded-3 p-2 mt-1">
                    <input type="number" id="maxSqft" value={search.maxSqft} onChange={handleSearchChange}
                      className="form-control shadow-none border-0" placeholder="5,000" />
                  </div>
                </div>

                <div className="col-12">
                  <button className="btn w-100 p-3 fw-semibold search" onClick={handleSearch}>
                    <i className="fa-solid fa-magnifying-glass me-2"></i> Search Properties
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="row pt-5 gy-3">
                {[
                  { val: '15,000+', label: 'Active Listings' },
                  { val: '98%',     label: 'Client Satisfaction' },
                  { val: '500+',    label: 'Expert Agents' },
                  { val: '25',      label: 'Years Experience' },
                ].map(s => (
                  <div className="col-xl-3 col-6" key={s.label}>
                    <div className="num text-white">
                      <h2 className="fw-semibold">{s.val}</h2>
                      <span className="text-white-50">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Properties ────────────────────────────── */}
      <section className="properties pt-5 bg-body-tertiary" id="properties">
        <div className="container">
          <div className="header d-flex flex-column align-items-center justify-content-center p-4 mb-5">
            <h3 className="rounded-pill px-3 py-2 border-1 border text-uppercase text-center fw-semibold">
              Premium Collection
            </h3>
            <h2 className="p-3">Featured Properties</h2>
            <span className="fs-5 text-muted text-center">
              Discover our handpicked selection of premium properties in the most desirable locations
            </span>
          </div>

          <div className="row row-cols-1 row-cols-xl-3 gx-4 gy-5 justify-content-center">
            {loading
              ? [1,2,3].map(i => (
                  <div className="col" key={i}>
                    <div className="skeleton" style={{ height: 380 }}></div>
                  </div>
                ))
              : featured.map(p => (
                  <div className="col" key={p._id}>
                    <PropertyCard property={p} />
                  </div>
                ))
            }
          </div>

          <div className="text-center mt-5 pb-5">
            <button className="btn btn-grad rounded-3 fw-semibold" onClick={() => navigate('/properties')}>
              View All Properties <i className="fa-solid fa-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────── */}
      <section className="services pt-5 pb-5" id="services">
        <div className="container">
          <div className="header d-flex flex-column align-items-center justify-content-center p-4 mb-4">
            <h3 className="rounded-pill px-3 py-2 border-1 border text-uppercase text-center fw-semibold">
              What We Offer
            </h3>
            <h2 className="p-3">Our Services</h2>
          </div>

          <ul className="nav nav-tabs justify-content-center mb-4 border-0 gap-2" id="servicesTab">
            {[
              { id: 'buying',    label: 'Buying' },
              { id: 'selling',   label: 'Selling' },
              { id: 'renting',   label: 'Renting' },
              { id: 'investing', label: 'Investing' },
            ].map((tab, i) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link${i === 0 ? ' active' : ''} rounded-3`}
                  data-bs-toggle="tab"
                  data-bs-target={`#${tab.id}-pane`}
                  type="button"
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="tab-content">
            {/* Buying tab */}
            <div className="tab-pane fade show active" id="buying-pane">
              <div className="row row-cols-1 row-cols-lg-2 gy-5 align-items-center">
                <div className="col">
                  <h3 className="fw-bold">Find Your Perfect Home</h3>
                  <p className="services-p my-4">Expert guidance through every step of the home buying journey, from search to closing.</p>
                  <div className="benefits d-flex flex-column gap-4">
                    {[
                      { icon: 'fa-search', title: 'Personalized Search', desc: 'Tailored property recommendations based on your preferences and budget.' },
                      { icon: 'fa-handshake', title: 'Expert Negotiation', desc: 'Skilled negotiators working to get you the best possible deal.' },
                      { icon: 'fa-file-contract', title: 'Seamless Closing', desc: 'We handle all the paperwork and legal requirements for a smooth closing.' },
                    ].map(b => (
                      <div className="benefit d-flex align-items-start gap-4" key={b.title}>
                        <span className="rounded-3 icon p-3"><i className={`fa-solid ${b.icon}`}></i></span>
                        <div>
                          <h4 className="fs-5 fw-semibold">{b.title}</h4>
                          <p className="text-muted mb-0">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-start mt-4 rounded-3 text-white fw-semibold">Start Your Search</button>
                </div>
                <div className="col">
                  <div className="position-relative">
                    <div className="img-container rounded-4 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="buying" className="rounded-4 w-100" />
                    </div>
                    <div className="img-badge position-absolute px-4 py-3 rounded-3 bg-white shadow">
                      <span className="fs-4 fw-bold">500+</span><br />
                      <p className="m-0">Happy Buyers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selling tab */}
            <div className="tab-pane fade" id="selling-pane">
              <div className="row row-cols-1 row-cols-lg-2 gy-5 align-items-center">
                <div className="col">
                  <h3 className="fw-bold">Maximize Your Sale Price</h3>
                  <p className="services-p my-4">Professional marketing and expert negotiation to sell your home fast and for top dollar.</p>
                  <div className="benefits d-flex flex-column gap-4">
                    {[
                      { icon: 'fa-camera', cls: 'icon-2', title: 'Professional Marketing', desc: 'High-quality photography, virtual tours, and multi-channel campaigns.' },
                      { icon: 'fa-users',  cls: 'icon-2', title: 'Buyer Screening',        desc: 'We pre-qualify buyers for smooth and serious transactions.' },
                    ].map(b => (
                      <div className="benefit d-flex align-items-start gap-4" key={b.title}>
                        <span className={`rounded-3 icon ${b.cls} p-3`}><i className={`fa-solid ${b.icon}`}></i></span>
                        <div>
                          <h4 className="fs-5 fw-semibold">{b.title}</h4>
                          <p className="text-muted mb-0">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-start mt-4 rounded-3 text-white fw-semibold green-bg">Get Home Valuation</button>
                </div>
                <div className="col">
                  <div className="position-relative">
                    <div className="img-container rounded-4 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80" alt="selling" className="rounded-4 w-100" />
                    </div>
                    <div className="img-badge-2 position-absolute px-4 py-3 rounded-3 bg-white shadow">
                      <span className="fs-4 fw-bold">21 days</span><br />
                      <p className="m-0">Avg. Time to Sell</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Renting tab */}
            <div className="tab-pane fade" id="renting-pane">
              <div className="row row-cols-1 row-cols-lg-2 gy-5 align-items-center">
                <div className="col">
                  <h3 className="fw-bold">Premium Rental Properties</h3>
                  <p className="services-p my-4">Find your perfect rental home with our extensive portfolio and personalised service.</p>
                  <div className="benefits d-flex flex-column gap-4">
                    {[
                      { icon: 'fa-map-location-dot', cls: 'icon-3', title: 'Prime Locations',    desc: 'Rentals in the most desirable neighbourhoods.' },
                      { icon: 'fa-shield-halved',     cls: 'icon-3', title: 'Verified Properties', desc: 'Thoroughly inspected and verified for quality.' },
                      { icon: 'fa-tools',             cls: 'icon-3', title: '24/7 Support',        desc: 'Round-the-clock maintenance and tenant support.' },
                    ].map(b => (
                      <div className="benefit d-flex align-items-start gap-4" key={b.title}>
                        <span className={`rounded-3 icon ${b.cls} p-3`}><i className={`fa-solid ${b.icon}`}></i></span>
                        <div>
                          <h4 className="fs-5 fw-semibold">{b.title}</h4>
                          <p className="text-muted mb-0">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-start mt-4 rounded-3 text-white fw-semibold purple-bg">Browse Rentals</button>
                </div>
                <div className="col">
                  <div className="position-relative">
                    <div className="img-container rounded-4 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" alt="renting" className="rounded-4 w-100" />
                    </div>
                    <div className="img-badge-3 position-absolute px-4 py-3 rounded-3 bg-white shadow">
                      <span className="fs-4 fw-bold">5,000+</span><br />
                      <p className="m-0">Available Rentals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investing tab */}
            <div className="tab-pane fade" id="investing-pane">
              <div className="row row-cols-1 row-cols-lg-2 gy-5 align-items-center">
                <div className="col">
                  <h3 className="fw-bold">Real Estate Investment</h3>
                  <p className="services-p my-4">Build wealth through strategic real estate investments with expert guidance.</p>
                  <div className="benefits d-flex flex-column gap-4">
                    {[
                      { icon: 'fa-chart-pie',       cls: 'icon-4', title: 'Portfolio Analysis',   desc: 'Comprehensive analysis and portfolio optimisation.' },
                      { icon: 'fa-money-bill-wave', cls: 'icon-4', title: 'ROI Projections',       desc: 'Detailed return on investment calculations.' },
                      { icon: 'fa-gear',            cls: 'icon-4', title: 'Property Management',   desc: 'Full-service management for hands-off investing.' },
                    ].map(b => (
                      <div className="benefit d-flex align-items-start gap-4" key={b.title}>
                        <span className={`rounded-3 icon ${b.cls} p-3`}><i className={`fa-solid ${b.icon}`}></i></span>
                        <div>
                          <h4 className="fs-5 fw-semibold">{b.title}</h4>
                          <p className="text-muted mb-0">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-start mt-4 rounded-3 text-white fw-semibold yellow-bg">Explore Investments</button>
                </div>
                <div className="col">
                  <div className="position-relative">
                    <div className="img-container rounded-4 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80" alt="investing" className="rounded-4 w-100" />
                    </div>
                    <div className="img-badge-4 position-absolute px-4 py-3 rounded-3 bg-white shadow">
                      <span className="fs-4 fw-bold">15%</span><br />
                      <p className="m-0">Avg. Annual ROI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="testimonials pt-5 pb-5" id="testimonials">
        <div className="container">
          <div className="header d-flex flex-column align-items-center justify-content-center p-4 mb-5">
            <h3 className="rounded-pill px-3 py-2 border-1 border text-uppercase text-center fw-semibold text-warning">
              Client Stories
            </h3>
            <h2 className="p-3 text-white">What Our Clients Say</h2>
          </div>

          <div id="testimonialsCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
            <div className="carousel-inner">
              {testimonials.map((t, i) => (
                <div className={`carousel-item${i === 0 ? ' active' : ''}`} key={t.id}>
                  <div className="client text-center px-4">
                    <div className="yellow-stars mb-3">
                      {[...Array(5)].map((_, s) => <i key={s} className="fa-solid fa-star"></i>)}
                    </div>
                    <blockquote className="text-white px-md-5">"{t.quote}"</blockquote>
                    <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                      <img src={t.img} alt={t.name} className="w-img rounded-circle" />
                      <div className="client-details text-start">
                        <h4 className="text-white mb-0">{t.name}</h4>
                        <span className="history text-white-50">{t.history}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="carousel-indicators">
              {testimonials.map((_, i) => (
                <button
                  key={i} type="button"
                  data-bs-target="#testimonialsCarousel"
                  data-bs-slide-to={i}
                  className={i === 0 ? 'active' : ''}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="faq pt-5 pb-5 bg-body-tertiary" id="faq">
        <div className="container">
          <div className="header d-flex flex-column align-items-center justify-content-center p-4 mb-4">
            <h3 className="rounded-pill px-3 py-2 border-1 border text-uppercase text-center fw-semibold">
              FAQ
            </h3>
            <h2 className="p-3">Frequently Asked Questions</h2>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, i) => (
                  <div className="accordion-item border-0 mb-3 rounded-3 overflow-hidden shadow-sm" key={i}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button fw-semibold${i !== 0 ? ' collapsed' : ''}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq-${i}`}
                      >
                        {faq.q}
                      </button>
                    </h2>
                    <div id={`faq-${i}`} className={`accordion-collapse collapse${i === 0 ? ' show' : ''}`} data-bs-parent="#faqAccordion">
                      <div className="accordion-body text-muted">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
