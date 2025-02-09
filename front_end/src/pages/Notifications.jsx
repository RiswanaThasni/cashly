import React, { useState, useEffect } from "react";
import api from "../utils/api"; // Use your api.js instance to fetch notifications

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications when the component mounts
  useEffect(() => {
    api
      .get("/api/auth/notifications/")  // Replace with your API endpoint
      .then((response) => setNotifications(response.data))
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Notifications</h2>
      <ul className="mt-4">
        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          notifications.map((notification) => (
            <li key={notification.id} className="border-b p-2">
              <p>{notification.message}</p>
              <span className="text-sm text-gray-500">{notification.date}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notifications;
