import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../contexts/QuizContext';
import { useCollapse } from '../../contexts/CollapseContext';

// Импортируем компоненты шагов
import ProgressIndicator from './AssignmentSteps/ProgressIndicator';
import Step1TestType from './AssignmentSteps/Step1TestType';
import Step2TestSelection from './AssignmentSteps/Step2TestSelection';
import Step3Timing from './AssignmentSteps/Step3Timing';
import Step4Settings from './AssignmentSteps/Step4Settings';
import Step5GroupsSelection from './AssignmentSteps/Step5GroupsSelection';
import StepNavigation from './AssignmentSteps/StepNavigation';
import MessageDisplay from './AssignmentSteps/MessageDisplay';
import { FaArrowLeft, FaArrowRight, FaCheck, FaUserPlus, FaUserMinus, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const StepByStepAssignment = () => {
  const { currentUser } = useAuth();
  const { quizzes } = useQuiz();
  const { collapsedComponents, toggleComponent } = useCollapse();
  
  // Состояния
  const [currentStep, setCurrentStep] = useState(1); // Текущий шаг формы
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Выбранные пользователи из групп
  const [expandedGroups, setExpandedGroups] = useState([]); // Выбранные группы для отображения пользователей
  const [assignmentDate, setAssignmentDate] = useState({
    startDate: '',
    endDate: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [testType, setTestType] = useState('standard'); // 'standard', 'quiz', 'homework'
  const [showUserSelection, setShowUserSelection] = useState(false); // Показывать ли выбор отдельных пользователей
  
  // Дополнительные настройки публикации
  const [publishSettings, setPublishSettings] = useState({
    // Общие настройки
    shuffleQuestions: true,
    shuffleAnswers: true,
    allowPartialCredit: true,
    showResults: true,
    attemptsAllowed: 1,
    allowLateRegistration: false,
    timeLimit: 30, // в минутах
    passingScore: 70, // в процентах
    
    // Специфичные настройки для квиза
    questionTimeLimit: 20, // время на один вопрос в секундах
    registrationStart: '', // время начала регистрации
    quizStart: '', // время начала квиза
    
    // Специфичные настройки для домашнего задания
    allowLateSubmission: true, // разрешить позднюю сдачу
    penaltyPercent: 10, // процент штрафа за позднюю сдачу
    notifyDeadline: true // уведомлять о приближении срока сдачи
  });

  // Получаем список групп преподавателя
  const teacherGroups = [
    { id: '1', name: 'Группа 101' },
    { id: '2', name: 'Группа 102' },
    { id: '3', name: 'Группа 201' }
  ];
  
  // Моковые данные пользователей в группах
  const usersInGroups = {
    '1': [
      { id: 'u1', name: 'Иванов Иван', email: 'ivanov@example.com' },
      { id: 'u2', name: 'Петрова Анна', email: 'petrova@example.com' },
      { id: 'u3', name: 'Сидоров Петр', email: 'sidorov@example.com' },
    ],
    '2': [
      { id: 'u4', name: 'Козлов Алексей', email: 'kozlov@example.com' },
      { id: 'u5', name: 'Новикова Екатерина', email: 'novikova@example.com' },
    ],
    '3': [
      { id: 'u6', name: 'Смирнов Дмитрий', email: 'smirnov@example.com' },
      { id: 'u7', name: 'Волкова Мария', email: 'volkova@example.com' },
      { id: 'u8', name: 'Кузнецов Андрей', email: 'kuznetsov@example.com' },
    ]
  };

  // Получаем список тестов, которые можно назначить
  useEffect(() => {
    // В реальном приложении здесь будет API-запрос
    // Сейчас используем моковые данные из контекста
    setAvailableTests(quizzes || []);
  }, [quizzes]);

  // Функции навигации между шагами
  const nextStep = () => {
    // Валидация перед переходом к следующему шагу
    if (currentStep === 1) {
      // Проверка выбора типа теста
      if (!testType) {
        setErrorMessage('Выберите тип задания');
        return;
      }
    } else if (currentStep === 2) {
      // Проверка выбора теста
      if (!selectedTest) {
        setErrorMessage('Выберите тест');
        return;
      }
    } else if (currentStep === 3) {
      // Проверка дат начала и окончания
      if (testType === 'quiz') {
        if (!publishSettings.registrationStart || !publishSettings.quizStart) {
          setErrorMessage('Укажите время начала регистрации и время начала квиза');
          return;
        }
      } else {
        if (!assignmentDate.startDate || !assignmentDate.endDate) {
          setErrorMessage('Укажите даты начала и окончания');
          return;
        }
      }
    } else if (currentStep === 4) {
      // Проверка настроек публикации
      if (publishSettings.passingScore <= 0 || publishSettings.passingScore > 100) {
        setErrorMessage('Укажите корректный проходной балл (1-100%)');
        return;
      }
      
      if (testType === 'standard' && publishSettings.timeLimit <= 0) {
        setErrorMessage('Укажите корректное время на прохождение');
        return;
      }
      
      if (testType === 'quiz' && publishSettings.questionTimeLimit <= 0) {
        setErrorMessage('Укажите корректное время на вопрос');
        return;
      }
    } else if (currentStep === 5) {
      // Проверка выбора групп или пользователей
      if (selectedGroups.length === 0 && selectedUsers.length === 0) {
        setErrorMessage('Выберите хотя бы одну группу или пользователя');
        return;
      }
    }
    
    // Если это последний шаг, отправляем форму
    if (currentStep === 5) {
      assignTest();
      return;
    }
    
    // Переход к следующему шагу
    setCurrentStep(currentStep + 1);
    setErrorMessage('');
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setErrorMessage('');
  };
  
  // Обработчик выбора теста
  const handleTestChange = (e) => {
    setSelectedTest(e.target.value);
    // Сбрасываем сообщения при изменении выбора
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  // Обработчик изменения типа теста
  const handleTestTypeChange = (type) => {
    setTestType(type);
    // Сбрасываем сообщения при изменении типа
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  // Обработчик выбора отдельных пользователей
  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  // Функция для выбора всех пользователей в группе
  const selectAllUsersInGroup = (groupId) => {
    const usersInGroup = usersInGroups[groupId] || [];
    const userIds = usersInGroup.map(user => user.id);
    
    setSelectedUsers(prev => {
      const newSelection = [...prev];
      userIds.forEach(userId => {
        if (!newSelection.includes(userId)) {
          newSelection.push(userId);
        }
      });
      return newSelection;
    });
  };
  
  // Функция для снятия выбора со всех пользователей в группе
  const deselectAllUsersInGroup = (groupId) => {
    const usersInGroup = usersInGroups[groupId] || [];
    const userIds = usersInGroup.map(user => user.id);
    
    setSelectedUsers(prev => prev.filter(id => !userIds.includes(id)));
  };
  
  // Функция для проверки, выбраны ли все пользователи в группе
  const areAllUsersInGroupSelected = (groupId) => {
    const usersInGroup = usersInGroups[groupId] || [];
    return usersInGroup.every(user => selectedUsers.includes(user.id));
  };
  
  // Функция для проверки, выбран ли хотя бы один пользователь в группе
  const isAnyUserInGroupSelected = (groupId) => {
    const usersInGroup = usersInGroups[groupId] || [];
    return usersInGroup.some(user => selectedUsers.includes(user.id));
  };
  
  // Функция для переключения состояния развернутой группы
  const toggleGroupExpansion = (groupId) => {
    setExpandedGroups(prev => {
      if (prev.includes(groupId)) {
        // Если группа уже развернута, сворачиваем её
        return prev.filter(id => id !== groupId);
      } else {
        // Иначе разворачиваем группу
        return [...prev, groupId];
      }
    });
  };

  // Обработчик выбора группы
  const handleGroupChange = (groupId) => {
    setSelectedGroups(prevSelected => {
      if (prevSelected.includes(groupId)) {
        return prevSelected.filter(id => id !== groupId);
      } else {
        return [...prevSelected, groupId];
      }
    });
    // Сбрасываем сообщения при изменении выбора
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Обработчик изменения дат
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setAssignmentDate(prev => ({
      ...prev,
      [name]: value
    }));
    // Сбрасываем сообщения при изменении дат
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  // Обработчик изменения настроек публикации
  const handlePublishSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPublishSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Сбрасываем сообщения при изменении настроек
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  // Обработчик изменения числовых настроек
  const handleNumberSettingChange = (e) => {
    const { name, value } = e.target;
    setPublishSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
    // Сбрасываем сообщения при изменении настроек
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Назначение теста группам
  const assignTest = () => {
    // В реальном приложении здесь будет API-запрос для назначения теста
    console.log('Назначение теста:', {
      testId: selectedTest,
      testType: testType,
      groups: selectedGroups,
      selectedUsers: selectedUsers,
      startDate: assignmentDate.startDate,
      endDate: assignmentDate.endDate,
      publishSettings: publishSettings
    });
    
    // Показываем сообщение об успехе
    const assignmentTypes = {
      'standard': 'тест',
      'quiz': 'квиз',
      'homework': 'домашнее задание'
    };
    
    setSuccessMessage(`${assignmentTypes[testType]} успешно назначен выбранным группам/пользователям`);
    
    // Сбрасываем форму
    setSelectedTest('');
    setSelectedGroups([]);
    setSelectedUsers([]);
    setTestType('standard');
    setCurrentStep(1);
    setAssignmentDate({
      startDate: '',
      endDate: ''
    });
    
    // Сбрасываем настройки публикации к значениям по умолчанию
    setPublishSettings({
      // Общие настройки
      shuffleQuestions: true,
      shuffleAnswers: true,
      allowPartialCredit: true,
      showResults: true,
      attemptsAllowed: 1,
      allowLateRegistration: false,
      timeLimit: 30,
      passingScore: 70,
      
      // Специфичные настройки для квиза
      questionTimeLimit: 20,
      registrationStart: '',
      quizStart: '',
      
      // Специфичные настройки для домашнего задания
      allowLateSubmission: true,
      penaltyPercent: 10,
      notifyDeadline: true
    });
  };

  // Рендеринг индикатора прогресса
  const renderProgressIndicator = () => {
    const steps = [
      'Тип задания',
      'Выбор теста',
      'Сроки',
      'Настройки',
      'Назначение'
    ];
    
    return (
      <div className="progress-indicator">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`progress-step ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step}</div>
          </div>
        ))}
      </div>
    );
  };

  // Рендеринг текущего шага
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  // Рендеринг шага 1: Выбор типа теста
  const renderStep1 = () => {
    return <Step1TestType testType={testType} handleTestTypeChange={handleTestTypeChange} />;
  };

  // Рендеринг шага 2: Выбор теста
  const renderStep2 = () => {
    return (
      <div className="assignment-step">
        <h3>Выберите тест</h3>
        <div className="test-selection">
          <select 
            value={selectedTest} 
            onChange={handleTestChange}
            className="test-select"
          >
            <option value="">— Выберите тест —</option>
            {availableTests.map(test => (
              <option key={test.id} value={test.id}>
                {test.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // Рендеринг шага 3: Настройка сроков
  const renderStep3 = () => {
    if (testType === 'quiz') {
      return (
        <div className="assignment-step">
          <h3>Настройка времени квиза</h3>
          <div className="date-selection">
            <div className="date-input">
              <label htmlFor="registrationStart">Начало регистрации</label>
              <input
                type="datetime-local"
                id="registrationStart"
                name="registrationStart"
                value={publishSettings.registrationStart}
                onChange={handlePublishSettingChange}
              />
            </div>
            <div className="date-input">
              <label htmlFor="quizStart">Время начала квиза</label>
              <input
                type="datetime-local"
                id="quizStart"
                name="quizStart"
                value={publishSettings.quizStart}
                onChange={handlePublishSettingChange}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="assignment-step">
          <h3>Настройка сроков</h3>
          <div className="date-selection">
            <div className="date-input">
              <label htmlFor="startDate">Дата начала</label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={assignmentDate.startDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="date-input">
              <label htmlFor="endDate">Дата окончания</label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={assignmentDate.endDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </div>
      );
    }
  };

  // Рендеринг шага 4: Настройки прохождения
  const renderStep4 = () => {
    return (
      <div className="assignment-step">
        <h3>Настройки прохождения</h3>
        
        {/* Общие настройки для всех типов */}
        <div className="settings-group">
          <div className="setting-item">
            <label htmlFor="passingScore">Проходной балл (%)</label>
            <input
              type="number"
              id="passingScore"
              name="passingScore"
              min="1"
              max="100"
              value={publishSettings.passingScore}
              onChange={handleNumberSettingChange}
            />
          </div>
          
          {testType !== 'quiz' && (
            <div className="setting-item">
              <label htmlFor="attemptsAllowed">Количество попыток</label>
              <input
                type="number"
                id="attemptsAllowed"
                name="attemptsAllowed"
                min="1"
                max="10"
                value={publishSettings.attemptsAllowed}
                onChange={handleNumberSettingChange}
              />
            </div>
          )}
          
          {testType === 'standard' && (
            <div className="setting-item">
              <label htmlFor="timeLimit">Время на прохождение (минуты)</label>
              <input
                type="number"
                id="timeLimit"
                name="timeLimit"
                min="1"
                max="180"
                value={publishSettings.timeLimit}
                onChange={handleNumberSettingChange}
              />
            </div>
          )}
        </div>
        
        {/* Специфичные настройки для квиза */}
        {testType === 'quiz' && (
          <div className="quiz-specific-settings">
            <h4>Настройки квиза</h4>
            <div className="settings-group">
              <div className="setting-item">
                <label htmlFor="questionTimeLimit">Время на вопрос (секунды)</label>
                <input
                  type="number"
                  id="questionTimeLimit"
                  name="questionTimeLimit"
                  min="5"
                  max="300"
                  value={publishSettings.questionTimeLimit}
                  onChange={handleNumberSettingChange}
                />
              </div>
            </div>
            
            <div className="checkbox-settings">
              <div className="checkbox-setting">
                <input
                  type="checkbox"
                  id="allowLateRegistration"
                  name="allowLateRegistration"
                  checked={publishSettings.allowLateRegistration}
                  onChange={handlePublishSettingChange}
                />
                <label htmlFor="allowLateRegistration">Разрешить позднюю регистрацию</label>
              </div>
            </div>
          </div>
        )}
        
        {/* Специфичные настройки для домашнего задания */}
        {testType === 'homework' && (
          <div className="homework-specific-settings">
            <h4>Настройки домашнего задания</h4>
            <div className="checkbox-settings">
              <div className="checkbox-setting">
                <input
                  type="checkbox"
                  id="allowLateSubmission"
                  name="allowLateSubmission"
                  checked={publishSettings.allowLateSubmission}
                  onChange={handlePublishSettingChange}
                />
                <label htmlFor="allowLateSubmission">Разрешить позднюю сдачу</label>
              </div>
              
              <div className="checkbox-setting">
                <input
                  type="checkbox"
                  id="notifyDeadline"
                  name="notifyDeadline"
                  checked={publishSettings.notifyDeadline}
                  onChange={handlePublishSettingChange}
                />
                <label htmlFor="notifyDeadline">Уведомлять о приближении срока</label>
              </div>
            </div>
            
            {publishSettings.allowLateSubmission && (
              <div className="setting-item">
                <label htmlFor="penaltyPercent">Штраф за позднюю сдачу (%)</label>
                <input
                  type="number"
                  id="penaltyPercent"
                  name="penaltyPercent"
                  min="0"
                  max="100"
                  value={publishSettings.penaltyPercent}
                  onChange={handleNumberSettingChange}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Общие настройки для всех типов */}
        <div className="checkbox-settings">
          <div className="checkbox-setting">
            <input
              type="checkbox"
              id="shuffleQuestions"
              name="shuffleQuestions"
              checked={publishSettings.shuffleQuestions}
              onChange={handlePublishSettingChange}
            />
            <label htmlFor="shuffleQuestions">Перемешивать вопросы</label>
          </div>
          
          <div className="checkbox-setting">
            <input
              type="checkbox"
              id="shuffleAnswers"
              name="shuffleAnswers"
              checked={publishSettings.shuffleAnswers}
              onChange={handlePublishSettingChange}
            />
            <label htmlFor="shuffleAnswers">Перемешивать варианты ответов</label>
          </div>
          
          <div className="checkbox-setting">
            <input
              type="checkbox"
              id="allowPartialCredit"
              name="allowPartialCredit"
              checked={publishSettings.allowPartialCredit}
              onChange={handlePublishSettingChange}
            />
            <label htmlFor="allowPartialCredit">Разрешить частичные баллы за неполные ответы</label>
          </div>
          
          <div className="checkbox-setting">
            <input
              type="checkbox"
              id="showResults"
              name="showResults"
              checked={publishSettings.showResults}
              onChange={handlePublishSettingChange}
            />
            <label htmlFor="showResults">Показывать результаты после завершения</label>
          </div>
        </div>
      </div>
    );
  };

  // Рендеринг шага 5: Выбор групп и пользователей
  const renderStep5 = () => {
    return (
      <div className="assignment-step">
        <h3>Выбор групп и пользователей</h3>
        
        <div className="groups-selection">
          {teacherGroups.map(group => {
            const isGroupExpanded = expandedGroups.includes(group.id);
            return (
              <div key={group.id} className="group-container">
                <div className="group-header">
                  <div className="group-checkbox">
                    <input
                      type="checkbox"
                      id={`group-${group.id}`}
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => handleGroupChange(group.id)}
                    />
                    <label htmlFor={`group-${group.id}`}>{group.name}</label>
                  </div>
                  <div className="group-actions">
                    <button 
                      className="select-users-button"
                      onClick={() => toggleGroupExpansion(group.id)}
                    >
                      {isGroupExpanded ? (
                        <>
                          <FaUserMinus /> Скрыть пользователей
                        </>
                      ) : (
                        <>
                          <FaUserPlus /> Выбрать пользователей
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {isGroupExpanded && (
                  <div className="users-list">
                    <div className="users-list-header">
                      <button 
                        className="select-all-button"
                        onClick={() => selectAllUsersInGroup(group.id)}
                        disabled={areAllUsersInGroupSelected(group.id)}
                      >
                        <FaUserPlus /> Выбрать всех
                      </button>
                      <button 
                        className="deselect-all-button"
                        onClick={() => deselectAllUsersInGroup(group.id)}
                        disabled={!isAnyUserInGroupSelected(group.id)}
                      >
                        <FaUserMinus /> Отменить выбор
                      </button>
                    </div>
                    {usersInGroups[group.id]?.map(user => (
                      <div key={user.id} className="user-item">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelection(user.id)}
                        />
                        <label htmlFor={`user-${user.id}`}>
                          <span className="user-name">{user.name}</span>
                          <span className="user-email">{user.email}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Рендеринг кнопок навигации
  const renderNavButtons = () => {
    return (
      <div className="step-navigation">
        {currentStep > 1 && (
          <button 
            className="prev-step-button"
            onClick={prevStep}
          >
            <FaArrowLeft /> Назад
          </button>
        )}
        
        <button 
          className="next-step-button"
          onClick={nextStep}
        >
          {currentStep === 5 ? (
            <>
              <FaCheck /> Назначить
            </>
          ) : (
            <>
              Далее <FaArrowRight />
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="assign-tests-container">
      <div className="assign-tests-container-header">
        <h2>Назначение тестов группам</h2>
        <button 
          className={`collapse-button ${collapsedComponents.stepByStepSection ? 'collapsed' : ''}`}
          onClick={() => toggleComponent('stepByStepSection')}
        >
          <i className={`fas fa-chevron-${collapsedComponents.stepByStepSection ? 'down' : 'up'}`}></i>
        </button>
      </div>
      
      <div className={`assign-tests-container-content ${collapsedComponents.stepByStepSection ? 'collapsed' : ''}`}>
        {successMessage && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i> {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {errorMessage}
          </div>
        )}
        
        <div className="step-by-step-form">
          {renderProgressIndicator()}
          {renderCurrentStep()}
          {renderNavButtons()}
        </div>
      </div>
    </div>
  );
};

export default StepByStepAssignment;
