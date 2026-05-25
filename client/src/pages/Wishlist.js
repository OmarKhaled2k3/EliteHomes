import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_BASE_URL from '../config';

export default function Wishlist() {
  const { authFetch, user } = useAuth();
  const { showToast } = useToast();
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/auth/wishlist`);
      const data = await res.json();
      if (data.success) {
        setWishlistProperties(data.data);
      } else {
        showToast(data.message || 'Failed to retrieve wishlist.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error retrieving wishlist.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authFetch, showToast]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, user?.wishlist]); // Refetch if user's wishlist changes dynamically

  return (
    <>
      {/* Header */}
      <div className="page-header py-5 text-white text-center">
        <div className="container pt-4">
          <h1 className="fw-bold">My Wishlist</h1>
          <p className="fs-5 text-white-50">Manage your saved premium properties</p>
        </div>
      </div>

      <section className="py-5 bg-body-tertiary">
        <div className="container" style={{ minHeight: '50vh' }}>
          {loading ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              {[1, 2, 3].map(i => (
                <div className="col" key={i}>
                  <div className="skeleton" style={{ height: 380 }}></div>
                </div>
              ))}
            </div>
          ) : wishlistProperties.length === 0 ? (
            <div className="text-center py-5 bg-white shadow-sm rounded-4 p-5">
              <i className="fa-solid fa-heart-crack fa-4x text-muted mb-3" style={{ color: '#ccc' }}></i>
              <h4 className="fw-bold text-muted mb-2">Your wishlist is empty</h4>
              <p className="text-muted mb-4">Start exploring properties and click the heart icon to save your favorites!</p>
              <Link to="/properties" className="btn btn-start text-white rounded-3 px-4 py-2">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              {wishlistProperties.map(p => (
                <div className="col" key={p._id}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
