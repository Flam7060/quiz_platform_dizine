import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useGroups } from './GroupContext';
import { 
  getQuizzesForUser, 
  getQuizById, 
  startQuiz, 
  saveAnswer, 
  finishQuiz,
  getQuizResultForUser
} from '../services/quizService';

// Создаем контекст для управления тестами
const QuizContext = createContext();

// Хук для использования контекста тестов
export const useQuiz = () => {
  return useContext(QuizContext);
};

// Провайдер контекста тестов
export const QuizProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { userGroups } = useGroups();
  
  // Состояние для хранения списка тестов
  const [quizzes, setQuizzes] = useState([]);
  // Состояние для хранения текущего теста
  const [currentQuiz, setCurrentQuiz] = useState(null);
  // Состояние для хранения текущей сессии теста
  const [quizSession, setQuizSession] = useState(null);
  // Состояние для хранения результатов теста
  const [quizResults, setQuizResults] = useState(null);
  // Состояние для отслеживания загрузки
  const [loading, setLoading] = useState(true);
  // Состояние для отслеживания ошибок
  const [error, setError] = useState(null);

  // Загрузка тестов при изменении пользователя или групп
  useEffect(() => {
    // Для прототипирования устанавливаем тестовые данные
    const mockQuizzes = [
      {
        id: '1',
        title: 'Основы программирования',
        description: 'Тест по основам программирования и алгоритмам',
        status: 'active',
        startDate: '2025-05-01T10:00:00Z',
        endDate: '2025-05-20T23:59:59Z',
        duration: 60,
        questionCount: 20,
        createdBy: 'Иванов И.И.',
        groups: ['1', '2']
      },
      {
        id: '2',
        title: 'Веб-разработка',
        description: 'Тест по основам веб-разработки (HTML, CSS, JavaScript)',
        status: 'upcoming',
        startDate: '2025-05-15T10:00:00Z',
        endDate: '2025-05-30T23:59:59Z',
        duration: 45,
        questionCount: 15,
        createdBy: 'Петров П.П.',
        groups: ['2']
      },
      {
        id: '3',
        title: 'Базы данных',
        description: 'Тест по основам баз данных и SQL',
        status: 'completed',
        startDate: '2025-04-01T10:00:00Z',
        endDate: '2025-04-15T23:59:59Z',
        duration: 30,
        questionCount: 10,
        createdBy: 'Сидоров С.С.',
        groups: ['1'],
        result: {
          score: 8,
          total: 10,
          percentage: 80
        }
      }
    ];
    
    // Устанавливаем тестовые данные
    setQuizzes(mockQuizzes);
    setLoading(false);
    
  }, [currentUser, userGroups]); // Зависимости сохраняем для совместимости

  // Функция для загрузки теста по ID
  const loadQuiz = async (quizId) => {
    try {
      setLoading(true);
      setError(null);
      
      const quiz = await getQuizById(quizId);
      setCurrentQuiz(quiz);
      
      // Проверяем, есть ли результаты для этого теста
      if (currentUser) {
        try {
          const results = await getQuizResultForUser(quizId, currentUser.id);
          setQuizResults(results);
        } catch (error) {
          // Если результатов нет, это не ошибка
          setQuizResults(null);
        }
      }
      
      return quiz;
    } catch (error) {
      console.error('Ошибка при загрузке теста:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Функция для начала прохождения теста
  const startQuizSession = async (quizId) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }
      
      // Загружаем тест, если он еще не загружен
      if (!currentQuiz || currentQuiz.id !== quizId) {
        await loadQuiz(quizId);
      }
      
      // Начинаем сессию теста
      const session = await startQuiz(quizId, currentUser.id);
      setQuizSession(session);
      
      return session;
    } catch (error) {
      console.error('Ошибка при начале теста:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Функция для сохранения ответа на вопрос
  const saveQuizAnswer = async (questionId, answer) => {
    try {
      setError(null);
      
      if (!currentUser || !quizSession) {
        throw new Error('Сессия теста не активна');
      }
      
      // Сохраняем ответ
      await saveAnswer(quizSession.quizId, currentUser.id, questionId, answer);
      
      // Обновляем сессию теста с новым ответом
      const updatedSession = {
        ...quizSession,
        questions: quizSession.questions.map(q => 
          q.id === questionId ? { ...q, userAnswer: answer } : q
        )
      };
      
      setQuizSession(updatedSession);
      
      return updatedSession;
    } catch (error) {
      console.error('Ошибка при сохранении ответа:', error);
      setError(error.message);
      throw error;
    }
  };

  // Функция для завершения теста
  const finishQuizSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser || !quizSession) {
        throw new Error('Сессия теста не активна');
      }
      
      // Собираем ответы из сессии
      const answers = quizSession.questions
        .filter(q => q.userAnswer !== null)
        .map(q => ({
          questionId: q.id,
          answer: q.userAnswer
        }));
      
      // Завершаем тест и получаем результаты
      const results = await finishQuiz(quizSession.quizId, currentUser.id, answers);
      
      // Сохраняем результаты
      setQuizResults(results);
      // Очищаем сессию
      setQuizSession(null);
      
      return results;
    } catch (error) {
      console.error('Ошибка при завершении теста:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Функция для фильтрации тестов по статусу
  const filterQuizzes = (status) => {
    if (!status || status === 'all') {
      return quizzes;
    }
    
    return quizzes.filter(quiz => quiz.status === status);
  };

  // Значение контекста
  const value = {
    quizzes,
    currentQuiz,
    quizSession,
    quizResults,
    loading,
    error,
    loadQuiz,
    startQuizSession,
    saveQuizAnswer,
    finishQuizSession,
    filterQuizzes
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContext;
