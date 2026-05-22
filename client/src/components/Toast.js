import React from 'react';
import { useToast } from '../context/ToastContext';

export default function Toast() {
  const { toast } = useToast();
  if (!toast) return null;
  return (
    <div className="toast-container-custom">
      <div className={`toast-custom toast-${toast.type}`}>
        <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'} me-2`}></i>
        {toast.message}
      </div>
    </div>
  );
}
