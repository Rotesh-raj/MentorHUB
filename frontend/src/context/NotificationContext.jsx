import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now() + Math.random();

    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const value = {
    success: (msg) => addNotification(msg, 'success'),
    error: (msg) => addNotification(msg, 'error'),
    warning: (msg) => addNotification(msg, 'warning'),
    info: (msg) => addNotification(msg, 'info')
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* 🔥 Notification UI */}
      <div className="fixed top-5 right-5 z-50 space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white animate-slideIn
              ${n.type === 'success' && 'bg-green-500'}
              ${n.type === 'error' && 'bg-red-500'}
              ${n.type === 'warning' && 'bg-yellow-500'}
              ${n.type === 'info' && 'bg-blue-500'}
            `}
          >
            {n.message}
          </div>
        ))}
      </div>

    </NotificationContext.Provider>
  );
};
