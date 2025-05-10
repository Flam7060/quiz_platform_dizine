import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserGroups, getAvailableGroups, joinGroupByCode as joinGroup, requestJoinGroup as requestJoin, createGroup } from '../services/groupService';

// Создаем контекст для управления группами
const GroupContext = createContext();

// Хук для использования контекста групп
export const useGroups = () => {
  return useContext(GroupContext);
};

// Провайдер контекста групп
export const GroupProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Состояние для хранения групп пользователя
  const [userGroups, setUserGroups] = useState([]);
  // Состояние для хранения доступных групп
  const [availableGroups, setAvailableGroups] = useState([]);
  // Состояние для отслеживания загрузки
  const [loading, setLoading] = useState(true);
  // Состояние для отслеживания ошибок
  const [error, setError] = useState(null);

  // Загрузка групп пользователя при изменении пользователя
  useEffect(() => {
    // Для прототипирования устанавливаем тестовые данные
    const mockUserGroups = [
      { id: '1', name: 'Администраторы', description: 'Группа администраторов системы', memberCount: 5 },
      { id: '2', name: 'Преподаватели', description: 'Преподаватели и сотрудники', memberCount: 15 }
    ];
    
    const mockAvailableGroups = [
      { id: '3', name: 'Студенты', description: 'Группа студентов', memberCount: 120 },
      { id: '4', name: 'Тестировщики', description: 'Группа для тестирования системы', memberCount: 8 }
    ];
    
    // Устанавливаем тестовые данные
    setUserGroups(mockUserGroups);
    setAvailableGroups(mockAvailableGroups);
    setLoading(false);
    
  }, [currentUser]); // Зависимость от currentUser сохраняем для совместимости

  // Функция для присоединения к группе по коду
  const joinGroupByCode = async (code) => {
    try {
      setError(null);
      
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }
      
      // Вызываем сервис для присоединения к группе
      const group = await joinGroup(code, currentUser.id);
      
      // Обновляем списки групп
      setUserGroups([...userGroups, group]);
      setAvailableGroups(availableGroups.filter(g => g.id !== group.id));
      
      return group;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Функция для запроса на присоединение к группе
  const requestJoinGroup = async (groupId) => {
    try {
      setError(null);
      
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }
      
      // Вызываем сервис для запроса на присоединение
      const group = await requestJoin(groupId, currentUser.id);
      
      // Обновляем списки групп
      setUserGroups([...userGroups, group]);
      setAvailableGroups(availableGroups.filter(g => g.id !== groupId));
      
      return group;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };
  
  // Функция для создания новой группы
  const createNewGroup = async (groupData) => {
    try {
      setError(null);
      
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }
      
      // Вызываем сервис для создания группы
      const newGroup = await createGroup(groupData, currentUser.id);
      
      // Обновляем список групп пользователя
      setUserGroups([...userGroups, newGroup]);
      
      return newGroup;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Функция для выхода из группы
  const leaveGroup = async (groupId) => {
    // В реальном приложении здесь будет API запрос
    setUserGroups(userGroups.filter(group => group.id !== groupId));
    return true;
  };

  // Значение контекста
  const value = {
    userGroups,
    availableGroups,
    loading,
    error,
    requestJoinGroup,
    joinGroupByCode,
    leaveGroup,
    createNewGroup
  };
  
  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupContext;
