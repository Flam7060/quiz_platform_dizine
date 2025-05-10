import React, { useState } from 'react';

const QuestionEditor = ({ onSave, useAI, initialQuestion = null, testFormat = 'standard', defaultQuestionTime = 20 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [questionType, setQuestionType] = useState(initialQuestion?.type || 'singleChoice');
  const [question, setQuestion] = useState({
    text: initialQuestion?.text || '',
    type: initialQuestion?.type || 'singleChoice',
    options: initialQuestion?.options || [
      { id: 1, text: '', isCorrect: false },
      { id: 2, text: '', isCorrect: false }
    ],
    attachment: initialQuestion?.attachment || null,
    explanation: initialQuestion?.explanation || '',
    timeLimit: initialQuestion?.timeLimit || defaultQuestionTime // Время на вопрос в секундах
  });
  
  // Обработчик изменения текста вопроса
  const handleQuestionTextChange = (e) => {
    setQuestion({
      ...question,
      text: e.target.value
    });
  };
  
  // Обработчик изменения типа вопроса
  const handleQuestionTypeChange = (type) => {
    // Сбрасываем опции в зависимости от типа вопроса
    let newOptions = [];
    
    switch (type) {
      case 'singleChoice':
      case 'multipleChoice':
        newOptions = [
          { id: 1, text: '', isCorrect: false },
          { id: 2, text: '', isCorrect: false }
        ];
        break;
      case 'trueFalse':
        newOptions = [
          { id: 1, text: 'Верно', isCorrect: false },
          { id: 2, text: 'Неверно', isCorrect: false }
        ];
        break;
      case 'matching':
        newOptions = [
          { id: 1, text: '', match: '' },
          { id: 2, text: '', match: '' }
        ];
        break;
      case 'shortAnswer':
      case 'essay':
        newOptions = [];
        break;
      default:
        newOptions = [
          { id: 1, text: '', isCorrect: false },
          { id: 2, text: '', isCorrect: false }
        ];
    }
    
    setQuestionType(type);
    setQuestion({
      ...question,
      type: type,
      options: newOptions
    });
  };
  
  // Обработчик изменения текста опции
  const handleOptionTextChange = (id, e) => {
    const updatedOptions = question.options.map(option => {
      if (option.id === id) {
        return { ...option, text: e.target.value };
      }
      return option;
    });
    
    setQuestion({
      ...question,
      options: updatedOptions
    });
  };
  
  // Обработчик изменения соответствия для вопросов типа "matching"
  const handleMatchChange = (id, e) => {
    const updatedOptions = question.options.map(option => {
      if (option.id === id) {
        return { ...option, match: e.target.value };
      }
      return option;
    });
    
    setQuestion({
      ...question,
      options: updatedOptions
    });
  };
  
  // Обработчик изменения правильности ответа
  const handleCorrectChange = (id) => {
    let updatedOptions;
    
    if (question.type === 'singleChoice' || question.type === 'trueFalse') {
      // Для вопросов с одним правильным ответом
      updatedOptions = question.options.map(option => {
        return { ...option, isCorrect: option.id === id };
      });
    } else {
      // Для вопросов с множественным выбором
      updatedOptions = question.options.map(option => {
        if (option.id === id) {
          return { ...option, isCorrect: !option.isCorrect };
        }
        return option;
      });
    }
    
    setQuestion({
      ...question,
      options: updatedOptions
    });
  };
  
  // Добавление новой опции
  const addOption = () => {
    const newId = Math.max(...question.options.map(o => o.id), 0) + 1;
    let newOption;
    
    if (question.type === 'matching') {
      newOption = { id: newId, text: '', match: '' };
    } else {
      newOption = { id: newId, text: '', isCorrect: false };
    }
    
    setQuestion({
      ...question,
      options: [...question.options, newOption]
    });
  };
  
  // Удаление опции
  const removeOption = (id) => {
    if (question.options.length <= 2) {
      alert('Должно быть минимум 2 варианта ответа');
      return;
    }
    
    setQuestion({
      ...question,
      options: question.options.filter(option => option.id !== id)
    });
  };
  
  // Обработчик изменения пояснения
  const handleExplanationChange = (e) => {
    setQuestion({
      ...question,
      explanation: e.target.value
    });
  };
  
  // Обработчик изменения времени на вопрос
  const handleTimeLimitChange = (e) => {
    const value = parseInt(e.target.value, 10) || defaultQuestionTime;
    setQuestion({
      ...question,
      timeLimit: Math.max(5, Math.min(value, 300)) // Ограничиваем время от 5 до 300 секунд
    });
  };
  
  // Обработчик загрузки файла
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setQuestion({
          ...question,
          attachment: {
            name: file.name,
            type: file.type,
            url: event.target.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Удаление прикрепленного файла
  const removeAttachment = () => {
    setQuestion({
      ...question,
      attachment: null
    });
  };
  
  // Сохранение вопроса
  const saveQuestion = () => {
    if (!question.text.trim()) {
      alert('Введите текст вопроса');
      return;
    }
    
    if (['singleChoice', 'multipleChoice', 'trueFalse', 'matching'].includes(question.type)) {
      const isValid = question.options.every(option => option.text.trim() !== '');
      if (!isValid) {
        alert('Заполните все варианты ответов');
        return;
      }
      
      if (question.type === 'matching') {
        const isMatchValid = question.options.every(option => option.match.trim() !== '');
        if (!isMatchValid) {
          alert('Заполните все соответствия');
          return;
        }
      } else {
        const hasCorrect = question.options.some(option => option.isCorrect);
        if (!hasCorrect) {
          alert('Выберите хотя бы один правильный ответ');
          return;
        }
      }
    }
    
    onSave(question);
    
    // Сбрасываем форму
    setQuestion({
      text: '',
      type: 'singleChoice',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ],
      attachment: null,
      explanation: ''
    });
    setIsExpanded(false);
  };
  
  // Рендер опций в зависимости от типа вопроса
  const renderOptions = () => {
    switch (question.type) {
      case 'singleChoice':
      case 'multipleChoice':
        return (
          <div className="question-options">
            {question.options.map(option => (
              <div key={option.id} className="option-item">
                <div className="option-input-group">
                  <input
                    type={question.type === 'singleChoice' ? 'radio' : 'checkbox'}
                    checked={option.isCorrect}
                    onChange={() => handleCorrectChange(option.id)}
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(option.id, e)}
                    placeholder="Вариант ответа"
                  />
                </div>
                <button
                  className="btn-icon remove-option"
                  onClick={() => removeOption(option.id)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            <button className="btn btn-outline add-option" onClick={addOption}>
              <i className="fas fa-plus"></i> Добавить вариант
            </button>
          </div>
        );
      
      case 'trueFalse':
        return (
          <div className="question-options">
            {question.options.map(option => (
              <div key={option.id} className="option-item">
                <div className="option-input-group">
                  <input
                    type="radio"
                    checked={option.isCorrect}
                    onChange={() => handleCorrectChange(option.id)}
                  />
                  <span>{option.text}</span>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'matching':
        return (
          <div className="question-options matching-options">
            {question.options.map(option => (
              <div key={option.id} className="matching-item">
                <div className="matching-pair">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(option.id, e)}
                    placeholder="Элемент"
                  />
                  <span className="matching-arrow">→</span>
                  <input
                    type="text"
                    value={option.match}
                    onChange={(e) => handleMatchChange(option.id, e)}
                    placeholder="Соответствие"
                  />
                </div>
                <button
                  className="btn-icon remove-option"
                  onClick={() => removeOption(option.id)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            <button className="btn btn-outline add-option" onClick={addOption}>
              <i className="fas fa-plus"></i> Добавить пару
            </button>
          </div>
        );
      
      case 'shortAnswer':
        return (
          <div className="question-options">
            <div className="short-answer-preview">
              <input
                type="text"
                disabled
                placeholder="Поле для короткого ответа"
                className="short-answer-field"
              />
            </div>
          </div>
        );
      
      case 'essay':
        return (
          <div className="question-options">
            <div className="essay-preview">
              <textarea
                disabled
                placeholder="Поле для развернутого ответа"
                className="essay-field"
                rows="4"
              ></textarea>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Рендер AI подсказок, если включен режим AI
  const renderAIHelp = () => {
    if (!useAI) return null;
    
    return (
      <div className="ai-help-panel">
        <h4>Помощь ИИ</h4>
        <div className="ai-suggestions">
          <p>Введите тему или предмет, и ИИ предложит варианты вопросов:</p>
          <div className="ai-input-group">
            <input type="text" placeholder="Например: Физика, теория относительности" />
            <button className="btn btn-primary">Сгенерировать</button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="question-editor">
      {!isExpanded ? (
        <div className="add-question-button" onClick={() => setIsExpanded(true)}>
          <div className="add-icon">
            <i className="fas fa-plus"></i>
          </div>
          <span>Добавить вопрос или задание или материал</span>
          <div className="expand-icon">
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      ) : (
        <div className="question-form">
          <div className="question-form-header">
            <h3>Новый вопрос</h3>
            <button className="btn-icon" onClick={() => setIsExpanded(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="question-form-content">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="questionText">Заголовок</label>
                <input
                  type="text"
                  id="questionText"
                  value={question.text}
                  onChange={handleQuestionTextChange}
                  placeholder="Введите текст вопроса"
                />
                <small className="form-text text-muted">Если не указано не будет отображаться</small>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Формат ответа</label>
                <div className="question-types-dropdown">
                  <div className="selected-type" onClick={() => document.getElementById('questionTypesDropdown').classList.toggle('show')}>
                    {getQuestionTypeLabel(question.type)}
                    <i className="fas fa-chevron-down"></i>
                  </div>
                  <div id="questionTypesDropdown" className="question-types-list">
                    <div className="question-type-item" onClick={() => handleQuestionTypeChange('singleChoice')}>
                      <i className="fas fa-dot-circle"></i> Выбор одного варианта
                    </div>
                    <div className="question-type-item" onClick={() => handleQuestionTypeChange('multipleChoice')}>
                      <i className="fas fa-check-square"></i> Выбор нескольких вариантов
                    </div>
                    <div className="question-type-item" onClick={() => handleQuestionTypeChange('trueFalse')}>
                      <i className="fas fa-toggle-on"></i> Верно/Неверно
                    </div>
                    <div className="question-type-item" onClick={() => handleQuestionTypeChange('matching')}>
                      <i className="fas fa-random"></i> Сопоставление
                    </div>
                    <div className="question-type-item" onClick={() => handleQuestionTypeChange('shortAnswer')}>
                      <i className="fas fa-font"></i> Короткий ответ
                    </div>
                    <div className="question-type-item" onClick={() => handleQuestionTypeChange('essay')}>
                      <i className="fas fa-paragraph"></i> Развернутый ответ
                    </div>
                  </div>
                </div>
                <small className="form-text">после выбора список пропадает</small>
              </div>
            </div>
            
            <div className="question-content-container">
              <div className="question-content-left">
                {renderOptions()}
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Тут выпадают поля ответов вносит информацию</label>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Прикрепить файл / или ответ синий</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="questionAttachment"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <button
                        className="btn btn-outline"
                        onClick={() => document.getElementById('questionAttachment').click()}
                      >
                        <i className="fas fa-paperclip"></i> Прикрепить файл
                      </button>
                      
                      {question.attachment && (
                        <div className="attachment-preview">
                          <span>{question.attachment.name}</span>
                          <button className="btn-icon" onClick={removeAttachment}>
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {testFormat === 'quiz' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="timeLimit">Время на вопрос (в секундах)</label>
                      <div className="time-limit-input">
                        <input
                          type="number"
                          id="timeLimit"
                          value={question.timeLimit}
                          onChange={handleTimeLimitChange}
                          min="5"
                          max="300"
                        />
                        <div className="time-limit-controls">
                          <button 
                            type="button" 
                            className="time-control-btn" 
                            onClick={() => handleTimeLimitChange({ target: { value: question.timeLimit - 5 } })}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <button 
                            type="button" 
                            className="time-control-btn" 
                            onClick={() => handleTimeLimitChange({ target: { value: question.timeLimit + 5 } })}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <small className="form-text text-muted">Укажите время на ответ для этого вопроса (от 5 до 300 секунд)</small>
                    </div>
                  </div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="explanation">Пояснение к ответу (необязательно)</label>
                    <textarea
                      id="explanation"
                      value={question.explanation}
                      onChange={handleExplanationChange}
                      placeholder="Введите пояснение, которое будет показано после ответа"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              
              <div className="question-content-right">
                <div className="preview-container">
                  <h4>Превью как будет выглядеть</h4>
                  <div className="question-preview">
                    {question.text && <div className="preview-question-text">{question.text}</div>}
                    
                    {question.attachment && (
                      <div className="preview-attachment">
                        {question.attachment.type.startsWith('image/') ? (
                          <img src={question.attachment.url} alt="Прикрепленное изображение" />
                        ) : (
                          <div className="file-icon">
                            <i className="fas fa-file"></i>
                            <span>{question.attachment.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="preview-options">
                      {question.type === 'singleChoice' && question.options.map((option, idx) => (
                        <div key={idx} className="preview-option">
                          <input type="radio" disabled /> <span>{option.text || `Вариант ${idx + 1}`}</span>
                        </div>
                      ))}
                      
                      {question.type === 'multipleChoice' && question.options.map((option, idx) => (
                        <div key={idx} className="preview-option">
                          <input type="checkbox" disabled /> <span>{option.text || `Вариант ${idx + 1}`}</span>
                        </div>
                      ))}
                      
                      {question.type === 'trueFalse' && (
                        <>
                          <div className="preview-option">
                            <input type="radio" disabled /> <span>Верно</span>
                          </div>
                          <div className="preview-option">
                            <input type="radio" disabled /> <span>Неверно</span>
                          </div>
                        </>
                      )}
                      
                      {question.type === 'matching' && (
                        <div className="preview-matching">
                          <div className="preview-matching-left">
                            {question.options.map((option, idx) => (
                              <div key={idx} className="preview-matching-item">
                                {option.text || `Элемент ${idx + 1}`}
                              </div>
                            ))}
                          </div>
                          <div className="preview-matching-right">
                            {question.options.map((option, idx) => (
                              <div key={idx} className="preview-matching-item">
                                {option.match || `Соответствие ${idx + 1}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {question.type === 'shortAnswer' && (
                        <div className="preview-short-answer">
                          <input type="text" disabled placeholder="Короткий ответ" />
                        </div>
                      )}
                      
                      {question.type === 'essay' && (
                        <div className="preview-essay">
                          <textarea disabled placeholder="Развернутый ответ" rows="3"></textarea>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {renderAIHelp()}
              </div>
            </div>
          </div>
          
          <div className="question-form-actions">
            <button className="btn btn-secondary" onClick={() => setIsExpanded(false)}>Отмена</button>
            <button className="btn btn-primary" onClick={saveQuestion}>Сохранить</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Вспомогательная функция для получения названия типа вопроса
const getQuestionTypeLabel = (type) => {
  switch (type) {
    case 'singleChoice':
      return 'Выбор одного варианта';
    case 'multipleChoice':
      return 'Выбор нескольких вариантов';
    case 'trueFalse':
      return 'Верно/Неверно';
    case 'matching':
      return 'Сопоставление';
    case 'shortAnswer':
      return 'Короткий ответ';
    case 'essay':
      return 'Развернутый ответ';
    default:
      return 'Выбор одного варианта';
  }
};

export default QuestionEditor;
