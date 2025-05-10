import React, { useState, useEffect } from 'react';
import { useGroups } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';

const ProfileSection = () => {
  const { currentUser } = useAuth();
  const { userGroups, availableGroups, requestJoinGroup, joinGroupByCode } = useGroups();
  
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [showJoinByCodeForm, setShowJoinByCodeForm] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCodeError, setJoinCodeError] = useState('');
  
  // Демо-данные пользователя
  const [userData, setUserData] = useState({
    name: 'Иванов Иван Иванович',
    email: 'ivanov@example.ru'
  });
  
  // Удалена статистика пользователя, перенесена в UserStatsSection
  
  // Загрузка данных пользователя
  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.name || 'Не указано',
        email: currentUser.email || 'Не указано'
      });
    }
  }, [currentUser]);
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Если закрываем режим редактирования, закрываем и меню групп
    if (isEditing) {
      setShowGroupMenu(false);
      setShowJoinByCodeForm(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleGroupRequest = async (groupId) => {
    try {
      const request = await requestJoinGroup(groupId);
      if (request) {
        alert(`Запрос на присоединение к группе отправлен`);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса на присоединение к группе:', error);
    }
    setShowGroupMenu(false);
  };
  
  const handleJoinByCode = async (e) => {
    e.preventDefault();
    setJoinCodeError('');
    
    try {
      const result = await joinGroupByCode(inviteCode);
      if (result) {
        alert(`Вы успешно присоединились к группе ${result.name}`);
        setInviteCode('');
        setShowJoinByCodeForm(false);
      } else {
        setJoinCodeError('Неверный код приглашения');
      }
    } catch (error) {
      console.error('Ошибка при присоединении к группе по коду:', error);
      setJoinCodeError('Произошла ошибка при присоединении к группе');
    }
  };
  
  return (
    <div className="profile-card">
      <div className="profile-sidebar">
        <div className="profile-image" onClick={() => document.getElementById('profile-image-upload').click()}>
          {profileImage ? (
            <img src={profileImage} alt="Фото профиля" />
          ) : (
            <span>Фото</span>
          )}
          <input 
            type="file" 
            id="profile-image-upload" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleImageChange} 
          />
        </div>
        
        <div className="profile-quick-actions">
          <button className="quick-action-button">
            <i className="fas fa-medal"></i>
            <span>Достижения</span>
          </button>
          <button className="quick-action-button">
            <i className="fas fa-history"></i>
            <span>История</span>
          </button>
          <button className="quick-action-button">
            <i className="fas fa-certificate"></i>
            <span>Сертификаты</span>
          </button>
        </div>
      </div>
      <div className="profile-info">
        <div className="profile-header">
          <h3>Профиль пользователя</h3>
          <button 
            className={`edit-button ${isEditing ? 'active' : ''}`} 
            onClick={handleEditToggle}
          >
            {isEditing ? 'Сохранить' : 'Редактировать'}
          </button>
        </div>
        
        <div className="profile-info-row">
          <label>ФИО</label>
          {isEditing ? (
            <input 
              type="text" 
              name="name" 
              value={userData.name} 
              onChange={handleInputChange} 
            />
          ) : (
            <div className="info-value">{userData.name}</div>
          )}
        </div>
        
        <div className="profile-info-row">
          <label>Электронная почта</label>
          {isEditing ? (
            <input 
              type="email" 
              name="email" 
              value={userData.email} 
              onChange={handleInputChange} 
            />
          ) : (
            <div className="info-value">{userData.email}</div>
          )}
        </div>
        
        <div className="profile-info-row">
          <label>Мои группы</label>
          <div className="user-groups">
            {userGroups.length > 0 ? (
              <div className="groups-list">
                {userGroups.map((group) => (
                  <div key={group.id} className="group-badge">
                    {group.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="info-value">Вы не состоите ни в одной группе</div>
            )}
            
            {isEditing && (
              <div className="group-actions">
                <button 
                  className="group-action-btn" 
                  onClick={() => setShowGroupMenu(!showGroupMenu)}
                >
                  Присоединиться к группе
                </button>
                <button 
                  className="group-action-btn" 
                  onClick={() => {
                    setShowJoinByCodeForm(!showJoinByCodeForm);
                    setShowGroupMenu(false);
                  }}
                >
                  Ввести код приглашения
                </button>
              </div>
            )}
            
            {showGroupMenu && (
              <div className="group-dropdown">
                <div className="dropdown-header">Доступные группы</div>
                {availableGroups.filter(g => !userGroups.some(ug => ug.id === g.id)).map((group) => (
                  <div key={group.id} className="group-option">
                    <span>{group.name}</span>
                    <span className="group-description">{group.description}</span>
                    <button 
                      className="join-group-btn" 
                      onClick={() => handleGroupRequest(group.id)}
                    >
                      Отправить запрос
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {showJoinByCodeForm && (
              <div className="join-code-form">
                <form onSubmit={handleJoinByCode}>
                  <input 
                    type="text" 
                    placeholder="Введите код приглашения" 
                    value={inviteCode} 
                    onChange={(e) => setInviteCode(e.target.value)} 
                    required 
                  />
                  {joinCodeError && <div className="error-message">{joinCodeError}</div>}
                  <button type="submit" className="join-code-btn">Присоединиться</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
