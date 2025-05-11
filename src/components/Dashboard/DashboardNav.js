import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedContent from '../Common/RoleBasedContent';

const DashboardNav = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Для прототипирования используем тестовые данные пользователя
  const userDisplayName = currentUser?.name || 'Иванов Иван';
  const userRole = currentUser?.role || 'student';
  const userInitial = userDisplayName.charAt(0).toUpperCase();
  
  // Определяем активную вкладку на основе текущего пути
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Обработчик выхода из системы
  const handleLogout = async () => {
    try {
      await logout();
      // Перенаправление произойдет автоматически через PrivateRoute
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };
  
  // Обработчик переключения меню пользователя
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  // Закрытие меню при клике вне его
  const closeUserMenu = () => {
    setShowUserMenu(false);
  };
  
  return (
    <div className="dashboard-nav">
      <div className="dashboard-nav-left">
        <Link to="/" className="dashboard-nav-logo">
          <h2>КВИЗУМ</h2>
        </Link>
        
        <div className="dashboard-nav-links">
          <Link 
            to="/dashboard" 
            className={`dashboard-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <i className="fas fa-home"></i>
            <span>Главная</span>
          </Link>
          
          <Link 
            to="/tests" 
            className={`dashboard-nav-link ${isActive('/tests') ? 'active' : ''}`}
          >
            <i className="fas fa-tasks"></i>
            <span>Тесты</span>
          </Link>
          
          {/* Создание тестов доступно только для администраторов и преподавателей */}
          <RoleBasedContent roles={['admin', 'teacher']}>
            <Link 
              to="/create-test" 
              className={`dashboard-nav-link ${isActive('/create-test') ? 'active' : ''}`}
            >
              <i className="fas fa-plus-circle"></i>
              <span>Создать тест</span>
            </Link>
          </RoleBasedContent>
          
          {/* Управление доступно только для администраторов */}
          <RoleBasedContent roles="admin">
            <Link 
              to="/admin" 
              className={`dashboard-nav-link ${isActive('/admin') ? 'active' : ''}`}
            >
              <i className="fas fa-cog"></i>
              <span>Управление</span>
            </Link>
          </RoleBasedContent>
        </div>
      </div>
      
      <div className="dashboard-nav-user">
        <div className="user-info" onClick={toggleUserMenu}>
          <div className="user-avatar">
            <div className="avatar-placeholder">
              {userInitial}
            </div>
          </div>
          <div className="user-details">
            <div className="user-name">{userDisplayName}</div>
            <div className="user-role">{userRole}</div>
          </div>
          <i className="fas fa-chevron-down user-menu-arrow"></i>
        </div>
        
        {showUserMenu && (
          <div className="user-dropdown-menu">
            <Link to="/profile" className="dropdown-item">
              <i className="fas fa-user"></i>
              <span>Профиль</span>
            </Link>
            <Link to="/settings" className="dropdown-item">
              <i className="fas fa-cog"></i>
              <span>Настройки</span>
            </Link>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Выйти</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Прозрачный оверлей для закрытия меню при клике вне его */}
      {showUserMenu && <div className="overlay" onClick={closeUserMenu}></div>}
    </div>
  );
};

export default DashboardNav;
