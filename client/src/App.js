import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast  from './components/Toast';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider }  from './context/AuthContext';

import Home           from './pages/Home';
import Properties     from './pages/Properties';
import Contact        from './pages/Contact';
import PropertyDetail from './pages/PropertyDetail';
import Login          from './pages/Login';
import SignUp         from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/properties"         element={<Properties />} />
          <Route path="/properties/:id"     element={<PropertyDetail />} />
          <Route path="/contact"            element={<Contact />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/signup"             element={<SignUp />} />
          <Route 
            path="/admin"             
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          {/* Catch-all */}
          <Route path="*"                   element={<Home />} />
        </Routes>
        <Footer />
        <Toast />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
