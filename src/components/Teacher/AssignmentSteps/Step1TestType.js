import React from 'react';
import { FaClipboardCheck, FaGamepad, FaBook } from 'react-icons/fa';

const Step1TestType = ({ testType, handleTestTypeChange }) => {
  return (
    <div className="assignment-step">
      <h3>Выберите тип задания</h3>
      <div className="test-type-selection">
        <div className="test-type-options">
          <div 
            className={`test-type-option ${testType === 'standard' ? 'active' : ''}`}
            onClick={() => handleTestTypeChange('standard')}
          >
            <FaClipboardCheck />
            <span>Обычный тест</span>
          </div>
          
          <div 
            className={`test-type-option ${testType === 'quiz' ? 'active' : ''}`}
            onClick={() => handleTestTypeChange('quiz')}
          >
            <FaGamepad />
            <span>Квиз</span>
          </div>
          
          <div 
            className={`test-type-option ${testType === 'homework' ? 'active' : ''}`}
            onClick={() => handleTestTypeChange('homework')}
          >
            <FaBook />
            <span>Домашнее задание</span>
          </div>
        </div>
        
        <div className="test-type-description">
          {testType === 'standard' && (
            <p>Обычный тест - стандартный формат тестирования с ограничением по времени.</p>
          )}
          {testType === 'quiz' && (
            <p>Квиз - интерактивный формат с ограничением времени на каждый вопрос.</p>
          )}
          {testType === 'homework' && (
            <p>Домашнее задание - тест без строгих ограничений по времени, с возможностью поздней сдачи.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1TestType;