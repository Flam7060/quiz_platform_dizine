import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedCat from './AnimatedCat';

const Register = () => {
  // Состояние формы
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasInvite, setHasInvite] = useState(false);
  
  // Состояние для анимированного котика
  const [passwordFieldActive, setPasswordFieldActive] = useState(false);
  
  // Состояние шагов регистрации
  const [step, setStep] = useState(1);
  
  const { registerWithInviteCode } = useAuth();
  const navigate = useNavigate();
  
  // Рефы для полей пароля
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  
  // Обработчик перехода к следующему шагу
  const handleNextStep = (e) => {
    e.preventDefault();
    
    // Проверка заполнения полей ФИО
    if (!lastName.trim()) {
      return setError('Укажите вашу фамилию');
    }
    
    if (!firstName.trim()) {
      return setError('Укажите ваше имя');
    }
    
    // Проверка кода приглашения, если он указан
    if (hasInvite && !inviteCode.trim()) {
      return setError('Укажите код приглашения');
    }
    
    setError('');
    setStep(2);
  };
  
  // Обработчик переключения на форму с приглашением
  const handleToggleInvite = () => {
    setHasInvite(!hasInvite);
    if (!hasInvite) {
      setStep(2);
    } else {
      setStep(1);
    }
  };
  
  // Обработчик закрытия формы
  const handleClose = () => {
    navigate('/');
  };
  
  // Обработчики для полей пароля
  const handlePasswordFocus = () => {
    setPasswordFieldActive(true);
  };
  
  const handlePasswordBlur = () => {
    setPasswordFieldActive(false);
  };
  
  // Обработчик возврата к первому шагу
  const handleBackStep = () => {
    setStep(1);
  };
  
  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Пароли не совпадают');
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Составляем полное имя
      const fullName = `${lastName} ${firstName}${middleName ? ' ' + middleName : ''}`;
      
      const userData = {
        name: fullName,
        email,
        password // В реальном приложении пароль должен быть захеширован
      };
      
      await registerWithInviteCode(userData, inviteCode);
      navigate('/dashboard');
    } catch (err) {
      setError('Не удалось зарегистрироваться. Проверьте код приглашения.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Регистрация {hasInvite ? 'по приглашению' : ''}</h2>
          <button className="close-button" onClick={handleClose}>&times;</button>
        </div>
        
        {!hasInvite && (
          <div className="step-indicator">
            {/* Анимированный котик, появляется только на шагах регистрации */}
            {(step === 1 || step === 2) && (
              <AnimatedCat step={step} passwordFieldActive={passwordFieldActive} />
            )}
            <div className={`step ${step === 1 ? 'active' : 'completed'}`}>1</div>
            <div className="step-line"></div>
            <div className={`step ${step === 2 ? 'active' : ''}`}>2</div>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 ? (
          // Шаг 1: Ввод ФИО
          <form onSubmit={handleNextStep}>
            <div className="form-group">
              <label htmlFor="lastName">Фамилия</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="firstName">Имя</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="middleName">Отчество (по желанию)</label>
              <input
                type="text"
                id="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
            
            <div className="invite-code-section">
              <div className="invite-header">
                <label className="invite-label">
                  <input 
                    type="checkbox" 
                    checked={hasInvite}
                    onChange={() => setHasInvite(!hasInvite)}
                    className="invite-checkbox"
                  />
                  <span>У меня есть код приглашения</span>
                </label>
              </div>
              
              {hasInvite && (
                <div className="invite-code-input">
                  <div className="form-group special-input">
                    <label htmlFor="inviteCode">Код приглашения</label>
                    <input
                      type="text"
                      id="inviteCode"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      required={hasInvite}
                      placeholder="Введите код приглашения"
                    />
                    <small className="form-text">Код приглашения можно получить у преподавателя</small>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
            >
              Продолжить
            </button>
          </form>
        ) : (
          // Шаг 2: Ввод почты и пароля
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Электронная почта</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
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
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                ref={confirmPasswordRef}
                required
              />
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="auth-button secondary" 
                onClick={handleBackStep}
              >
                Назад
              </button>
              
              <button 
                type="submit" 
                className="auth-button" 
                disabled={loading}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </div>
          </form>
        )}
        
        <div className="auth-links">
          <p>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
