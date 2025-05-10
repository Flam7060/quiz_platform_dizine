import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser } = useAuth();

  return (
    <div className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-logo">
            <h1>КВИЗУМ</h1>
            <p>Платформа для создания и прохождения тестов</p>
          </div>
          <div className="header-buttons">
            {currentUser ? (
              <Link to="/dashboard" className="header-button primary">Личный кабинет</Link>
            ) : (
              <Link to="/login" className="header-button primary">Войти</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
