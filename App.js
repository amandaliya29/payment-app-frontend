import React, { useEffect, useState } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import { useColorScheme } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import i18n from './src/utils/language/i18n';
import StackNavigation from './src/navigation/StackNavigation';
import NoInternetScreen from './src/screen/user/NoInternetScreen';
import { LanguageProvider } from './src/utils/language/LanguageContext';

const App = () => {
  const scheme = useColorScheme();
  const [isConnected, setIsConnected] = useState(true);

  // Monitor internet connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });
    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return <NoInternetScreen onRetry={() => NetInfo.fetch()} />;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <NavigationContainer
          theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <StackNavigation />
        </NavigationContainer>
      </LanguageProvider>
    </I18nextProvider>
  );
};

export default App;
