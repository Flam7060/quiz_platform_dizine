// Сервис для работы с тестами
// В реальном приложении здесь будут запросы к API

// Имитация базы данных тестов
const quizzes = [
  {
    id: '1',
    title: 'Основы математики',
    description: 'Тест по основам математики для 10 класса',
    timeLimit: 30, // в минутах
    createdBy: '2',
    groupId: '2',
    status: 'active',
    startDate: new Date('2025-05-01T10:00:00'),
    endDate: new Date('2025-06-01T23:59:59'),
    questions: [
      {
        id: '1',
        type: 'single',
        text: 'Чему равен корень из 144?',
        options: [
          { id: '1', text: '10' },
          { id: '2', text: '12' },
          { id: '3', text: '14' },
          { id: '4', text: '16' }
        ],
        correctAnswer: '2',
        points: 1
      },
      {
        id: '2',
        type: 'multiple',
        text: 'Выберите правильные утверждения о квадратных уравнениях:',
        options: [
          { id: '1', text: 'Квадратное уравнение всегда имеет два корня' },
          { id: '2', text: 'Дискриминант может быть отрицательным' },
          { id: '3', text: 'Если дискриминант равен нулю, то уравнение имеет один корень' },
          { id: '4', text: 'Сумма корней равна коэффициенту при x, взятому с противоположным знаком' }
        ],
        correctAnswer: ['2', '3', '4'],
        points: 2
      },
      {
        id: '3',
        type: 'text',
        text: 'Запишите формулу для вычисления дискриминанта квадратного уравнения ax² + bx + c = 0',
        correctAnswer: 'b^2-4ac',
        points: 2
      },
      {
        id: '4',
        type: 'matching',
        text: 'Сопоставьте функции и их графики:',
        pairs: [
          { id: '1', left: 'y = x²', right: 'Парабола' },
          { id: '2', left: 'y = sin(x)', right: 'Синусоида' },
          { id: '3', left: 'y = |x|', right: 'Модуль' },
          { id: '4', left: 'y = 1/x', right: 'Гипербола' }
        ],
        points: 3
      }
    ]
  },
  {
    id: '2',
    title: 'Физика: Механика',
    description: 'Тест по основам механики для 11 класса',
    timeLimit: 45, // в минутах
    createdBy: '2',
    groupId: '3',
    status: 'upcoming',
    startDate: new Date('2025-05-20T10:00:00'),
    endDate: new Date('2025-06-20T23:59:59'),
    questions: [
      {
        id: '1',
        type: 'single',
        text: 'Какая формула выражает второй закон Ньютона?',
        options: [
          { id: '1', text: 'F = ma' },
          { id: '2', text: 'E = mc²' },
          { id: '3', text: 'F = G(m₁m₂)/r²' },
          { id: '4', text: 'p = mv' }
        ],
        correctAnswer: '1',
        points: 1
      },
      {
        id: '2',
        type: 'multiple',
        text: 'Выберите величины, которые являются векторными:',
        options: [
          { id: '1', text: 'Скорость' },
          { id: '2', text: 'Масса' },
          { id: '3', text: 'Ускорение' },
          { id: '4', text: 'Время' }
        ],
        correctAnswer: ['1', '3'],
        points: 2
      }
    ]
  },
  {
    id: '3',
    title: 'История России',
    description: 'Тест по истории России XX века',
    timeLimit: 60, // в минутах
    createdBy: '2',
    groupId: '2',
    status: 'completed',
    startDate: new Date('2025-04-01T10:00:00'),
    endDate: new Date('2025-04-30T23:59:59'),
    questions: [
      {
        id: '1',
        type: 'single',
        text: 'В каком году произошла Октябрьская революция?',
        options: [
          { id: '1', text: '1905' },
          { id: '2', text: '1914' },
          { id: '3', text: '1917' },
          { id: '4', text: '1922' }
        ],
        correctAnswer: '3',
        points: 1
      }
    ]
  }
];

// Имитация базы данных результатов тестов
const quizResults = [
  {
    id: '1',
    quizId: '3',
    userId: '3',
    startTime: new Date('2025-04-15T14:30:00'),
    endTime: new Date('2025-04-15T15:15:00'),
    score: 80,
    maxScore: 100,
    answers: [
      {
        questionId: '1',
        answer: '3',
        isCorrect: true,
        points: 1
      }
    ],
    feedback: 'Хорошая работа! Обратите внимание на хронологию событий.'
  }
];

// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Получение всех тестов
export const getAllQuizzes = async () => {
  // Имитация задержки сети
  await delay(800);
  
  return [...quizzes];
};

// Получение тестов для определенной группы
export const getQuizzesByGroup = async (groupId) => {
  // Имитация задержки сети
  await delay(800);
  
  return quizzes.filter(quiz => quiz.groupId === groupId);
};

// Получение тестов для пользователя (на основе его групп)
export const getQuizzesForUser = async (userId, userGroups) => {
  // Имитация задержки сети
  await delay(800);
  
  // Получаем ID групп пользователя
  const groupIds = userGroups.map(group => group.id);
  
  // Фильтруем тесты, которые принадлежат группам пользователя
  return quizzes.filter(quiz => groupIds.includes(quiz.groupId));
};

// Получение теста по ID
export const getQuizById = async (quizId) => {
  // Имитация задержки сети
  await delay(500);
  
  const quiz = quizzes.find(q => q.id === quizId);
  
  if (!quiz) {
    throw new Error('Тест не найден');
  }
  
  return quiz;
};

