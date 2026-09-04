import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './index.css'; 
import heroImg from './assets/landing-1500h.png'; 

const Home = () => {
  const navigate = useNavigate(); 

  return (
    <div 
      className="hero-section" 
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div className="hero-content">
        <h1 className="hero-title">ზღაპარს ასაკი არ აქვს...</h1>
        <p className="hero-subtitle">მისგან ცხოვრების გაკვეთილებს მუდმივად მიიღებ!</p>
        
        <button 
          className="hero-btn" 
          onClick={() => navigate('/products')}
        >
          ჩვენი წიგნები
        </button>
      </div>
    </div>
  );
};

export default Home;