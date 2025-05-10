import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../contexts/QuizContext';

// Компоненты для разных типов вопросов
const SingleChoiceQuestion = ({ question, onAnswer, selectedAnswer }) => {
  return (
    <div className="question-container">
      <h3 className="question-text">{question.text}</h3>
      <div className="options-list">
        {question.options.map((option, index) => (
          <div 
            key={index} 
            className={`option-item ${selectedAnswer === index ? 'selected' : ''}`}
            onClick={() => onAnswer(index)}
          >
            <div className="option-marker">{String.fromCharCode(65 + index)}</div>
            <div className="option-text">{option}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MultipleChoiceQuestion = ({ question, onAnswer, selectedAnswers }) => {
  const toggleAnswer = (index) => {
    const newSelectedAnswers = [...selectedAnswers];
    const position = newSelectedAnswers.indexOf(index);
    
    if (position > -1) {
      newSelectedAnswers.splice(position, 1);
    } else {
      newSelectedAnswers.push(index);
    }
    
    onAnswer(newSelectedAnswers);
  };
  
  return (
    <div className="question-container">
      <h3 className="question-text">{question.text}</h3>
      <p className="question-hint">Выберите все правильные варианты</p>
      <div className="options-list">
        {question.options.map((option, index) => (
          <div 
            key={index} 
            className={`option-item ${selectedAnswers.includes(index) ? 'selected' : ''}`}
            onClick={() => toggleAnswer(index)}
          >
            <div className="option-checkbox">
              {selectedAnswers.includes(index) && <span className="checkbox-checked">✓</span>}
            </div>
            <div className="option-text">{option}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MatchingQuestion = ({ question, onAnswer, selectedMatches }) => {
  const updateMatch = (leftIndex, rightIndex) => {
    const newMatches = [...selectedMatches];
    newMatches[leftIndex] = rightIndex;
    onAnswer(newMatches);
  };
  
  return (
    <div className="question-container">
      <h3 className="question-text">{question.text}</h3>
      <p className="question-hint">Сопоставьте элементы из левой колонки с элементами из правой</p>
      <div className="matching-container">
        <div className="matching-items">
          {question.leftItems.map((item, leftIndex) => (
            <div key={leftIndex} className="matching-pair">
              <div className="left-item">{item}</div>
              <div className="matching-arrow">→</div>
              <select 
                value={selectedMatches[leftIndex] || ''} 
                onChange={(e) => updateMatch(leftIndex, parseInt(e.target.value))}
                className="right-item-select"
              >
                <option value="">Выберите...</option>
                {question.rightItems.map((rightItem, rightIndex) => (
                  <option key={rightIndex} value={rightIndex}>
                    {rightItem}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TextInputQuestion = ({ question, onAnswer, inputAnswer }) => {
  return (
    <div className="question-container">
      <h3 className="question-text">{question.text}</h3>
      <div className="text-input-container">
        <textarea 
          value={inputAnswer || ''} 
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Введите ваш ответ здесь..."
          rows={5}
          className="text-answer-input"
        />
      </div>
    </div>
  );
};

const QuizSession = () => {
  const { quizId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Используем контекст тестов
  const { 
    currentQuiz, 
    quizSession, 
    loading, 
    error, 
    loadQuiz, 
    startQuizSession, 
    saveQuizAnswer, 
    finishQuizSession 
  } = useQuiz();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Загрузка теста и начало сессии
  useEffect(() => {
    const initQuiz = async () => {
      try {
        // Загружаем тест
        await loadQuiz(quizId);
        
        // Начинаем сессию теста
        const session = await startQuizSession(quizId);
        
        // Инициализируем массив ответов
        const initialAnswers = session.questions.map(question => {
          if (question.type === 'single') return null;
          if (question.type === 'multiple') return [];
          if (question.type === 'matching') return Array(question.pairs.length).fill(null);
          if (question.type === 'text') return '';
          return null;
        });
        
        setAnswers(initialAnswers);
        setTimeLeft(currentQuiz.timeLimit * 60); // конвертируем минуты в секунды
      } catch (err) {
        console.error('Ошибка при загрузке теста:', err);
      }
    };
    
    if (quizId) {
      initQuiz();
    }
  }, [quizId, loadQuiz, startQuizSession, currentQuiz]);
  
  // Таймер обратного отсчета
  useEffect(() => {
    if (!currentQuiz || !quizSession || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuiz, quizSession, quizCompleted]);
  
  // Форматирование времени
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Обработка ответа на вопрос
  const handleAnswer = async (answer) => {
    try {
      // Сохраняем ответ в контексте
      if (quizSession && quizSession.questions[currentQuestionIndex]) {
        await saveQuizAnswer(quizSession.questions[currentQuestionIndex].id, answer);
      }
      
      // Обновляем локальный массив ответов
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);
    } catch (err) {
      console.error('Ошибка при сохранении ответа:', err);
    }
  };
  
  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    if (quizSession && currentQuestionIndex < quizSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Переход к предыдущему вопросу
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Отправка теста
  const handleSubmitQuiz = async () => {
    try {
      // Завершаем тест через контекст
      await finishQuizSession();
      setQuizCompleted(true);
      
      // Перенаправляем на страницу результатов
      navigate(`/quiz/${quizId}/results`);
    } catch (err) {
      console.error('Ошибка при завершении теста:', err);
    }
  };
  
  // Отображение текущего вопроса
  const renderQuestion = () => {
    if (!quizSession || !quizSession.questions || quizSession.questions.length === 0) return null;
    
    const currentQuestion = quizSession.questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex];
    
    switch (currentQuestion.type) {
      case 'single':
        return (
          <SingleChoiceQuestion 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
            selectedAnswer={currentAnswer} 
          />
        );
      case 'multiple':
        return (
          <MultipleChoiceQuestion 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
            selectedAnswers={currentAnswer || []} 
          />
        );
      case 'matching':
        return (
          <MatchingQuestion 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
            selectedMatches={currentAnswer || []} 
          />
        );
      case 'text':
        return (
          <TextInputQuestion 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
            inputAnswer={currentAnswer} 
          />
        );
      default:
        return <div>Неподдерживаемый тип вопроса</div>;
    }
  };
  
  // Проверка заполненности текущего вопроса
  const isCurrentQuestionAnswered = () => {
    const answer = answers[currentQuestionIndex];
    
    if (answer === null || answer === undefined) return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    if (answer === '') return false;
    
    return true;
  };
  
  // Подсчет количества отвеченных вопросов
  const answeredQuestionsCount = answers.filter(answer => {
    if (answer === null || answer === undefined) return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    if (answer === '') return false;
    return true;
  }).length;
  
  if (loading) {
    return <div className="loading-indicator">Загрузка теста...</div>;
  }
  
  if (error) {
    return <div className="error-message">Ошибка при загрузке теста: {error}</div>;
  }
  
  if (!currentQuiz || !quizSession) {
    return <div className="error-message">Тест не найден</div>;
  }
  
  return (
    <div className="quiz-session-container">
      <div className="quiz-header">
        <h2>{currentQuiz.title}</h2>
        <div className="quiz-timer">
          <span className={timeLeft < 300 ? 'timer-warning' : ''}>
            Осталось времени: {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      
      <div className="quiz-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / quizSession.questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Вопрос {currentQuestionIndex + 1} из {quizSession.questions.length}
        </div>
      </div>
      
      <div className="quiz-content">
        {renderQuestion()}
      </div>
    </div>
  );
};

export default QuizSession;
