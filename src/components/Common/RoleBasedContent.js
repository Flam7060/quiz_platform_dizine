import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

/**
 * Компонент для условного отображения контента в зависимости от роли пользователя
 * В режиме дизайна отображает весь контент или контент для роли из URL-параметра
 * @param {Object} props - Свойства компонента
 * @param {string|string[]} props.roles - Роль или массив ролей, которым разрешен доступ
 * @param {React.ReactNode} props.children - Дочерние элементы, которые будут отображены при наличии доступа
 * @param {React.ReactNode} props.fallback - Опциональный контент для отображения, если доступ запрещен
 */
const RoleBasedContent = ({ roles, children, fallback = null }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Получаем роль из URL-параметра (role=student, role=teacher, role=admin)
  const searchParams = new URLSearchParams(location.search);
  const roleFromUrl = searchParams.get('role');
  
  // Преобразуем roles в массив, если передана строка
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  // В режиме дизайна (без аутентификации)
  if (!currentUser) {
    // Если в URL есть параметр role, проверяем соответствие роли
    if (roleFromUrl) {
      return allowedRoles.includes(roleFromUrl) ? children : fallback;
    }
    
    // Если параметра role нет, показываем весь контент в режиме дизайна
    return children;
  }
  
  // Если пользователь аутентифицирован, проверяем его роль
  const hasAccess = allowedRoles.includes(currentUser.role);
  
  // Возвращаем контент, если у пользователя есть доступ, иначе fallback
  return hasAccess ? children : fallback;
};

export default RoleBasedContent;