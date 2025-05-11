import React from 'react';
import { FaClock, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

const Step3Timing = ({ testType, assignmentDate, handleDateChange, publishSettings, handlePublishSettingChange }) => {
  return (
    <div className="assignment-step">
      <h3>Настройка сроков</h3>
      
      {testType === 'quiz' ? (
        // Настройки для квиза
        <div className="quiz-timing">
          <div className="timing-info">
            <FaInfoCircle />
            <p>Для квиза необходимо указать время начала регистрации и время начала квиза.</p>
          </div>
          
          <div className="date-selection">
            <div className="date-input">
              <label htmlFor="registrationStart">
                <FaCalendarAlt /> Начало регистрации
              </label>
              <input
                type="datetime-local"
                id="registrationStart"
                name="registrationStart"
                value={publishSettings.registrationStart}
                onChange={handlePublishSettingChange}
                className="date-time-input"
              />
            </div>
            
            <div className="date-input">
              <label htmlFor="quizStart">
                <FaClock /> Время начала квиза
              </label>
              <input
                type="datetime-local"
                id="quizStart"
                name="quizStart"
                value={publishSettings.quizStart}
                onChange={handlePublishSettingChange}
                className="date-time-input"
              />
            </div>
          </div>
          
          <div className="timing-note">
            <p>Все участники должны зарегистрироваться до начала квиза. Квиз начнется одновременно для всех участников в указанное время.</p>
          </div>
        </div>
      ) : (
        // Настройки для обычного теста и домашнего задания
        <div className="standard-timing">
          <div className="timing-info">
            <FaInfoCircle />
            <p>
              {testType === 'standard' 
                ? 'Укажите период, в течение которого участники могут пройти тест.' 
                : 'Укажите сроки выполнения домашнего задания.'
              }
            </p>
          </div>
          
          <div className="date-selection">
            <div className="date-input">
              <label htmlFor="startDate">
                <FaCalendarAlt /> Дата начала
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={assignmentDate.startDate}
                onChange={handleDateChange}
                className="date-time-input"
              />
            </div>
            
            <div className="date-input">
              <label htmlFor="endDate">
                <FaCalendarAlt /> Дата окончания
              </label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={assignmentDate.endDate}
                onChange={handleDateChange}
                className="date-time-input"
              />
            </div>
          </div>
          
          {testType === 'homework' && (
            <div className="late-submission-option">
              <div className="checkbox-setting">
                <input
                  type="checkbox"
                  id="allowLateSubmission"
                  name="allowLateSubmission"
                  checked={publishSettings.allowLateSubmission}
                  onChange={handlePublishSettingChange}
                />
                <label htmlFor="allowLateSubmission">Разрешить позднюю сдачу</label>
              </div>
              
              {publishSettings.allowLateSubmission && (
                <div className="penalty-setting">
                  <label htmlFor="penaltyPercent">Штраф за позднюю сдачу (%)</label>
                  <input
                    type="number"
                    id="penaltyPercent"
                    name="penaltyPercent"
                    min="0"
                    max="100"
                    value={publishSettings.penaltyPercent}
                    onChange={handlePublishSettingChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step3Timing;