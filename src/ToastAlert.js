import React, { useEffect } from 'react';
import './index.css';

const ToastAlert = ({ message, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="custom-toast-alert">
      <div className="toast-icon-wrapper">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#427a5b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <span className="toast-message-text">{message}</span>
      <button onClick={onClose} className="toast-close-btn" aria-label="Close">
        ✕
      </button>
    </div>
  );
};

export default ToastAlert;