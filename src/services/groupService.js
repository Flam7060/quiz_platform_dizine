// Сервис для работы с группами пользователей
// В реальном приложении здесь будут запросы к API

// Имитация базы данных групп
const groups = [
  {
    id: '1',
    name: 'Администраторы',
    description: 'Группа администраторов платформы',
    code: 'ADMIN2023',
    createdBy: '1',
    members: ['1', '2']
  },
  {
    id: '2',
    name: 'Математика 10А',
    description: 'Группа для учеников 10А класса по математике',
    code: 'MATH10A',
    createdBy: '2',
    members: ['2', '3']
  },
  {
    id: '3',
    name: 'Физика 11Б',
    description: 'Группа для учеников 11Б класса по физике',
    code: 'PHYS11B',
    createdBy: '2',
    members: ['2']
  }
];

// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Получение всех групп
export const getAllGroups = async () => {
  // Имитация задержки сети
  await delay(800);
  
  return [...groups];
};

// Получение групп пользователя
export const getUserGroups = async (userId) => {
  // Имитация задержки сети
  await delay(800);
  
  // Фильтруем группы, в которых пользователь является участником
  return groups.filter(group => group.members.includes(userId));
};

// Получение доступных групп для присоединения
export const getAvailableGroups = async (userId) => {
  // Имитация задержки сети
  await delay(800);
  
  // Фильтруем группы, в которых пользователь НЕ является участником
  return groups.filter(group => !group.members.includes(userId));
};

// Создание новой группы
export const createGroup = async (groupData, creatorId) => {
  // Имитация задержки сети
  await delay(1000);
  
  // Проверка, что группа с таким кодом не существует
  if (groups.some(g => g.code === groupData.code)) {
    throw new Error('Группа с таким кодом уже существует');
  }
  
  // Создаем новую группу
  const newGroup = {
    id: String(groups.length + 1),
    ...groupData,
    createdBy: creatorId,
    members: [creatorId] // Создатель автоматически становится участником
  };
  
  // В реальном приложении здесь был бы запрос к API для создания группы
  groups.push(newGroup);
  
  return newGroup;
};

// Присоединение к группе по коду
export const joinGroupByCode = async (code, userId) => {
  // Имитация задержки сети
  await delay(1000);
  
  // Находим группу по коду
  const groupIndex = groups.findIndex(g => g.code === code);
  
  if (groupIndex === -1) {
    throw new Error('Группа с таким кодом не найдена');
  }
  
  // Проверяем, что пользователь еще не в группе
  if (groups[groupIndex].members.includes(userId)) {
    throw new Error('Вы уже являетесь участником этой группы');
  }
  
  // Добавляем пользователя в группу
  groups[groupIndex].members.push(userId);
  
  return groups[groupIndex];
};

// Запрос на присоединение к группе
export const requestJoinGroup = async (groupId, userId) => {
  // Имитация задержки сети
  await delay(1000);
  
  // В реальном приложении здесь был бы запрос к API для создания запроса на присоединение
  // Для демонстрации просто добавляем пользователя в группу
  
  // Находим группу по ID
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) {
    throw new Error('Группа не найдена');
  }
  
  // Проверяем, что пользователь еще не в группе
  if (groups[groupIndex].members.includes(userId)) {
    throw new Error('Вы уже являетесь участником этой группы');
  }
  
  // Добавляем пользователя в группу
  groups[groupIndex].members.push(userId);
  
  return groups[groupIndex];
};

// Получение группы по ID
export const getGroupById = async (groupId) => {
  // Имитация задержки сети
  await delay(500);
  
  // Находим группу по ID
  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    throw new Error('Группа не найдена');
  }
  
  return group;
};
