import React from 'react';

const AdditionalSections = () => {
  return (
    <div className="home-section dark">
      <div className="container">
        <h2>Дополнительные возможности</h2>
        <div className="additional-sections">
          <p className="section-note">Попробуйте наши уникальные функции</p>
          
          <div className="section-item">
            <h3>Групповые соревнования</h3>
            <p>Создавайте команды и соревнуйтесь с другими участниками в реальном времени.</p>
          </div>
          
          <div className="section-item">
            <h3>Персонализированное обучение</h3>
            <p>Система адаптируется к вашему уровню знаний и предлагает оптимальные задания.</p>
          </div>
          
          <div className="section-item">
            <h3>Интеграция с образовательными платформами</h3>
            <p>Легко интегрируется с популярными LMS и образовательными системами.</p>
          </div>
          
          <div className="section-item">
            <h3>Мобильное приложение</h3>
            <p>Доступ к квизам и материалам в любое время с мобильного устройства.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalSections;
