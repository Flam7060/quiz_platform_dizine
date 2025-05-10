import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>КВИЗУМ</h3>
            <p>Платформа для создания и прохождения тестов</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Навигация</h4>
              <ul>
                <li><Link to="/">Главная</Link></li>
                <li><Link to="/login">Войти</Link></li>
                <li><Link to="/dashboard">Личный кабинет</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Ресурсы</h4>
              <ul>
                <li><a href="#">Помощь</a></li>
                <li><a href="#">Документация</a></li>
                <li><a href="#">Обратная связь</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Контакты</h4>
              <ul>
                <li><a href="mailto:info@quizum.ru">info@quizum.ru</a></li>
                <li><a href="tel:+78001234567">8 (800) 123-45-67</a></li>
                <li><a href="#">Москва, ул. Примерная, 123</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} КВИЗУМ. Все права защищены.</p>
          <div className="footer-social">
            <a href="#" aria-label="Telegram"><i className="social-icon">📱</i></a>
            <a href="#" aria-label="VK"><i className="social-icon">💬</i></a>
            <a href="#" aria-label="YouTube"><i className="social-icon">📺</i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
