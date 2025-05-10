import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginCat from './LoginCat';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordFieldActive, setPasswordFieldActive] = useState(false);
  
  // Рефы для полей пароля
  const passwordRef = useRef(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Обработчик закрытия формы
  const handleClose = () => {
    navigate('/');
  };
  
  // Обработчики для поля пароля
  const handlePasswordFocus = () => {
    setPasswordFieldActive(true);
  };
  
  const handlePasswordBlur = () => {
    setPasswordFieldActive(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Показываем индикатор загрузки
    setLoading(true);
    setError('');
    
    try {
      // Создаем пользователя на основе введенного email
      const userData = {
        id: '1',
        name: 'Иванов Иван',
        email: email || 'test@example.com', // Используем значение по умолчанию, если поле пустое
        role: 'admin' // Всегда устанавливаем роль админа для прототипирования
      };
      
      // Вызываем модифицированную функцию login
      await login(userData);
      
      // Перенаправляем на дашборд
      navigate('/dashboard');
    } catch (err) {
      // Даже в случае ошибки перенаправляем на дашборд
      console.log('Ошибка входа (игнорируется для прототипирования):', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Вход в систему</h2>
          <button className="close-button" onClick={handleClose}>&times;</button>
        </div>
        
        {/* Анимированный котик для страницы входа */}
        <LoginCat passwordFieldActive={passwordFieldActive} />
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Электронная почта</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              ref={passwordRef}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Нет аккаунта? <Link to="/register">Зарегистрироваться по коду приглашения</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
