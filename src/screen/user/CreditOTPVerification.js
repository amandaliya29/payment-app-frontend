import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import I18n from '../../utils/language/i18n';
import OTPInput from '../../component/OTPInput';
import { useNavigation } from '@react-navigation/native';
import Button from '../../component/Button';

const CreditOTPVerification = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(45);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Theme colors
  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.white : Colors.darkGrey,
    secondaryBg: isDark ? Colors.secondaryBg : Colors.cardGrey,
    divider: isDark ? Colors.darkGrey : Colors.grey,
    primary: Colors.primary,
  };

  // Timer logic
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = useCallback(() => {
    setTimer(45);
    // Call your resend API here
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('otp_verification')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon Section */}
        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: themeColors.primary },
            ]}
          >
            <Image
              source={require('../../assets/image/homeIcon/card.png')}
              style={styles.iconImage}
            />
          </View>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {I18n.t('activate_credit_upi')}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.subText }]}>
            {I18n.t('otp_instruction')}
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <OTPInput code={otp} setCode={setOtp} length={6} />
        </View>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: themeColors.subText }]}>
            {I18n.t('didnt_receive')}
          </Text>
          {timer > 0 ? (
            <Text style={[styles.resendTime, { color: themeColors.primary }]}>
              {I18n.t('resend_in')} {timer}s
            </Text>
          ) : (
            <Text
              style={[styles.resendNow, { color: themeColors.primary }]}
              onPress={handleResend}
            >
              {I18n.t('resend_now')}
            </Text>
          )}
        </View>

        {/* Verify Button */}
        <Button
          title={I18n.t('verify_activate')}
          disabled={otp.length !== 6}
          onPress={() => navigation.navigate('CreditUPILoadingScreen')}
        />

        {/* Push Terms & Conditions to bottom */}
        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomText, { color: themeColors.subText }]}>
            {I18n.t('terms_condition')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreditOTPVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scaleUtils.scaleWidth(16),
    paddingBottom: scaleUtils.scaleHeight(20),
  },
  content: {
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(30),
  },
  iconContainer: {
    borderRadius: scaleUtils.scaleWidth(50),
    padding: scaleUtils.scaleWidth(20),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  iconImage: {
    width: scaleUtils.scaleWidth(28),
    height: scaleUtils.scaleWidth(28),
    tintColor: Colors.white,
  },
  title: {
    fontSize: scaleUtils.scaleFont(20),
    fontFamily: 'Poppins-SemiBold',
    marginTop: scaleUtils.scaleHeight(10),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
    marginBottom: scaleUtils.scaleHeight(20),
    paddingHorizontal: scaleUtils.scaleWidth(20),
  },
  otpContainer: {
    alignSelf: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(30),
    columnGap: scaleUtils.scaleWidth(8),
  },
  resendText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  resendTime: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-SemiBold',
  },
  resendNow: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-SemiBold',
    textDecorationLine: 'underline',
  },
  bottomContainer: {
    marginTop: 'auto', // pushes to bottom
    alignItems: 'center',
  },
  bottomText: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
  },
});
