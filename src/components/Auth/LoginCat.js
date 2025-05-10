import React, { useState, useEffect, useRef } from 'react';

const LoginCat = ({ passwordFieldActive }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [eyesState, setEyesState] = useState('open');
  const [isHappy, setIsHappy] = useState(false);
  const catRef = useRef(null);
  
  // Следим за движением мыши только внутри контейнера
  useEffect(() => {
    // Функция для проверки, находится ли мышь внутри контейнера
    const isMouseInContainer = (e) => {
      if (!catRef.current) return false;
      
      const authContainer = catRef.current.closest('.auth-container');
      if (!authContainer) return false;
      
      const containerRect = authContainer.getBoundingClientRect();
      return (
        e.clientX >= containerRect.left && 
        e.clientX <= containerRect.right &&
        e.clientY >= containerRect.top && 
        e.clientY <= containerRect.bottom
      );
    };
    
    // Обработчик движения мыши
    const handleMouseMove = (e) => {
      // Проверяем, что мышь внутри контейнера
      if (isMouseInContainer(e) && catRef.current && !passwordFieldActive) {
        const catRect = catRef.current.getBoundingClientRect();
        const catCenterX = catRect.left + catRect.width / 2;
        const catCenterY = catRect.top + catRect.height / 2;
        
        // Ограничиваем движение глаз
        const maxMove = 5;
        
        // Вычисляем направление взгляда
        const deltaX = Math.min(Math.max((e.clientX - catCenterX) / 20, -maxMove), maxMove);
        const deltaY = Math.min(Math.max((e.clientY - catCenterY) / 20, -maxMove), maxMove);
        
        setPosition({ x: deltaX, y: deltaY });
      }
    };
    
    // Обработчик ухода мыши из контейнера
    const handleMouseLeave = (e) => {
      if (!isMouseInContainer(e)) {
        // Возвращаем глаза в центральное положение
        setPosition({ x: 0, y: 0 });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [passwordFieldActive]);
  
  // Обновляем состояние глаз в зависимости от активности поля пароля
  useEffect(() => {
    setEyesState(passwordFieldActive ? 'closed' : 'open');
  }, [passwordFieldActive]);
  
  // Случайное моргание
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!passwordFieldActive && Math.random() > 0.7) {
        setEyesState('closed');
        setTimeout(() => {
          setEyesState('open');
        }, 150);
      }
    }, 3000);
    
    return () => clearInterval(blinkInterval);
  }, [passwordFieldActive]);
  
  // Случайная улыбка
  useEffect(() => {
    const happyInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsHappy(true);
        setTimeout(() => {
          setIsHappy(false);
        }, 2000);
      }
    }, 5000);
    
    return () => clearInterval(happyInterval);
  }, []);
  
  // Фиксированная позиция для котика на странице логина
  const catStyle = {
    position: 'absolute',
    right: '20px',
    top: '20px',
    zIndex: 20,
    // Жестко фиксируем положение котика
    transform: 'none',
    pointerEvents: 'none' // Отключаем события мыши на самом котике
  };
  
  return (
    <div className="animated-cat login-cat" style={catStyle} ref={catRef}>
      <div className="cat-container">
        <div className="cat-head">
          <div className="cat-ears">
            <div className="ear left"></div>
            <div className="ear right"></div>
          </div>
          <div className="cat-face">
            <div className="cat-eyes">
              <div className={`eye left ${eyesState}`}>
                <div 
                  className="pupil" 
                  style={{ 
                    transform: eyesState === 'open' 
                      ? `translate(${position.x}px, ${position.y}px)` 
                      : 'translate(0, 0)'
                  }}
                ></div>
              </div>
              <div className={`eye right ${eyesState}`}>
                <div 
                  className="pupil" 
                  style={{ 
                    transform: eyesState === 'open' 
                      ? `translate(${position.x}px, ${position.y}px)` 
                      : 'translate(0, 0)'
                  }}
                ></div>
              </div>
            </div>
            <div className="cat-nose"></div>
            <div className={`cat-mouth ${isHappy ? 'happy' : ''}`}></div>
            <div className="cat-whiskers">
              <div className="whisker-group left">
                <div className="whisker"></div>
                <div className="whisker"></div>
                <div className="whisker"></div>
              </div>
              <div className="whisker-group right">
                <div className="whisker"></div>
                <div className="whisker"></div>
                <div className="whisker"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCat;
