import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNav from '../components/Dashboard/DashboardNav';
import QuestionEditor from '../components/Quiz/QuestionEditor';

const CreateTestPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [useAI, setUseAI] = useState(false);
  const [testData, setTestData] = useState({
    title: '',
    description: '',
    format: 'standard', // 'standard' - обычный тест, 'quiz' - квиз с ограничением времени на вопрос
    timeLimit: 30, // Общее время на тест (для обычного теста)
    questionTimeLimit: 20, // Время на один вопрос (для квиза)
    passingScore: 70,
    isPublic: true,
    tags: [],
    questions: [],
    // Настройки, которые будут доступны при публикации
    publishSettings: {
      // Общие настройки
      shuffleQuestions: true,
      shuffleAnswers: true,
      allowPartialCredit: true,
      showResults: true,
      attemptsAllowed: 1,
      
      // Настройки для обычного теста
      scheduledStart: '',
      scheduledEnd: '',
      
      // Настройки для квиза
      registrationStart: '',
      quizStart: '',
      allowLateRegistration: false
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestData({
      ...testData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setTestData({
      ...testData,
      [name]: checked
    });
  };
  
  // Обработчик изменения формата теста
  const handleFormatChange = (format) => {
    setTestData({
      ...testData,
      format
    });
  };
  
  // Обработчик изменения настроек публикации
  const handlePublishSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTestData({
      ...testData,
      publishSettings: {
        ...testData.publishSettings,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  const nextStep = () => {
    // Проверка валидности данных перед переходом на следующий шаг
    if (step === 1) {
      if (!testData.title.trim()) {
        alert('Введите название теста');
        return;
      }
    } else if (step === 2) {
      if (testData.questions.length === 0) {
        alert('Добавьте хотя бы один вопрос');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const saveTest = () => {
    // Здесь будет логика сохранения теста
    console.log('Тест сохранен:', testData);
    navigate('/dashboard/tests');
  };
  
  // Обработчик добавления нового вопроса
  const handleSaveQuestion = (question) => {
    const updatedQuestions = [...testData.questions, question];
    setTestData({
      ...testData,
      questions: updatedQuestions
    });
  };
  
  // Обработчик удаления вопроса
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...testData.questions];
    updatedQuestions.splice(index, 1);
    setTestData({
      ...testData,
      questions: updatedQuestions
    });
  };
  
  // Обработчик редактирования вопроса
  const handleEditQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...testData.questions];
    updatedQuestions[index] = updatedQuestion;
    setTestData({
      ...testData,
      questions: updatedQuestions
    });
  };
  
  // Форматирование даты и времени для отображения
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="create-test-page">
      <DashboardNav />
      <h1>Создание нового теста</h1>
      
      {/* Индикатор шагов */}
      <div className="steps-indicator">
        <div className={`step ${step === 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-name">Основные настройки</div>
        </div>
        <div className={`step ${step === 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-name">Создание вопросов</div>
        </div>
        <div className={`step ${step === 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-name">Предпросмотр и публикация</div>
        </div>
      </div>
      
      <div className="step-content">
        {step === 1 && (
          <div className="create-test-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Название теста</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={testData.title}
                  onChange={handleInputChange}
                  placeholder="Введите название теста"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description">Описание теста</label>
                <textarea
                  id="description"
                  name="description"
                  value={testData.description}
                  onChange={handleInputChange}
                  placeholder="Введите описание теста"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Формат теста</label>
                <div className="format-options">
                  <div 
                    className={`format-option ${testData.format === 'standard' ? 'active' : ''}`}
                    onClick={() => handleFormatChange('standard')}
                  >
                    <div className="format-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="format-details">
                      <h4>Обычный тест</h4>
                      <p>Участники отвечают на все вопросы в своем темпе в пределах общего времени</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`format-option ${testData.format === 'quiz' ? 'active' : ''}`}
                    onClick={() => handleFormatChange('quiz')}
                  >
                    <div className="format-icon">
                      <i className="fas fa-stopwatch"></i>
                    </div>
                    <div className="format-details">
                      <h4>Квиз</h4>
                      <p>Вопросы показываются поочередно с ограничением времени на каждый вопрос</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-row">
              {testData.format === 'standard' ? (
                <div className="form-group half">
                  <label htmlFor="timeLimit">Общее время на тест (в минутах)</label>
                  <input
                    type="number"
                    id="timeLimit"
                    name="timeLimit"
                    value={testData.timeLimit}
                    onChange={handleInputChange}
                    min="1"
                    max="180"
                  />
                </div>
              ) : (
                <div className="form-group half">
                  <label htmlFor="questionTimeLimit">Время на один вопрос (в секундах)</label>
                  <input
                    type="number"
                    id="questionTimeLimit"
                    name="questionTimeLimit"
                    value={testData.questionTimeLimit}
                    onChange={handleInputChange}
                    min="5"
                    max="120"
                  />
                </div>
              )}
              
              <div className="form-group half">
                <label htmlFor="passingScore">Проходной балл (%)</label>
                <input
                  type="number"
                  id="passingScore"
                  name="passingScore"
                  value={testData.passingScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Доступность</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="isPublicYes"
                      name="isPublic"
                      checked={testData.isPublic}
                      onChange={() => setTestData({...testData, isPublic: true})}
                    />
                    <label htmlFor="isPublicYes">Публичный</label>
                  </div>
                  
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="isPublicNo"
                      name="isPublic"
                      checked={!testData.isPublic}
                      onChange={() => setTestData({...testData, isPublic: false})}
                    />
                    <label htmlFor="isPublicNo">Приватный</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tags">Теги (через запятую)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={testData.tags.join(', ')}
                  onChange={(e) => {
                    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                    setTestData({...testData, tags: tagsArray});
                  }}
                  placeholder="Например: математика, алгебра, уравнения"
                />
              </div>
            </div>
            

            
            <div className="form-actions">
              <button className="btn btn-primary" onClick={nextStep}>Далее</button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="create-questions">
            {/* Переключатель режима AI */}
            <div className="ai-toggle">
              <div 
                className={`ai-option ${!useAI ? 'active' : ''}`}
                onClick={() => setUseAI(false)}
              >
                <input 
                  type="radio" 
                  checked={!useAI} 
                  onChange={() => setUseAI(false)} 
                />
                Ручное создание вопросов
              </div>
              <div 
                className={`ai-option ${useAI ? 'active' : ''}`}
                onClick={() => setUseAI(true)}
              >
                <input 
                  type="radio" 
                  checked={useAI} 
                  onChange={() => setUseAI(true)} 
                />
                Использовать помощь ИИ
              </div>
            </div>
            
            {/* Список созданных вопросов */}
            {testData.questions.length > 0 && (
              <div className="questions-list">
                <h3>Созданные вопросы ({testData.questions.length})</h3>
                {testData.questions.map((question, index) => (
                  <div key={index} className="question-item">
                    <div className="question-header">
                      <span>Вопрос {index + 1}: {question.text}</span>
                      <div className="question-actions">
                        <button 
                          className="btn-icon" 
                          onClick={() => {
                            // Здесь будет логика редактирования вопроса
                            // Пока просто заглушка
                            alert('Редактирование вопроса будет реализовано позже');
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => handleDeleteQuestion(index)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="question-content">
                      <p>Тип: {getQuestionTypeLabel(question.type)}</p>
                      {question.options && question.options.length > 0 && (
                        <p>Вариантов ответа: {question.options.length}</p>
                      )}
                      {testData.format === 'quiz' && question.timeLimit && (
                        <p>Время на вопрос: {question.timeLimit} сек.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Редактор вопросов */}
            <QuestionEditor 
              onSave={handleSaveQuestion} 
              useAI={useAI} 
              testFormat={testData.format}
              defaultQuestionTime={testData.questionTimeLimit}
            />
            
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={prevStep}>Назад</button>
              <button className="btn btn-primary" onClick={nextStep}>Далее</button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="test-preview">
            <div className="publish-settings">
              <h3>Настройки публикации</h3>
              <p className="settings-description">Настройте параметры публикации и прохождения теста перед его публикацией</p>
              
              <div className="settings-section">
                <h4>Расписание теста</h4>
                {testData.format === 'standard' ? (
                  <div className="form-row">
                    <div className="form-group">
                      <div className="schedule-inputs">
                        <div className="schedule-input-group">
                          <label htmlFor="scheduledStart">Дата и время начала</label>
                          <input
                            type="datetime-local"
                            id="scheduledStart"
                            name="scheduledStart"
                            value={testData.publishSettings.scheduledStart}
                            onChange={handlePublishSettingChange}
                          />
                        </div>
                        <div className="schedule-input-group">
                          <label htmlFor="scheduledEnd">Дата и время окончания</label>
                          <input
                            type="datetime-local"
                            id="scheduledEnd"
                            name="scheduledEnd"
                            value={testData.publishSettings.scheduledEnd}
                            onChange={handlePublishSettingChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Расписание квиза</label>
                        <p className="settings-description">
                          Для квиза необходимо указать время регистрации и время начала. Все участники начнут отвечать на вопросы одновременно в указанное время начала.
                        </p>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <div className="schedule-inputs">
                          <div className="schedule-input-group">
                            <label htmlFor="registrationStart">Начало регистрации</label>
                            <input
                              type="datetime-local"
                              id="registrationStart"
                              name="registrationStart"
                              value={testData.publishSettings.registrationStart || ''}
                              onChange={handlePublishSettingChange}
                            />
                          </div>
                          <div className="schedule-input-group">
                            <label htmlFor="quizStart">Время начала квиза</label>
                            <input
                              type="datetime-local"
                              id="quizStart"
                              name="quizStart"
                              value={testData.publishSettings.quizStart || ''}
                              onChange={handlePublishSettingChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <div className="checkbox-option">
                          <input
                            type="checkbox"
                            id="allowLateRegistration"
                            name="allowLateRegistration"
                            checked={testData.publishSettings.allowLateRegistration || false}
                            onChange={handlePublishSettingChange}
                          />
                          <label htmlFor="allowLateRegistration">Разрешить позднюю регистрацию (участники смогут присоединиться после начала квиза)</label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="settings-section">
                <h4>Настройки прохождения</h4>
                <div className="form-row">
                  <div className="form-group">
                    <div className="checkbox-group">
                      <div className="checkbox-option">
                        <input
                          type="checkbox"
                          id="shuffleQuestions"
                          name="shuffleQuestions"
                          checked={testData.publishSettings.shuffleQuestions}
                          onChange={handlePublishSettingChange}
                        />
                        <label htmlFor="shuffleQuestions">Перемешивать порядок вопросов</label>
                      </div>
                      <div className="checkbox-option">
                        <input
                          type="checkbox"
                          id="shuffleAnswers"
                          name="shuffleAnswers"
                          checked={testData.publishSettings.shuffleAnswers}
                          onChange={handlePublishSettingChange}
                        />
                        <label htmlFor="shuffleAnswers">Перемешивать варианты ответов</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="attemptsAllowed">Количество попыток</label>
                    <input
                      type="number"
                      id="attemptsAllowed"
                      name="attemptsAllowed"
                      value={testData.publishSettings.attemptsAllowed}
                      onChange={handlePublishSettingChange}
                      min="1"
                      max="10"
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label>Показывать результаты</label>
                    <div className="checkbox-option">
                      <input
                        type="checkbox"
                        id="showResults"
                        name="showResults"
                        checked={testData.publishSettings.showResults}
                        onChange={handlePublishSettingChange}
                      />
                      <label htmlFor="showResults">Показывать результаты после завершения</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h4>Начисление баллов</h4>
                <div className="form-row">
                  <div className="form-group">
                    <div className="checkbox-option">
                      <input
                        type="checkbox"
                        id="allowPartialCredit"
                        name="allowPartialCredit"
                        checked={testData.publishSettings.allowPartialCredit}
                        onChange={handlePublishSettingChange}
                      />
                      <label htmlFor="allowPartialCredit">Разрешить частичное начисление баллов за частично правильные ответы</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="test-summary">
              <h3>Предпросмотр теста</h3>
              
              <div className="test-info">
                <div className="info-section">
                  <h4>Основная информация</h4>
                  <div className="info-item">
                    <span className="info-label">Название:</span>
                    <span className="info-value">{testData.title}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Описание:</span>
                    <span className="info-value">{testData.description}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Формат теста:</span>
                    <span className="info-value">{testData.format === 'standard' ? 'Обычный тест' : 'Квиз'}</span>
                  </div>
                  
                  {testData.format === 'standard' ? (
                    <div className="info-item">
                      <span className="info-label">Ограничение по времени:</span>
                      <span className="info-value">{testData.timeLimit} мин.</span>
                    </div>
                  ) : (
                    <div className="info-item">
                      <span className="info-label">Время на вопрос:</span>
                      <span className="info-value">{testData.questionTimeLimit} сек.</span>
                    </div>
                  )}
                  
                  <div className="info-item">
                    <span className="info-label">Проходной балл:</span>
                    <span className="info-value">{testData.passingScore}%</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Доступность:</span>
                    <span className="info-value">{testData.isPublic ? 'Публичный' : 'Приватный'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Теги:</span>
                    <span className="info-value">
                      {testData.tags.length > 0 ? testData.tags.join(', ') : 'Нет тегов'}
                    </span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Количество вопросов:</span>
                    <span className="info-value">{testData.questions.length}</span>
                  </div>
                </div>
                
                <div className="info-section">
                  <h4>Настройки публикации</h4>
                  
                  {testData.format === 'standard' ? (
                    <div className="info-item">
                      <span className="info-label">Расписание:</span>
                      <span className="info-value">
                        {testData.publishSettings.scheduledStart && testData.publishSettings.scheduledEnd ? (
                          <>
                            С {formatDateTime(testData.publishSettings.scheduledStart)} по {formatDateTime(testData.publishSettings.scheduledEnd)}
                          </>
                        ) : 'Не установлено'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="info-item">
                        <span className="info-label">Начало регистрации:</span>
                        <span className="info-value">
                          {testData.publishSettings.registrationStart ? formatDateTime(testData.publishSettings.registrationStart) : 'Не установлено'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Время начала квиза:</span>
                        <span className="info-value">
                          {testData.publishSettings.quizStart ? formatDateTime(testData.publishSettings.quizStart) : 'Не установлено'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Поздняя регистрация:</span>
                        <span className="info-value">{testData.publishSettings.allowLateRegistration ? 'Разрешена' : 'Запрещена'}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="info-item">
                    <span className="info-label">Количество попыток:</span>
                    <span className="info-value">{testData.publishSettings.attemptsAllowed}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Перемешивание вопросов:</span>
                    <span className="info-value">{testData.publishSettings.shuffleQuestions ? 'Да' : 'Нет'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Перемешивание ответов:</span>
                    <span className="info-value">{testData.publishSettings.shuffleAnswers ? 'Да' : 'Нет'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Показ результатов:</span>
                    <span className="info-value">{testData.publishSettings.showResults ? 'Да' : 'Нет'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Частичное начисление баллов:</span>
                    <span className="info-value">{testData.publishSettings.allowPartialCredit ? 'Да' : 'Нет'}</span>
                  </div>
                </div>
              </div>
              
              <div className="questions-preview">
                <h4>Вопросы теста:</h4>
                {testData.questions.map((question, index) => (
                  <div key={index} className="preview-question-item">
                    <div className="preview-question-header">
                      <span>Вопрос {index + 1}: {question.text}</span>
                    </div>
                    <div className="preview-question-details">
                      <p>Тип: {getQuestionTypeLabel(question.type)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={prevStep}>Назад</button>
              <button className="btn btn-primary" onClick={saveTest}>Опубликовать</button>
            </div>
          </div>
        )}
      </div>
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
      return 'Неизвестный тип';
  }
};

export default CreateTestPage;
