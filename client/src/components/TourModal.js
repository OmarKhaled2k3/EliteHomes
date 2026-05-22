import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const INIT = { name: '', email: '', phone: '', preferredDate: '', message: '' };

export default function TourModal({ property, onClose }) {
  const [form,    setForm]    = useState(INIT);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  function validate() {
    const e = {};
    if (!form.name.trim())          e.name          = 'Name is required.';
    if (!form.email.trim())         e.email         = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                    e.email         = 'Invalid email address.';
    if (!form.phone.trim())         e.phone         = 'Phone is required.';
    else if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone))
                                    e.phone         = 'Invalid phone number.';
    if (!form.preferredDate)        e.preferredDate = 'Please select a date.';
    else {
      const d = new Date(form.preferredDate);
      if (d < new Date()) e.preferredDate = 'Date must be in the future.';
    }
    return e;
  }

  function handleChange(e) {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/tours', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          propertyId:    property._id,
          propertyTitle: property.title,
          ...form,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Tour scheduled successfully! We will contact you soon.', 'success');
        onClose();
      } else {
        showToast(data.message || 'Something went wrong.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold">Schedule a Tour</h5>
              <p className="text-muted small mb-0">{property.title} — {property.address}, {property.city}</p>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body px-4 pb-4">
            <div className="row gy-3">
              {/* Name */}
              <div className="col-12">
                <label htmlFor="name" className="fw-semibold">
                  Full Name <span className="text-danger">*</span>
                </label>
                <div className={`input-group rounded-4 p-2 mt-1 bg-body-tertiary ${errors.name ? 'border-danger' : ''}`}>
                  <input
                    type="text" id="name" value={form.name} onChange={handleChange}
                    className="form-control border-0 shadow-none bg-body-tertiary"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
              </div>

              {/* Email */}
              <div className="col-md-6 col-12">
                <label htmlFor="email" className="fw-semibold">
                  Email <span className="text-danger">*</span>
                </label>
                <div className={`input-group rounded-4 p-2 mt-1 bg-body-tertiary ${errors.email ? 'border-danger' : ''}`}>
                  <input
                    type="email" id="email" value={form.email} onChange={handleChange}
                    className="form-control border-0 shadow-none bg-body-tertiary"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
              </div>

              {/* Phone */}
              <div className="col-md-6 col-12">
                <label htmlFor="phone" className="fw-semibold">
                  Phone <span className="text-danger">*</span>
                </label>
                <div className={`input-group rounded-4 p-2 mt-1 bg-body-tertiary ${errors.phone ? 'border-danger' : ''}`}>
                  <input
                    type="tel" id="phone" value={form.phone} onChange={handleChange}
                    className="form-control border-0 shadow-none bg-body-tertiary"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
              </div>

              {/* Date */}
              <div className="col-12">
                <label htmlFor="preferredDate" className="fw-semibold">
                  Preferred Date <span className="text-danger">*</span>
                </label>
                <div className={`input-group rounded-4 p-2 mt-1 bg-body-tertiary ${errors.preferredDate ? 'border-danger' : ''}`}>
                  <input
                    type="date" id="preferredDate" value={form.preferredDate} onChange={handleChange}
                    className="form-control border-0 shadow-none bg-body-tertiary"
                  />
                </div>
                {errors.preferredDate && <div className="text-danger small mt-1">{errors.preferredDate}</div>}
              </div>

              {/* Message */}
              <div className="col-12">
                <label htmlFor="message" className="fw-semibold">Additional Notes</label>
                <textarea
                  id="message" value={form.message} onChange={handleChange}
                  className="form-control bg-body-tertiary border-0 mt-1"
                  rows={3}
                  placeholder="Any special requirements or questions..."
                ></textarea>
              </div>

              <div className="col-12">
                <button
                  className="btn w-100 p-3 rounded-4 purple-gradient-bg text-white fw-semibold fs-5 submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Scheduling...</>
                    : <><i className="fa-solid fa-calendar-check me-2"></i>Confirm Tour</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
