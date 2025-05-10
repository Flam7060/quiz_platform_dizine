import React from 'react';
import ProfileSection from './ProfileSection';
import ActiveTests from './ActiveTests';
import FooterNav from './FooterNav';
import { useLocation, Link } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Определяем, какой контент показывать в зависимости от пути
  const renderContent = () => {
    if (path === '/dashboard/homework') {
      return (
        <div className="tests-section">
          <div className="section-header">
            <h3>Домашние задания</h3>
          </div>
          <div className="homework-content">
            <p>Здесь будет отображаться список домашних заданий</p>
          </div>
        </div>
      );
    } else if (path === '/dashboard/materials') {
      return (
        <div className="tests-section">
          <div className="section-header">
            <h3>Учебные материалы</h3>
          </div>
          <div className="materials-content">
            <p>Здесь будет отображаться список учебных материалов</p>
          </div>
        </div>
      );
    } else {
      return <ActiveTests />;
    }
  };
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Личный кабинет</h2>
        <Link to="/" className="back-to-home">На главную</Link>
      </div>
      <div className="container">
        <ProfileSection />
        {renderContent()}
      </div>
      <FooterNav />
    </div>
  );
};

export default Dashboard;
