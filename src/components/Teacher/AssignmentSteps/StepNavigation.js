import React from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

const StepNavigation = ({ currentStep, prevStep, nextStep, isLastStep }) => {
  return (
    <div className="step-navigation">
      <div className="navigation-buttons">
        {currentStep > 1 && (
          <button 
            className="prev-step-button"
            onClick={prevStep}
          >
            <FaArrowLeft /> Назад
          </button>
        )}
        
        <button 
          className="next-step-button"
          onClick={nextStep}
        >
          {isLastStep ? (
            <>
              <FaCheck /> Назначить
            </>
          ) : (
            <>
              Далее <FaArrowRight />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepNavigation;