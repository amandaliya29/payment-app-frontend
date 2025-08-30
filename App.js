import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import { useColorScheme } from 'react-native';
import i18n from './src/utils/language/i18n';
import StackNavigation from './src/navigation/StackNavigation';

const App = () => {
  const scheme = useColorScheme();

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* {console.log(scheme)} */}
        <StackNavigation />
      </NavigationContainer>
    </I18nextProvider>
  );
};

export default App;
