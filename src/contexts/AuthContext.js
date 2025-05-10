import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser, updateUserProfile, verifyToken } from '../services/authService';

// Контекст для управления аутентификацией
const AuthContext = createContext();

// Роли пользователей
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

// Хук для использования контекста аутентификации
export const useAuth = () => {
  return useContext(AuthContext);
};

// Провайдер контекста аутентификации
export const AuthProvider = ({ children }) => {
  // Состояние для хранения данных текущего пользователя
  const [currentUser, setCurrentUser] = useState(null);
  // Состояние для отслеживания загрузки
  const [loading, setLoading] = useState(true);
  // Состояние для отслеживания ошибок
  const [error, setError] = useState(null);

  // Функция для входа в систему (упрощенная для прототипирования)
  const login = async (userData) => {
    try {
      setError(null);
      // Автоматически устанавливаем пользователя без проверки
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      // Игнорируем ошибки для прототипирования
      console.log('Login error (ignored for prototyping):', error);
      // Все равно устанавливаем тестового пользователя
      const defaultUser = {
        id: '1',
        name: 'Тестовый пользователь',
        email: 'test@example.com',
        role: 'admin' // Даем права админа для просмотра всех страниц
      };
      setCurrentUser(defaultUser);
      return defaultUser;
    }
  };

  // Функция для выхода из системы
  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Функция для регистрации нового пользователя
  const register = async (email, password, displayName, inviteCode) => {
    try {
      setError(null);
      const user = await registerUser(email, password, displayName, inviteCode);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Функция для обновления профиля пользователя
  const updateProfile = async (profileData) => {
    try {
      if (!currentUser) {
        throw new Error('Пользователь не аутентифицирован');
      }
      
      const updatedUser = await updateUserProfile(currentUser.id, profileData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Эффект для проверки состояния аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем, есть ли сохраненный пользователь
        const user = getCurrentUser();
        
        if (user) {
          // Проверяем валидность токена (в реальном приложении)
          const isValid = await verifyToken();
          
          if (isValid) {
            setCurrentUser(user);
          } else {
            // Если токен недействителен, выходим из системы
            await logoutUser();
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке аутентификации:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Проверка роли пользователя
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  // Значение контекста
  const value = {
    currentUser,
    login,
    logout,
    register,
    updateProfile,
    hasRole,
    ROLES,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
