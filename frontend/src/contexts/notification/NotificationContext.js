import { createContext, useContext, useState } from "react";
import { notificationService } from "../../services/notificationService";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserNotifications = async (userId) => {
    setLoading(true);
    try {
      const notifications = await notificationService.getUserNotifications(
        userId
      );
      setLoading(false);
      return notifications;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching notifications");
      setLoading(false);
      throw err;
    }
  };

  const markNotificationsAsViewed = async (userId) => {
    setLoading(true);
    try {
      await notificationService.markNotificationsAsViewed(userId);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error marking notifications as viewed"
      );
      setLoading(false);
      throw err;
    }
  };

  const deleteNotification = async (notificationId) => {
    setLoading(true);
    try {
      await notificationService.deleteNotification(notificationId);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting notification");
      setLoading(false);
      throw err;
    }
  };

  const value = {
    loading,
    error,
    getUserNotifications,
    markNotificationsAsViewed,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
