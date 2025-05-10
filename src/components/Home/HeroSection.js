import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="hero-section">
      <div className="hero-overlay"></div>
      <div className="decoration-square"></div>
      <div className="decoration-dots"></div>
      <div className="container">
        <div className="hero-logo">
          <h2>КВИЗУМ</h2>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">Интерактивное обучение</div>
            <h1>Готовы поднять свои знания на новый уровень?</h1>
            <p>КВИЗУМ — это платформа, которая поможет вам создавать интерактивные тесты, отслеживать прогресс учащихся и анализировать результаты. Создавайте увлекательные квизы и делитесь ими с учениками.</p>
            
            <div className="hero-buttons">
              {currentUser ? (
                <Link to="/dashboard" className="hero-button primary">Начать работу</Link>
              ) : (
                <>
                  <Link to="/login" className="hero-button primary">Войти</Link>
                  <a href="#why-us" className="hero-button secondary">Узнать больше</a>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <img src="https://cdn.pixabay.com/photo/2018/09/04/10/27/learn-3653430_1280.jpg" alt="Онлайн обучение" />
          </div>
        </div>
        

      </div>
    </div>
  );
};

export default HeroSection;
