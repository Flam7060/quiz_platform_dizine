import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '../../contexts/QuizContext';

const QuizList = () => {
  // Используем контекст тестов
  const { quizzes, loading, error, filterQuizzes } = useQuiz();
  // Состояние для фильтрации тестов
  const [filter, setFilter] = useState('all');

  // Фильтрация тестов по статусу
  const filteredQuizzes = filterQuizzes(filter);

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

  // Определение действия для кнопки в зависимости от статуса
  const getActionButton = (quiz) => {
    switch (quiz.status) {
      case 'active':
        return (
          <Link to={`/quiz/${quiz.id}`} className="quiz-action-button start-button">
            Начать
          </Link>
        );
      case 'upcoming':
        return (
          <button className="quiz-action-button upcoming-button" disabled>
            Ожидается
          </button>
        );
      case 'completed':
        return (
          <Link to={`/quiz/${quiz.id}/results`} className="quiz-action-button results-button">
            Результаты
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <div className="quiz-list-container">
      <div className="quiz-list-header">
        <h2>Доступные тесты</h2>
        <div className="quiz-filters">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button 
            className={`filter-button ${filter === 'active' ? 'active' : ''}`} 
            onClick={() => setFilter('active')}
          >
            Активные
          </button>
          <button 
            className={`filter-button ${filter === 'upcoming' ? 'active' : ''}`} 
            onClick={() => setFilter('upcoming')}
          >
            Предстоящие
          </button>
          <button 
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`} 
            onClick={() => setFilter('completed')}
          >
            Завершенные
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Загрузка тестов...</div>
      ) : error ? (
        <div className="error-message">Ошибка при загрузке тестов: {error}</div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="no-quizzes-message">Нет доступных тестов в данной категории</div>
      ) : (
        <div className="quiz-list">
          {filteredQuizzes.map(quiz => (
            <div key={quiz.id} className={`quiz-item ${getStatusClass(quiz.status)}`}>
              <div className="quiz-item-header">
                <h3 className="quiz-title">{quiz.title}</h3>
                <span className={`quiz-status ${getStatusClass(quiz.status)}`}>
                  {getStatusText(quiz.status)}
                </span>
              </div>
              <p className="quiz-description">{quiz.description}</p>
              <div className="quiz-details">
                <div className="quiz-time-limit">
                  <span className="detail-label">Время на выполнение:</span>
                  <span className="detail-value">{quiz.timeLimit} мин</span>
                </div>
                <div className="quiz-dates">
                  <span className="detail-label">Доступен:</span>
                  <span className="detail-value">
                    {formatDate(quiz.startDate)} - {formatDate(quiz.endDate)}
                  </span>
                </div>
                {quiz.status === 'completed' && quiz.score && (
                  <div className="quiz-score">
                    <span className="detail-label">Результат:</span>
                    <span className="detail-value">
                      {quiz.score} из {quiz.maxScore} ({Math.round(quiz.score / quiz.maxScore * 100)}%)
                    </span>
                  </div>
                )}
                {quiz.status === 'active' && quiz.completed && (
                  <Link to={`/quiz/${quiz.id}/results`} className="view-results-btn">
                    Результаты
                  </Link>
                )}
                {quiz.status === 'upcoming' && (
                  <button className="upcoming-quiz-btn" disabled>
                    Скоро будет доступен
                  </button>
                )}
                {quiz.status === 'expired' && (
                  <button className="expired-quiz-btn" disabled>
                    Время истекло
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
