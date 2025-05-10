import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const QuizResults = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Получаем результаты из state или загружаем с сервера
  useEffect(() => {
    if (location.state?.score !== undefined) {
      // Если результаты переданы через state (после прохождения теста)
      setQuizResults({
        quizId,
        score: location.state.score,
        answers: location.state.answers,
        totalQuestions: location.state.totalQuestions,
        completedAt: new Date().toISOString()
      });
      setLoading(false);
    } else {
      // В реальном приложении здесь будет API запрос для получения результатов
      // Имитация загрузки результатов
      setTimeout(() => {
        const mockResults = {
          quizId,
          score: 85,
          correctAnswers: 17,
          totalQuestions: 20,
          completedAt: new Date().toISOString(),
          timeSpent: '25:42',
          feedback: 'Хороший результат! Обратите внимание на темы: Рекурсия, Алгоритмы сортировки.'
        };
        
        setQuizResults(mockResults);
        setLoading(false);
      }, 1000);
    }
  }, [quizId, location.state]);
  
  // Определение категории результата
  const getScoreCategory = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'average';
    return 'poor';
  };
  
  if (loading) {
    return <div className="loading">Загрузка результатов...</div>;
  }
  
  return (
    <div className="quiz-results-container">
      <div className="results-header">
        <h2>Результаты теста</h2>
        <div className="completion-date">
          Завершено: {new Date(quizResults.completedAt).toLocaleString('ru-RU')}
        </div>
      </div>
      
      <div className="score-overview">
        <div className={`score-circle ${getScoreCategory(quizResults.score)}`}>
          <div className="score-value">{quizResults.score}%</div>
        </div>
        
        <div className="score-details">
          <div className="score-detail-item">
            <span className="detail-label">Правильных ответов:</span>
            <span className="detail-value">
              {quizResults.correctAnswers || Math.round(quizResults.score * quizResults.totalQuestions / 100)} из {quizResults.totalQuestions}
            </span>
          </div>
          
          {quizResults.timeSpent && (
            <div className="score-detail-item">
              <span className="detail-label">Затраченное время:</span>
              <span className="detail-value">{quizResults.timeSpent}</span>
            </div>
          )}
        </div>
      </div>
      
      {quizResults.feedback && (
        <div className="feedback-section">
          <h3>Комментарий преподавателя</h3>
          <div className="feedback-content">
            {quizResults.feedback}
          </div>
        </div>
      )}
      
      <div className="results-actions">
        <Link to="/dashboard" className="back-to-dashboard-btn">
          Вернуться к списку тестов
        </Link>
        
        {quizResults.canRetake && (
          <Link to={`/quiz/${quizId}`} className="retake-quiz-btn">
            Пройти тест повторно
          </Link>
        )}
      </div>
      
      <div className="performance-analysis">
        <h3>Анализ результатов</h3>
        
        <div className="performance-chart">
          {/* Здесь в реальном приложении будет график или диаграмма */}
          <div className="chart-placeholder">
            <div className="chart-bar-container">
              <div className="chart-category">Основы программирования</div>
              <div className="chart-bar">
                <div className="chart-fill" style={{ width: '90%' }}></div>
                <span className="chart-value">90%</span>
              </div>
            </div>
            
            <div className="chart-bar-container">
              <div className="chart-category">Алгоритмы</div>
              <div className="chart-bar">
                <div className="chart-fill" style={{ width: '75%' }}></div>
                <span className="chart-value">75%</span>
              </div>
            </div>
            
            <div className="chart-bar-container">
              <div className="chart-category">Структуры данных</div>
              <div className="chart-bar">
                <div className="chart-fill" style={{ width: '80%' }}></div>
                <span className="chart-value">80%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="improvement-suggestions">
          <h4>Рекомендации по улучшению</h4>
          <ul className="suggestions-list">
            <li>Изучите дополнительные материалы по теме "Рекурсия"</li>
            <li>Попрактикуйтесь в реализации алгоритмов сортировки</li>
            <li>Пройдите тренировочные тесты по структурам данных</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
