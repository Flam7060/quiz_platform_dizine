// Сервис для работы с аутентификацией пользователей
// В реальном приложении здесь будут запросы к API

// Имитация базы данных пользователей
const users = [
  {
    id: '1',
    email: 'admin@quizum.ru',
    password: 'admin123',
    displayName: 'Администратор',
    role: 'admin',
    photoURL: null,
    groups: ['1']
  },
  {
    id: '2',
    email: 'teacher@quizum.ru',
    password: 'teacher123',
    displayName: 'Преподаватель',
    role: 'teacher',
    photoURL: null,
    groups: ['1', '2']
  },
  {
    id: '3',
    email: 'student@quizum.ru',
    password: 'student123',
    displayName: 'Студент',
    role: 'student',
    photoURL: null,
    groups: ['2']
  },
  {
    id: '4',
    email: 'student1@quizum.ru',
    password: 'student123',
    displayName: 'Иванов Иван',
    role: 'student',
    photoURL: null,
    groups: ['2']
  },
  {
    id: '5',
    email: 'student2@quizum.ru',
    password: 'student123',
    displayName: 'Петров Петр',
    role: 'student',
    photoURL: null,
    groups: ['3']
  }
];

// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Логин пользователя
export const loginUser = async (email, password) => {
  // Имитация задержки сети
  await delay(1000);
  
  // Поиск пользователя
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Неверный email или пароль');
  }
  
  // Не возвращаем пароль в клиентский код
  const { password: _, ...userWithoutPassword } = user;
  
  // Сохраняем в localStorage для сохранения сессии
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Регистрация пользователя
export const registerUser = async (email, password, displayName, inviteCode) => {
  // Имитация задержки сети
  await delay(1000);
  
  // Проверка, что пользователь с таким email не существует
  if (users.some(u => u.email === email)) {
    throw new Error('Пользователь с таким email уже существует');
  }
  
  // В реальном приложении здесь была бы проверка кода приглашения
  // Для демонстрации используем простую проверку
  let role = 'student';
  let groupId = null;
  
  if (inviteCode === 'ADMIN2023') {
    role = 'admin';
    groupId = '1';
  } else if (inviteCode === 'TEACHER2023') {
    role = 'teacher';
    groupId = '1';
  } else if (inviteCode === 'STUDENT2023') {
    role = 'student';
    groupId = '2';
  } else {
    throw new Error('Неверный код приглашения');
  }
  
  // Создаем нового пользователя
  const newUser = {
    id: String(users.length + 1),
    email,
    password,
    displayName,
    role,
    photoURL: null,
    groups: groupId ? [groupId] : []
  };
  
  // В реальном приложении здесь был бы запрос к API для создания пользователя
  users.push(newUser);
  
  // Не возвращаем пароль в клиентский код
  const { password: _, ...userWithoutPassword } = newUser;
  
  // Сохраняем в localStorage для сохранения сессии
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Выход пользователя
export const logoutUser = async () => {
  // Имитация задержки сети
  await delay(500);
  
  // Удаляем данные пользователя из localStorage
  localStorage.removeItem('currentUser');
  
  return true;
};

// Получение текущего пользователя
export const getCurrentUser = () => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Обновление профиля пользователя
export const updateUserProfile = async (userId, profileData) => {
  // Имитация задержки сети
  await delay(1000);
  
  // Находим пользователя
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Пользователь не найден');
  }
  
  // Обновляем данные пользователя
  users[userIndex] = {
    ...users[userIndex],
    ...profileData,
    // Не позволяем обновить критические поля
    id: users[userIndex].id,
    email: users[userIndex].email,
    role: users[userIndex].role
  };
  
  // Не возвращаем пароль в клиентский код
  const { password: _, ...userWithoutPassword } = users[userIndex];
  
  // Обновляем данные в localStorage
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Проверка валидности токена (в реальном приложении)
export const verifyToken = async () => {
  // В реальном приложении здесь был бы запрос к API для проверки токена
  // Для демонстрации просто проверяем наличие пользователя в localStorage
  const user = getCurrentUser();
  return !!user;
};
