import React, { useEffect, useState, useRef } from 'react';
import { useColorScheme } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';

import i18n from './src/utils/language/i18n';
import StackNavigation from './src/navigation/StackNavigation';
import NoInternetScreen from './src/screen/user/NoInternetScreen';
import { LanguageProvider } from './src/utils/language/LanguageContext';
import { updateFcmToken } from './src/utils/apiHelper/Axios';
import { getUserData } from './src/utils/async/storage';

// ✅ Global navigation reference
export const navigationRef = React.createRef();

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

async function getFCMToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
}

const App = () => {
  const scheme = useColorScheme();
  const [isConnected, setIsConnected] = useState(true);
  const [fcmReady, setFcmReady] = useState(false);
  const [notificationScreen, setNotificationScreen] = useState(null);

  // 🔹 Internet status listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });
    return unsubscribe;
  }, []);

  // 🔹 FCM setup
  useEffect(() => {
    const initFCM = async () => {
      const auth = await requestUserPermission();
      if (!auth) return;

      const token = await getFCMToken();
      const userData = await getUserData();
      if (token && userData?.user?.id) await updateFcmToken(token);

      // ✅ Foreground notification
      messaging().onMessage(async remoteMessage => {
        console.log('Foreground notification:', remoteMessage.data);
        alert(remoteMessage.notification?.title || 'Notification');
      });

      // ✅ Background tap
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Background notification opened:', remoteMessage.data);
        if (remoteMessage?.data?.screen && navigationRef.current) {
          navigationRef.current.navigate(
            remoteMessage.data.screen,
            remoteMessage.data,
          );
        }
      });

      // ✅ Quit (killed) state
      const initialMessage = await messaging().getInitialNotification();
      if (initialMessage?.data?.screen) {
        console.log(
          'Notification opened from quit state:',
          initialMessage.data,
        );
        setNotificationScreen({
          screen: initialMessage.data.screen,
          transaction_id: initialMessage.data.transaction_id,
        });
      }

      // 🔹 Token refresh
      messaging().onTokenRefresh(async newToken => {
        if (userData?.user?.id) await updateFcmToken(newToken);
      });

      setFcmReady(true);
    };

    initFCM();
  }, []);

  if (!isConnected) return <NoInternetScreen onRetry={() => NetInfo.fetch()} />;
  if (!fcmReady) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <NavigationContainer
          ref={navigationRef}
          theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <StackNavigation notificationScreen={notificationScreen} />
        </NavigationContainer>
      </LanguageProvider>
    </I18nextProvider>
  );
};

export default App;
