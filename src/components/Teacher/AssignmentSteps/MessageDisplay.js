import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const MessageDisplay = ({ successMessage, errorMessage }) => {
  return (
    <>
      {successMessage && (
        <div className="success-message">
          <FaCheckCircle /> {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message">
          <FaExclamationTriangle /> {errorMessage}
        </div>
      )}
    </>
  );
};

export default MessageDisplay;
