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
import DesignHubPage from './pages/DesignHubPage';
import TestModePage from './pages/TestModePage';
import QuizModePage from './pages/QuizModePage';
import FlashcardModePage from './pages/FlashcardModePage';
import PrivateRoute from './components/Common/PrivateRoute';
import './styles/question-card.scss';
import './styles/question-modes.scss';
import { AuthProvider } from './contexts/AuthContext';
import { GroupProvider } from './contexts/GroupContext';
import { QuizProvider } from './contexts/QuizContext';
import { CollapseProvider } from './contexts/CollapseContext';
import './styles/design-hub.scss';

function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <QuizProvider>
          <CollapseProvider>
            <Router>
            <div className="App">
              <Routes>
                {/* Публичные маршруты */}
                <Route path="/" element={<DesignHubPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/test-mode" element={<TestModePage />} />
                <Route path="/quiz-mode" element={<QuizModePage />} />
                <Route path="/flashcard-mode" element={<FlashcardModePage />} />
                
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
          </CollapseProvider>
        </QuizProvider>
      </GroupProvider>
    </AuthProvider>
  );
}

export default App;
