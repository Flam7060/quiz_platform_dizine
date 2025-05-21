import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from '../components/Quiz/QuestionCard';
import '../styles/question-card.scss';

const QuizModePage = () => {
  // Пример данных вопросов для квиза
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
    }
  ];

  // Состояния
  const [questions, setQuestions] = useState(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState(20); // секунд на вопрос
  const [questionTimer, setQuestionTimer] = useState(timePerQuestion);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [animation, setAnimation] = useState('');

  // Эффект для таймера вопроса
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setQuestionTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, currentQuestionIndex]);

  // Обработчик запуска квиза
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuestionTimer(timePerQuestion);
  };

  // Обработчик истечения времени на вопрос
  const handleTimeUp = () => {
    // Если пользователь не ответил, считаем ответ неправильным
    if (!userAnswers[questions[currentQuestionIndex].id]) {
      setUserAnswers(prev => ({
        ...prev,
        [questions[currentQuestionIndex].id]: null
      }));
    }
    
    // Показываем обратную связь
    setShowFeedback(true);
    
    // Через 2 секунды переходим к следующему вопросу или завершаем квиз
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        handleNextQuestion();
      } else {
        handleFinishQuiz();
      }
    }, 2000);
  };

  // Обработчик ответа на вопрос
  const handleAnswer = (questionId, answer) => {
    if (showFeedback) return; // Предотвращаем изменение ответа после показа обратной связи
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Показываем обратную связь
    setShowFeedback(true);
    
    // Проверяем правильность ответа и обновляем счет
    const currentQuestion = questions.find(q => q.id === questionId);
    let isCorrect = false;
    
    switch (currentQuestion.type) {
      case 'single-choice':
        isCorrect = answer === currentQuestion.correctAnswer;
        break;
      case 'multiple-choice':
        isCorrect = Array.isArray(answer) && 
                    Array.isArray(currentQuestion.correctAnswer) && 
                    answer.length === currentQuestion.correctAnswer.length && 
                    answer.every(a => currentQuestion.correctAnswer.includes(a));
        break;
      case 'text-input':
        isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
        break;
      default:
        break;
    }
    
    if (isCorrect) {
      setScore(prev => prev + (currentQuestion.points || 1));
    }
    
    // Через 2 секунды переходим к следующему вопросу или завершаем квиз
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        handleNextQuestion();
      } else {
        handleFinishQuiz();
      }
    }, 2000);
  };

  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    setAnimation('slide-out');
    
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
      setQuestionTimer(timePerQuestion);
      setAnimation('slide-in');
      
      setTimeout(() => {
        setAnimation('');
      }, 500);
    }, 300);
  };

  // Завершение квиза
  const handleFinishQuiz = () => {
    setQuizCompleted(true);
    
    // Рассчитываем результаты
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const percentage = Math.round((score / totalPoints) * 100);
    
    setQuizResults({
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(userAnswers).length,
      score,
      totalPoints,
      percentage
    });
  };

  // Перезапуск квиза
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowFeedback(false);
    setQuizCompleted(false);
    setScore(0);
    setQuestionTimer(timePerQuestion);
    setQuizStarted(false);
    setQuizResults(null);
    setAnimation('');
  };

  // Получение класса для индикатора таймера
  const getTimerClass = () => {
    if (questionTimer <= timePerQuestion * 0.25) return 'danger';
    if (questionTimer <= timePerQuestion * 0.5) return 'warning';
    return '';
  };

  // Текущий вопрос
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-mode-page">
      <div className="quiz-header">
        <h1>Режим квиза</h1>
        {quizStarted && !quizCompleted && (
          <div className="quiz-info">
            <div className="quiz-score">
              Счет: {score}
            </div>
            <div className="quiz-progress">
              Вопрос {currentQuestionIndex + 1} из {questions.length}
            </div>
          </div>
        )}
      </div>

      <div className="quiz-container">
        {!quizStarted ? (
          <div className="quiz-start-screen">
            <h2>Готовы начать квиз?</h2>
            <p>В этом режиме у вас будет ограниченное время на каждый вопрос. Вы не сможете вернуться к предыдущим вопросам.</p>
            <p>Всего вопросов: {questions.length}</p>
            <p>Время на вопрос: {timePerQuestion} секунд</p>
            <button className="start-button" onClick={handleStartQuiz}>
              Начать квиз
            </button>
          </div>
        ) : quizCompleted ? (
          <div className="quiz-results-screen">
            <h2>Квиз завершен!</h2>
            <div className="results-container">
              <div className="results-score">
                <div className="score-circle">
                  <div className="score-number">{quizResults.percentage}%</div>
                </div>
              </div>
              <div className="results-details">
                <div className="result-item">
                  <div className="result-label">Правильных ответов:</div>
                  <div className="result-value">{score} из {quizResults.totalPoints}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Отвечено на вопросов:</div>
                  <div className="result-value">{quizResults.answeredQuestions} из {quizResults.totalQuestions}</div>
                </div>
              </div>
            </div>
            <button className="restart-button" onClick={handleRestartQuiz}>
              Пройти еще раз
            </button>
          </div>
        ) : (
          <div className="quiz-mode">
            <div className="quiz-timer">
              <div className="timer-bar">
                <div 
                  className={`timer-progress ${getTimerClass()}`}
                  style={{ width: `${(questionTimer / timePerQuestion) * 100}%` }}
                ></div>
              </div>
              <div className="timer-text">
                Осталось времени: {questionTimer} сек
              </div>
            </div>
            
            <div className={`question-container ${animation}`}>
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                userAnswer={userAnswers[currentQuestion.id]}
                showFeedback={showFeedback}
                disabled={showFeedback}
              />
            </div>
            
            {!showFeedback && (
              <div className="quiz-navigation">
                <button 
                  className="quiz-button"
                  onClick={() => {
                    // Если пользователь не ответил, считаем ответ неправильным
                    if (!userAnswers[currentQuestion.id]) {
                      handleAnswer(currentQuestion.id, null);
                    }
                  }}
                >
                  Пропустить
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="quiz-footer">
        <Link to="/" className="back-button">
          <i className="fas fa-arrow-left"></i> Вернуться в Дизайн-хаб
        </Link>
      </div>
    </div>
  );
};

export default QuizModePage;
