import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TourModal from './TourModal';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80';

const STATUS_CLASSES = {
  'Featured':    '',
  'New Listing': 'new-badge',
  'Price Drop':  'drop-badge',
};

export default function PropertyCard({ property }) {
  const [showTour, setShowTour] = useState(false);
  const [liked,    setLiked]    = useState(false);
  const navigate = useNavigate();

  function goToDetail(e) {
    // Don't navigate if heart or Schedule Tour button was clicked
    if (e.target.closest('.tr-badge') || e.target.closest('.schedule')) return;
    navigate(`/properties/${property._id}`);
  }

  return (
    <>
      <div className="card rounded-4 border-0 h-100" style={{ cursor: 'pointer' }} onClick={goToDetail}>
        <div className="img-wrapper rounded-top-4 overflow-hidden position-relative">
          <img
            src={property.image || PLACEHOLDER}
            className="card-img-top rounded-top-4"
            alt={property.title}
          />
          <span className={`badge text-white rounded-pill tl-badge px-3 py-2 ${STATUS_CLASSES[property.status] || ''}`}>
            {property.status}
          </span>
          <span className="badge text-white rounded-pill bl-badge px-3 py-2">
            <i className="fa-solid fa-camera"></i> {property.photos} Photos
          </span>
          <span
            className="badge rounded-pill tr-badge bg-body-tertiary"
            onClick={() => setLiked(!liked)}
            style={{ cursor: 'pointer' }}
            title={liked ? 'Unlike' : 'Like'}
          >
            <i className={`fa-${liked ? 'solid' : 'regular'} fa-heart`} style={{ color: liked ? 'red' : undefined }}></i>
          </span>
        </div>

        <div className="card-body shadow border-bottom rounded-4">
          <div className="card-title d-flex justify-content-between align-items-center">
            <h3 className="fs-3 fw-bolder mb-0">${property.price.toLocaleString()}</h3>
            {property.oldPrice ? (
              <span className="text-muted text-decoration-line-through">${property.oldPrice.toLocaleString()}</span>
            ) : (
              <span className="text-muted">
                {property.pricePerSqft ? `$${property.pricePerSqft}/sqft` : ''}
              </span>
            )}
          </div>

          <ul className="d-flex gap-2 justify-content-start list-unstyled mb-1">
            <li>{property.bedrooms} beds</li>
            <li>•</li>
            <li>{property.bathrooms} baths</li>
            <li>•</li>
            <li>{property.sqft?.toLocaleString()} sqft</li>
          </ul>

          <span className="fw-semibold d-block mb-1">{property.title}</span>
          <p className="card-text text-muted small">{property.address}, {property.city}</p>

          <div className="owner d-flex justify-content-between align-items-center">
            <div className="owner-details">
              <i className="fa-regular fa-circle-user text-muted me-1 fs-5"></i>
              <span className="owner-name text-muted">{property.agent}</span>
            </div>
            <button className="btn btn-sm schedule" onClick={() => setShowTour(true)}>
              Schedule Tour
            </button>
          </div>
        </div>
      </div>

      {showTour && (
        <TourModal property={property} onClose={() => setShowTour(false)} />
      )}
    </>
  );
}
