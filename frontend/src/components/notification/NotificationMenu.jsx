import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";
import { useNotifications } from "../../contexts/notification/NotificationContext";

const NotificationMenu = ({ userId, onClose }) => {
  const {
    getUserNotifications,
    markNotificationsAsViewed,
    deleteNotification,
    loading,
  } = useNotifications();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getUserNotifications(userId);
        console.log("Fetched notifications:", fetchedNotifications);
        setNotifications(fetchedNotifications);
        await markNotificationsAsViewed(userId);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="notification-menu">
      <div className="notification-header">
        <h3>Notifications</h3>
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="loading">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => {
            const username = notification.message.split(" ")[0];

            return (
              <div key={notification._id} className="notification-item">
                <div className="notification-content">
                  <p>
                    <strong>{username}</strong> left a comment on your post:{" "}
                    <strong>{notification.postId.title}</strong>
                  </p>
                  <p className="notification-comment">
                    {notification.commentId.text.length > 50
                      ? `${notification.commentId.text.substring(0, 50)}...`
                      : notification.commentId.text}
                  </p>
                  <span className="notification-time">
                    {format(new Date(notification.createdAt), "MM/dd/yyyy")}
                  </span>
                </div>
                <button
                  className="delete-notification"
                  onClick={() => handleDeleteNotification(notification._id)}
                >
                  <FaTrash />
                </button>
              </div>
            );
          })
        ) : (
          <div className="no-notifications">No new notifications</div>
        )}
      </div>
    </div>
  );
};

export default NotificationMenu;
