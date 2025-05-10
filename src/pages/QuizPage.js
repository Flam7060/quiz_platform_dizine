import React from 'react';
import { useParams } from 'react-router-dom';
import QuizSession from '../components/Quiz/QuizSession';
import { useAuth } from '../contexts/AuthContext';

const QuizPage = () => {
  const { quizId } = useParams();
  const { currentUser } = useAuth();

  return (
    <div className="quiz-page">
      <div className="container">
        <QuizSession />
      </div>
    </div>
  );
};

export default QuizPage;
