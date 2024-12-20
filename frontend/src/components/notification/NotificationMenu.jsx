import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";
import { useNotifications } from "../../contexts/notification/NotificationContext";
import { useNavigate } from "react-router-dom";

const NotificationMenu = ({ userId, onClose }) => {
  const {
    getUserNotifications,
    markNotificationsAsViewed,
    deleteNotification,
    loading,
  } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getUserNotifications(userId);
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

  const handleNotificationClick = (notification) => {
    navigate("/", {
      state: {
        scrollToPostId: notification.postId._id,
        openComments: true,
        highlightCommentId: notification.commentId._id,
        includeResolved: true,
      },
    });
    onClose();
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
                <div
                  className="notification-content"
                  onClick={() => handleNotificationClick(notification)}
                  style={{ cursor: "pointer" }}
                >
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotification(notification._id);
                  }}
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
