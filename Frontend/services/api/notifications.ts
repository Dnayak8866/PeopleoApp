import api from './apiService';

export interface NotificationItem {
  id: number;
  employeeId: number;
  title: string;
  message: string;
  type: string; // 'success' | 'info' | 'calendar' | 'warning'
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (employeeId: number): Promise<NotificationItem[]> => {
  try {
    const response = await api.get(`/notifications/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (employeeId: number): Promise<void> => {
  try {
    await api.patch(`/notifications/${employeeId}/read-all`);
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  try {
    await api.patch(`/notifications/${id}/read`);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};
