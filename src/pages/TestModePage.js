import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from '../components/Quiz/QuestionCard';
import '../styles/question-card.scss';
import '../styles/question-card-large.scss';

const TestModePage = () => {
  // Пример данных вопросов для теста
  const sampleQuestions = [
    {
      id: 'q1',
      number: 1,
      type: 'single-choice',
      text: 'Какой язык программирования используется для создания интерактивных веб-страниц?',
      options: [
        { text: 'Java' },
        { text: 'Python' },
        { text: 'JavaScript' },
        { text: 'C++' }
      ],
      correctAnswer: 'JavaScript',
      points: 2,
      explanation: 'JavaScript - это язык программирования, который позволяет создавать интерактивные элементы на веб-страницах.'
    },
    {
      id: 'q2',
      number: 2,
      type: 'multiple-choice',
      text: 'Выберите фреймворки, которые используются для разработки на JavaScript:',
      options: [
        { text: 'React' },
        { text: 'Django' },
        { text: 'Vue.js' },
        { text: 'Flask' },
        { text: 'Angular' }
      ],
      correctAnswer: ['React', 'Vue.js', 'Angular'],
      points: 3,
      explanation: 'React, Vue.js и Angular - это популярные JavaScript-фреймворки для разработки веб-приложений.'
    },
    {
      id: 'q3',
      number: 3,
      type: 'text-input',
      text: 'Какая функция в JavaScript используется для вывода сообщения в консоль браузера?',
      correctAnswer: 'console.log',
      points: 1,
      explanation: 'console.log() - это функция JavaScript, которая выводит сообщение в консоль браузера.'
    },
    {
      id: 'q4',
      number: 4,
      type: 'single-choice',
      text: 'Какой метод HTTP обычно используется для получения данных с сервера?',
      options: [
        { text: 'GET' },
        { text: 'POST' },
        { text: 'PUT' },
        { text: 'DELETE' }
      ],
      correctAnswer: 'GET',
      points: 2,
      explanation: 'GET - это метод HTTP, который используется для запроса данных с сервера.'
    },
    {
      id: 'q5',
      number: 5,
      type: 'multiple-choice',
      text: 'Какие из следующих технологий относятся к фронтенд-разработке?',
      options: [
        { text: 'HTML' },
        { text: 'CSS' },
        { text: 'Node.js' },
        { text: 'MongoDB' },
        { text: 'React' }
      ],
      correctAnswer: ['HTML', 'CSS', 'React'],
      points: 3,
      explanation: 'HTML, CSS и React используются для создания пользовательского интерфейса и относятся к фронтенд-разработке.'
    },
    // Вопрос Верно/Неверно
    {
      id: 'q6',
      number: 6,
      type: 'trueFalse',
      text: 'JavaScript является строго типизированным языком программирования.',
      correctAnswer: 'false',
      points: 1,
      explanation: 'JavaScript - это динамически типизированный язык программирования.'
    },

    // Вопрос на сопоставление
    {
      id: 'q7',
      number: 7,
      type: 'matching',
      text: 'Сопоставьте языки программирования и их основные области применения:',
      leftItems: ['Python', 'JavaScript', 'Swift', 'PHP'],
      rightItems: ['Веб-фронтенд', 'iOS разработка', 'Веб-бэкенд', 'Анализ данных'],
      correctAnswer: [
        { left: 'Python', right: 'Анализ данных' },
        { left: 'JavaScript', right: 'Веб-фронтенд' },
        { left: 'Swift', right: 'iOS разработка' },
        { left: 'PHP', right: 'Веб-бэкенд' }
      ],
      points: 4
    },

    // Вопрос с развернутым ответом
    {
      id: 'q8',
      number: 8,
      type: 'essay',
      text: 'Опишите основные принципы объектно-ориентированного программирования и приведите примеры их применения.',
      correctAnswer: '', // Для эссе обычно нет автоматической проверки
      points: 5
    },

    // Информационный блок
    {
      id: 'q9',
      number: 9,
      type: 'content',
      text: '<h2>Важная информация о веб-разработке</h2><p>Веб-разработка включает в себя несколько ключевых технологий:</p><ul><li><strong>HTML</strong> - для структуры страницы</li><li><strong>CSS</strong> - для стилизации</li><li><strong>JavaScript</strong> - для интерактивности</li></ul><p>Современная веб-разработка также включает использование фреймворков и библиотек, таких как React, Angular и Vue.js.</p>',
      image: 'https://example.com/web-development.jpg',
      imageCaption: 'Стек технологий веб-разработки'
    }
  ];

  // Состояния
  const [questions, setQuestions] = useState(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 минут в секундах

  // Эффект для таймера
  useEffect(() => {
    if (testCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testCompleted]);

  // Обработчик ответа на вопрос
  const handleAnswer = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Переход к предыдущему вопросу
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Переход к конкретному вопросу
  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Отметить вопрос флагом для повторного рассмотрения
  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  // Отправка теста
  const handleSubmitTest = () => {
    setShowFeedback(true);
    setTestCompleted(true);
  };

  // Проверка, ответил ли пользователь на текущий вопрос
  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return userAnswers[currentQuestion.id] !== undefined;
  };

  // Проверка, ответил ли пользователь на все вопросы
  const areAllQuestionsAnswered = () => {
    return questions.every(q => userAnswers[q.id] !== undefined);
  };

  // Форматирование времени
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Расчет результатов теста
  const calculateResults = () => {
    let totalPoints = 0;
    let earnedPoints = 0;
    let correctAnswers = 0;

    questions.forEach(question => {
      totalPoints += question.points || 1;
      
      if (userAnswers[question.id]) {
        let isCorrect = false;
        
        switch (question.type) {
          case 'single-choice':
            isCorrect = userAnswers[question.id] === question.correctAnswer;
            break;
          case 'multiple-choice':
            isCorrect = Array.isArray(userAnswers[question.id]) && 
                        Array.isArray(question.correctAnswer) && 
                        userAnswers[question.id].length === question.correctAnswer.length && 
                        userAnswers[question.id].every(answer => question.correctAnswer.includes(answer));
            break;
          case 'text-input':
            isCorrect = userAnswers[question.id].toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
            break;
          default:
            break;
        }
        
        if (isCorrect) {
          earnedPoints += question.points || 1;
          correctAnswers++;
        }
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    
    return {
      totalQuestions: questions.length,
      correctAnswers,
      earnedPoints,
      totalPoints,
      percentage
    };
  };

  // Текущий вопрос
  const currentQuestion = questions[currentQuestionIndex];

  // Если тест завершен, показываем результаты
  if (testCompleted) {
    const results = calculateResults();
    
    return (
      <div className="test-mode-page results-view">
        <div className="test-header">
          <h1>Результаты тестирования</h1>
        </div>
        
        <div className="test-results">
          <h3>Результаты теста</h3>
          <div className="results-summary">
            <div className="result-item">
              <div className="result-label">Правильных ответов:</div>
              <div className="result-value">{results.correctAnswers} из {results.totalQuestions}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Набрано баллов:</div>
              <div className="result-value">{results.earnedPoints} из {results.totalPoints}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Процент выполнения:</div>
              <div className="result-value">{results.percentage}%</div>
            </div>
          </div>
          
          <div className="results-actions">
            <button className="review-button" onClick={() => setTestCompleted(false)}>
              Просмотреть ответы
            </button>
            <Link to="/" className="back-button">
              <i className="fas fa-arrow-left"></i> Вернуться в Дизайн-хаб
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Стили для улучшения дизайна
  const styles = {
    testModePage: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    testHeader: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(233, 236, 239, 0.5)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1.5rem 0'
    },
    headerTitle: {
      background: 'linear-gradient(135deg, #4a6bff, #2a4bdf)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 600,
      marginBottom: '0.5rem'
    },
    testProgress: {
      display: 'inline-block',
      padding: '0.4rem 1rem',
      backgroundColor: 'rgba(74, 107, 255, 0.1)',
      borderRadius: '30px',
      fontWeight: 500
    },
    navButton: {
      padding: '1rem 2rem',
      background: 'linear-gradient(135deg, #4a6bff 0%, #2a4bdf 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(74, 107, 255, 0.3)',
      minWidth: '200px',
      cursor: 'pointer'
    },
    prevButton: {
      marginBottom: '1rem'
    },
    nextButton: {
      marginTop: '1rem'
    },
    testFooter: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(233, 236, 239, 0.5)',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
      padding: '1.2rem 0',
      position: 'sticky',
      bottom: 0,
      zIndex: 100
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      color: '#6c757d',
      textDecoration: 'none',
      fontWeight: 500,
      padding: '0.8rem 1.5rem',
      borderRadius: '50px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease'
    },
    testTimer: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 600,
      padding: '0.8rem 1.5rem',
      borderRadius: '50px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)'
    },
    timerIcon: {
      marginRight: '0.8rem',
      color: '#4a6bff'
    }
  };

  // Основной режим теста
  return (
    <div className="test-mode-page" style={styles.testModePage}>
      <header className="test-header" style={styles.testHeader}>
        <div className="container">
          <h1 style={styles.headerTitle}>Стандартный режим тестирования</h1>
          <div className="test-progress" style={styles.testProgress}>
            Вопрос {currentQuestionIndex + 1} из {questions.length}
          </div>
        </div>
      </header>
      
      <main className="test-content-wrapper">
        <div className="test-content">
          {/* Навигация перед вопросом */}
          {currentQuestionIndex > 0 && (
            <div className="vertical-navigation top">
              <button 
                className="nav-button prev-button"
                onClick={handlePrevQuestion}
                disabled={testCompleted}
                style={{...styles.navButton, ...styles.prevButton}}
              >
                <i className="fas fa-arrow-up"></i> Предыдущий вопрос
              </button>
            </div>
          )}
          
          <div className="question-card-container">
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              userAnswer={userAnswers[currentQuestion.id]}
              showFeedback={showFeedback}
              disabled={testCompleted}
              testInfo={{
                title: 'Тестирование программного обеспечения',
                totalQuestions: questions.length,
                category: 'Тестирование',
                difficulty: 'Средний'
              }}
              timerInfo={{
                timeRemaining: timeRemaining,
                totalTime: 1800
              }}
              mode="test"
              onFlag={handleFlagQuestion}
              isFlagged={flaggedQuestions.includes(currentQuestion.id)}
            />
          </div>
          
          {/* Навигация после вопроса */}
          <div className="vertical-navigation bottom">
            {currentQuestionIndex < questions.length - 1 ? (
              <button 
                className="nav-button next-button"
                onClick={handleNextQuestion}
                disabled={testCompleted}
                style={{...styles.navButton, ...styles.nextButton}}
              >
                Следующий вопрос <i className="fas fa-arrow-down"></i>
              </button>
            ) : (
              <button 
                className="submit-button"
                onClick={handleSubmitTest}
                disabled={testCompleted}
                style={{...styles.navButton, background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)'}}
              >
                Завершить тест
              </button>
            )}
          </div>
        </div>
      </main>
      
      <footer className="test-footer" style={styles.testFooter}>
        <div className="container">
          <Link to="/" className="back-button" style={styles.backButton}>
            <i className="fas fa-arrow-left"></i> Вернуться в Дизайн-хаб
          </Link>
          
          <div className="test-timer" style={styles.testTimer}>
            <i className="fas fa-clock" style={styles.timerIcon}></i> {formatTime(timeRemaining)}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TestModePage;
