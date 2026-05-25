import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_BASE_URL from '../config';

export default function AdminDashboard() {
  const { authFetch } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('tours'); // tours, contacts, addProperty
  const [tours, setTours] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state for adding properties
  const [newProperty, setNewProperty] = useState({
    title: '',
    price: '',
    oldPrice: '',
    address: '',
    city: '',
    type: 'House',
    status: 'Featured',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    image: '',
    agent: 'EliteHomes Agent'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch admin dashboard content
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Tours
      const toursRes = await authFetch(`${API_BASE_URL}/tours`);
      const toursData = await toursRes.json();
      if (toursData.success) setTours(toursData.data);

      // 2. Fetch Contacts
      const contactsRes = await authFetch(`${API_BASE_URL}/contacts`);
      const contactsData = await contactsRes.json();
      if (contactsData.success) setContacts(contactsData.data);

      // 3. Fetch Properties Count
      const propertiesRes = await fetch(`${API_BASE_URL}/properties`);
      const propertiesData = await propertiesRes.json();
      if (propertiesData.success) setPropertiesCount(propertiesData.data.length);

    } catch (err) {
      console.error(err);
      showToast('Error loading administrative data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authFetch, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle property form changes
  function handleFormChange(e) {
    const { id, value } = e.target;
    setNewProperty(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) setFormErrors(prev => ({ ...prev, [id]: '' }));
  }

  // Validate property form
  function validateForm() {
    const err = {};
    if (!newProperty.title) err.title = 'Title is required';
    if (!newProperty.price || isNaN(Number(newProperty.price))) err.price = 'Valid price is required';
    if (newProperty.oldPrice && isNaN(Number(newProperty.oldPrice))) err.oldPrice = 'Must be a valid number';
    if (!newProperty.address) err.address = 'Address is required';
    if (!newProperty.city) err.city = 'City is required';
    if (!newProperty.bedrooms || isNaN(Number(newProperty.bedrooms))) err.bedrooms = 'Bedrooms count required';
    if (!newProperty.bathrooms || isNaN(Number(newProperty.bathrooms))) err.bathrooms = 'Bathrooms count required';
    if (!newProperty.sqft || isNaN(Number(newProperty.sqft))) err.sqft = 'Valid Sq Ft count required';
    if (!newProperty.image) err.image = 'Image URL is required';
    return err;
  }

  // Submit property listing
  async function handleAddProperty(e) {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Please correct form errors.', 'error');
      return;
    }

    setFormErrors({});
    setSubmitting(true);

    try {
      const res = await authFetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newProperty,
          price: Number(newProperty.price),
          oldPrice: newProperty.oldPrice ? Number(newProperty.oldPrice) : undefined,
          bedrooms: Number(newProperty.bedrooms),
          bathrooms: Number(newProperty.bathrooms),
          sqft: Number(newProperty.sqft),
          pricePerSqft: Math.round(Number(newProperty.price) / Number(newProperty.sqft))
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Property published successfully!', 'success');
        // Reset form
        setNewProperty({
          title: '',
          price: '',
          oldPrice: '',
          address: '',
          city: '',
          type: 'House',
          status: 'Featured',
          bedrooms: '',
          bathrooms: '',
          sqft: '',
          image: '',
          agent: 'EliteHomes Agent'
        });
        setPropertiesCount(prev => prev + 1);
        setActiveTab('tours'); // Switch back to see status
      } else {
        showToast(data.message || 'Failed to post property.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading property details.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-header py-5 text-white text-center">
        <div className="container pt-4">
          <h1 className="fw-bold">Admin Portal</h1>
          <p className="fs-5 text-white-50">Manage property listings, tour bookings, and inquiries</p>
        </div>
      </div>

      <section className="py-5 bg-body-tertiary">
        <div className="container">
          
          {/* Analytics Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center bg-white">
                <div className="rounded-4 p-3 bg-primary-subtle me-3 text-purple">
                  <i className="fa-solid fa-house-chimney fa-2x"></i>
                </div>
                <div>
                  <h6 className="text-muted fw-bold mb-0">Total Properties</h6>
                  <h3 className="fw-black mb-0">{loading ? '...' : propertiesCount}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center bg-white">
                <div className="rounded-4 p-3 bg-success-subtle me-3 text-success">
                  <i className="fa-solid fa-calendar-check fa-2x"></i>
                </div>
                <div>
                  <h6 className="text-muted fw-bold mb-0">Tour Bookings</h6>
                  <h3 className="fw-black mb-0">{loading ? '...' : tours.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center bg-white">
                <div className="rounded-4 p-3 bg-warning-subtle me-3 text-warning">
                  <i className="fa-solid fa-envelope-open-text fa-2x"></i>
                </div>
                <div>
                  <h6 className="text-muted fw-bold mb-0">Total Inquiries</h6>
                  <h3 className="fw-black mb-0">{loading ? '...' : contacts.length}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <ul className="nav nav-pills nav-fill gap-2" id="adminTabs">
              <li className="nav-item">
                <button
                  onClick={() => setActiveTab('tours')}
                  className={`nav-link rounded-3 py-3 fw-bold border-0 ${activeTab === 'tours' ? 'active text-white' : 'text-muted bg-transparent'}`}
                  style={activeTab === 'tours' ? { backgroundColor: 'var(--main-color)' } : {}}
                >
                  <i className="fa-solid fa-calendar-day me-2"></i> Tour Bookings
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`nav-link rounded-3 py-3 fw-bold border-0 ${activeTab === 'contacts' ? 'active text-white' : 'text-muted bg-transparent'}`}
                  style={activeTab === 'contacts' ? { backgroundColor: 'var(--main-color)' } : {}}
                >
                  <i className="fa-solid fa-comments me-2"></i> Contact Messages
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setActiveTab('addProperty')}
                  className={`nav-link rounded-3 py-3 fw-bold border-0 ${activeTab === 'addProperty' ? 'active text-white' : 'text-muted bg-transparent'}`}
                  style={activeTab === 'addProperty' ? { backgroundColor: 'var(--main-color)' } : {}}
                >
                  <i className="fa-solid fa-circle-plus me-2"></i> Add Property listing
                </button>
              </li>
            </ul>
          </div>

          {/* Content Pane */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white min-vh-50">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-purple" role="status" style={{ color: 'var(--main-color)' }}>
                  <span className="visually-hidden">Loading administrative panel data...</span>
                </div>
                <p className="mt-3 text-muted">Retrieving database assets...</p>
              </div>
            ) : (
              <>
                {/* ── tours tab ──────────────────────────────── */}
                {activeTab === 'tours' && (
                  <div>
                    <h4 className="fw-bold mb-4">Scheduled Property Tours</h4>
                    {tours.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="fa-solid fa-calendar-xmark fa-3x text-muted mb-3"></i>
                        <p className="text-muted">No tour bookings scheduled yet.</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle border-0">
                          <thead className="table-light">
                            <tr>
                              <th>Customer</th>
                              <th>Contact</th>
                              <th>Property Target</th>
                              <th>Preferred Date</th>
                              <th>Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tours.map(t => (
                              <tr key={t._id}>
                                <td>
                                  <div className="fw-bold">{t.name}</div>
                                </td>
                                <td>
                                  <div className="small text-muted">{t.email}</div>
                                  <div className="small text-muted">{t.phone}</div>
                                </td>
                                <td>
                                  <span className="badge bg-secondary p-2">{t.propertyTitle}</span>
                                </td>
                                <td>
                                  <span className="fw-semibold text-purple" style={{ color: 'var(--main-color)' }}>
                                    {new Date(t.preferredDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                  </span>
                                </td>
                                <td>
                                  <div className="small text-muted text-wrap" style={{ maxWidth: 200 }}>
                                    {t.message || '—'}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* ── contacts tab ───────────────────────────── */}
                {activeTab === 'contacts' && (
                  <div>
                    <h4 className="fw-bold mb-4">Received Inquiries & Messages</h4>
                    {contacts.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="fa-solid fa-folder-open fa-3x text-muted mb-3"></i>
                        <p className="text-muted">No message records found.</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle border-0">
                          <thead className="table-light">
                            <tr>
                              <th>Sender</th>
                              <th>Contact</th>
                              <th>Requested Service</th>
                              <th>Message Body</th>
                              <th>Promo Consent</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contacts.map(c => (
                              <tr key={c._id}>
                                <td>
                                  <div className="fw-bold">{c.firstName} {c.lastName}</div>
                                </td>
                                <td>
                                  <div className="small text-muted">{c.email}</div>
                                  <div className="small text-muted">{c.phone}</div>
                                </td>
                                <td>
                                  <span className="badge text-uppercase p-2 text-dark bg-warning-subtle">{c.service}</span>
                                </td>
                                <td>
                                  <div className="small text-muted text-wrap" style={{ maxWidth: 250 }}>{c.message}</div>
                                </td>
                                <td>
                                  {c.marketing ? (
                                    <span className="badge bg-success-subtle text-success p-2">Opted-In</span>
                                  ) : (
                                    <span className="badge bg-light text-muted p-2">Declined</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* ── addProperty tab ────────────────────────── */}
                {activeTab === 'addProperty' && (
                  <div>
                    <h4 className="fw-bold mb-4">Publish New Property Listing</h4>
                    <form onSubmit={handleAddProperty} noValidate>
                      <div className="row g-3">
                        {/* Title */}
                        <div className="col-md-6">
                          <label htmlFor="title" className="fw-semibold small mb-1">Property Title</label>
                          <div className={`input-group rounded-3 p-2 bg-body-tertiary ${formErrors.title ? 'border-danger' : ''}`}>
                            <input
                              type="text" id="title" value={newProperty.title} onChange={handleFormChange}
                              className="form-control border-0 shadow-none bg-body-tertiary" placeholder="e.g. Modern Villa with Pool"
                            />
                          </div>
                          {formErrors.title && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{formErrors.title}</div>}
                        </div>

                        {/* Image URL */}
                        <div className="col-md-6">
                          <label htmlFor="image" className="fw-semibold small mb-1">Image URL</label>
                          <div className={`input-group rounded-3 p-2 bg-body-tertiary ${formErrors.image ? 'border-danger' : ''}`}>
                            <input
                              type="text" id="image" value={newProperty.image} onChange={handleFormChange}
                              className="form-control border-0 shadow-none bg-body-tertiary" placeholder="e.g. https://images.unsplash.com/photo-..."
                            />
                          </div>
                          {formErrors.image && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{formErrors.image}</div>}
                        </div>

                        {/* Price */}
                        <div className="col-md-4">
                          <label htmlFor="price" className="fw-semibold small mb-1">Price ($)</label>
                          <div className={`input-group rounded-3 p-2 bg-body-tertiary ${formErrors.price ? 'border-danger' : ''}`}>
                            <input
                              type="number" id="price" value={newProperty.price} onChange={handleFormChange}
                              className="form-control border-0 shadow-none bg-body-tertiary" placeholder="e.g. 850000"
                            />
                          </div>
                          {formErrors.price && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{formErrors.price}</div>}
                        </div>

                        {/* Old Price */}
                        <div className="col-md-4">
                          <label htmlFor="oldPrice" className="fw-semibold small mb-1">Original/Old Price ($) - Optional</label>
                          <div className={`input-group rounded-3 p-2 bg-body-tertiary ${formErrors.oldPrice ? 'border-danger' : ''}`}>
                            <input
                              type="number" id="oldPrice" value={newProperty.oldPrice} onChange={handleFormChange}
                              className="form-control border-0 shadow-none bg-body-tertiary" placeholder="e.g. 920000"
                            />
                          </div>
                          {formErrors.oldPrice && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{formErrors.oldPrice}</div>}
                        </div>

                        {/* City */}
                        <div className="col-md-4">
                          <label htmlFor="city" className="fw-semibold small mb-1">City</label>
                          <div className={`input-group rounded-3 p-2 bg-body-tertiary ${formErrors.city ? 'border-danger' : ''}`}>
                            <input
                              type="text" id="city" value={newProperty.city} onChange={handleFormChange}
                              className="form-control border-0 shadow-none bg-body-tertiary" placeholder="e.g. Beverly Hills"
                            />
                          </div>
                          {formErrors.city && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{formErrors.city}</div>}
                        </div>

                        {/* Address */}
                        <div className="col-md-6">
                          <label htmlFor="address" className="fw-semibold small mb-1">Full Address</label>
                          <div className={`input-group rounded-3 p-2 bg-body-tertiary ${formErrors.address ? 'border-danger' : ''}`}>
                            <input
                              type="text" id="address" value={newProperty.address} onChange={handleFormChange}
                              className="form-control border-0 shadow-none bg-body-tertiary" placeholder="e.g. 123 Sunset Blvd, Beverly Hills, CA"
                            />
                          </div>
                          {formErrors.address && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{formErrors.address}</div>}
                        </div>

                        {/* Agent */}
                        <div className="col-md-6">
                          <label htmlFor="agent" className="fw-semibold small mb-1">Listing Agent Name</label>
                          <div className="input-group rounded-3 p-2 bg-body-tertiary">
                            <input
                              type="text" id="agent" value={newProperty.agent} onChange={handleFormChange}
                              className="form-control border-0 shadow-none bg-body-tertiary" placeholder="Agent Name"
                            />
                          </div>
                        </div>

                        {/* Property Type */}
                        <div className="col-md-4">
                          <label htmlFor="type" className="fw-semibold small mb-1">Property Type</label>
                          <div className="input-group rounded-3 p-2 bg-body-tertiary">
                            <select id="type" value={newProperty.type} onChange={handleFormChange}
                              className="form-select border-0 shadow-none bg-body-tertiary">
                              <option>House</option>
                              <option>Apartment</option>
                              <option>Condo</option>
                              <option>Townhouse</option>
                            </select>
                          </div>
                        </div>

                        {/* Badges / Status */}
                        <div className="col-md-4">
                          <label htmlFor="status" className="fw-semibold small mb-1">Listing Status/Badge</label>
                          <div className="input-group rounded-3 p-2 bg-body-tertiary">
                            <select id="status" value={newProperty.status} onChange={handleFormChange}
                              className="form-select border-0 shadow-none bg-body-tertiary">
                              <option>Featured</option>
                              <option>New Listing</option>
                              <option>Price Drop</option>
                            </select>
                          </div>
                        </div>

                        {/* Sq Ft */}
                        <div className="col-md-4">
                          <label htmlFor="sqft" className="fw-semibold small mb-1">Square Footage (Sq Ft)</label>
                          <div className={`input-group rounded-3 p-2 bg-body-tertiary ${formErrors.sqft ? 'border-danger' : ''}`}>
                            <input
                              type="number" id="sqft" value={newProperty.sqft} onChange={handleFormChange}
                              className="form-control border-0 shadow-none bg-body-tertiary" placeholder="e.g. 3200"
                            />
                          </div>
                          {formErrors.sqft && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{formErrors.sqft}</div>}
                        </div>

                        {/* Bedrooms */}
                        <div className="col-md-6">
                          <label htmlFor="bedrooms" className="fw-semibold small mb-1">Bedrooms Count</label>
                          <div className={`input-group rounded-3 p-2 bg-body-tertiary ${formErrors.bedrooms ? 'border-danger' : ''}`}>
                            <input
                              type="number" id="bedrooms" value={newProperty.bedrooms} onChange={handleFormChange}
                              className="form-control border-0 shadow-none bg-body-tertiary" placeholder="e.g. 4"
                            />
                          </div>
                          {formErrors.bedrooms && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{formErrors.bedrooms}</div>}
                        </div>

                        {/* Bathrooms */}
                        <div className="col-md-6">
                          <label htmlFor="bathrooms" className="fw-semibold small mb-1">Bathrooms Count</label>
                          <div className={`input-group rounded-3 p-2 bg-body-tertiary ${formErrors.bathrooms ? 'border-danger' : ''}`}>
                            <input
                              type="number" id="bathrooms" value={newProperty.bathrooms} onChange={handleFormChange}
                              className="form-control border-0 shadow-none bg-body-tertiary" placeholder="e.g. 3"
                            />
                          </div>
                          {formErrors.bathrooms && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{formErrors.bathrooms}</div>}
                        </div>
                      </div>

                      <div className="d-grid mt-4">
                        <button
                          type="submit" disabled={submitting}
                          className="btn btn-start text-white p-3 fw-bold rounded-3 submit-btn"
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Publishing to Database...
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-cloud-arrow-up me-2"></i> Publish Listing
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
