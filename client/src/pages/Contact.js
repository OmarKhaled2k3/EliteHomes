import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const INIT = {
  firstName: '', lastName: '', email: '', phone: '',
  service: 'none', message: '', marketing: false,
};

/* ── Field MUST be outside Contact so React doesn't remount it on every keystroke ── */
function Field({ id, label, type = 'text', placeholder, required, half, form, errors, onChange }) {
  return (
    <div className={`${half ? 'col-lg-6' : 'col-12'} col-12`}>
      <label htmlFor={id} className="fw-semibold text-dark">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className={`input-group rounded-4 p-2 mt-1 bg-body-tertiary ${errors[id] ? 'border border-danger' : ''}`}>
        <input
          type={type}
          id={id}
          value={form[id]}
          onChange={onChange}
          className="form-control rounded-2 border-0 shadow-none bg-body-tertiary"
          placeholder={placeholder}
        />
      </div>
      {errors[id] && (
        <div className="text-danger small mt-1">
          <i className="fa-solid fa-circle-exclamation me-1"></i>{errors[id]}
        </div>
      )}
    </div>
  );
}

export default function Contact() {
  const [form,    setForm]    = useState(INIT);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  function validate() {
    const e = {};
    if (!form.firstName.trim())   e.firstName = 'First name is required.';
    if (!form.lastName.trim())    e.lastName  = 'Last name is required.';
    if (!form.email.trim())       e.email     = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                  e.email     = 'Please enter a valid email.';
    if (!form.phone.trim())       e.phone     = 'Phone number is required.';
    else if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone))
                                  e.phone     = 'Please enter a valid phone number.';
    if (form.message.trim().length > 0 && form.message.trim().length < 10)
                                  e.message   = 'Message must be at least 10 characters.';
    return e;
  }

  function handleChange(e) {
    const { id, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const res  = await fetch('/api/contacts', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Message sent! We'll be in touch soon.", 'success');
        setForm(INIT);
        setErrors({});
      } else {
        showToast(data.message || 'Something went wrong.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  /* Shared props passed down to every Field */
  const fieldProps = { form, errors, onChange: handleChange };

  return (
    <>
      {/* Page header */}
      <div className="page-header py-5 text-white text-center">
        <div className="container pt-4">
          <h1 className="fw-bold">Contact Us</h1>
          <p className="fs-5 text-white-50">We'd love to hear from you — get in touch with our team today</p>
        </div>
      </div>

      <section className="contact py-5" id="contact">
        <div className="container">

          {/* ── Contact cards ───────────────────────────────── */}
          <div className="row row-cols-1 row-cols-lg-3 g-4 mb-5">
            {[
              { icon: 'fa-phone',        cls: '',            title: 'Phone',  lines: ['+1 (555) 123-4567', 'Mon–Fri, 9am–6pm EST'] },
              { icon: 'fa-envelope',     cls: 'icon-wrap-3', title: 'Email',  lines: ['contact@elitehomes.com', 'We reply within 24h'] },
              { icon: 'fa-location-dot', cls: 'icon-wrap-4', title: 'Office', lines: ['123 Luxury Lane, Beverly Hills', 'CA 90210, USA'] },
            ].map(c => (
              <div className="col" key={c.title}>
                <div className="contact-card rounded-4 p-4 h-100 bg-white">
                  <div className={`icon-wrap ${c.cls} rounded-3 d-inline-block mb-3`}>
                    <i className={`fa-solid ${c.icon} text-white fs-5`}></i>
                  </div>
                  <h5 className="fw-bold purple-text">{c.title}</h5>
                  {c.lines.map(l => <p key={l} className="text-muted mb-0 small">{l}</p>)}
                </div>
              </div>
            ))}
          </div>

          {/* ── Main contact section ─────────────────────────── */}
          <div className="row gy-4">

            {/* Left — business hours + social */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-4">
                <div className="card border-0 shadow-sm rounded-4 p-4">
                  <h5 className="fw-bold mb-3">Business Hours</h5>
                  {[
                    { day: 'Monday – Friday', hrs: '9:00 AM – 6:00 PM' },
                    { day: 'Saturday',        hrs: '10:00 AM – 4:00 PM' },
                    { day: 'Sunday',          hrs: 'Closed' },
                  ].map(h => (
                    <div className="d-flex justify-content-between mb-2 small" key={h.day}>
                      <span className="text-muted">{h.day}</span>
                      <span className="fw-semibold">{h.hrs}</span>
                    </div>
                  ))}
                </div>

                <div className="contact-with-us p-4 rounded-4 purple-bg">
                  <h3 className="text-white fw-semibold fs-5">Connect With Us</h3>
                  <p className="text-white">Follow us for updates and real estate insights</p>
                  <div className="social-containers d-flex gap-3 flex-wrap">
                    {['fa-facebook-f','fa-twitter','fa-instagram','fa-linkedin-in','fa-youtube'].map(icon => (
                      <div key={icon} className="social-wrap p-3 rounded-4 social-bg2">
                        <a href="#!" className="text-decoration-none" aria-label="social link">
                          <i className={`fa-brands ${icon} text-white`}></i>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — contact form */}
            <div className="col-lg-8">
              <div className="send-us border border-1 p-5 rounded-4 bg-white shadow-sm">
                <h3 className="fw-bold">Send Us a Message</h3>
                <p className="mb-4 text-muted">Fill out the form and we'll get back to you as soon as possible</p>

                <div className="row gy-4">
                  <Field id="firstName" label="First Name"    placeholder="John"                required half {...fieldProps} />
                  <Field id="lastName"  label="Last Name"     placeholder="Doe"                 required half {...fieldProps} />
                  <Field id="email"     label="Email Address" placeholder="john@example.com"    required half type="email" {...fieldProps} />
                  <Field id="phone"     label="Phone Number"  placeholder="+1 (555) 000-0000"   required half type="tel"   {...fieldProps} />

                  {/* Service */}
                  <div className="col-12">
                    <label htmlFor="service" className="fw-semibold text-dark">I'm interested in</label>
                    <div className="input-group rounded-3 p-2 mt-1 bg-body-tertiary">
                      <select id="service" value={form.service} onChange={handleChange}
                        className="form-select border-0 shadow-none bg-body-tertiary">
                        <option value="none">Select a service</option>
                        <option value="buying">Buying a home</option>
                        <option value="selling">Selling a home</option>
                        <option value="renting">Renting a property</option>
                        <option value="investing">Investment opportunities</option>
                        <option value="commercial">Commercial real estate</option>
                        <option value="management">Property management</option>
                        <option value="consultation">Market consultation</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <label htmlFor="message" className="form-label fw-semibold text-dark">Your Message</label>
                    <textarea
                      id="message" value={form.message} onChange={handleChange}
                      className={`form-control bg-body-tertiary border-0 mt-1 ${errors.message ? 'border border-danger' : ''}`}
                      placeholder="Tell us about your real estate needs..."
                      rows={5}
                    ></textarea>
                    {errors.message && (
                      <div className="text-danger small mt-1">
                        <i className="fa-solid fa-circle-exclamation me-1"></i>{errors.message}
                      </div>
                    )}
                  </div>

                  {/* Marketing checkbox */}
                  <div className="col-12">
                    <div className="checkbox-container light-purple-bg p-3 rounded-4">
                      <div className="form-check">
                        <input
                          className="form-check-input" type="checkbox"
                          id="marketing" checked={form.marketing} onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="marketing">
                          I agree to receive marketing communications and updates from EliteHomes
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="col-12">
                    <div className="d-grid">
                      <button
                        className="submit-btn btn p-3 rounded-4 purple-gradient-bg text-white fs-5 fw-semibold"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading
                          ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                          : <><i className="fa-solid fa-paper-plane me-2"></i>Send Message</>
                        }
                      </button>
                    </div>
                  </div>

                  <div className="col-12">
                    <span className="fs-6 text-muted text-center d-block">
                      <i className="fa-solid fa-lock me-1"></i>
                      We respect your privacy. Your information will never be shared.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