// Создание нового теста
export const createQuiz = async (quizData, creatorId) => {
  // Имитация задержки сети
  await delay(1000);
  
  // Создаем новый тест
  const newQuiz = {
    id: String(quizzes.length + 1),
    ...quizData,
    createdBy: creatorId,
    status: 'draft'
  };
  
  // В реальном приложении здесь был бы запрос к API для создания теста
  quizzes.push(newQuiz);
  
  return newQuiz;
};

// Обновление теста
export const updateQuiz = async (quizId, quizData) => {
  // Имитация задержки сети
  await delay(1000);
  
  // Находим тест по ID
  const quizIndex = quizzes.findIndex(q => q.id === quizId);
  
  if (quizIndex === -1) {
    throw new Error('Тест не найден');
  }
  
  // Обновляем данные теста
  quizzes[quizIndex] = {
    ...quizzes[quizIndex],
    ...quizData,
    // Не позволяем обновить критические поля
    id: quizzes[quizIndex].id,
    createdBy: quizzes[quizIndex].createdBy
  };
  
  return quizzes[quizIndex];
};

// Удаление теста
export const deleteQuiz = async (quizId) => {
  // Имитация задержки сети
  await delay(800);
  
  // Находим индекс теста
  const quizIndex = quizzes.findIndex(q => q.id === quizId);
  
  if (quizIndex === -1) {
    throw new Error('Тест не найден');
  }
  
  // Удаляем тест
  quizzes.splice(quizIndex, 1);
  
  return true;
};

// Начало прохождения теста
export const startQuiz = async (quizId, userId) => {
  // Имитация задержки сети
  await delay(500);
  
  // Находим тест
  const quiz = await getQuizById(quizId);
  
  // Проверяем, что тест активен
  if (quiz.status !== 'active') {
    throw new Error('Тест недоступен для прохождения');
  }
  
  // Проверяем, что тест не был пройден ранее
  const existingResult = quizResults.find(r => r.quizId === quizId && r.userId === userId);
  
  if (existingResult) {
    throw new Error('Вы уже проходили этот тест');
  }
  
  // Создаем новую сессию теста
  const session = {
    quizId,
    userId,
    startTime: new Date(),
    questions: quiz.questions.map(q => ({
      ...q,
      userAnswer: null
    }))
  };
  
  return session;
};

// Сохранение ответа на вопрос
export const saveAnswer = async (quizId, userId, questionId, answer) => {
  // Имитация задержки сети
  await delay(300);
  
  // В реальном приложении здесь был бы запрос к API для сохранения ответа
  return { success: true };
};

// Завершение теста и получение результатов
export const finishQuiz = async (quizId, userId, answers) => {
  // Имитация задержки сети
  await delay(1000);
  
  // Находим тест
  const quiz = await getQuizById(quizId);
  
  // Вычисляем результаты
  let score = 0;
  let maxScore = 0;
  
  const processedAnswers = quiz.questions.map(question => {
    const userAnswer = answers.find(a => a.questionId === question.id)?.answer || null;
    let isCorrect = false;
    
    // Проверяем правильность ответа в зависимости от типа вопроса
    if (question.type === 'single') {
      isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === 'multiple') {
      // Для вопросов с множественным выбором проверяем, что все правильные ответы выбраны
      // и нет лишних выбранных ответов
      isCorrect = 
        userAnswer && 
        Array.isArray(userAnswer) && 
        userAnswer.length === question.correctAnswer.length && 
        question.correctAnswer.every(a => userAnswer.includes(a));
    } else if (question.type === 'text') {
      // Для текстовых вопросов проверяем совпадение с правильным ответом
      // В реальном приложении здесь может быть более сложная логика
      isCorrect = userAnswer && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
    } else if (question.type === 'matching') {
      // Для вопросов на сопоставление проверяем все пары
      isCorrect = 
        userAnswer && 
        Object.entries(userAnswer).every(([leftId, rightId]) => {
          const pair = question.pairs.find(p => p.id === leftId);
          return pair && pair.right === rightId;
        });
    }
    
    // Начисляем баллы за правильный ответ
    const points = isCorrect ? question.points : 0;
    score += points;
    maxScore += question.points;
    
    return {
      questionId: question.id,
      answer: userAnswer,
      isCorrect,
      points
    };
  });
  
  // Создаем результат теста
  const result = {
    id: String(quizResults.length + 1),
    quizId,
    userId,
    startTime: new Date(Date.now() - 3600000), // Примерное время начала (час назад)
    endTime: new Date(),
    score,
    maxScore,
    answers: processedAnswers,
    feedback: score >= maxScore * 0.8 
      ? 'Отличная работа! Вы хорошо усвоили материал.' 
      : score >= maxScore * 0.6 
        ? 'Хорошая работа! Есть некоторые моменты, которые стоит повторить.' 
        : 'Вам стоит повторить материал и попробовать еще раз.'
  };
  
  // В реальном приложении здесь был бы запрос к API для сохранения результата
  quizResults.push(result);
  
  return result;
};

// Получение результатов теста для пользователя
export const getQuizResultsForUser = async (userId) => {
  // Имитация задержки сети
  await delay(800);
  
  return quizResults.filter(result => result.userId === userId);
};

// Получение результата конкретного теста для пользователя
export const getQuizResultForUser = async (quizId, userId) => {
  // Имитация задержки сети
  await delay(500);
  
  const result = quizResults.find(r => r.quizId === quizId && r.userId === userId);
  
  if (!result) {
    throw new Error('Результат теста не найден');
  }
  
  return result;
};
