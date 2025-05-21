import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Компонент для защиты маршрутов, требующих аутентификации
// В режиме дизайна защита отключена для удобства просмотра всех страниц
const PrivateRoute = () => {
  const { loading } = useAuth();
  
  // Пока проверяем аутентификацию, показываем загрузку
  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }
  
  // Защита отключена - всегда разрешаем доступ к защищенным маршрутам
  // для удобства работы с дизайном
  return <Outlet />;
};

export default PrivateRoute;
