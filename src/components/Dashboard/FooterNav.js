import React from 'react';
import { Link } from 'react-router-dom';

const FooterNav = () => {
  return (
    <div className="footer-nav">
      <Link to="/dashboard" className="nav-item">
        <div>Тесты</div>
      </Link>
      <Link to="/dashboard/homework" className="nav-item">
        <div>Домашние задания</div>
      </Link>
      <Link to="/dashboard/materials" className="nav-item">
        <div>Учебные материалы</div>
      </Link>
    </div>
  );
};

export default FooterNav;
