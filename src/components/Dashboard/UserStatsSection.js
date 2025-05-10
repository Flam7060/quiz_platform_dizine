import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserStatsSection = () => {
  const { currentUser } = useAuth();
  
  // Демо-данные статистики пользователя
  const [userStats, setUserStats] = useState({
    totalQuizzes: 5,
    completedQuizzes: 3,
    totalQuestions: 50,
    correctAnswers: 42,
    successRate: 84
  });
  
  return (
    <div className="stats-section">
      <div className="stats-header">
        <h3>Статистика успеваемости</h3>
        <div className="stats-period-selector">
          <button className="period-button active">Всё время</button>
          <button className="period-button">Месяц</button>
          <button className="period-button">Неделя</button>
        </div>
      </div>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{userStats.completedQuizzes}/{userStats.totalQuizzes}</div>
            <div className="stat-label">Пройдено тестов</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{userStats.correctAnswers}/{userStats.totalQuestions}</div>
            <div className="stat-label">Правильных ответов</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{userStats.successRate}%</div>
            <div className="stat-label">Успеваемость</div>
          </div>
        </div>
      </div>
      
      <div className="stats-chart">
        <h4>Динамика успеваемости</h4>
        <div className="chart-placeholder">
          <div className="chart-bars">
            <div className="chart-bar" style={{ height: '60%' }}>
              <span className="bar-value">60%</span>
            </div>
            <div className="chart-bar" style={{ height: '75%' }}>
              <span className="bar-value">75%</span>
            </div>
            <div className="chart-bar" style={{ height: '65%' }}>
              <span className="bar-value">65%</span>
            </div>
            <div className="chart-bar" style={{ height: '80%' }}>
              <span className="bar-value">80%</span>
            </div>
            <div className="chart-bar" style={{ height: '84%' }}>
              <span className="bar-value">84%</span>
            </div>
          </div>
          <div className="chart-labels">
            <span>Тест 1</span>
            <span>Тест 2</span>
            <span>Тест 3</span>
            <span>Тест 4</span>
            <span>Тест 5</span>
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h4>Недавняя активность</h4>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">
              <i className="fas fa-check"></i>
            </div>
            <div className="activity-content">
              <div className="activity-title">Тест "Базы данных" пройден</div>
              <div className="activity-time">2 дня назад</div>
            </div>
            <div className="activity-result">80%</div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon info">
              <i className="fas fa-certificate"></i>
            </div>
            <div className="activity-content">
              <div className="activity-title">Получен сертификат "Веб-разработка"</div>
              <div className="activity-time">5 дней назад</div>
            </div>
            <div className="activity-result">
              <button className="view-button">
                <i className="fas fa-eye"></i>
              </button>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon warning">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="activity-content">
              <div className="activity-title">Тест "Программирование" не завершен</div>
              <div className="activity-time">7 дней назад</div>
            </div>
            <div className="activity-result">
              <button className="continue-button">
                Продолжить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsSection;
