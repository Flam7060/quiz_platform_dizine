import React, { useState } from 'react';

const ActiveTests = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="tests-section">
      <div className="section-header">
        <h3>Активные тесты</h3>
        <div className={`toggle-icon ${!isExpanded ? 'collapsed' : ''}`} onClick={toggleExpand}>
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="tests-list">
          <div className="test-card">
            <div className="test-header">
              <h4>Тесты к лекциям</h4>
            </div>
            <ul className="test-items">
              <li>
                <span>Основы программирования</span>
                <div className="status-icon red"></div>
              </li>
              <li>
                <span>Алгоритмы и структуры данных</span>
                <div className="status-icon green"></div>
              </li>
              <li>
                <span>Объектно-ориентированное программирование</span>
                <div className="status-icon red"></div>
              </li>
              <li>
                <span>Базы данных</span>
                <div className="status-icon green"></div>
              </li>
              <li>
                <span>Веб-разработка</span>
                <div className="status-icon red"></div>
              </li>
            </ul>
          </div>
          
          <div className="test-card">
            <div className="test-header">
              <h4>Практические задания</h4>
            </div>
            <ul className="test-items">
              <li>
                <span>Разработка алгоритма сортировки</span>
                <div className="status-icon green"></div>
              </li>
              <li>
                <span>Создание простого веб-приложения</span>
                <div className="status-icon green"></div>
              </li>
              <li>
                <span>Работа с API</span>
                <div className="status-icon red"></div>
              </li>
              <li>
                <span>Разработка мобильного приложения</span>
                <div className="status-icon green"></div>
              </li>
            </ul>
          </div>
        </div>
      )}
      
      {!isExpanded && (
        <div className="collapsed-message">
          <p>Нет активных тестов для отображения</p>
        </div>
      )}
    </div>
  );
};

export default ActiveTests;
