import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast  from './components/Toast';
import { ToastProvider } from './context/ToastContext';

import Home           from './pages/Home';
import Properties     from './pages/Properties';
import Contact        from './pages/Contact';
import PropertyDetail from './pages/PropertyDetail';

function App() {
  return (
    <ToastProvider>
      <Navbar />
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/properties"         element={<Properties />} />
        <Route path="/properties/:id"     element={<PropertyDetail />} />
        <Route path="/contact"            element={<Contact />} />
        {/* Catch-all */}
        <Route path="*"                   element={<Home />} />
      </Routes>
      <Footer />
      <Toast />
    </ToastProvider>
  );
}

export default App;
