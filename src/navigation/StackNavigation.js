import { StyleSheet, StatusBar } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MobileNumberEntry from '../screen/auth/MobileNumberEntry';
import OtpVerification from '../screen/auth/OtpVerification';
import BankLinkScreen from '../screen/bankLinking/BankLinkScreen';
import AadhaarVerification from '../screen/bankLinking/AadhaarVerification';
import { Colors } from '../themes/Colors';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Stack.Screen name="MobileNumberEntry" component={MobileNumberEntry} />
        <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen name="BankLinkScreen" component={BankLinkScreen} />
        <Stack.Screen
          name="AadhaarVerification"
          component={AadhaarVerification}
        />
      </Stack.Navigator>
    </>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
