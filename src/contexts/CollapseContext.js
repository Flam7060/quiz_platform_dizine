import React, { createContext, useState, useContext } from 'react';

// Создаем контекст для управления сворачиванием секций
const CollapseContext = createContext();

// Хук для использования контекста
export const useCollapse = () => {
  return useContext(CollapseContext);
};

// Провайдер контекста
export const CollapseProvider = ({ children }) => {
  // Состояние для отслеживания свернутых основных компонентов
  const [collapsedComponents, setCollapsedComponents] = useState({
    // Основные секции
    profileSection: false,
    statsSection: false,
    assignTestsSection: false,
    assignedTests: false,
    
    // Секции статистики
    attentionSection: false,
    groupsStatsSection: false,
    testsStatsSection: false,
    
    // Другие секции
    stepByStepSection: false
  });
  
  // Функция для переключения состояния свернутости компонента
  const toggleComponent = (component) => {
    setCollapsedComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }));
  };
  
  const value = {
    collapsedComponents,
    toggleComponent
  };
  
  return (
    <CollapseContext.Provider value={value}>
      {children}
    </CollapseContext.Provider>
  );
};
