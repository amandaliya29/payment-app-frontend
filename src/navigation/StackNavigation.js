import { StyleSheet, StatusBar } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native'; // 👈 get theme from NavigationContainer
import MobileNumberEntry from '../screen/auth/MobileNumberEntry';
import OtpVerification from '../screen/auth/OtpVerification';
import BankLinkScreen from '../screen/bankLinking/BankLinkScreen';
import AadhaarVerification from '../screen/bankLinking/AadhaarVerification';
import AadhaarOTPVerification from '../screen/bankLinking/AadhaarOTPVerification';
import PanVerification from '../screen/bankLinking/PanVerification';
import VideoKYCVerification from '../screen/bankLinking/VideoKYCVerification';
import UPIPinSetup from '../screen/bankLinking/UPIPinSetup';
import FaceIDVerification from '../screen/bankLinking/FaceIDVerification';
import SetPinPage from '../screen/bankLinking/SetPinPage';
import HomePage from '../screen/user/HomePage';
import CreditUPIPage from '../screen/user/CreditUPIPage';
import CreditUPISetup from '../screen/user/CreditUPISetup';
import CreditOTPVerification from '../screen/user/CreditOTPVerification';
import CreditUPIStatusScreen from '../screen/user/CreditUPIStatusScreen';
import CreditUPILoadingScreen from '../screen/user/CreditUPILoadingScreen';
import CreditSetPinPage from '../screen/user/CreditSetPinPage';
import CreditUpiBankDetail from '../screen/user/CreditUpiBankDetail';
import HbfcCraditUpi from '../screen/hbfcCraditUpi/HbfcCraditUpi';
import CreditUPITerms from '../screen/hbfcCraditUpi/CreditUPITerms';
import MobileHbfc from '../screen/hbfcCraditUpi/MobileHbfc';
import HbfCreditUpiVerification from '../screen/hbfcCraditUpi/HbfCreditUpiVerification';
import { Colors } from '../themes/Colors';
import SplashScreen from '../screen/auth/SplashScreen';

const Stack = createStackNavigator();

const StackNavigation = () => {
  const { colors, dark } = useTheme(); // 👈 detect current theme

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={dark ? 'light-content' : 'dark-content'} // 👈 change automatically
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: dark ? Colors.white : colors.background,
          }, // 👈 use theme bg
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
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
        <Stack.Screen
          name="FaceIDVerification"
          component={FaceIDVerification}
        />
        <Stack.Screen name="UPIPinSetup" component={UPIPinSetup} />
        <Stack.Screen name="SetPinPage" component={SetPinPage} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="CreditUPIPage" component={CreditUPIPage} />
        <Stack.Screen name="CreditUPISetup" component={CreditUPISetup} />
        <Stack.Screen
          name="CreditUPIStatusScreen"
          component={CreditUPIStatusScreen}
        />
        <Stack.Screen
          name="CreditOTPVerification"
          component={CreditOTPVerification}
        />
        <Stack.Screen
          name="CreditUPILoadingScreen"
          component={CreditUPILoadingScreen}
        />
        <Stack.Screen name="CreditSetPinPage" component={CreditSetPinPage} />
        <Stack.Screen
          name="CreditUpiBankDetail"
          component={CreditUpiBankDetail}
        />
        <Stack.Screen name="HbfcCraditUpi" component={HbfcCraditUpi} />
        <Stack.Screen name="CreditUPITerms" component={CreditUPITerms} />
        {/* <Stack.Screen name="MobileHbfc" component={MobileHbfc} />
        <Stack.Screen
          name="HbfCreditUpiVerification"
          component={HbfCreditUpiVerification}
        /> */}
      </Stack.Navigator>
    </>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
