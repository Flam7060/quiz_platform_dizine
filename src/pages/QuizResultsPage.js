import React from 'react';
import { useParams } from 'react-router-dom';
import QuizResults from '../components/Quiz/QuizResults';
import { useAuth } from '../contexts/AuthContext';

const QuizResultsPage = () => {
  const { quizId } = useParams();
  const { currentUser } = useAuth();

  return (
    <div className="quiz-results-page">
      <div className="container">
        <QuizResults />
      </div>
    </div>
  );
};

export default QuizResultsPage;
