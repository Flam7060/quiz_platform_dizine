import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/design-hub.scss';

const DesignHubPage = () => {
  return (
    <div className="design-hub">
      <div className="hub-header">
        <h1>Дизайн-хаб Quiz Platform</h1>
        <p>Навигация по всем страницам платформы для тестирования дизайна</p>
      </div>

      <div className="hub-content">
        {/* Публичные страницы */}
        <div className="hub-section">
          <h2>Публичные страницы</h2>
          <div className="hub-links">
            <Link to="/home" className="hub-link" data-discover="true">
              <div className="hub-link-icon">🏠</div>
              <div className="hub-link-content">
                <h3>Главная страница</h3>
                <p>Лендинг платформы</p>
              </div>
            </Link>
            <Link to="/login" className="hub-link" data-discover="true">
              <div className="hub-link-icon">🔑</div>
              <div className="hub-link-content">
                <h3>Страница входа</h3>
                <p>Авторизация пользователей</p>
              </div>
            </Link>
            <Link to="/register" className="hub-link" data-discover="true">
              <div className="hub-link-icon">📝</div>
              <div className="hub-link-content">
                <h3>Страница регистрации</h3>
                <p>Регистрация новых пользователей</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Дашборд */}
        <div className="hub-section">
          <h2>Дашборд</h2>
          <div className="hub-links">
            <Link to="/dashboard?role=student" className="hub-link student" data-discover="true">
              <div className="hub-link-icon">👨‍🎓</div>
              <div className="hub-link-content">
                <h3>Дашборд студента</h3>
                <p>Личный кабинет для студентов</p>
              </div>
            </Link>
            <Link to="/dashboard?role=teacher" className="hub-link teacher" data-discover="true">
              <div className="hub-link-icon">👨‍🏫</div>
              <div className="hub-link-content">
                <h3>Дашборд преподавателя</h3>
                <p>Личный кабинет для преподавателей</p>
              </div>
            </Link>
            <Link to="/dashboard?role=admin" className="hub-link admin" data-discover="true">
              <div className="hub-link-icon">👨‍💼</div>
              <div className="hub-link-content">
                <h3>Дашборд администратора</h3>
                <p>Панель управления для администраторов</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Тесты */}
        <div className="hub-section">
          <h2>Тесты</h2>
          <div className="hub-links">
            <Link to="/create-test" className="hub-link teacher" data-discover="true">
              <div className="hub-link-icon">➡</div>
              <div className="hub-link-content">
                <h3>Создание теста</h3>
                <p>Страница создания нового теста</p>
              </div>
            </Link>
            <Link to="/test-mode" className="hub-link student" data-discover="true">
              <div className="hub-link-icon">📝</div>
              <div className="hub-link-content">
                <h3>Стандартный режим теста</h3>
                <p>Прохождение теста с полной навигацией</p>
              </div>
            </Link>
            <Link to="/quiz-mode" className="hub-link student" data-discover="true">
              <div className="hub-link-icon">⏱</div>
              <div className="hub-link-content">
                <h3>Режим квиза</h3>
                <p>Быстрый квиз с ограничением времени на вопрос</p>
              </div>
            </Link>
            <Link to="/flashcard-mode" className="hub-link student" data-discover="true">
              <div className="hub-link-icon">📄</div>
              <div className="hub-link-content">
                <h3>Режим повторения</h3>
                <p>Изучение материала с помощью флэш-карточек</p>
              </div>
            </Link>
            <Link to="/quiz/sample-quiz-id/results" className="hub-link student" data-discover="true">
              <div className="hub-link-icon">📊</div>
              <div className="hub-link-content">
                <h3>Результаты теста (студент)</h3>
                <p>Просмотр результатов пройденного теста</p>
              </div>
            </Link>
            <Link to="/quiz/sample-quiz-id/results?role=teacher" className="hub-link teacher" data-discover="true">
              <div className="hub-link-icon">📈</div>
              <div className="hub-link-content">
                <h3>Результаты теста (преподаватель)</h3>
                <p>Анализ результатов теста для преподавателя</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Домашние задания */}
        <div className="hub-section">
          <h2>Домашние задания</h2>
          <div className="hub-links">
            <Link to="/dashboard/homework?role=student" className="hub-link student">
              <div className="hub-link-icon">📚</div>
              <div className="hub-link-content">
                <h3>Домашние задания (студент)</h3>
                <p>Список домашних заданий для студента</p>
              </div>
            </Link>
            <Link to="/dashboard/homework?role=teacher" className="hub-link teacher">
              <div className="hub-link-icon">📝</div>
              <div className="hub-link-content">
                <h3>Управление домашними заданиями</h3>
                <p>Создание и управление заданиями</p>
              </div>
            </Link>
            <Link to="/homework/create" className="hub-link teacher">
              <div className="hub-link-icon">➕</div>
              <div className="hub-link-content">
                <h3>Создание домашнего задания</h3>
                <p>Интерфейс создания нового задания</p>
              </div>
            </Link>
            <Link to="/homework/sample-id" className="hub-link student">
              <div className="hub-link-icon">✏️</div>
              <div className="hub-link-content">
                <h3>Выполнение домашнего задания</h3>
                <p>Интерфейс для выполнения задания</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Курсы */}
        <div className="hub-section">
          <h2>Курсы</h2>
          <div className="hub-links">
            <Link to="/courses?role=student" className="hub-link student">
              <div className="hub-link-icon">📚</div>
              <div className="hub-link-content">
                <h3>Список курсов (студент)</h3>
                <p>Доступные курсы для студента</p>
              </div>
            </Link>
            <Link to="/courses?role=teacher" className="hub-link teacher">
              <div className="hub-link-icon">📋</div>
              <div className="hub-link-content">
                <h3>Управление курсами (преподаватель)</h3>
                <p>Управление курсами для преподавателя</p>
              </div>
            </Link>
            <Link to="/create-course" className="hub-link teacher">
              <div className="hub-link-icon">➕</div>
              <div className="hub-link-content">
                <h3>Создание курса</h3>
                <p>Интерфейс создания нового курса</p>
              </div>
            </Link>
            <Link to="/course/sample-course-id?role=student" className="hub-link student">
              <div className="hub-link-icon">📖</div>
              <div className="hub-link-content">
                <h3>Просмотр курса (студент)</h3>
                <p>Интерфейс просмотра курса для студента</p>
              </div>
            </Link>
            <Link to="/course/sample-course-id?role=teacher" className="hub-link teacher">
              <div className="hub-link-icon">📝</div>
              <div className="hub-link-content">
                <h3>Редактирование курса</h3>
                <p>Интерфейс редактирования курса</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Группы */}
        <div className="hub-section">
          <h2>Группы</h2>
          <div className="hub-links">
            <Link to="/groups?role=teacher" className="hub-link teacher">
              <div className="hub-link-icon">👥</div>
              <div className="hub-link-content">
                <h3>Управление группами</h3>
                <p>Интерфейс управления группами</p>
              </div>
            </Link>
            <Link to="/groups/create" className="hub-link teacher">
              <div className="hub-link-icon">➕</div>
              <div className="hub-link-content">
                <h3>Создание группы</h3>
                <p>Интерфейс создания новой группы</p>
              </div>
            </Link>
            <Link to="/groups/sample-group-id" className="hub-link teacher">
              <div className="hub-link-icon">👨‍👩‍👧‍👦</div>
              <div className="hub-link-content">
                <h3>Просмотр группы</h3>
                <p>Детальная информация о группе</p>
              </div>
            </Link>
            <Link to="/groups/sample-group-id/assign" className="hub-link teacher">
              <div className="hub-link-icon">📋</div>
              <div className="hub-link-content">
                <h3>Назначение тестов группе</h3>
                <p>Интерфейс назначения тестов группе</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Учебные материалы */}
        <div className="hub-section">
          <h2>Учебные материалы</h2>
          <div className="hub-links">
            <Link to="/dashboard/materials?role=student" className="hub-link student">
              <div className="hub-link-icon">📚</div>
              <div className="hub-link-content">
                <h3>Материалы (студент)</h3>
                <p>Просмотр учебных материалов</p>
              </div>
            </Link>
            <Link to="/dashboard/materials?role=teacher" className="hub-link teacher">
              <div className="hub-link-icon">📝</div>
              <div className="hub-link-content">
                <h3>Управление материалами</h3>
                <p>Создание и управление материалами</p>
              </div>
            </Link>
            <Link to="/materials/create" className="hub-link teacher">
              <div className="hub-link-icon">➕</div>
              <div className="hub-link-content">
                <h3>Создание материала</h3>
                <p>Интерфейс создания нового материала</p>
              </div>
            </Link>
            <Link to="/materials/sample-id" className="hub-link student">
              <div className="hub-link-icon">📖</div>
              <div className="hub-link-content">
                <h3>Просмотр материала</h3>
                <p>Интерфейс просмотра учебного материала</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignHubPage;
