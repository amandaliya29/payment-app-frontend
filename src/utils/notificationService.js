import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

/**
 * Request notification permission
 */
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

/**
 * Get FCM token
 */
export async function getFCMToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
}

/**
 * Delete FCM token
 */
export async function deleteFCMToken() {
  await messaging().deleteToken();
}
/**
 * Setup notification listeners
 * @param {Function} navigate - navigation function from App.js
 */
export function setupNotificationListeners(navigate) {
  // Foreground notifications
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification:', remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title || 'Notification',
      remoteMessage.notification?.body || '',
    );
  });

  // Background notifications
  const unsubscribeBackground = messaging().onNotificationOpenedApp(
    remoteMessage => {
      console.log('Notification opened from background:', remoteMessage);
      if (remoteMessage?.data?.screen) {
        navigate(remoteMessage.data.screen);
      }
    },
  );

  // Quit state notifications
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      console.log('Notification opened from quit state:', remoteMessage);
      // console.log('name : ', remoteMessage?.data?.screen);

      if (remoteMessage?.data?.screen) {
        setTimeout(() => {
          navigate(remoteMessage.data.screen);
        }, 800);
      }
    });

  return () => {
    unsubscribeForeground();
    unsubscribeBackground();
  };
}
