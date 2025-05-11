import React, { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaUserMinus, 
  FaUsers, 
  FaUserPlus, 
  FaEdit, 
  FaCopy, 
  FaLink, 
  FaPencilAlt 
} from 'react-icons/fa';
import '../../styles/groupStudentsPopup.scss';

const GroupStudentsPopup = ({ group, onClose }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [inviteCode, setInviteCode] = useState('GR' + group.id + '-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [inviteLink, setInviteLink] = useState(`https://quizum.ru/join/${inviteCode}`);
  const [copySuccess, setCopySuccess] = useState({ code: false, link: false });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Пример данных студентов, в реальном приложении эти данные должны приходить из пропсов или API
  const students = [
    { 
      id: 1, 
      name: 'Иван Иванов', 
      email: 'ivan@example.com', 
      lastActivity: '2 часа назад',
      avgScore: 85
    },
    { 
      id: 2, 
      name: 'Мария Петрова', 
      email: 'maria@example.com',
      lastActivity: 'Сегодня',
      avgScore: 92
    },
    { 
      id: 3, 
      name: 'Алексей Сидоров', 
      email: 'alex@example.com',
      lastActivity: '3 дня назад',
      avgScore: 67
    },
    { 
      id: 4, 
      name: 'Елена Кузнецова', 
      email: 'elena@example.com',
      lastActivity: 'Вчера',
      avgScore: 78
    },
    { 
      id: 5, 
      name: 'Дмитрий Соколов', 
      email: 'dmitry@example.com',
      lastActivity: '1 неделю назад',
      avgScore: 45
    },
  ];
  
  const handleRemoveStudent = (studentId) => {
    // Здесь должна быть логика удаления студента из группы
    console.log(`Удаление студента с ID: ${studentId}`);
    // После успешного удаления, обновить список студентов
  };
  
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess({ ...copySuccess, [type]: true });
        
        // Сбросить сообщение об успешном копировании через 2 секунды
        setTimeout(() => {
          setCopySuccess({ ...copySuccess, [type]: false });
        }, 2000);
      })
      .catch(err => {
        console.error('Ошибка при копировании: ', err);
      });
  };
  
  const generateNewInviteCode = () => {
    // Здесь должна быть логика генерации нового кода приглашения
    const newCode = 'GR' + group.id + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(newCode);
    setInviteLink(`https://quizum.ru/join/${newCode}`);
  };

  return (
    <div className="group-students-popup">
      <div className="popup-header">
        <h3>Управление группой: {group.name}</h3>
        <button className="close-popup-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      
      <div className="popup-tabs">
        <button 
          className={`popup-tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          <FaUsers /> Участники
        </button>
        <button 
          className={`popup-tab ${activeTab === 'invite' ? 'active' : ''}`}
          onClick={() => setActiveTab('invite')}
        >
          <FaUserPlus /> Приглашение
        </button>
        <button 
          className={`popup-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FaEdit /> Настройки
        </button>
      </div>
      
      <div className="popup-content">
        {/* Вкладка с участниками */}
        {activeTab === 'members' && (
          <div className="members-tab">
            <div className="tab-header">
              <h4>Участники группы ({students.length})</h4>
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Поиск по имени или email..."
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="students-list">
              <div className="students-list-header">
                <div className="student-name-col">Имя пользователя</div>
                <div className="student-email-col">Email</div>
                <div className="student-activity-col">Активность</div>
                <div className="student-score-col">Успеваемость</div>
                <div className="student-actions-col">Действия</div>
              </div>
              
              {students.length > 0 ? (
                students.map(student => (
                  <div key={student.id} className="student-item">
                    <div className="student-name-col">{student.name}</div>
                    <div className="student-email-col">{student.email}</div>
                    <div className="student-activity-col">{student.lastActivity}</div>
                    <div className="student-score-col">
                      <div className="score-badge" style={{ 
                        backgroundColor: student.avgScore >= 80 ? '#52c41a' : 
                                        student.avgScore >= 60 ? '#faad14' : '#f5222d' 
                      }}>
                        {student.avgScore}%
                      </div>
                    </div>
                    <div className="student-actions-col">
                      <button 
                        className="remove-student-button" 
                        onClick={() => handleRemoveStudent(student.id)}
                        title="Удалить из группы"
                      >
                        <FaUserMinus />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-students-message">
                  В этой группе нет студентов
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Вкладка с приглашением */}
        {activeTab === 'invite' && (
          <div className="invite-tab">
            <div className="invite-section">
              <h4>Приглашение новых участников</h4>
              <p>Поделитесь кодом или ссылкой с участниками, которых вы хотите пригласить в группу.</p>
              
              <div className="invite-code-section">
                <h5>Код приглашения:</h5>
                <div className="invite-code">
                  <span>{inviteCode}</span>
                  <button 
                    className="copy-button" 
                    onClick={() => copyToClipboard(inviteCode, 'code')}
                    title="Копировать код"
                  >
                    <FaCopy />
                  </button>
                </div>
                {copySuccess.code && <div className="copy-success">Скопировано!</div>}
              </div>
              
              <div className="invite-link-section">
                <h5>Ссылка приглашения:</h5>
                <div className="invite-link">
                  <span>{inviteLink}</span>
                  <button 
                    className="copy-button" 
                    onClick={() => copyToClipboard(inviteLink, 'link')}
                    title="Копировать ссылку"
                  >
                    <FaLink />
                  </button>
                </div>
                {copySuccess.link && <div className="copy-success">Скопировано!</div>}
              </div>
              
              <div className="invite-info">
                <p>Код и ссылка действительны в течение 7 дней.</p>
                <button 
                  className="generate-new-button"
                  onClick={generateNewInviteCode}
                >
                  Сгенерировать новый код
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Вкладка с настройками */}
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="group-settings">
              <h4>Настройки группы</h4>
              
              <div className="setting-item">
                <label>Название группы:</label>
                <div className="setting-input-container">
                  <input 
                    type="text" 
                    value={group.name}
                    className="setting-input"
                  />
                  <button className="edit-button">
                    <FaPencilAlt />
                  </button>
                </div>
              </div>
              
              <div className="setting-item">
                <label>Описание:</label>
                <div className="setting-input-container">
                  <textarea 
                    className="setting-textarea"
                    placeholder="Добавьте описание группы..."
                  ></textarea>
                </div>
              </div>
              
              <div className="setting-item">
                <label>Настройки доступа:</label>
                <div className="setting-options">
                  <div className="setting-option">
                    <input type="checkbox" id="allowJoin" checked />
                    <label htmlFor="allowJoin">Разрешить присоединение по коду</label>
                  </div>
                  <div className="setting-option">
                    <input type="checkbox" id="moderateJoin" />
                    <label htmlFor="moderateJoin">Модерировать запросы на присоединение</label>
                  </div>
                </div>
              </div>
              
              <div className="setting-actions">
                <button className="save-settings-button">
                  Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupStudentsPopup;
