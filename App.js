import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/utils/language/i18n';
import StackNavigation from './src/navigation/StackNavigation';

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </I18nextProvider>
  );
};

export default App;
