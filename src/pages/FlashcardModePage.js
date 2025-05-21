import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/question-card.scss';

const FlashcardModePage = () => {
  // Пример данных вопросов для флэш-карточек
  const sampleQuestions = [
    {
      id: 'q1',
      number: 1,
      text: 'Какой язык программирования используется для создания интерактивных веб-страниц?',
      answer: 'JavaScript',
      explanation: 'JavaScript - это язык программирования, который позволяет создавать интерактивные элементы на веб-страницах.'
    },
    {
      id: 'q2',
      number: 2,
      text: 'Назовите три популярных JavaScript-фреймворка для разработки веб-приложений.',
      answer: 'React, Vue.js, Angular',
      explanation: 'React, Vue.js и Angular - это популярные JavaScript-фреймворки для разработки веб-приложений.'
    },
    {
      id: 'q3',
      number: 3,
      text: 'Какая функция в JavaScript используется для вывода сообщения в консоль браузера?',
      answer: 'console.log()',
      explanation: 'console.log() - это функция JavaScript, которая выводит сообщение в консоль браузера.'
    },
    {
      id: 'q4',
      number: 4,
      text: 'Какой метод HTTP обычно используется для получения данных с сервера?',
      answer: 'GET',
      explanation: 'GET - это метод HTTP, который используется для запроса данных с сервера.'
    },
    {
      id: 'q5',
      number: 5,
      text: 'Перечислите технологии, которые относятся к фронтенд-разработке.',
      answer: 'HTML, CSS, JavaScript, React, Vue.js, Angular и др.',
      explanation: 'HTML, CSS и JavaScript-фреймворки (React, Vue.js, Angular) используются для создания пользовательского интерфейса и относятся к фронтенд-разработке.'
    }
  ];

  // Состояния
  const [questions, setQuestions] = useState(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratings, setRatings] = useState({});
  const [studyCompleted, setStudyCompleted] = useState(false);
  const [studyMode, setStudyMode] = useState('all'); // 'all', 'difficult', 'random'
  const [studyQueue, setStudyQueue] = useState([]);

  // Эффект для инициализации очереди изучения
  useEffect(() => {
    initializeStudyQueue();
  }, [studyMode]);

  // Инициализация очереди изучения в зависимости от режима
  const initializeStudyQueue = () => {
    let queue = [];
    
    switch (studyMode) {
      case 'difficult':
        // Фильтруем вопросы, которые были оценены как сложные
        queue = questions
          .filter(q => ratings[q.id] === 'hard')
          .map(q => questions.findIndex(question => question.id === q.id));
        
        // Если нет сложных вопросов, добавляем те, которые оценены как средние
        if (queue.length === 0) {
          queue = questions
            .filter(q => ratings[q.id] === 'medium')
            .map(q => questions.findIndex(question => question.id === q.id));
        }
        
        // Если все еще нет вопросов, используем все
        if (queue.length === 0) {
          queue = Array.from({ length: questions.length }, (_, i) => i);
        }
        break;
      
      case 'random':
        // Создаем массив индексов и перемешиваем его
        queue = Array.from({ length: questions.length }, (_, i) => i);
        for (let i = queue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [queue[i], queue[j]] = [queue[j], queue[i]];
        }
        break;
      
      case 'all':
      default:
        // Используем все вопросы по порядку
        queue = Array.from({ length: questions.length }, (_, i) => i);
        break;
    }
    
    setStudyQueue(queue);
    setCurrentQuestionIndex(queue.length > 0 ? queue[0] : 0);
    setIsFlipped(false);
  };

  // Обработчик переворота карточки
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Обработчик оценки знания
  const handleRateKnowledge = (rating) => {
    // Сохраняем оценку текущего вопроса
    setRatings(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: rating
    }));
    
    // Переходим к следующему вопросу
    handleNextCard();
  };

  // Переход к следующей карточке
  const handleNextCard = () => {
    // Находим текущий индекс в очереди
    const currentQueueIndex = studyQueue.findIndex(index => index === currentQuestionIndex);
    
    // Если это последняя карточка, завершаем изучение
    if (currentQueueIndex === studyQueue.length - 1) {
      setStudyCompleted(true);
      return;
    }
    
    // Переходим к следующей карточке в очереди
    setCurrentQuestionIndex(studyQueue[currentQueueIndex + 1]);
    setIsFlipped(false);
  };

  // Переход к предыдущей карточке
  const handlePrevCard = () => {
    // Находим текущий индекс в очереди
    const currentQueueIndex = studyQueue.findIndex(index => index === currentQuestionIndex);
    
    // Если это первая карточка, ничего не делаем
    if (currentQueueIndex === 0) return;
    
    // Переходим к предыдущей карточке в очереди
    setCurrentQuestionIndex(studyQueue[currentQueueIndex - 1]);
    setIsFlipped(false);
  };

  // Перезапуск изучения
  const handleRestartStudy = () => {
    setStudyCompleted(false);
    initializeStudyQueue();
  };

  // Изменение режима изучения
  const handleChangeStudyMode = (mode) => {
    setStudyMode(mode);
    setStudyCompleted(false);
  };

  // Получение статистики изучения
  const getStudyStats = () => {
    const totalRated = Object.keys(ratings).length;
    const easyCount = Object.values(ratings).filter(r => r === 'easy').length;
    const mediumCount = Object.values(ratings).filter(r => r === 'medium').length;
    const hardCount = Object.values(ratings).filter(r => r === 'hard').length;
    
    return {
      totalQuestions: questions.length,
      totalRated,
      easyCount,
      mediumCount,
      hardCount,
      easyPercentage: totalRated > 0 ? Math.round((easyCount / totalRated) * 100) : 0,
      mediumPercentage: totalRated > 0 ? Math.round((mediumCount / totalRated) * 100) : 0,
      hardPercentage: totalRated > 0 ? Math.round((hardCount / totalRated) * 100) : 0
    };
  };

  // Текущий вопрос
  const currentQuestion = questions[currentQuestionIndex];

  // Прогресс изучения
  const studyProgress = studyQueue.length > 0 
    ? Math.round(((studyQueue.findIndex(index => index === currentQuestionIndex) + 1) / studyQueue.length) * 100) 
    : 0;

  return (
    <div className="flashcard-mode-page">
      <div className="flashcard-header">
        <h1>Режим повторения (флэш-карточки)</h1>
        {!studyCompleted && (
          <div className="flashcard-info">
            <div className="study-progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${studyProgress}%` }}
              ></div>
            </div>
            <div className="study-progress-text">
              {studyQueue.findIndex(index => index === currentQuestionIndex) + 1} из {studyQueue.length}
            </div>
          </div>
        )}
      </div>

      <div className="flashcard-container">
        {studyCompleted ? (
          <div className="study-completed-screen">
            <h2>Повторение завершено!</h2>
            <div className="study-stats">
              <div className="stats-item">
                <div className="stats-label">Всего карточек:</div>
                <div className="stats-value">{getStudyStats().totalQuestions}</div>
              </div>
              <div className="stats-item">
                <div className="stats-label">Оценено карточек:</div>
                <div className="stats-value">{getStudyStats().totalRated}</div>
              </div>
              <div className="stats-chart">
                <div className="chart-bar">
                  <div 
                    className="bar-segment easy"
                    style={{ width: `${getStudyStats().easyPercentage}%` }}
                    title={`Легко: ${getStudyStats().easyCount} (${getStudyStats().easyPercentage}%)`}
                  ></div>
                  <div 
                    className="bar-segment medium"
                    style={{ width: `${getStudyStats().mediumPercentage}%` }}
                    title={`Средне: ${getStudyStats().mediumCount} (${getStudyStats().mediumPercentage}%)`}
                  ></div>
                  <div 
                    className="bar-segment hard"
                    style={{ width: `${getStudyStats().hardPercentage}%` }}
                    title={`Сложно: ${getStudyStats().hardCount} (${getStudyStats().hardPercentage}%)`}
                  ></div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color easy"></div>
                    <div className="legend-text">Легко: {getStudyStats().easyCount}</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color medium"></div>
                    <div className="legend-text">Средне: {getStudyStats().mediumCount}</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color hard"></div>
                    <div className="legend-text">Сложно: {getStudyStats().hardCount}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="study-actions">
              <div className="study-mode-selector">
                <h3>Выберите режим повторения:</h3>
                <div className="mode-buttons">
                  <button 
                    className={`mode-button ${studyMode === 'all' ? 'active' : ''}`}
                    onClick={() => handleChangeStudyMode('all')}
                  >
                    Все карточки
                  </button>
                  <button 
                    className={`mode-button ${studyMode === 'difficult' ? 'active' : ''}`}
                    onClick={() => handleChangeStudyMode('difficult')}
                  >
                    Сложные карточки
                  </button>
                  <button 
                    className={`mode-button ${studyMode === 'random' ? 'active' : ''}`}
                    onClick={() => handleChangeStudyMode('random')}
                  >
                    Случайный порядок
                  </button>
                </div>
              </div>
              <button className="restart-button" onClick={handleRestartStudy}>
                Начать повторение заново
              </button>
            </div>
          </div>
        ) : (
          <div className="flashcard-mode">
            <div className="question-card">
              <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                <div className="flashcard-front">
                  <div className="question-header">
                    <div className="question-number">Карточка {currentQuestion.number}</div>
                  </div>
                  <div className="question-content">
                    <div className="question-text">{currentQuestion.text}</div>
                  </div>
                </div>
                <div className="flashcard-back">
                  <div className="question-header">
                    <div className="question-number">Карточка {currentQuestion.number}</div>
                  </div>
                  <div className="answer-content">
                    <div className="answer-title">Ответ:</div>
                    <div className="answer-text">{currentQuestion.answer}</div>
                    {currentQuestion.explanation && (
                      <div className="answer-explanation">
                        <div className="explanation-title">Пояснение:</div>
                        <div className="explanation-text">{currentQuestion.explanation}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flashcard-controls">
              <button 
                className="flip-button"
                onClick={handleFlipCard}
              >
                {isFlipped ? 'Показать вопрос' : 'Показать ответ'}
              </button>
              
              {isFlipped && (
                <div className="rating-buttons">
                  <button 
                    className="rating-button easy"
                    onClick={() => handleRateKnowledge('easy')}
                  >
                    Знаю
                  </button>
                  <button 
                    className="rating-button medium"
                    onClick={() => handleRateKnowledge('medium')}
                  >
                    Сомневаюсь
                  </button>
                  <button 
                    className="rating-button hard"
                    onClick={() => handleRateKnowledge('hard')}
                  >
                    Не знаю
                  </button>
                </div>
              )}
            </div>
            
            <div className="flashcard-navigation">
              <button 
                className="nav-button prev-button"
                onClick={handlePrevCard}
                disabled={studyQueue.findIndex(index => index === currentQuestionIndex) === 0}
              >
                <i className="fas fa-arrow-left"></i> Предыдущая
              </button>
              <button 
                className="nav-button next-button"
                onClick={handleNextCard}
                disabled={studyQueue.findIndex(index => index === currentQuestionIndex) === studyQueue.length - 1}
              >
                Следующая <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flashcard-footer">
        <Link to="/" className="back-button">
          <i className="fas fa-arrow-left"></i> Вернуться в Дизайн-хаб
        </Link>
      </div>
    </div>
  );
};

export default FlashcardModePage;
