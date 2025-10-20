import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import i18n from './src/utils/language/i18n';
import StackNavigation from './src/navigation/StackNavigation';
import NoInternetScreen from './src/screen/user/NoInternetScreen';
import { LanguageProvider } from './src/utils/language/LanguageContext';
import {
  requestUserPermission,
  getFCMToken,
  setupNotificationListeners,
} from './src/utils/notificationService';
import messaging from '@react-native-firebase/messaging';
import { updateFcmToken } from './src/utils/apiHelper/Axios';

const App = () => {
  const scheme = useColorScheme();
  const [isConnected, setIsConnected] = useState(true);
  const [uid, setUid] = useState(null);
  const [initialScreen, setInitialScreen] = useState(null);
  const navigationRef = useRef();

  // ✅ Navigate callback defined outside of conditions
  const navigate = useCallback(screenName => {
    if (navigationRef.current && screenName) {
      console.log('Navigating to screen:', screenName);
      navigationRef.current.navigate(screenName);
    } else {
      console.log('Navigation not ready, storing screen:', screenName);
      setInitialScreen(screenName);
    }
  }, []);

  // Internet connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });
    return () => unsubscribe();
  }, []);

  // Firebase notifications
  useEffect(() => {
    requestUserPermission();
    getFCMToken();

    // Setup notification listeners only once
    const unsubscribeNotifications = setupNotificationListeners(navigate);

    // Quit state notifications
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.screen) {
          console.log(
            'Notification from quit state:',
            remoteMessage.data.screen,
          );
          setInitialScreen(remoteMessage.data.screen);
        }
      });

    // Token refresh listener
    const refreshUnsubscribe = messaging().onTokenRefresh(async newToken => {
      if (uid) {
        await updateFcmToken(newToken);
      }
    });

    return () => {
      unsubscribeNotifications();
      refreshUnsubscribe();
    };
  }, [uid, navigate]);

  // Navigate after NavigationContainer is ready
  const onReady = useCallback(() => {
    if (initialScreen) {
      console.log('Navigating to initial screen:', initialScreen);
      navigationRef.current?.navigate(initialScreen);
      setInitialScreen(null);
    }
  }, [initialScreen]);

  if (!isConnected) {
    return <NoInternetScreen onRetry={() => NetInfo.fetch()} />;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <NavigationContainer
          ref={navigationRef}
          onReady={onReady}
          theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <StackNavigation setUid={setUid} />
        </NavigationContainer>
      </LanguageProvider>
    </I18nextProvider>
  );
};

export default App;
