import React from 'react';
import { FaCog, FaRandom, FaStopwatch, FaPercentage, FaClipboardCheck } from 'react-icons/fa';

const Step4Settings = ({ testType, publishSettings, handlePublishSettingChange, handleNumberSettingChange }) => {
  return (
    <div className="assignment-step">
      <h3>Настройки прохождения</h3>
      
      {/* Общие настройки для всех типов */}
      <div className="settings-section">
        <h4><FaCog /> Общие настройки</h4>
        
        <div className="settings-group">
          <div className="setting-item">
            <label htmlFor="passingScore">
              <FaPercentage /> Проходной балл (%)
            </label>
            <input
              type="number"
              id="passingScore"
              name="passingScore"
              min="1"
              max="100"
              value={publishSettings.passingScore}
              onChange={handleNumberSettingChange}
              className="number-input"
            />
          </div>
          
          {testType !== 'quiz' && (
            <div className="setting-item">
              <label htmlFor="attemptsAllowed">
                <FaClipboardCheck /> Количество попыток
              </label>
              <input
                type="number"
                id="attemptsAllowed"
                name="attemptsAllowed"
                min="1"
                max="10"
                value={publishSettings.attemptsAllowed}
                onChange={handleNumberSettingChange}
                className="number-input"
              />
            </div>
          )}
          
          {testType === 'standard' && (
            <div className="setting-item">
              <label htmlFor="timeLimit">
                <FaStopwatch /> Время на прохождение (минуты)
              </label>
              <input
                type="number"
                id="timeLimit"
                name="timeLimit"
                min="1"
                max="180"
                value={publishSettings.timeLimit}
                onChange={handleNumberSettingChange}
                className="number-input"
              />
            </div>
          )}
        </div>
        
        <div className="checkbox-settings">
          <div className="checkbox-setting">
            <input
              type="checkbox"
              id="shuffleQuestions"
              name="shuffleQuestions"
              checked={publishSettings.shuffleQuestions}
              onChange={handlePublishSettingChange}
            />
            <label htmlFor="shuffleQuestions">
              <FaRandom /> Перемешивать вопросы
            </label>
          </div>
          
          <div className="checkbox-setting">
            <input
              type="checkbox"
              id="shuffleAnswers"
              name="shuffleAnswers"
              checked={publishSettings.shuffleAnswers}
              onChange={handlePublishSettingChange}
            />
            <label htmlFor="shuffleAnswers">
              <FaRandom /> Перемешивать варианты ответов
            </label>
          </div>
          
          <div className="checkbox-setting">
            <input
              type="checkbox"
              id="allowPartialCredit"
              name="allowPartialCredit"
              checked={publishSettings.allowPartialCredit}
              onChange={handlePublishSettingChange}
            />
            <label htmlFor="allowPartialCredit">
              <FaPercentage /> Разрешить частичные баллы за неполные ответы
            </label>
          </div>
          
          <div className="checkbox-setting">
            <input
              type="checkbox"
              id="showResults"
              name="showResults"
              checked={publishSettings.showResults}
              onChange={handlePublishSettingChange}
            />
            <label htmlFor="showResults">
              <FaClipboardCheck /> Показывать результаты после завершения
            </label>
          </div>
        </div>
      </div>
      
      {/* Специфичные настройки для квиза */}
      {testType === 'quiz' && (
        <div className="settings-section">
          <h4><FaCog /> Настройки квиза</h4>
          
          <div className="settings-group">
            <div className="setting-item">
              <label htmlFor="questionTimeLimit">
                <FaStopwatch /> Время на вопрос (секунды)
              </label>
              <input
                type="number"
                id="questionTimeLimit"
                name="questionTimeLimit"
                min="5"
                max="300"
                value={publishSettings.questionTimeLimit}
                onChange={handleNumberSettingChange}
                className="number-input"
              />
            </div>
          </div>
          
          <div className="checkbox-settings">
            <div className="checkbox-setting">
              <input
                type="checkbox"
                id="allowLateRegistration"
                name="allowLateRegistration"
                checked={publishSettings.allowLateRegistration}
                onChange={handlePublishSettingChange}
              />
              <label htmlFor="allowLateRegistration">
                <FaClock /> Разрешить позднюю регистрацию
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Специфичные настройки для домашнего задания */}
      {testType === 'homework' && (
        <div className="settings-section">
          <h4><FaCog /> Настройки домашнего задания</h4>
          
          <div className="checkbox-settings">
            <div className="checkbox-setting">
              <input
                type="checkbox"
                id="notifyDeadline"
                name="notifyDeadline"
                checked={publishSettings.notifyDeadline}
                onChange={handlePublishSettingChange}
              />
              <label htmlFor="notifyDeadline">
                <FaClock /> Уведомлять о приближении срока
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4Settings;