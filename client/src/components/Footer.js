import React from 'react';

export default function Footer() {
  return (
    <section className="footer pt-4 footer-gradient-bg">
      <div className="container">
        <div className="row row-cols-md-3 row-cols-1 justify-content-center">
          <div className="col-12 col-md-1">
            <h1 className="fs-4 text-white fw-bold text-center">EliteHomes</h1>
          </div>
          <div className="col-12 col-md-10">
            <span className="text-white d-block text-center">© 2025 EliteHomes. All rights reserved.</span>
          </div>
          <div className="col-12 col-md-1">
            <div className="social-containers d-flex gap-3 justify-content-center">
              {[
                { href: '#', icon: 'fa-facebook-f' },
                { href: '#', icon: 'fa-twitter' },
                { href: '#', icon: 'fa-instagram' },
                { href: '#', icon: 'fa-linkedin-in' },
              ].map((s) => (
                <div key={s.icon} className="social-wrap p-2 rounded-3 social-bg">
                  <a href={s.href} className="text-decoration-none" aria-label="social link">
                    <i className={`fa-brands ${s.icon} text-white`}></i>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr className="text-white-50" />
        <span className="text-center text-white d-block">
          Made with <i className="text-danger fa-solid fa-heart"></i> for finding your dream home
        </span>
      </div>
    </section>
  );
}
