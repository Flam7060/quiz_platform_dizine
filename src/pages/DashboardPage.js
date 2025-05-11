import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileSection from '../components/Dashboard/ProfileSection';
import UserStatsSection from '../components/Dashboard/UserStatsSection';
import QuizList from '../components/Quiz/QuizList';
import DashboardNav from '../components/Dashboard/DashboardNav';
import AssignTestsToGroups from '../components/Teacher/AssignTestsToGroups';
import AssignedTestsList from '../components/Teacher/AssignedTestsList';
import RoleBasedContent from '../components/Common/RoleBasedContent';

// Импортируем стили для компонента назначенных тестов
import '../styles/assignedTestsList.scss';

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
          <RoleBasedContent roles={['student']}>
            <QuizList />
          </RoleBasedContent>
          <RoleBasedContent roles={['admin', 'teacher']}>
            <AssignTestsToGroups />
            <AssignedTestsList />
          </RoleBasedContent>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
