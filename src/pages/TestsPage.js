import React, { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { useNavigate } from 'react-router-dom';
import DashboardNav from '../components/Dashboard/DashboardNav';

const TestsPage = () => {
  const navigate = useNavigate();
  const { quizzes, loading, error } = useQuiz();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Переход на страницу создания теста
  const handleCreateTest = () => {
    navigate('/dashboard/tests/create');
  };
  
  // Фильтрация тестов по статусу и поисковому запросу
  const filteredQuizzes = quizzes.filter(quiz => {
    // Фильтрация по статусу
    if (activeTab !== 'all' && quiz.status !== activeTab) {
      return false;
    }
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        quiz.title.toLowerCase().includes(query) ||
        quiz.description.toLowerCase().includes(query) ||
        quiz.createdBy.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Сортировка тестов
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'date':
        comparison = new Date(a.startDate) - new Date(b.startDate);
        break;
      case 'duration':
        comparison = a.duration - b.duration;
        break;
      case 'questions':
        comparison = a.questionCount - b.questionCount;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  // Форматирование даты
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Определение статуса теста для отображения
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'upcoming':
        return 'Предстоит';
      case 'completed':
        return 'Завершен';
      default:
        return 'Неизвестно';
    }
  };
  
  // Определение класса для статуса теста
  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'quiz-status-active';
      case 'upcoming':
        return 'quiz-status-upcoming';
      case 'completed':
        return 'quiz-status-completed';
      default:
        return '';
    }
  };
  
  // Обработчик изменения сортировки
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Если уже сортируем по этому полю, меняем порядок
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Иначе устанавливаем новое поле сортировки
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  return (
    <div className="dashboard">
      <DashboardNav />
      
      <div className="dashboard-content">
        <div className="tests-page">
          <div className="tests-header">
            <div className="tests-title-row">
              <h2>Все тесты</h2>
              <button className="btn btn-primary create-test-btn" onClick={handleCreateTest}>
                <i className="fas fa-plus"></i> Создать тест
              </button>
            </div>
            <div className="tests-actions">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Поиск тестов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
              
              <div className="filter-tabs">
                <button
                  className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  Все
                </button>
                <button
                  className={`filter-tab ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => setActiveTab('active')}
                >
                  Активные
                </button>
                <button
                  className={`filter-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Предстоящие
                </button>
                <button
                  className={`filter-tab ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  Завершенные
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Загрузка тестов...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>Произошла ошибка при загрузке тестов. Пожалуйста, попробуйте позже.</p>
            </div>
          ) : sortedQuizzes.length === 0 ? (
            <div className="empty-tests">
              <i className="fas fa-search"></i>
              <p>Тесты не найдены. Попробуйте изменить параметры поиска или фильтрации.</p>
            </div>
          ) : (
            <div className="tests-table-container">
              <table className="tests-table">
                <thead>
                  <tr>
                    <th className={`sortable ${sortBy === 'title' ? `sorted-${sortOrder}` : ''}`} onClick={() => handleSortChange('title')}>
                      Название теста
                      <i className="fas fa-sort"></i>
                    </th>
                    <th>Статус</th>
                    <th className={`sortable ${sortBy === 'date' ? `sorted-${sortOrder}` : ''}`} onClick={() => handleSortChange('date')}>
                      Дата
                      <i className="fas fa-sort"></i>
                    </th>
                    <th className={`sortable ${sortBy === 'duration' ? `sorted-${sortOrder}` : ''}`} onClick={() => handleSortChange('duration')}>
                      Длительность
                      <i className="fas fa-sort"></i>
                    </th>
                    <th className={`sortable ${sortBy === 'questions' ? `sorted-${sortOrder}` : ''}`} onClick={() => handleSortChange('questions')}>
                      Вопросов
                      <i className="fas fa-sort"></i>
                    </th>
                    <th>Автор</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedQuizzes.map(quiz => (
                    <tr key={quiz.id}>
                      <td className="quiz-title-cell">
                        <div className="quiz-title">{quiz.title}</div>
                        <div className="quiz-description">{quiz.description}</div>
                      </td>
                      <td>
                        <span className={`quiz-status ${getStatusClass(quiz.status)}`}>
                          {getStatusText(quiz.status)}
                        </span>
                      </td>
                      <td>{formatDate(quiz.startDate)}</td>
                      <td>{quiz.duration} мин</td>
                      <td>{quiz.questionCount}</td>
                      <td>{quiz.createdBy}</td>
                      <td className="actions-cell">
                        {quiz.status === 'active' && (
                          <button className="action-button start-button">
                            <i className="fas fa-play"></i> Начать
                          </button>
                        )}
                        {quiz.status === 'upcoming' && (
                          <button className="action-button info-button">
                            <i className="fas fa-info-circle"></i> Подробнее
                          </button>
                        )}
                        {quiz.status === 'completed' && (
                          <button className="action-button results-button">
                            <i className="fas fa-chart-bar"></i> Результаты
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestsPage;
