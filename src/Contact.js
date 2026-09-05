import React, { useState, useEffect } from 'react';
import './index.css'; 
import { API_URL } from './config';

const ToastAlert = ({ message, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="custom-toast-alert">
      <div className="toast-icon-wrapper">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#427a5b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <span className="toast-message-text">{message}</span>
      <button onClick={onClose} className="toast-close-btn" aria-label="Close">✕</button>
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToastMessage('შეტყობინება წარმატებით გაიგზავნა!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setToastMessage('შეცდომა! გთხოვთ სცადოთ მოგვიანებით.');
      }
    } catch (error) {
      setToastMessage('სერვერთან დაკავშირება ვერ მოხერხდა.');
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  return (
    <div className="contact-page-container">
      <ToastAlert message={toastMessage} isOpen={showToast} onClose={() => setShowToast(false)} />

      <div className="contact-grid-wrapper">
        <div className="contact-info-column">
          <a href="mailto:info@ariki.ge" className="contact-link-item">info@ariki.ge</a>
          <a href="tel:+995599468001" className="contact-link-item-number">+995 599 46 80 01</a>
        </div>

        <form className="contact-form-column" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="სახელი" className="contact-input-field" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="ელ-ფოსტა" className="contact-input-field" value={formData.email} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="ტელეფონი" className="contact-input-field" value={formData.phone} onChange={handleChange} />
          <textarea name="message" placeholder="შეტყობინება" className="contact-input-field contact-textarea-field" rows="6" value={formData.message} onChange={handleChange} required />
          
          <div className="contact-btn-row">
            <button type="submit" className="contact-submit-btn" disabled={loading}>
              {loading ? 'იგზავნება...' : 'გაგზავნა'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;