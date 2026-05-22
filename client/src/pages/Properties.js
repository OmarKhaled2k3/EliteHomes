import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';

const PRICE_RANGES = [
  { label: 'Any Price',    min: '',       max: '' },
  { label: '$0 – $500K',  min: '0',      max: '500000' },
  { label: '$500K – $1M', min: '500000', max: '1000000' },
  { label: '$1M – $2M',   min: '1000000',max: '2000000' },
  { label: '$2M+',        min: '2000000',max: '' },
];

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive initial filter from URL params (from hero search)
  const [filter, setFilter] = useState({
    city:       searchParams.get('city')       || '',
    type:       searchParams.get('type')       || '',
    priceRange: '0',   // index into PRICE_RANGES
    bedrooms:   searchParams.get('bedrooms')   || '',
    bathrooms:  searchParams.get('bathrooms')  || '',
    minSqft:    searchParams.get('minSqft')    || '',
    maxSqft:    searchParams.get('maxSqft')    || '',
  });

  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [errors,     setErrors]     = useState({});

  const fetchProperties = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.city)      params.set('city',      f.city);
      if (f.type)      params.set('type',      f.type);
      if (f.bedrooms)  params.set('bedrooms',  f.bedrooms);
      if (f.bathrooms) params.set('bathrooms', f.bathrooms);
      if (f.minSqft)   params.set('minSqft',   f.minSqft);
      if (f.maxSqft)   params.set('maxSqft',   f.maxSqft);
      const pr = PRICE_RANGES[Number(f.priceRange)];
      if (pr.min) params.set('minPrice', pr.min);
      if (pr.max) params.set('maxPrice', pr.max);

      const res  = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      if (data.success) setProperties(data.data);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(filter);
    // eslint-disable-next-line
  }, []);

  function handleChange(e) {
    const { id, value } = e.target;
    setFilter(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
  }

  function validate() {
    const e = {};
    if (filter.minSqft && isNaN(Number(filter.minSqft))) e.minSqft = 'Must be a number';
    if (filter.maxSqft && isNaN(Number(filter.maxSqft))) e.maxSqft = 'Must be a number';
    if (filter.minSqft && filter.maxSqft && Number(filter.minSqft) > Number(filter.maxSqft))
      e.maxSqft = 'Max Sq Ft must be ≥ Min';
    return e;
  }

  function handleSearch(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSearchParams({});   // clear URL params
    fetchProperties(filter);
  }

  function handleReset() {
    const f = { city: '', type: '', priceRange: '0', bedrooms: '', bathrooms: '', minSqft: '', maxSqft: '' };
    setFilter(f);
    setErrors({});
    setSearchParams({});
    fetchProperties(f);
  }

  return (
    <>
      {/* Page header */}
      <div className="page-header py-5 text-white text-center">
        <div className="container pt-4">
          <h1 className="fw-bold">All Properties</h1>
          <p className="fs-5 text-white-50">Browse our complete portfolio of premium properties</p>
        </div>
      </div>

      <section className="py-5 bg-body-tertiary">
        <div className="container">
          <div className="row gy-4">

            {/* ── Filter sidebar ─────────────────────────────── */}
            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: 100 }}>
                <h5 className="fw-bold mb-4">
                  <i className="fa-solid fa-sliders me-2 text-purple" style={{ color: 'var(--main-color)' }}></i>
                  Filter Properties
                </h5>

                {/* City */}
                <div className="mb-3">
                  <label htmlFor="city" className="fw-semibold small mb-1">Location</label>
                  <div className="input-group rounded-3 p-2 bg-body-tertiary">
                    <span className="input-group-text bg-transparent border-0">
                      <i className="fa-solid fa-location-dot text-muted"></i>
                    </span>
                    <input
                      type="text" id="city" value={filter.city} onChange={handleChange}
                      className="form-control border-0 shadow-none bg-body-tertiary"
                      placeholder="City or neighborhood"
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="mb-3">
                  <label htmlFor="type" className="fw-semibold small mb-1">Property Type</label>
                  <div className="input-group rounded-3 p-2 bg-body-tertiary">
                    <select id="type" value={filter.type} onChange={handleChange}
                      className="form-select border-0 shadow-none bg-body-tertiary">
                      <option value="">All Types</option>
                      <option>House</option><option>Apartment</option>
                      <option>Condo</option><option>Townhouse</option>
                    </select>
                  </div>
                </div>

                {/* Price range */}
                <div className="mb-3">
                  <label htmlFor="priceRange" className="fw-semibold small mb-1">Price Range</label>
                  <div className="input-group rounded-3 p-2 bg-body-tertiary">
                    <select id="priceRange" value={filter.priceRange} onChange={handleChange}
                      className="form-select border-0 shadow-none bg-body-tertiary">
                      {PRICE_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="mb-3">
                  <label htmlFor="bedrooms" className="fw-semibold small mb-1">Bedrooms</label>
                  <div className="input-group rounded-3 p-2 bg-body-tertiary">
                    <select id="bedrooms" value={filter.bedrooms} onChange={handleChange}
                      className="form-select border-0 shadow-none bg-body-tertiary">
                      <option value="">Any</option>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
                    </select>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="mb-3">
                  <label htmlFor="bathrooms" className="fw-semibold small mb-1">Bathrooms</label>
                  <div className="input-group rounded-3 p-2 bg-body-tertiary">
                    <select id="bathrooms" value={filter.bathrooms} onChange={handleChange}
                      className="form-select border-0 shadow-none bg-body-tertiary">
                      <option value="">Any</option>
                      {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
                    </select>
                  </div>
                </div>

                {/* Sqft */}
                <div className="mb-1">
                  <label className="fw-semibold small mb-1">Square Footage</label>
                  <div className="row gx-2">
                    <div className="col-6">
                      <div className={`input-group rounded-3 p-2 bg-body-tertiary ${errors.minSqft ? 'border-danger' : ''}`}>
                        <input type="number" id="minSqft" value={filter.minSqft} onChange={handleChange}
                          className="form-control border-0 shadow-none bg-body-tertiary" placeholder="Min" />
                      </div>
                      {errors.minSqft && <div className="text-danger" style={{ fontSize: 11 }}>{errors.minSqft}</div>}
                    </div>
                    <div className="col-6">
                      <div className={`input-group rounded-3 p-2 bg-body-tertiary ${errors.maxSqft ? 'border-danger' : ''}`}>
                        <input type="number" id="maxSqft" value={filter.maxSqft} onChange={handleChange}
                          className="form-control border-0 shadow-none bg-body-tertiary" placeholder="Max" />
                      </div>
                      {errors.maxSqft && <div className="text-danger" style={{ fontSize: 11 }}>{errors.maxSqft}</div>}
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button className="btn p-2 fw-semibold search rounded-3" onClick={handleSearch}>
                    <i className="fa-solid fa-magnifying-glass me-2"></i> Apply Filters
                  </button>
                  <button className="btn btn-outline-secondary rounded-3" onClick={handleReset}>
                    <i className="fa-solid fa-rotate-left me-2"></i> Reset
                  </button>
                </div>
              </div>
            </div>

            {/* ── Results ────────────────────────────────────── */}
            <div className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  {loading ? 'Searching...' : `${properties.length} Propert${properties.length !== 1 ? 'ies' : 'y'} Found`}
                </h5>
              </div>

              {loading ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                  {[1,2,3,4,5,6].map(i => (
                    <div className="col" key={i}>
                      <div className="skeleton" style={{ height: 380 }}></div>
                    </div>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fa-solid fa-house-circle-exclamation fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No properties match your criteria</h5>
                  <p className="text-muted">Try adjusting your filters</p>
                  <button className="btn btn-start text-white rounded-3 mt-2" onClick={handleReset}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                  {properties.map(p => (
                    <div className="col" key={p._id}>
                      <PropertyCard property={p} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
