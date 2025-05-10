import React from 'react';

const WhyUs = () => {
  return (
    <div className="home-section light">
      <div className="container">
        <div className="section-header">
          <h2>Почему выбирают нас ?</h2>
          <p className="section-description">Мы предлагаем уникальный подход к обучению и тестированию. Что делает нашу платформу особенной?</p>
        </div>
        <div className="sections-container">
          <div className="section-item">
            <div className="icon-wrapper">
              <div className="icon">🎯</div>
            </div>
            <h3>Интерактивные квизы</h3>
            <p>Увлекательные тесты и задания, которые помогают усвоить материал и проверить знания в игровой форме.</p>
            <div className="item-footer">
              <a href="#" className="learn-more">Подробнее</a>
            </div>
          </div>
          <div className="section-item">
            <div className="icon-wrapper">
              <div className="icon">📊</div>
            </div>
            <h3>Детальная аналитика</h3>
            <p>Подробная статистика по каждому тесту и отслеживание прогресса для каждого участника.</p>
            <div className="item-footer">
              <a href="#" className="learn-more">Подробнее</a>
            </div>
          </div>
          <div className="section-item">
            <div className="icon-wrapper">
              <div className="icon">💻</div>
            </div>
            <h3>Удобный интерфейс</h3>
            <p>Современный и интуитивно понятный дизайн, адаптированный для всех устройств.</p>
            <div className="item-footer">
              <a href="#" className="learn-more">Подробнее</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
