import React from 'react';
import { FaCheck } from 'react-icons/fa';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Тип задания' },
    { number: 2, title: 'Выбор теста' },
    { number: 3, title: 'Сроки' },
    { number: 4, title: 'Настройки' },
    { number: 5, title: 'Назначение' }
  ];

  return (
    <div className="progress-indicator">
      {steps.map((step) => (
        <div 
          key={step.number} 
          className={`progress-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
        >
          <div className="step-number">
            {currentStep > step.number ? <FaCheck /> : step.number}
          </div>
          <div className="step-title">{step.title}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
