import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileSection from '../components/Dashboard/ProfileSection';
import UserStatsSection from '../components/Dashboard/UserStatsSection';
import QuizList from '../components/Quiz/QuizList';
import DashboardNav from '../components/Dashboard/DashboardNav';

const DashboardPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard">
      <DashboardNav />
      
      <div className="dashboard-content">
        <div className="dashboard-sections">
          <div className="dashboard-main-section">
            <ProfileSection />
            <UserStatsSection />
          </div>
          <QuizList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
