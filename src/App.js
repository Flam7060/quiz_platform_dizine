import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import DashboardPage from './pages/DashboardPage';
import TestsPage from './pages/TestsPage';
import CreateTestPage from './pages/CreateTestPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizPage from './pages/QuizPage';
import QuizResultsPage from './pages/QuizResultsPage';
import PrivateRoute from './components/Common/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { GroupProvider } from './contexts/GroupContext';
import { QuizProvider } from './contexts/QuizContext';

function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <QuizProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Публичные маршруты */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Защищенные маршруты (требуют аутентификации) */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tests" element={<TestsPage />} />
                  <Route path="/create-test" element={<CreateTestPage />} />
                  <Route path="/admin" element={<DashboardPage />} />
                  <Route path="/profile" element={<DashboardPage />} />
                  <Route path="/settings" element={<DashboardPage />} />
                  <Route path="/quiz/:quizId" element={<QuizPage />} />
                  <Route path="/quiz/:quizId/results" element={<QuizResultsPage />} />
                </Route>
                
                {/* Маршрут для страницы 404 */}
                <Route path="*" element={<div className="not-found">Страница не найдена</div>} />
              </Routes>
            </div>
          </Router>
        </QuizProvider>
      </GroupProvider>
    </AuthProvider>
  );
}

export default App;
