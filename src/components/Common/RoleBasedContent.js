import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Компонент для условного отображения контента в зависимости от роли пользователя
 * @param {Object} props - Свойства компонента
 * @param {string|string[]} props.roles - Роль или массив ролей, которым разрешен доступ
 * @param {React.ReactNode} props.children - Дочерние элементы, которые будут отображены при наличии доступа
 * @param {React.ReactNode} props.fallback - Опциональный контент для отображения, если доступ запрещен
 */
const RoleBasedContent = ({ roles, children, fallback = null }) => {
  const { currentUser, ROLES } = useAuth();
  
  // Если пользователь не авторизован, не показываем контент
  if (!currentUser) {
    return fallback;
  }
  
  // Преобразуем roles в массив, если передана строка
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  // Проверяем, имеет ли пользователь одну из разрешенных ролей
  const hasAccess = allowedRoles.includes(currentUser.role);
  
  // Возвращаем контент, если у пользователя есть доступ, иначе fallback
  return hasAccess ? children : fallback;
};

export default RoleBasedContent;