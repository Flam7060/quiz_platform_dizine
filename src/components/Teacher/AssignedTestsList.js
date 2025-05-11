import React, { useState } from 'react';
import { FaCalendarAlt, FaUsers, FaChevronDown, FaChevronUp, FaUserCheck, FaClock } from 'react-icons/fa';

const AssignedTestsList = () => {
  // Состояние для отслеживания активной вкладки
  const [activeTab, setActiveTab] = useState('active');
  
  // Моковые данные для назначенных тестов
  const assignedTests = [
    {
      id: 'at1',
      title: 'Математика: Базовый уровень',
      type: 'test',
      status: 'active',
      startDate: '2025-05-10T10:00:00',
      endDate: '2025-05-20T23:59:00',
      groups: ['Группа 101', 'Группа 102'],
      studentsCount: 42,
      completedCount: 15,
      selectedUsers: false,
      users: []
    },
    {
      id: 'at2',
      title: 'Физика: Механика',
      type: 'test',
      status: 'active',
      startDate: '2025-05-12T09:00:00',
      endDate: '2025-05-18T23:59:00',
      groups: ['Группа 201'],
      studentsCount: 18,
      completedCount: 5,
      selectedUsers: true,
      users: [
        { id: 'u6', name: 'Смирнов Дмитрий' },
        { id: 'u7', name: 'Волкова Мария' },
        { id: 'u8', name: 'Кузнецов Андрей' }
      ]
    },
    {
      id: 'at3',
      title: 'Музыкальный квиз',
      type: 'quiz',
      status: 'active',
      registrationStart: '2025-05-15T14:30:00',
      quizStart: '2025-05-15T15:00:00',
      groups: ['Группа 101', 'Группа 201'],
      studentsCount: 36,
      completedCount: 0,
      selectedUsers: true,
      users: [
        { id: 'u1', name: 'Иванов Иван' },
        { id: 'u4', name: 'Козлов Алексей' },
        { id: 'u5', name: 'Новикова Екатерина' },
        { id: 'u7', name: 'Волкова Мария' }
      ]
    },
    {
      id: 'at4',
      title: 'Домашнее задание по литературе',
      type: 'homework',
      status: 'completed',
      startDate: '2025-04-20T00:00:00',
      endDate: '2025-05-01T23:59:00',
      groups: ['Группа 102'],
      studentsCount: 24,
      completedCount: 22,
      selectedUsers: false,
      users: []
    },
    {
      id: 'at5',
      title: 'Информатика: Алгоритмы',
      type: 'test',
      status: 'completed',
      startDate: '2025-04-15T00:00:00',
      endDate: '2025-04-25T23:59:00',
      groups: ['Группа 201'],
      studentsCount: 18,
      completedCount: 18,
      selectedUsers: false,
      users: []
    }
  ];
  
  // Фильтрация тестов по статусу (активные/завершенные)
  const filteredTests = assignedTests.filter(test => 
    activeTab === 'active' ? test.status === 'active' : test.status === 'completed'
  );
  
  // Состояние для отслеживания карточки, над которой находится курсор
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Получение типа теста на русском
  const getTestTypeText = (type) => {
    switch(type) {
      case 'test': return 'Тест';
      case 'quiz': return 'Квиз';
      case 'homework': return 'Домашнее задание';
      default: return 'Неизвестный тип';
    }
  };
  
  // Получение прогресса в процентах
  const getProgressPercent = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  return (
    <div className="assigned-tests-section">
      <div className="section-header">
        <h3>Назначенные тесты</h3>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Активные
          </button>
          <button 
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Завершенные
          </button>
        </div>
      </div>
      
      <div className="assigned-tests-list">
        {filteredTests.length > 0 ? (
          filteredTests.map(test => (
            <div 
              key={test.id} 
              className={`assigned-test-card ${test.type}`}
              onMouseEnter={() => setHoveredCard(test.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="test-header">
                <div className="test-type-badge">{getTestTypeText(test.type)}</div>
                <h4 className="test-title">{test.title}</h4>
                {test.selectedUsers && (
                  <div className="selected-users-indicator">
                    <FaUserCheck title="Выбраны отдельные пользователи" />
                  </div>
                )}
              </div>
              
              <div className="test-details">
                {/* Разные даты для разных типов тестов */}
                {test.type === 'quiz' ? (
                  <div className="test-dates compact">
                    <div className="date-item">
                      <FaCalendarAlt />
                      <span>Регистрация: {formatDate(test.registrationStart)}</span>
                    </div>
                    <div className="date-item">
                      <FaClock />
                      <span>Начало квиза: {formatDate(test.quizStart)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="test-dates compact">
                    <div className="date-item">
                      <FaCalendarAlt />
                      <span>Начало: {formatDate(test.startDate)}</span>
                    </div>
                    <div className="date-item">
                      <FaCalendarAlt />
                      <span>Окончание: {formatDate(test.endDate)}</span>
                    </div>
                  </div>
                )}
                
                <div className="test-info-row">
                  <div className="test-groups compact">
                    <FaUsers />
                    <span>{test.groups.length > 1 ? `${test.groups.length} группы` : '1 группа'}</span>
                  </div>
                  
                  <div className="test-progress compact">
                    <div className="progress-label">
                      Прогресс: {getProgressPercent(test.completedCount, test.studentsCount)}%
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${getProgressPercent(test.completedCount, test.studentsCount)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Всплывающий список выбранных пользователей */}
              {hoveredCard === test.id && test.selectedUsers && test.users.length > 0 && (
                <div className="selected-users-popup">
                  <div className="popup-header">
                    <FaUserCheck />
                    <span>Выбранные пользователи:</span>
                  </div>
                  <ul className="users-list">
                    {test.users.map(user => (
                      <li key={user.id}>{user.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="test-actions">
                <button className="view-results-button">
                  Результаты
                </button>
                {activeTab === 'active' && (
                  <button className="edit-test-button">
                    Изменить
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-tests-message">
            {activeTab === 'active' 
              ? 'У вас нет активных назначенных тестов' 
              : 'У вас нет завершенных тестов'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedTestsList;
