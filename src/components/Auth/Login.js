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
  const [selectedRole, setSelectedRole] = useState('admin');
  
  // Рефы для полей пароля
  const passwordRef = useRef(null);
  
  const { login, ROLES } = useAuth();
  const navigate = useNavigate();
  
  // Предустановленные пользователи для быстрого входа
  const quickLoginUsers = {
    [ROLES.ADMIN]: {
      id: '1',
      name: 'Администратор',
      email: 'admin@quizum.ru',
      role: ROLES.ADMIN
    },
    [ROLES.TEACHER]: {
      id: '2',
      name: 'Преподаватель',
      email: 'teacher@quizum.ru',
      role: ROLES.TEACHER
    },
    [ROLES.STUDENT]: {
      id: '3',
      name: 'Студент',
      email: 'student@quizum.ru',
      role: ROLES.STUDENT
    },
    'student1': {
      id: '4',
      name: 'Иванов Иван',
      email: 'student1@quizum.ru',
      role: ROLES.STUDENT
    },
    'student2': {
      id: '5',
      name: 'Петров Петр',
      email: 'student2@quizum.ru',
      role: ROLES.STUDENT
    }
  };
  
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
  
  // Обработчик быстрого входа
  const handleQuickLogin = async (role) => {
    setLoading(true);
    setError('');
    
    try {
      // Получаем данные пользователя для выбранной роли
      const userData = quickLoginUsers[role];
      
      // Вызываем функцию login
      await login(userData);
      
      // Перенаправляем на дашборд
      navigate('/dashboard');
    } catch (err) {
      setError('Ошибка быстрого входа');
      console.log('Ошибка входа:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Показываем индикатор загрузки
    setLoading(true);
    setError('');
    
    try {
      // Создаем пользователя на основе введенного email и выбранной роли
      const userData = {
        id: selectedRole === ROLES.ADMIN ? '1' : (selectedRole === ROLES.TEACHER ? '2' : '3'),
        name: selectedRole === ROLES.ADMIN ? 'Администратор' : 
              (selectedRole === ROLES.TEACHER ? 'Преподаватель' : 'Студент'),
        email: email || `${selectedRole}@quizum.ru`, // Используем значение по умолчанию, если поле пустое
        role: selectedRole // Используем выбранную роль
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
        
        {/* Быстрый вход для тестирования */}
        <div className="quick-login-section">
          <h3>Быстрый вход для тестирования</h3>
          <div className="quick-login-buttons">
            <button 
              className={`quick-login-button ${selectedRole === ROLES.ADMIN ? 'active' : ''}`}
              onClick={() => handleQuickLogin(ROLES.ADMIN)}
              disabled={loading}
            >
              Администратор
            </button>
            <button 
              className={`quick-login-button ${selectedRole === ROLES.TEACHER ? 'active' : ''}`}
              onClick={() => handleQuickLogin(ROLES.TEACHER)}
              disabled={loading}
            >
              Преподаватель
            </button>
          </div>
          
          <h4>Студенты:</h4>
          <div className="quick-login-buttons">
            <button 
              className={`quick-login-button ${selectedRole === ROLES.STUDENT ? 'active' : ''}`}
              onClick={() => handleQuickLogin(ROLES.STUDENT)}
              disabled={loading}
            >
              Студент
            </button>
            <button 
              className={`quick-login-button ${selectedRole === 'student1' ? 'active' : ''}`}
              onClick={() => handleQuickLogin('student1')}
              disabled={loading}
            >
              Иванов Иван
            </button>
            <button 
              className={`quick-login-button ${selectedRole === 'student2' ? 'active' : ''}`}
              onClick={() => handleQuickLogin('student2')}
              disabled={loading}
            >
              Петров Петр
            </button>
          </div>
        </div>
        
        <div className="login-divider">
          <span>или</span>
        </div>
        
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
          
          <div className="form-group">
            <label htmlFor="role">Роль пользователя</label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="role-select"
            >
              <option value={ROLES.ADMIN}>Администратор</option>
              <option value={ROLES.TEACHER}>Преподаватель</option>
              <option value={ROLES.STUDENT}>Студент</option>
            </select>
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
