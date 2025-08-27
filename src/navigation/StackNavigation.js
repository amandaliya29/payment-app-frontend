import { StyleSheet, StatusBar } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MobileNumberEntry from '../screen/auth/MobileNumberEntry';
import OtpVerification from '../screen/auth/OtpVerification';
import BankLinkScreen from '../screen/bankLinking/BankLinkScreen';
import AadhaarVerification from '../screen/bankLinking/AadhaarVerification';
import AadhaarOTPVerification from '../screen/bankLinking/AadhaarOTPVerification';
import PanVerification from '../screen/bankLinking/PanVerification';
import VideoKYCVerification from '../screen/bankLinking/VideoKYCVerification';
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
        <Stack.Screen
          name="AadhaarOTPVerification"
          component={AadhaarOTPVerification}
        />
        <Stack.Screen name="PanVerification" component={PanVerification} />
        <Stack.Screen
          name="VideoKYCVerification"
          component={VideoKYCVerification}
        />
      </Stack.Navigator>
    </>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
