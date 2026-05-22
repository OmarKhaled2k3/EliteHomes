import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TourModal from '../components/TourModal';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80';

const STATUS_CLASSES = {
  'Featured':    '',
  'New Listing': 'new-badge',
  'Price Drop':  'drop-badge',
};

export default function PropertyDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [liked,    setLiked]    = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/properties/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setProperty(d.data);
        else           setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ marginTop: 80 }}>
      <div className="page-header py-5">
        <div className="container pt-4">
          <div className="skeleton mx-auto rounded-3" style={{ height: 40, width: 300 }}></div>
        </div>
      </div>
      <div className="container py-5">
        <div className="skeleton rounded-4 mb-4" style={{ height: 480 }}></div>
        <div className="row g-4">
          <div className="col-lg-8"><div className="skeleton rounded-4" style={{ height: 300 }}></div></div>
          <div className="col-lg-4"><div className="skeleton rounded-4" style={{ height: 300 }}></div></div>
        </div>
      </div>
    </div>
  );

  if (notFound) return (
    <div style={{ marginTop: 80 }} className="text-center py-5">
      <i className="fa-solid fa-house-circle-exclamation fa-4x text-muted mb-4 d-block"></i>
      <h2 className="fw-bold">Property Not Found</h2>
      <p className="text-muted">This property may have been removed or the link is invalid.</p>
      <button className="btn btn-start text-white rounded-3 mt-2" onClick={() => navigate('/properties')}>
        <i className="fa-solid fa-arrow-left me-2"></i>Back to Properties
      </button>
    </div>
  );

  const p = property;

  return (
    <>
      {/* ── Page header ──────────────────────────────────────── */}
      <div className="page-header py-4 text-white" style={{ marginTop: 80 }}>
        <div className="container pt-2">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2">
              <li className="breadcrumb-item">
                <span
                  className="text-white-50"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/')}
                >Home</span>
              </li>
              <li className="breadcrumb-item">
                <span
                  className="text-white-50"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/properties')}
                >Properties</span>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                {p.title}
              </li>
            </ol>
          </nav>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h1 className="fw-bold mb-1">{p.title}</h1>
              <p className="mb-0 text-white-50">
                <i className="fa-solid fa-location-dot me-2"></i>
                {p.address}, {p.city}
              </p>
            </div>
            <div className="text-end">
              <div className="fs-2 fw-bold">${p.price.toLocaleString()}</div>
              {p.oldPrice && (
                <div className="text-white-50 text-decoration-line-through small">
                  ${p.oldPrice.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* ── Hero image ─────────────────────────────────────── */}
        <div className="position-relative mb-4">
          <div className="rounded-4 overflow-hidden" style={{ maxHeight: 500 }}>
            <img
              src={p.image || PLACEHOLDER}
              alt={p.title}
              className="w-100"
              style={{ objectFit: 'cover', height: 500 }}
            />
          </div>
          {/* Badges over image */}
          <span className={`badge text-white rounded-pill tl-badge px-3 py-2 fs-6 ${STATUS_CLASSES[p.status] || ''}`}>
            {p.status}
          </span>
          <span className="badge text-white rounded-pill bl-badge px-3 py-2">
            <i className="fa-solid fa-camera me-1"></i>{p.photos} Photos
          </span>
          <span
            className="badge rounded-pill tr-badge bg-white shadow"
            onClick={() => setLiked(!liked)}
            style={{ cursor: 'pointer', fontSize: 18, padding: '10px 12px' }}
            title={liked ? 'Unlike' : 'Save'}
          >
            <i
              className={`fa-${liked ? 'solid' : 'regular'} fa-heart`}
              style={{ color: liked ? 'red' : '#555' }}
            ></i>
          </span>
        </div>

        <div className="row g-4">
          {/* ── Left column ──────────────────────────────────── */}
          <div className="col-lg-8">

            {/* Quick stats strip */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <div className="row text-center gy-3">
                {[
                  { icon: 'fa-bed',         label: 'Bedrooms',   val: p.bedrooms },
                  { icon: 'fa-bath',        label: 'Bathrooms',  val: p.bathrooms },
                  { icon: 'fa-ruler-combined', label: 'Sq Footage', val: `${p.sqft?.toLocaleString()} sqft` },
                  { icon: 'fa-tag',         label: 'Price/sqft', val: p.pricePerSqft ? `$${p.pricePerSqft}` : '—' },
                  { icon: 'fa-home',        label: 'Type',       val: p.type },
                ].map(s => (
                  <div className="col-6 col-md" key={s.label}>
                    <i className={`fa-solid ${s.icon} fa-lg mb-2`} style={{ color: 'var(--main-color)' }}></i>
                    <div className="fw-bold">{s.val}</div>
                    <div className="text-muted small">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3">About This Property</h4>
              <p className="text-muted lh-lg">
                Welcome to this exceptional {p.type.toLowerCase()} located in the heart of {p.city}.
                This stunning {p.bedrooms}-bedroom, {p.bathrooms}-bathroom property offers{' '}
                {p.sqft?.toLocaleString()} square feet of beautifully designed living space.
                Perfectly positioned at {p.address}, this property combines comfort, style, and
                convenience in one of the most sought-after locations in the area.
              </p>
              <p className="text-muted lh-lg mb-0">
                With premium finishes throughout, spacious rooms, and an ideal location, this property
                represents an outstanding opportunity whether you're looking for a primary residence,
                a vacation home, or an investment property.
              </p>
            </div>

            {/* Features */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3">Key Features</h4>
              <div className="row row-cols-2 g-3">
                {[
                  'Modern Kitchen', 'Open Floor Plan', 'Natural Lighting',
                  'Private Parking', 'Secure Entry', 'Central Air & Heat',
                  'High Ceilings', 'Premium Finishes', 'Energy Efficient',
                  'Storage Space',
                ].map(f => (
                  <div className="col" key={f}>
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-solid fa-circle-check" style={{ color: 'var(--main-color)' }}></i>
                      <span className="small">{f}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-3">
                <i className="fa-solid fa-location-dot me-2" style={{ color: 'var(--main-color)' }}></i>
                Location
              </h4>
              <p className="text-muted mb-3">{p.address}, {p.city}</p>
              {/* Map embed placeholder — replace src with a real Google Maps embed URL */}
              <div
                className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center bg-body-tertiary"
                style={{ height: 220 }}
              >
                <div className="text-center text-muted">
                  <i className="fa-solid fa-map fa-3x mb-2 d-block"></i>
                  <span className="small">
                    Map embed — add your Google Maps API key<br />
                    to show an interactive map here
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column — sticky sidebar ────────────────── */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: 100 }}>

              {/* Price + CTA card */}
              <div className="card border-0 shadow rounded-4 p-4 mb-4">
                <div className="mb-3">
                  <div className="fs-2 fw-bold" style={{ color: 'var(--main-color)' }}>
                    ${p.price.toLocaleString()}
                  </div>
                  {p.oldPrice && (
                    <div className="text-muted text-decoration-line-through small">
                      Was ${p.oldPrice.toLocaleString()}
                    </div>
                  )}
                  {p.pricePerSqft && (
                    <div className="text-muted small">${p.pricePerSqft} per sq ft</div>
                  )}
                </div>

                <button
                  className="btn w-100 p-3 rounded-3 fw-semibold mb-3 purple-gradient-bg text-white submit-btn"
                  onClick={() => setShowTour(true)}
                >
                  <i className="fa-solid fa-calendar-check me-2"></i>Schedule a Tour
                </button>

                <button
                  className="btn w-100 p-3 rounded-3 fw-semibold schedule"
                  onClick={() => navigate('/contact')}
                >
                  <i className="fa-solid fa-envelope me-2"></i>Contact Agent
                </button>
              </div>

              {/* Agent card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h6 className="fw-bold mb-3">Listed By</h6>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 52, height: 52,
                      background: 'linear-gradient(135deg, #7f22fe, #9315fb)',
                      color: 'white', fontSize: 20,
                    }}
                  >
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div>
                    <div className="fw-semibold">{p.agent || 'EliteHomes Agent'}</div>
                    <div className="text-muted small">Verified Agent</div>
                    <div className="yellow-stars small">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Property summary */}
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h6 className="fw-bold mb-3">Property Summary</h6>
                {[
                  { label: 'Property ID',  val: p._id?.slice(-8).toUpperCase() },
                  { label: 'Type',         val: p.type },
                  { label: 'Status',       val: p.status },
                  { label: 'Bedrooms',     val: p.bedrooms },
                  { label: 'Bathrooms',    val: p.bathrooms },
                  { label: 'Area',         val: `${p.sqft?.toLocaleString()} sqft` },
                  { label: 'City',         val: p.city },
                ].map(r => (
                  <div
                    key={r.label}
                    className="d-flex justify-content-between py-2 border-bottom"
                    style={{ fontSize: 14 }}
                  >
                    <span className="text-muted">{r.label}</span>
                    <span className="fw-semibold">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Back button ──────────────────────────────────────── */}
        <div className="mt-5">
          <button
            className="btn btn-outline-secondary rounded-3 px-4"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left me-2"></i>Back
          </button>
        </div>
      </div>

      {showTour && (
        <TourModal property={p} onClose={() => setShowTour(false)} />
      )}
    </>
  );
}
