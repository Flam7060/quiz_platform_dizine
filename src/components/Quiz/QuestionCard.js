import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/question-card-large.scss';

/**
 * Базовый компонент карточки вопроса
 * @param {Object} question - Объект с данными вопроса
 * @param {Function} onAnswer - Функция обработки ответа
 * @param {Object} userAnswer - Текущий ответ пользователя
 * @param {boolean} showFeedback - Показывать ли обратную связь (правильно/неправильно)
 * @param {boolean} disabled - Блокировать ли взаимодействие с карточкой
 * @param {Object} testInfo - Информация о тесте (название, общее количество вопросов и т.д.)
 * @param {Object} timerInfo - Информация о таймере (оставшееся время, общее время)
 * @param {string} mode - Режим отображения карточки (test, quiz, flashcard)
 * @param {Function} onFlag - Функция для отметки вопроса флагом
 * @param {Function} onNavigate - Функция для навигации между вопросами
 */
const QuestionCard = ({ 
  question, 
  onAnswer, 
  userAnswer, 
  showFeedback = false, 
  disabled = false,
  testInfo = null,
  timerInfo = null,
  mode = 'test',
  onFlag = null,
  onNavigate = null,
  isFlagged = false
}) => {
  // Состояние для режима флэш-карточек
  const [isFlipped, setIsFlipped] = useState(false);
  // Обработчик выбора варианта ответа для вопросов с одним вариантом
  const handleSingleChoiceChange = (e) => {
    if (disabled) return;
    onAnswer(question.id, e.target.value);
  };

  // Обработчик выбора варианта ответа для вопросов с множественным выбором
  const handleMultipleChoiceChange = (e) => {
    if (disabled) return;
    
    const value = e.target.value;
    const isChecked = e.target.checked;
    
    let newAnswer = Array.isArray(userAnswer) ? [...userAnswer] : [];
    
    if (isChecked) {
      newAnswer.push(value);
    } else {
      newAnswer = newAnswer.filter(item => item !== value);
    }
    
    onAnswer(question.id, newAnswer);
  };

  // Обработчик ввода текстового ответа
  const handleTextInputChange = (e) => {
    if (disabled) return;
    onAnswer(question.id, e.target.value);
  };

  // Функция для определения, правильный ли ответ (для обратной связи)
  const isCorrectAnswer = () => {
    if (!showFeedback || !userAnswer) return null;
    
    switch (question.type) {
      case 'single-choice':
        return userAnswer === question.correctAnswer;
      case 'multiple-choice':
        return Array.isArray(userAnswer) && 
               Array.isArray(question.correctAnswer) && 
               userAnswer.length === question.correctAnswer.length && 
               userAnswer.every(answer => question.correctAnswer.includes(answer));
      case 'text-input':
        return userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      default:
        return null;
    }
  };

  // Функция для получения класса обратной связи
  const getFeedbackClass = () => {
    if (!showFeedback || !userAnswer) return '';
    return isCorrectAnswer() ? 'correct-answer' : 'incorrect-answer';
  };

  // Рендер вопроса с одним вариантом ответа
  const renderSingleChoiceQuestion = () => (
    <div className="question-options" style={styles.questionOptions}>
      {question.options.map((option, index) => {
        const isSelected = userAnswer === (option.value || option.text);
        
        return (
          <div 
            key={index} 
            className={`question-option ${getFeedbackClass()}`}
            style={{
              ...styles.questionOption,
              ...(isSelected ? { borderColor: '#4a6bff', backgroundColor: 'rgba(74, 107, 255, 0.05)' } : {})
            }}
          >
            <input
              type="radio"
              id={`option-${question.id}-${index}`}
              name={`question-${question.id}`}
              value={option.value || option.text}
              checked={isSelected}
              onChange={handleSingleChoiceChange}
              disabled={disabled}
              style={styles.optionInput}
            />
            <label 
              htmlFor={`option-${question.id}-${index}`}
              style={styles.optionLabel}
            >
              {option.text}
            </label>
          </div>
        );
      })}
    </div>
  );

  // Рендер вопроса с множественным выбором
  const renderMultipleChoiceQuestion = () => (
    <div className="question-options" style={styles.questionOptions}>
      {question.options.map((option, index) => {
        const isSelected = Array.isArray(userAnswer) && userAnswer.includes(option.value || option.text);
        
        return (
          <div 
            key={index} 
            className={`question-option ${getFeedbackClass()}`}
            style={{
              ...styles.questionOption,
              ...(isSelected ? { borderColor: '#4a6bff', backgroundColor: 'rgba(74, 107, 255, 0.05)' } : {})
            }}
          >
            <input
              type="checkbox"
              id={`option-${question.id}-${index}`}
              name={`question-${question.id}`}
              value={option.value || option.text}
              checked={isSelected}
              onChange={handleMultipleChoiceChange}
              disabled={disabled}
              style={styles.optionInput}
            />
            <label 
              htmlFor={`option-${question.id}-${index}`}
              style={styles.optionLabel}
            >
              {option.text}
            </label>
          </div>
        );
      })}
    </div>
  );

  // Рендер вопроса с текстовым вводом
  const renderTextInputQuestion = () => (
    <div className={`question-text-input ${getFeedbackClass()}`}>
      <input
        type="text"
        value={userAnswer || ''}
        onChange={handleTextInputChange}
        placeholder="Введите ваш ответ"
        disabled={disabled}
      />
    </div>
  );

  // Рендер вопроса с развернутым ответом
  const renderEssayQuestion = () => (
    <div className={`question-essay ${getFeedbackClass()}`}>
      <textarea
        value={userAnswer || ''}
        onChange={handleTextInputChange}
        placeholder="Введите ваш ответ"
        disabled={disabled}
        rows={6}
      />
    </div>
  );

  // Рендер вопроса Верно/Неверно
  const renderTrueFalseQuestion = () => (
    <div className="question-true-false">
      <div className={`true-false-option ${getFeedbackClass()}`}>
        <input
          type="radio"
          id={`option-${question.id}-true`}
          name={`question-${question.id}`}
          value="true"
          checked={userAnswer === 'true'}
          onChange={handleSingleChoiceChange}
          disabled={disabled}
        />
        <label htmlFor={`option-${question.id}-true`} className="true-option">
          <i className="fas fa-check-circle"></i> Верно
        </label>
      </div>
      <div className={`true-false-option ${getFeedbackClass()}`}>
        <input
          type="radio"
          id={`option-${question.id}-false`}
          name={`question-${question.id}`}
          value="false"
          checked={userAnswer === 'false'}
          onChange={handleSingleChoiceChange}
          disabled={disabled}
        />
        <label htmlFor={`option-${question.id}-false`} className="false-option">
          <i className="fas fa-times-circle"></i> Неверно
        </label>
      </div>
    </div>
  );

  // Рендер информационного блока
  const renderContentBlock = () => (
    <div className="content-block">
      <div className="content-text" dangerouslySetInnerHTML={{ __html: question.content || question.text }}></div>
      {question.image && (
        <div className="content-image">
          <img src={question.image} alt="Иллюстрация" />
          {question.imageCaption && <div className="image-caption">{question.imageCaption}</div>}
        </div>
      )}
      <div className="content-navigation">
        <button 
          className="content-next-button"
          onClick={() => onNavigate && onNavigate('next')}
          disabled={disabled}
        >
          Далее <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );

  // Обработчик изменения сопоставления
  const handleMatchingChange = (leftItem, rightItem) => {
    if (disabled) return;
    
    const currentAnswers = Array.isArray(userAnswer) ? [...userAnswer] : [];
    const existingPairIndex = currentAnswers.findIndex(pair => pair.left === leftItem);
    
    if (existingPairIndex >= 0) {
      // Удаляем существующую пару с тем же левым элементом
      currentAnswers.splice(existingPairIndex, 1);
    }
    
    // Добавляем новую пару
    currentAnswers.push({ left: leftItem, right: rightItem });
    
    onAnswer(question.id, currentAnswers);
  };

  // Рендер вопроса на сопоставление
  const renderMatchingQuestion = () => {
    const { leftItems = [], rightItems = [] } = question;
    const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
    
    return (
      <div className={`matching-question ${getFeedbackClass()}`}>
        <div className="matching-container">
          <div className="matching-column">
            <div className="matching-header">Левая колонка</div>
            {leftItems.map((item, index) => {
              const selectedPair = currentAnswers.find(pair => pair.left === item);
              return (
                <div key={`left-${index}`} className="matching-item left-item">
                  {item}
                  {selectedPair && (
                    <div className="matching-selected">
                      → {selectedPair.right}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="matching-column right-column">
            <div className="matching-header">Правая колонка</div>
            {rightItems.map((item, index) => (
              <div 
                key={`right-${index}`} 
                className="matching-item right-item"
                onClick={() => {
                  // Находим первый несопоставленный левый элемент
                  const leftItem = leftItems.find(left => 
                    !currentAnswers.some(pair => pair.left === left)
                  );
                  if (leftItem) {
                    handleMatchingChange(leftItem, item);
                  }
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        
        {showFeedback && (
          <div className="matching-feedback">
            {isCorrectAnswer() ? (
              <div className="feedback-correct">✓ Верно!</div>
            ) : (
              <div className="feedback-incorrect">
                ✗ Неверно. {question.explanation || 'Попробуйте еще раз.'}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Рендер содержимого вопроса в зависимости от типа
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'single-choice':
      case 'singleChoice':
        return renderSingleChoiceQuestion();
      case 'multiple-choice':
      case 'multipleChoice':
        return renderMultipleChoiceQuestion();
      case 'text-input':
      case 'shortAnswer':
        return renderTextInputQuestion();
      case 'matching':
        return renderMatchingQuestion();
      case 'trueFalse':
        return renderTrueFalseQuestion();
      case 'essay':
        return renderEssayQuestion();
      case 'content':
        return renderContentBlock();
      default:
        return <div className="question-error">Неподдерживаемый тип вопроса</div>;
    }
  };

  // Рендер обратной связи
  const renderFeedback = () => {
    if (!showFeedback || !userAnswer) return null;
    
    const correct = isCorrectAnswer();
    
    return (
      <div className={`question-feedback ${correct ? 'correct' : 'incorrect'}`}>
        <div className="feedback-icon">
          {correct ? '✓' : '✗'}
        </div>
        <div className="feedback-text">
          {correct 
            ? 'Правильно!' 
            : (
              <>
                <div>Неправильно!</div>
                {question.explanation && (
                  <div className="feedback-explanation">{question.explanation}</div>
                )}
              </>
            )
          }
        </div>
      </div>
    );
  };

  // Форматирование времени
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Обработчик переворота карточки (для режима флэш-карточек)
  const handleFlipCard = () => {
    if (mode === 'flashcard') {
      setIsFlipped(!isFlipped);
    }
  };

  // Функция для получения текста типа вопроса
  const getQuestionTypeText = () => {
    switch(question.type) {
      case 'single-choice':
      case 'singleChoice':
        return '1 вариант';
      case 'multiple-choice':
      case 'multipleChoice':
        return 'Несколько вариантов';
      case 'text-input':
      case 'shortAnswer':
        return 'Короткий ответ';
      case 'matching':
        return 'Сопоставление';
      case 'trueFalse':
        return 'Верно/Неверно';
      case 'essay':
        return 'Развернутый ответ';
      case 'content':
        return 'Информация';
      default:
        return '';
    }
  };

  // Рендер информации о тесте
  const renderTestInfo = () => {
    if (!testInfo) return null;
    
    return (
      <div className="card-test-info">
        <div className="test-header-top">
          {testInfo.title && <div className="test-title">{testInfo.title}</div>}
          <div className="test-progress">
            {question.number} / {testInfo.totalQuestions || '?'}
          </div>
        </div>
        <div className="question-type">
          {getQuestionTypeText()}
        </div>
      </div>
    );
  };

  // Рендер таймера
  const renderTimer = () => {
    if (!timerInfo) return null;
    
    const getTimerClass = () => {
      if (!timerInfo.timeRemaining || !timerInfo.totalTime) return '';
      const percentage = (timerInfo.timeRemaining / timerInfo.totalTime) * 100;
      if (percentage <= 25) return 'danger';
      if (percentage <= 50) return 'warning';
      return '';
    };
    
    return (
      <div className="card-timer">
        <div className="timer-bar">
          <div 
            className={`timer-progress ${getTimerClass()}`}
            style={{ width: timerInfo.totalTime ? `${(timerInfo.timeRemaining / timerInfo.totalTime) * 100}%` : '100%' }}
          ></div>
        </div>
        <div className="timer-text">
          <i className="fas fa-clock"></i> {formatTime(timerInfo.timeRemaining)}
        </div>
      </div>
    );
  };

  // Рендер навигации
  const renderNavigation = () => {
    if (!onNavigate) return null;
    
    return (
      <div className="card-navigation">
        <button 
          className="nav-button prev-button"
          onClick={() => onNavigate('prev')}
          disabled={question.number <= 1 || disabled}
        >
          <i className="fas fa-arrow-left"></i> Предыдущий
        </button>
        
        {mode === 'flashcard' && (
          <button 
            className="flip-button"
            onClick={handleFlipCard}
          >
            {isFlipped ? 'Показать вопрос' : 'Показать ответ'}
          </button>
        )}
        
        <button 
          className="nav-button next-button"
          onClick={() => onNavigate('next')}
          disabled={testInfo && question.number >= testInfo.totalQuestions || disabled}
        >
          Следующий <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    );
  };

  // Рендер дополнительных действий
  const renderActions = () => {
    if (!onFlag && mode !== 'flashcard') return null;
    
    return (
      <div className="card-actions">
        {onFlag && (
          <button 
            className={`flag-button ${isFlagged ? 'flagged' : ''}`}
            onClick={() => onFlag(question.id)}
            disabled={disabled}
          >
            <i className={`fas ${isFlagged ? 'fa-flag' : 'fa-flag'}`}></i>
            {isFlagged ? 'Снять отметку' : 'Отметить вопрос'}
          </button>
        )}
        
        {mode === 'flashcard' && isFlipped && (
          <div className="rating-buttons">
            <button 
              className="rating-button easy"
              onClick={() => onNavigate('rate', 'easy')}
            >
              Знаю
            </button>
            <button 
              className="rating-button medium"
              onClick={() => onNavigate('rate', 'medium')}
            >
              Сомневаюсь
            </button>
            <button 
              className="rating-button hard"
              onClick={() => onNavigate('rate', 'hard')}
            >
              Не знаю
            </button>
          </div>
        )}
      </div>
    );
  };

  // Рендер карточки в режиме флэш-карточек
  if (mode === 'flashcard') {
    return (
      <div className={`question-card flashcard-mode ${getFeedbackClass()}`}>
        <div className="card-header">
          {renderTestInfo()}
          {renderTimer()}
        </div>
        
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlipCard}>
          <div className="flashcard-front">
            <div className="question-header">
              {question.points && (
                <div className="question-points">{question.points} {question.points === 1 ? 'балл' : question.points < 5 ? 'балла' : 'баллов'}</div>
              )}
            </div>
            
            <div className="question-content">
              <div className="question-text">{question.text}</div>
              
              {question.image && (
                <div className="question-image">
                  <img src={question.image} alt="Изображение к вопросу" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flashcard-back">
            <div className="question-header">
              {question.points && (
                <div className="question-points">{question.points} {question.points === 1 ? 'балл' : question.points < 5 ? 'балла' : 'баллов'}</div>
              )}
            </div>
            
            <div className="answer-content">
              <div className="answer-title">Ответ:</div>
              <div className="answer-text">{question.correctAnswer}</div>
              
              {question.explanation && (
                <div className="answer-explanation">
                  <div className="explanation-title">Пояснение:</div>
                  <div className="explanation-text">{question.explanation}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="card-footer">
          {renderActions()}
          {renderNavigation()}
        </div>
      </div>
    );
  }

  // Стили для улучшения дизайна карточки
  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      position: 'relative',
      borderTop: '6px solid #4a6bff'
    },
    cardHeader: {
      padding: '1.5rem 2rem',
      background: 'linear-gradient(to right, rgba(74, 107, 255, 0.03), rgba(74, 107, 255, 0.07))',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    cardBody: {
      padding: '2.5rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      background: 'linear-gradient(to bottom, #ffffff, #fafafa)'
    },
    questionContent: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    },
    questionText: {
      fontSize: '1.6rem',
      fontWeight: 600,
      color: '#333',
      marginBottom: '2.5rem',
      lineHeight: 1.5,
      position: 'relative',
      paddingBottom: '1rem'
    },
    questionTextUnderline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '50px',
      height: '4px',
      background: 'linear-gradient(90deg, #4a6bff, #7a9bff)',
      borderRadius: '2px'
    },
    questionImage: {
      marginBottom: '2rem',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    questionImageStyle: {
      width: '100%',
      height: 'auto',
      display: 'block'
    },
    questionOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    questionOption: {
      padding: '1.5rem',
      borderRadius: '12px',
      border: '2px solid #e9ecef',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      backgroundColor: 'white'
    },
    selectedOption: {
      borderColor: '#4a6bff',
      backgroundColor: 'rgba(74, 107, 255, 0.05)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    optionLabel: {
      flex: 1,
      cursor: 'pointer',
      fontSize: '1.3rem',
      lineHeight: 1.5
    },
    optionInput: {
      marginRight: '1.5rem',
      cursor: 'pointer',
      transform: 'scale(1.5)'
    }
  };

  // Рендер карточки в режиме теста или квиза
  return (
    <div className={`question-card ${mode}-mode ${question.type} ${getFeedbackClass()}`} style={styles.card}>
      <div className="card-header" style={styles.cardHeader}>
        {renderTestInfo()}
        {renderTimer()}
      </div>
      
      <div className="card-body" style={styles.cardBody}>
        
        <div className="question-content" style={styles.questionContent}>
          <div className="question-text" style={styles.questionText}>
            {question.text}
            <div style={styles.questionTextUnderline}></div>
          </div>
          
          {question.image && (
            <div className="question-image" style={styles.questionImage}>
              <img src={question.image} alt="Изображение к вопросу" style={styles.questionImageStyle} />
            </div>
          )}
          
          {renderQuestionContent()}
        </div>
        
        {showFeedback && renderFeedback()}
      </div>
      
      <div className="card-footer">
        {renderActions()}
        {renderNavigation()}
      </div>
    </div>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['single-choice', 'multiple-choice', 'text-input']).isRequired,
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.string
      })
    ),
    correctAnswer: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    points: PropTypes.number,
    image: PropTypes.string,
    explanation: PropTypes.string
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  showFeedback: PropTypes.bool,
  disabled: PropTypes.bool,
  testInfo: PropTypes.shape({
    title: PropTypes.string,
    totalQuestions: PropTypes.number,
    category: PropTypes.string,
    difficulty: PropTypes.string
  }),
  timerInfo: PropTypes.shape({
    timeRemaining: PropTypes.number,
    totalTime: PropTypes.number
  }),
  mode: PropTypes.oneOf(['test', 'quiz', 'flashcard']),
  onFlag: PropTypes.func,
  onNavigate: PropTypes.func,
  isFlagged: PropTypes.bool
};

export default QuestionCard;
