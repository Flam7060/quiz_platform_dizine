import React from 'react';
import { FaUserPlus, FaUserMinus, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Step5GroupsSelection = ({ 
  teacherGroups, 
  selectedGroups, 
  handleGroupChange, 
  expandedGroups, 
  toggleGroupExpansion,
  usersInGroups,
  selectedUsers,
  handleUserSelection,
  selectAllUsersInGroup,
  deselectAllUsersInGroup,
  areAllUsersInGroupSelected,
  isAnyUserInGroupSelected
}) => {
  return (
    <div className="assignment-step">
      <h3>Выбор групп и пользователей</h3>
      
      <div className="groups-selection-info">
        <FaUsers />
        <p>Выберите группы, которым будет назначен тест. Для выбора отдельных пользователей внутри группы нажмите "Выбрать пользователей".</p>
      </div>
      
      <div className="groups-selection">
        {teacherGroups.map(group => {
          const isGroupExpanded = expandedGroups.includes(group.id);
          return (
            <div key={group.id} className="group-container">
              <div className="group-header">
                <div className="group-checkbox">
                  <input
                    type="checkbox"
                    id={`group-${group.id}`}
                    checked={selectedGroups.includes(group.id)}
                    onChange={() => handleGroupChange(group.id)}
                  />
                  <label htmlFor={`group-${group.id}`}>{group.name}</label>
                </div>
                <div className="group-actions">
                  <button 
                    className="select-users-button"
                    onClick={() => toggleGroupExpansion(group.id)}
                  >
                    {isGroupExpanded ? (
                      <>
                        <FaChevronUp /> Скрыть пользователей
                      </>
                    ) : (
                      <>
                        <FaChevronDown /> Выбрать пользователей
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {isGroupExpanded && (
                <div className="users-list">
                  <div className="users-list-header">
                    <button 
                      className="select-all-button"
                      onClick={() => selectAllUsersInGroup(group.id)}
                      disabled={areAllUsersInGroupSelected(group.id)}
                    >
                      <FaUserPlus /> Выбрать всех
                    </button>
                    <button 
                      className="deselect-all-button"
                      onClick={() => deselectAllUsersInGroup(group.id)}
                      disabled={!isAnyUserInGroupSelected(group.id)}
                    >
                      <FaUserMinus /> Отменить выбор
                    </button>
                  </div>
                  
                  <div className="users-grid">
                    {usersInGroups[group.id]?.map(user => (
                      <div key={user.id} className="user-item">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelection(user.id)}
                        />
                        <label htmlFor={`user-${user.id}`}>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="selection-summary">
        <p>
          <strong>Выбрано групп:</strong> {selectedGroups.length}
        </p>
        <p>
          <strong>Выбрано пользователей:</strong> {selectedUsers.length}
        </p>
      </div>
    </div>
  );
};

export default Step5GroupsSelection;