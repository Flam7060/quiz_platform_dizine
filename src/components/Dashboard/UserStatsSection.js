import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedContent from '../Common/RoleBasedContent';
import GroupStudentsPopup from './GroupStudentsPopup';

// Импортируем стили для всплывающего меню
import '../../styles/groupStudentsPopup.scss';

const UserStatsSection = () => {
  const { currentUser, ROLES } = useAuth();
  
  // Здесь можно добавить дополнительные состояния при необходимости
  
  // Демо-данные статистики для студента
  const [userStats, setUserStats] = useState({
    totalQuizzes: 5,
    completedQuizzes: 3,
    correctAnswers: 42,
    totalQuestions: 50,
    successRate: 84,
    avgResponseTime: 18.5,
    bestResponseTime: 12.3,
    currentStreak: 7,
    bestStreak: 12,
    totalCorrectStreaks: 3,
    // Данные об успеваемости в группе
    groupStats: {
      groupName: 'Группа 101',
      groupAvg: 76,
      position: 3,
      totalStudents: 25,
      topStudentScore: 92,
      bottomStudentScore: 45
    },
    // Данные об успеваемости среди всех групп
    allGroupsStats: {
      totalGroups: 3,
      totalStudents: 65,
      overallAvg: 74,
      position: 8,
      percentile: 88 // процентиль успеваемости
    }
  });
  
  // Демо-данные статистики для преподавателя
  const [teacherStats, setTeacherStats] = useState({
    // Статистика по группам
    groups: [
      { id: 1, name: 'Группа 101', studentsCount: 25, avgScore: 78, needAttention: 3 },
      { id: 2, name: 'Группа 202', studentsCount: 18, avgScore: 85, needAttention: 1 },
      { id: 3, name: 'Группа 303', studentsCount: 22, avgScore: 67, needAttention: 5 }
    ],
    // Студенты, требующие внимания
    studentsNeedingAttention: [
      { id: 1, name: 'Иванов Иван', group: 'Группа 101', avgScore: 45, lastActivity: '3 дня назад' },
      { id: 2, name: 'Петрова Анна', group: 'Группа 303', avgScore: 38, lastActivity: '5 дней назад' },
      { id: 3, name: 'Сидоров Алексей', group: 'Группа 303', avgScore: 42, lastActivity: '2 дня назад' },
      { id: 4, name: 'Козлова Мария', group: 'Группа 303', avgScore: 40, lastActivity: '1 день назад' },
      { id: 5, name: 'Новиков Дмитрий', group: 'Группа 101', avgScore: 48, lastActivity: '4 дня назад' }
    ],
    // Статистика по тестам
    tests: [
      { id: 1, name: 'Основы программирования', completionRate: 92, avgScore: 76 },
      { id: 2, name: 'Базы данных', completionRate: 85, avgScore: 82 },
      { id: 3, name: 'Веб-разработка', completionRate: 78, avgScore: 68 }
    ]
  });
  
  // Активная вкладка для преподавателя
  const [activeTab, setActiveTab] = useState('groups');
  
  // Состояние для отслеживания всплывающего меню
  const [popupState, setPopupState] = useState({
    isOpen: false,
    group: null,
    position: { top: 0, left: 0 }
  });
  
  // Ссылки на кнопки для позиционирования попапа
  const buttonRefs = useRef({});
  
  // Функция для открытия всплывающего меню
  const openPopup = (group, groupId) => {
    setPopupState({
      isOpen: true,
      group
    });
  };
  
  // Функция для закрытия всплывающего меню
  const closePopup = () => {
    setPopupState(prev => ({ ...prev, isOpen: false }));
  };
  
  return (
    <div className="stats-section">
      {/* Статистика для студентов */}
      <RoleBasedContent roles={ROLES.STUDENT}>
        <div className="stats-header">
          <h3>Статистика успеваемости</h3>
          <div className="stats-period-selector">
            <button className="period-button active">Всё время</button>
            <button className="period-button">Месяц</button>
            <button className="period-button">Неделя</button>
          </div>
        </div>
        
        <div className="stats-cards-container">
          <div className="stats-cards-header">
            <h4>Общая статистика</h4>
            <div className="stats-time-period">
              <span>За последний месяц</span>
              <i className="fas fa-calendar-alt"></i>
            </div>
          </div>
          
          <div className="stats-cards">
            <div className="stat-card with-ranking">
              <div className="stat-header">
                <div className="stat-icon ranking">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="stat-title">Место в группе</div>
              </div>
              <div className="stat-content">
                <div className="stat-main-value">{userStats.groupStats.position} из {userStats.groupStats.totalStudents}</div>
                <div className="stat-divider"></div>
                <div className="ranking-indicator">
                  <div className="position-badge">
                    <span className="position-number">{userStats.groupStats.position}</span>
                    <div className="position-medal">
                      {userStats.groupStats.position === 1 && <i className="fas fa-medal gold"></i>}
                      {userStats.groupStats.position === 2 && <i className="fas fa-medal silver"></i>}
                      {userStats.groupStats.position === 3 && <i className="fas fa-medal bronze"></i>}
                    </div>
                  </div>
                </div>
                <div className="stat-secondary">
                  <span className="stat-label">Успеваемость:</span>
                  <span className="stat-value">{userStats.successRate}%</span>
                </div>
              </div>
            </div>
            
            <div className="stat-card with-progress">
              <div className="stat-header">
                <div className="stat-icon time">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-title">Время ответа</div>
              </div>
              <div className="stat-content">
                <div className="stat-main-value">{userStats.avgResponseTime} сек.</div>
                <div className="stat-divider"></div>
                <div className="stat-progress">
                  <div 
                    className={`progress-bar ${userStats.avgResponseTime < 15 ? 'fast' : userStats.avgResponseTime < 25 ? 'medium' : 'slow'}`}
                    style={{ 
                      width: `${Math.min(100, Math.max(0, 100 - (userStats.avgResponseTime / 30) * 100))}%`
                    }}
                  ></div>
                </div>
                <div className="stat-secondary">
                  <span className="stat-label">Лучшее время:</span>
                  <span className="stat-value">{userStats.bestResponseTime} сек.</span>
                </div>
              </div>
            </div>
            
            <div className="stat-card with-streak">
              <div className="stat-header">
                <div className="stat-icon streak">
                  <i className="fas fa-fire"></i>
                </div>
                <div className="stat-title">Стрик</div>
              </div>
              <div className="stat-content">
                <div className="stat-main-value">{userStats.currentStreak} подряд</div>
                <div className="stat-divider"></div>
                <div className="streak-indicator">
                  <div className="streak-flames">
                    {[...Array(Math.min(5, userStats.currentStreak))].map((_, i) => (
                      <i key={i} className="fas fa-fire" style={{ fontSize: `${100 + i * 20}%`, opacity: 0.7 + i * 0.06 }}></i>
                    ))}
                  </div>
                </div>
                <div className="stat-secondary">
                  <span className="stat-label">Лучший стрик:</span>
                  <span className="stat-value">{userStats.bestStreak} подряд</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Динамика успеваемости */}
        <div className="stats-chart-container">
          <div className="stats-chart-header">
            <h4>Динамика успеваемости</h4>
          </div>
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
      </RoleBasedContent>
      
      {/* Статистика для преподавателей и администраторов */}
      <RoleBasedContent roles={[ROLES.TEACHER, ROLES.ADMIN]}>
        <div className="stats-header teacher-stats-header">
          <h3>Статистика преподавателя</h3>
          <div className="teacher-tabs">
            <button 
              className={`teacher-tab ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              <i className="fas fa-users"></i> Группы
            </button>
            <button 
              className={`teacher-tab ${activeTab === 'tests' ? 'active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              <i className="fas fa-tasks"></i> Тесты
            </button>
          </div>
        </div>
        
        {/* Вкладка "Группы" */}
        {activeTab === 'groups' && (
          <div className="teacher-groups-section">
            <div className="stats-cards">
              {teacherStats.groups.map(group => (
                <div className="stat-card group-card" key={group.id}>
                  <div className="group-card-header">
                    <h4>{group.name}</h4>
                    <span className="student-count">{group.studentsCount} студентов</span>
                  </div>
                  <div className="group-card-stats">
                    <div className="group-stat">
                      <div className="group-stat-value">{group.avgScore}%</div>
                      <div className="group-stat-label">Средняя успеваемость</div>
                    </div>
                    <div className="group-stat">
                      <div className="group-stat-value">{group.needAttention}</div>
                      <div className="group-stat-label">Требуют внимания</div>
                    </div>
                  </div>
                  <button 
                    className="view-group-button"
                    onClick={() => openPopup(group, group.id)}
                    ref={el => buttonRefs.current[group.id] = el}
                  >
                    Список студентов
                  </button>
                </div>
              ))}
            </div>
            
            <div className="attention-section">
              <h4>Студенты, требующие внимания</h4>
              <div className="attention-students-list">
                {teacherStats.studentsNeedingAttention.map(student => (
                  <div className="attention-student-item" key={student.id}>
                    <div className="student-info">
                      <div className="student-name">{student.name}</div>
                      <div className="student-group">{student.group}</div>
                    </div>
                    <div className="student-stats">
                      <div className="student-score">
                        <span className="score-value">{student.avgScore}%</span>
                        <span className="score-label">Успеваемость</span>
                      </div>
                      <div className="student-activity">
                        <span className="activity-value">{student.lastActivity}</span>
                        <span className="activity-label">Последняя активность</span>
                      </div>
                    </div>
                    <button className="contact-student-button">
                      <i className="fas fa-envelope"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="group-performance-chart">
              <h4>Рейтинг групп по успеваемости</h4>
              <div className="chart-placeholder horizontal-chart">
                <div className="horizontal-bars">
                  {teacherStats.groups.sort((a, b) => b.avgScore - a.avgScore).map(group => (
                    <div className="horizontal-bar-container" key={group.id}>
                      <div className="horizontal-bar-label">{group.name}</div>
                      <div className="horizontal-bar-wrapper">
                        <div 
                          className="horizontal-bar" 
                          style={{ width: `${group.avgScore}%` }}
                        >
                          <span className="horizontal-bar-value">{group.avgScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Вкладка "Тесты" */}
        {activeTab === 'tests' && (
          <div className="teacher-tests-section">
            <div className="stats-cards">
              {teacherStats.tests.map(test => (
                <div className="stat-card test-card" key={test.id}>
                  <div className="test-card-header">
                    <h4>{test.name}</h4>
                  </div>
                  <div className="test-card-stats">
                    <div className="test-stat">
                      <div className="test-stat-value">{test.completionRate}%</div>
                      <div className="test-stat-label">Процент завершения</div>
                    </div>
                    <div className="test-stat">
                      <div className="test-stat-value">{test.avgScore}%</div>
                      <div className="test-stat-label">Средний балл</div>
                    </div>
                  </div>
                  <div className="test-card-actions">
                    <button className="view-results-button">Результаты</button>
                    <button className="edit-test-button">Редактировать</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="test-performance-chart">
              <h4>Сравнение результатов тестов</h4>
              <div className="chart-placeholder">
                <div className="chart-bars">
                  {teacherStats.tests.map(test => (
                    <div className="chart-bar" key={test.id} style={{ height: `${test.avgScore}%` }}>
                      <span className="bar-value">{test.avgScore}%</span>
                    </div>
                  ))}
                </div>
                <div className="chart-labels">
                  {teacherStats.tests.map(test => (
                    <span key={test.id}>{test.name.length > 10 ? test.name.substring(0, 10) + '...' : test.name}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="create-test-section">
              <button className="create-test-button">
                <i className="fas fa-plus"></i> Создать новый тест
              </button>
            </div>
          </div>
        )}
      </RoleBasedContent>
      
      {/* Всплывающее меню со списком студентов */}
      {popupState.isOpen && popupState.group && (
        <GroupStudentsPopup 
          group={popupState.group}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default UserStatsSection;
