import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Step2TestSelection = ({ availableTests, selectedTest, handleTestChange }) => {
  // Добавляем моковые данные для тестирования
  const demoTests = [
    { id: 't1', title: 'Математика: Базовый уровень', type: 'test' },
    { id: 't2', title: 'Физика: Механика', type: 'test' },
    { id: 't3', title: 'Информатика: Алгоритмы', type: 'test' },
    { id: 'q1', title: 'Музыкальный квиз', type: 'quiz' },
    { id: 'q2', title: 'Киноквиз', type: 'quiz' },
    { id: 'h1', title: 'Домашнее задание по литературе', type: 'homework' },
    { id: 'h2', title: 'Домашнее задание по истории', type: 'homework' },
  ];
  
  // Используем реальные данные или моковые, если реальных нет
  const testsToShow = availableTests && availableTests.length > 0 ? availableTests : demoTests;
  
  return (
    <div className="assignment-step">
      <h3>Выберите тест</h3>
      
      <div className="test-search">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Поиск по названию теста..." 
            className="test-search-input"
          />
        </div>
      </div>
      
      <div className="test-selection">
        <select 
          value={selectedTest} 
          onChange={handleTestChange}
          className="test-select"
        >
          <option value="">— Выберите тест —</option>
          {testsToShow.map(test => (
            <option key={test.id} value={test.id}>
              {test.title}
            </option>
          ))}
        </select>
      </div>
      
      {selectedTest && (
        <div className="selected-test-info">
          <h4>Выбранный тест:</h4>
          <p>{testsToShow.find(test => test.id === selectedTest)?.title}</p>
        </div>
      )}
    </div>
  );
};

export default Step2TestSelection;