import * as Notifications from 'expo-notifications';

export const sendNotification = async (title: string, body: string, data: object) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null,
  });
};

export const sendNewMessageNotification = async (message: string) => {
  await sendNotification('New Message', message, { type: 'new_message' });
};

export const sendMaintenanceRequestNotification = async (request: string) => {
  await sendNotification('Maintenance Request', request, { type: 'maintenance_request' });
};

export const sendPaymentReminderNotification = async (reminder: string) => {
  await sendNotification('Payment Reminder', reminder, { type: 'payment_reminder' });
};
