import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Компонент для защиты маршрутов, требующих аутентификации
const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();
  
  // Пока проверяем аутентификацию, показываем загрузку
  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }
  
  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Если пользователь аутентифицирован, отображаем защищенный контент
  return <Outlet />;
};

export default PrivateRoute;
